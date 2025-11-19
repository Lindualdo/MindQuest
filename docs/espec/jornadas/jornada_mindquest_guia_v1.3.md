# Jornada MindQuest — Guia de Referência

## 1. Fontes de Pontos

### Conversas
- **Pontuação:** 15 pts por dia (apenas a primeira conversa do dia conta)
- **Streaks:** Geram bônus, mas **não impactam na meta diária**
- **Repositório:** `usr_chat` (histórico de todas as conversas)

### Quests
- **Pontuação:** 30 pts fixos por quest concluída
- **Bônus recorrência:** 6 pts por ciclo completo (se aplicável)
- **Repositório:** `usuarios_quest` (histórico de todas as quests)

---

## 2. Meta Diária

**Fórmula:**
```
Meta Diária = 1 conversa (15 pts) + quests ativas do dia (30 pts cada)
```

- Meta é **sempre fixa** por dia
- Streaks não alteram a meta, apenas dão bônus

**Cálculo de Quests Ativas:**
Uma quest está "ativa" em um dia se:
- `status IN ('ativa', 'pendente')` (quests concluídas não contam)
- `janela_inicio <= dia <= janela_fim` (dentro do período de disponibilidade)
- Quest diária concluída hoje conta na meta de hoje, mas reseta para amanhã

---

## 3. Tabelas Principais

### `usr_chat`
- **Função:** Repositório histórico de conversas
- **Equivalente para quests:** `usuarios_quest`
- **Campo chave:** `data_conversa` (armazenado sem timezone explícito, usar `::date` para agrupar por dia)

### `usuarios_quest`
- **Função:** Repositório histórico de quests do usuário
- **Equivalente para conversas:** `usr_chat`
- **Campos importantes:**
  - `status`: `'ativa'`, `'pendente'`, `'concluida'`
  - `xp_concedido`: XP total concedido pela quest (deve bater com `conquistas_historico`)
  - `referencia_data`: Data de referência da quest
  - `janela_inicio` / `janela_fim`: Período em que a quest está disponível
  - `config`: JSON com `titulo`, `recorrencia`, `agenda`, `dias_semana`
- **Janelas de Ativação:**
  - Definem o período em que uma quest está "ativa"
  - Quests diárias resetam para `pendente` após conclusão se ainda estiverem dentro da janela
  - Após `janela_fim`, quest permanece `concluida` e não reseta

### `usuarios_conquistas`
- **Função:** Saldo consolidado/acumulado de XP do usuário
- **Campos:** `xp_total`, `xp_base`, `xp_bonus`, contadores
- **Atualização:** Incremental a cada conclusão

### `conquistas_historico`
- **Função:** Histórico de conversas e quests concluídas (com XP)
- **Importante:** Para itens recorrentes (conversas/quests), é gerado **apenas 1 registro**
- **Detalhes das conclusões:** Armazenados no campo `detalhes` (JSON)
- **Tipos:** `conversa`, `quest`
- **Campo `meta_codigo`:**
  - `conversa_diaria`: pontos base de conversa (15 pts)
  - `streak_*`: bônus de sequência (não contam na meta)
  - Para quests: ID da quest

### `metas_catalogo`
- **Função:** Parâmetros oficiais de pontos
- **Códigos importantes:**
  - `conversa_diaria`: 15 pts
  - `xp_base_quest`: 30 pts
  - `xp_bonus_recorrencia`: 6 pts

---

## 4. Fluxo de Pontuação

```
Conversa realizada → usr_chat
                   ↓
            Calcula XP (15 pts + streaks)
                   ↓
         conquistas_historico (1 registro)
                   ↓
      usuarios_conquistas (saldo atualizado)
```

```
Quest concluída → usuarios_quest (status='concluida')
                ↓
         Calcula XP (30 pts base + 6 bônus se recorrente)
                ↓
      conquistas_historico (1 registro)
                ↓
   usuarios_conquistas (saldo atualizado)
```

---

## 5. Validação de Consistência

### Teste 1: Pontos BASE de Conversas

**Objetivo:** Verificar se os pontos base de conversas estão consistentes entre as 3 tabelas.

