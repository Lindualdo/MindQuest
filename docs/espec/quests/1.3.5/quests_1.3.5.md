# Resumo do Entendimento — Quests no MindQuest v1.3.5

**Data:** 2025-11-23 08:01  
**Última atualização:** 2025-01-22 14:00  
**Versão:** 1.3.5  
**Objetivo:** Documentar entendimento consolidado sobre o sistema de Quests para refactor

> **📋 Ver também:** [Unificação de Conversas e Quests](./unificacao_conversas_quests.md) — Documentação detalhada da unificação implementada

---

## Visão Geral — Processo de Transformação MindQuest

O sistema MindQuest opera através de um **processo cíclico de transformação** que conecta reflexão, ação e progresso. As Quests ocupam um papel central neste processo, funcionando como a ponte entre a compreensão (insights) e a transformação real (execução).

### Fluxo Completo do Processo

```
┌─────────────────────────────────────────────────────────────────┐
│           PROCESSO DE TRANSFORMAÇÃO MINQUEST                    │
└─────────────────────────────────────────────────────────────────┘

  1. CONVERSA
     │
     │ Usuário conversa com o Assistente de Reflexão (IA)
     │ • Compartilha pensamentos, emoções, situações
     │ • Registro em: usr_chat
     │
     ▼
  2. INSIGHTS
     │
     │ Gerados com base nas conversas e relatos do usuário
     │ • Análise de perfil: emoções, Big Five, sabotadores
     │ • Identificação de padrões e oportunidades
     │ • Registro em: insights
     │
     ▼
  3. QUESTS
     │
     │ Geradas com base nas conversas + quest_catalogo
     │ • Micro-ações personalizadas pela IA
     │ • Conectam reflexão (conversas) com ação (execução)
     │ • Registro em: usuarios_quest (vinculado a quests_catalogo)
     │
     ▼
  4. AÇÕES / EXECUÇÃO
     │
     │ Usuário executa as quests (apoiado pelo Agente de Quest IA)
     │ • Micro-hábitos concretos e práticos
     │ • Instruções claras e fundamentadas
     │ • Registro de conclusões em: conquistas_historico
     │
     ▼
  5. PROGRESSO / TRANSFORMAÇÃO
     │
     │ Medido pelo sistema com gamificação
     │ • Progresso: XP, níveis, estágios da jornada
     │ • Transformação real: mudanças de comportamento
     │ • Feedback contínuo: atualização de insights e novas quests
     │ • Consolidação em: usuarios_conquistas
     │
     ▼
     └───► LOOP: Retorna para 1. CONVERSA (ciclo contínuo)
```

### Papel das Quests no Processo

**As Quests são o elemento transformador** que converte compreensão em mudança:

- **Entrada:** Recebem contexto de conversas e insights
- **Processamento:** Personalizam micro-ações do catálogo ao perfil do usuário
- **Saída:** Geram ações concretas que, quando executadas, produzem transformação
- **Feedback:** Progresso nas quests alimenta novos insights e quests futuras

### Componentes de Apoio

- **Assistente de Reflexão (IA):** Conduz conversas, coleta dados, identifica necessidades
- **Sistema de Insights:** Analisa conversas, gera conhecimento sobre o usuário
- **Agente de Quest (IA):** Personaliza quests do catálogo ao contexto do usuário
- **Gamificação:** Mede progresso, motiva execução, traça transformação

### Importância do Ciclo

**Sem Quests = Sem Transformação:** O sistema MindQuest só produz mudança real quando a reflexão (conversas) se converte em ação (quests executadas). As Quests são, portanto, o componente crítico que transforma o sistema de um mero diário reflexivo em uma ferramenta de transformação pessoal.

---

## 1. Conceito das Quests (Visão para o Usuário)

**Quests são micro-ações personalizadas sugeridas pela IA para transformar reflexão em ação.**

- **Objetivo:** Conectar conversas (reflexão) com execução (ações)
- **Características:** Micro-hábitos concretos, duração máxima 7 dias, personalizadas por IA
- **Importância:** Sem quests = sem transformação = sistema sem sentido

---

## 2. Tipos de Quests

### Por Recorrência
- **Recorrentes (diárias/semanais):** Micro-hábitos repetidos por período definido
- **Únicas:** Ações pontuais, execução única

