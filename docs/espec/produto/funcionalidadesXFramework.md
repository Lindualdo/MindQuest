# MindQuest - Funcionalidades

## 🗣️ CONVERSAR (Motor do Sistema)

### Interação com Mentor IA
- Conversas guiadas via WhatsApp e Web App
- Foco em desenvolvimento pessoal, padrões mentais e objetivos
- Sistema de reflexão diária automática
- Detecção de bloqueios e dificuldades nas ações
- Cálculo automático de XP por conversas (`sw_xp_conversas`)

### Análise de Conversas
- Processamento automático de mensagens
- Extração de contexto emocional e comportamental
- Log de conversas para histórico (`usr_chat`)
- Controle de processamento por experts (`log_experts`)

---

## 🧠 ENTENDER (Análise Automatizada)
- todos esses dados são gerados no (`log_experts`) baseado nas conversas (`usr_chat`)

### Dashboard Emocional
- **Roda de Emoções** baseada em Plutchik (8 emoções primárias)
- **Análise de Humor** via média ponderada de emoções
- **Análise de Energia** baseada em PANAS
- Visualização em tempo real do estado emocional

### Detecção de Padrões Mentais
- **Sabotadores Ativos** identificados automaticamente
- Perfil de sabotador mais ativo
- Histórico de padrões detectados (`usuarios_sabotadores`)
- Regras específicas por tipo de sabotador

### Inteligência Gerada
- **Insights Personalizados** baseados em análise de dados
- Recomendações automáticas de ações
- Base científica vinculada aos insights
- Armazenamento de insights (`insights`)

### Perfil de Personalidade
- Análise baseada em Big Five
- Mapeamento de traços comportamentais

---

## ⚡ AGIR (Execução)

### Sistema de Quests Gamificado
- **XP por Quest Concluída:** 10 XP base
- **Níveis e Títulos** baseados em XP total (`jornada_niveis`)
- **Limite Diário:** máximo 3 quests/dia (exceto reflexão diária)
- Sistema de substituição de quests disponíveis

### Tipos de Quests
1. **Reflexão Diária** (`reflexao_diaria`)
   - Quest inicial criada automaticamente
   - Conversa com assistente de reflexão
   - Recorrência diária
   - Prioridade alta

2. **Quest Hub** (`sw_quest_hub`)
   - Quests baseadas em objetivos configurados
   - Integração com áreas da vida
   - Múltiplos contextos (objetivo, sabotador, mentalidade)

3. **Quest de Sabotador** (`sw_quest_sabotador`)
   - Ações para neutralizar sabotadores ativos

4. **Quest de Mentalidade** (`sw_quest_mentalidade`)
   - Mudança de padrões mentais

5. **Quest de Objetivos** (`sw_quest_objetivos`)
   - Ligadas diretamente aos objetivos do usuário
   - Impacto direto e indireto

6. **Quest Personalizada** (`sw_quest_personalizada`, `quest_custom`)
   - Criadas sob demanda pelo mentor
   - Configuração flexível de contexto

### Gestão de Quests
- **Status:** disponível, ativa, concluída, inativa
- **Prioridade:** alta, média, baixa
- **Recorrência:** única, diária, semanal
- **Prazo:** início e fim configuráveis
- **Áreas da Vida** vinculadas (`area_vida_id`)
- **Objetivos** primários e secundários (`quest_objetivos`)

### Execução e Validação
- Mentor valida progresso via conversa
- Detecção de bloqueios em ações
- Reativação de quests pausadas
- Controle de recorrências (`quests_recorrencias`)

### Workflows de Gestão
- `sw_xp_quest` - Inserir/atualizar quests e calcular XP
- `sw_criar_quest` - Orquestração de criação de quests
- Webhooks para interface (`webhook_concluir_quest`)

---

## 📈 EVOLUIR (Visão Macro)

### Progresso e Conquistas
- **XP Total Consolidado** (`usuarios_conquistas`)
- **Breakdown de XP:** base + bônus
- **Níveis de Jornada** com títulos progressivos
- **Total de Quests Concluídas** (geral e personalizadas)

### Sequências e Engajamento
- **Sequência Atual** de dias consecutivos
- **Sequência Recorde** pessoal
- **Status da Sequência** (ativa, pausada, perdida)
- Metas de sequência configuráveis

### Objetivos e Impacto
- **3 Objetivos Ativos:** 1 padrão + 2 configurados
- Progresso mensurável por objetivo
- Vinculação de quests aos objetivos
- Impacto direto e indireto medido

### Notificações e Motivação
- Sistema de notificações configurável (`notificacoes`)
- Log de envios para controle de reenvio (`notificacoes_log`)
- Celebração de conquistas pelo Mentor
- Notificações de progresso e marcos

### Visão Histórica
- Histórico completo de conversas
- Registro de insights gerados ao longo do tempo
- Evolução de sabotadores e padrões
- Progresso semanal e mensal

### Workflows de Suporte
- `sw_calcula_jornada` - Atualiza níveis e progresso
- `sw_mentor_notificacoes` - Gerencia envio de notificações

---

## 🔧 Recursos Transversais

### Infraestrutura
- PostgreSQL como banco principal
- n8n para automações e workflows
- Sub-workflows para modularidade (`sw_*`)
- Webhooks para integrações (`webhook_*`)

### Dados e Controle
- Versionamento de estados
- Logs de processamento
- Controle de transações
- Validação de entrada de dados


# MindQuest - Funcionalidades (Visão Usuário)

## 🗣️ CONVERSAR
- Conversar com Mentor IA (WhatsApp/Web)
- ver resumos das conversa e fazer anotações
- Reflexão diária guiada
- Relatar progresso de ações
- Pedir ajuda com bloqueios
- insights personalizados

## 🧠 ENTENDER
- Dashboard - gráficos - visão 360 da mente
- Roda das emoções (Plutchik)
- Níveis de Humor e energia (PANAS)
- Sabotadores mais ativos - padrão de pensamento - contramedidas - Shirzadi Chamini
- Padrões de comportamento - personalidade - BIg Five

## ⚡ AGIR
- Receber quests personalizadas
- Marcar quests como concluídas
- Ganhar pontos e subir de nível
- Configurar recorrencias de quests (diárias/semanais)

## 📈 EVOLUIR
- Configurar objetivos
- Acompanhar progresso
- Notificações de progresso
- Fazer anotações semanal por objetivos
- ver ações executadas por objetivos
- ver ações executadas por sabotadores
- ver as conquistas na vida (guiadas no MindQuest)