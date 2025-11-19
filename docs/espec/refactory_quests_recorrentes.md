# Refactory: Quests Recorrentes com Campo `recorrencias`

## Problema Atual

- Campo `status` mistura estado com histórico
- Reset de quests diárias causando confusão (resetar no mesmo dia vs próximo dia)
- Queries complexas para verificar se quest foi feita hoje
- Necessidade de job diário para resetar quests

## Solução Proposta

Adicionar campo `recorrencias` (JSONB) em `usuarios_quest` para mapear agenda completa com status por dia.

---

## 1. Estrutura do Campo `recorrencias`

```json
{
  "tipo": "diaria",
  "janela": {
    "inicio": "2025-11-19",
    "fim": "2025-11-25"
  },
  "dias": [
    {
      "data": "2025-11-19",
      "status": "concluida",
      "xp_previsto": 30,
      "concluido_em": "2025-11-19T21:35:43"
    },
    {
      "data": "2025-11-20",
      "status": "pendente",
      "xp_previsto": 30
    }
  ]
}
```

**Regras:**
- Campo é `NULL` para quests não-recorrentes
- Array `dias[]` contém TODOS os dias da janela
- Status individual por dia: `'pendente'` ou `'concluida'`
- `xp_previsto` = meta de XP para aquele dia (geralmente 30)

---

## 2. Migration SQL

```sql
-- Adicionar coluna
ALTER TABLE usuarios_quest 
ADD COLUMN recorrencias JSONB DEFAULT NULL;

-- Index para queries rápidas
CREATE INDEX idx_usuarios_quest_recorrencias 
ON usuarios_quest USING gin(recorrencias);

-- Comentário
COMMENT ON COLUMN usuarios_quest.recorrencias IS 
'Agenda de recorrências com status por dia. NULL para quests não-recorrentes.';
```

---

## 3. Workflows a Atualizar

### A) `sw_criar_quest` - Criação de Quest

**Quando:** Ao inserir quest com `config.recorrencia = 'diaria'`

**Ação:** Popular campo `recorrencias` com array de dias

```sql
-- Exemplo de INSERT/UPDATE
UPDATE usuarios_quest
SET recorrencias = jsonb_build_object(
  'tipo', 'diaria',
  'janela', jsonb_build_object(
    'inicio', janela_inicio::text,
    'fim', janela_fim::text
  ),
  'dias', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'data', dia::text,
        'status', 'pendente',
        'xp_previsto', 30
      ) ORDER BY dia
    )
    FROM generate_series(janela_inicio, janela_fim, '1 day') AS dia
  )
)
WHERE id = $1 AND config->>'recorrencia' = 'diaria';
```

---

### B) `webhook_concluir_quest` - Conclusão

**Quando:** Usuário conclui quest

**Ação:** Atualizar status do dia específico no JSON

**Novo nó:** "Atualizar Recorrencias" (entre "Calcular XP Quest" e "Buscar Quest Final")

```sql
UPDATE usuarios_quest
SET 
  recorrencias = jsonb_set(
    recorrencias,
    '{dias}',
    (
      SELECT jsonb_agg(
        CASE 
          WHEN item->>'data' = $1::text  -- data_referencia
          THEN item || jsonb_build_object(
            'status', 'concluida',
            'concluido_em', NOW()::text
          )
          ELSE item
        END
        ORDER BY (item->>'data')
      )
      FROM jsonb_array_elements(recorrencias->'dias') AS item
    )
  ),
  concluido_em = NOW(),
  status = 'ativa'  -- Quests recorrentes sempre ativas
WHERE id = $2
  AND recorrencias IS NOT NULL;
```

---

### C) `webhook_quests` - Listagem

**Quando:** Frontend busca quests disponíveis

**Ação:** Filtrar por status no `recorrencias.dias[]`

```sql
-- Query: Quests disponíveis (pendentes ou concluídas)
SELECT 
  uq.*,
  (
    SELECT dia->>'status'
    FROM jsonb_array_elements(uq.recorrencias->'dias') AS dia
    WHERE dia->>'data' = CURRENT_DATE::text
    LIMIT 1
  ) AS status_hoje
FROM usuarios_quest uq
WHERE uq.usuario_id = $1
  AND uq.status IN ('ativa', 'pendente')
  AND (
    -- Não-recorrente
    uq.recorrencias IS NULL
    OR
    -- Recorrente dentro da janela
    CURRENT_DATE::text BETWEEN 
      uq.recorrencias->'janela'->>'inicio' AND 
      uq.recorrencias->'janela'->>'fim'
  )
ORDER BY uq.status, uq.atualizado_em DESC;
```

