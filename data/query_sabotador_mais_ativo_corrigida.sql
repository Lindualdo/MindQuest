-- Query para buscar APENAS o sabotador_id do sabotador mais ativo
-- Baseado em quantidade de registros e intensidade média
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
  FROM public.usuarios_sabotadores us
  WHERE us.usuario_id = $1::uuid
  GROUP BY us.sabotador_id
),
sabotador_mais_ativo AS (
  SELECT *
  FROM sabotadores_agregados
  ORDER BY 
    total_deteccoes DESC,
    conversas_afetadas DESC,
    intensidade_media DESC
  LIMIT 1
)
SELECT json_build_object(
  'sabotador_mais_ativo', sma.sabotador_id
) AS sabotadores
FROM sabotador_mais_ativo sma;
