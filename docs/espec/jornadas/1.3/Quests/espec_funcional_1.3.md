# Especificação Funcional 1.3 — Progresso Semanal e Pontos

## Objetivo

Padronizar a experiência do card **Meu Progresso Semanal**, substituindo o antigo conceito de XP por **Pontos**, com foco em metas diárias simples (Conversas + Quests) e feedback visual imediato.

## Estrutura de Pontos (versão 1.3)

1. **Conversa do dia**
   - Meta fixa: 20 pontos por dia com ao menos uma conversa concluída.
   - Bônus automáticos (primeira conversa, streak etc.) continuam existindo para motivação, mas **não elevam a meta diária**.
2. **Quest ativa do dia**
   - Cada quest personalizada aprovada define sua própria meta diária (40 a 60 pontos, recomendação inicial 50 pontos por quest diária simples).
   - Quests com entregas não diárias convertem o objetivo semanal em um valor diário equivalente para efeitos de barra.
3. **Meta diária consolidada** = pontos da conversa (20) + soma das metas das quests ativas daquele dia.
4. **Escala semanal**
   - Total semanal = metas diárias somadas (ex.: conversa 20 x 7 = 140 + duas quests diárias de 50 = 350; meta semanal 490 pontos).
   - Bônus de streak e recorrência são exibidos em mensagens secundárias, nunca como requisito de meta.

## Regras de Visualização do Card

1. **Barra principal (X de Y pontos concluídos)**
   - Mostra acumulação semanal: `pontos_realizados_semana / meta_semana`.
   - Cores: verde quando ≥100%, amarelo ao atingir 70–99%, cinza abaixo de 70%.
2. **Barras diárias**
   - Cada dia mostra resultado consolidado (conversa + quests):
     - **Cheia verde**: meta diária atingida ou superada.
     - **Parcial verde**: realizou pelo menos 30% da meta, mas não chegou a 100%.
     - **Cinza**: nenhuma meta cumprida (0% ou dia futuro).
   - Tooltips/legendas: exibir `Pontos previstos` vs `Pontos realizados` por dia.
3. **Resumo inferior**
   - Texto simples: `X dias concluídos` + `Y pontos da semana`, sem mencionar XP.
   - Ação “Continuar” permanece para direcionar próxima meta.

## Regras de Negócio para Metas

1. **Conversa (meta fixa)**
   - Atendido com qualquer conversa válida registrada no dia.
   - Falha se não houver registro até 23h59 do dia local.
2. **Quest**
   - Cada `quest_instancia` ativa define `pontos_diarios_meta` conforme complexidade:
     - Baixa complexidade: 40 pontos.
     - Média: 50 pontos (valor padrão recomendado).
     - Alta: 60 pontos.
   - Se a quest for semanal/única, divide-se o total de pontos pela quantidade de dias planejados (arredondar para cima).
3. **Bônus**
   - Bônus de streak, primeira conversa e recorrência continuam sendo calculados pelos workflows existentes, porém registrados como `pontos_extra` fora do cálculo de meta.
   - `pontos_extra` aparecem em mensagens motivacionais e acumulam no total semanal, mas não afetam status das barras.

## Saídas Necessárias para o Card

Para cada usuário/semana, o backend deve fornecer:

| Campo | Descrição |
|-------|-----------|
| `meta_semana` | Soma das metas diárias previstas (conversa + quests). |
| `pontos_semana` | Pontos efetivamente conquistados (inclui bônus). |
| `dias` | Array de 7 itens com `data`, `meta_dia`, `realizado`, `status_barra`. |
| `quests_ativas` | Lista resumida de metas vigentes e pontuação atribuída por dia. |
| `pontos_extra_semana` | Total de bônus concedidos (informativo). |

Status possíveis para `status_barra`:

- `completo`: `realizado` ≥ `meta_dia` (barra verde cheia).
- `parcial`: `realizado` entre 30% e 99% da meta (barra parcialmente verde).
- `pendente`: `realizado` < 30% (barra cinza).

## Escalonamento de Pontos (sugestão)

| Tipo de ação | Pontos propostos | Justificativa |
|--------------|-----------------|---------------|
| Conversa diária | 20 | Mantém ritmo sem inflar saldo; 140 pts por semana se cumprir todos os dias. |
| Quest baixa complexidade | 40 | Exige esforço leve, dobra a meta diária sem exagero. |
| Quest média | 50 | Equilíbrio entre hábito e ação prática. |
| Quest alta | 60 | Reconhece tarefas mais densas sem gerar pontuações infladas. |
| Bônus streak/primeira conversa | +10 cada ocorrência | Recompensas motivacionais que não alteram metas. |
| Recorrência de quest | +15 por ciclo extra (até 10 ciclos) | Incentiva continuidade sem explodir números. |

Com essa escala, um usuário com duas quests diárias (50 pts cada) teria meta de 120 pontos/dia (20 + 50 + 50). Ao longo de quatro semanas, mesmo com bônus, permanece abaixo de 4.000 pontos, mantendo números tangíveis e fáceis de comunicar.