**Query:**
```sql
WITH dias_conversa AS (
  SELECT COUNT(DISTINCT data_conversa::date) AS total_dias
  FROM public.usr_chat
  WHERE usuario_id = '<uuid>'
),
pontos_historico AS (
  SELECT COALESCE(SUM(xp_base), 0) AS pontos_base
  FROM public.conquistas_historico
  WHERE usuario_id = '<uuid>'
    AND tipo = 'conversa'
    AND meta_codigo = 'conversa_diaria'
),
pontos_conquistas AS (
  SELECT xp_base
  FROM public.usuarios_conquistas
  WHERE usuario_id = '<uuid>'
)
SELECT
  dc.total_dias AS dias_com_conversa,
  (dc.total_dias * 15) AS pontos_esperados,
  ph.pontos_base AS pontos_em_historico,
  pc.xp_base AS pontos_em_conquistas,
  (dc.total_dias * 15) - ph.pontos_base AS diferenca_esperado_vs_historico,
  ph.pontos_base - pc.xp_base AS diferenca_historico_vs_conquistas
FROM dias_conversa dc, pontos_historico ph, pontos_conquistas pc;
```

**Resultado esperado:**
- `pontos_esperados` = `pontos_em_historico` = `pontos_em_conquistas`
- Diferenças = 0

**Se houver divergência:**
- `diferenca_esperado_vs_historico > 0`: conversas em `usr_chat` sem registro em `conquistas_historico`
- `diferenca_historico_vs_conquistas != 0`: inconsistência no saldo consolidado

### Teste 2: Pontos BONUS (Streaks e Primeira Conversa)

**Objetivo:** Verificar se os pontos bônus estão consistentes.

**Query:**
```sql
-- Buscar todos os bônus registrados
SELECT
  meta_codigo,
  meta_titulo,
  xp_bonus,
  COUNT(*) AS qtd_registros,
  SUM(xp_bonus) AS total_bonus
FROM public.conquistas_historico
WHERE usuario_id = '<uuid>'
  AND tipo = 'conversa'
  AND xp_bonus > 0
GROUP BY meta_codigo, meta_titulo, xp_bonus
ORDER BY meta_codigo;
```

**Composição de Bônus:**
- `primeira_conversa`: 15 pts (bônus desbloqueio do hábito, 1ª vez)
- `streak_003`: 8 pts por ocorrência (cada sequência de 3 dias)
- `streak_005`: 12 pts
- `streak_007`: 18 pts
- `streak_010`: 26 pts
- `streak_015`: 36 pts
- `streak_020`: 50 pts
- `streak_025`: 68 pts
- `streak_030`: 90 pts

**Validação:**
```sql
SELECT
  xp_bonus AS bonus_em_conquistas,
  (SELECT COALESCE(SUM(xp_bonus), 0) 
   FROM conquistas_historico 
   WHERE usuario_id = '<uuid>' AND tipo = 'conversa') AS soma_bonus_historico,
  xp_bonus - (SELECT COALESCE(SUM(xp_bonus), 0) 
              FROM conquistas_historico 
              WHERE usuario_id = '<uuid>' AND tipo = 'conversa') AS diferenca
FROM public.usuarios_conquistas
WHERE usuario_id = '<uuid>';
```

**Resultado esperado:**
- `bonus_em_conquistas` = `soma_bonus_historico`
- `diferenca` = 0

### Teste 3: Pontos de Quests

**Objetivo:** Verificar se os pontos de quests estão consistentes entre as 3 tabelas.

**Query:**
```sql
WITH quests_concluidas AS (
  SELECT 
    COUNT(*) AS total_quests,
    SUM(xp_concedido) AS xp_concedido_total
  FROM public.usuarios_quest
  WHERE usuario_id = '<uuid>'
    AND status = 'concluida'
),
pontos_quest_historico AS (
  SELECT 
    COALESCE(SUM(xp_base), 0) AS pontos_base_quest,
    COALESCE(SUM(xp_bonus), 0) AS pontos_bonus_quest,
    COALESCE(SUM(xp_base + xp_bonus), 0) AS pontos_total_quest
  FROM public.conquistas_historico
  WHERE usuario_id = '<uuid>'
    AND tipo = 'quest'
),
saldo_conquistas AS (
  SELECT total_quests_concluidas
  FROM public.usuarios_conquistas
  WHERE usuario_id = '<uuid>'
)
SELECT
  qc.total_quests AS quests_concluidas_usuarios_quest,
  (qc.total_quests * 30) AS pontos_base_esperados,
  qc.xp_concedido_total AS xp_concedido_em_usuarios_quest,
  pqh.pontos_base_quest AS pontos_base_em_historico,
  pqh.pontos_bonus_quest AS pontos_bonus_em_historico,
  pqh.pontos_total_quest AS pontos_total_em_historico,
  sc.total_quests_concluidas AS contador_quests_conquistas
FROM quests_concluidas qc, pontos_quest_historico pqh, saldo_conquistas sc;
```

