# Especificação: Motor de Criação de Quests (v2.0)

**Data:** 2025-12-22
**Status:** Definição de Alto Nível

## 1. Visão Geral
Refatoração do sistema de geração de quests para um modelo de **Agentes Especialistas Roteados**. O objetivo é aumentar a precisão científica (TCC/Estoicismo) e a personalização baseada no momento da jornada do usuário, respeitando o framework **MindQuest (Conversar → Entender → Agir → Evoluir)**.

## 2. Regras de Negócio (Fluxo da Jornada)

### 2.1 Fase de Onboarding
*   **Regra:** Nos primeiros 3 dias de interação, o sistema **não gera quests**.
*   **Objetivo:** Focar 100% no "Conversar" e "Entender". O Mentor deve explorar reflexões, valores e dores sem exigir ações práticas imediatas.

### 2.2 Fase de Estruturação (Pós-Onboarding)
*   **Regra:** Após o 3º dia, o foco muda para a definição e priorização de **Objetivos**.
*   **Condição:** Quests de objetivos só começam a ser criadas após o usuário ter objetivos claros e alinhados com seus valores.

### 2.3 Prioridade de Mentalidade
*   **Regra:** Em qualquer ponto da jornada, se detectado **Humor Baixo**, **Energia Baixa** ou **Sabotadores Ativos**, o sistema deve priorizar quests de **Mentalidade**.
*   **Ação:** Quests de objetivos são pausadas ou reduzidas para dar lugar à regulação emocional e neutralização de sabotadores.

### 2.4 Limites e Dinâmica
*   **Limite Padrão:** Máximo de 2 quests dinâmicas por dia (excluindo a Reflexão Diária).
*   **Exceção (Solicitação):** Se o usuário pedir uma quest explicitamente, ela é criada com prioridade máxima, ignorando o limite diário (movendo excedentes para fila).

## 3. Arquitetura: Roteamento de Agentes

O sistema deixa de ser um prompt único e passa a ser um ecossistema de sub-workflows:

### 3.1 Router (O Cérebro)
Analisa o contexto da mensagem, estado emocional e fase da jornada para decidir qual(is) agente(s) chamar.

### 3.2 Agentes Especialistas
1.  **Agente quest_Mente:** 
    *   Foco: Regulação emocional (Humor/Energia).
    *   Base: TCC (Reestruturação Cognitiva) e Estoicismo (Dicotomia do Controle).
    *   Gatilho: Contexto da mensagem + Baixos índices emocionais.
2.  **Agente quest_Sabotador:**
    *   Foco: Identificar e neutralizar padrões mentais específicos.
    *   Base: Técnicas de Inteligência Positiva.
3.  **Agente quest_objetivo:**
    *   Foco: Transformar objetivos em micro-ações (Quests).
    *   Gatilho: Contexto da conversa deve conter progresso ou plano relacionado a um objetivo ativo.
4.  **Agente quests_custom:**
    *   Foco: Atender pedidos diretos do usuário.
    *   Gatilho: Intenção explícita no chat.

## 4. Restrições Críticas

*   **Contexto Obrigatório:** NUNCA criar quests genéricas. Se não houver evidência clara na conversa atual para uma quest de objetivo, o agente retorna `null`.
*   **Anti-Duplicação:** Regra rigorosa para evitar quests repetidas (mesmo código ou conceito) de sabotadores ou catálogo em um intervalo de 48h.
*   **Diálogo de Retenção:** O Mentor deve monitorar o progresso. Se o usuário não realiza as quests, o Mentor deve parar de criar novas e iniciar uma conversa para entender o bloqueio.

## 5. Framework de Saída (JSON)
- apenas os campos essenciais para gravar a quest