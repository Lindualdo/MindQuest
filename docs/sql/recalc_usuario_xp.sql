-- Recalcula XP de conversas e quests para um usuário específico.
-- Ajuste o valor do usuário antes de executar.

WITH params AS (
  SELECT 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'::uuid AS usuario_id
),
------------------------------------------------------
-- 1. Conversas distintas por dia
conversas_distintas AS (
  SELECT
    p.usuario_id,
    uc.data_conversa::date AS dia
  FROM params p
  JOIN public.usr_chat uc
    ON uc.usuario_id = p.usuario_id
  GROUP BY p.usuario_id, uc.data_conversa::date
),
ordenadas AS (
  SELECT
    usuario_id,
    dia,
    LAG(dia) OVER (PARTITION BY usuario_id ORDER BY dia) AS dia_anterior
  FROM conversas_distintas
),
grupos AS (
  SELECT
    usuario_id,
    dia,
    CASE
      WHEN dia_anterior IS NULL OR dia <> dia_anterior + INTERVAL '1 day' THEN 1
      ELSE 0
    END AS quebra
  FROM ordenadas
),
grupos_enriquecidos AS (
  SELECT
    usuario_id,
    dia,
    SUM(quebra) OVER (PARTITION BY usuario_id ORDER BY dia ROWS UNBOUNDED PRECEDING) AS grupo
  FROM grupos
),
streaks AS (
  SELECT
    usuario_id,
    dia,
    grupo,
    ROW_NUMBER() OVER (PARTITION BY usuario_id, grupo ORDER BY dia) AS streak_pos
  FROM grupos_enriquecidos
),
bonus_meta AS (
  SELECT *
  FROM (VALUES
    (3, 100),
    (5, 150),
    (7, 200),
    (10, 250),
    (15, 300),
    (20, 350),
    (25, 400),
    (30, 500)
  ) AS t(alvo, bonus)
),
xp_conversas AS (
  SELECT
    s.usuario_id,
    COALESCE(SUM(200 + 50 * LEAST(14, s.streak_pos - 1)), 0) AS xp_base,
    COALESCE(SUM(b.bonus), 0) AS xp_premium,
    COALESCE(MAX(s.streak_pos), 0) AS recorde,
    COALESCE(MAX(s.streak_pos) FILTER (WHERE s.grupo = ultimo_grupo), 0) AS streak_atual,
    MAX(s.dia) AS ultima_conversa
  FROM (
    SELECT *,
      MAX(grupo) OVER (PARTITION BY usuario_id) AS ultimo_grupo
    FROM streaks
  ) s
  LEFT JOIN bonus_meta b
    ON s.streak_pos = b.alvo
  GROUP BY s.usuario_id
),
------------------------------------------------------
-- 2. Quests personalizadas concluídas (XP = 150; recorrentes +50 por repetição)
personalizadas_concluidas AS (
  SELECT
    qi.id,
    qi.usuario_id,
    qm.id AS modelo_id,
    COALESCE(LOWER(qm.config->>'recorrencia'), 'unica') AS recorrencia,
    ROW_NUMBER() OVER (
      PARTITION BY qi.usuario_id, qm.id
      ORDER BY COALESCE(qi.concluido_em, qi.atualizado_em, qi.ativado_em)
    ) AS repeticao_idx
  FROM params p
  JOIN public.quest_instancias qi
    ON qi.usuario_id = p.usuario_id
  JOIN public.quest_modelos qm
    ON qm.id = qi.modelo_id
  WHERE qm.tipo = 'personalizada'
    AND qi.status = 'concluida'
),
xp_personalizadas AS (
  SELECT
    usuario_id,
    SUM(
      CASE
        WHEN recorrencia = 'recorrente' THEN 150 + 50 * LEAST(15, repeticao_idx)
        ELSE 150
      END
    ) AS xp_total,
    COUNT(*) AS total_concluidas
  FROM personalizadas_concluidas
  GROUP BY usuario_id
),
xp_por_instancia AS (
  SELECT
    id,
    CASE
      WHEN recorrencia = 'recorrente' THEN 150 + 50 * LEAST(15, repeticao_idx)
      ELSE 150
    END AS xp_novo
  FROM personalizadas_concluidas
),
------------------------------------------------------
-- 3. Mapeamento de metas
metas AS (
  SELECT *
  FROM (VALUES
    ('streak_003', 3),
    ('streak_005', 5),
    ('streak_007', 7),
    ('streak_010', 10),
    ('streak_015', 15),
    ('streak_020', 20),
    ('streak_025', 25),
    ('streak_030', 30)
  ) AS t(codigo, alvo)
),
meta_atual AS (
  SELECT
    metas.codigo,
    metas.alvo,
    ROW_NUMBER() OVER (ORDER BY metas.alvo) AS ordem
  FROM metas
),
estado_conversas AS (
  SELECT
    p.usuario_id,
    COALESCE(xp_conversas.xp_base, 0) AS xp_base,
    COALESCE(xp_conversas.xp_premium, 0) AS xp_premium,
    COALESCE(xp_conversas.recorde, 0) AS recorde,
    COALESCE(xp_conversas.streak_atual, 0) AS streak_atual,
    xp_conversas.ultima_conversa
  FROM params p
  LEFT JOIN xp_conversas ON xp_conversas.usuario_id = p.usuario_id
),
meta_selecionada AS (
  SELECT
    ec.usuario_id,
    COALESCE(
      (SELECT codigo FROM meta_atual WHERE alvo > ec.streak_atual ORDER BY alvo LIMIT 1),
      'streak_030'
    ) AS meta_atual_codigo
  FROM estado_conversas ec
),
meta_proxima AS (
  SELECT
    ec.usuario_id,
    ms.meta_atual_codigo AS atual,
    (SELECT codigo FROM meta_atual WHERE codigo > ms.meta_atual_codigo ORDER BY codigo LIMIT 1) AS proxima
  FROM estado_conversas ec
  JOIN meta_selecionada ms ON ms.usuario_id = ec.usuario_id
),
------------------------------------------------------
atualiza_personalizadas AS (
  UPDATE public.quest_instancias qi
  SET xp_concedido = xp_por_instancia.xp_novo
  FROM xp_por_instancia
  WHERE qi.id = xp_por_instancia.id
  RETURNING 1
),
reset_sequencias AS (
  UPDATE public.quest_instancias qi
  SET xp_concedido = 0
  FROM params p,
       public.quest_modelos qm
  WHERE qi.usuario_id = p.usuario_id
    AND qm.id = qi.modelo_id
    AND qm.tipo = 'sequencia'
  RETURNING 1
),
resumo AS (
  SELECT
    p.usuario_id,
    COALESCE(ec.xp_base, 0) + COALESCE(ec.xp_premium, 0) + COALESCE(xp_personalizadas.xp_total, 0) AS xp_total,
    COALESCE(ec.xp_base, 0) AS xp_base,
    COALESCE(ec.xp_premium, 0) AS xp_premium,
    COALESCE(ec.recorde, 0) AS recorde,
    COALESCE(ec.streak_atual, 0) AS streak_atual,
    ec.ultima_conversa,
    xp_personalizadas.total_concluidas,
    mp.atual AS meta_atual_codigo,
    mp.proxima AS meta_proxima_codigo
  FROM params p
  LEFT JOIN estado_conversas ec ON ec.usuario_id = p.usuario_id
  LEFT JOIN xp_personalizadas ON xp_personalizadas.usuario_id = p.usuario_id
  LEFT JOIN meta_proxima mp ON mp.usuario_id = p.usuario_id
)
UPDATE public.quest_estado_usuario q
SET
  xp_total              = COALESCE(resumo.xp_total, 0),
  xp_proximo_nivel      = j.xp_proximo_nivel,
  nivel_atual           = j.nivel,
  titulo_nivel          = j.titulo,
  sequencia_atual       = COALESCE(resumo.streak_atual, 0),
  sequencia_recorde     = COALESCE(resumo.recorde, 0),
  meta_sequencia_codigo = COALESCE(resumo.meta_atual_codigo, 'streak_003'),
  proxima_meta_codigo   = COALESCE(resumo.meta_proxima_codigo, 'streak_005'),
  sequencia_status      = jsonb_build_object(
    'alvo_conversas', (SELECT alvo FROM metas WHERE codigo = COALESCE(resumo.meta_atual_codigo, 'streak_003')),
    'estado', 'ativa',
    'reinicios', 0,
    'completado_em', NULL
  ),
  total_quests_concluidas   = COALESCE(resumo.total_concluidas, 0),
  total_xp_hoje             = 0,
  ultima_conversa_em        = resumo.ultima_conversa,
  atualizado_em             = NOW()
FROM resumo
JOIN LATERAL (
  SELECT jn.*
  FROM public.jornada_niveis jn
  WHERE resumo.xp_total >= jn.xp_minimo
  ORDER BY jn.nivel DESC
  LIMIT 1
) AS j ON TRUE
WHERE q.usuario_id = resumo.usuario_id;
