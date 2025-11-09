-- Reset completo da estrutura de quests e carga inicial padrão.
-- Executa em uma única transação: limpa tabelas e recria níveis, modelos,
-- estados por usuário e instâncias básicas (streak_003 / streak_005).

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Limpeza das tabelas principais
DELETE FROM public.quest_instancias;
DELETE FROM public.quest_estado_usuario;
DELETE FROM public.quest_modelos;

DELETE FROM public.quest_niveis;

-- 2) Seed de níveis
INSERT INTO public.quest_niveis (nivel, xp_minimo, xp_proximo_nivel, nome, descricao, criado_em, atualizado_em)
VALUES
  (1,    0,  300,  'Recém-Convocado',        'Inicia as conversas e conhece a jornada.',                       NOW(), NOW()),
  (2,  300,  750,  'Explorador Diário',      'Mantém presença diária e entende as quests.',                   NOW(), NOW()),
  (3,  750, 1350,  'Conversador Assíduo',    'Sustenta ritmo estável e ativa as primeiras missões.',          NOW(), NOW()),
  (4, 1350, 2100,  'Companheiro Constante',  'Consolida rotina e raramente falha em conversar.',              NOW(), NOW()),
  (5, 2100, 3000,  'Parceiro de Jornada',    'Ajusta quests personalizadas e mantém engajamento equilibrado.',NOW(), NOW()),
  (6, 3000, 4100,  'Mentor da Tribo',        'Integra ações recorrentes e compartilha aprendizados.',         NOW(), NOW()),
  (7, 4100, 5400,  'Guardião do Ritmo',      'Quase não quebra sequência; retoma rápido quando acontece.',    NOW(), NOW()),
  (8, 5400, 6900,  'Referência MindQuest',   'Inspira pela consistência nas conversas e nas quests.',         NOW(), NOW()),
  (9, 6900, 8600,  'Embaixador de Conversas','Sustenta múltiplas quests ativas com naturalidade.',            NOW(), NOW()),
  (10, 8600, NULL, 'Guardião da Comunidade', 'Exemplo do ciclo MindQuest e apoio à evolução coletiva.',       NOW(), NOW());

-- 3) Seed dos modelos base (sequência)
INSERT INTO public.quest_modelos
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

-- 4) Estado inicial por usuário
INSERT INTO public.quest_estado_usuario (
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
    300,
    1,
    'Recém-Convocado',
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

-- 5) Instâncias iniciais (streak_003 ativa, streak_005 pendente)
WITH modelos AS (
    SELECT codigo, id FROM public.quest_modelos WHERE codigo IN ('streak_003','streak_005')
)
INSERT INTO public.quest_instancias (
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