### Por Origem
- **Sistema (sabotadores):** Sempre presente, relacionada ao sabotador mais ativo
- **Personalizadas:** Geradas a partir de insights e conversas
- **Pontuais:** Detectadas nas conversas (questões importantes para progresso)

---

## 3. Organização

### Estrutura Atual

#### Estágios da Quest (`quest_estagio`)
- **`a_fazer`:** Quest criada, aguardando aprovação/planejamento do usuário
- **`fazendo`:** Quest aprovada/planejada, com recorrências definidas (em execução)
- **`feito`:** Todas as recorrências foram concluídas

#### Status de Execução (`status`)
- **`pendente`, `ativa`, `concluida`, `vencida`, `cancelada`:** Status operacional da quest

#### Planejamento vs Execução

**⚠️ DISTINÇÃO CRÍTICA:**

- **`usuarios_quest.recorrencias`** (JSONB) — **PLANEJAMENTO / META**
  - **Propósito:** Recorrências da instância (quests planejadas)
  - **Estrutura:** `{ tipo, janela: { inicio, fim }, dias: [{ data, xp_previsto }] }`
  - **Conteúdo:** Apenas dados de planejamento (o que o usuário planejou fazer)
  - **Não contém:** Status de execução ou dados de conclusão
  - **Quando é atualizado:** Na criação/planejamento da quest

- **`conquistas_historico.detalhes`** (JSONB) — **EXECUÇÃO / CONQUISTAS**
  - **Propósito:** Ocorrências de quests concluídas (conquistas, XP) — **Apenas para cálculo de XP/progresso**
  - **Estrutura:** `{ ocorrencias: [{ data_planejada, data_concluida, data_registrada, xp_base, xp_bonus, usr_chat_id?, data_conversa? }], total_concluidas }`
  - **Conteúdo:** Histórico real de conclusões (o que o usuário realmente fez)
  - **Contém:** XP concedido, datas de conclusão, total de ocorrências concluídas
  - **Para conversas:** Inclui `usr_chat_id` e `data_conversa` para auditoria e rastreabilidade
  - **Quando é atualizado:** A cada conclusão de recorrência
  - **⚠️ IMPORTANTE:** Para conversas, a origem real dos dados está em `usr_chat` (não em `conquistas_historico`)

- **Verificação de conclusão:** Compara `COUNT(recorrencias->dias[])` (planejado em `usuarios_quest.recorrencias`) vs `total_concluidas` (executado em `conquistas_historico.detalhes`)

- **⚠️ REGRA CRÍTICA - Criação de Histórico:**
  - **Histórico só é criado quando há pelo menos 1 ocorrência concluída**
  - **NÃO existe histórico para quests sem conclusões** (quests apenas planejadas)
  - Quando criado: 1 registro em `conquistas_historico` por `usuarios_quest.id` (todas as recorrências concluídas em `detalhes->ocorrencias[]`)
  - Aplica-se a **TODAS as quests** (incluindo conversas)
  - Cada instância de quest tem um único histórico que acumula todas as recorrências concluídas

- **Consolidação:** `usuarios_conquistas` — pontuação total para nível (soma de todos os XP de `conquistas_historico`)

#### Relacionamentos Unificados
- **`usuarios_quest.catalogo_id`:** FK para `quests_catalogo.id` (busca XP do catálogo)
- **`conquistas_historico.usuarios_quest_id`:** FK para `usuarios_quest.id` (relacionamento unificado)
- **`conquistas_historico.meta_codigo`:** Mantido para compatibilidade (legado)
- **`conquistas_historico.tipo`:** `'quest'` ou `'conversa'` (mantido para contagem/filtros)

### Estágios da Jornada (Baseados em `jornada_niveis`)

O sistema usa a tabela `jornada_niveis` existente (10 níveis) e os agrupa em 4 estágios para orientar a geração de quests:

#### Estágio 1: Fundação (Níveis 1-3)
- **Níveis:** Despertar (0-100 XP), Clareza (100-240 XP), Coragem (240-440 XP)
- **Foco:** Autoconsciência básica, identificação de sabotadores, hábitos essenciais
- **Quests sugeridas:**
  - Reflexão diária (essencial)
  - Contramedidas básicas do sabotador ativo
  - Micro-ações de coragem
  - Identificação de pensamentos automáticos (TCC básica)
  - Gratidão específica (estoicismo básico)

