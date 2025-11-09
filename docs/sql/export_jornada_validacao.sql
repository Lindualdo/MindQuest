-- Gera a planilha de validação da jornada com XP de conversas, XP total e nível atual.
-- Execute via psql e exporte para CSV, por exemplo:
--   \copy (\i docs/sql/export_jornada_validacao.sql) TO 'data/validacao_jornada.csv' CSV HEADER;

WITH conversas AS (
    SELECT
        uc.usuario_id,
        COUNT(*) * 75 AS xp_conversas
    FROM public.usr_chat uc
    WHERE uc.data_conversa IS NOT NULL
    GROUP BY uc.usuario_id
),
quests AS (
    SELECT
        qi.usuario_id,
        COALESCE(SUM(qi.xp_concedido), 0) AS xp_quests
    FROM public.quest_instancias qi
    WHERE qi.status = 'concluida'
    GROUP BY qi.usuario_id
)
SELECT
    u.id        AS usuario_id,
    COALESCE(u.nome, u.nome_preferencia, 'sem_nome') AS usuario_nome,
    COALESCE(c.xp_conversas, 0) AS xp_conversas,
    COALESCE(qi.xp_quests, 0)    AS xp_quests,
    COALESCE(qe.xp_total, 0)    AS xp_total,
    COALESCE(qe.nivel_atual, 1) AS nivel_atual
FROM public.usuarios u
LEFT JOIN conversas c ON c.usuario_id = u.id
LEFT JOIN quests qi ON qi.usuario_id = u.id
LEFT JOIN public.quest_estado_usuario qe ON qe.usuario_id = u.id
WHERE COALESCE(u.ativo, true) = true
ORDER BY xp_total DESC, usuario_nome ASC;
