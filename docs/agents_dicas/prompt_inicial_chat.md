# Prompt Inicial para Chats — Quests v1.3.5

**Data:** 2025-11-24  
**Uso:** Copiar e colar no início de novos chats para fornecer contexto

---

## Prompt para Copiar

```
Olá! Vou trabalhar no sistema de quests do MindQuest v1.3.5. Segue contexto importante:

## Contexto do Projeto
- Stack: React/TypeScript (frontend) + n8n (backend/workflows) + PostgreSQL
- Versão atual: 1.3.5
- Documentação: docs/espec/quests/1.3.5/

## Estrutura Principal

### Backend (n8n)
- Webhooks principais:
  - webhook_quests (ID: yvg9NkBsLF3mbr5f) - Lista quests do usuário
  - webhook_progresso_semanal (ID: gMb1UwtmEh5pkfxR) - Progresso semanal
  - webhook_concluir_quest (ID: YF4CyvHY0BbLWNwC) - Concluir quest
- Sub-workflows: sw_xp_quest, sw_xp_conversas (NUNCA ativar, são chamados via executeWorkflow)
- Regra crítica: Ao atualizar nodes Postgres via MCP, SEMPRE incluir operation, query e options no mesmo update

### Frontend
- Componentes principais:
  - PainelQuestsPageV13 (src/pages/App/v1.3/PainelQuestsPageV13.tsx) - Página de quests
  - CardWeeklyProgress (src/components/app/v1.3/CardWeeklyProgress.tsx) - Card na home
  - Store: src/store/useStore.ts (gerencia estado global)
  - ApiService: src/services/apiService.ts (camada de API)

### Banco de Dados
- Tabelas principais:
  - usuarios_quest: Instâncias de quests (campos: id, status, catalogo_id, config, recorrencias)
  - conquistas_historico: Histórico de conclusões (campos: usuarios_quest_id, tipo, detalhes)
  - quests_catalogo: Catálogo de quests do sistema
- Campos que NÃO existem em usuarios_quest: xp_concedido, progresso_meta, progresso_atual, progresso_percentual

## Regras de Negócio Críticas

1. Sistema conta QUANTIDADE de quests (não mais XP) para progresso
2. Quests de conversa (reflexao_diaria) não podem ser concluídas manualmente
3. Apenas 1 conversa por dia conta para XP
4. Título de quest: prioriza config->>'titulo' sobre qc.titulo
5. Joins com conquistas_historico: SEMPRE usar usuarios_quest_id (não meta_codigo)

## Documentação de Referência
- docs/espec/quests/1.3.5/referencia_tecnica.md - Referência técnica completa
- docs/espec/quests/1.3.5/quests_1.3.5_compacto.md - Especificação compacta
- AGENTS.md - Boas práticas n8n e lições aprendidas

## Padrões de Resposta
- PT-BR, conciso e direto
- Sempre validar operation após atualizar nodes Postgres
- Testar queries no banco antes de aplicar em workflows
- Seguir padrão de commits: [LABEL] verbo no infinitivo + objeto direto

Estou pronto para trabalhar! Me diga qual é a tarefa.
```

---

## Versão Resumida (Para Chats Rápidos)

```
Contexto MindQuest v1.3.5:
- Backend: n8n workflows (webhook_quests, webhook_progresso_semanal, webhook_concluir_quest)
- Frontend: React/TS (PainelQuestsPageV13, CardWeeklyProgress)
- DB: usuarios_quest, conquistas_historico (usar usuarios_quest_id para joins)
- Regras: Conta quantidade de quests (não XP), quests conversa não concluem manualmente
- Docs: docs/espec/quests/1.3.5/referencia_tecnica.md
- Crítico: Ao atualizar Postgres via MCP, incluir operation+query+options juntos

Qual a tarefa?
```

---

## Versão Detalhada (Para Tarefas Complexas)

