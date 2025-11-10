# Jornada MindQuest 1.2 — Regras de XP e Níveis

**Tagline:** Conversas geram insights. Insights geram quests. Quests geram transformação.

## Visão Geral

A Jornada MindQuest é estruturada em **10 níveis de evolução pessoal**, onde cada nível representa uma fase concreta do desenvolvimento mental e emocional do usuário. 

**Filosofia central:**
- **Conversas** são o meio para gerar insights sobre padrões mentais
- **Quests personalizadas** são o motor da transformação real
- **Evolução** é medida por ações concretas, não apenas reflexões


## Objetivo do sistema

- Transformar o engajamento diário com o assistente em uma jornada clara de progresso.
- Manter o usuário orientado por metas objetivas, com recompensas graduais e mensagens consistentes.
- Garantir que todo novo hábito ou desafio parta de contexto real das conversas, evitando sobrecarga.

## Glossário essencial

- **Quest**: missão ativa atribuída ao usuário. Pode representar metas de sequência de conversas ou compromissos personalizados.
- **Ciclos da Jornada**: período contínuo de acompanhamento do usuário. Sempre começa na Meta 1 de sequência.
- **Assistente de Conversa**: IA principal que conduz diálogos e identifica oportunidades de novas quests.
- **Assistente de Suporte**: IA que envia lembretes e acompanha a execução das quests personalizadas aprovadas.


## Tipologia de quests

| Tipo | Finalidade | Origem | Limite ativo | Como progride | Quando encerra |
|------|------------|--------|--------------|----------------|----------------|
| **Sequência de Conversas** | Sustentar o hábito diário de conversar com o assistente. | Automática, baseada no registro de conversas concluídas. | Uma por vez (meta corrente). | Cumprindo o número de conversas consecutivas da meta ativa. | Ao completar a meta ou exceder o intervalo máximo sem conversar. |
| **Personalizada** | Traduzir insights, sabotadores ou oportunidades identificadas nas conversas em ações concretas. | Recomendada pelo Assistente de Conversa; usuário aceita e configura. | Até 4 simultâneas (ativas ou pendentes). | Concluída pelo assistente, a partir da confirmação do usuario

## Regras comuns

- Cada quest possui status (`pendente`, `ativa`, `concluída`, `vencida`, `cancelada`, `reiniciada`) exibido no painel.
- O usuário visualiza três agrupamentos no painel: **Em andamento**, **Concluídas recentemente**, **Arquivadas**.
- Toda a pontuação deriva exclusivamente das regras listadas nas seções **XP · Conversas** e **XP · Quests Personalizadas** deste documento.
- Antes de propor nova quest, o Assistente de Conversa consulta a lista existente para evitar duplicidade ou sobrecarga.


## XP · Conversas (Sequência)

- **Regra base**: conversou no dia, ganhou **75 XP**. Várias conversas no mesmo dia continuam valendo só 75 XP para aquela data.
- **Acúmulo de XP diário**: mesmo que o usuário converse diversas vezes no mesmo dia, apenas a primeira conversa do dia rende XP; as demais contam apenas para o streak.
- **Progressão de streak**: a sequência usa os mesmos dias válidos do XP diário; múltiplas conversas no mesmo dia não avançam a meta.
- **Dias válidos**: qualquer dia com pelo menos uma conversa já garante o XP diário; não importa o número de mensagens ou o tamanho delas.
- **Passos da sequência**: cada conversa conta como um passo na sequência, mesmo que seja a terceira do dia. A sequência só é quebrada quando o usuário ficar um dia sem conversa (tem conversa na segunda e não tem na terça)

- **Reset**: ficar um dia sem conversa, encerra a meta ativa como `reiniciada`, registra o recorde e reinicia o ciclo na Meta 1. O XP acumulado (base + bônus) nunca é removido.

## Workflows de XP 

| Contexto | Workflow |
|----------|---------|
| Quest Custom (definidas por usuário) | `sw_xp_quest` *(renomear `sw_xperts_gamification`)* |
| Quest Conversa (sistema padrão) | `sw_xp_conversas` |
| Mudança de nível  | `sw_calcula_jornada` |

## Cálculo de XP

### Quest Custom

