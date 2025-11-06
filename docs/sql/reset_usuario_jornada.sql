-- Script de saneamento para recalcular XP conforme nova jornada.
-- Ajuste o valor de :usuario_id antes de executar.

BEGIN;

WITH alvo AS (
  SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
base_nivel AS (
  SELECT
    j.nivel,
    j.titulo,
    j.xp_proximo_nivel,
    j.lema
  FROM public.jornada_niveis j
  WHERE j.nivel = 1
),
reset_estado AS (
  UPDATE public.quest_estado_usuario eu
  SET
    xp_total              = 0,
    xp_proximo_nivel      = base_nivel.xp_proximo_nivel,
    nivel_atual           = base_nivel.nivel,
    titulo_nivel          = base_nivel.titulo,
    sequencia_atual       = 0,
    sequencia_recorde     = 0,
    meta_sequencia_codigo = 'streak_003',
    proxima_meta_codigo   = 'streak_005',
    sequencia_status      = jsonb_build_object(
      'alvo_conversas', 3,
      'estado', 'ativa',
      'reinicios', 0,
      'completado_em', NULL
    ),
    total_quests_concluidas   = 0,
    total_xp_hoje             = 0,
    ultima_conversa_em        = NULL,
    atualizado_em             = NOW()
  FROM alvo, base_nivel
  WHERE eu.usuario_id = alvo.usuario_id
  RETURNING eu.usuario_id
),
reset_instancias AS (
  UPDATE public.quest_instancias qi
  SET
    xp_concedido = 0,
    atualizado_em = NOW()
  FROM alvo
  WHERE qi.usuario_id = alvo.usuario_id
    AND qi.status <> 'concluida'
  RETURNING qi.usuario_id
)
DELETE FROM public.quest_eventos qe
USING alvo
WHERE qe.usuario_id = alvo.usuario_id;

COMMIT;
