# Redesenho MindQuest 1.2 — Visão Enxuta

## 1. Por que estamos mudando

- A home atual concentra **muitos cards e textos** na mesma tela, aumentando a carga cognitiva.
- As principais ações do negócio são **voltar após a conversa**, ver **insights**, **quests** e **progresso da jornada**.
- Os cards já são dinâmicos (dados reais), então o foco do redesenho é **organização, clareza e reforço da gamificação**, não refazer a lógica.
- Objetivo: cada tela responder rapidamente “**qual é meu próximo passo hoje?**” e mostrar o progresso de forma **inspiradora**.

---

## 2. Card “Diário de conversas”

### 2.1. Como está hoje (prints)

- Título “**Diário de conversas**”, com chips de contexto no topo (`Conversas → Quests → Transformação → Família`).
- Destaque para **streak**: “0 dias seguidos” e “Recorde 0 dias”.
- Linha temporal com 7 dias (`DOM ... SÁB`), cada dia com ícone de check/xis e data (`09/11`, `10/11`…).
- Bloco “**Próxima conversa desbloqueia**” com lista: `+75 XP base`, `+40 XP bônus`, `Novo insight personalizado`.
- Links inferiores: `Ver insights` e `Explorar histórico`.

### 2.2. O que manter

- Visual de **calendário 7 dias** com check/xis, pois explica streak de forma intuitiva.
- Bloco “Próxima conversa desbloqueia” com **recompensas claras** em XP e insight.
- Link para `Ver insights` e `Explorar histórico` (são ações centrais pós‑conversa).
- Estilo visual atual (cards arredondados, cores suaves, hierarquia tipográfica).

### 2.3. O que mudar (nova ideia)

- **Home:** manter apenas um resumo compacto do dia (streak + texto curto de insight) em vez do calendário completo.
- **Nova tela “Conversas”:** mover o card completo de “Diário de conversas” (calendário + histórico + recompensas) para essa tela.
- Simplificar o cabeçalho removendo parte dos textos (“0 conversa / Meta 1 conversa”) e focando em:
  - Streak atual, recorde e tempo desde a última conversa (“há 1 dia e 4h”).
- Ajustar microcópias para enfatizar “**Você já fez X, falta Y para manter o ritmo**”.

---

## 3. Card “Quest ativa”

### 3.1. Como está hoje (prints)

- Selo “**QUEST ATIVA**” no topo à esquerda e status “PENDENTE” à direita.
- Título da quest, ex.: “**Prática diária da técnica Pomodoro**”.
- Descrição clara da missão (“Estabelecer blocos de trabalho de 25 minutos…”).
- Barra de progresso com texto `0/7 passos` e porcentagem `0%`.
- Infos adicionais: “Recorrência: diária”, “Atualizado há 3 dias e 4 h”.
- Bloco “**Recompensas da próxima conclusão**” com:
  - `+150 XP bônus`, `+150 XP base`, `+30 XP bônus (recorrência)`, “Novo insight aplicado na prática”, “Progresso em hábitos chaves”.
- Link `Abrir painel de quests`.

### 3.2. O que manter

- Estrutura geral do card (título, descrição, progresso, recorrência, bloco de recompensas).
- Destaque visual para “Quest ativa” e status (Pendente, Em andamento, etc.).
- Detalhamento das recompensas da próxima conclusão, reforçando **causa → efeito**.
- CTA `Abrir painel de quests` (leva para visão completa).

### 3.3. O que mudar (nova ideia)

- **Home:** usar versão resumida:
  - Mostrar apenas título, mini descrição, progresso (porcentagem) e **linha resumida de recompensa** (`+150 XP na próxima conclusão`).
  - Manter o bloco “Recompensas da próxima conclusão” somente na tela de `Quests`.
- **Tela “Quests”:** exibir card atual completo (como no print), podendo listar mais de uma quest com o mesmo padrão.
- Trocar textos técnicos (“0/7 passos 0%”) por frases mais motivacionais:
  - Ex.: “Você está começando esta missão — 7 passos para transformar seu foco”.

---

## 4. Card “Minhas emoções – visão 360°”

### 4.1. Como está hoje (prints)

- Título “**MINHAS EMOÇÕES – VISÃO 360° – SEMANAL**”.
- Bloco superior com gauge de humor:
  - “Humor atual 7.0 / Média 7.0” e link `Histórico`.
- Barra de “Energia média 68%”.
- Bloco “Emoções dominante” com lista (`Confiança 27%`, `Expectativa 24%` + link `Ver painel`).
- Bloco “Sabotador mais ativo”:
  - Ex.: `Hiper-Realizador` com descrição contextual e link `Ver painel`.

### 4.2. O que manter

