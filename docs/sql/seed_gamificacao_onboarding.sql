-- Popula gamificacao com estado inicial para todos os usuários (exceto o seed já carregado)
-- Executar após rodar schema_gamificacao_reset.sql e inserir o seed principal.

INSERT INTO public.gamificacao (
  id,
  usuario_id,
  xp_total,
  xp_proximo_nivel,
  nivel_atual,
  titulo_nivel,
  streak_conversas_dias,
  melhor_streak,
  streak_meta_atual,
  streak_meta_proximo,
  streak_meta_status,
  streak_protecao_usada,
  streak_protecao_resetada_em,
  total_conversas,
  total_reflexoes,
  total_xp_ganho_hoje,
  quest_diaria_status,
  quest_diaria_progresso,
  quest_diaria_descricao,
  quest_diaria_data,
  quest_streak_dias,
  habitos_ativos,
  conquistas_desbloqueadas,
  ultima_conquista_id,
  ultima_conquista_data,
  ultima_conversa_data,
  ultima_atualizacao,
  criado_em,
  atualizado_em
)
SELECT
  gen_random_uuid(),
  u.id,
  0,
  200,
  1,
  'Explorador',
  0,
  0,
  'streak_003',
  'streak_005',
  jsonb_build_object(
    'alvoDias', 3,
    'estado', 'ativo',
    'reinicios', 0,
    'completado_em', NULL
  ),
  FALSE,
  NULL,
  0,
  0,
  0,
  NULL,
  0,
  'Complete a conversa guiada de hoje para avançar.',
  NULL,
  0,
  '[]'::jsonb,
  '[]'::jsonb,
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(),
  NOW()
FROM public.usuarios u
WHERE u.id <> 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM public.gamificacao g
    WHERE g.usuario_id = u.id
  );
