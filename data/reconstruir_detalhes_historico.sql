-- Query para reconstruir conquistas_historico.detalhes no formato v1.3
-- Apenas para o usuário d949d81c-9235-41ce-8b3b-6b5d593c5e24
-- 
-- Esta query:
-- 1. Agrupa registros duplicados de conquistas_historico por meta_codigo
-- 2. Busca conclusões de usuarios_quest.recorrencias->dias[] onde status = 'concluida'
-- 3. Reconstrói detalhes no formato novo com as 3 datas e ocorrencias

WITH usuario_alvo AS (
  SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
-- Agrupar registros duplicados e somar XP
historico_agrupado AS (
  SELECT
    ch.meta_codigo,
    ch.usuario_id,
    ch.tipo,
    MAX(ch.meta_titulo) AS meta_titulo, -- Usar o mais recente
    SUM(ch.xp_base) AS xp_base_total,
    SUM(ch.xp_bonus) AS xp_bonus_total,
    MIN(ch.registrado_em) AS primeira_conclusao,
    MAX(ch.registrado_em) AS ultima_conclusao,
    COUNT(*) AS qtd_registros
  FROM public.conquistas_historico ch
  JOIN usuario_alvo ua ON ua.usuario_id = ch.usuario_id
  WHERE ch.tipo = 'quest'
  GROUP BY ch.meta_codigo, ch.usuario_id, ch.tipo
),
-- Buscar conclusões de usuarios_quest.recorrencias
conclusoes_quests AS (
  SELECT
    uq.id AS quest_id,
    uq.usuario_id,
    COALESCE(uq.config->>'recorrencia', 'unica') AS recorrencia,
    (dia_elem->>'data')::date AS data_planejada,
    COALESCE(
      (dia_elem->>'concluido_em')::timestamp::date,
      (dia_elem->>'data')::date
    ) AS data_concluida,
    (dia_elem->>'concluido_em')::timestamp AS concluido_em_ts,
    COALESCE((dia_elem->>'xp_previsto')::int, 0) AS xp_previsto
  FROM public.usuarios_quest uq
  JOIN usuario_alvo ua ON ua.usuario_id = uq.usuario_id
  CROSS JOIN LATERAL jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
  WHERE uq.recorrencias IS NOT NULL
    AND (dia_elem->>'status') = 'concluida'
),
-- Agrupar conclusões por quest e reconstruir detalhes
detalhes_reconstruidos AS (
  SELECT
    cq.quest_id,
    cq.usuario_id,
    cq.recorrencia,
    COUNT(*) AS total_concluidas,
    MAX(cq.data_concluida) AS data_ultima_conclusao,
    SUM(cq.xp_previsto) AS xp_base_total,
    -- Buscar xp_bonus do historico_agrupado
    COALESCE(ha.xp_bonus_total, 0) AS xp_bonus_total,
    -- Construir array de ocorrencias
    jsonb_agg(
      jsonb_build_object(
        'data_planejada', cq.data_planejada::text,
        'data_concluida', cq.data_concluida::text,
        'data_registrada', COALESCE(
          cq.concluido_em_ts,
          ha.ultima_conclusao,
          NOW()
        )::text,
        'xp_base', cq.xp_previsto,
        'xp_bonus', CASE 
          WHEN cq.recorrencia != 'unica' THEN 6 -- Bonus de recorrencia
          ELSE 0 
        END
      ) ORDER BY cq.data_concluida
    ) AS ocorrencias
  FROM conclusoes_quests cq
  LEFT JOIN historico_agrupado ha ON ha.meta_codigo = cq.quest_id::text
  GROUP BY 
    cq.quest_id, 
    cq.usuario_id, 
    cq.recorrencia,
    ha.xp_bonus_total
),
-- Construir detalhes final no formato v1.3
detalhes_final AS (
  SELECT
    dr.quest_id,
    dr.usuario_id,
    jsonb_build_object(
      'recorrencia', dr.recorrencia,
      'data_conclusao', dr.data_ultima_conclusao::text,
      'total_concluidas', dr.total_concluidas,
      'ocorrencias', dr.ocorrencias
    ) AS detalhes_novo,
    ha.xp_base_total,
    ha.xp_bonus_total,
    ha.meta_titulo
  FROM detalhes_reconstruidos dr
  LEFT JOIN historico_agrupado ha ON ha.meta_codigo = dr.quest_id::text
),
-- Selecionar o primeiro registro de historico para cada meta_codigo (para manter ID)
historico_principal AS (
  SELECT DISTINCT ON (ch.meta_codigo)
    ch.id,
    ch.meta_codigo,
    ch.usuario_id
  FROM public.conquistas_historico ch
  JOIN usuario_alvo ua ON ua.usuario_id = ch.usuario_id
  WHERE ch.tipo = 'quest'
  ORDER BY ch.meta_codigo, ch.registrado_em ASC
)
-- UPDATE: Atualizar o registro principal
UPDATE public.conquistas_historico ch
SET
  xp_base = df.xp_base_total,
  xp_bonus = df.xp_bonus_total,
  meta_titulo = df.meta_titulo,
  detalhes = df.detalhes_novo,
  registrado_em = NOW()
FROM detalhes_final df
JOIN historico_principal hp ON hp.meta_codigo = df.quest_id::text
WHERE ch.id = hp.id
RETURNING
  ch.id,
  ch.meta_codigo,
  ch.meta_titulo,
  ch.xp_base,
  ch.xp_bonus,
  ch.detalhes->>'total_concluidas' AS total_concluidas,
  jsonb_array_length(ch.detalhes->'ocorrencias') AS qtd_ocorrencias;

-- Deletar registros duplicados (manter apenas o primeiro de cada meta_codigo)
DELETE FROM public.conquistas_historico
WHERE usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid
  AND tipo = 'quest'
  AND id NOT IN (
    SELECT DISTINCT ON (meta_codigo) id
    FROM public.conquistas_historico
    WHERE usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid
      AND tipo = 'quest'
    ORDER BY meta_codigo, registrado_em ASC
  );