#### Estágio 2: Transformação (Níveis 4-5)
- **Níveis:** Consistência (440-720 XP), Resiliência (720-1080 XP)
- **Foco:** Consolidação de hábitos, reestruturação cognitiva, práticas estruturadas
- **Quests sugeridas:**
  - Reestruturação cognitiva (TCC)
  - Registro de pensamentos (TCC)
  - Exposição gradual (TCC)
  - Reflexão sobre controle (estoicismo)
  - Contramedidas avançadas do sabotador
  - Reconhecimento de progresso

#### Estágio 3: Integração (Níveis 6-7)
- **Níveis:** Expansão (1080-1480 XP), Maestria (1480-1960 XP)
- **Foco:** Múltiplas áreas da vida, criação de quests próprias, técnicas avançadas
- **Quests sugeridas:**
  - Técnicas TCC avançadas (resolução de problemas, aceitação e compromisso)
  - Múltiplas contramedidas simultâneas
  - Práticas somáticas e integração corpo-mente
  - Quests personalizadas (quest_custom)
  - Boas práticas gerais (atividade física, conexão social)

#### Estágio 4: Mestria (Níveis 8-10)
- **Níveis:** Impacto (1960-2520 XP), Legado (2520-3200 XP), Transcendência (3200+ XP)
- **Foco:** Impacto social, projetos de longo prazo, autonomia completa
- **Quests sugeridas:**
  - Quests de impacto e compartilhamento
  - Projetos de longo prazo
  - Mentorias e apoio a outros
  - Práticas avançadas de todas as categorias
  - Autonomia total na criação de quests

### Fluxo de Estágios da Quest

1. **Criação:** Quest nasce como `a_fazer` com recorrências sugeridas em `recorrencias`
   - **Exceção:** Quest `reflexao_diaria` (conversas) nasce como `fazendo` (não precisa aprovação)
2. **Aprovação/Planejamento:** Quando usuário aprova/ajusta recorrências → `fazendo`
   - **Nota:** Interface de aprovação será criada no futuro
   - Por enquanto, sistema trata apenas `fazendo` e `feito`
   - **Conversas:** Já nascem em `fazendo`, usuário não pode alterar recorrências
3. **Conclusão:** Quando todas recorrências concluídas → `feito`
   - Verificação: `COUNT(recorrencias->dias[])` <= `conquistas_historico.detalhes->total_concluidas`

### Futuro (Planejado)
- **Slots:** Até 5 quests ativas simultaneamente (`quest_estagio = 'fazendo'`)
- **Interface:** Abas (A Fazer, Fazendo, Feito) com carrossel
- **Mapeamento:** IA consulta nível do usuário → identifica estágio da jornada → sugere quests do catálogo apropriadas

---

## 4. Como o Usuário Escolhe (Motivação)

### Atual
- Visualização no painel de quests
- Progresso semanal visível (card na home)
- Detalhes da quest com contexto (área da vida, sabotador, instruções)

### Futuro (Planejado)
- Escolha de quests prioritárias (banco de quests)
- Ajuste de objetivos e prioridades no app
- Assistente de suporte semanal (domingos) para planejamento
- Reboot de recorrências concluídas (reiniciar hábitos)

---

## 4.1. Detalhes da Quest (Tela de Instruções)

### Objetivo

A tela de detalhes da quest tem como objetivo **estimular e motivar o usuário a realizar as quests**, fornecendo informações completas que:
- Explicam os **benefícios** da quest
- Apresentam **fundamentos científicos** que validam a prática
- Oferecem **instruções claras** sobre como aplicar
- Disponibilizam **ferramentas e recursos** para suporte

### Acesso

- **Entrada:** Botão "Saber mais" em cada quest no painel (`PainelQuestsPageV13`)
- **Fluxo:** `openQuestDetail(questId)` → `apiService.getQuestDetail()` → `QuestDetailPageV13`
- **Endpoint:** `/quest-detail?user_id=...&quest_id=...` (webhook n8n: `webhook_quest_detail`)

### Fonte de Dados

**⚠️ ARQUITETURA ATUAL:**

As informações detalhadas são buscadas da tabela `quests_catalogo` via relacionamento:
- `usuarios_quest.catalogo_id` → `quests_catalogo.id`

**Campos disponíveis em `quests_catalogo`:**

