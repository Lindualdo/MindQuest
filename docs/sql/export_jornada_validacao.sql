-- Gera a planilha de validação da jornada com XP de conversas, XP total e nível atual.
-- Execute via psql e exporte para CSV, por exemplo:
--   \copy (\i docs/sql/export_jornada_validacao.sql) TO 'data/validacao_jornada.csv' CSV HEADER;

WITH conversas AS (
    SELECT
        uc.usuario_id,
        COUNT(DISTINCT DATE(uc.data_conversa)) * 75 AS xp_conversas, -- regra: só uma conversa por dia gera 75 XP
        COUNT(DISTINCT DATE(uc.data_conversa))     AS dias_distintos,
        COUNT(*)                                   AS conversas_totais
    FROM public.usr_chat uc
    WHERE uc.data_conversa IS NOT NULL
    GROUP BY uc.usuario_id
),
quests AS (
    SELECT
        uq.usuario_id,
        COALESCE(SUM(uq.xp_concedido), 0) AS xp_quests
    FROM public.usuarios_quest uq
    WHERE uq.status = 'concluida'
    GROUP BY uq.usuario_id
),
streak_bonus AS (
    SELECT
        resumo.usuario_id,
        SUM(resumo.completadas) AS streaks_concluidos,
        SUM(resumo.xp_total)    AS xp_bonus_streak,
        COALESCE(json_agg(
            json_build_object(
                'meta_codigo', resumo.meta_codigo,
                'meta_titulo', resumo.meta_titulo,
                'completadas', resumo.completadas,
                'xp_total', resumo.xp_total
            ) ORDER BY resumo.meta_codigo
        ), '[]'::json) AS streaks_bonus_detalhes
    FROM (
        SELECT
            uq.usuario_id,
            qt.codigo AS meta_codigo,
            qt.titulo AS meta_titulo,
            COUNT(*) AS completadas,
            SUM(COALESCE(uq.xp_concedido, qt.xp_recompensa, 0)) AS xp_total
        FROM public.usuarios_quest uq
        JOIN public.metas_catalogo qt ON qt.id = uq.modelo_id
        WHERE qt.tipo = 'sequencia' AND uq.status = 'concluida'
        GROUP BY uq.usuario_id, qt.codigo, qt.titulo
    ) resumo
    GROUP BY resumo.usuario_id
),
historico AS (
    SELECT
        ch.usuario_id,
        json_agg(
            json_build_object(
                'id', ch.id,
                'tipo', ch.tipo,
                'meta_codigo', ch.meta_codigo,
                'meta_titulo', ch.meta_titulo,
                'xp_base', ch.xp_base,
                'xp_bonus', ch.xp_bonus,
                'nivel_anterior', ch.nivel_anterior,
                'nivel_novo', ch.nivel_novo,
                'detalhes', ch.detalhes,
                'registrado_em', ch.registrado_em
            )
            ORDER BY ch.registrado_em DESC
        ) AS historico_conquistas
    FROM public.conquistas_historico ch
    GROUP BY ch.usuario_id
) 
SELECT
    u.id        AS usuario_id,
    COALESCE(u.nome, u.nome_preferencia, 'sem_nome') AS usuario_nome,
    COALESCE(c.xp_conversas, 0)     AS xp_conversas,
    COALESCE(qi.xp_quests, 0)       AS xp_quests,
    COALESCE(qe.xp_total, 0)        AS xp_total,
    COALESCE(qe.nivel_atual, 1)     AS nivel_atual,
    COALESCE(c.dias_distintos, 0)   AS dias_distintos,
    COALESCE(c.conversas_totais, 0) AS conversas_totais,
    COALESCE(sb.streaks_concluidos, 0)      AS streaks_com_bonus,
    COALESCE(sb.xp_bonus_streak, 0)         AS xp_bonus_streak,
    COALESCE(hist.historico_conquistas, '[]'::json) AS historico_conquistas,
    COALESCE(qe.sequencia_atual, 0)    AS sequencia_atual,
    COALESCE(qe.sequencia_recorde, 0)  AS sequencia_recorde,
    qe.meta_sequencia_codigo           AS meta_sequencia_codigo,
    qe.proxima_meta_codigo             AS proxima_meta_codigo
FROM public.usuarios u
LEFT JOIN conversas c ON c.usuario_id = u.id
LEFT JOIN quests qi ON qi.usuario_id = u.id
LEFT JOIN public.usuarios_conquistas qe ON qe.usuario_id = u.id
LEFT JOIN streak_bonus sb ON sb.usuario_id = u.id
LEFT JOIN historico hist ON hist.usuario_id = u.id
WHERE COALESCE(u.ativo, true) = true
ORDER BY xp_total DESC, usuario_nome ASC;