- Gauge de humor + média (é uma leitura rápida, bem visual).
- Energia média e emoções dominantes com percentuais (transmitem progresso emocional).
- Destaque para o sabotador mais ativo, com breve descrição.
- Links para painéis específicos (`Histórico`, `Ver painel`), aproveitando as telas detalhadas já existentes.

### 4.3. O que mudar (nova ideia)

- **Home:** manter apenas um snapshot compacto:
  - Humor atual, energia média e uma emoção dominante principal (ex.: “Humor 7.0 · Energia 68% · Emoção: Confiança”).
- **Tela de Emoções/Panorama:** levar o card completo de visão 360° (como nos prints), incluindo sabotador e detalhes.
- Reduzir o texto de descrição do sabotador na home, mantendo só uma frase‑âncora:
  - Ex.: “Focado em metas e reconhecimento externo”.

---

## 5. Card “Minha jornada” / Conquistas

### 5.1. Como está hoje (prints)

- Título “**Minha jornada**” com subtítulo (`Consistência`).
- Texto explicando a jornada: “Transforma conversas e quests em hábitos, mesmo em dias difíceis.”
- Barra de XP com indicador:
  - Ex.: `2715 XP` / `3600 XP`, com texto “Faltam 885 XP para Meta Resiliência”.
- Bloco “**Quando você avança**” com bullets:
  - “Liberar novas estratégias personalizadas”
  - “Acesso a missões avançadas da jornada”
  - “Recompensas extras em XP e insights”
- Link `Explorar jornada`.

### 5.2. O que manter

- Barra de XP com valores absolutos + quanto falta para o próximo marco.
- Benefícios claros ao avançar (“Quando você avança…”).
- CTA `Explorar jornada`, que já conversa bem com a ideia de **conquistas**.
- Tom inspirador do texto, conectando esforço diário a transformação real.

### 5.3. O que mudar (nova ideia)

- **Home:** deixar o card em versão reduzida, exibindo:
  - Título do nível atual (ex.: “Nível 3 — Consistência”).
  - Barra de XP + texto curto “Faltam 885 XP para o próximo nível”.
  - CTA único: `Ver conquistas da jornada`.
- **Nova página “Conquistas / Jornada”:**
  - Transformar o conteúdo que hoje está em `ConquistasPage` numa visão inspiradora:
    - Card grande de **nível atual** com benefícios do próximo nível.
    - Carrossel/lista de **vitórias recentes** (conquistas desbloqueadas com emoji, nome, XP, data).
    - Linha do tempo de níveis usando os dados de `levelHistory` (N1, N2, N3… com datas e resumo).
  - Substituir a tabela longa de conquistas por cards, para reforçar sensação de “galeria de medalhas”.

---

## 6. Resumo rápido das mudanças

- Home fica **mais enxuta**, com foco em: resumo da conversa de hoje, quest ativa e visão rápida de XP/nível.
- Cada card completo (conversas, quest, emoções, jornada) migra para sua **tela própria**, aproveitando os dados dinâmicos já implementados.
- A página de `Conquistas/Jornada` vira o lugar principal para ver progresso e celebrar vitórias, usando os dados atuais de gamificação (níveis, conquistas, XP).

---

## 7. Wireframes finais — merge atual + nova ideia

### 7.1. Home · Hoje (pós-conversa, gamificada)

```text
+--------------------------------------------------+
| TOP BAR                                          |
| [Logo] MindQuest       Olá, Aldo!   (⟳)         |
+--------------------------------------------------+
| TRILHA                                            |
| Conversas → Quests → Transformação → [Família]   |
+--------------------------------------------------+
| SNAPSHOT · NÍVEL E XP                            |
| Nível 3 — Consistência                           |
| XP: [████████░░░░]  2.715 / 3.600                |
| Faltam 885 XP para a Meta Resiliência            |
+--------------------------------------------------+
| CARD · CONVERSA DE HOJE                          |
| Diário de conversas                              |
| Última conversa há 1 dia e 4h                    |
| Streak: 3 dias seguidos · Recorde: 7 dias        |
| Mini linha 7 dias: ○ ● ○ ● ● ○ ●                 |
| Próxima conversa desbloqueia:                    |
| • +75 XP base  • +40 XP bônus                    |
| • Novo insight personalizado                     |
| [ VER INSIGHTS DE HOJE ]   [ HISTÓRICO ]         |
+--------------------------------------------------+
| CARD · QUEST ATIVA                               |
| QUEST ATIVA         PENDENTE                     |
| Prática diária da técnica Pomodoro              |
| 0 / 7 passos · recorrência diária · 0%          |
| Próxima conclusão: +150 XP base +30 XP recorr.   |
| [ VER PAINEL DE QUESTS ]                         |
+--------------------------------------------------+
| NAV INFERIOR                                     |
| [ HOME* ]  [ CONVERSAS ]  [ QUESTS ]  [ CONQUISTAS ]
+--------------------------------------------------+
```

