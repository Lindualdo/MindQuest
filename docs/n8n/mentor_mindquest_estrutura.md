# Estrutura do Workflow mentor_mindquest

**Data:** 2025-12-01 22:00  
**Workflow ID:** `c1To6ho5riDs85Aj`

---

## Fluxo Simplificado

```
start (trigger) → config → contexto_completo → transcricao → 
memory_get → interacao_controle → memory_insert → 
verifica_encerramento → mentor_agent → processa_resposta → 
[continua OU encerra] → grava_conversa → experts
```

---

## Nodes Essenciais

### 1. start (executeWorkflowTrigger)
- Recebe: `usr_id`, `body.instance`, `body.data.*`
- Conecta: `config`

### 2. config (DataTable)
- Busca: `limit_iteration_min` (5), `limit_iteration_max` (20)
- Conecta: `contexto_completo`

### 3. contexto_completo (Code) - NOVO
- Consolida todas as buscas em um único node
- Busca: dados_usr, objetivos, sabotador, quests, histórico, perfil_bigfive
- Retorna: objeto consolidado com todo contexto
- Conecta: `transcricao`

### 4. transcricao (executeWorkflow)
- Chama: `sw_chat_transcription`
- Conecta: `memory_get`

### 5. memory_get (memoryManager)
- Busca histórico da conversa
- Conecta: `interacao_controle`

### 6. interacao_controle (Code) - NOVO
- Calcula: `interaction_count`, `can_end_early`, `reason`
- Analisa últimas mensagens para detectar esgotamento
- Conecta: `memory_insert`

### 7. memory_insert (memoryManager)
- Insere mensagem de sistema com número da interação
- Conecta: `verifica_encerramento`

### 8. verifica_encerramento (Switch) - NOVO
- 4 saídas:
  1. `> max` → Encerrar forçado
  2. `>= min AND can_end_early` → Perguntar encerramento
  3. `< max AND !can_end_early` → Continuar
  4. `=== max` → Última interação
- Conecta: `mentor_agent` (saídas 2,3,4) ou `encerra_forcado` (saída 1)

### 9. mentor_agent (Agent)
- LLM Agent com prompt atualizado
- Tools: `get_history`, `user_conversation_guide`, `agent_conversation_guide`
- Memory: `memory` (Redis Chat Memory)
- Conecta: `processa_resposta`

### 10. processa_resposta (Code) - NOVO
- Processa resposta do agente
- Coleta contexto estruturado (todas interações)
- Detecta se é última interação
- Conecta: `envia_mensagem` OU `grava_conversa`

### 11. envia_mensagem (executeWorkflow)
- Chama: `sw_evolution_send_message_v2`
- Conecta: Loop (volta para `memory_get`)

### 12. grava_conversa (Code + Postgres)
- Monta dados finais
- Grava em `usr_chat`
- Conecta: `experts` (paralelo)

### 13. experts (executeWorkflow - paralelo)
- Chama: experts_panas, experts_humor, experts_sabotadores, expert_insights, expert_bigfive
- Chama: sw_criar_quest, sw_xp_conversas

---

## Simplificações

1. **Um único node de contexto** (`contexto_completo`) ao invés de múltiplos nodes Postgres
2. **Detecção de encerramento integrada** no `interacao_controle`
3. **Processamento de resposta único** (`processa_resposta`) que faz tudo
4. **Sem lock Redis** (removido para simplificar)
5. **Memory management simplificado** (apenas get/insert, delete no final)

---

## Queries SQL para contexto_completo

```sql
-- Dados do usuário + Objetivos + Sabotador + Quests + Histórico + Big Five
-- Tudo em uma query ou múltiplas queries no mesmo node Code
```

