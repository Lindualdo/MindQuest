-- Reseta níveis, gamificação e quests padrões para todos os usuários.
-- Execute este script após atualizar o catálogo de quests.

-- 1) Gamificação: níveis base (upsert)
INSERT INTO public.gamificacao_niveis (nivel, xp_minimo, xp_proximo_nivel, titulo, descricao, atualizado_em)
VALUES
  (1,   0,   200,  'Explorador',  'Início da jornada com o assistente',            NOW()),
  (2, 200,   550,  'Aprendiz',    'Mantém o ritmo inicial das conversas',         NOW()),
  (3, 550,  1050,  'Observador',  'Começa a notar padrões pessoais',              NOW()),
  (4,1050,  1700,  'Focado',      'Constrói presença diária consistente',         NOW()),
  (5,1700,  2500,  'Praticante',  'Transforma conversa em hábito estruturado',    NOW()),
  (6,2500,  3450,  'Consciente',  'Conecta emoções, sabotadores e objetivos',     NOW()),
  (7,3450,  4550,  'Iluminado',   'Gera reflexões profundas com facilidade',      NOW()),
  (8,4550,  5800,  'Sábio',       'Mantém disciplina mesmo em dias difíceis',     NOW()),
  (9,5800,  7200,  'Ascendente',  'Compartilha aprendizados e inspira terceiros', NOW()),
  (10,7200, 9000,  'Mestre',      'Alcança maestria na jornada MindQuest',        NOW())
ON CONFLICT (nivel) DO UPDATE
SET xp_minimo = EXCLUDED.xp_minimo,
    xp_proximo_nivel = EXCLUDED.xp_proximo_nivel,
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    atualizado_em = NOW();

-- 2) Gamificação: estado base por usuário (insere se não existir)
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
    total_conversas,
    total_reflexoes,
    total_xp_ganho_hoje,
    quest_streak_dias,
    habitos_ativos,
    conquistas_desbloqueadas,
    ultima_conversa_data,
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
    jsonb_build_object('alvoDias', 3, 'estado', 'ativo', 'reinicios', 0, 'completado_em', NULL),
    FALSE,
    0,
    0,
    0,
    3,
    '[]'::jsonb,
    '[]'::jsonb,
    NULL,
    NOW(),
    NOW()
FROM public.usuarios u
LEFT JOIN public.gamificacao g ON g.usuario_id = u.id
WHERE g.usuario_id IS NULL
  AND u.id <> 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid;

-- 3) Quests padrão por usuário (insere apenas faltantes)
WITH catalogo AS (
  SELECT codigo, id FROM public.quest_catalogo
  WHERE codigo IN (
    'streak_003',
    'streak_005',
    'onboarding_primeira_conversa',
    'onboarding_primeira_semana',
    'habit_diaria_conversa',
    'habit_diaria_reflexao',
    'habit_diaria_respiracao'
  )
),
defaults AS (
  SELECT
    (SELECT id FROM catalogo WHERE codigo = 'streak_003')  AS id_streak_003,
    (SELECT id FROM catalogo WHERE codigo = 'streak_005')  AS id_streak_005,
    (SELECT id FROM catalogo WHERE codigo = 'onboarding_primeira_conversa') AS id_onboarding_conversa,
    (SELECT id FROM catalogo WHERE codigo = 'onboarding_primeira_semana')   AS id_onboarding_semana,
    (SELECT id FROM catalogo WHERE codigo = 'habit_diaria_conversa')        AS id_habit_conversa,
    (SELECT id FROM catalogo WHERE codigo = 'habit_diaria_reflexao')        AS id_habit_reflexao,
    (SELECT id FROM catalogo WHERE codigo = 'habit_diaria_respiracao')      AS id_habit_respiracao
)
INSERT INTO public.usuarios_quest (
    id,
    usuario_id,
    quest_id,
    meta_codigo,
    status,
    progresso_atual,
    progresso_meta,
    progresso_percentual,
    tentativas,
    xp_concedido,
    referencia_data,
    ativado_em,
    atualizado_em
)
SELECT
    gen_random_uuid(),
    u.id,
    d.quest_id,
    d.meta_codigo,
    d.status,
    d.progresso_atual,
    d.progresso_meta,
    d.progresso_percentual,
    d.tentativas,
    0,
    d.referencia_data,
    NOW(),
    NOW()
FROM public.usuarios u
CROSS JOIN defaults dlsx
CROSS JOIN LATERAL (
    VALUES
      (dlsx.id_streak_003,  'streak_003',  'ativa',     0, 3,  0, 1, NULL),
      (dlsx.id_streak_005,  'streak_005',  'pendente',  0, 5,  0, 1, NULL),
      (dlsx.id_onboarding_conversa, 'onboarding_primeira_conversa', 'pendente', 0, 1, 0, 1, NULL),
      (dlsx.id_onboarding_semana,   'onboarding_primeira_semana',   'pendente', 0, 7, 0, 1, NULL),
      (dlsx.id_habit_conversa,      'habit_diaria_conversa',        'pendente', 0, 1, 0, 1, CURRENT_DATE),
      (dlsx.id_habit_reflexao,      'habit_diaria_reflexao',        'pendente', 0, 1, 0, 1, CURRENT_DATE),
      (dlsx.id_habit_respiracao,    'habit_diaria_respiracao',      'pendente', 0, 1, 0, 1, CURRENT_DATE)
) AS d(quest_id, meta_codigo, status, progresso_atual, progresso_meta, progresso_percentual, tentativas, referencia_data)
WHERE u.id <> 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid
  AND d.quest_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.usuarios_quest uq
    WHERE uq.usuario_id = u.id
      AND uq.meta_codigo = d.meta_codigo
  );
