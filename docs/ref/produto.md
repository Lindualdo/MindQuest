# MindQuest - Produto

**Data:** 2025-12-04

## Visão Geral

Plataforma de desenvolvimento pessoal que transforma **conversas em ações práticas**. Identifica padrões mentais que travam o progresso e oferece micro-ações personalizadas (quests) para mudança comportamental.

## Framework MindQuest

**CONVERSAR → ENTENDER → AGIR → EVOLUIR**

### 1. CONVERSAR (Motor do Sistema)
- Mentor IA conduz conversas guiadas via WhatsApp/Web
- Foco em desenvolvimento pessoal, padrões mentais e objetivos
- Impulsiona todo o restante do sistema
- Prepara contexto rico para análise automatizada

### 2. ENTENDER (Análise Automatizada)
- Experts detectam: emoções, humor, energia, sabotadores
- Roda de emoções (Plutchik)
- Gera quests e insights personalizados
- Dashboard emocional em tempo real
- Perfil de personalidade (Big Five)

### 3. AGIR (Execução)
- Sistema gamificado de quests
- XP e níveis
- Mentor valida progresso e detecta bloqueios
- Ajuda a destravar dificuldades nas ações

### 4. EVOLUIR (Visão Macro)
- Medir se ações levam ao objetivo final
- Progresso semanal e histórico de conquistas
- Mentor celebra conquistas e motiva usuário
- Evolução pessoal mensurável

**Papel do Mentor:** Motor que impulsiona todo o sistema através de conversas guiadas, atuando principalmente em CONVERSAR, mas também apoiando em AGIR e EVOLUIR.

## Conceitos Principais

### Humor
Calculado por média ponderada de emoções

### Energia
Baseada no calculo de PANAS

### Sabotadores
Padrões mentais que bloqueiam progresso (ex: Procrastinador, Perfeccionista)

### Quests
Ações práticas baseadas em objetivos pessoais

### Insights
Recomendações geradas pela IA baseadas em análise de dados

## Regras de Negócio

1. **Workflows `sw_*`** → Exclusivos do agente IA (NUNCA alterar)
2. **Workflows `webhook_*`** → Para interface/APIs
3. **XP de conversas** → Calculado automaticamente pelo mentor
4. **XP de quests** → 10 XP por quest concluída
5. **Níveis** → Sistema de progressão baseado em XP total

## Documentação Completa

Ver `docs/espec/produto/` para detalhes completos.

