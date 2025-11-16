# Wireframes MindQuest 1.2 — Home (Nova Versão, Mobile First)

> Objetivo: uma única tela mobile **sem scroll**, com o resumo mais relevante pós-conversa, reforçando gamificação (nível, XP, streak, próxima conversa) e curiosidade sobre emoções/insights.

---

## 1. Layout geral · mobile (sem scroll)

```text
+--------------------------------------------------+
| TOP BAR                                          |
+--------------------------------------------------+
| TRILHA                                           |
+--------------------------------------------------+
| SNAPSHOT · NÍVEL / XP                            |
+--------------------------------------------------+
| CARD · CONVERSAS (DIA ATUAL)                     |
+--------------------------------------------------+
| RESUMO · EMOÇÕES / HUMOR                         |
+--------------------------------------------------+
| NAV INFERIOR                                     |
+--------------------------------------------------+
```

- Pensado para ocupar um viewport típico de smartphone em pé, sem necessidade de scroll.
- Cada bloco é compacto, com textos curtos e botões grandes, favorecendo leitura rápida.

---

## 2. Top Bar

```text
+--------------------------------------------------+
| [Logo] MindQuest     |Olá, Aldo! 👋 |(⟳)        |                                              
+--------------------------------------------------+
```

- Mantém identidade atual: logo, nome MindQuest, saudação personalizada e botão de atualizar.

---

## 3. Trilha (Contexto da Jornada)

```text
+--------------------------------------------------+
| Conversas → Quests → Transformação → Família     |
+--------------------------------------------------+
```

- Mantém o chip/trilha atual, reforçando o **caminho de evolução** que o usuário está percorrendo.

---

## 4. Snapshot · Nível / XP

```text
+--------------------------------------------------+
| Nível 3 — Consistência                           |
| XP: [████████░░░░]  2.715 / 3.600                |
| Faltam 885 XP para a Meta Resiliência            |
+--------------------------------------------------+
```

- Mostra rapidamente nível atual, XP acumulado e quanto falta para o próximo marco.
- Barra compacta, sem textos longos, para caber confortavelmente na primeira metade da tela.

---

## 5. Card · Conversas (Dia atual)

```text
+--------------------------------------------------+
| Conversas de hoje                                |
| Última conversa há 1 dia e 4h                    |
| Streak: 3 dias seguidos · Recorde: 7 dias        |
| Mini linha 7 dias: ○ ● ○ ● ● ○ ●                 |
| Próxima conversa desbloqueia:                    |
| • +75 XP base  • +40 XP bônus  • Novo insight    |
| Pontos focais + insight do dia:                  |
| "Projeto pessoal travado..."                     |
| "Primeiro passo simples definido..."             |
| [ VER INSIGHTS DE HOJE ]   [ HISTÓRICO ]         |
+--------------------------------------------------+
```

- Card principal da home: conecta **conversa de hoje** com XP, streak e curiosidade pelos insights.
- Resumo da conversa em no máximo **duas linhas**, com reticências se passar do limite.
- Dois CTAs claros:
  - `VER INSIGHTS DE HOJE` → abre resumo completo da última conversa.
  - `HISTÓRICO` → leva para a tela com o diário de conversas e calendário completo.

---

## 6. Resumo · Emoções / Humor (snapshot)

```text
+--------------------------------------------------+
| Minhas emoções — visão rápida                    |
| Humor: 7.0  ·  Energia: 71%                      |
| Emoção dominante: Confiança (27%)                |
| Sabotador ativo: Hiper-Realizador                |
| [ VER PAINEL EMOCIONAL ]                         |
+--------------------------------------------------+
```

- Versão reduzida do card de emoções:
  - Usa os **mesmos dados reais** do card completo (humor, energia, emoção dominante, sabotador).
  - Mostra apenas 1 emoção dominante e o nome do sabotador, sem descrições longas.
- CTA único:
  - `VER PAINEL EMOCIONAL` → leva para a tela com o card completo (gauge, energia, lista de emoções e descrição do sabotador).

---

## 7. Nav inferior

```text
+--------------------------------------------------+
| [ HOME* ]  [ CONVERSAS ]  [ QUESTS ]  [ JORNADA ]|
+--------------------------------------------------+
```

- `HOME` destacado (estado atual).
- `CONVERSAS` → diário completo, insights por dia, histórico detalhado.
- `QUESTS` → painel de quests ativas, pendentes e concluídas.
- `JORNADA` → página de conquistas e níveis, com mural de vitórias.

