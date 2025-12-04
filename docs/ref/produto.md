# MindQuest - Produto

**Data:** 2025-12-04

## Visão Geral

Sistema gamificado de **monitoramento emocional** baseado na **Roda de Emoções de Plutchik**.

## Versão Atual

**v1.3** - Mobile-first, design moderno

## Funcionalidades Core

### 1. Conversar (Mentor IA)
- Conversas guiadas via WhatsApp/Web
- Mentor inteligente que entende contexto
- Análise emocional em tempo real

### 2. Entender (Dashboard Emocional)
- Roda de emoções (Plutchik)
- Análise de humor e energia
- Insights personalizados
- Sabotadores detectados

### 3. Agir (Quests)
- Sistema gamificado de ações
- XP e níveis
- Quests baseadas em objetivos
- Conquistas e progresso

### 4. Evoluir (Jornada)
- Progresso semanal
- Níveis e evolução
- Histórico de conquistas

## Conceitos Principais

### Humor
Calculado por média ponderada de emoções (últimos 7 dias)

### Energia
Baseada em sabotadores ativos + check-ins

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
4. **XP de quests** → 100 XP por quest concluída
5. **Níveis** → Sistema de progressão baseado em XP total

## Documentação Completa

Ver `docs/espec/produto/definicao_produto.md` para detalhes completos.