**Ideia-chave:** usa visual atual (cards, trilha, texto), mas foca em **XP, streak e quest ativa** como elementos principais de gamificação.

---

### 7.2. Tela CONVERSAS · Diário completo

```text
+--------------------------------------------------+
| CONVERSAS                                        |
| Hoje · 1 conversa concluída · +75 XP             |
+--------------------------------------------------+
| DIÁRIO DE CONVERSAS                              |
| 🔥 3 dias seguidos   ·   Recorde 7 dias          |
| Última conversa há 1 dia e 4h                    |
|                                                  |
| [DOM] [SEG] [TER] [QUA] [QUI] [SEX] [SÁB]        |
|  ○      ●     ○     ●     ●     ○     ●         |
|                                                  |
| Próxima conversa desbloqueia:                    |
| • +75 XP base                                    |
| • +40 XP bônus                                   |
| • Novo insight personalizado                     |
| [ VER INSIGHTS DE HOJE ]                         |
| [ EXPLORAR HISTÓRICO COMPLETO ]                  |
+--------------------------------------------------+
| NAV INFERIOR                                     |
| [ HOME ]  [ CONVERSAS* ]  [ QUESTS ]  [ CONQUISTAS ]
+--------------------------------------------------+
```

**Ideia-chave:** aqui entra o **card completo** do print, liberando a home para um resumo e mantendo toda a lógica dinâmica existente.

---

### 7.3. Tela QUESTS · Painel de missão

```text
+--------------------------------------------------+
| QUESTS                                           |
| Sua jornada em movimento                         |
+--------------------------------------------------+
| QUEST ATIVA                                      |
| Prática diária da técnica Pomodoro              |
| Estabelecer blocos de 25min com pausas curtas.  |
| 0 / 7 passos · recorrência diária · 0%          |
| Recompensas da próxima conclusão:               |
| • +150 XP base                                   |
| • +150 XP bônus                                  |
| • +30 XP bônus (recorrência)                     |
| • Novo insight aplicado na prática               |
| • Progresso em hábitos chave                     |
| [ MARCAR PASSO COMO FEITO ]                      |
+--------------------------------------------------+
| OUTRAS QUESTS                                    |
| • Cuidar da energia pela manhã   (pendente)      |
| • Destravar projeto importante    (pendente)     |
| [ VER DETALHES / EDITAR QUESTS ]                 |
+--------------------------------------------------+
| NAV INFERIOR                                     |
| [ HOME ]  [ CONVERSAS ]  [ QUESTS* ]  [ CONQUISTAS ]
+--------------------------------------------------+
```

**Ideia-chave:** aproveita o card rico atual de quest ativa, mas o coloca em uma tela dedicada, reforçando **recompensas e micro‑ações**.

---

### 7.4. Tela CONQUISTAS · Jornada e vitórias

```text
+--------------------------------------------------+
| CONQUISTAS · SUA JORNADA                         |
| Cada conversa e quest vira uma vitória real.     |
+--------------------------------------------------+
| NÍVEL ATUAL                                      |
| Nível 3 — Consistência                           |
| XP: [████████░░░░]  2.715 / 3.600                |
| Faltam 885 XP para a Meta Resiliência            |
| Quando você avança:                              |
| • Novas estratégias personalizadas               |
| • Missões avançadas da jornada                   |
| • Recompensas extras em XP e insights            |
| [ VER PRÓXIMOS NÍVEIS ]                          |
+--------------------------------------------------+
| VITÓRIAS RECENTES                                |
| 🏅 1ª semana de consistência                     |
|    +300 XP · há 2 dias                           |
| 🏆 Projeto destravado                            |
|    +450 XP · há 5 dias                           |
| 💡 Insight aplicado em momento difícil           |
|    +150 XP · há 1 semana                         |
| [ VER TODAS AS CONQUISTAS ]                      |
+--------------------------------------------------+
| LINHA DO TEMPO DE NÍVEIS                         |
| N1 Despertar     — data | breve resumo           |
| N2 Coragem       — data | breve resumo           |
| N3 Consistência  — data | breve resumo           |
| ...                                               |
+--------------------------------------------------+
| NAV INFERIOR                                     |
| [ HOME ]  [ CONVERSAS ]  [ QUESTS ]  [ CONQUISTAS* ]
+--------------------------------------------------+
```

**Ideia-chave:** junta o card “Minha jornada” com a lógica atual de `ConquistasPage`, mas em formato de **mural de vitórias** e linha do tempo gamificada.

