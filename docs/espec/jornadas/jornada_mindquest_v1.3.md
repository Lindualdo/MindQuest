# Jornada MindQuest v1.3 — Pontos e Progresso Semanal

## 1. Objetivo da Versão

- Manter a jornada de 10 níveis e workflows de XP existentes, mas sem exibir níveis/jornada na interface.
- Simplificar a percepção do usuário para **pontos semanais**, usando o mesmo modelo de tabelas da v1.2.
- Reduzir todos os valores de XP da v1.2 para **20%**, tratando-os como **pontos** na v1.3.
- A UI usa sempre o termo **“pontos”**; o termo **XP** permanece apenas em nomes de campos/tabelas.

## 2. Estrutura de Dados (inalterada)

| Componente              | Situação v1.3         | Uso principal na v1.3                              |
|-------------------------|-----------------------|----------------------------------------------------|
| `usr_chat`              | Mantido               | Log de conversas; base de pontos diários.         |
| `usuarios_quest`        | Mantido               | Log de quests personalizadas e recorrentes.       |
| `metas_catalogo`        | Mantido (valores novos)| Parâmetros oficiais de pontos (conversas/bonus).  |
| `usuarios_conquistas`   | Mantido               | Snapshot consolidado de pontos e contadores.      |
| `conquistas_historico` | Mantido               | Histórico de cada conquista (conversas/quests).   |
| `jornada_niveis`        | Mantido               | Catálogo de níveis (não exibido na UI v1.3).      |
| `sw_xp_conversas`       | Mantido               | Calcula pontos de conversas e streaks.            |
| `sw_xp_quest`           | Mantido               | Calcula pontos de quests personalizadas.          |
| `sw_calcula_jornada`    | Mantido               | Atualiza nível/jornada em background.             |

- Workflows continuam executando normalmente, chamando `sw_calcula_jornada` ao final; somente **não exibimos** nível/jornada na interface desta versão.

## 3. Conversas e Quests — Pontos (20% da v1.2)

### 3.1 Conversas (sequência)

| Evento / Meta                         | Regra v1.2 (XP) | Regra v1.3 (pontos) | Origem (`metas_catalogo`)      |
|---------------------------------------|-----------------|---------------------|---------------------------------|
| Conversa diária válida                | 75 XP           | **15 pontos**       | `conversa_diaria`              |
| Bônus desbloqueio do hábito (1º dia)  | 75 XP           | **15 pontos**       | `primeira_conversa`            |
| Bônus de streak (`streak_*`)          | N XP            | **N × 0,2 pontos**  | registros `streak_*` existentes |

- Regra geral: para qualquer meta automática de conversas em `metas_catalogo`, `pontos_v1_3 = round(xp_v1_2 × 0.2)`.

### 3.2 Quests personalizadas

| Evento                                 | Regra v1.2 (XP) | Regra v1.3 (pontos) | Origem (`metas_catalogo`)     |
|----------------------------------------|-----------------|---------------------|--------------------------------|
| Quest personalizada concluída          | 150 XP          | **30 pontos**       | `xp_base_quest` (tipo `personalizada`) |
| Bônus por recorrência concluída (ciclo)| 30 XP           | **6 pontos**        | `xp_bonus_recorrencia` (tipo `personalizada`) |

- Regra geral: todos os valores de XP de quests personalizadas em `metas_catalogo` passam a valer **20%** em pontos.
- Os campos continuam com prefixo `xp_` na base, mas representam **pontos** na v1.3.

## 4. Metas Diárias de Pontos

### 4.1 Definição