| Evento | Regra de XP | Observações |
|--------|-------------|-------------|
| Quest concluída | 150 XP fixos | valor base aplicado a qualquer Quest Custom finalizada |
| Recorrência concluída | +30 XP por ciclo, até 21 ciclos | bônus acumulativo para a mesma quest recorrente; máximo 630 XP extras |

### Quest Conversa

| Evento | Regra de XP | Observações |
|--------|-------------|-------------|
| Dia com conversa | 75 XP | conta 1 por dia (usar `COUNT(DISTINCT DATE(data_conversa))` de `usr_chat`) |
| Metas de sequência | conforme `streak_metas` | bônus aplicados quando a sequência (dias consecutivos) ultrapassa 3/5/7/… |

### Quests de Sequência Bonus *(hábito de conversar)*

| Meta | XP |
|------|-----|
| Meta 1 (3 conversas) | 40 XP |
| Meta 2 (5 conversas) | 60 XP |
| Meta 3 (7 conversas) | 90 XP |
| Meta 4 (10 conversas) | 130 XP |
| Meta 5 (15 conversas) | 180 XP |
| Meta 6 (20 conversas) | 250 XP |
| Meta 7 (25 conversas) | 340 XP |
| Meta 8 (30 conversas) | 450 XP |

#### Regras de Sequência de Conversas

- **Contagem**: contabilizar o número de conversas consecutivas realizadas, independentemente da data; múltiplas conversas no mesmo dia somam na sequência.
- **O que NÃO é sequência**: conta conversas seguidas (itens consecutivos), não dias consecutivos; o usuário pode ter várias conversas no mesmo dia e avançar na meta.
- **Quebra da sequência**: se houver um dia sem nenhuma conversa registrada, a contagem volta para zero (ex.: segunda tem conversa, terça não → sequência quebrada).
- **Próxima meta**: ao atingir uma meta (ex.: 3 conversas seguidas), definir automaticamente a próxima meta da lista (5, depois 7, 10, etc.), reiniciando a contagem para persegui-la.
- **Maior sequência registrada**: armazenar o maior intervalo contínuo em que houve pelo menos uma conversa por dia (do dia X ao dia Y sem falhas); atualize somente quando a sequência atual ultrapassar o recorde anterior.

## Regras de Nível

| Nível | Nome | XP mínimo | XP próximo nível |
|-------|------|-----------|------------------|
| 1 | Despertar | 0 | 500 |
| 2 | Clareza | 500 | 1.200 |
| 3 | Coragem | 1.200 | 2.200 |
| 4 | Consistência | 2.200 | 3.600 |
| 5 | Resiliência | 3.600 | 5.400 |
| 6 | Expansão | 5.400 | 7.400 |
| 7 | Maestria | 7.400 | 9.800 |
| 8 | Impacto | 9.800 | 12.600 |
| 9 | Legado | 12.600 | 16.000 |
| 10 | Transcendência | 16.000 | — |

### Resumo das Regras por Nível

| Nível | Nome | Descrição (App) | Faixa de XP | Condição-chave para subir |
|------|------|------------------|-------------|---------------------------|
| 1 | Despertar | Reconheço que preciso mudar | 0–500 | Cumprir Meta de Sequência 2 (5 dias), identificar 1 sabotador e concluir 1 quest personalizada inicial |
| 2 | Clareza | Entendo o que me bloqueia | 500–1 200 | Cumprir Meta de Sequência 3 (7 dias), mapear 3 sabotadores e terminar 3 quests ligadas a eles |
| 3 | Coragem | Aceito experimentar mudanças reais | 1 200–2 200 | Cumprir Meta de Sequência 4 (10 dias) e concluir 5 quests (mín. 1 desafiadora) testando novas estratégias |
| 4 | Consistência | Transformo ações em hábitos | 2 200–3 600 | Cumprir Meta de Sequência 5 (15 dias), finalizar 8 quests e manter 1 quest recorrente por 21 dias |
| 5 | Resiliência | Lido com recaídas sem desistir | 3 600–5 400 | Cumprir Meta de Sequência 6 (20 dias), concluir 12 quests e recuperar pelo menos 1 falha sem cancelar |
| 6 | Expansão | Aplico em múltiplas áreas da vida | 5 400–7 400 | Cumprir Meta de Sequência 7 (25 dias) e completar 15 quests distribuídas em ≥3 áreas da vida |
| 7 | Maestria | Sei me guiar sozinho(a) | 7 400–9 800 | Cumprir Meta de Sequência 8 (30 dias), concluir 20 quests e criar/executar 2 quests próprias |
| 8 | Impacto | Minha evolução inspira outros | 9 800–12 600 | Manter dois ciclos de 30 dias sem reset, concluir 25 quests (≥3 de compartilhamento) e apoiar outros usuários |
| 9 | Legado | Construo algo maior que eu | 12 600–16 000 | Sustentar 45+ dias contínuos, concluir 30 quests e manter 1 projeto de impacto de longo prazo ativo |
| 10 | Transcendência | Vivo o que sempre quis ser | 16 000+ | 12 meses de consistência sem reset, todas as conquistas anteriores completas e equilíbrio mental estável por 90+ dias |

