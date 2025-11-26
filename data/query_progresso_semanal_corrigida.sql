-- Query corrigida para webhook_progresso_semanal
-- Inclui quests com recorrencias E quests sem recorrencias dentro da janela da semana

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
    -- Buscar XP da quest reflexao_diaria do catálogo
    COALESCE(qc.xp, 10) AS pontos_por_dia
  FROM limites l
  LEFT JOIN public.quests_catalogo qc ON qc.codigo = 'reflexao_diaria'
), quest_reflexao_diaria AS (
  SELECT
    uq.usuario_id,
    uq.id AS usuarios_quest_id
  FROM public.usuarios_quest uq
  JOIN limites l ON l.usuario_id = uq.usuario_id
  JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  WHERE qc.codigo = 'reflexao_diaria'
    AND uq.status NOT IN ('cancelada', 'vencida')
), conversas_validas AS (
  SELECT DISTINCT
    ch.usuario_id,
    date(occ->>'data_concluida') AS data
  FROM public.conquistas_historico ch
  JOIN limites l ON l.usuario_id = ch.usuario_id
  JOIN quest_reflexao_diaria qrd ON qrd.usuario_id = ch.usuario_id
  CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
  WHERE ch.tipo = 'conversa'
    AND ch.usuarios_quest_id = qrd.usuarios_quest_id
    AND date(occ->>'data_concluida') BETWEEN l.semana_inicio AND l.semana_fim
), pontos_conversa AS (
  SELECT
    d.usuario_id,
    d.data,
    CASE WHEN cv.data IS NOT NULL THEN mc.pontos_por_dia ELSE 0 END AS xp_conversa
  FROM dias d
  LEFT JOIN conversas_validas cv ON cv.usuario_id = d.usuario_id AND cv.data = d.data
  LEFT JOIN meta_conversa mc ON mc.usuario_id = d.usuario_id
), quest_reflexao_diaria_ativa AS (
  -- Identificar quest de reflexão diária ativa (para contar em todos os dias)
  SELECT DISTINCT
    uq.usuario_id,
    uq.id AS quest_id
  FROM public.usuarios_quest uq
  JOIN limites l ON l.usuario_id = uq.usuario_id
  JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  WHERE qc.codigo = 'reflexao_diaria'
    AND uq.status NOT IN ('cancelada', 'vencida')
), quests_recorrentes AS (
  -- Quests com recorrencias (EXCETO reflexão diária - ela é tratada separadamente)
  SELECT
    uq.usuario_id,
    uq.id AS quest_id,
    (dia_elem->>'data')::date AS data,
    COALESCE((dia_elem->>'xp_previsto')::int, 0) AS xp_previsto
  FROM public.usuarios_quest uq
  JOIN limites l ON l.usuario_id = uq.usuario_id
  JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  CROSS JOIN LATERAL jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
  WHERE uq.recorrencias IS NOT NULL
    AND qc.codigo != 'reflexao_diaria'  -- Excluir reflexão diária daqui
    AND (dia_elem->>'data')::date BETWEEN l.semana_inicio AND l.semana_fim
), quest_reflexao_todos_dias AS (
  -- Reflexão diária: 1 quest para TODOS os dias da semana (ignora recorrencias->'dias')
  SELECT
    qrd.usuario_id,
    qrd.quest_id,
    d.data,
    COALESCE(qc.xp, 10) AS xp_previsto
  FROM quest_reflexao_diaria_ativa qrd
  JOIN dias d ON d.usuario_id = qrd.usuario_id
  LEFT JOIN public.quests_catalogo qc ON qc.codigo = 'reflexao_diaria'
), quests_sem_recorrencia AS (
  -- Quests sem recorrencias que estão dentro da janela da semana
  -- Se recorrencia = 'unica', aparece apenas no dia ativado_em
  -- Se tiver janela_inicio/janela_fim, aparece em todos os dias da janela
  SELECT
    uq.usuario_id,
    uq.id AS quest_id,
    d.data,
    COALESCE((uq.config->>'xp_recompensa')::int, 40) AS xp_previsto
  FROM public.usuarios_quest uq
  JOIN limites l ON l.usuario_id = uq.usuario_id
  JOIN dias d ON d.usuario_id = uq.usuario_id
  WHERE uq.recorrencias IS NULL
    AND uq.status NOT IN ('cancelada', 'vencida')
    AND (
      -- PRIORIDADE 1: Se recorrencia = 'unica', apenas no dia ativado_em
      (COALESCE(uq.config->>'recorrencia', 'unica') = 'unica' 
       AND d.data = uq.ativado_em::date)
      OR
      -- PRIORIDADE 2: Se tem janela definida, usar a janela
      (uq.janela_inicio IS NOT NULL AND uq.janela_fim IS NOT NULL 
       AND COALESCE(uq.config->>'recorrencia', 'unica') != 'unica'
       AND d.data BETWEEN uq.janela_inicio AND uq.janela_fim)
      OR
      -- PRIORIDADE 3: Caso contrário, usar janela padrão (semana inteira se dentro da janela)
      (uq.janela_inicio IS NULL AND uq.janela_fim IS NULL
       AND COALESCE(uq.config->>'recorrencia', 'unica') != 'unica'
       AND d.data BETWEEN l.semana_inicio AND l.semana_fim
       AND d.data >= uq.ativado_em::date)
    )
), quests_todas AS (
  -- Unir quests: recorrentes (exceto reflexão), reflexão diária (todos os dias), e sem recorrencias
  SELECT usuario_id, quest_id, data, xp_previsto FROM quests_recorrentes
  UNION ALL
  SELECT usuario_id, quest_id, data, xp_previsto FROM quest_reflexao_todos_dias
  UNION ALL
  SELECT usuario_id, quest_id, data, xp_previsto FROM quests_sem_recorrencia
), meta_quest_diaria AS (
  SELECT
    usuario_id,
    data,
    COALESCE(SUM(xp_previsto), 0) AS meta_quests
  FROM quests_todas
  GROUP BY usuario_id, data
), qtd_quests_previstas AS (
  SELECT
    usuario_id,
    data,
    COUNT(DISTINCT quest_id) AS qtd_quests_previstas
  FROM quests_todas
  GROUP BY usuario_id, data
), quests_concluidas AS (
  -- Quests normais (tipo = 'quest')
  SELECT
    ch.usuario_id,
    ch.usuarios_quest_id AS quest_id,
    (occ->>'data_concluida')::date AS data,
    COALESCE((occ->>'xp_base')::int, 0) AS xp_base,
    COALESCE((occ->>'xp_bonus')::int, 0) AS xp_bonus
  FROM public.conquistas_historico ch
  JOIN limites l ON l.usuario_id = ch.usuario_id
  CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
  WHERE ch.tipo = 'quest'
    AND (occ->>'data_concluida')::date BETWEEN l.semana_inicio AND l.semana_fim
  UNION ALL
  -- Conversas (tipo = 'conversa') - contam como quest concluída
  SELECT
    ch.usuario_id,
    ch.usuarios_quest_id AS quest_id,
    (occ->>'data_concluida')::date AS data,
    COALESCE((occ->>'xp_base')::int, 0) AS xp_base,
    COALESCE((occ->>'xp_bonus')::int, 0) AS xp_bonus
  FROM public.conquistas_historico ch
  JOIN limites l ON l.usuario_id = ch.usuario_id
  CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
  WHERE ch.tipo = 'conversa'
    AND (occ->>'data_concluida')::date BETWEEN l.semana_inicio AND l.semana_fim
), qtd_quests_concluidas AS (
  SELECT
    usuario_id,
    data,
    COUNT(DISTINCT quest_id) AS qtd_quests_concluidas
  FROM quests_concluidas
  GROUP BY usuario_id, data
), pontos_quest AS (
  SELECT
    d.usuario_id,
    d.data,
    COALESCE(SUM(qc.xp_base), 0) AS xp_base,
    COALESCE(SUM(qc.xp_bonus), 0) AS xp_bonus
  FROM dias d
  LEFT JOIN (
    SELECT DISTINCT ON (usuario_id, quest_id, data)
      usuario_id,
      quest_id,
      data,
      xp_base,
      xp_bonus
    FROM quests_concluidas
    ORDER BY usuario_id, quest_id, data, xp_base DESC
  ) AS qc ON qc.usuario_id = d.usuario_id AND qc.data = d.data
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
    pc.xp_conversa + pq.xp_base AS xp_total,
    COALESCE(qqp.qtd_quests_previstas, 0) AS qtd_quests_previstas,
    COALESCE(qqc.qtd_quests_concluidas, 0) AS qtd_quests_concluidas
  FROM dias d
  LEFT JOIN meta_conversa mc ON mc.usuario_id = d.usuario_id
  LEFT JOIN meta_quest_diaria mqd ON mqd.usuario_id = d.usuario_id AND mqd.data = d.data
  LEFT JOIN qtd_quests_previstas qqp ON qqp.usuario_id = d.usuario_id AND qqp.data = d.data
  LEFT JOIN qtd_quests_concluidas qqc ON qqc.usuario_id = d.usuario_id AND qqc.data = d.data
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
  COALESCE(SUM(r.qtd_quests_previstas), 0) AS qtd_quests_previstas_semana,
  COALESCE(SUM(r.qtd_quests_concluidas), 0) AS qtd_quests_concluidas_semana,
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
      'metaQuests', r.meta_quests,
      'qtdQuestsPrevistas', r.qtd_quests_previstas,
      'qtdQuestsConcluidas', r.qtd_quests_concluidas
    )
    ORDER BY r.data
  ) AS dias
FROM limites l
LEFT JOIN resumo_dias r ON r.usuario_id = l.usuario_id
LEFT JOIN public.usuarios_conquistas uc ON uc.usuario_id = l.usuario_id
GROUP BY l.usuario_id, l.semana_inicio, l.semana_fim, uc.sequencia_atual;

