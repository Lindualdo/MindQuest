# Rotinas de Insights - Documento Executivo

**Data:** 2025-11-27
**Status:** Ativo
**Versão:** 1.0

## Visão Geral

Insights são análises personalizadas geradas automaticamente após cada conversa do usuário, identificando padrões, oportunidades de melhoria e ações práticas.

## Fluxo de Geração

**1. Disparo Automático:** Após conclusão de uma conversa (8 interações), o workflow `sw_expert_insights_acionaveis` é executado automaticamente.

**2. Análise por IA:** O workflow utiliza Claude (via OpenRouter) para analisar a conversa completa e gerar insights acionáveis, incluindo recursos sugeridos (técnicas, reflexões, ferramentas, dicas).

**3. Persistência:** Insights são gravados na tabela `insights` com campos: tipo, categoria, titulo, descricao, prioridade, feedback (positivo, desenvolvimento, motivacional) e recursos_sugeridos.

**4. Exibição:** Insights aparecem no dashboard do usuário, podendo ser visualizados em detalhes e convertidos em quests personalizadas.

## Relação com Quests

Cada insight pode gerar até 2 quests personalizadas através dos recursos sugeridos. O usuário escolhe quais ações criar, e o sistema previne duplicatas por resource_index.

## Workflows Relacionados

- `sw_expert_insights_acionaveis`: Geração e persistência de insights
- `webhook_insights`: Consulta de insights detalhados
- `webhook_criar_quest_manual`: Criação de quests a partir de insights

