-- Query para sanear inconsistências de 19/11
-- Reverte quests que estão marcadas como concluídas em recorrencias
-- mas não têm XP registrado em conquistas_historico
-- Permite refazer a conclusão corretamente

WITH usuario_alvo AS (
  SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
-- Buscar quests que estão concluídas em recorrencias para 19/11 mas sem XP
quests_inconsistentes AS (
  SELECT DISTINCT
    uq.id AS quest_id,
    uq.usuario_id,
    uq.recorrencias
  FROM public.usuarios_quest uq
  JOIN usuario_alvo ua ON ua.usuario_id = uq.usuario_id
  CROSS JOIN LATERAL jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
  WHERE (dia_elem->>'data')::date = '2025-11-19'::date
    AND (dia_elem->>'status') = 'concluida'
    AND NOT EXISTS (
      -- Verificar se tem XP registrado em conquistas_historico para essa data
      SELECT 1
      FROM public.conquistas_historico ch
      CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
      WHERE ch.meta_codigo = uq.id::text
        AND ch.tipo = 'quest'
        AND ch.usuario_id = uq.usuario_id
        AND (occ->>'data_concluida')::date = '2025-11-19'::date
    )
)
-- Reverter o status para pendente em recorrencias
UPDATE public.usuarios_quest uq
SET
  recorrencias = jsonb_set(
    uq.recorrencias,
    ARRAY['dias', (
      SELECT (idx - 1)::text
      FROM quests_inconsistentes qi, jsonb_array_elements(qi.recorrencias->'dias') WITH ORDINALITY arr(elem, idx)
      WHERE (elem->>'data')::date = '2025-11-19'::date
        AND qi.quest_id = uq.id
    )],
    jsonb_build_object(
      'data', (dia_elem->>'data'),
      'status', 'pendente',
      'xp_previsto', COALESCE((dia_elem->>'xp_previsto')::int, 30),
      'concluido_em', NULL
    )
  ),
  atualizado_em = CURRENT_TIMESTAMP
FROM quests_inconsistentes qi
CROSS JOIN LATERAL jsonb_array_elements(qi.recorrencias->'dias') AS dia_elem
WHERE uq.id = qi.quest_id
  AND (dia_elem->>'data')::date = '2025-11-19'::date
  AND (dia_elem->>'status') = 'concluida'
RETURNING
  uq.id AS quest_id,
  uq.config->>'titulo' AS titulo,
  (uq.recorrencias->'dias'->(
    SELECT (idx - 1)::int
    FROM jsonb_array_elements(uq.recorrencias->'dias') WITH ORDINALITY arr(elem, idx)
    WHERE (elem->>'data')::date = '2025-11-19'::date
    LIMIT 1
  )->>'status') AS novo_status;

-- Verificar resultado
SELECT 
  uq.id AS quest_id,
  uq.config->>'titulo' AS titulo,
  (dia_elem->>'data')::date AS data_dia,
  dia_elem->>'status' AS status_dia,
  CASE 
    WHEN EXISTS (
      SELECT 1
      FROM public.conquistas_historico ch
      CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
      WHERE ch.meta_codigo = uq.id::text
        AND ch.tipo = 'quest'
        AND (occ->>'data_concluida')::date = (dia_elem->>'data')::date
    ) THEN 'TEM XP'
    ELSE 'SEM XP - PODE CONCLUIR'
  END AS situacao
FROM public.usuarios_quest uq
CROSS JOIN LATERAL jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
WHERE uq.usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'
  AND (dia_elem->>'data')::date = '2025-11-19'::date
ORDER BY uq.id;

