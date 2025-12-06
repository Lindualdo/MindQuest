# Workflow mentor_mindquest - Estrutura Completa

**Data:** 2025-12-01 22:00  
**Workflow ID:** `c1To6ho5riDs85Aj`  
**Status:** Em construção

---

## Nodes Criados ✅

1. `start` - executeWorkflowTrigger
2. `config` - DataTable
3. `contexto_completo` - Code (simplificado)
4. `transcricao` - executeWorkflow (sw_chat_transcription)
5. `memory` - Redis Chat Memory
6. `memory_get` - memoryManager
7. `interacao_controle` - Code (com detecção de esgotamento)
8. `memory_insert` - memoryManager
9. `verifica_encerramento` - Switch (4 saídas)

---

## Nodes a Criar

### 10. mentor_agent (Agent)
- **Type:** `@n8n/n8n-nodes-langchain.agent`
- **Position:** [1600, 0]
- **Prompt:** Atualizado com framework CONVERSAR→ENTENDER→AGIR→EVOLUIR
- **Tools:** get_history, user_conversation_guide, agent_conversation_guide
- **Memory:** memory (Redis)
- **Language Model:** openrouter_model

### 11. openrouter_model (Language Model)
- **Type:** `@n8n/n8n-nodes-langchain.lmChatOpenRouter`
- **Position:** [1200, 400]

### 12. get_history (Tool)
- **Type:** `@n8n/n8n-nodes-langchain.toolWorkflow`
- **Position:** [1400, 400]
- **Workflow:** HDTrSrJiBIv2FFks

### 13. user_conversation_guide (Tool)
- **Type:** `@n8n/n8n-nodes-langchain.toolWorkflow`
- **Position:** [1600, 400]
- **Workflow:** aMJIDSGZkNbcPxjc

### 14. agent_conversation_guide (Tool)
- **Type:** `@n8n/n8n-nodes-langchain.toolWorkflow`
- **Position:** [1800, 400]
- **Workflow:** QIlkK8StiAVCwY0U

### 15. processa_resposta (Code)
- **Type:** `n8n-nodes-base.code`
- **Position:** [1800, 0]
- **Função:** Processa output do agente, coleta contexto estruturado

### 16. envia_mensagem (executeWorkflow)
- **Type:** `n8n-nodes-base.executeWorkflow`
- **Position:** [2000, 0]
- **Workflow:** DJB5qWudX1Hqap1O (sw_evolution_send_message_v2)
- **Loop:** Volta para memory_get

### 17. grava_conversa (Code + Postgres)
- **Type:** `n8n-nodes-base.code` + `n8n-nodes-base.postgres`
- **Position:** [2200, 0]
- **Função:** Monta dados finais e grava em usr_chat

### 18. experts (executeWorkflow - paralelo)
- **Type:** `n8n-nodes-base.executeWorkflow`
- **Position:** [2400, 0]
- **Workflows:** experts_panas, experts_humor, experts_sabotadores, expert_insights, expert_bigfive, sw_criar_quest, sw_xp_conversas

---

## Conexões Necessárias

### Memory Connections (ai_memory)
- `memory` → `memory_get`
- `memory` → `memory_insert`
- `memory` → `mentor_agent`
- `memory` → `memory_delete` (final)

### Agent Connections
- `openrouter_model` → `mentor_agent` (ai_languageModel)
- `get_history` → `mentor_agent` (ai_tool)
- `user_conversation_guide` → `mentor_agent` (ai_tool)
- `agent_conversation_guide` → `mentor_agent` (ai_tool)

### Main Flow
- `verifica_encerramento` (case 1: > max) → `encerra_forcado`
- `verifica_encerramento` (case 2: >= min AND can_end_early) → `pergunta_encerramento` → `mentor_agent`
- `verifica_encerramento` (case 3: === max) → `mentor_agent`
- `verifica_encerramento` (case 4: < max AND !can_end_early) → `mentor_agent`
- `mentor_agent` → `processa_resposta`
- `processa_resposta` → `envia_mensagem` (loop) OU `grava_conversa`
- `envia_mensagem` → `memory_get` (loop)
- `grava_conversa` → `experts` (paralelo)

---

## Próximos Passos

1. Adicionar nodes do agente (mentor_agent, openrouter_model, tools)
2. Adicionar processamento (processa_resposta, envia_mensagem)
3. Adicionar gravação (grava_conversa)
4. Adicionar experts (paralelo)
5. Implementar queries SQL completas em contexto_completo
6. Atualizar prompt do mentor_agent com objetivos e histórico
7. Testar fluxo completo

