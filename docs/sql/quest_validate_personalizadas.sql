-- Validação direta das cargas de quests personalizadas e conversas.
-- Rode esta query após o batch para garantir que todos os usuários ativos
-- possuem quests personalizadas registradas e histórico mínimo de conversas.

WITH usuarios_ativos AS (
  SELECT id
  FROM public.usuarios
  WHERE COALESCE(ativo, true) = true
),
quests AS (
  SELECT
    qi.usuario_id,
    COUNT(*) AS total_quests_personalizadas,
    JSON_AGG(
      json_build_object(
        'meta_codigo', qi.meta_codigo,
        'status', qi.status,
        'contexto', qi.contexto_origem,
        'atualizado_em', qi.atualizado_em
      )
      ORDER BY qi.atualizado_em DESC
    ) AS detalhes_quests
  FROM public.quest_instancias qi
  JOIN public.quest_modelos qm ON qm.id = qi.modelo_id
  WHERE qm.tipo = 'personalizada'
  GROUP BY qi.usuario_id
),
conversas AS (
  SELECT
    ranked.usuario_id,
    COUNT(*) AS total_conversas,
    MAX(ranked.data_conversa) AS ultima_conversa,
    JSON_AGG(
      json_build_object(
        'chat_id', ranked.id,
        'data_conversa', ranked.data_conversa,
        'resumo', ranked.resumo_conversa
      )
    ) FILTER (WHERE ranked.rn <= 5) AS conversas_recentes
  FROM (
    SELECT
      uc.*,
      ROW_NUMBER() OVER (
        PARTITION BY uc.usuario_id
        ORDER BY uc.data_conversa DESC, uc.criado_em DESC
      ) AS rn
    FROM public.usr_chat uc
  ) ranked
  GROUP BY ranked.usuario_id
)
SELECT
  ua.id AS usuario_id,
  COALESCE(q.total_quests_personalizadas, 0) AS total_quests_personalizadas,
  q.detalhes_quests,
  COALESCE(c.total_conversas, 0) AS total_conversas,
  c.ultima_conversa,
  c.conversas_recentes
FROM usuarios_ativos ua
LEFT JOIN quests q ON q.usuario_id = ua.id
LEFT JOIN conversas c ON c.usuario_id = ua.id
ORDER BY total_quests_personalizadas DESC, total_conversas DESC;
