-- Verificações para confirmar a carga básica das quests antes de rodar o workflow de personalizadas.
-- Cada bloco possui o resultado esperado em comentário para facilitar a conferência manual.

-- 1) Total de usuários ativos usados como referência para as demais checagens.
-- Esperado: retornar a contagem atual de usuários ativos (na base de validação está em torno de 10).
SELECT COUNT(*) AS usuarios_ativos
FROM public.usuarios u
WHERE COALESCE(u.ativo, true) = true;

-- 2) Usuários ativos sem linha correspondente em quest_estado_usuario.
-- Esperado: zero linhas (todo usuário ativo deve ter estado criado).
SELECT u.id AS usuario_sem_estado
FROM public.usuarios u
LEFT JOIN public.quest_estado_usuario q ON q.usuario_id = u.id
WHERE COALESCE(u.ativo, true) = true
  AND q.usuario_id IS NULL;

-- 3) Resumo de estados por usuário para confirmar que cada ativo possui exatamente 1 registro.
-- Esperado: linha por usuário ativo com total_estados = 1. Qualquer valor diferente indica problema.
SELECT
  u.id AS usuario_id,
  COUNT(q.id) AS total_estados
FROM public.usuarios u
LEFT JOIN public.quest_estado_usuario q ON q.usuario_id = u.id
WHERE COALESCE(u.ativo, true) = true
GROUP BY u.id
ORDER BY u.id;

-- 4) Cobertura das quests de sequência básicas (streak_003 ativa e streak_005 pendente).
-- Esperado: para cada usuário ativo, tem_streak_003 = 1 (status 'ativa') e tem_streak_005 = 1 (status 'pendente').
SELECT
  u.id AS usuario_id,
  COUNT(*) FILTER (WHERE qi.meta_codigo = 'streak_003') AS tem_streak_003,
  STRING_AGG(qi.status, ', ') FILTER (WHERE qi.meta_codigo = 'streak_003') AS status_streak_003,
  COUNT(*) FILTER (WHERE qi.meta_codigo = 'streak_005') AS tem_streak_005,
  STRING_AGG(qi.status, ', ') FILTER (WHERE qi.meta_codigo = 'streak_005') AS status_streak_005
FROM public.usuarios u
LEFT JOIN public.quest_instancias qi ON qi.usuario_id = u.id
WHERE COALESCE(u.ativo, true) = true
GROUP BY u.id
ORDER BY u.id;

-- 5) Usuários com mais de uma instância por meta de sequência (duplicidades indesejadas).
-- Esperado: zero linhas. Qualquer linha indica duplicação a ser corrigida.
SELECT
  qi.usuario_id,
  qi.meta_codigo,
  COUNT(*) AS instancias
FROM public.quest_instancias qi
WHERE qi.meta_codigo IN ('streak_003', 'streak_005')
GROUP BY qi.usuario_id, qi.meta_codigo
HAVING COUNT(*) > 1;

-- 6) Situação das quests personalizadas por usuário.
-- Esperado: apenas o usuário de teste (d949d81c-9235-41ce-8b3b-6b5d593c5e24) deve retornar com qtd > 0 antes do batch.
SELECT
  qi.usuario_id,
  COUNT(*) AS total_personalizadas
FROM public.quest_instancias qi
JOIN public.quest_modelos qm ON qm.id = qi.modelo_id
WHERE qm.tipo = 'personalizada'
GROUP BY qi.usuario_id
ORDER BY total_personalizadas DESC;

-- 7) Conferência rápida dos status das quests personalizadas do usuário de teste.
-- Esperado: listar as quests criadas pela carga inicial com status 'pendente' (ou o status registrado).
SELECT
  qi.usuario_id,
  qi.meta_codigo,
  qi.status,
  qi.contexto_origem,
  qi.ativado_em,
  qi.atualizado_em
FROM public.quest_instancias qi
JOIN public.quest_modelos qm ON qm.id = qi.modelo_id
WHERE qm.tipo = 'personalizada'
  AND qi.usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'
ORDER BY qi.atualizado_em DESC;
