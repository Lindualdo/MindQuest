# Implementação: Quests de Sabotadores

**Data:** 2025-12-02  
**Status:** Pronto para implementação  
**Versão:** 1.0

---

## Contexto

Sabotadores são o **pilar central do MindQuest** — são eles que travam o progresso das pessoas. As quests de sabotadores existem especificamente para combatê-los.

**Problema atual:** O workflow `sw_criar_quest` busca apenas o sabotador mais ativo (histórico) e cria quest genérica do catálogo, ignorando o insight/contramedida contextualizado da conversa atual.

---

## Regras de Negócio

### 1. Foco: Top 3 Históricos + Sabotador Atual
- **Sempre monitorar** os **3 sabotadores mais ativos** do histórico do usuário
- **Sempre considerar** o sabotador detectado na **conversa atual** (maior intensidade)

### 2. Quantidade de Quests por Conversa
- **Regra padrão:** gerar **1 quest** para um dos top 3 históricos
- **Exceção:** se o sabotador atual (maior intensidade na conversa) for **diferente** dos top 3 → gerar **até 2 quests**
  - 1 quest para top 3 (histórico)
  - 1 quest para o atual (novo/emergente)

### 3. Não Duplicar
- Se o sabotador atual já estiver entre os top 3 → gerar apenas **1 quest** (não duplica)

---

## Fontes de Dados

### Tabela `usuarios_sabotadores`
- **Campos relevantes:**
  - `sabotador_id` — ID do sabotador
  - `chat_id` — ID da conversa (para identificar sabotador atual)
  - `intensidade_media` — intensidade na conversa
  - `insight_atual` — insight contextualizado da conversa
  - `contramedida_ativa` — contramedida contextualizada da conversa
  - `total_deteccoes` — quantidade de registros (para histórico)
  - `conversas_afetadas` — quantidade de conversas afetadas

### Cálculo do "Mais Ativo" (Histórico)
- **Score = frequência × intensidade média**
- Ordenar por: `total_deteccoes DESC, conversas_afetadas DESC, intensidade_media DESC`
- Ver doc: `sabotador_mais_ativo_regras.md`

---

## Mudanças Necessárias no Workflow `sw_criar_quest`

### 1. Query "Buscar Sabotadores Ativo"
**Atual:** Busca apenas 1 sabotador (mais ativo histórico)

**Mudança necessária:**
```sql
-- Buscar TOP 3 históricos + sabotador atual da conversa
WITH top3_historicos AS (
  SELECT sabotador_id, total_deteccoes, conversas_afetadas, intensidade_media
  FROM ... -- cálculo do score
  ORDER BY score DESC
  LIMIT 3
),
sabotador_atual AS (
  SELECT sabotador_id, intensidade_media, insight_atual, contramedida_ativa
  FROM usuarios_sabotadores
  WHERE chat_id = $chat_id
  ORDER BY intensidade_media DESC
  LIMIT 1
)
-- Retornar top 3 + atual (se diferente)
```

**Retornar:**
- `top3_historicos[]` — array com 3 sabotadores
- `sabotador_atual` — objeto com sabotador da conversa atual (incluir `insight_atual` e `contramedida_ativa`)

### 2. Lógica de Decisão (Node "Preparar Quest do Catálogo")
**Adicionar:**
```javascript
// Verificar se sabotador atual está no top 3
const sabotadorAtualId = entrada.sabotador_atual?.sabotador_id;
const top3Ids = entrada.top3_historicos?.map(s => s.sabotador_id) || [];
const isAtualNoTop3 = sabotadorAtualId && top3Ids.includes(sabotadorAtualId);

// Decidir quantas quests criar
const criarQuestAtual = !isAtualNoTop3 && entrada.sabotador_atual;
const criarQuestHistorico = true; // sempre criar pelo menos 1

// Preparar contexto para agente
return [{
  json: {
    // ... campos existentes
    sabotador_atual: entrada.sabotador_atual, // NOVO: incluir insight/contramedida
    top3_historicos: entrada.top3_historicos, // NOVO: array com 3
    criar_quest_atual: criarQuestAtual, // NOVO: flag
    criar_quest_historico: criarQuestHistorico // NOVO: flag
  }
}];
```

### 3. Prompt do Agente "Agente Quests"
**Mudança no system message:**

**ANTES:** "Sempre gerar 1 quest de sabotador usando catálogo"

**DEPOIS:**
```
=== REGRAS DE QUESTS DE SABOTADOR ===

1. **Prioridade:** Usar SEMPRE insight/contramedida da conversa atual (usuarios_sabotadores)
   - Se sabotador_atual existe → usar insight_atual e contramedida_ativa
   - NÃO usar catálogo genérico se houver insight contextualizado

2. **Quantidade:**
   - Se criar_quest_atual = true → gerar 2 quests (atual + histórico)
   - Se criar_quest_atual = false → gerar 1 quest (histórico)

3. **Fonte:**
   - Quest atual: usar insight/contramedida de sabotador_atual
   - Quest histórico: escolher 1 dos top3_historicos (priorizar o mais ativo)
```

### 4. Node "Aplicar Limites & Dedupe"
**Ajustar validação:**
- Aceitar até 2 quests de sabotador (se `criar_quest_atual = true`)
- Garantir que não duplica mesmo sabotador

---

## Estrutura de Dados Esperada

### Entrada do Agente
```json
{
  "sabotador_atual": {
    "sabotador_id": "inquieto",
    "intensidade_media": 75,
    "insight_atual": "Aldo coloca muita pressão no resultado final...",
    "contramedida_ativa": "Estabelecer pequenos marcos diários..."
  },
  "top3_historicos": [
    {
      "sabotador_id": "inquieto",
      "total_deteccoes": 24,
      "intensidade_media": 69.17
    },
    {
      "sabotador_id": "perfeccionista",
      "total_deteccoes": 5,
      "intensidade_media": 92
    }
  ],
  "criar_quest_atual": false,
  "criar_quest_historico": true
}
```

### Saída do Agente (Quest de Sabotador)
```json
{
  "tipo": "sabotador",
  "catalogo_id": null, // ou ID se usar catálogo como fallback
  "titulo": "Estabelecer pequenos marcos diários...",
  "descricao": "...",
  "sabotador_id": "inquieto",
  "contexto_origem": "sabotador_atual", // ou "sabotador_historico"
  "base_cientifica": {
    "tipo": "sabotador",
    "objetivo": "...",
    "fundamentos": "Baseado no insight: [insight_atual]",
    "como_aplicar": "[contramedida_ativa] usando MindQuest..."
  }
}
```

---

## Checklist de Implementação

- [ ] Modificar query "Buscar Sabotadores Ativo" para retornar top 3 + atual
- [ ] Adicionar lógica de decisão (atual no top 3?)
- [ ] Atualizar prompt do agente para usar insight/contramedida
- [ ] Ajustar validação em "Aplicar Limites & Dedupe"
- [ ] Testar com usuário que tem sabotador atual ≠ top 3
- [ ] Testar com usuário que tem sabotador atual = top 3
- [ ] Validar que quest usa insight contextualizado (não catálogo genérico)

---

## Referências

- `sabotadores_quest.md` — regras de negócio completas
- `sabotador_mais_ativo_regras.md` — cálculo do score histórico
- Workflow: `sw_criar_quest` (ID: `LKjU8NE9aNHw7kEh`)

