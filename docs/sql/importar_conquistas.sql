/**
 * Script de migração para registrar conquistas históricas de um usuário.
 * Antes de executar, SUBSTITUA o valor de USUARIO alvo na CTE vars.
 *
 * Este script foi escrito para rodar em ambientes como PgAdmin (sem \set).
 */

BEGIN;

-- =====================================================================
-- 1. Consolidar as quests de sistema já concluídas historicamente
-- =====================================================================
WITH vars AS (
    SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
historico AS (
    SELECT
        v.usuario_id,
        h.meta_codigo,
        h.status,
        h.progresso_meta,
        h.progresso_atual,
        h.concluido_em,
        h.xp_concedido
    FROM vars v
    CROSS JOIN (
        VALUES
            ('onboarding_primeira_conversa', 'concluida', 1, 1,  '2025-10-12T07:50:14.366Z'::timestamp,  40),
            ('onboarding_primeira_semana',   'concluida', 7, 7,  '2025-10-14T07:02:28.990Z'::timestamp, 120),
            ('streak_003',                   'concluida', 3, 3,  '2025-10-13T08:00:00Z'::timestamp,       80),
            ('streak_005',                   'concluida', 5, 5,  '2025-10-15T08:00:00Z'::timestamp,      100),
            ('streak_007',                   'concluida', 7, 7,  '2025-10-17T14:55:20.947Z'::timestamp,   130)
    ) AS h(meta_codigo, status, progresso_meta, progresso_atual, concluido_em, xp_concedido)
),
atualizadas AS (
    UPDATE public.quest_instancias qi
    SET status               = h.status,
        progresso_meta       = h.progresso_meta,
        progresso_atual      = h.progresso_atual,
        progresso_percentual = 100,
        xp_concedido         = h.xp_concedido,
        tentativas           = COALESCE(qi.tentativas, 1),
        janela_inicio        = COALESCE(h.concluido_em::date, qi.janela_inicio),
        janela_fim           = COALESCE(h.concluido_em::date, qi.janela_fim),
        referencia_data      = COALESCE(h.concluido_em::date, qi.referencia_data),
        concluido_em         = h.concluido_em,
        cancelado_em         = NULL,
        reiniciada_em        = NULL,
        atualizado_em        = NOW()
    FROM historico h
    WHERE qi.usuario_id = h.usuario_id
      AND qi.meta_codigo = h.meta_codigo
    RETURNING h.meta_codigo
),
inseridas AS (
    INSERT INTO public.quest_instancias (
        id,
        usuario_id,
        modelo_id,
        meta_codigo,
        status,
        progresso_atual,
        progresso_meta,
        progresso_percentual,
        xp_concedido,
        tentativas,
        janela_inicio,
        janela_fim,
        contexto_origem,
        referencia_data,
        ativado_em,
        atualizado_em,
        concluido_em
    )
    SELECT
        gen_random_uuid(),
        h.usuario_id,
        qm.id,
        h.meta_codigo,
        h.status,
        h.progresso_atual,
        h.progresso_meta,
        100,
        h.xp_concedido,
        1,
        h.concluido_em::date,
        h.concluido_em::date,
        NULL,
        h.concluido_em::date,
        h.concluido_em,
        NOW(),
        h.concluido_em
    FROM historico h
    JOIN public.quest_modelos qm ON qm.codigo = h.meta_codigo
    WHERE NOT EXISTS (
        SELECT 1 FROM atualizadas a WHERE a.meta_codigo = h.meta_codigo
    )
      AND NOT EXISTS (
        SELECT 1
        FROM public.quest_instancias qi
        WHERE qi.usuario_id = h.usuario_id
          AND qi.meta_codigo = h.meta_codigo
    )
    RETURNING meta_codigo
)
SELECT 'Quests históricas processadas';

-- =====================================================================
-- 2. Garante as metas de streak atuais/pedentes (10 ativa, 15 pendente)
-- =====================================================================
WITH vars AS (
    SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
metas AS (
    SELECT v.usuario_id, 'streak_010'::text AS meta_codigo, 'ativa'::text AS status,
           10 AS progresso_meta, NOW() AS ativado_em
    FROM vars v
    UNION ALL
    SELECT v.usuario_id, 'streak_015', 'pendente', 15, NULL
    FROM vars v
),
upsert_metas AS (
    UPDATE public.quest_instancias qi
    SET status               = m.status,
        progresso_meta       = m.progresso_meta,
        progresso_atual      = 0,
        progresso_percentual = 0,
        xp_concedido         = 0,
        tentativas           = COALESCE(qi.tentativas, 0),
        janela_inicio        = NULL,
        janela_fim           = NULL,
        contexto_origem      = NULL,
        referencia_data      = NOW()::date,
        concluido_em         = NULL,
        cancelado_em         = NULL,
        reiniciada_em        = NULL,
        ativado_em           = COALESCE(m.ativado_em, qi.ativado_em, NOW()),
        atualizado_em        = NOW()
    FROM metas m
    WHERE qi.usuario_id = m.usuario_id
      AND qi.meta_codigo = m.meta_codigo
    RETURNING m.meta_codigo
)
INSERT INTO public.quest_instancias (
    id,
    usuario_id,
    modelo_id,
    meta_codigo,
    status,
    progresso_atual,
    progresso_meta,
    progresso_percentual,
    xp_concedido,
    tentativas,
    janela_inicio,
    janela_fim,
    contexto_origem,
    referencia_data,
    ativado_em,
    atualizado_em
)
SELECT
    gen_random_uuid(),
    m.usuario_id,
    qm.id,
    m.meta_codigo,
    m.status,
    0,
    m.progresso_meta,
    0,
    0,
    0,
    NULL,
    NULL,
    NULL,
    NOW()::date,
    COALESCE(m.ativado_em, NOW()),
    NOW()
FROM metas m
JOIN public.quest_modelos qm ON qm.codigo = m.meta_codigo
WHERE NOT EXISTS (
    SELECT 1 FROM upsert_metas um WHERE um.meta_codigo = m.meta_codigo
)
  AND NOT EXISTS (
    SELECT 1
    FROM public.quest_instancias qi
    WHERE qi.usuario_id = m.usuario_id
      AND qi.meta_codigo = m.meta_codigo
);

-- =====================================================================
-- 3. Atualiza o snapshot consolidado do usuário com XP/nível históricos
-- =====================================================================
WITH vars AS (
    SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
alvos AS (
    SELECT
        v.usuario_id,
        1020  AS xp_total_alvo,
        3     AS nivel_alvo,
        'Conversador Assíduo'::text AS titulo_nivel_alvo,
        1350  AS xp_proximo_alvo,
        7     AS streak_recorde,
        0     AS streak_atual,
        'streak_010'::text AS meta_ativa,
        'streak_015'::text AS proxima_meta
    FROM vars v
)
UPDATE public.quest_estado_usuario eu
SET xp_total              = GREATEST(eu.xp_total, a.xp_total_alvo),
    nivel_atual           = a.nivel_alvo,
    titulo_nivel          = a.titulo_nivel_alvo,
    xp_proximo_nivel      = a.xp_proximo_alvo,
    sequencia_recorde     = GREATEST(eu.sequencia_recorde, a.streak_recorde),
    sequencia_atual       = a.streak_atual,
    meta_sequencia_codigo = a.meta_ativa,
    proxima_meta_codigo   = a.proxima_meta,
    total_quests_concluidas = GREATEST(eu.total_quests_concluidas, 5),
    sequencia_status      = jsonb_build_object(
        'estado', 'ativa',
        'reinicios', COALESCE((eu.sequencia_status ->> 'reinicios')::int, 0),
        'completado_em', NULL,
        'alvo_conversas', 10
    ),
    atualizado_em         = NOW()
FROM alvos a
WHERE eu.usuario_id = a.usuario_id;

COMMIT;
