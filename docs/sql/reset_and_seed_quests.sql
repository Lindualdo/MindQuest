-- Reset completo da estrutura de quests e carga inicial padrão.
-- Executa em uma única transação: limpa tabelas finais (sem views),
-- recria níveis, templates, estados por usuário e instâncias base
-- (streak_003 / streak_005).

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DELETE FROM public.quest_atribuidas;
DELETE FROM public.resumo_jornada;
DELETE FROM public.quest_templates;
DELETE FROM public.jornada_niveis;

INSERT INTO public.jornada_niveis (nivel, xp_minimo, xp_proximo_nivel, nome, descricao, criado_em, atualizado_em)
VALUES
  (1,     0,   500,  'Despertar',       'Percebe a necessidade de mudar e inicia as primeiras conversas.',                  NOW(), NOW()),
  (2,   500,  1200,  'Clareza',        'Entende sabotadores, padrões e aprende a manter presença diária.',                 NOW(), NOW()),
  (3,  1200,  2200,  'Coragem',        'Experimenta novas abordagens e sustenta a consistência das conversas.',            NOW(), NOW()),
  (4,  2200,  3600,  'Consistência',   'Transforma conversas e quests em hábitos, mesmo em dias difíceis.',               NOW(), NOW()),
  (5,  3600,  5400,  'Resiliência',    'Retoma o ritmo após quedas e mantém equilíbrio entre quests e rotina.',           NOW(), NOW()),
  (6,  5400,  7400,  'Expansão',       'Integra ações em diversas áreas da vida e compartilha aprendizados.',             NOW(), NOW()),
  (7,  7400,  9800,  'Maestria',       'Guiado pelo próprio processo, cria quests intencionais e sustenta longas sequências.', NOW(), NOW()),
  (8,  9800, 12600,  'Impacto',        'Usa as conversas para inspirar, apoiar outras pessoas e liderar pelo exemplo.',   NOW(), NOW()),
  (9, 12600, 16000,  'Legado',         'Transforma o progresso em projetos consistentes de longo prazo.',                 NOW(), NOW()),
  (10,16000, NULL,   'Transcendência', 'Vive segundo seus princípios, mantém estabilidade emocional e continuidade ilimitada.', NOW(), NOW());

INSERT INTO public.quest_templates
    (id, codigo, titulo, descricao, tipo, gatilho_codigo, gatilho_valor, xp_recompensa, repeticao, ordem_inicial, ativo, config, criado_em, atualizado_em)
VALUES
  (gen_random_uuid(), 'streak_003', 'Sequência de 3 conversas',  'Complete 3 conversas consecutivas.', 'sequencia', 'conversas_consecutivas',  3,  80, 'unica', 1, true, '{}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'streak_005', 'Sequência de 5 conversas',  'Complete 5 conversas consecutivas.', 'sequencia', 'conversas_consecutivas',  5, 100, 'unica', 2, true, '{}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'streak_007', 'Sequência de 7 conversas',  'Complete 7 conversas consecutivas.', 'sequencia', 'conversas_consecutivas',  7, 130, 'unica', 3, true, '{}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'streak_010', 'Sequência de 10 conversas', 'Complete 10 conversas consecutivas.', 'sequencia', 'conversas_consecutivas', 10, 170, 'unica', 4, true, '{}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'streak_015', 'Sequência de 15 conversas', 'Complete 15 conversas consecutivas.', 'sequencia', 'conversas_consecutivas', 15, 220, 'unica', 5, true, '{}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'streak_020', 'Sequência de 20 conversas', 'Complete 20 conversas consecutivas.', 'sequencia', 'conversas_consecutivas', 20, 280, 'unica', 6, true, '{}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'streak_025', 'Sequência de 25 conversas', 'Complete 25 conversas consecutivas.', 'sequencia', 'conversas_consecutivas', 25, 350, 'unica', 7, true, '{}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'streak_030', 'Sequência de 30 conversas', 'Complete 30 conversas consecutivas.', 'sequencia', 'conversas_consecutivas', 30, 450, 'unica', 8, true, '{}'::jsonb, NOW(), NOW());

INSERT INTO public.resumo_jornada (
    id,
    usuario_id,
    xp_total,
    xp_proximo_nivel,
    nivel_atual,
    titulo_nivel,
    sequencia_atual,
    sequencia_recorde,
    meta_sequencia_codigo,
    proxima_meta_codigo,
    sequencia_status,
    total_quests_concluidas,
    total_quests_personalizadas,
    total_xp_hoje,
    ultima_conversa_em,
    criado_em,
    atualizado_em
)
SELECT
    gen_random_uuid(),
    u.id,
    0,
    500,
    1,
    'Despertar',
    0,
    0,
    'streak_003',
    'streak_005',
    jsonb_build_object('alvo_conversas', 3, 'estado', 'ativa', 'reinicios', 0, 'completado_em', NULL),
    0,
    0,
    0,
    NULL,
    NOW(),
    NOW()
FROM public.usuarios u;

WITH modelos AS (
    SELECT codigo, id FROM public.quest_templates WHERE codigo IN ('streak_003','streak_005')
)
INSERT INTO public.quest_atribuidas (
    id,
    usuario_id,
    modelo_id,
    meta_codigo,
    status,
    progresso_atual,
    progresso_meta,
    progresso_percentual,
    xp_concedido,
    tentativas,
    referencia_data,
    ativado_em,
    atualizado_em
)
SELECT
    gen_random_uuid(),
    u.id,
    m.id,
    m.codigo,
    CASE m.codigo WHEN 'streak_003' THEN 'ativa' ELSE 'pendente' END,
    0,
    CASE m.codigo WHEN 'streak_003' THEN 3 ELSE 5 END,
    0,
    0,
    0,
    CURRENT_DATE,
    NOW(),
    NOW()
FROM public.usuarios u
CROSS JOIN modelos m;

COMMIT;
