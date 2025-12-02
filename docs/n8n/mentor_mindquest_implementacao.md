# Implementação do Workflow mentor_mindquest

**Data:** 2025-12-01 22:00  
**Workflow ID:** `c1To6ho5riDs85Aj`

---

## Estrutura Completa Simplificada

### Fluxo Principal
```
start → config → contexto_completo → transcricao → 
memory_get → interacao_controle → memory_insert → 
verifica_encerramento → [mentor_agent OU encerra] → 
processa_resposta → [envia_mensagem (loop) OU grava_conversa] → 
experts (paralelo)
```

---

## Nodes Detalhados

### 1. start (executeWorkflowTrigger) ✅
- Já criado

### 2. config (DataTable) ✅
- Já criado

### 3. contexto_completo (Code) ✅
- Já criado (versão simplificada)
- **PRECISA:** Implementar queries SQL completas

### 4. transcricao (executeWorkflow)
- Chama: `sw_chat_transcription`
- Input: body.* do start
- Output: message

### 5. memory (Redis Chat Memory)
- SessionKey: `{{instance}}{{usr_id}}{{whatsapp_numero}}`
- TTL: 43200 (12h)
- ContextWindow: 50

### 6. memory_get (memoryManager)
- Get messages
- Group: true

### 7. interacao_controle (Code)
- Calcula interaction_count
- Detecta can_end_early
- Analisa últimas 3 mensagens do usuário

### 8. memory_insert (memoryManager)
- Insere mensagem sistema com interaction_count

### 9. verifica_encerramento (Switch)
- 4 saídas:
  1. `> max` → encerra_forcado
  2. `>= min AND can_end_early` → pergunta_encerramento
  3. `< max AND !can_end_early` → mentor_agent
  4. `=== max` → mentor_agent (última)

### 10. mentor_agent (Agent)
- LLM: OpenRouter Chat Model
- Tools: get_history, user_conversation_guide, agent_conversation_guide
- Memory: memory (Redis)
- Prompt: Atualizado com framework e objetivos

### 11. processa_resposta (Code)
- Processa output do agente
- Coleta contexto estruturado
- Detecta última interação

### 12. envia_mensagem (executeWorkflow)
- Chama: `sw_evolution_send_message_v2`
- Loop: volta para memory_get

### 13. grava_conversa (Code + Postgres)
- Monta dados finais
- Grava usr_chat
- Chama experts

### 14. experts (executeWorkflow - paralelo)
- experts_panas, experts_humor, experts_sabotadores, expert_insights, expert_bigfive
- sw_criar_quest, sw_xp_conversas

---

## Próximos Passos de Implementação

1. Adicionar nodes de entrada (transcricao, memory, memory_get)
2. Adicionar controle de interações (interacao_controle, memory_insert, verifica_encerramento)
3. Adicionar agente mentor (mentor_agent com prompt atualizado)
4. Adicionar processamento (processa_resposta, envia_mensagem, grava_conversa)
5. Adicionar experts (paralelo)

