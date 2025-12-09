# n8n - Manual Técnico Essencial

**Data:** 2025-12-09

## Workflow MindQuest - Regras Críticas

### ❌ NUNCA Alterar
- `sw_xp_quest`, `sw_criar_quest`, `sw_xp_conversas` → Exclusivos do agente IA
- Use `webhook_*` para interface (ex: `webhook_concluir_quest`)

### Sub-workflows (sw_*)
- NUNCA ativar → rodam na transação do pai via `executeWorkflow`
- `active=false` é correto

## AI Agent Tools

### Postgres Tool (consultas sob demanda)
O AI Agent pode ter **tools conectadas** para buscar dados quando necessário.

**Exemplo:** `quest_tool` no mentor
- Busca detalhes de quests apenas quando o agente precisar
- Economiza tokens no prompt (não envia lista completa toda interação)
- Prompt contém apenas indicadores (`tem_quests`, `total_ativas`)

**Configuração:**
1. Criar node Postgres Tool via interface n8n
2. Conectar ao AI Agent (porta `ai_tool`)
3. Query com parâmetro `$fromAI('campo')` para receber input do agente

**System Prompt - Instruir uso:**
```xml
<tool name="quest_tool">
QUANDO USAR:
- Usuário pergunta sobre quests
- Precisa mencionar quest pelo nome
QUANDO NÃO USAR:
- Conversa casual
- Já sabe que não tem quests (total = 0)
</tool>
```

## Edição de Workflows - Fluxo Essencial

### 1. Antes de Editar
```bash
n8n_get_workflow(id, mode="structure")  # Mapear nós/IDs/conexões
```

### 2. Editar
```bash
n8n_update_partial_workflow()  # Mudanças cirúrgicas (nunca full update)
```

### 3. Validar
```bash
n8n_get_workflow(id, mode="structure")  # Conferir mudanças
```

## Nodes Postgres - CRÍTICO

### Regra de Ouro
**SEMPRE incluir 3 campos juntos:**
- `operation`: "executeQuery"
- `query`: SQL completa
- `options`: `{}` ou `{"queryReplacement": "..."}`

### Template (copiar e adaptar)
```json
{
  "type": "updateNode",
  "nodeId": "abc-123",
  "updates": {
    "parameters": {
      "operation": "executeQuery",
      "query": "SELECT * FROM table WHERE id = $1",
      "options": {"queryReplacement": "={{ [$json.id] }}"}
    }
  }
}
```

### ⚠️ Erro Comum
Atualizar só `query` → n8n reseta `operation` para "Insert"

## Webhooks via MCP - CRÍTICO

### Problema
Sem `webhookId` → funciona em teste (`/webhook-test/`) mas **404 em produção** (`/webhook/`)

### Solução
```json
{
  "type": "n8n-nodes-base.webhook",
  "webhookId": "UUID-UNICO",  // crypto.randomUUID()
  "parameters": {
    "path": "endpoint",
    "httpMethod": "GET"
  }
}
```

### Corrigir Webhook Existente
```json
{
  "type": "updateNode",
  "nodeId": "webhook-node-id",
  "updates": {
    "webhookId": "novo-uuid"
  }
}
```

## Debug de Execução

```bash
# 1. Achar workflow
n8n_list_workflows

# 2. Última execução
n8n_list_executions(workflowId)

# 3. Ver saída
n8n_get_execution(id, mode="summary")  # Rápido
n8n_get_execution(id, mode="filtered", nodeNames=["Node"])  # Específico
```

## MCP - Ferramentas Essenciais

```bash
search_nodes(query)           # Buscar nodes
get_node_info(nodeType)       # Propriedades do node
validate_workflow(workflow)   # Validar antes de aplicar
```

## Regras Gerais

1. **Usar `n8n_update_partial_workflow`** → mais eficiente
2. **Validar após mudanças** → `n8n_get_workflow`
3. **Ajustar expressões** → `$items`, `$node` ao renomear
4. **Confirmar tipo via MCP** → `get_node_info` antes de supor
5. **Code nodes** → `n8n-nodes-base.code` (nunca `function`)
6. **Ler workflows** → usar `mode="structure"` para visão geral