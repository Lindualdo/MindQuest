-- Recalcula XP total, nível atual e metas de sequência com base apenas em conversas.
-- Executar em ambiente seguro: ajusta todos os usuários existentes em quest_estado_usuario.

WITH usuarios AS (
  SELECT usuario_id
  FROM public.quest_estado_usuario
),
dias_distintos AS (
  SELECT
    uc.usuario_id,
    uc.data_conversa::date AS dia
  FROM public.usr_chat uc
  JOIN usuarios u ON u.usuario_id = uc.usuario_id
  GROUP BY uc.usuario_id, uc.data_conversa::date
),
ordenadas AS (
  SELECT
    usuario_id,
    dia,
    LAG(dia) OVER (PARTITION BY usuario_id ORDER BY dia) AS dia_anterior
  FROM dias_distintos
),
grupos AS (
  SELECT
    usuario_id,
    dia,
    CASE
      WHEN dia_anterior IS NULL OR dia <> dia_anterior + INTERVAL '1 day' THEN 1
      ELSE 0
    END AS quebra
  FROM ordenadas
),
grupos_enriquecidos AS (
  SELECT
    usuario_id,
    dia,
    SUM(quebra) OVER (PARTITION BY usuario_id ORDER BY dia ROWS UNBOUNDED PRECEDING) AS grupo
  FROM grupos
),
streaks AS (
  SELECT
    usuario_id,
    dia,
    grupo,
    ROW_NUMBER() OVER (PARTITION BY usuario_id, grupo ORDER BY dia) AS streak_pos
  FROM grupos_enriquecidos
),
bonus_meta AS (
  SELECT *
  FROM (VALUES
    (3, 80),
    (7, 100),
    (10, 150),
    (20, 200),
    (30, 250)
  ) AS t(alvo, bonus)
),
xp_conversas AS (
  SELECT
    u.usuario_id,
    COALESCE(COUNT(s.dia) * 60, 0) AS xp_base,
    COALESCE(SUM(b.bonus), 0) AS xp_bonus,
    COALESCE(MAX(s.streak_pos), 0) AS recorde,
    COALESCE(MAX(s.streak_pos) FILTER (WHERE s.grupo = s.ultimo_grupo), 0) AS streak_atual,
    MAX(s.dia) AS ultima_conversa
  FROM usuarios u
  LEFT JOIN (
    SELECT
      s.*,
      MAX(grupo) OVER (PARTITION BY usuario_id) AS ultimo_grupo
    FROM streaks s
  ) s ON s.usuario_id = u.usuario_id
  LEFT JOIN bonus_meta b ON b.alvo = s.streak_pos
  GROUP BY u.usuario_id
),
sequencias AS (
  SELECT
    qm.codigo,
    qm.id AS modelo_id,
    COALESCE(qm.gatilho_valor, 0) AS alvo
  FROM public.quest_modelos qm
  WHERE qm.tipo = 'sequencia'
    AND qm.ativo = true
),
meta_atual AS (
  SELECT
    u.usuario_id,
    COALESCE(
      (
        SELECT codigo
        FROM sequencias
        WHERE alvo > COALESCE(xp.streak_atual, 0)
        ORDER BY alvo
        LIMIT 1
      ),
      (
        SELECT codigo
        FROM sequencias
        ORDER BY alvo DESC
        LIMIT 1
      )
    ) AS meta_codigo
  FROM usuarios u
  LEFT JOIN xp_conversas xp ON xp.usuario_id = u.usuario_id
),
meta_info AS (
  SELECT
    ma.usuario_id,
    ma.meta_codigo,
    seq.alvo AS meta_alvo,
    (
      SELECT codigo
      FROM sequencias
      WHERE alvo > seq.alvo
      ORDER BY alvo
      LIMIT 1
    ) AS proxima_codigo
  FROM meta_atual ma
  LEFT JOIN sequencias seq ON seq.codigo = ma.meta_codigo
),
meta_info_ext AS (
  SELECT
    mi.usuario_id,
    mi.meta_codigo,
    mi.meta_alvo,
    mi.proxima_codigo,
    seq.alvo AS proxima_alvo
  FROM meta_info mi
  LEFT JOIN sequencias seq ON seq.codigo = mi.proxima_codigo
),
resumo AS (
  SELECT
    u.usuario_id,
    COALESCE(xp.xp_base, 0) AS xp_base,
    COALESCE(xp.xp_bonus, 0) AS xp_bonus,
    COALESCE(xp.recorde, 0) AS recorde,
    COALESCE(xp.streak_atual, 0) AS streak_atual,
    xp.ultima_conversa,
    mie.meta_codigo AS meta_atual_codigo,
    mie.meta_alvo AS meta_atual_alvo,
    mie.proxima_codigo AS meta_proxima_codigo,
    mie.proxima_alvo AS meta_proxima_alvo
  FROM usuarios u
  LEFT JOIN xp_conversas xp ON xp.usuario_id = u.usuario_id
  LEFT JOIN meta_info_ext mie ON mie.usuario_id = u.usuario_id
),
resumo_niveis AS (
  SELECT
    r.*,
    (r.xp_base + r.xp_bonus) AS xp_total,
    jn.nivel,
    jn.titulo,
    jn.xp_proximo_nivel
  FROM resumo r
  LEFT JOIN LATERAL (
    SELECT jn.*
    FROM public.jornada_niveis jn
    WHERE (r.xp_base + r.xp_bonus) >= jn.xp_minimo
    ORDER BY jn.nivel DESC
    LIMIT 1
  ) jn ON TRUE
)
UPDATE public.quest_estado_usuario q
SET
  xp_total              = COALESCE(rn.xp_total, 0),
  xp_proximo_nivel      = COALESCE(rn.xp_proximo_nivel, q.xp_proximo_nivel),
  nivel_atual           = COALESCE(rn.nivel, q.nivel_atual),
  titulo_nivel          = COALESCE(rn.titulo, q.titulo_nivel),
  sequencia_atual       = COALESCE(rn.streak_atual, 0),
  sequencia_recorde     = COALESCE(rn.recorde, 0),
  meta_sequencia_codigo = rn.meta_atual_codigo,
  proxima_meta_codigo   = COALESCE(rn.meta_proxima_codigo, rn.meta_atual_codigo),
  sequencia_status      = jsonb_build_object(
    'alvo_conversas', COALESCE(rn.meta_atual_alvo, 0),
    'estado', CASE
      WHEN rn.meta_atual_alvo IS NULL THEN 'indefinida'
      WHEN COALESCE(rn.streak_atual, 0) >= COALESCE(rn.meta_atual_alvo, 0) THEN 'atingida'
      ELSE 'ativa'
    END,
    'reinicios', 0,
    'completado_em', NULL
  ),
  total_quests_concluidas = 0,
  total_xp_hoje           = 0,
  ultima_conversa_em      = rn.ultima_conversa,
  atualizado_em           = NOW()
FROM resumo_niveis rn
WHERE q.usuario_id = rn.usuario_id;
