# MindQuest - Sistema de Quests v1.3.8

**Data:** 2025-01-22  
**Versão:** 1.3.8

---

## 1. Visão Geral do MindQuest

MindQuest é uma plataforma de desenvolvimento pessoal que transforma conversas em ações práticas. Identifica padrões mentais que travam o progresso e oferece micro-ações personalizadas (quests) para mudança comportamental.

**Fluxo Central:**
1. Usuário conversa com assistente de reflexão (IA) pelo WhatsApp
2. Sistema gera insights, quests, calcula pontos e atualiza análise comportamental
3. Usuário acompanha progresso no App e gerencia quests (define recorrências e ativa quests)
4. Assistente de quests notifica e ajuda usuário a colocar em prática
5. Transformação acontece: usuário conquista pontos no App e progresso na vida

**Foco:** Desenvolvimento pessoal, mudança de padrões que travam progresso e realizações.

Isso..

---

## 2. Quests - Ponto Central do Sistema

**Conceito:** Micro-ações personalizadas geradas automaticamente a partir de conversas, insights e sabotadores. Cada quest representa um passo prático para transformação comportamental.

**Tipos:** Personalizada (IA contextual), Sabotador (superar padrões limitantes), TCC/Estoicismo (técnicas comportamentais), Conversa/Reflexão Diária (quest permanente especial).

**Ciclo de Vida:** Disponível (criada, aguardando ativação) → Ativa (em execução com recorrências) → Inativa (todas ocorrências concluídas/vencidas, pode reativar). Conversas são sempre ativas e nunca expiram.

**Recorrências:** Usuário define dias da semana. Cada dia gera ocorrência (pendente/concluída/perdida). Conversas têm recorrência diária automática, não precisam planejamento em `quests_recorrencias` (apenas registram concluídas). **Quests podem ser concluídas diretamente sem planejamento prévio:** quando uma quest em status "disponivel" é concluída, o sistema cria automaticamente um registro em `quests_recorrencias` com status "concluida" para a data de conclusão. Isso permite flexibilidade para quests de execução única ou quando o usuário prefere concluir antes de planejar recorrências.

---

## 3. Tabelas do Sistema de Quests

**`usuarios_quest`:** Quest pai - ID, usuário, catálogo, status (disponível/ativa/inativa), contexto (área da vida, sabotador, insight). Uma quest pode ter múltiplas ocorrências.

**`quests_recorrencias`:** Ocorrências planejadas e concluídas - Data, status (pendente/concluída/perdida), referência à quest pai. Uma linha por dia.

**`usuarios_conquistas`:** Pontos e progresso consolidados - XP total, nível, estágio da jornada, sequência de dias (streak). Atualizado automaticamente.

**`usr_chat`:** Histórico completo de conversas - Informações completas das conversas realizadas pelo WhatsApp. Base para geração de insights e quests.

**Quests de Conversa/Reflexão Diária:** Tratadas como quests especiais permanentes. Sempre ativas, nunca expiram, recorrência diária automática. Não precisam estar em `quests_recorrencias` (planejamento), apenas na tabela pai `usuarios_quest`. Em `quests_recorrencias` entram apenas conversas já realizadas, sempre como concluídas. Usuario não pode concluir manualmente.

---

## 4. Telas do Sistema de Quests

**PainelQuestsPageV13:** Tela principal - 3 abas (A Fazer/Fazendo/Feito). Ativa quests, visualiza progresso, acessa detalhes.

**QuestDetailPageV13:** Detalhes e execução - Informações completas, recorrências planejadas, histórico. Permite concluir ocorrências por data. **Quests em status "disponivel" (a fazer) podem ser concluídas diretamente sem necessidade de planejamento prévio.** O sistema cria automaticamente o registro em `quests_recorrencias` quando a quest é concluída, mesmo sem recorrências planejadas. Isso é especialmente útil para quests de execução única (sem recorrência).

