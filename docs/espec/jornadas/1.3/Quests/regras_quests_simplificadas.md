# Regras Simplificadas: Quests e Progresso Semanal

## Princípio Geral

**Separação clara entre PLANEJAMENTO e EXECUÇÃO:**

1. **PLANEJAMENTO** (`usuarios_quest.recorrencias`): Datas previstas de conclusão (não muda)
2. **EXECUÇÃO** (`conquistas_historico.detalhes`): Data real de conclusão (apenas isso importa para barras)

---

## 1. Estrutura de Dados

### `usuarios_quest.recorrencias` (PLANEJAMENTO)
```json
{
  "tipo": "diaria",
  "janela": {
    "inicio": "2025-11-16",
    "fim": "2025-11-22"
  },
  "dias": [
    {
      "data": "2025-11-16",      // Data prevista (NÃO muda)
      "status": "pendente",
      "xp_previsto": 30,          // XP planejado para este dia
      "concluido_em": null
    },
    ...
  ]
}
```

**Regra:** Este campo contém apenas as **datas previstas** de conclusão. As datas aqui **NÃO mudam** após a conclusão.

### `conquistas_historico.detalhes` (EXECUÇÃO)
```json
{
  "quest_id": "uuid-da-quest",
  "recorrencia": "diaria",
  "data_conclusao": "2025-11-20"  // ⭐ Data real de conclusão (APENAS ISSO IMPORTA para barras)
}
```

**Regra:** Este campo guarda a **data de conclusão real**. É o que importa para as barras de progresso.

---

## 2. Fluxo de Conclusão

### Quando uma quest é concluída:

1. **`webhook_concluir_quest`** recebe:
   - `quest_id`
   - `usuario_id`
   - `data_referencia` (opcional, se não informado usa `CURRENT_DATE`)

2. **Atualiza `usuarios_quest.recorrencias`**:
   - Marca o dia correspondente como `status: 'concluida'`
   - Preenche `concluido_em` com a `data_referencia`

3. **Chama `sw_xp_quest`** que:
   - Insere em `conquistas_historico` com `detalhes->>'data_conclusao'` = `data_referencia`

---

## 3. Cálculo de Progresso Semanal

### **METAS** (Barras horizontais e verticais)

**Fonte:** `usuarios_quest.recorrencias->dias[]`

```sql
-- Meta diária de quests
SELECT
  (dia_elem->>'data')::date AS data,
  SUM((dia_elem->>'xp_previsto')::int) AS meta_quests
FROM usuarios_quest uq
CROSS JOIN LATERAL jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
WHERE (dia_elem->>'data')::date BETWEEN semana_inicio AND semana_fim
GROUP BY (dia_elem->>'data')::date
```

**Regra:** Soma `xp_previsto` de todos os dias previstos na semana (usando `recorrencias->dias[].data`).

### **CONCLUÍDAS** (Barras horizontais e verticais)

**Fonte:** `conquistas_historico.detalhes->>'data_conclusao'`

```sql
-- Quests concluídas por dia
SELECT
  (ch.detalhes->>'data_conclusao')::date AS data,
  SUM(ch.xp_base) AS xp_quests  -- ⚠️ SEM bônus
FROM conquistas_historico ch
WHERE ch.tipo = 'quest'
  AND ch.detalhes->>'data_conclusao' IS NOT NULL
  AND (ch.detalhes->>'data_conclusao')::date BETWEEN semana_inicio AND semana_fim
GROUP BY (ch.detalhes->>'data_conclusao')::date
```

**Regra:** Soma `xp_base` (sem bônus) usando a `data_conclusao` do `detalhes`.

---

## 4. Regra de Bônus

**Bônus NÃO conta para:**
- ❌ Meta de quests
- ❌ Cálculo de concluídas
- ❌ Barras de progresso

**Bônus conta APENAS para:**
- ✅ Mudança de níveis na jornada (`xp_total` para calcular `nivel_atual`)

---

## 5. Alterações Necessárias

### A. `sw_xp_quest` - Node "Aplicar Atualizacoes"

**ANTES:**
```sql
jsonb_build_object(
  'quest_id', upd.id,
  'recorrencia', upd.recorrencia,
  'registrado_em', upd.concluido_em  -- ❌ ERRADO
)
```

**DEPOIS:**
```sql
jsonb_build_object(
  'quest_id', upd.id,
  'recorrencia', upd.recorrencia,
  'data_conclusao', data_referencia  -- ✅ CORRETO
)
```

**Problema:** `sw_xp_quest` precisa receber `data_referencia` de `webhook_concluir_quest`.

**Solução:** Passar `data_referencia` via `atualizacoes_status` para `sw_xp_quest`.

### B. `webhook_progresso_semanal` - Node "Calcular Semana"

**ANTES:**
```sql
-- Usa registrado_em (ERRADO)
(ch.registrado_em AT TIME ZONE 'America/Sao_Paulo')::date AS data
```

**DEPOIS:**
```sql
-- Usa data_conclusao do detalhes (CORRETO)
(ch.detalhes->>'data_conclusao')::date AS data
```

---

## 6. Resumo Visual

```
┌─────────────────────────────────────────┐
│ PLANEJAMENTO                            │
│ usuarios_quest.recorrencias             │
│ - datas previstas (não muda)            │
│ - xp_previsto                           │
└─────────────────────────────────────────┘
                │
                │ Usado para: METAS
                │
                ▼
        ┌───────────────┐
        │   Barras de   │
        │   Progresso   │
        └───────────────┘
                ▲
                │
                │ Usado para: CONCLUÍDAS
                │
┌─────────────────────────────────────────┐
│ EXECUÇÃO                                │
│ conquistas_historico.detalhes           │
│ - data_conclusao (real)                 │
│ - xp_base (sem bônus)                   │
└─────────────────────────────────────────┘
```

---

## 7. Validação

Após implementar, validar:

1. ✅ Quest concluída em 20/11 aparece na barra de 20/11
2. ✅ Meta usa apenas `xp_previsto` de `recorrencias->dias[]`
3. ✅ Concluídas usa apenas `xp_base` (sem bônus) de `conquistas_historico`
4. ✅ Bônus não aparece nas barras, apenas no cálculo de níveis

