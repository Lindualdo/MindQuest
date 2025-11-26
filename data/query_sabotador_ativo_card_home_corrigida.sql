-- Query para buscar sabotador mais ativo no card da home
-- Sem filtro de período - considera todos os registros do usuário
-- Ordena por: total_deteccoes DESC, conversas_afetadas DESC, intensidade_media DESC

WITH sabotadores_agregados AS (
  SELECT
    us.sabotador_id,
    COUNT(*) AS total_deteccoes,
    COUNT(DISTINCT us.chat_id) AS conversas_afetadas,
    AVG(us.intensidade_media) AS intensidade_media,
    MAX(us.apelido_personalizado) AS apelido_personalizado,
    MAX(us.contexto_principal) AS contexto_principal,
    MAX(us.insight_atual) AS insight_atual,
    MAX(us.contramedida_ativa) AS contramedida_ativa,
    MAX(COALESCE(us.data_ultima_atividade, us.atualizado_em)) AS ultima_atualizacao
  FROM usuarios_sabotadores us
  WHERE us.usuario_id = $1
  GROUP BY us.sabotador_id
),
sabotador_top AS (
  SELECT *
  FROM sabotadores_agregados
  ORDER BY 
    total_deteccoes DESC,
    conversas_afetadas DESC,
    intensidade_media DESC
  LIMIT 1
),
conversas_total AS (
  SELECT COUNT(*) AS total_conversas
  FROM usr_chat uc
  WHERE uc.usuario_id = $1
)
SELECT
  'sabotador'::text AS bloco,
  $1::uuid         AS user_id,
  st.sabotador_id,
  sc.nome,
  sc.emoji,
  st.apelido_personalizado,
  st.total_deteccoes,
  ct.total_conversas,
  st.conversas_afetadas,
  st.contexto_principal,
  st.insight_atual,
  st.contramedida_ativa,
  ROUND(st.intensidade_media::numeric, 2) AS intensidade_media
FROM sabotador_top st
JOIN sabotadores_catalogo sc ON sc.id = st.sabotador_id
CROSS JOIN conversas_total ct;

