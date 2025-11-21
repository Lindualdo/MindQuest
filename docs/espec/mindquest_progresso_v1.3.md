# MindQuest Progresso v1.3 - Regras de Funcionamento

## Visão Geral: 3 Tabelas, 3 Responsabilidades

### 1. `usuarios_quest` → **PLANEJADO**
- Campo `recorrencias`: agenda de tarefas/missões (não muda nunca)
- Define o que deve ser feito e quando

### 2. `conquistas_historico` → **REALIZADO**
- Registro incremental por conclusão
- Relacionamento 1:1 via `meta_codigo = usuarios_quest.id`
- Campo `detalhes->'ocorrencias'`: histórico de conclusões

### 3. `usuarios_conquistas` → **PONTOS CONSOLIDADOS**
- `xp_base`: soma de pontos base
- `xp_bonus`: soma de pontos bônus
- `xp_total`: base + bônus (para cálculo de nível)

**Resumo:** Planejado vs Realizado vs Consolidado. Simples assim.

---

## 1. Planejamento: `usuarios_quest.recorrencias`

### Regra
O campo `recorrencias` em `usuarios_quest` **NÃO muda nunca**. É um snapshot do momento da criação da quest que define apenas o **planejamento** (quais dias existem e qual XP previsto).

**IMPORTANTE:** `recorrencias` **NÃO armazena histórico de conclusões**. Todo histórico fica em `conquistas_historico.detalhes->ocorrencias[]`.

### Estrutura
```json
{
  "tipo": "diaria" | "semanal" | "unica",
  "janela": {
    "inicio": "2025-11-16",
    "fim": "2025-11-22"
  },
  "dias": [
    {
      "data": "2025-11-16",
      "xp_previsto": 30
    }
  ]
}
```

### Quando criar
- **Quest única:** `recorrencias` contém apenas 1 dia.
- **Quest recorrente:** `recorrencias` contém todos os dias previstos entre `janela.inicio` e `janela.fim`.
- **Sempre:** O período em `recorrencias` deve corresponder exatamente aos campos `janela_inicio` e `janela_fim` da tabela `usuarios_quest`.

### O que NÃO muda
- **NUNCA** alterar `recorrencias` após a criação.
- **NUNCA** adicionar `status` ou `concluido_em` em `recorrencias->dias[]`.
- **Apenas** `data` e `xp_previsto` são armazenados (planejamento puro).

### Consultas
- **Para saber quais dias existem (planejados):** Consultar `usuarios_quest.recorrencias->dias[]`
- **Para saber quais dias foram concluídos (realizados):** Consultar `conquistas_historico.detalhes->ocorrencias[]` onde `data_concluida` existe
- **Relacionamento:** `usuarios_quest.id` = `conquistas_historico.meta_codigo` AND `tipo = 'quest'`

### Importante
- **NÃO consultar `recorrencias` para status de conclusão.**
- **SEMPRE consultar `conquistas_historico.detalhes->ocorrencias[]` para saber o que foi realizado.**
- `recorrencias` é sempre uma foto do planejamento (não muda nunca).

---

## 2. Registro de Conclusões: `conquistas_historico`

### Regra
**Um registro por quest_id** em `conquistas_historico`. Cada conclusão **incrementa** o registro existente.

### Relacionamento 1:1
- `usuarios_quest.id` = `conquistas_historico.meta_codigo` AND `tipo = 'quest'`
- Sempre 1 pra 1
- **IMPORTANTE:** `conquistas_historico.detalhes->ocorrencias[]` é a ÚNICA fonte de verdade para status de conclusão.

### Campo `meta_titulo`

**Para Quests:**
- Guardar `usuarios_quest.config->>'titulo'` no momento da primeira conclusão
- Snapshot histórico (não atualizar se o título da quest mudar)

**Para Conversas:**
- `meta_codigo = 'conversa_diaria'` → `meta_titulo = 'Conversa diária'`
- Título fixo/descritivo

