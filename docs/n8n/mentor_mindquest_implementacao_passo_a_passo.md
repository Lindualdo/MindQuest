# Implementação Passo a Passo - mentor_mindquest

**Data:** 2025-12-01 22:00  
**Workflow ID:** `c1To6ho5riDs85Aj`  
**Status:** Estrutura básica criada, aguardando implementação completa

---

## ✅ Nodes Já Criados (9 nodes)

1. `start` - executeWorkflowTrigger
2. `config` - DataTable
3. `contexto_completo` - Code (simplificado)
4. `transcricao` - executeWorkflow
5. `memory` - Redis Chat Memory
6. `memory_get` - memoryManager
7. `interacao_controle` - Code (com detecção)
8. `memory_insert` - memoryManager
9. `verifica_encerramento` - Switch (4 saídas)

---

## 📋 Próximos Passos de Implementação

### PASSO 1: Adicionar Language Model e Tools

**1.1 Adicionar openrouter_model**
- Type: `@n8n/n8n-nodes-langchain.lmChatOpenRouter`
- Position: [1200, 400]
- Credentials: OpenRouter account (rSnkOnnAHyfayLJt)

**1.2 Adicionar get_history tool**
- Type: `@n8n/n8n-nodes-langchain.toolWorkflow`
- Position: [1400, 400]
- Workflow: HDTrSrJiBIv2FFks
- Input: `usr_id` = `{{ $('contexto_completo').first().json.usuario_id }}`

**1.3 Adicionar user_conversation_guide tool**
- Type: `@n8n/n8n-nodes-langchain.toolWorkflow`
- Position: [1600, 400]
- Workflow: aMJIDSGZkNbcPxjc

**1.4 Adicionar agent_conversation_guide tool**
- Type: `@n8n/n8n-nodes-langchain.toolWorkflow`
- Position: [1800, 400]
- Workflow: QIlkK8StiAVCwY0U

### PASSO 2: Adicionar Agente Mentor

**2.1 Adicionar mentor_agent**
- Type: `@n8n/n8n-nodes-langchain.agent`
- Position: [1600, 0]
- Prompt: Ver `mentor_mindquest_nodes_detalhados.md` para prompt completo
- System Message: Ver `mentor_mindquest_nodes_detalhados.md`

**2.2 Conectar AI Connections**
- `openrouter_model` → `mentor_agent` (ai_languageModel)
- `get_history` → `mentor_agent` (ai_tool)
- `user_conversation_guide` → `mentor_agent` (ai_tool)
- `agent_conversation_guide` → `mentor_agent` (ai_tool)
- `memory` → `mentor_agent` (ai_memory)

**2.3 Conectar Main Flow do Switch**
- `verifica_encerramento` (case 1: "> max") → `encerra_forcado` (criar node)
- `verifica_encerramento` (case 2: ">= min AND can_end_early") → `mentor_agent`
- `verifica_encerramento` (case 3: "=== max") → `mentor_agent`
- `verifica_encerramento` (case 4: "< max AND !can_end_early") → `mentor_agent`

### PASSO 3: Adicionar Processamento

**3.1 Adicionar processa_resposta**
- Type: `n8n-nodes-base.code`
- Position: [1800, 0]
- Code: Ver `mentor_mindquest_nodes_detalhados.md`

**3.2 Adicionar envia_mensagem**
- Type: `n8n-nodes-base.executeWorkflow`
- Position: [2000, 0]
- Workflow: DJB5qWudX1Hqap1O (sw_evolution_send_message_v2)
- Input: messageText = `{{ $('processa_resposta').first().json.user_message }}`

**3.3 Adicionar grava_conversa**
- Type: `n8n-nodes-base.code`
- Position: [2200, 0]
- Code: Ver `mentor_mindquest_nodes_detalhados.md`

**3.4 Adicionar grava_chat**
- Type: `n8n-nodes-base.postgres`
- Position: [2400, 0]
- Query: Ver `mentor_mindquest_nodes_detalhados.md`

**3.5 Conectar Fluxo**
- `mentor_agent` → `processa_resposta`
- `processa_resposta` → `envia_mensagem` (se não última) OU `grava_conversa` (se última)
- `envia_mensagem` → `memory_get` (loop)
- `grava_conversa` → `grava_chat`

### PASSO 4: Adicionar Experts (Paralelo)

**4.1 Adicionar nodes executeWorkflow para experts**
- experts_panas (vJRfrbY4NhpNyfCD)
- experts_humor_energia (GykxpS5vsg8NeoOh)
- experts_sabotadores (Vbc4JHAR3388mLcv)
- expert_insights (nEstxgiVE8GLXgUQ)
- expert_bigfive (nOl6lnaGMpyg9S9J)
- sw_criar_quest (LKjU8NE9aNHw7kEh)
- sw_xp_conversas (ItBastfCTkWxm41M)

**4.2 Conectar**
- `grava_chat` → todos os experts (paralelo)

### PASSO 5: Implementar contexto_completo

**5.1 Adicionar queries SQL**
- Buscar dados_usr
- Buscar objetivos (específicos + padrão)
- Buscar sabotador_mais_ativo
- Buscar quests_ativas
- Buscar histórico (últimas 3-5 conversas)
- Buscar perfil_bigfive

**5.2 Retornar objeto consolidado**
- Ver estrutura em `mentor_mindquest_nodes_detalhados.md`

### PASSO 6: Adicionar Encerramento Forçado

**6.1 Adicionar encerra_forcado**
- Type: `n8n-nodes-base.executeWorkflow`
- Workflow: DJB5qWudX1Hqap1O
- Message: "Limite máximo atingido. Volte em X horas."

---

## 🔧 Comandos MCP para Implementação

### Batch 1: Language Model e Tools
```javascript
mcp_n8n-mcp_n8n_update_partial_workflow({
  id: "c1To6ho5riDs85Aj",
  intent: "Adicionar language model e tools",
  operations: [
    // Adicionar openrouter_model
    // Adicionar get_history
    // Adicionar user_conversation_guide
    // Adicionar agent_conversation_guide
  ]
})
```

### Batch 2: Agente Mentor
```javascript
mcp_n8n-mcp_n8n_update_partial_workflow({
  id: "c1To6ho5riDs85Aj",
  intent: "Adicionar agente mentor e conectar",
  operations: [
    // Adicionar mentor_agent
    // Conectar AI connections
    // Conectar main flow do switch
  ]
})
```

### Batch 3: Processamento
```javascript
mcp_n8n-mcp_n8n_update_partial_workflow({
  id: "c1To6ho5riDs85Aj",
  intent: "Adicionar processamento e gravação",
  operations: [
    // Adicionar processa_resposta
    // Adicionar envia_mensagem
    // Adicionar grava_conversa
    // Adicionar grava_chat
    // Conectar fluxo
  ]
})
```

---

## 📝 Notas Importantes

1. **Nodes AI não precisam de conexões main** - apenas AI connections
2. **Switch tem 4 saídas** - conectar todas ao mentor_agent (exceto case 1 que vai para encerra_forcado)
3. **Loop:** envia_mensagem → memory_get (volta para início)
4. **Paralelo:** grava_chat → todos experts (não esperar)
5. **contexto_completo:** Implementar queries SQL completas depois

---

**Última atualização:** 2025-12-01 22:00

