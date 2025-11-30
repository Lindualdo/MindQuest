# MindQuest - Sistema de Quests v1.3.8

**Data:** 2025-01-22  
**Versão:** 1.3.8  
**Última atualização:** 2025-11-30

---

## 1. Visão Geral do MindQuest

MindQuest é uma plataforma de desenvolvimento pessoal que transforma conversas em ações práticas. Identifica padrões mentais que travam o progresso e oferece micro-ações personalizadas (quests) para mudança comportamental.

**Posicionamento:** Autoconhecimento aplicado à ação. Não é app de produtividade, terapia ou coach. É a interseção: consciência dos padrões + filosofia prática + micro-ações + progresso visível.

**Tagline:** "Mente clara, resultados reais."

**Fundamento:** Pensamentos moldam sentimentos. Sentimentos impulsionam ações. Ações constroem resultados.

### Ciclo de Transformação (4 Etapas Integradas ao Fluxo Central)

**01. Transforme ruído mental em informações organizadas**
- Usuário conversa com assistente de reflexão (IA) pelo WhatsApp (menos de 10 min/dia)
- Assistente conduz conversa guiada, capturando humor, energia, emoções e padrões mentais

**02. Entenda o que sua mente está te dizendo**
- Sistema processa conversa e gera insights personalizados automaticamente
- App é atualizado com informações valiosas: padrões mentais, sabotadores identificados, áreas da vida impactadas
- Sistema gera quests (micro-ações personalizadas) baseadas em contexto da conversa

**03. Encontre a energia que faltava para agir**
- Usuário acompanha progresso no App e gerencia quests (define recorrências e ativa quests)
- Assistente de quests notifica e ajuda usuário a colocar em prática
- Sistema calcula pontos (XP) e atualiza análise comportamental a cada ação concluída

**04. Celebre cada vitória**
- Transformação acontece: usuário conquista pontos no App e progresso na vida
- Sistema acompanha progresso, registra conquistas e reforça hábitos positivos
- Evolução contínua: nível, estágio da jornada (1-4) e sequência de dias (streak) são atualizados automaticamente

### Estágios da Jornada (1-4)

Baseados em níveis e requisitos de progresso:

- **Estágio 1** (Níveis 1-3): Explorador → Aprendiz → Observador
  - Início da jornada, estabelecimento de hábitos, reconhecimento de padrões

- **Estágio 2** (Níveis 4-6): Focado → Praticante → Consciente
  - Consistência, transformação de insights em ações, autoconsciência

- **Estágio 3** (Níveis 7-9): Iluminado → Sábio → Ascendente
  - Rotinas consolidadas, integração emocional, consistência elevada

- **Estágio 4** (Nível 10+): Mestre → Mentor
  - Domínio da jornada, compartilhamento de aprendizados

**Foco:** Desenvolvimento pessoal, mudança de padrões que travam progresso e realizações.

---

## 2. Quests - Ponto Central do Sistema

**Conceito:** Micro-ações personalizadas geradas automaticamente a partir de conversas, insights e sabotadores. Cada quest representa um passo prático para transformação comportamental.

**Tipos:** Personalizada (IA contextual), Sabotador (superar padrões limitantes), TCC/Estoicismo (técnicas comportamentais), Conversa/Reflexão Diária (quest permanente especial).

**Ciclo de Vida:** Disponível (criada, aguardando ativação) → Ativa (em execução com recorrências) → Inativa (todas ocorrências concluídas/vencidas, pode reativar). Conversas são sempre ativas e nunca expiram.

**Recorrências:** Usuário define dias da semana. Cada dia gera ocorrência (pendente/concluída/perdida). Conversas têm recorrência diária automática, não precisam planejamento em `quests_recorrencias` (apenas registram concluídas). **Quests podem ser concluídas diretamente sem planejamento prévio:** quando uma quest em status "disponivel" é concluída, o sistema cria automaticamente um registro em `quests_recorrencias` com status "concluida" para a data de conclusão. Isso permite flexibilidade para quests de execução única ou quando o usuário prefere concluir antes de planejar recorrências.

---

## 3. Sistema de Objetivos

