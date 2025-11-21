-- Query para limpar recorrencias e histórico
-- Remove status e concluido_em de usuarios_quest.recorrencias
-- Remove registros de conquistas_historico para o usuário
-- Permite começar do zero

WITH usuario_alvo AS (
  SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
-- Limpar recorrencias: remover status e concluido_em de todos os dias
recorrencias_limpas AS (
  SELECT
    uq.id AS quest_id,
    uq.recorrencias,
    -- Reconstruir recorrencias sem status e concluido_em
    jsonb_set(
      uq.recorrencias,
      '{dias}',
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'data', dia_elem->>'data',
            'xp_previsto', COALESCE((dia_elem->>'xp_previsto')::int, 30)
          )
        )
        FROM jsonb_array_elements(uq.recorrencias->'dias') AS dia_elem
      )
    ) AS recorrencias_novo
  FROM public.usuarios_quest uq
  JOIN usuario_alvo ua ON ua.usuario_id = uq.usuario_id
  WHERE uq.recorrencias IS NOT NULL
)
-- Atualizar usuarios_quest removendo status e concluido_em
UPDATE public.usuarios_quest uq
SET
  recorrencias = rl.recorrencias_novo,
  atualizado_em = CURRENT_TIMESTAMP
FROM recorrencias_limpas rl
WHERE uq.id = rl.quest_id
RETURNING
  uq.id AS quest_id,
  uq.config->>'titulo' AS titulo,
  jsonb_array_length(uq.recorrencias->'dias') AS qtd_dias;

-- Deletar conquistas_historico do usuário (zerar histórico)
DELETE FROM public.conquistas_historico
WHERE usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid
  AND tipo = 'quest'
RETURNING
  id,
  meta_codigo,
  meta_titulo,
  xp_base,
  xp_bonus;

-- Reverter XP de quests em usuarios_conquistas
-- Subtrair apenas o XP que veio das quests (não zerar completamente, pode ter XP de conversas)
WITH xp_quests AS (
  SELECT
    COALESCE(SUM(xp_base), 0) AS xp_base_total,
    COALESCE(SUM(xp_bonus), 0) AS xp_bonus_total,
    COUNT(*) AS total_quests
  FROM public.conquistas_historico
  WHERE usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid
    AND tipo = 'quest'
)
UPDATE public.usuarios_conquistas uc
SET
  xp_base = GREATEST(0, COALESCE(uc.xp_base, 0) - xq.xp_base_total),
  xp_bonus = GREATEST(0, COALESCE(uc.xp_bonus, 0) - xq.xp_bonus_total),
  xp_total = GREATEST(0, COALESCE(uc.xp_total, 0) - (xq.xp_base_total + xq.xp_bonus_total)),
  total_quests_concluidas = GREATEST(0, COALESCE(uc.total_quests_concluidas, 0) - xq.total_quests),
  atualizado_em = CURRENT_TIMESTAMP
FROM xp_quests xq
WHERE uc.usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid
RETURNING
  uc.usuario_id,
  uc.xp_base,
  uc.xp_bonus,
  uc.xp_total,
  uc.total_quests_concluidas;

-- Verificar resultado
SELECT 
  uq.id AS quest_id,
  uq.config->>'titulo' AS titulo,
  uq.recorrencias->'dias'->0 AS primeiro_dia,
  CASE 
    WHEN EXISTS (
      SELECT 1
      FROM public.conquistas_historico ch
      WHERE ch.meta_codigo = uq.id::text
        AND ch.tipo = 'quest'
        AND ch.usuario_id = uq.usuario_id
    ) THEN 'TEM REGISTRO'
    ELSE 'SEM REGISTRO - PRONTO PARA CONCLUIR'
  END AS situacao
FROM public.usuarios_quest uq
WHERE uq.usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'
  AND uq.recorrencias IS NOT NULL
ORDER BY uq.id;

