-- =====================================================
-- Limpar Tabelas de Quests para Teste
-- Data: 2025-11-23
-- =====================================================
-- Objetivo: Limpar dados de quests para testes
-- Tabelas: conquistas_historico, usuarios_quest, usuarios_conquistas
-- =====================================================

BEGIN;

-- =====================================================
-- 1. LIMPAR: conquistas_historico
-- =====================================================
-- Limpar histórico de conquistas (tem FK para usuarios_quest)
DELETE FROM public.conquistas_historico
WHERE tipo IN ('quest', 'conversa')
   OR usuarios_quest_id IS NOT NULL
   OR meta_codigo IN (
     SELECT id::text FROM public.usuarios_quest
   );

-- =====================================================
-- 2. LIMPAR: usuarios_quest
-- =====================================================
-- Limpar todas as quests dos usuários
DELETE FROM public.usuarios_quest;

-- =====================================================
-- 3. DELETAR: usuarios_conquistas
-- =====================================================
-- Deletar todos os registros para simular primeiro cadastro
-- Como se todos os usuários estivessem começando agora
DELETE FROM public.usuarios_conquistas;

COMMIT;

-- =====================================================
-- Verificação (opcional - descomente para verificar)
-- =====================================================
-- SELECT COUNT(*) AS total_quests FROM public.usuarios_quest;
-- SELECT COUNT(*) AS total_historico FROM public.conquistas_historico WHERE tipo IN ('quest', 'conversa');
-- SELECT 
--   usuario_id,
--   total_quests_concluidas,
--   total_quests_personalizadas,
--   xp_base,
--   xp_bonus
-- FROM public.usuarios_conquistas
-- LIMIT 10;

