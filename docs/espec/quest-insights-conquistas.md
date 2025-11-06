# MindQuest - Definições de Funcionalidades Atualizadas v1.2.0

## Introdução
Este documento detalha as funcionalidades atualizadas para Insights e Gamificação no MindQuest. Foca apenas nas mudanças, mantendo o resto do produto igual. As funcionalidades são descritas de forma simples para guiar o desenvolvimento.

## Funcionalidades Atualizadas: Insights

### Geração de Insights
- Um assistente de IA analisa as conversas diárias do usuário no WhatsApp.
- Gera insights como pequenas práticas sugeridas, baseadas no humor, energia, emoções e padrões mentais identificados.
- Insights aparecem no App após cada conversa, limitados por plano: 1 por conversa no Free, 5 no Premium.

### Seleção e Criação de Desafios
- Usuário visualiza os insights no App.
- Escolhe um ou mais insights e define desafios pessoais: metas simples de atividades diárias ou semanais.
- Desafios são salvos no App e sincronizados com o assistente de IA.

### Suporte aos Desafios
- Um assistente de IA dedicado envia lembretes e ajuda via WhatsApp para implementar os desafios.
- Lembretes: 1 por dia no Free, até 5 no Premium.
- Ajuda inclui dicas práticas e check-ins para progresso.

### Resumo Semanal
- Assistente envia resumo semanal via WhatsApp ou App.
- Inclui: eventos importantes da semana, emoções mais destacadas com gatilhos, insights sugeridos e razões, ações/desafios concluídos.

## Funcionalidades Atualizadas: Gamificação

### Metas de Consistência
- Rastreia dias seguidos de conversas no WhatsApp.
- Rastreia semanas completas (7 dias de conversas).
- Metas automáticas: por exemplo, 3 dias seguidos, 1 semana completa.

### Metas de Ações
- Baseadas nos desafios criados pelo usuário a partir de insights.
- Cada desafio concluído conta como meta de ação.

### Geração de Conquistas
- Conquistas automáticas para metas de consistência (ex: "3 Dias Seguidos") e ações (ex: "Desafio Concluído").
- Assistente de IA fecha o desafio após confirmação do usuário ou análise de progresso.

### Pontos e Prêmios (XPs)
- Conquistas geram pontos (XPs): por exemplo, 10 XPs por dia consistente, 50 XPs por desafio concluído.
- XPs acumulam e desbloqueiam prêmios: badges visuais, mensagens motivacionais ou acesso temporário a recursos Premium.

### Visualização no App
- Dashboard mostra: conquistas totais, pontuação atual de XPs, histórico de metas e desafios.
- Gráficos simples para progresso semanal e mensal.

## Integração com Planos Free e Premium
- Free: Limites leves em insights, lembretes e históricos (7 dias).
- Premium: Ilimitado, com mais insights e suporte.

## Fluxo Geral das Funcionalidades
1. Usuário conversa no WhatsApp.
2. IA gera insights e atualiza App.
3. Usuário seleciona insights e cria desafios no App.
4. IA lembra e ajuda via WhatsApp.
5. Desafio concluído: IA fecha, gera conquistas e XPs.
6. App exibe tudo; resumo semanal é enviado.

## Especificação técnica

- **Tabelas**: `quest_catalog` (definições de quests, categorias, gatilhos), `usuarios_quest` (progresso por usuário), `gamificacao` (estado consolidado da jornada), `gamificacao_niveis` (limiares e títulos de nível), `insights`, `usr_chat`, `usuarios_humor_energia`, `usuarios_emocoes`, `usuarios_sabotadores`.
- **Regras de XP/Nível**: o workflow `sw_experts_gamification` (nó *Calcular Gamificação*) calcula XP base 20/30/40 conforme reflexão e contagem de palavras, adiciona bônus de streak (10 para ≥7 dias, 20 para ≥30) e XP de quests concluídas. Quando `xp_total` ultrapassa o próximo limiar de `gamificacao_niveis`, atualiza `nivel_atual`, `xp_proximo_nivel` e `titulo_nivel`.
- **Rotina de quests**: `Garantir Quests` assegura quests padrão e diárias; `Buscar Quests` traz o estado atual; `Atualizar Quests` persiste mudanças em `usuarios_quest`, incluindo dados extras de insights.
- **Regra de quests diárias**: a cada execução, o nó *Garantir Quests* verifica o catálogo (`quest_catalog`) e:
  - para cada quest ativa com `tipo = 'diaria'`, cria uma nova linha em `usuarios_quest` para cada usuário com `referencia_data = CURRENT_DATE`, status `pendente`, `progresso_meta = COALESCE(gatilho_valor, 1)` e XP definido no catálogo;
  - caso já exista uma linha idêntica para o usuário e a data corrente, nada é inserido (garante 1 instância/dia);
  - diárias do catálogo coexistem: se houver três registros diários, o usuário recebe os três no mesmo dia; no dia seguinte, novas instâncias são geradas para as mesmas quests.
- **Payload `/auth/validate`**: workflow `dash_authentication` executa as consultas (`Gameficacao`, `Proxima_Jornada`) e o node `organiza_dados` monta o JSON final. O campo `gamificacao.complementos.daily` lista todas as quests diárias concluídas (IDs, códigos, datas, XP, referência) e `gamificacao.complementos.categorias` resume progresso por categoria (total de conquistas, última atualização/conclusão) sem uso de constantes.
- **Workflows envolvidos**: `sw_experts_gamification` (gamificação diária) e `dash_authentication` (endpoint do app) compartilham o mesmo modelo de dados e mantêm a consistência entre `usuarios_quest` e `gamificacao`.

### Pontos em revisão (lógica atual)
- **Quests diárias redundantes**: todas as quests `tipo = 'diaria'` usam o mesmo gatilho (`diario`). Assim que o input traz `tem_reflexao = true`, todas as instâncias ficam “completas” em conjunto. Na prática, exibem textos diferentes mas respondem ao mesmo evento. Próximo passo: desenhar regra de rotação ou gatilhos distintos.
- **Falta de sequenciamento**: o workflow gera todas as dailies simultaneamente; não há fila ou desbloqueio progressivo. Rever se o comportamento desejado é “uma diária por dia” ou “lista completa sempre disponível”.
- **Dependência de reflexão**: hoje a conclusão diária considera apenas reflexão + contagem de palavras. Se criarmos dailies baseadas em humor, hábitos etc., será necessário estender `progressValues` e os gatilhos usados no JS.
- **Gatilhos centralizados em código**: qualquer mudança (ex.: diário baseado em humor) exige alteração na lógica do node `Calcular Gamificação`. Registrar as futuras regras para evitar regressões.

## Próximos passos

- Ajustar o card de gamificação do app para exibir níveis, próximas quests, conquistas diárias e categorias a partir do novo payload.
- Criar rotinas que convertam insights aprovados em novas quests (`usuarios_quest.insight_id`) e gerenciem seu ciclo de vida dentro do fluxo de gamificação.
- Ampliar monitoramento/testes dos workflows para cobrir as novas estruturas (`complementos.daily` e `complementos.categorias`) e validar regressões de XP/streak.
- Avaliar disponibilização do mesmo payload em outras interfaces (ex.: API pública) para manter consistência entre canais.

*Documento atualizado em 2 de novembro de 2025*