**Regras de Validação:**
- Cada quest concluída = 30 pts base (de `metas_catalogo.xp_base_quest`)
- Quests recorrentes ganham +6 pts bônus por ciclo (de `metas_catalogo.xp_bonus_recorrencia`)
- `usuarios_quest.xp_concedido` deve bater com o XP registrado em `conquistas_historico`
- `usuarios_conquistas.total_quests_concluidas` deve bater com count de quests concluídas

**Resultado esperado:**
- `quests_concluidas_usuarios_quest` = `contador_quests_conquistas`
- `xp_concedido_em_usuarios_quest` = `pontos_total_em_historico`
- `pontos_base_esperados` ≤ `pontos_base_em_historico` (pode ter bônus de recorrência)

**Se houver divergência:**
- Quest com `status='concluida'` mas sem registro em `conquistas_historico`
- `xp_concedido = 0` em quest concluída (workflow não calculou XP)
- Contador em `usuarios_conquistas` diferente do total de quests concluídas

---

## 6. Workflows Relacionados

### Workflows de Cálculo (Referência Principal)

**IMPORTANTE:** Estes workflows são a **referência oficial** para qualquer funcionalidade relacionada a quests e conversas:

- **`sw_xp_conversas`**: Calcula pontos de conversas e streaks
  - Lê de `usr_chat`
  - Registra em `conquistas_historico`
  - Atualiza `usuarios_conquistas`
  - Chama `sw_calcula_jornada`

- **`sw_xp_quest`**: Calcula pontos de quests personalizadas
  - Lê de `usuarios_quest`
  - Calcula XP (30 base + 6 bônus se recorrente)
  - Registra em `conquistas_historico`
  - Atualiza `usuarios_conquistas`
  - Chama `sw_calcula_jornada`

- **`sw_calcula_jornada`**: Atualiza nível/jornada em background
  - Lê `usuarios_conquistas.xp_total`
  - Calcula nível baseado em `jornada_niveis`
  - Atualiza `usuarios_conquistas` (nivel_atual, titulo_nivel)

### Jobs Batch (Recálculo/Inicialização)

- **`job_batch_xp_conversas`**: Executa `sw_xp_conversas` para todos os usuários
  - Usado após reset ou ajuste de valores em `metas_catalogo`
  - Recalcula TODOS os pontos de conversas e streaks

- **`job_batch_generate_quests`**: Gera quests e calcula XP
  - Cria quests personalizadas
  - Chama `sw_xp_quest` automaticamente
  - `sw_xp_quest` chama `sw_calcula_jornada`

### Webhooks de Interface

- **`webhook_concluir_quest`**: Marca quest como concluída (acionado pelo app)
  - Atualiza `usuarios_quest.status = 'concluida'`
  - Calcula e registra XP via `sw_xp_quest`
  - **Reset automático:** Quests diárias retornam para `status='pendente'` após conclusão
    - Condição: `config.recorrencia = 'diaria'` E `CURRENT_DATE BETWEEN janela_inicio AND janela_fim`
    - Garante que quests diárias estejam disponíveis novamente no próximo ciclo
  - Atualiza totais e jornada

- **`webhook_progresso_semanal`**: Retorna dados do card de progresso (home)
  - Busca em `usr_chat` (conversas da semana)
  - Busca em `conquistas_historico` (XP da semana)
  - Calcula metas diárias e semanais
  - **Inclui:** conversas + quests

- **`webhook_progresso_quests_semanal`**: Retorna progresso semanal **somente de quests** (painel de quests)
  - Busca em `usuarios_quest` (quests da semana)
  - Busca em `conquistas_historico` com filtro `tipo='quest'`
  - Calcula metas diárias baseadas apenas em quests ativas
  - **Ignora:** conversas (exibe apenas progresso de quests)