### Estrutura do `detalhes`
```json
{
  "recorrencia": "diaria" | "semanal" | "unica",
  "data_conclusao": "2025-11-20",
  "total_concluidas": 3,
  "ocorrencias": [
    {
      "data_planejada": "2025-11-19",
      "data_concluida": "2025-11-19",
      "data_registrada": "2025-11-20T14:30:00.000Z",
      "xp_base": 30,
      "xp_bonus": 6
    },
    {
      "data_planejada": "2025-11-20",
      "data_concluida": "2025-11-20",
      "data_registrada": "2025-11-20T15:45:00.000Z",
      "xp_base": 30,
      "xp_bonus": 6
    }
  ]
}
```

### Descrição dos Campos de Data

**`data_planejada`:**
- Data que estava prevista em `usuarios_quest.recorrencias->dias[].data`
- Apenas para auditoria/comparação
- Se tudo estiver correto, será igual a `data_concluida`

**`data_concluida`:**
- Data da barra clicada (`data_referencia`)
- Data em que a quest foi marcada como concluída
- Usado para cálculos de progresso semanal

**`data_registrada`:**
- Timestamp de quando foi registrado no sistema (`NOW()`)
- Formato ISO 8601 com timezone (ex: `2025-11-20T14:30:00.000Z`)
- Para auditoria e rastreabilidade

### Quando concluir uma quest

1. **Buscar `data_planejada`:**
   - Consultar `usuarios_quest.recorrencias->dias[]` para encontrar o dia correspondente à `data_referencia`.
   - Usar `recorrencias->dias[].data` como `data_planejada`.

2. **Buscar/Ajustar registro em `conquistas_historico`:**
   - Se existe registro com `meta_codigo = usuarios_quest.id` e `tipo = 'quest'`: **INCREMENTAR**.
   - Se não existe: **CRIAR** novo registro (com `meta_codigo = usuarios_quest.id`).

3. **Incrementar `conquistas_historico`:**
   - Adicionar nova ocorrência no array `detalhes->'ocorrencias'` com:
     - `data_planejada`: Data de `usuarios_quest.recorrencias->dias[].data`
     - `data_concluida`: Data da barra (`data_referencia`)
     - `data_registrada`: Timestamp atual (`NOW()`)
     - `xp_base` e `xp_bonus`
   - Incrementar `detalhes->>'total_concluidas'`.
   - Atualizar `detalhes->>'data_conclusao'` para a `data_concluida` da última conclusão.
   - Somar `xp_base` e `xp_bonus` aos valores existentes.

4. **Campos obrigatórios:**
   - `meta_codigo`: ID da quest (`usuarios_quest.id`)
   - `tipo`: `'quest'`
   - `meta_titulo`: Título da quest (`usuarios_quest.config->>'titulo'`)
   - `detalhes->>'data_conclusao'`: Data da última conclusão (YYYY-MM-DD)

5. **Importante:**
   - **NÃO atualizar** `usuarios_quest.recorrencias` ao concluir.
   - `recorrencias` permanece como planejamento (não muda nunca).
   - Todo histórico de conclusões fica apenas em `conquistas_historico.detalhes->ocorrencias[]`.

### Nota
- O relacionamento é feito via `meta_codigo`. **NÃO** incluir `quest_id` no campo `detalhes`.
- O `meta_titulo` é um snapshot histórico, não deve ser atualizado após a criação do registro.

---

## 3. Quest Única

### Regra
Quest única segue o mesmo formato de `recorrencias`:

```json
{
  "tipo": "unica",
  "janela": {
    "inicio": "2025-11-20",
    "fim": "2025-11-20"
  },
  "dias": [
    {
      "data": "2025-11-20",
      "xp_previsto": 30
    }
  ]
}
```

**Vantagem:** Usa a mesma regra sempre, independente do tipo de recorrência. Sem `status` ou `concluido_em` - apenas planejamento.

---

## 4. Atualização de Pontuação: `usuarios_conquistas`

### Regra
Sempre que uma quest for concluída, atualizar `usuarios_conquistas`:

### Campos a atualizar
- `xp_total`: Incrementar com `xp_base + xp_bonus`
- `xp_base`: Incrementar apenas com `xp_base`
- `xp_bonus`: Incrementar apenas com `xp_bonus`
- `total_quests_concluidas`: Incrementar +1
- `atualizado_em`: `NOW()`

### Importante
- **Separar** `xp_base` e `xp_bonus` nas colunas correspondentes.
- **Somados** em `xp_total` para cálculo de nível da jornada.

---

## 5. Fluxo Completo de Conclusão

```
1. Usuário conclui quest
   ↓
2. Buscar data_planejada de usuarios_quest.recorrencias->dias[] 
   correspondente à data_referencia
   ↓
3. Buscar/Ajustar conquistas_historico:
   - Se existe registro com meta_codigo = usuarios_quest.id: INCREMENTAR
   - Se não existe: CRIAR novo (com meta_codigo = usuarios_quest.id)
   ↓
4. Atualizar conquistas_historico:
   - Adicionar ocorrência em detalhes->'ocorrencias' com:
     * data_planejada (de recorrencias->dias[].data)
     * data_concluida (data_referencia do frontend)
     * data_registrada (NOW())
     * xp_base e xp_bonus
   - Atualizar detalhes->>'total_concluidas'
   - Atualizar detalhes->>'data_conclusao' = data_concluida
   - Somar xp_base e xp_bonus
   ↓
5. Atualizar usuarios_conquistas:
   - xp_total += (xp_base + xp_bonus)
   - xp_base += xp_base
   - xp_bonus += xp_bonus
   - total_quests_concluidas += 1
```

**Importante:**
- **NÃO atualizar** `usuarios_quest.recorrencias` ao concluir.
- **Apenas** registrar em `conquistas_historico.detalhes->ocorrencias[]`.
- Para saber se um dia está concluído, consultar `conquistas_historico.detalhes->ocorrencias[]` onde `data_concluida = data`.

---

## 6. Casos Especiais: Conversas

### Regra
**Um único registro por usuário** para conversas diárias.

### Estrutura
- `meta_codigo`: `'conversa_diaria'`
- `meta_titulo`: `'Conversa diária'` (fixo)
- `tipo`: `'conversa'`
- `detalhes->'ocorrencias'`: Array com todas as conversas realizadas
- `detalhes->>'recorrencia_total'`: Total de conversas registradas

### Estrutura do `detalhes` para Conversas
```json
{
  "recorrencia_total": 30,
  "ocorrencias": [
    {
      "dia": "2025-11-16",
      "conversa_id": "uuid-da-conversa",
      "data_conversa": "2025-11-16"
    }
  ]
}
```

---

## 7. Consultas para Progresso Semanal

### Meta (Planejado)
```sql
-- Fonte: usuarios_quest.recorrencias->dias[]
SELECT
  (dia_elem->>'data')::date AS data,
  SUM((dia_elem->>'xp_previsto')::int) AS meta_quests
FROM usuarios_quest uq
CROSS JOIN LATERAL jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
WHERE (dia_elem->>'data')::date BETWEEN semana_inicio AND semana_fim
GROUP BY (dia_elem->>'data')::date
```

### Concluídas (Realizado)
```sql
-- Fonte: conquistas_historico.detalhes->'ocorrencias'
-- Usar data_concluida para calcular progresso
SELECT
  (occ->>'data_concluida')::date AS data,
  SUM((occ->>'xp_base')::int) AS xp_base,
  SUM((occ->>'xp_bonus')::int) AS xp_bonus
FROM conquistas_historico ch
CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
WHERE ch.tipo = 'quest'
  AND (occ->>'data_concluida')::date BETWEEN semana_inicio AND semana_fim
GROUP BY (occ->>'data_concluida')::date
```

---

## 8. Regras de Bônus

### Cálculo de Progresso (Barras)
- **Meta:** Usa apenas `xp_previsto` (sem bônus)
- **Concluídas:** Usa apenas `xp_base` (sem bônus)

### Cálculo de Nível
- **Total XP:** `xp_base + xp_bonus` (soma completa)

**Resumo:** Bônus não conta para meta/progresso, apenas para nível da jornada.

