-- ============================================
-- VALIDAÇÃO DE REGRAS DE NEGÓCIO
-- Usuario ID: f6d4c6b0-5496-4035-b670-d8009df6c413
-- ============================================

-- REGRA 1: Conversas com ≥50 palavras devem ser consideradas válidas
-- ============================================
SELECT 
  id AS chat_id,
  data_conversa,
  total_palavras_usuario,
  processada_em,
  CASE 
    WHEN total_palavras_usuario >= 50 THEN '✓ Válida (≥50 palavras)'
    ELSE '✗ Inválida (<50 palavras)'
  END AS validacao_contexto,
  CASE 
    WHEN processada_em IS NOT NULL THEN '✓ Processada'
    ELSE '✗ Não processada'
  END AS status_processamento
FROM public.usr_chat
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
ORDER BY data_conversa DESC, criado_em DESC
LIMIT 15;

-- REGRA 2: Cada conversa processada deve gerar 3-4 quests
-- ============================================
WITH conversas_processadas AS (
  SELECT 
    id AS chat_id,
    data_conversa,
    processada_em,
    total_palavras_usuario
  FROM public.usr_chat
  WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
    AND processada_em IS NOT NULL
),
quests_por_conversa AS (
  SELECT 
    DATE(cp.processada_em) AS data_processamento,
    COUNT(DISTINCT uq.id) AS total_quests_criadas
  FROM conversas_processadas cp
  LEFT JOIN public.usuarios_quest uq ON 
    uq.usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
    AND DATE(uq.ativado_em) = DATE(cp.processada_em)
  GROUP BY DATE(cp.processada_em)
)
SELECT 
  cp.chat_id,
  cp.data_conversa,
  cp.processada_em,
  cp.total_palavras_usuario,
  COALESCE(qpc.total_quests_criadas, 0) AS quests_criadas,
  CASE 
    WHEN COALESCE(qpc.total_quests_criadas, 0) BETWEEN 3 AND 4 THEN '✓ Conforme (3-4 quests)'
    WHEN COALESCE(qpc.total_quests_criadas, 0) = 0 THEN '⚠ Nenhuma quest criada'
    ELSE '✗ Fora do padrão'
  END AS validacao_regra
FROM conversas_processadas cp
LEFT JOIN quests_por_conversa qpc ON DATE(cp.processada_em) = qpc.data_processamento
ORDER BY cp.data_conversa DESC;

-- REGRA 3: Quests com contexto_origem devem ter referência à conversa
-- ============================================
SELECT 
  uq.id AS quest_id,
  COALESCE(uq.config->>'titulo', qc.titulo) AS titulo,
  uq.config->>'contexto_origem' AS contexto_origem,
  uq.ativado_em,
  qc.categoria,
  CASE 
    WHEN uq.config->>'contexto_origem' IS NOT NULL THEN '✓ Tem contexto'
    ELSE '⚠ Sem contexto origem'
  END AS tem_contexto
FROM public.usuarios_quest uq
LEFT JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
WHERE uq.usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
  AND uq.status IN ('ativa', 'disponivel')
ORDER BY uq.ativado_em DESC NULLS LAST
LIMIT 20;

-- REGRA 4: Total de quests não deve exceder 15 por usuário
-- ============================================
SELECT 
  COUNT(*) FILTER (WHERE status = 'ativa') AS quests_ativas,
  COUNT(*) FILTER (WHERE status = 'disponivel') AS quests_disponiveis,
  COUNT(*) FILTER (WHERE status IN ('ativa', 'disponivel')) AS total_ativas_disponiveis,
  CASE 
    WHEN COUNT(*) FILTER (WHERE status IN ('ativa', 'disponivel')) <= 15 THEN '✓ Dentro do limite (≤15)'
    ELSE '✗ Acima do limite (>15)'
  END AS validacao_limite
FROM public.usuarios_quest
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413';

-- REGRA 5: Verificar se há conversas válidas não processadas
-- ============================================
SELECT 
  COUNT(*) AS conversas_validas_nao_processadas,
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ Todas conversas válidas foram processadas'
    ELSE CONCAT('⚠ ', COUNT(*), ' conversa(s) válida(s) aguardando processamento')
  END AS status
FROM public.usr_chat
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
  AND total_palavras_usuario >= 50
  AND processada_em IS NULL;

-- RESUMO GERAL
-- ============================================
SELECT 
  'Conversas' AS tipo,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE total_palavras_usuario >= 50) AS validas,
  COUNT(*) FILTER (WHERE processada_em IS NOT NULL) AS processadas
FROM public.usr_chat
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
UNION ALL
SELECT 
  'Quests' AS tipo,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status IN ('ativa', 'disponivel')) AS validas,
  COUNT(*) FILTER (WHERE status = 'concluida') AS processadas
FROM public.usuarios_quest
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413';