### Ordem de Execução (Setup/Reset)

1. Zerar base (exceto `usr_chat`)
2. Ajustar valores em `metas_catalogo` (se necessário)
3. Executar `job_batch_xp_conversas` (recalcula conversas)
4. Executar `job_batch_generate_quests` (cria quests + calcula XP + jornada)

---

## 7. Pontos Importantes

### Timezone e Datas
- `usr_chat.data_conversa`: Usar `::date` diretamente (sem conversão de timezone)
- `conquistas_historico.registrado_em`: Usar `AT TIME ZONE 'America/Sao_Paulo'` para converter

### Registro Consolidado em `conquistas_historico`

**Para Conversas:**
- Geram **1 único registro** com `meta_codigo = 'conversa_diaria'`
- O campo `xp_base` contém a soma de **todos os dias com conversa** (ex: 30 dias × 15 pts = 450 pts)
- Campo `detalhes` (JSON) armazena as ocorrências individuais:
  ```json
  {
    "ocorrencias": [
      {"dia": "2025-11-16", ...},
      {"dia": "2025-11-18", ...}
    ],
    "recorrencia_total": 30
  }
  ```
- Streaks são registrados separadamente com `meta_codigo` como `streak_003`, `streak_005`, etc.

**Para Quests Recorrentes:**
- Geram **1 único registro por quest** (não 1 por conclusão)
- O campo `xp_base` contém a soma de **todas as conclusões** da quest
- Campo `detalhes` (JSON) armazena as conclusões individuais:
  ```json
  {
    "quest_id": "...",
    "recorrencia": "diaria",
    "ocorrencias": [
      {"dia": "2025-11-18", "xp_base": 30, "xp_bonus": 6},
      {"dia": "2025-11-19", "xp_base": 30, "xp_bonus": 6}
    ]
  }
  ```

**IMPORTANTE:** Para calcular XP por período (ex: semana), é necessário filtrar as ocorrências dentro do campo `detalhes`, não apenas somar `xp_base` do registro principal.

### Estrutura de Pontos
```
xp_total = xp_base + xp_bonus

xp_base = pontos de conversas diárias (conversa_diaria) + pontos de quests (xp_base_quest)
xp_bonus = pontos de streaks + pontos de bônus de recorrência de quests
```

---

## 8. Problemas Comuns e Soluções

### Meta Semanal Zerada no Painel de Quests

**Sintoma:** 
- Card home mostra meta correta (conversas + quests)
- Painel de quests mostra meta = 0 pts

**Causa Raiz:**
- Quests diárias concluídas não estavam sendo resetadas para `status='pendente'`
- Query de meta busca apenas quests com `status IN ('ativa', 'pendente')`
- Todas as quests ficavam `status='concluida'` permanentemente

**Solução Implementada:**
- Adicionado nó "Resetar Quest Diaria" no `webhook_concluir_quest`
- Executa após calcular XP, antes de retornar resposta
- Reseta quests diárias para `pendente` se ainda estiverem dentro da janela
- Query: `UPDATE usuarios_quest SET status='pendente', progresso_atual=0, progresso_percentual=0, concluido_em=NULL WHERE config->>'recorrencia'='diaria' AND CURRENT_DATE BETWEEN janela_inicio AND janela_fim`

### Divergência de XP entre Painel e Card Home

**Sintoma:**
- XP diferente entre `webhook_progresso_semanal` (home) e `webhook_progresso_quests_semanal` (painel)

**Causa Raiz:**
- Webhook estava somando `xp_base` total de `conquistas_historico` sem filtrar por período
- Campo `xp_base` contém soma acumulada de TODAS as ocorrências históricas, não apenas da semana

**Solução:**
- Filtrar ocorrências dentro do campo `detalhes` (JSON) pelo período desejado
- Contar apenas ocorrências com `dia >= inicio_semana AND dia <= fim_semana`
- Não somar `xp_base` diretamente do registro principal

---

## 9. Fluxo Completo End-to-End

### Visão Geral do Ciclo

```
Usuário conversa → Quest gerada → XP calculado → Exibição no App → Conclusão manual → Reset automático
```

