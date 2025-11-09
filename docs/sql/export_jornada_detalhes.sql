-- Breakdown detalhado de XP por usuário para auditar o valor final.
-- Use em conjunto com export_jornada_validacao.sql.

WITH conversas AS (
    SELECT uc.usuario_id, COUNT(*) * 75 AS xp_conversas
    FROM public.usr_chat uc
    WHERE uc.data_conversa IS NOT NULL
    GROUP BY uc.usuario_id
),
streak_bonus AS (
    SELECT qi.usuario_id, COALESCE(SUM(qi.xp_concedido), 0) AS xp_streak
    FROM public.quest_instancias qi
    WHERE qi.meta_codigo LIKE 'streak_%'
      AND qi.status = 'concluida'
    GROUP BY qi.usuario_id
),
quests_personalizadas AS (
    SELECT qi.usuario_id, COALESCE(SUM(qi.xp_concedido), 0) AS xp_personalizadas
    FROM public.quest_instancias qi
    WHERE qi.meta_codigo NOT LIKE 'streak_%'
      AND qi.status = 'concluida'
    GROUP BY qi.usuario_id
)
SELECT
    u.id AS usuario_id,
    COALESCE(u.nome, u.nome_preferencia, 'sem_nome') AS usuario_nome,
    COALESCE(conv.xp_conversas, 0)          AS xp_conversas,
    COALESCE(streak.xp_streak, 0)           AS xp_bonus_streak,
    COALESCE(qp.xp_personalizadas, 0)       AS xp_quests_personalizadas,
    (COALESCE(conv.xp_conversas, 0)
     + COALESCE(streak.xp_streak, 0)
     + COALESCE(qp.xp_personalizadas, 0))   AS xp_calculado,
    COALESCE(qe.xp_total, 0)                AS xp_snapshot,
    COALESCE(qe.xp_total, 0)
      - (COALESCE(conv.xp_conversas, 0)
         + COALESCE(streak.xp_streak, 0)
         + COALESCE(qp.xp_personalizadas, 0)) AS diferenca
FROM public.usuarios u
LEFT JOIN conversas conv ON conv.usuario_id = u.id
LEFT JOIN streak_bonus streak ON streak.usuario_id = u.id
LEFT JOIN quests_personalizadas qp ON qp.usuario_id = u.id
LEFT JOIN public.quest_estado_usuario qe ON qe.usuario_id = u.id
WHERE COALESCE(u.ativo, true) = true
ORDER BY xp_snapshot DESC, usuario_nome ASC;