1. **`base_cientifica`** (jsonb) — **FONTE ATUAL DE DADOS:**
   - `objetivo` → **Benefícios** da quest
   - `fundamentos` → **Referências científicas** (neurociência, TCC, estoicismo, etc.)
   - `como_aplicar` → **Instruções passo a passo** de execução
   - `links_referencias` → Array de links para referências externas
   - `tipo` → Tipo da técnica (ex: "tecnica")

2. **`instrucoes`** (jsonb) — **FONTE PRINCIPAL FUTURA:**
   - Campo destinado a ser a fonte principal de informações detalhadas
   - Atualmente vazio na maioria das quests
   - Estrutura ainda a ser definida

3. **Outros campos úteis:**
   - `categoria` → Categoria da quest
   - `dificuldade` → Nível de dificuldade (1-3)
   - `tempo_estimado_min` → Tempo estimado para execução
   - `descricao` → Descrição geral da quest

### Informações Exibidas

#### Seções Motivacionais

1. **Benefícios** (`base_cientifica.objetivo`):
   - Explica por que a quest é importante
   - Mostra os ganhos de executá-la
   - Estimula motivação intrínseca

2. **Referências Científicas** (`base_cientifica.fundamentos`):
   - Valida a prática com embasamento científico
   - Cita áreas de conhecimento (neurociência, TCC, estoicismo)
   - Aumenta confiança do usuário

3. **Como Aplicar** (`base_cientifica.como_aplicar` OU `instrucoes`):
   - Instruções passo a passo claras
   - Exemplos práticos
   - Facilita a execução

4. **Ferramentas e Recursos** (`instrucoes` OU `base_cientifica.links_referencias`):
   - Links de referência para aprofundamento
   - Ferramentas adicionais de apoio
   - Recursos complementares

#### Informações Contextuais

- **Área de vida** relacionada (se houver)
- **Sabotador** associado (se houver)
- **XP recompensa** ao concluir
- **Status** e progresso da quest
- **Botão de conclusão** (se pendente/ativa)

### Exemplos de Dados no Banco

**Quest: `micro_acao_coragem`:**
- **Objetivo:** "Quebrar padrões de medo e criar novos caminhos neurais"
- **Fundamentos:** "Neurociência: Quebra padrões neurais de medo/evitação, cria novos caminhos neurais (neuroplasticidade), fortalece autoconfiança"
- **Como aplicar:** "Identifique 1 ação que gera desconforto leve mas é importante. Exemplos: ligar para alguém, iniciar conversa difícil, dizer não, pedir ajuda. Execute mesmo com desconforto."

**Quest: `reconhecimento_progresso`:**
- **Objetivo:** "Reforçar comportamentos positivos e reduzir foco no que falta"
- **Fundamentos:** "TCC: Reforço positivo. Neurociência: Ativa sistema de recompensa (dopamina), reduz viés de negatividade"
- **Como aplicar:** "Ao final do dia, liste 1-3 micro-vitórias (mesmo pequenas). Reconheça 1 progresso específico em área importante. Agradeça por 1 coisa específica (não genérica)."

### Mudança Arquitetural

**⚠️ IMPORTANTE:**
- **ANTES:** Dados eram buscados de `insights` via `usuarios_quest.insight_id` (DEPRECADO)
- **AGORA:** Dados vêm exclusivamente de `quests_catalogo` via `usuarios_quest.catalogo_id`
- **Motivo:** Centralizar informações no catálogo para reutilização e consistência

### Implementação

- **Frontend:** `src/pages/App/v1.3/QuestDetailPageV13.tsx`
- **Backend:** Workflow n8n `webhook_quest_detail` (ID: `pTtnu2YVLGuV7IxM`)
- **Interface TypeScript:** `src/types/emotions.ts` → `QuestDetail`

> **📋 Documentação técnica completa:** Ver `data/analise_detalhes_quests_catalogo.md`

---

## 5. Quests Padrão do Sistema (Usuário Pode Mudar)

### Padrões Automáticos
- **Quest recorrente de sistema (sabotador):** Sempre presente, relacionada ao sabotador mais ativo
- **Quest de reflexão diária (`reflexao_diaria`):** Criada automaticamente se usuário não tiver quests
  - Recorrências para os dias restantes da semana (hoje até sábado)
  - Semana sempre de domingo a sábado
  - XP: 10 pontos (configurável no catálogo)

### Regras Específicas para Conversas (`reflexao_diaria`)

**⚠️ ARQUITETURA CRÍTICA - Origem dos Dados:**

