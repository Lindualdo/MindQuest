# Especificação Funcional · Sistema de Quests MindQuest

## Objetivo do sistema

- Transformar o engajamento diário com o assistente em uma jornada clara de progresso.
- Manter o usuário orientado por metas objetivas, com recompensas graduais e mensagens consistentes.
- Garantir que todo novo hábito ou desafio parta de contexto real das conversas, evitando sobrecarga.

## Glossário essencial

- **Quest**: missão ativa atribuída ao usuário. Pode representar metas de sequência de conversas ou compromissos personalizados.
- **Ciclo**: período contínuo de acompanhamento do usuário. Sempre começa na Meta 1 de sequência.
- **Assistente de Conversa**: IA principal que conduz diálogos e identifica oportunidades de novas quests.
- **Assistente de Suporte**: IA que envia lembretes e acompanha a execução das quests personalizadas aprovadas.

## Tipologia de quests

| Tipo | Finalidade | Origem | Limite ativo | Como progride | Quando encerra |
|------|------------|--------|--------------|----------------|----------------|
| **Sequência de Conversas** | Sustentar o hábito diário de conversar com o assistente. | Automática, baseada no registro de conversas concluídas. | Uma por vez (meta corrente). | Cumprindo o número de conversas consecutivas da meta ativa. | Ao completar a meta ou exceder o intervalo máximo sem conversar. |
| **Personalizada** | Traduzir insights, sabotadores ou oportunidades identificadas nas conversas em ações concretas. | Recomendada pelo Assistente de Conversa; usuário aceita e configura. | Até 4 simultâneas (ativas ou pendentes). | Progresso definido pelo usuário (meta, duração, recorrência). | Concluída pelo usuário/assistente, vencida pelo prazo ou cancelada. |

## Regras comuns

- Cada quest possui status (`pendente`, `ativa`, `concluída`, `vencida`, `cancelada`, `reiniciada`) exibido no painel.
- O usuário visualiza três agrupamentos no painel: **Em andamento**, **Concluídas recentemente**, **Arquivadas**.
- XP e conquistas são utilizados apenas para reforçar marcos relevantes; mensagens focam em entendimento do progresso, não em pontuação isolada.
- Antes de propor nova quest, o Assistente de Conversa consulta a lista existente para evitar duplicidade ou sobrecarga.

## Quests de sequência de conversas

- **Escada de metas**: 3, 5, 7, 10, 15, 20, 25 e 30 conversas consecutivas.
- **Progressão**: concluir uma meta desbloqueia automaticamente a próxima; nenhuma meta é pulada e múltiplas conversas no mesmo dia contam para a sequência.
- **Reset**: ficar mais de 24h sem conversar (intervalo máximo configurável) encerra a meta ativa com status `reiniciada`, registra o recorde no histórico e reinicia o ciclo na Meta 1 a partir da próxima conversa.
- **Recordes**: o painel mostra streak atual, melhor streak e meta ativa. Conquistas destacam quantas vezes cada meta foi completada.
- **Recompensa**: cada meta concede uma recompensa crescente (mensagem comemorativa + XP associado) imediatamente após a conversa que completa a sequência.

## Quests personalizadas

- **Descoberta**: o Assistente de Conversa avalia sabotadores, intenções e hábitos descritos; quando identifica oportunidade, sugere uma nova quest com justificativa.
- **Aprovação do usuário**: o usuário escolhe aceitar ou não; ao aceitar, define prioridade (baixa/média/alta), data de início, prazo e recorrência (única, diária, semanal).
- **Limite ativo**: máximo de 4 quests simultâneas entre pendentes e ativas; se o limite for atingido, o assistente oferece replanejamento antes de sugerir novas missões.
- **Acompanhamento**: o Assistente de Suporte agenda lembretes conforme prioridade e plano (Free ou Premium) e coleta feedback diário.
- **Revisão**: se o usuário ignorar três lembretes consecutivos, o assistente pergunta se deseja reagendar, arquivar ou ajustar escopo.
- **Encerramento**: uma quest pode ser concluída pelo usuário, pelo assistente (após confirmação de execução) ou expirada caso o prazo termine sem ação. Recorrências geram nova instância apenas após a conclusão da anterior ou após ajuste solicitado.

## Níveis de evolução

| Nível | Nome | XP mínimo | XP próximo nível | Conversas acumuladas (referência) | Descrição |
|-------|------|-----------|------------------|------------------------------------|-----------|
| 1 | Recém-Convocado | 0 | 300 | 0–10 | Inicia as conversas e conhece a jornada. |
| 2 | Explorador Diário | 300 | 750 | 10–25 | Mantém presença diária e entende as quests. |
| 3 | Conversador Assíduo | 750 | 1350 | 25–45 | Sustenta ritmo estável e ativa as primeiras missões personalizadas. |
| 4 | Companheiro Constante | 1350 | 2100 | 45–70 | Consolida rotina e raramente falha em conversar. |
| 5 | Parceiro de Jornada | 2100 | 3000 | 70–100 | Ajusta quests personalizadas e mantém engajamento equilibrado. |
| 6 | Mentor da Tribo | 3000 | 4100 | 100–135 | Integra ações recorrentes e compartilha aprendizados. |
| 7 | Guardião do Ritmo | 4100 | 5400 | 135–180 | Quase não quebra sequência; se quebra, retoma rápido. |
| 8 | Referência MindQuest | 5400 | 6900 | 180–230 | Inspira pela consistência nas conversas e nas quests aceitas. |
| 9 | Embaixador de Conversas | 6900 | 8600 | 230–285 | Sustenta múltiplas quests ativas com naturalidade. |
| 10 | Guardião da Comunidade | 8600 | — | 285+ | Torna-se exemplo do ciclo MindQuest e ajuda na evolução coletiva. |

## Interação no painel

- Destaques principais: streak atual (`conversas`), meta ativa, tempo restante e recorde.
- Lista de quests personalizadas mostra título, prioridade, frequência, status e próxima ação sugerida.
- Ações rápidas: finalizar, reagendar, alterar frequência, arquivar.
- Mensagens motivacionais utilizam linguagem consistente com o ciclo atual (ex.: “Estamos na meta de 10 conversas! Falta 1 conversa.”).

## Métricas de acompanhamento

- Taxa de dias com conversa vs. metas concluídas.
- Distribuição de quests personalizadas por status e prioridade.
- Tempo médio para conclusão ou abandono de quests personalizadas.
- Quantidade de resets por usuário e tempo de recuperação (dias até retomar Meta 1).

## Pendências para validação futura

- Ajustar política de XP e níveis para refletir a nova estrutura, mantendo coerência com o histórico.
- Definir mensagens específicas por plano (Free/Premium) para limites de lembretes e suporte.
- Avaliar se haverá eventos temporários (campanhas) reutilizando o mesmo modelo de quests personalizadas.
