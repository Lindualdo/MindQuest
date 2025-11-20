-- Query refatorada para painel de quests usando recorrencias
WITH params AS (
  SELECT
    $1::uuid AS usuario_id,
    (date_trunc('week', CURRENT_DATE + 1)::date - 1) AS semana_inicio
), limites AS (
  SELECT
    usuario_id,
    semana_inicio,
    semana_inicio + 6 AS semana_fim
  FROM params
), dias AS (
  SELECT
    l.usuario_id,
    generate_series(l.semana_inicio, l.semana_fim, INTERVAL '1 day')::date AS data
  FROM limites l
), quests_recorrentes AS (
  -- Usa o campo recorrencias JSONB para extrair meta por dia
  SELECT
    uq.usuario_id,
    uq.id AS quest_id,
    (dia_elem->>'data')::date AS data,
    COALESCE((dia_elem->>'xp_previsto')::int, 0) AS xp_previsto
  FROM public.usuarios_quest uq
  JOIN limites l ON l.usuario_id = uq.usuario_id
  CROSS JOIN LATERAL jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
  WHERE uq.recorrencias IS NOT NULL
    AND (dia_elem->>'data')::date BETWEEN l.semana_inicio AND l.semana_fim
), meta_quest_diaria AS (
  SELECT
    usuario_id,
    data,
    COALESCE(SUM(xp_previsto), 0) AS meta_quests
  FROM quests_recorrentes
  GROUP BY usuario_id, data
), quests_concluidas AS (
  SELECT
    ch.usuario_id,
    (ch.registrado_em AT TIME ZONE 'America/Sao_Paulo')::date AS data,
    COALESCE(ch.xp_base, 0) AS xp_base,
    COALESCE(ch.xp_bonus, 0) AS xp_bonus
  FROM public.conquistas_historico ch
  JOIN limites l ON l.usuario_id = ch.usuario_id
  WHERE ch.tipo = 'quest'
    AND (ch.registrado_em AT TIME ZONE 'America/Sao_Paulo')::date BETWEEN l.semana_inicio AND l.semana_fim
), pontos_quest AS (
  SELECT
    d.usuario_id,
    d.data,
    COALESCE(SUM(qc.xp_base), 0) AS xp_base,
    COALESCE(SUM(qc.xp_bonus), 0) AS xp_bonus
  FROM dias d
  LEFT JOIN quests_concluidas qc ON qc.usuario_id = d.usuario_id AND qc.data = d.data
  GROUP BY d.usuario_id, d.data
), resumo_dias AS (
  SELECT
    d.usuario_id,
    d.data,
    COALESCE(mqd.meta_quests, 0) AS meta_quests,
    pq.xp_base AS xp_quests,
    pq.xp_bonus,
    pq.xp_base AS xp_total
  FROM dias d
  LEFT JOIN meta_quest_diaria mqd ON mqd.usuario_id = d.usuario_id AND mqd.data = d.data
  LEFT JOIN pontos_quest pq ON pq.usuario_id = d.usuario_id AND pq.data = d.data
)
SELECT
  l.usuario_id,
  l.semana_inicio,
  l.semana_fim,
  COALESCE(SUM(r.xp_total), 0) AS xp_semana_total,
  COALESCE(SUM(r.meta_quests), 0) AS meta_semana_total,
  json_agg(
    json_build_object(
      'data', r.data::text,
      'label', CASE EXTRACT(ISODOW FROM r.data)
                 WHEN 7 THEN 'Dom'
                 WHEN 1 THEN 'Seg'
                 WHEN 2 THEN 'Ter'
                 WHEN 3 THEN 'Qua'
                 WHEN 4 THEN 'Qui'
                 WHEN 5 THEN 'Sex'
                 WHEN 6 THEN 'Sáb'
               END,
      'totalXp', r.xp_total,
      'xpBase', r.xp_total,
      'xpBonus', r.xp_bonus,
      'xpQuests', r.xp_quests,
      'metaDia', r.meta_quests
    )
    ORDER BY r.data
  ) AS dias
FROM limites l
LEFT JOIN resumo_dias r ON r.usuario_id = l.usuario_id
GROUP BY l.usuario_id, l.semana_inicio, l.semana_fim;