```
Olá! Vou trabalhar no sistema de quests do MindQuest v1.3.5. Segue contexto completo:

## Stack e Arquitetura
- Frontend: React + TypeScript (src/pages/App/v1.3/, src/components/app/v1.3/)
- Backend: n8n workflows (backups/n8n/)
- Banco: PostgreSQL (config/postgres.env para conexão)
- Estado: Zustand store (src/store/useStore.ts)

## Webhooks Principais

### webhook_quests (yvg9NkBsLF3mbr5f)
- Path: /webhook/quests
- Retorna: Lista de quests (pendentes/concluídas) com título, tipo, catalogo_codigo, config
- Consumido por: PainelQuestsPageV13 via loadQuestSnapshot()

### webhook_progresso_semanal (gMb1UwtmEh5pkfxR)
- Path: /webhook/progresso-semanal
- Retorna: Progresso semanal com qtdQuestsPrevistas e qtdQuestsConcluidas por dia
- Consumido por: CardWeeklyProgress, PainelQuestsPageV13 via loadWeeklyProgressCard()

### webhook_concluir_quest (YF4CyvHY0BbLWNwC)
- Path: /webhook/concluir-quest
- Parâmetros: usuario_id, quest_id, data_referencia
- Ação: Marca quest como concluída, chama sw_xp_quest
- Consumido por: PainelQuestsPageV13, QuestDetailPageV13 via concluirQuest()

## Estrutura de Tabelas

### usuarios_quest
- Campos principais: id, usuario_id, status, catalogo_id (OBRIGATÓRIO), config (jsonb), recorrencias (jsonb)
- Campos que NÃO existem: xp_concedido, progresso_meta, progresso_atual, progresso_percentual, contexto_origem, referencia_data
- recorrencias: Planejamento (dias, janela, tipo) - NÃO contém execução

### conquistas_historico
- Campos principais: id, usuario_id, usuarios_quest_id (USAR PARA JOINS), tipo ('quest' ou 'conversa'), detalhes (jsonb)
- detalhes.ocorrencias[]: Array com data_planejada, data_concluida, xp_base, xp_bonus, usr_chat_id, data_conversa
- 1 registro por instância de quest, todas ocorrências em detalhes->ocorrencias[]

## Regras de Negócio

1. Progresso baseado em QUANTIDADE: qtdConcluidas / qtdPrevistas (não mais XP)
2. Quests conversa: catalogo_codigo='reflexao_diaria' ou tipo='reflexao_diaria' ou config.conversa=true
   - Não podem ser concluídas manualmente (ocultar botão no frontend)
3. Conversas: Apenas 1 conversa por dia conta para XP
4. Títulos: Prioridade config->>'titulo' > qc.titulo > 'Quest personalizada'
5. Joins: SEMPRE usar usuarios_quest_id (não meta_codigo que é legado)

## Componentes Frontend

### PainelQuestsPageV13
- Exibe lista de quests (pendentes/concluídas)
- Barra de progresso semanal (horizontal + vertical por dia)
- Filtro por data e abas
- Botão concluir (oculto para quests conversa)

### CardWeeklyProgress
- Card na home com progresso semanal
- Seção Conversas (checkboxes) + Seção Quests (barras)
- Cálculo: qtdConcluidas / qtdPrevistas

## Boas Práticas n8n

- Sub-workflows (sw_*): NUNCA ativar, rodam via executeWorkflow
- Atualizar Postgres via MCP: SEMPRE incluir operation, query e options juntos
- Validar operation após update: n8n_get_workflow para confirmar
- Debug: Usar n8n_list_executions e n8n_get_execution com mode="summary"

## Documentação
- docs/espec/quests/1.3.5/referencia_tecnica.md - Referência técnica completa
- docs/espec/quests/1.3.5/quests_1.3.5_compacto.md - Especificação compacta
- AGENTS.md - Boas práticas n8n e lições aprendidas
- DICAS_CHAT_EFICIENTE.md - Dicas para chats produtivos

## Padrões
- Commits: [LABEL] verbo no infinitivo + objeto direto (PT-BR)
- Respostas: Concisas, diretas, sem floreios
- Validação: Testar no banco antes de aplicar em workflows

Pronto para trabalhar! Qual é a tarefa?
```

---

## Quando Usar Cada Versão

- **Versão Resumida:** Tarefas simples, correções rápidas, ajustes pontuais
- **Versão Padrão:** Maioria das tarefas, desenvolvimento normal
- **Versão Detalhada:** Tarefas complexas, refatorações grandes, onboarding de novo desenvolvedor

---

**Última atualização:** 2025-11-24

