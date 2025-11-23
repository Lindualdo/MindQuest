# Resumo do Entendimento — Quests no MindQuest v1.3.5

**Data:** 2025-11-23 08:01  
**Última atualização:** 2025-11-23 12:27  
**Versão:** 1.3.5  
**Objetivo:** Documentar entendimento consolidado sobre o sistema de Quests para refactor

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
- **Planejamento:** `usuarios_quest.recorrencias` (JSONB) — apenas planejamento
  - Estrutura: `{ tipo, janela: { inicio, fim }, dias: [{ data, xp_previsto }] }`
  - **Importante:** Não contém status de execução (apenas dados de planejamento)
- **Execução:** `conquistas_historico.detalhes->ocorrencias[]` — histórico real de conclusões
  - Estrutura: `{ ocorrencias: [{ data_planejada, data_concluida, data_registrada, xp_base, xp_bonus }], total_concluidas }`
  - **Verificação de conclusão:** Compara `COUNT(recorrencias->dias[])` (planejado) vs `total_concluidas` (executado)
- **Consolidação:** `usuarios_conquistas` — pontuação total para nível

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
2. **Aprovação/Planejamento:** Quando usuário aprova/ajusta recorrências → `fazendo`
   - **Nota:** Interface de aprovação será criada no futuro
   - Por enquanto, sistema trata apenas `fazendo` e `feito`
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

## 5. Quests Padrão do Sistema (Usuário Pode Mudar)

### Padrões Automáticos
- **Quest recorrente de sistema (sabotador):** Sempre presente, relacionada ao sabotador mais ativo
- **Quest de conversa diária:** Meta automática (1 conversa/dia = 15 pts base)

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

## Status Atual vs Planejado

### ✅ Implementado
- Conversas, insights e geração de quests
- Sistema de pontuação (XP base + bônus)
- Progresso semanal (card na home)
- Painel de quests com detalhes
- **Sistema de estágios da quest:** `a_fazer`, `fazendo`, `feito`
- **Separação planejamento/execução:** `recorrencias` (planejamento) vs `conquistas_historico.detalhes` (execução)
- **Verificação de conclusão:** Compara planejado vs executado automaticamente

### ⏳ A Implementar
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

