# Resumo do Entendimento — Quests no MindQuest v1.3.5

**Data:** 2025-11-23 08:01  
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
- **Status:** `pendente`, `ativa`, `concluida`, `vencida`, `cancelada`
- **Planejamento:** `usuarios_quest.recorrencias` (JSONB) — snapshot do planejamento
- **Execução:** `conquistas_historico.detalhes` — histórico real de conclusões
- **Consolidação:** `usuarios_conquistas` — pontuação total para nível

### Futuro (Planejado)
- **Estágios:** `planejada` → `ativa` → `concluida`
- **Slots:** Até 5 quests ativas simultaneamente
- **Interface:** Abas (Planejadas, Ativas, Concluídas) com carrossel

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
- **Inputs:** Insights, áreas da vida, sabotadores, conversas recentes
- **Processo:** `sw_criar_quest` → agente IA gera quests → `sw_xp_quest` persiste
- **Limite:** Máximo 4 quests ativas/pendentes (considerando as atuais)

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

### ⏳ A Implementar
- Escolha de quests prioritárias (banco de quests)
- Sistema de estágios (planejada → ativa → concluída)
- Gestão de slots (máx. 5 ativas)
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