**PlanejamentoQuestsPage:** Planejamento e ativação - Define recorrências (dias da semana) ao ativar quest. Visualiza disponíveis.

**CardWeeklyProgress:** Progresso semanal - XP da semana, streak, quests concluídas vs planejadas. Integrado no dashboard.

---

## 5. Workflows n8n

**`sw_criar_quest`:** Criação automática - Gera 3 quests (personalizada, sabotador, TCC) baseadas em conversas/insights. Entrada: usuário_id. Saída: 3 quests com status 'disponivel'.

**`sw_xp_quest`:** Persistência e cálculo de XP - Cria/atualiza quests, calcula XP ao concluir, distribui pontos, atualiza conquistas, chama cálculo de jornada.

**`sw_xp_conversas`:** XP de conversas diárias - Calcula pontos por conversas e sequência, cria/atualiza quest reflexão diária (sempre ativa), processa últimos 45 dias.

**`sw_calcula_jornada`:** Nível e estágio - Calcula nível por XP, valida requisitos, determina estágio (1-4), atualiza perfil.

**`job_batch_generate_quests`:** Geração em lote - Executa criação automática para múltiplos usuários periodicamente.

**`job_batch_xp_quest`:** Processamento em lote - Processa conclusões pendentes e recalcula XP/jornada.

**`job_batch_xp_conversas`:** Processamento em lote - Processa as conversas e recalcula XP/jornada.
---

## 6. Webhooks e APIs

**`webhook_quests`:** Listagem e snapshot - GET retorna quests do usuário (card/snapshot), POST atualiza status múltiplas quests.

**`webhook_concluir_quest`:** Conclusão - Marca ocorrência como concluída, dispara cálculo XP e jornada. **Funciona para quests em qualquer status:** se a quest estiver em "disponivel" (a fazer) e não tiver recorrências planejadas, o sistema cria automaticamente um registro em `quests_recorrencias` com status "concluida" para a data de conclusão. Isso permite concluir quests de execução única ou concluir antes de planejar recorrências.

**`webhook_ativar_quest`:** Ativação - Altera status para 'ativa', cria registros em `quests_recorrencias` conforme dias definidos.

**`webhook_quest_detail`:** Detalhes completos - Retorna recorrências, histórico, contexto.

**`webhook_progresso_semanal`:** Progresso semanal - Retorna XP, streak, quests concluídas vs planejadas da semana.

**`webhook_criar-quest`:** Criação manual - Permite usuário criar quest personalizada via App.

**`webhook_evoluir_stats`:** Estatísticas de evolução - Retorna total de conversas, ações concluídas e XP total do usuário.

**APIs Vercel:** Proxies frontend → webhooks n8n - `/api/quests`, `/api/concluir-quest`, `/api/ativar-quest`, `/api/criar-quest`, `/api/card/quests`, `/api/evoluir-stats`.

---

## 7. Regras de Cálculo - Conversas, Ações e Pontos (XPs)

### Total de Conversas
- **Fonte:** Tabela `usr_chat`
- **Cálculo:** `COUNT(*)` de registros onde `usuario_id = X`
- **Observação:** Conta todas as conversas registradas do usuário, independente de data ou status.

### Total de Ações Concluídas
- **Fonte:** Tabela `quests_recorrencias`
- **Cálculo:** `COUNT(*)` de recorrências com `status = 'concluida'`
- **Filtros obrigatórios:**
  - `qr.status = 'concluida'`
  - `qc.codigo != 'reflexao_diaria'` (excluir quests de conversa)
- **Observação:** Conta apenas ocorrências concluídas de quests de ação (personalizadas, sabotador, TCC). Não inclui conversas.

### Total de Pontos (XP)
- **Fonte:** Tabela `usuarios_conquistas`
- **Campo:** `xp_total`
- **Observação:** XP acumulado total do usuário, incluindo conversas e quests concluídas.

---

**Última atualização:** 2025-11-28

