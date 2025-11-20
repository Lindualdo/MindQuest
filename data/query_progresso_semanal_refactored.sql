-- Query refatorada para usar campo recorrencias
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
), meta_conversa AS (
  SELECT
    l.usuario_id,
    COALESCE(mc.xp_recompensa, 15) AS pontos_por_dia
  FROM limites l
  LEFT JOIN public.metas_catalogo mc ON mc.codigo = 'conversa_diaria'
), conversas_validas AS (
  SELECT
    uc.usuario_id,
    uc.data_conversa::date AS data
  FROM public.usr_chat uc
  JOIN limites l ON l.usuario_id = uc.usuario_id
  WHERE uc.data_conversa::date BETWEEN l.semana_inicio AND l.semana_fim
  GROUP BY uc.usuario_id, uc.data_conversa::date
), pontos_conversa AS (
  SELECT
    d.usuario_id,
    d.data,
    CASE WHEN cv.data IS NOT NULL THEN mc.pontos_por_dia ELSE 0 END AS xp_conversa
  FROM dias d
  LEFT JOIN conversas_validas cv ON cv.usuario_id = d.usuario_id AND cv.data = d.data
  LEFT JOIN meta_conversa mc ON mc.usuario_id = d.usuario_id
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
    mc.pontos_por_dia AS meta_conversa,
    COALESCE(mqd.meta_quests, 0) AS meta_quests,
    mc.pontos_por_dia + COALESCE(mqd.meta_quests, 0) AS meta_total,
    pc.xp_conversa,
    pq.xp_base AS xp_quests,
    pq.xp_bonus,
    pc.xp_conversa + pq.xp_base AS xp_total
  FROM dias d
  LEFT JOIN meta_conversa mc ON mc.usuario_id = d.usuario_id
  LEFT JOIN meta_quest_diaria mqd ON mqd.usuario_id = d.usuario_id AND mqd.data = d.data
  LEFT JOIN pontos_conversa pc ON pc.usuario_id = d.usuario_id AND pc.data = d.data
  LEFT JOIN pontos_quest pq ON pq.usuario_id = d.usuario_id AND pq.data = d.data
)
SELECT
  l.usuario_id,
  l.semana_inicio,
  l.semana_fim,
  COALESCE(uc.sequencia_atual, 0) AS sequencia_atual,
  COALESCE(SUM(r.xp_total), 0) AS xp_semana_total,
  COALESCE(SUM(r.meta_total), 0) AS meta_semana_total,
  COUNT(*) FILTER (WHERE r.xp_total > 0) AS streak_dias,
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
      'xpConversa', r.xp_conversa,
      'xpQuests', r.xp_quests,
      'metaDia', r.meta_total,
      'metaConversa', r.meta_conversa,
      'metaQuests', r.meta_quests
    )
    ORDER BY r.data
  ) AS dias
FROM limites l
LEFT JOIN resumo_dias r ON r.usuario_id = l.usuario_id
LEFT JOIN public.usuarios_conquistas uc ON uc.usuario_id = l.usuario_id
GROUP BY l.usuario_id, l.semana_inicio, l.semana_fim, uc.sequencia_atual;

