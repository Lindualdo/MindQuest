WITH sabotadores_agregados AS (
  SELECT
    us.sabotador_id,
    COUNT(*)                    AS total_deteccoes,
    COUNT(DISTINCT us.chat_id)  AS conversas_afetadas,
    MAX(us.apelido_personalizado) AS apelido_personalizado,
    MAX(us.contexto_principal)    AS contexto_principal,
    MAX(us.insight_atual)         AS insight_atual,
    MAX(us.contramedida_ativa)    AS contramedida_ativa,
    MAX(us.intensidade_media)     AS intensidade_media,
    MAX(us.atualizado_em)         AS ultima_atualizacao
  FROM usuarios_sabotadores us
  WHERE us.usuario_id = $1::uuid
  GROUP BY us.sabotador_id
),
sabotador_top AS (
  SELECT
    sa.sabotador_id,
    sa.total_deteccoes,
    sa.conversas_afetadas,
    sa.apelido_personalizado,
    sa.contexto_principal,
    sa.insight_atual,
    sa.contramedida_ativa,
    sa.intensidade_media,
    sa.ultima_atualizacao
  FROM sabotadores_agregados sa
  ORDER BY 
    sa.total_deteccoes DESC,
    sa.conversas_afetadas DESC,
    sa.ultima_atualizacao DESC
  LIMIT 1
)
SELECT json_build_object(
  'sabotador_mais_ativo',
  json_build_object(
    'sabotador_id', st.sabotador_id,
    'total_deteccoes', st.total_deteccoes,
    'conversas_afetadas', st.conversas_afetadas,
    'apelido', st.apelido_personalizado,
    'contexto', st.contexto_principal,
    'insight', st.insight_atual,
    'contramedida', st.contramedida_ativa,
    'intensidade', st.intensidade_media,
    'ultima_atualizacao', st.ultima_atualizacao
  ),
  'sabotadores_recentes',
  json_build_array(
    json_build_object(
      'sabotador_id', st.sabotador_id,
      'total_deteccoes', st.total_deteccoes,
      'conversas_afetadas', st.conversas_afetadas,
      'apelido', st.apelido_personalizado,
      'contexto', st.contexto_principal,
      'insight', st.insight_atual,
      'contramedida', st.contramedida_ativa,
      'intensidade', st.intensidade_media,
      'ultima_atualizacao', st.ultima_atualizacao
    )
  )
) AS sabotadores
FROM sabotador_top st;
