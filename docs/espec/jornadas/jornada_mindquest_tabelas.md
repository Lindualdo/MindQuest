# Jornada MindQuest — Estrutura de Tabelas e Pontuação

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

---

## 3. Tabelas Principais

### `usr_chat`
- **Função:** Repositório histórico de conversas
- **Equivalente para quests:** `usuarios_quest`
- **Campo chave:** `data_conversa` (armazenado sem timezone explícito, usar `::date` para agrupar por dia)

### `usuarios_quest`
- **Função:** Repositório histórico de quests do usuário
- **Equivalente para conversas:** `usr_chat`
- **Campos importantes:** `status`, `xp_concedido`, `referencia_data`

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
  - Calcula e registra XP
  - Atualiza totais e jornada

- **`webhook_progresso_semanal`**: Retorna dados do card de progresso
  - Busca em `usr_chat` (conversas da semana)
  - Busca em `conquistas_historico` (XP da semana)
  - Calcula metas diárias e semanais

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

### Registro Consolidado
- Em `conquistas_historico`, conversas recorrentes geram **1 único registro** com `meta_codigo = 'conversa_diaria'`
- O campo `xp_base` neste registro contém a soma de **todos os dias com conversa** (ex: 30 dias × 15 pts = 450 pts)
- Streaks são registrados separadamente com `meta_codigo` como `streak_003`, `streak_005`, etc.

### Estrutura de Pontos
```
xp_total = xp_base + xp_bonus

xp_base = pontos de conversas diárias (conversa_diaria) + pontos de quests (xp_base_quest)
xp_bonus = pontos de streaks + pontos de bônus de recorrência de quests
```

---

## OBS

- Para detalhes de campos e schema das tabelas, consultar diretamente a base PostgreSQL
- Termo "XP" permanece em campos/tabelas; na UI v1.3 usar sempre "pontos"
- Valores v1.3 = 20% dos valores v1.2
- Sempre validar consistência entre `usr_chat`/`usuarios_quest` → `conquistas_historico` → `usuarios_conquistas`

