-- Recomputa sequência de conversas apenas para usuários cujo snapshot está desatualizado.
-- Critério: resumo_jornada.atualizado_em < (CURRENT_DATE - INTERVAL '1 day')
-- OU ultima_conversa_em < CURRENT_DATE - 1. Ajuste o filtro conforme necessidade.

WITH candidatos AS (
    SELECT r.usuario_id
    FROM public.resumo_jornada r
    WHERE r.atualizado_em < CURRENT_DATE
       OR r.ultima_conversa_em < CURRENT_DATE - INTERVAL '1 day'
),
conversas_distintas AS (
    SELECT
        uc.usuario_id,
        DATE(uc.data_conversa) AS dia
    FROM public.usr_chat uc
    JOIN candidatos c ON c.usuario_id = uc.usuario_id
    GROUP BY uc.usuario_id, DATE(uc.data_conversa)
),
ordenadas AS (
    SELECT
        usuario_id,
        dia,
        LAG(dia) OVER (PARTITION BY usuario_id ORDER BY dia) AS dia_anterior
    FROM conversas_distintas
),
blocos AS (
    SELECT
        usuario_id,
        dia,
        CASE WHEN dia_anterior IS NULL OR dia > dia_anterior + INTERVAL '1 day' THEN 1 ELSE 0 END AS quebra
    FROM ordenadas
),
blocos_enriquecidos AS (
    SELECT
        usuario_id,
        dia,
        SUM(quebra) OVER (PARTITION BY usuario_id ORDER BY dia ROWS UNBOUNDED PRECEDING) AS grupo
    FROM blocos
),
streaks AS (
    SELECT
        usuario_id,
        dia,
        grupo,
        ROW_NUMBER() OVER (PARTITION BY usuario_id, grupo ORDER BY dia) AS streak_pos
    FROM blocos_enriquecidos
),
seq_templates AS (
    SELECT codigo, COALESCE(gatilho_valor, 0) AS alvo
    FROM public.quest_templates
    WHERE tipo = 'sequencia' AND ativo = true
),
seq_ordenadas AS (
    SELECT codigo, alvo
    FROM seq_templates
    ORDER BY alvo
),
resultado AS (
    SELECT
        c.usuario_id,
        COUNT(s.dia) * 75 AS xp_base,
        MAX(s.streak_pos) AS recorde,
        MAX(s.streak_pos) FILTER (WHERE s.grupo = s.ultimo_grupo) AS streak_atual,
        MAX(s.dia) AS ultima_conversa
    FROM candidatos c
    LEFT JOIN (
        SELECT s.*, MAX(grupo) OVER (PARTITION BY usuario_id) AS ultimo_grupo
        FROM streaks s
    ) s ON s.usuario_id = c.usuario_id
    GROUP BY c.usuario_id
),
meta_calculada AS (
    SELECT
        r.usuario_id,
        COALESCE(
            (
                SELECT codigo FROM seq_ordenadas
                WHERE alvo > COALESCE(r.streak_atual, 0)
                ORDER BY alvo
                LIMIT 1
            ),
            (
                SELECT codigo FROM seq_ordenadas
                ORDER BY alvo DESC
                LIMIT 1
            )
        ) AS meta_codigo
    FROM resultado r
),
extendido AS (
    SELECT
        r.usuario_id,
        r.xp_base,
        r.recorde,
        COALESCE(r.streak_atual, 0) AS streak_atual,
        r.ultima_conversa,
        m.meta_codigo,
        meta_atual.alvo AS meta_alvo,
        proxima.codigo AS proxima_codigo,
        proxima.alvo AS proxima_alvo
    FROM resultado r
    LEFT JOIN meta_calculada m ON m.usuario_id = r.usuario_id
    LEFT JOIN seq_ordenadas meta_atual ON meta_atual.codigo = m.meta_codigo
    LEFT JOIN seq_ordenadas proxima ON proxima.alvo = (
        SELECT alvo
        FROM seq_ordenadas
        WHERE alvo > meta_atual.alvo
        ORDER BY alvo
        LIMIT 1
    )
)
UPDATE public.resumo_jornada r
SET
    xp_total = COALESCE(r.xp_total - r.total_xp_hoje + ext.xp_base, ext.xp_base),
    sequencia_atual = ext.streak_atual,
    sequencia_recorde = GREATEST(ext.recorde, r.sequencia_recorde),
    meta_sequencia_codigo = ext.meta_codigo,
    proxima_meta_codigo = COALESCE(ext.proxima_codigo, ext.meta_codigo),
    sequencia_status = jsonb_build_object(
        'alvo_conversas', COALESCE(ext.meta_alvo, 0),
        'estado', CASE
            WHEN ext.meta_alvo IS NULL THEN 'indefinida'
            WHEN ext.streak_atual >= COALESCE(ext.meta_alvo, 0) THEN 'atingida'
            ELSE 'ativa'
        END,
        'reinicios', 0,
        'completado_em', NULL
    ),
    ultima_conversa_em = ext.ultima_conversa,
    atualizado_em = NOW()
FROM extendido ext
WHERE r.usuario_id = ext.usuario_id;