### Estrutura de Objetivos

| Tipo | Qtd | Obrigatório | Descrição |
|------|-----|-------------|-----------|
| **Objetivo Padrão** | 1 | Sim (automático) | "Evolução Pessoal" - área Autoconhecimento |
| **Objetivos Específicos** | 0-2 | Não | Definidos pelo usuário (Finanças, Trabalho, etc.) |

**Total máximo:** 3 objetivos ativos (1 padrão + 2 específicos)

### Regras de Objetivos

1. **Objetivo Padrão (Evolução Pessoal):**
   - Criado automaticamente no cadastro do usuário
   - Não pode ser excluído ou desativado
   - Área: Autoconhecimento / Desenvolvimento Pessoal
   - Garante que o core do MindQuest (autoconhecimento) sempre esteja presente

2. **Objetivos Específicos:**
   - Usuário define quando quiser (não obrigatório)
   - Máximo 2 ativos simultaneamente
   - Prazo: 30, 45 ou 60 dias
   - Áreas: Finanças, Trabalho, Saúde, Relacionamentos, etc.

3. **Jornada Flexível:**
   - **Com objetivos específicos:** Conversas e quests direcionadas para as metas
   - **Sem objetivos específicos:** Conversas exploratórias, quests de autoconhecimento vinculadas ao objetivo padrão

### Relação Quests × Objetivos (N:N)

Uma quest pode impactar múltiplos objetivos simultaneamente:

| Tipo Quest | Objetivo Principal | Objetivos Secundários |
|------------|-------------------|----------------------|
| **Reflexão Diária** | Padrão (Evolução Pessoal) | — |
| **TCC/Estoicismo** | Padrão (Evolução Pessoal) | — |
| **Sabotador** | Padrão (Evolução Pessoal) | Objetivo relacionado ao contexto |
| **Personalizada** | Objetivo mais relacionado | Outros objetivos impactados |

**Tipo de Impacto:**
- `direto` — quest foi criada especificamente para este objetivo
- `indireto` — quest contribui para este objetivo como efeito colateral

**Exemplo:** Quest "Gratidão Diária contra Sr. Inquieto"
- Impacto direto → Evolução Pessoal (sabotador)
- Impacto indireto → Meu Próprio Negócio (foco no app)

### Tabelas de Objetivos

**`usuarios_objetivos`:** Objetivos configurados pelo usuário - área, detalhamento, prazo, progresso.

**`quest_objetivos`:** Relação N:N entre quests e objetivos - permite uma quest impactar múltiplos objetivos com tipo de impacto (direto/indireto).

**`checkins_objetivos`:** Check-ins semanais de progresso na vida real.

---

## 4. Tabelas do Sistema de Quests

**`usuarios_quest`:** Quest pai - ID, usuário, catálogo, status (disponível/ativa/inativa), contexto (sabotador, insight), objetivo principal. Uma quest pode ter múltiplas ocorrências e impactar múltiplos objetivos via `quest_objetivos`.

**`quests_recorrencias`:** Ocorrências planejadas e concluídas - Data, status (pendente/concluída/perdida), referência à quest pai. Uma linha por dia.

**`usuarios_conquistas`:** Pontos e progresso consolidados - XP total, nível, estágio da jornada, sequência de dias (streak). Atualizado automaticamente.

**`usr_chat`:** Histórico completo de conversas - Informações completas das conversas realizadas pelo WhatsApp. Base para geração de insights e quests.

**Quests de Conversa/Reflexão Diária:** Tratadas como quests especiais permanentes. Sempre ativas, nunca expiram, recorrência diária automática. Não precisam estar em `quests_recorrencias` (planejamento), apenas na tabela pai `usuarios_quest`. Em `quests_recorrencias` entram apenas conversas já realizadas, sempre como concluídas. Usuario não pode concluir manualmente.

---

## 5. Telas do Sistema de Quests

**PainelQuestsPageV13:** Tela principal - 3 abas (A Fazer/Fazendo/Feito). Ativa quests, visualiza progresso, acessa detalhes.

