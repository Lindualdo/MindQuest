# n8n - Manual Técnico Essencial

**Data:** 2025-12-09

## Workflow MindQuest - Regras Críticas

### ❌ NUNCA Alterar
- `sw_xp_quest`, `sw_criar_quest`, `sw_xp_conversas` → Exclusivos do agente IA
- Use `webhook_*` para interface (ex: `webhook_concluir_quest`)

### Sub-workflows (sw_*)
- NUNCA ativar → rodam na transação do pai via `executeWorkflow`
- `active=false` é correto

## AI Agent - Structured Output Parser - CRÍTICO

### Regra Obrigatória
**SEMPRE** usar **Structured Output Parser** após AI Agent para garantir JSON válido.

### Configuração

#### 1. System Prompt (orientação visual)
No System Prompt ou User Prompt, sempre incluir o formato JSON **compactado** (sem quebras de linha) dentro de `<output></output>`:

```xml
<output>
{"pode_criar": boolean, "pedido_explicito": boolean, "destinos": [{"tipo": "string", "prioridade": number}], "excluidos": [{"tipo": "string", "motivo": "string"}], "justificativa": "string"}
</output>
```

**Regras:**
- JSON em **linha única** (sem espaços ou quebras)
- Usar tipos genéricos: `boolean`, `number`, `string`, `array`
- Sempre dentro de `<output></output>`

#### 2. Structured Output Parser (validação)
Após o AI Agent, conectar **Structured Output Parser**:

**Fluxo:** `AI Agent` → `Structured Output Parser` → `Próximo Node`

**Configuração do Parser:**
- **Schema Type:** "Define using JSON Schema"
- **Input Schema:** Colar JSON Schema completo (ver exemplo abaixo)

**Exemplo JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "pode_criar": {"type": "boolean"},
    "pedido_explicito": {"type": "boolean"},
    "destinos": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "tipo": {"type": "string"},
          "prioridade": {"type": "number"}
        },
        "required": ["tipo", "prioridade"]
      }
    },
    "excluidos": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "tipo": {"type": "string"},
          "motivo": {"type": "string"}
        },
        "required": ["tipo", "motivo"]
      }
    },
    "justificativa": {"type": "string"}
  },
  "required": ["pode_criar", "pedido_explicito", "destinos", "excluidos", "justificativa"]
}
```

### Benefícios
- ✅ Validação automática da resposta do LLM
- ✅ n8n rejeita output inválido
- ✅ Parsing estruturado garantido
- ✅ Reduz bugs de formato

---

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

## ⚠️ Conexões de IF Nodes - CRÍTICO

### ❌ NUNCA Fazer via MCP
Conexões de **segunda saída** (FALSE) de IF nodes via MCP (`addConnection` com `sourceOutput: "1"`) **criam linhas pontilhadas fantasmas** que:
- Não executam
- Não podem ser excluídas facilmente
- Quebram o fluxo do workflow

### ✅ Sempre Fazer Manualmente
Para conectar a segunda saída de um IF node:
1. Abrir workflow na **interface n8n**
2. Arrastar conexão manualmente da saída FALSE para o node destino
3. Salvar workflow

### Sintomas de Conexão Fantasma
- Linha pontilhada em vez de sólida
- Node destino não executa mesmo recebendo dados
- Impossível excluir a conexão pela interface

### Como Corrigir
1. Exportar workflow como JSON
2. Editar manualmente removendo a conexão quebrada
3. Reimportar workflow
4. Reconectar manualmente na interface

---

## Regras Gerais

1. **Usar `n8n_update_partial_workflow`** → mais eficiente
2. **Validar após mudanças** → `n8n_get_workflow`
3. **Ajustar expressões** → `$items`, `$node` ao renomear
4. **Confirmar tipo via MCP** → `get_node_info` antes de supor
5. **Code nodes** → `n8n-nodes-base.code` (nunca `function`)
6. **Ler workflows** → usar `mode="structure"` para visão geral
7. **Conexões IF** → NUNCA criar segunda saída via MCP (fazer manual)