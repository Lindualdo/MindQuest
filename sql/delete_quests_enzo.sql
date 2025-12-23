-- Query para verificar quests que serão deletadas
-- Usuário: f6d4c6b0-5496-4035-b670-d8009df6c413 (Enzo)

SELECT 
  id,
  usuario_id,
  status,
  config->>'titulo' AS titulo,
  config->>'descricao' AS descricao,
  ativado_em,
  atualizado_em
FROM public.usuarios_quest
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
  AND (
    config->>'titulo' ILIKE '%Relaxamento%'
    OR config->>'titulo' ILIKE '%Mindfulness%'
    OR config->>'titulo' ILIKE '%Limpeza e organização%'
    OR config->>'titulo' ILIKE '%Cronograma de estudos%'
    OR config->>'titulo' ILIKE '%Dedique 15 minutos%'
    OR config->>'titulo' ILIKE '%Comece sua jornada%'
    OR config->>'titulo' ILIKE '%Alimentação consciente%'
    OR config->>'titulo' ILIKE '%Conexão social%'
  )
ORDER BY ativado_em DESC;

-- ============================================
-- DELETE (executar apenas após confirmar acima)
-- ============================================

DELETE FROM public.usuarios_quest
WHERE usuario_id = 'f6d4c6b0-5496-4035-b670-d8009df6c413'
  AND (
    config->>'titulo' ILIKE '%Relaxamento%'
    OR config->>'titulo' ILIKE '%Mindfulness%'
    OR config->>'titulo' ILIKE '%Limpeza e organização%'
    OR config->>'titulo' ILIKE '%Cronograma de estudos%'
    OR config->>'titulo' ILIKE '%Dedique 15 minutos%'
    OR config->>'titulo' ILIKE '%Comece sua jornada%'
    OR config->>'titulo' ILIKE '%Alimentação consciente%'
    OR config->>'titulo' ILIKE '%Conexão social%'
  );