**QuestDetailPageV13:** Detalhes e execução - Informações completas, recorrências planejadas, histórico. Permite concluir ocorrências por data. **Quests em status "disponivel" (a fazer) podem ser concluídas diretamente sem necessidade de planejamento prévio.** O sistema cria automaticamente o registro em `quests_recorrencias` quando a quest é concluída, mesmo sem recorrências planejadas. Isso é especialmente útil para quests de execução única (sem recorrência).

**PlanejamentoQuestsPage:** Planejamento e ativação - Define recorrências (dias da semana) ao ativar quest. Visualiza disponíveis.

**CardWeeklyProgress:** Progresso semanal - XP da semana, streak, quests concluídas vs planejadas. Integrado no dashboard.

---

## 6. Workflows n8n

**`sw_criar_quest`:** Criação automática - Gera 3 quests (personalizada, sabotador, TCC) baseadas em conversas/insights. Entrada: usuário_id. Saída: 3 quests com status 'disponivel'.

**`sw_xp_quest`:** Persistência e cálculo de XP - Cria/atualiza quests, calcula XP ao concluir, distribui pontos, atualiza conquistas, chama cálculo de jornada.

**`sw_xp_conversas`:** XP de conversas diárias - Calcula pontos por conversas e sequência, cria/atualiza quest reflexão diária (sempre ativa), processa últimos 45 dias.

**`sw_calcula_jornada`:** Nível e estágio - Calcula nível por XP, valida requisitos, determina estágio (1-4), atualiza perfil.

**`job_batch_generate_quests`:** Geração em lote - Executa criação automática para múltiplos usuários periodicamente.

**`job_batch_xp_quest`:** Processamento em lote - Processa conclusões pendentes e recalcula XP/jornada.

**`job_batch_xp_conversas`:** Processamento em lote - Processa as conversas e recalcula XP/jornada.
---

## 7. Webhooks e APIs

**`webhook_quests`:** Listagem e snapshot - GET retorna quests do usuário (card/snapshot), POST atualiza status múltiplas quests.

**`webhook_concluir_quest`:** Conclusão - Marca ocorrência como concluída, dispara cálculo XP e jornada. **Funciona para quests em qualquer status:** se a quest estiver em "disponivel" (a fazer) e não tiver recorrências planejadas, o sistema cria automaticamente um registro em `quests_recorrencias` com status "concluida" para a data de conclusão. Isso permite concluir quests de execução única ou concluir antes de planejar recorrências.

**`webhook_ativar_quest`:** Ativação - Altera status para 'ativa', cria registros em `quests_recorrencias` conforme dias definidos.

**`webhook_quest_detail`:** Detalhes completos - Retorna recorrências, histórico, contexto.

**`webhook_progresso_semanal`:** Progresso semanal - Retorna XP, streak, quests concluídas vs planejadas da semana.

**`webhook_criar-quest`:** Criação manual - Permite usuário criar quest personalizada via App.

**`webhook_evoluir_stats`:** Estatísticas de evolução - Retorna total de conversas, ações concluídas e XP total do usuário.

**APIs Vercel:** Proxies frontend → webhooks n8n - `/api/quests`, `/api/concluir-quest`, `/api/ativar-quest`, `/api/criar-quest`, `/api/card/quests`, `/api/evoluir-stats`.

---

## 8. Regras de Cálculo - Conversas, Ações e Pontos (XPs)

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

## 9. Pendências

### Banco de Dados
- [x] Campo `objetivo_id` em `usuarios_quest` (objetivo principal)
- [x] Tabela `quest_objetivos` (relação N:N)
- [x] Objetivo padrão "Evolução Pessoal" no catálogo
- [x] Trigger para criar objetivo padrão no cadastro

### Workflows n8n
- [x] `sw_criar_quest`: Buscar objetivos ativos e vincular quests
- [x] `sw_xp_quest`: Persistir `objetivo_id` e relações N:N
- [ ] `sw_chat_interations_v2`: Passar objetivos ativos para o agente

### Frontend
- [ ] Quest detail: Exibir objetivos vinculados
- [ ] Painel de quests: Filtrar por objetivo

---

**Última atualização:** 2025-11-30 13:45