### Passo a Passo Detalhado

#### **1. Usuário faz uma conversa**

**Onde:** Chat com IA (Mentor)

**O que acontece:**
- Mensagem armazenada em `usr_chat` com `data_conversa`
- Webhook/job aciona `sw_xp_conversas`

**Workflow responsável:** `sw_xp_conversas`
- Lê conversas de `usr_chat`
- Calcula XP (15 pts base + streaks)
- Registra em `conquistas_historico` (tipo='conversa')
- Atualiza `usuarios_conquistas` (saldo consolidado)
- Chama `sw_calcula_jornada` (atualiza nível)

---

#### **2. Sistema cria as quests**

**Quando:** Job batch ou geração sob demanda

**Workflow responsável:** `job_batch_generate_quests` ou `sw_criar_quest`
- Analisa perfil do usuário
- Cria quests personalizadas em `usuarios_quest`
- Define:
  - `status = 'ativa'` ou `'pendente'`
  - `janela_inicio` / `janela_fim` (período de disponibilidade)
  - `config` (título, recorrência, agenda)
  - `progresso_meta` e `progresso_atual`

**Resultado:** Quests disponíveis para o usuário no período da janela

---

#### **3. Sistema calcula XP inicial**

**Quando:** Após criar quest ou ao inicializar usuário

**Workflow responsável:** `sw_xp_quest`
- Lê quests de `usuarios_quest`
- Calcula XP para novas quests (30 pts base + 6 bônus se recorrente)
- Registra em `conquistas_historico` (tipo='quest')
- Atualiza `usuarios_conquistas` (saldo consolidado)
- Chama `sw_calcula_jornada` (atualiza nível)

**Nota:** Este cálculo inicial não é obrigatório; XP é calculado principalmente na conclusão

---

#### **4. Home do app mostra progresso (conversas + quests)**

**Tela:** Home / Dashboard principal

**Webhook responsável:** `webhook_progresso_semanal`

**O que exibe:**
- **Progresso semanal:** XP realizado vs meta da semana
- **Detalhamento por dia:** Barra vertical para cada dia (dom-sáb)
- **Fonte de dados:**
  - XP conversas: filtra `conquistas_historico.detalhes.ocorrencias[]` pelo período
  - XP quests: filtra `conquistas_historico.detalhes.ocorrencias[]` pelo período (tipo='quest')
  - Meta diária: `15 pts (conversa) + 30 pts × (quests ativas no dia)`

**Dados retornados:**
```json
{
  "xp_semana_total": 120,
  "meta_semana": 105,
  "dias": [
    {
      "dia": "2025-11-17",
      "dia_semana": "domingo",
      "xp_dia": 15,
      "meta_dia": 15,
      "xp_conversas": 15,
      "xp_quests": 0
    },
    {...}
  ]
}
```

---

#### **5. Painel de quests mostra andamento (apenas quests)**

**Tela:** Painel de Quests (v1.3)

**Webhook responsável:** `webhook_progresso_quests_semanal`

**O que exibe:**
- **Progresso semanal de quests:** XP de quests vs meta de quests
- **Detalhamento por dia:** Barra vertical para cada dia (dom-sáb)
- **Lista de quests do dia:** Ao clicar em uma barra, mostra quests pendentes e concluídas
- **Fonte de dados:**
  - XP quests: filtra `conquistas_historico` (tipo='quest') pelo período
  - Meta diária: `30 pts × (quests ativas no dia)` (ignora conversas)
  - Quests do dia: busca de `usuarios_quest` filtrando por status e data

**Dados retornados:**
```json
{
  "xp_semana_total": 90,
  "meta_semana": 630,
  "dias": [
    {
      "dia": "2025-11-19",
      "dia_semana": "quarta-feira",
      "xp_dia": 60,
      "meta_dia": 90,
      "xp_quests": 60,
      "quests_concluidas": 2,
      "quests_pendentes": 1
    },
    {...}
  ]
}
```

**Interação:**
- Usuário clica em uma barra (dia específico)
- App filtra `questSnapshot.quests_personalizadas` pelo dia selecionado
- Exibe lista de quests pendentes e concluídas daquele dia

---

#### **6. Usuário conclui uma quest**

**Ação:** Clique no botão "Concluir" em uma quest pendente

