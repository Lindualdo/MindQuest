## Migração completa de quests e XP de conversas

Sequência única para preparar o ambiente (staging ou produção), reprovisionar os dados personalizados e validar o resultado.

### 1. Reset geral das quests personalizadas

1. Abra uma sessão `psql` no schema alvo.
2. Execute o script `docs/sql/reset_quests_personalizadas.sql`.
   - Ele apaga modelos/instâncias personalizadas, ajusta contadores agregados e cria as `temp_backup_*` dentro da sessão (exportar via `\copy` antes do `COMMIT` se quiser guardar).

### 2. Validar reset das quests

Rode as queries abaixo; todos devem retornar `0`.

```sql
SELECT COUNT(*) FROM public.quest_modelos WHERE tipo = 'personalizada';
SELECT COUNT(*) FROM public.quest_instancias qi
  JOIN public.quest_modelos qm ON qm.id = qi.modelo_id
 WHERE qm.tipo = 'personalizada';
```

Estado agregado (deve estar zerado):

```sql
SELECT usuario_id,
       total_quests_personalizadas,
       total_quests_concluidas,
       total_xp_hoje,
       xp_total,
       sequencia_atual,
       sequencia_recorde,
       ultima_conversa_em
  FROM public.quest_estado_usuario
 ORDER BY atualizado_em DESC
 LIMIT 10;
```

### 3. Limpar XP/streaks das conversas

Crie/execute o script abaixo (pode salvar como `docs/sql/reset_xp_conversas.sql`):

```sql
BEGIN;
UPDATE public.quest_estado_usuario
SET xp_total = 0,
    total_xp_hoje = 0,
    sequencia_atual = 0,
    sequencia_recorde = 0,
    meta_sequencia_codigo = 'streak_003',
    proxima_meta_codigo = 'streak_003',
    ultima_conversa_em = NULL,
    sequencia_status = jsonb_build_object('estado','ativa','reinicios',0,'alvo_conversas',3),
    atualizado_em = NOW();
COMMIT;
```

(Opcional) se precisar limpar conversas artificiais: `DELETE FROM public.usr_chat;`

### 4. Validar limpeza de XP/streaks

```sql
SELECT usuario_id,
       xp_total,
       total_xp_hoje,
       sequencia_atual,
       sequencia_recorde,
       meta_sequencia_codigo,
       proxima_meta_codigo,
       ultima_conversa_em,
       sequencia_status
  FROM public.quest_estado_usuario
 ORDER BY usuario_id
 LIMIT 10;
```

Todos os campos devem estar zerados/`NULL`, com `meta/proxima` = `streak_003`.

### 5. Executar os batches n8n (carga inicial)

1. Reimporte os workflows corrigidos (`sw_xp_conversas`, `sw_calcula_jornada`, `job_batch_xp_conversas`, `job_batch_generate_quests`, `job_batch_atualiza_jornada`) no n8n.
2. Rode, nesta ordem:
   1. `job_batch_xp_conversas` – recalcula XP e streaks a partir de `usr_chat`.
   2. `job_batch_generate_quests` – recria modelos/instâncias personalizadas.
   3. `job_batch_atualiza_jornada` – recalcula níveis/títulos.

### 6. Queries de validação pós-carga

**XP de conversas x Total**

```sql
WITH base AS (
  SELECT uc.usuario_id,
         date(uc.data_conversa) AS dia,
         CASE
           WHEN COALESCE(uc.total_palavras_usuario,0) >= 500 THEN 50
           WHEN uc.tem_reflexao THEN 35
           ELSE 20
         END AS xp_conversa
    FROM public.usr_chat uc
),
resumo AS (
  SELECT usuario_id, SUM(xp_conversa) AS xp_conversas
    FROM base
   GROUP BY usuario_id
)
SELECT r.usuario_id,
       r.xp_conversas,
       q.xp_total,
       q.total_xp_hoje,
       q.sequencia_atual,
       q.sequencia_recorde,
       q.ultima_conversa_em
  FROM resumo r
  JOIN public.quest_estado_usuario q ON q.usuario_id = r.usuario_id
 ORDER BY r.xp_conversas DESC;
```

`xp_total` deve ser `xp_conversas + bônus de streak`.

**Quests geradas**

```sql
SELECT COUNT(*) AS modelos, tipo
  FROM public.quest_modelos
 GROUP BY tipo;

SELECT COUNT(*) FROM public.quest_instancias;
```

**Spot-check de streak/meta**

```sql
SELECT usuario_id,
       sequencia_atual,
       sequencia_recorde,
       meta_sequencia_codigo,
       proxima_meta_codigo,
       sequencia_status
  FROM public.quest_estado_usuario
 WHERE usuario_id IN (<ids de teste>);
```

Confirme que após uma quebra (`reinicios` > 0) a `proxima_meta_codigo` volta a `streak_003`.

Com esses passos concluídos e verificados, a migração está pronta para ser aplicada em produção.***
