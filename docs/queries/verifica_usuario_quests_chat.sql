-- ============================================
-- VERIFICAÇÃO: CONVERSAS E QUESTS DO USUÁRIO
-- Usuario ID: f6d4c6b0-5496-4035-b670-d8009df6c413
-- ============================================

-- 1. CONVERSAS DO USUÁRIO (public.usr_chat)
SELECT 
  id AS chat_id,
  data_conversa,
  total_interactions,
  tem_reflexao,
  total_palavras_usuario,
  processada_em,
  criado_em,
  atualizado_em,
  CASE 
    WHEN processada_em IS NULL THEN 'Pendente'
    WHEN processada_em IS NOT NULL THEN 'Processada'
  END AS status_processamento
FROM public.usr_chat
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
ORDER BY data_conversa DESC, criado_em DESC
LIMIT 20;

-- 2. QUESTS ATIVAS DO USUÁRIO (public.usuarios_quest)
SELECT 
  uq.id AS quest_id,
  uq.status,
  uq.catalogo_id,
  COALESCE(uq.config->>'titulo', qc.titulo) AS titulo,
  COALESCE(uq.config->>'contexto_origem', '') AS contexto_origem,
  uq.ativado_em,
  uq.atualizado_em,
  qc.codigo AS catalogo_codigo,
  qc.categoria AS catalogo_categoria
FROM public.usuarios_quest uq
LEFT JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
WHERE uq.usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
  AND uq.status IN ('ativa', 'disponivel')
ORDER BY uq.ativado_em DESC NULLS LAST, uq.atualizado_em DESC
LIMIT 30;

-- 3. TOTAL DE QUESTS POR STATUS
SELECT 
  status,
  COUNT(*) AS total
FROM public.usuarios_quest
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
GROUP BY status
ORDER BY total DESC;

-- 4. CONVERSAS VS QUESTS (últimas 7 conversas)
WITH ultimas_conversas AS (
  SELECT 
    id AS chat_id,
    data_conversa,
    processada_em,
    criado_em
  FROM public.usr_chat
  WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
  ORDER BY data_conversa DESC, criado_em DESC
  LIMIT 7
),
quests_por_data AS (
  SELECT 
    DATE(uq.ativado_em) AS data_criacao,
    COUNT(*) AS total_quests
  FROM public.usuarios_quest uq
  WHERE uq.usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
    AND uq.ativado_em IS NOT NULL
    AND uq.ativado_em >= (SELECT MIN(data_conversa) FROM ultimas_conversas)
  GROUP BY DATE(uq.ativado_em)
)
SELECT 
  uc.chat_id,
  uc.data_conversa,
  uc.processada_em,
  CASE 
    WHEN uc.processada_em IS NULL THEN 'Não processada'
    ELSE 'Processada'
  END AS status,
  COALESCE(qpd.total_quests, 0) AS quests_criadas_no_dia
FROM ultimas_conversas uc
LEFT JOIN quests_por_data qpd ON DATE(uc.data_conversa) = qpd.data_criacao
ORDER BY uc.data_conversa DESC;

-- 5. QUESTS CRIADAS POR TIPO/CATEGORIA
SELECT 
  COALESCE(qc.categoria, 'personalizada') AS tipo_quest,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE uq.status = 'ativa') AS ativas,
  COUNT(*) FILTER (WHERE uq.status = 'concluida') AS concluidas
FROM public.usuarios_quest uq
LEFT JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
WHERE uq.usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
GROUP BY qc.categoria
ORDER BY total DESC;
