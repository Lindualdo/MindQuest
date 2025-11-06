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
- XP é calculado com base em ações concretas: **200 XP** por conversa concluída (+50 XP por dia consecutivo até 15 dias) e **150 XP** por quest personalizada concluída (+50 XP extras por repetição quando recorrente, até 15). Metas de sequência concedem bônus premium adicionais (+100 a +500 XP).
- Antes de propor nova quest, o Assistente de Conversa consulta a lista existente para evitar duplicidade ou sobrecarga.

## Quests de sequência de conversas

- **Escada de metas**: 3, 5, 7, 10, 15, 20, 25 e 30 conversas consecutivas; cada conclusão concede um bônus premium (+100 até +500 XP) somado ao XP diário acumulado.
- **Progressão**: concluir uma meta desbloqueia automaticamente a próxima; nenhuma meta é pulada e múltiplas conversas no mesmo dia contam para a sequência.
- **Reset**: ficar mais de 24h sem conversar (intervalo máximo configurável) encerra a meta ativa com status `reiniciada`, registra o recorde no histórico e reinicia o ciclo na Meta 1 a partir da próxima conversa.
- **Recordes**: o painel mostra streak atual, melhor streak e meta ativa. Conquistas destacam quantas vezes cada meta foi completada.
- **Recompensa**: cada conversa rende 200 XP; dias consecutivos somam +50 XP (até 15). Ao completar a meta vigente, o usuário recebe o bônus premium correspondente e o painel celebra o marco.

## Quests personalizadas

- **Descoberta**: o Assistente de Conversa avalia sabotadores, intenções e hábitos descritos; quando identifica oportunidade, sugere uma nova quest com justificativa.
- **Aprovação do usuário**: o usuário escolhe aceitar ou não; ao aceitar, define prioridade (baixa/média/alta), data de início, prazo e recorrência (única, diária, semanal).
- **Limite ativo**: máximo de 4 quests simultâneas entre pendentes e ativas; se o limite for atingido, o assistente oferece replanejamento antes de sugerir novas missões.
- **Acompanhamento**: o Assistente de Suporte agenda lembretes conforme prioridade e plano (Free ou Premium) e coleta feedback diário.
- **Revisão**: se o usuário ignorar três lembretes consecutivos, o assistente pergunta se deseja reagendar, arquivar ou ajustar escopo.
- **Encerramento**: uma quest pode ser concluída pelo usuário, pelo assistente (após confirmação de execução) ou expirada caso o prazo termine sem ação. Recorrências geram nova instância apenas após a conclusão da anterior ou após ajuste solicitado; cada nova conclusão concede 150 XP + 50 XP por repetição (até 15).

## Níveis de evolução

| Nível | Nome | XP mínimo | XP próximo nível | Conversas acumuladas (referência) | Descrição |
|-------|------|-----------|------------------|------------------------------------|-----------|
| 1 | Despertar | 0 | 500 | Meta 2 + 1 quest | Reconhece a necessidade de mudança e conclui a primeira quest. |
| 2 | Clareza | 500 | 1.200 | Meta 3 + 3 quests sabotadores | Mapeia sabotadores e transforma três insights em ação. |
| 3 | Coragem | 1.200 | 2.200 | Meta 4 + 5 quests (1 desaf.) | Sai da zona de conforto e completa uma quest desafiadora. |
| 4 | Consistência | 2.200 | 3.600 | Meta 5 + 8 quests | Mantém 1 quest recorrente por 21 dias e sustenta hábitos. |
| 5 | Resiliência | 3.600 | 5.400 | Meta 6 + 12 quests | Recupera quests após falhas e continua evoluindo. |
| 6 | Expansão | 5.400 | 7.400 | Meta 7 + 15 quests/3 áreas | Integra carreira, relações e bem-estar simultaneamente. |
| 7 | Maestria | 7.400 | 9.800 | Meta 8 + 20 quests | Cria e executa quests autorais com autonomia. |
| 8 | Impacto | 9.800 | 12.600 | 2 ciclos completos + 25 quests | Compartilha aprendizados e apoia outras jornadas. |
| 9 | Legado | 12.600 | 16.000 | 45+ dias consistentes + 30 quests | Conduz projetos de longo prazo com impacto coletivo. |
| 10 | Transcendência | 16.000 | — | 12 meses contínuos | Vive o propósito e mantém evolução perpétua. |

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

- Definir mensagens específicas por plano (Free/Premium) para limites de lembretes e suporte.
- Avaliar se haverá eventos temporários (campanhas) reutilizando o mesmo modelo de quests personalizadas.
