-- Reverte os campos de gamificação do usuário 015e4e4c-ac43-4071-b580-4b0b75713d76
-- para o snapshot padrão registrado em docs/data/gamificacao.json.

WITH alvo AS (
  SELECT '015e4e4c-ac43-4071-b580-4b0b75713d76'::uuid AS usuario_id
)
UPDATE public.gamificacao g
SET
  xp_total                 = 120,
  xp_proximo_nivel         = 200,
  nivel_atual              = 1,
  titulo_nivel             = 'Explorador',
  streak_conversas_dias    = 1,
  melhor_streak            = 1,
  streak_meta_atual        = 'streak_003',
  streak_meta_proximo      = 'streak_005',
  streak_meta_status       = jsonb_build_object(
    'estado', 'ativo',
    'alvoDias', 3,
    'reinicios', 0,
    'completado_em', NULL
  ),
  streak_protecao_usada    = FALSE,
  streak_protecao_resetada_em = NULL,
  total_conversas          = 1,
  total_reflexoes          = 1,
  total_xp_ganho_hoje      = 120,
  quest_diaria_status      = NULL,
  quest_diaria_progresso   = 0,
  quest_diaria_descricao   = NULL,
  quest_diaria_data        = NULL,
  quest_streak_dias        = 3,
  habitos_ativos           = jsonb_build_array(
    jsonb_build_object(
      'codigo', 'habit_diaria_conversa',
      'status', 'completa',
      'titulo', 'Conversa diária concluída',
      'quest_id', '2d5e5ba5-2fc5-4672-9a98-e9d317e6a624',
      'vence_em', '2025-11-04T00:00:00.000Z',
      'atualizado_em', '2025-11-04T22:55:51.400Z',
      'progresso_meta', 1,
      'progresso_atual', 1
    ),
    jsonb_build_object(
      'codigo', 'habit_diaria_reflexao',
      'status', 'completa',
      'titulo', 'Reflexão profunda registrada',
      'quest_id', 'c37df560-5e59-4ead-b696-00bbe1e44cfd',
      'vence_em', '2025-11-04T00:00:00.000Z',
      'atualizado_em', '2025-11-04T22:55:51.400Z',
      'progresso_meta', 1,
      'progresso_atual', 1
    ),
    jsonb_build_object(
      'codigo', 'habit_diaria_respiracao',
      'status', 'pendente',
      'titulo', 'Respiração consciente',
      'quest_id', 'e6a2d30c-c69d-451a-8d86-9a12496a0eb2',
      'vence_em', '2025-11-04T00:00:00.000Z',
      'atualizado_em', '2025-11-04T22:55:51.400Z',
      'progresso_meta', 1,
      'progresso_atual', 0
    )
  ),
  conquistas_desbloqueadas = '[]'::jsonb,
  ultima_conquista_id      = NULL,
  ultima_conquista_data    = NULL,
  ultima_conversa_data     = '2025-11-04T00:00:00.000Z'::timestamptz,
  ultima_atualizacao       = NOW(),
  atualizado_em            = NOW()
FROM alvo
WHERE g.usuario_id = alvo.usuario_id;