1. **Origem real das conversas:** Tabela `usr_chat`
   - **Fonte de verdade:** Todos os dados da conversa estão em `usr_chat` (id, data_conversa, horario_inicio, horario_fim, total_interactions, etc.)
   - **Propósito:** Armazenar dados completos da conversa realizada pelo usuário

2. **`conquistas_historico` para conversas:** Apenas para cálculo de XP/progresso
   - **Propósito:** Visão focada em cálculo de XP e progresso (não é fonte de dados da conversa)
   - **Estrutura:** `tipo = 'conversa'`, `usuarios_quest_id` aponta para quest `reflexao_diaria`
   - **⚠️ REGRA CRÍTICA - Limite diário:** **Apenas 1 conversa por dia conta para XP**
     - Se o usuário tiver múltiplas conversas no mesmo dia, apenas a primeira (ou única selecionada) é contabilizada para pontuação
     - Todas as conversas são registradas em `usr_chat`, mas apenas 1 por dia gera ocorrência em `conquistas_historico`
     - Isso explica diferenças entre total de conversas em `usr_chat` vs ocorrências em `conquistas_historico`
   - **Ocorrências:** Cada ocorrência em `detalhes->ocorrencias[]` deve conter:
     - `data_concluida`: Data da conversa (extraída de `usr_chat.data_conversa`)
     - `data_planejada`: Data planejada (mesma que `data_concluida` para conversas)
     - `data_registrada`: Quando foi registrado no histórico
     - `xp_base`: XP concedido (buscado de `quests_catalogo.xp`)
     - `xp_bonus`: Sempre 0 (bônus desabilitado)
     - **⚠️ IMPORTANTE:** `usr_chat_id`: ID da conversa em `usr_chat` (para auditoria e rastreabilidade)
     - **⚠️ IMPORTANTE:** `data_conversa`: Data da conversa (para facilitar consultas e auditoria)

3. **`usuarios_quest` para conversas:** Criada para compatibilidade com outras quests
   - **Propósito:** Manter compatibilidade com o sistema unificado de quests
   - **Estrutura:** Quest `reflexao_diaria` criada automaticamente se usuário não tiver quests
   - **Relacionamento:** `conquistas_historico.usuarios_quest_id` → `usuarios_quest.id`

**Diferenças em relação a outras quests:**

1. **Estágio inicial:** Sempre criada com `quest_estagio = 'fazendo'` (não `a_fazer`)
   - Conversas não precisam de aprovação do usuário
   - Já nascem prontas para execução

2. **Recorrências fixas:** Usuário **não pode alterar** as recorrências
   - Meta: ser feita todos os dias da semana
   - Recorrências definidas automaticamente pelo sistema

3. **Histórico único:** Terá um único registro em `conquistas_historico` quando houver pelo menos 1 conversa concluída
   - `tipo = 'conversa'`
   - `usuarios_quest_id` aponta para a quest `reflexao_diaria`
   - Todas as ocorrências concluídas ficam em `detalhes->ocorrencias[]`
   - Campo `detalhes->total_concluidas` contabiliza todas as conversas concluídas
   - **⚠️ REGRA CRÍTICA:** Histórico só existe quando há conclusões
     - Se a quest `reflexao_diaria` tem conversas concluídas → **DEVE ter registro no histórico**
     - Se não tem conversas concluídas → NÃO tem registro no histórico
   - **⚠️ REGRA UNIFICADA:** Aplica-se a **TODAS as quests** (não apenas conversas)
     - Histórico criado apenas quando há pelo menos 1 recorrência concluída
     - Todas as recorrências concluídas da instância ficam em `detalhes->ocorrencias[]`

4. **Identificação:** Campo `config->conversa = true` para identificar quests de conversa

### Geração Automática
- **Inputs:** 
  - Nível do usuário (via `jornada_niveis`) → identifica estágio
  - Insights, áreas da vida, sabotadores, conversas recentes
  - Catálogo de quests (`quests_catalogo`) filtrado por estágio
- **Processo:** 
  1. `sw_criar_quest` consulta nível do usuário
  2. Mapeia nível → estágio (1-4)
  3. Consulta `quests_catalogo` filtrando por estágio apropriado
  4. IA personaliza quests do catálogo ao contexto do usuário
  5. `sw_xp_quest` persiste em `usuarios_quest` com `catalogo_id`
