-- Atualiza as conquistas do usuário de testes (UUID d949d81c-9235-41ce-8b3b-6b5d593c5e24)
-- com base em docs/data/conquistas_aldo.json.
-- Executar após garantir que o usuário existe na tabela public.gamificacao.

WITH alvo AS (
  SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
seed AS (
  SELECT *
  FROM (VALUES
    ('primeira_conversa', 'Primeira Semente',       '🌱',  50, 'primeiros_passos', '2025-10-12T07:50:14.366Z'::timestamptz),
    ('primeira_reflexao', 'Pensador',               '💭',  50, 'primeiros_passos', '2025-10-12T07:50:14.367Z'::timestamptz),
    ('primeira_semana',   'Semana Completa',        '🎯', 100, 'primeiros_passos', '2025-10-14T07:02:28.990Z'::timestamptz),
    ('reflexao_profunda', 'Reflexão Profunda',      '🧠', 200, 'profundidade',     '2025-10-16T10:03:32.214Z'::timestamptz),
    ('streak_7_dias',     'Chama Acesa',            '🔥', 150, 'consistencia',     '2025-10-17T14:55:20.947Z'::timestamptz)
  ) AS s(id, nome, emoji, xp_bonus, categoria, desbloqueada_em)
),
payload AS (
  SELECT
    jsonb_agg(
      jsonb_build_object(
        'id', s.id,
        'nome', s.nome,
        'emoji', s.emoji,
        'xp_bonus', s.xp_bonus,
        'categoria', s.categoria,
        'desbloqueada_em', s.desbloqueada_em
      )
      ORDER BY s.desbloqueada_em
    )                             AS conquistas_json,
    SUM(s.xp_bonus)               AS xp_total_conquistas,
    MAX(s.desbloqueada_em)        AS ultima_conquista_data,
    NULL::uuid                    AS ultima_conquista_uuid
  FROM seed s
),
novo_estado AS (
  SELECT
    g.id,
    g.usuario_id,
    GREATEST(COALESCE(g.xp_total, 0), COALESCE(p.xp_total_conquistas, 0)) AS xp_final,
    p.conquistas_json,
    p.ultima_conquista_uuid,
    p.ultima_conquista_data,
    GREATEST(COALESCE(g.melhor_streak, 0), 7) AS melhor_streak_final
  FROM public.gamificacao g
  JOIN alvo a ON a.usuario_id = g.usuario_id
  CROSS JOIN payload p
),
nivel_ajustado AS (
  SELECT
    ne.*,
    lvl.nivel           AS nivel_calculado,
    lvl.titulo          AS titulo_calculado,
    lvl.xp_proximo_nivel AS xp_proximo_calculado
  FROM novo_estado ne
  LEFT JOIN LATERAL (
    SELECT gn.nivel, gn.titulo, gn.xp_proximo_nivel
    FROM public.gamificacao_niveis gn
    WHERE ne.xp_final >= gn.xp_minimo
    ORDER BY gn.xp_minimo DESC
    LIMIT 1
  ) lvl ON TRUE
)
UPDATE public.gamificacao g
SET
  xp_total             = na.xp_final,
  nivel_atual          = COALESCE(na.nivel_calculado, g.nivel_atual),
  titulo_nivel         = COALESCE(na.titulo_calculado, g.titulo_nivel),
  xp_proximo_nivel     = COALESCE(na.xp_proximo_calculado, g.xp_proximo_nivel),
  conquistas_desbloqueadas = na.conquistas_json,
  ultima_conquista_id  = COALESCE(na.ultima_conquista_uuid, g.ultima_conquista_id),
  ultima_conquista_data = na.ultima_conquista_data,
  melhor_streak        = na.melhor_streak_final,
  atualizado_em        = NOW()
FROM nivel_ajustado na
WHERE g.id = na.id;
