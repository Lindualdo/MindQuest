BEGIN;

WITH alvo AS (
    SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
vidas AS (
    SELECT a.usuario_id
    FROM alvo a
)
-- snapshot quest_estado_usuario
,
xp_conversas AS (
    SELECT uc.usuario_id, COUNT(*) * 75 AS xp_base
    FROM public.usr_chat uc
    JOIN vidas a ON a.usuario_id = uc.usuario_id
    WHERE uc.data_conversa IS NOT NULL
    GROUP BY uc.usuario_id
),
xp_streak_bonus AS (
    SELECT qi.usuario_id, COALESCE(SUM(qi.xp_concedido), 0) AS xp_bonus
    FROM public.quest_instancias qi
    JOIN vidas a ON a.usuario_id = qi.usuario_id
    WHERE qi.meta_codigo LIKE 'streak_%'
      AND qi.status = 'concluida'
    GROUP BY qi.usuario_id
),
xp_personalizadas AS (
    SELECT qi.usuario_id, COALESCE(SUM(qi.xp_concedido), 0) AS xp_custom
    FROM public.quest_instancias qi
    JOIN vidas a ON a.usuario_id = qi.usuario_id
    WHERE qi.meta_codigo NOT LIKE 'streak_%'
      AND qi.status = 'concluida'
    GROUP BY qi.usuario_id
),
xp_conquistas AS (
    SELECT g.usuario_id,
           COALESCE(SUM((c->>'xp_bonus')::int), 0) AS xp_conquista,
           MAX((c->>'desbloqueada_em')::timestamptz) AS ultima_conquista
    FROM public.gamificacao g
    JOIN vidas a ON a.usuario_id = g.usuario_id
    CROSS JOIN LATERAL jsonb_array_elements(COALESCE(g.conquistas_desbloqueadas, '[]'::jsonb)) AS c
    GROUP BY g.usuario_id
),
xp_final AS (
    SELECT a.usuario_id,
           COALESCE(xc.xp_base, 0)
         + COALESCE(xs.xp_bonus, 0)
         + COALESCE(xp.xp_custom, 0)
         + COALESCE(xcg.xp_conquista, 0) AS xp_total,
           xcg.ultima_conquista
    FROM vidas a
    LEFT JOIN xp_conversas xc    ON xc.usuario_id = a.usuario_id
    LEFT JOIN xp_streak_bonus xs ON xs.usuario_id = a.usuario_id
    LEFT JOIN xp_personalizadas xp ON xp.usuario_id = a.usuario_id
    LEFT JOIN xp_conquistas xcg  ON xcg.usuario_id = a.usuario_id
),
nivel_destino AS (
    SELECT xf.usuario_id, jn.nivel, jn.titulo, jn.xp_proximo_nivel
    FROM xp_final xf
    LEFT JOIN LATERAL (
        SELECT jn.*
        FROM public.jornada_niveis jn
        WHERE xf.xp_total >= jn.xp_minimo
        ORDER BY jn.xp_minimo DESC
        LIMIT 1
    ) jn ON TRUE
)
UPDATE public.quest_estado_usuario q
SET xp_total         = xf.xp_total,
    nivel_atual      = nd.nivel,
    titulo_nivel     = nd.titulo,
    xp_proximo_nivel = nd.xp_proximo_nivel,
    atualizado_em    = NOW()
FROM xp_final xf
LEFT JOIN nivel_destino nd ON nd.usuario_id = xf.usuario_id
WHERE q.usuario_id = xf.usuario_id;

WITH alvo AS (
    SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
vidas AS (
    SELECT a.usuario_id
    FROM alvo a
),
xp_conversas AS (
    SELECT uc.usuario_id, COUNT(*) * 75 AS xp_base
    FROM public.usr_chat uc
    JOIN vidas a ON a.usuario_id = uc.usuario_id
    WHERE uc.data_conversa IS NOT NULL
    GROUP BY uc.usuario_id
),
xp_streak_bonus AS (
    SELECT qi.usuario_id, COALESCE(SUM(qi.xp_concedido), 0) AS xp_bonus
    FROM public.quest_instancias qi
    JOIN vidas a ON a.usuario_id = qi.usuario_id
    WHERE qi.meta_codigo LIKE 'streak_%'
      AND qi.status = 'concluida'
    GROUP BY qi.usuario_id
),
xp_personalizadas AS (
    SELECT qi.usuario_id, COALESCE(SUM(qi.xp_concedido), 0) AS xp_custom
    FROM public.quest_instancias qi
    JOIN vidas a ON a.usuario_id = qi.usuario_id
    WHERE qi.meta_codigo NOT LIKE 'streak_%'
      AND qi.status = 'concluida'
    GROUP BY qi.usuario_id
),
xp_conquistas AS (
    SELECT g.usuario_id,
           COALESCE(SUM((c->>'xp_bonus')::int), 0) AS xp_conquista,
           MAX((c->>'desbloqueada_em')::timestamptz) AS ultima_conquista
    FROM public.gamificacao g
    JOIN vidas a ON a.usuario_id = g.usuario_id
    CROSS JOIN LATERAL jsonb_array_elements(COALESCE(g.conquistas_desbloqueadas, '[]'::jsonb)) AS c
    GROUP BY g.usuario_id
),
xp_final AS (
    SELECT a.usuario_id,
           COALESCE(xc.xp_base, 0)
         + COALESCE(xs.xp_bonus, 0)
         + COALESCE(xp.xp_custom, 0)
         + COALESCE(xcg.xp_conquista, 0) AS xp_total,
           xcg.ultima_conquista
    FROM vidas a
    LEFT JOIN xp_conversas xc    ON xc.usuario_id = a.usuario_id
    LEFT JOIN xp_streak_bonus xs ON xs.usuario_id = a.usuario_id
    LEFT JOIN xp_personalizadas xp ON xp.usuario_id = a.usuario_id
    LEFT JOIN xp_conquistas xcg  ON xcg.usuario_id = a.usuario_id
),
nivel_destino AS (
    SELECT xf.usuario_id, jn.nivel, jn.titulo, jn.xp_proximo_nivel
    FROM xp_final xf
    LEFT JOIN LATERAL (
        SELECT jn.*
        FROM public.jornada_niveis jn
        WHERE xf.xp_total >= jn.xp_minimo
        ORDER BY jn.xp_minimo DESC
        LIMIT 1
    ) jn ON TRUE
)
UPDATE public.gamificacao g
SET xp_total             = xf.xp_total,
    nivel_atual          = nd.nivel,
    titulo_nivel         = nd.titulo,
    xp_proximo_nivel     = nd.xp_proximo_nivel,
    ultima_conquista_data = xf.ultima_conquista,
    atualizado_em        = NOW()
FROM xp_final xf
LEFT JOIN nivel_destino nd ON nd.usuario_id = xf.usuario_id
WHERE g.usuario_id = xf.usuario_id;

COMMIT;