| Item                        | Regra v1.3                                                                 | Fonte de dados                          |
|-----------------------------|-----------------------------------------------------------------------------|-----------------------------------------|
| Meta diária de conversa     | 1 conversa válida no dia ⇒ **15 pontos**                                  | `usr_chat` + `metas_catalogo.conversa_diaria` |
| Meta diária de quests       | Soma dos pontos das quests que tenham ação prevista para o dia            | `usuarios_quest` (status/agenda)       |
| Meta diária total (`dia`)   | **Meta conversa (15) + meta quests do dia**                               | cálculo em workflow/app                 |
| Pontos realizados no dia    | Pontos de conversas + pontos de quests concluídas naquele dia             | `conquistas_historico`                 |

Regras:
- Apenas a **primeira conversa válida** do dia concede os 15 pontos de conversa; demais conversas contam só para análise e contexto.
- Quests recorrentes usam os mesmos pontos da v1.3 (30 base + 6 por ciclo completo), distribuídos nos dias conforme as conclusões registradas.

## 5. Metas Semanais de Pontos

### 5.1 Definição

| Item                          | Regra v1.3                                                                              |
|-------------------------------|-----------------------------------------------------------------------------------------|
| Semana de referência          | Sempre de **segunda a domingo** no fuso do usuário.                                    |
| Meta semanal de conversa      | 7 dias × 15 pontos = **105 pontos** (se o usuário conversar todos os dias).           |
| Meta semanal de quests        | Soma das metas diárias de quests planejadas para a semana.                             |
| Meta semanal total (`semana`) | Soma de todas as metas diárias totais da semana (conversa + quests).                  |
| Pontos semanais realizados    | Soma de todos os pontos de conversas + quests concluídas na semana.                   |

- A meta semanal é sempre **a soma das metas diárias**, não um valor independente.

## 6. Card “Meu Progresso Semanal” (UI)

### 6.1 Elementos e Cálculo

| Elemento                        | Regra de exibição                                                                    | Cálculo / Fonte                       |
|---------------------------------|--------------------------------------------------------------------------------------|---------------------------------------|
| Título                          | `Meu progresso semanal`                                                              | fixo                                  |
| Barra de progresso semanal      | Mostra % de pontos realizados vs meta semanal                                       | `pontos_semana / meta_semana`        |
| Texto resumo                    | `X dias` dentro da meta + `Y pontos nesta semana · Z% da meta`                      | cálculo semanal                       |
| Dias (Seg–Dom)                  | Um marcador por dia com barra vertical proporcional à meta diária do dia            | metas/pontos do dia                   |

### 6.2 Regras das barras diárias

| Estado da barra      | Critério (por dia)                                                                    | Cor sugerida |
|----------------------|----------------------------------------------------------------------------------------|-------------|
| Concluído total      | `pontos_dia ≥ meta_dia_total`                                                         | Verde sólido |
| Concluído parcial    | `0 < pontos_dia < meta_dia_total`                                                     | Verde parcial |
| Pendente             | `pontos_dia = 0` (nenhuma conversa válida e nenhuma quest concluída)                  | Cinza        |

- Altura da barra é proporcional a `pontos_dia / meta_dia_total` (limitada a 100%).

### 6.3 Terminologia na Interface

- Sempre mostrar **“pontos”** no lugar de “XP” (ex.: `2715 pontos nesta semana · 91% da meta`).
- Mensagens de níveis/jornada (Despertar, Clareza, etc.) **não são exibidas** na UI v1.3, embora continuem sendo calculadas em background.

## 7. Comportamento da Jornada (background)

| Aspecto               | Regra v1.3                                                                                  |
|-----------------------|---------------------------------------------------------------------------------------------|
| Cálculo de níveis     | `sw_calcula_jornada` continua lendo `usuarios_conquistas` e atualizando `jornada_niveis`.  |
| Thresholds de níveis  | Mantidos conforme v1.2 (em XP/pontos), permitindo futura reexibição sem migração complexa. |
| Exibição no app       | Nenhuma tela ou card de nível/jornada é mostrado nesta versão.                             |

- Resultado: o sistema continua acumulando **pontos** e atualizando a posição na jornada, mas a v1.3 foca apenas em **progresso semanal de pontos** para o usuário.

