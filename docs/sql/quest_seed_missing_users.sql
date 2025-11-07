-- Seed incremental para trazer usuários antigos para a nova estrutura de quests.
-- Executar após validar que apenas usuários sem registros precisam ser incluídos.

BEGIN;

-- 1) Estados base para usuários que ainda não possuem linha em quest_estado_usuario
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
FROM public.usuarios u
LEFT JOIN public.quest_estado_usuario q ON q.usuario_id = u.id
WHERE q.usuario_id IS NULL;

-- 2) Instâncias padrão das quests de sequência para usuários que ainda não possuem
WITH modelos AS (
  SELECT codigo, id FROM public.quest_modelos
  WHERE codigo IN ('streak_003', 'streak_005')
),
usuarios AS (
  SELECT u.id AS usuario_id FROM public.usuarios u
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
    usuarios.usuario_id,
    modelos.id,
    modelos.codigo,
    CASE modelos.codigo WHEN 'streak_003' THEN 'ativa' ELSE 'pendente' END,
    0,
    CASE modelos.codigo WHEN 'streak_003' THEN 3 ELSE 5 END,
    0,
    0,
    0,
    CURRENT_DATE,
    NOW(),
    NOW()
FROM usuarios
JOIN modelos ON modelos.codigo IN ('streak_003','streak_005')
LEFT JOIN public.quest_instancias qi
  ON qi.usuario_id = usuarios.usuario_id
 AND qi.meta_codigo = modelos.codigo
WHERE qi.id IS NULL;

COMMIT;