**Webhook responsável:** `webhook_concluir_quest`

**Fluxo interno:**
1. **Normalizar Entrada:** Valida parâmetros (`usuario_id`, `quest_id`, `data_referencia`)
2. **Atualizar Status:**
   - `UPDATE usuarios_quest SET status='concluida', concluido_em=...`
   - Aceita quests com `status IN ('ativa', 'pendente')`
   - Usa `data_referencia` se fornecida (permite conclusão retroativa)
3. **Validar Atualização:** Verifica se quest foi encontrada
4. **Calcular XP Quest:** Chama `sw_xp_quest` com `atualizacoes_status` contendo a quest concluída
5. **Resetar Quest Diária (NOVO!):**
   - Se `config.recorrencia = 'diaria'` E dentro da janela
   - `UPDATE usuarios_quest SET status='pendente', progresso_atual=0, concluido_em=NULL`
   - Quest volta a estar disponível imediatamente
6. **Buscar Quest Final:** Retorna estado atualizado com XP calculado
7. **Formatar Resposta:** Retorna JSON para o frontend
8. **Respond to Webhook:** Envia resposta HTTP

**Resultado:**
- Quest marcada como concluída
- XP registrado em `conquistas_historico` (append em `detalhes.ocorrencias[]`)
- `usuarios_conquistas` atualizado (saldo consolidado)
- Nível/jornada atualizado (via `sw_calcula_jornada`)
- **Quest diária resetada para `pendente`** (disponível novamente)

**Payload de requisição:**
```
GET /concluir-quest?usuario_id=<uuid>&quest_id=<uuid>&data_referencia=2025-11-19
```

**Resposta:**
```json
{
  "success": true,
  "quest_id": "...",
  "usuario_id": "...",
  "status": "pendente",
  "xp_adicionado": 36,
  "xp_base": 30,
  "xp_bonus": 6
}
```

---

#### **7. App atualiza automaticamente após conclusão**

**Frontend (React):** `useStore.ts` → `concluirQuest()`

**O que acontece após o webhook responder:**
```typescript
// 1. Marca quest como concluída localmente
void loadQuestSnapshot(usuarioId);

// 2. Atualiza card de progresso da home
void loadWeeklyProgressCard(usuarioId); // webhook_progresso_semanal

// 3. Atualiza painel de quests
void loadWeeklyQuestsProgressCard(usuarioId); // webhook_progresso_quests_semanal

// 4. Atualiza card de quests na home
void loadQuestsCard(usuarioId);
```

**Resultado visual:**
- Barra de progresso atualiza em tempo real
- Quest aparece como concluída no dia correto
- Meta e XP realizado refletem a conclusão
- **Quest diária volta para lista de pendentes** (após reload)

---

### Resumo dos Webhooks por Funcionalidade

| Funcionalidade | Webhook | Descrição |
|----------------|---------|-----------|
| **Card Home (progresso geral)** | `webhook_progresso_semanal` | XP conversas + quests vs meta semanal |
| **Painel Quests (detalhamento)** | `webhook_progresso_quests_semanal` | XP e lista de quests por dia |
| **Snapshot de Quests** | `webhook_quests` | Lista completa de quests personalizadas |
| **Concluir Quest** | `webhook_concluir_quest` | Marca quest como concluída, calcula XP e reseta diárias |

---

### Diferenças entre os Webhooks de Progresso

| Aspecto | `webhook_progresso_semanal` | `webhook_progresso_quests_semanal` |
|---------|----------------------------|-----------------------------------|
| **Escopo** | Conversas + Quests | Apenas Quests |
| **Meta Diária** | 15 pts + (30 × quests ativas) | 30 × quests ativas |
| **XP Exibido** | `xp_conversas` + `xp_quests` | Apenas `xp_quests` |
| **Uso** | Card de progresso na home | Painel detalhado de quests |

---

## OBS

- Para detalhes de campos e schema das tabelas, consultar diretamente a base PostgreSQL
- Termo "XP" permanece em campos/tabelas; na UI v1.3 usar sempre "pontos"
- Valores v1.3 = 20% dos valores v1.2
- Sempre validar consistência entre `usr_chat`/`usuarios_quest` → `conquistas_historico` → `usuarios_conquistas`