- **Limite:** Máximo 5 quests ativas simultaneamente (slots)

### Ajustes do Usuário
- Ativar/desativar quests planejadas
- Escolher prazo de recorrência (3, 5, 7, 10 ou 15 dias)
- Ajustar objetivos e prioridades no app

---

## Fluxo de Transformação

```
Conversas (WhatsApp)
    ↓
Insights (análise de perfil: emoções, Big Five, sabotadores)
    ↓
Quests (transformação: reflexão → ação)
    ↓
Ações (execução)
    ↓
Transformação do usuário
```

---

## Objetivos Principais das Quests

1. **Melhorar a mente:** Humor, energia, clareza, foco
2. **Contramedidas para sabotadores:** Trabalhar padrões mentais identificados
3. **Questões pontuais:** Ações importantes detectadas nas conversas

---

## Assistente de Suporte Semanal

- **Quando:** Aos domingos
- **Função:** Ajudar o usuário no plano da semana
- **Identificação automática:** Objetivos de curto e médio prazo
- **Ajuste manual:** Usuário pode ajustar objetivos e prioridades no app

---

## Sistema de Pontuação (XP)

### Regras Unificadas
- **XP Base:** Buscado de `quests_catalogo.xp` via `catalogo_id` em `usuarios_quest`
- **Valor padrão:** 10 XP para todas as quests (configurável por quest no catálogo)
- **Bônus:** Desabilitado por enquanto (0 XP bônus)
- **⚠️ CRÍTICO - Quest SEM catálogo:** **NÃO PERMITIDO** — Toda quest DEVE ter `catalogo_id`. Não há fallback de XP. Sistema não grava quests sem referência ao catálogo.
- **Conversas:** Tratadas como quests (`reflexao_diaria`), mesmo sistema de XP

### Estrutura de Dados
- **`quests_catalogo.xp`:** Campo que armazena XP de cada quest
- **`usuarios_quest.catalogo_id`:** Relacionamento com catálogo (FK para `quests_catalogo.id`)
- **`conquistas_historico.usuarios_quest_id`:** Relacionamento unificado (FK para `usuarios_quest.id`)
- **`conquistas_historico.meta_codigo`:** Mantido para compatibilidade (legado)

### Unificação Conversas/Quests
- **Tudo é quest:** Conversas agora são quests do catálogo (`reflexao_diaria`)
- **Mesma lógica:** Mesma estrutura de dados, mesma lógica de XP
- **Tipo mantido:** Campo `tipo` em `conquistas_historico` mantido como `'conversa'` ou `'quest'` apenas para contagem/filtros
- **Tabela removida:** `metas_catalogo` foi removida (XP agora vem de `quests_catalogo`)

> **📋 Detalhes completos:** Ver [Unificação de Conversas e Quests](./unificacao_conversas_quests.md)

---

## Status Atual vs Planejado

### ✅ Implementado
- Conversas, insights e geração de quests
- **Sistema de pontuação unificado:** XP buscado de `quests_catalogo.xp`
- **Unificação conversas/quests:** Tudo tratado como quest, mesma lógica
- **Quest inicial automática:** Cria `reflexao_diaria` se usuário não tiver quests
- Progresso semanal (card na home)
- Painel de quests com detalhes
- **Tela de detalhes da quest:** Exibe informações do catálogo para motivar execução
- **Sistema de estágios da quest:** `a_fazer`, `fazendo`, `feito`
- **Separação planejamento/execução:** `recorrencias` (planejamento) vs `conquistas_historico.detalhes` (execução)
- **Verificação de conclusão:** Compara planejado vs executado automaticamente

### ⏳ A Implementar
- **Detalhes da quest:** Integração completa com dados do catálogo (benefícios, fundamentos científicos, instruções)
- Escolha de quests prioritárias (banco de quests)
- Interface de aprovação/planejamento de recorrências
- Gestão de slots (máx. 5 ativas com `quest_estagio = 'fazendo'`)
- Assistente de suporte semanal
- Reboot de recorrências concluídas

---

## Próximos Passos para o Refactor

1. Revisar estrutura de dados e workflows n8n
2. Implementar sistema de estágios e slots
3. Criar interface de escolha/ativação de quests
4. Integrar assistente de suporte semanal
5. Melhorar organização visual (abas, carrossel)

---

*Documento criado para consolidar entendimento antes do refactor do sistema de Quests*