### Conteúdo apresentado no App (Front-end)

| Nível | Nome | Descrição | Faixa de XP | Texto de Critérios |
|------|------|-----------|-------------|--------------------|
| 1 | Despertar | Reconheço que preciso mudar | XP: 0 – 500 | Completar 1 quest personalizada básica |
| 2 | Clareza | Entendo o que me bloqueia | XP: 500 – 1.200 | Completar 3 quests personalizadas relacionadas a sabotadores |
| 3 | Coragem | Aceito experimentar mudanças reais | XP: 1.200 – 2.200 | Completar 5 quests personalizadas com pelo menos 1 desafiadora |
| 4 | Consistência | Transformo ações em hábitos | XP: 2.200 – 3.600 | Completar 8 quests personalizadas + 1 quest recorrente por 21 dias |
| 5 | Resiliência | Lido com recaídas sem desistir | XP: 3.600 – 5.400 | Completar 12 quests + recuperar de 1 falha sem abandonar |
| 6 | Expansão | Aplico em múltiplas áreas da vida | XP: 5.400 – 7.400 | Completar 15 quests em pelo menos 3 áreas diferentes da vida |
| 7 | Maestria | Sei me guiar sozinho(a) | XP: 7.400 – 9.800 | Completar 20 quests + criar e executar 2 quests próprias |
| 8 | Impacto | Minha evolução inspira outros | XP: 9.800 – 12.600 | Completar 25 quests + 3 quests focadas em compartilhar aprendizados |
| 9 | Legado | Construo algo maior que eu | XP: 12.600 – 16.000 | Completar 30 quests + 1 projeto de impacto de longo prazo |
| 10 | Transcendência | Vivo o que sempre quis ser | XP: 16.000 – ∞ | Evolução contínua e ilimitada alinhada ao propósito |

## Fluxos de Dados · XP

### Conversas (sequência)
Resumo: `usr_chat` → `sw_xp_conversas` → `resumo_jornada` → `sw_calcula_jornada`
Breve: `sw_xp_conversas` lê até 45 dias de `usr_chat`, calcula 75 XP por conversa + bônus de meta, atualiza `resumo_jornada` e dispara `sw_calcula_jornada` para refletir níveis.

### Tabelas chaves (conversas)
- `usr_chat`: única fonte de verdade para XP diário e streaks (dias distintos + sequências). Todos os workflows devem derivar números daqui.
- `quest_templates` / `quest_atribuidas`: apenas quests personalizadas (conversas não entram aqui).
- `resumo_jornada`: cache único consumido pelo app/webhooks. Sempre atualize via workflows (`sw_xp_conversas`, `sw_xp_quests`) e nunca leia dados em cada rotina diretamente de outras tabelas para evitar divergências.

### Quests personalizadas
Resumo: `quest_atribuidas` → `sw_xp_quests` → `resumo_jornada` → `sw_calcula_jornada`
Breve: `sw_xp_quests` aplica 150 XP por conclusão +30 XP por recorrência (até 21 ciclos), persiste em `resumo_jornada` e chama `sw_calcula_jornada` para reavaliar níveis.

### Tabelas Principais
- `resumo_jornada`: snapshot do usuário (XP total, nível atual, metas e totais concluídos).
- `jornada_niveis`: faixas de XP/nível usadas pelos workflows e pelo app.
- `quest_templates`: catálogo técnico de quests automáticas (streaks, onboarding, hábitos).
- `quest_atribuidas`: quests entregues aos usuários com status, progresso, textos e XP concedido.
