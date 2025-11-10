BEGIN;

-- Remove todo o histórico analítico de conquistas (conversas/quests).
TRUNCATE public.conquistas_historico;

-- Zera os acumulados em usuarios_conquistas e volta as metas padrão.
UPDATE public.usuarios_conquistas uc
SET
  xp_total             = 0,
  xp_base              = 0,
  xp_bonus             = 0,
  total_xp_hoje        = 0,
  sequencia_atual      = 0,
  sequencia_recorde    = 0,
  nivel_atual			= 1,
  xp_proximo_nivel		= 500,
  meta_sequencia_codigo = 'streak_003',
  proxima_meta_codigo   = 'streak_005',
  ultima_conversa_em   = NULL,
  sequencia_status     = jsonb_build_object(
    'estado', 'ativa',
    'alvo_conversas', 3,
    'reinicios', 0,
    'completado_em', NULL
  ),
  historico_resumido   = '[]'::jsonb,
  atualizado_em        = NOW();

COMMIT;