---

### D) `webhook_progresso_semanal` - Meta Semanal

**Quando:** Frontend busca progresso da semana

**Ação:** Somar `xp_previsto` dos dias no período

```sql
-- Query simplificada: Meta de quests por dia
SELECT 
  dia->>'data' AS data,
  SUM((dia->>'xp_previsto')::int) AS meta_quests_dia,
  COUNT(*) AS quests_disponiveis
FROM usuarios_quest,
     jsonb_array_elements(recorrencias->'dias') AS dia
WHERE usuario_id = $1
  AND recorrencias IS NOT NULL
  AND (dia->>'data')::date BETWEEN $2 AND $3  -- inicio_semana, fim_semana
GROUP BY dia->>'data'
ORDER BY dia->>'data';
```

---

## 4. Relacionamento com `conquistas_historico`

**Separação clara de responsabilidades:**

| Tabela | Função | Uso |
|--------|--------|-----|
| `usuarios_quest.recorrencias` | **AGENDA** (o que fazer e quando) | Queries de disponibilidade, meta prevista |
| `conquistas_historico.detalhes` | **HISTÓRICO** (o que foi feito e XP ganho) | Queries de XP real, totalizações |

**Sincronização:**
- Ao concluir quest: atualiza AMBOS
- Painel usa `recorrencias` (rápido, direto)
- Cálculos de XP usam `conquistas_historico` (fonte de verdade)

---

## 5. Backfill - Popular Quests Existentes

```sql
-- Popular recorrencias para quests existentes
UPDATE usuarios_quest
SET recorrencias = jsonb_build_object(
  'tipo', config->>'recorrencia',
  'janela', jsonb_build_object(
    'inicio', janela_inicio::text,
    'fim', janela_fim::text
  ),
  'dias', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'data', dia::text,
        'status', CASE 
          WHEN dia::date <= concluido_em::date THEN 'concluida'
          ELSE 'pendente'
        END,
        'xp_previsto', 30,
        'concluido_em', CASE 
          WHEN dia::date = concluido_em::date THEN concluido_em::text
          ELSE NULL
        END
      ) ORDER BY dia
    )
    FROM generate_series(janela_inicio, janela_fim, '1 day') AS dia
  )
)
WHERE config->>'recorrencia' = 'diaria'
  AND recorrencias IS NULL
  AND janela_inicio IS NOT NULL
  AND janela_fim IS NOT NULL;
```

---

## 6. Vantagens da Solução

✅ **Zero ambiguidade:** Status por dia é explícito  
✅ **Queries simples:** Sem JOINs complexos ou lógica de datas  
✅ **Conclusão retroativa:** Marca qualquer dia como concluído  
✅ **Meta transparente:** Soma direto do JSON  
✅ **Zero jobs:** Não precisa cron/scheduler  
✅ **Performance:** Index GIN torna queries rápidas  
✅ **Manutenível:** Lógica clara e centralizada  

---

## 7. Ordem de Implementação

1. ✅ Rodar migration (adicionar coluna + index)
2. ✅ Atualizar `sw_criar_quest` (popular ao criar)
3. ✅ Atualizar `webhook_concluir_quest` (atualizar status do dia)
4. ✅ Atualizar `webhook_quests` (filtrar por status do dia)
5. ✅ Atualizar `webhook_progresso_semanal` (calcular meta do JSON)
6. ✅ Rodar backfill (popular quests existentes)
7. ✅ Testar fluxo completo

---

## 8. Testes Necessários

- [ ] Criar quest diária → `recorrencias` populado
- [ ] Concluir quest hoje → status do dia atualizado
- [ ] Concluir quest de dia anterior → status correto do dia passado
- [ ] Listar quests pendentes → só mostra se dia atual é pendente
- [ ] Listar quests concluídas → só mostra se dia atual é concluído
- [ ] Meta semanal → soma correta de xp_previsto
- [ ] Quest não-recorrente → `recorrencias` NULL, funciona normal

---

## Notas Finais

- Campo `status` em `usuarios_quest`: quests recorrentes sempre `'ativa'`
- Campo `concluido_em`: mantém timestamp da última conclusão (cache)
- Frontend decide exibição baseado em `recorrencias.dias[].status`
- Webhooks focam em performance usando o JSON diretamente

