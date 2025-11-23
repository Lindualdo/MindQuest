-- =====================================================
-- Unificar Quests e Conversas
-- Data: 2025-01-22
-- =====================================================
-- Objetivo: Unificar tratamento de conversas e quests
-- 1. Renomear meta_codigo para usuarios_quest_id
-- 2. Adicionar campo xp em quests_catalogo
-- 3. Atualizar todas quests para xp = 10
-- 4. Desativar metas_catalogo
-- =====================================================

BEGIN;

-- =====================================================
-- 1. RENOMEAR: conquistas_historico.meta_codigo → usuarios_quest_id
-- =====================================================

-- Adicionar nova coluna usuarios_quest_id
ALTER TABLE public.conquistas_historico
  ADD COLUMN IF NOT EXISTS usuarios_quest_id UUID;

-- Migrar dados existentes:
-- - Se tipo = 'quest' e meta_codigo é UUID válido → copiar para usuarios_quest_id
-- - Se tipo = 'conversa' → precisará ser migrado depois (criar quest reflexao_diaria primeiro)
UPDATE public.conquistas_historico
SET usuarios_quest_id = meta_codigo::uuid
WHERE tipo = 'quest'
  AND meta_codigo ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_conquistas_historico_usuarios_quest_id 
  ON public.conquistas_historico(usuarios_quest_id);

-- Adicionar foreign key
ALTER TABLE public.conquistas_historico
  ADD CONSTRAINT fk_conquistas_historico_usuarios_quest
    FOREIGN KEY (usuarios_quest_id)
    REFERENCES public.usuarios_quest(id)
    ON DELETE SET NULL;

-- Remover índice antigo (se existir)
DROP INDEX IF EXISTS idx_conquistas_historico_meta;

-- Remover coluna antiga (após migração completa)
-- ALTER TABLE public.conquistas_historico DROP COLUMN IF EXISTS meta_codigo;
-- (Comentado por enquanto - remover depois de validar migração)

-- =====================================================
-- 2. ADICIONAR: Campo xp em quests_catalogo
-- =====================================================

ALTER TABLE public.quests_catalogo
  ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 10;

COMMENT ON COLUMN public.quests_catalogo.xp IS 'Pontos de XP base concedidos ao completar esta quest';

-- Criar índice para consultas
CREATE INDEX IF NOT EXISTS idx_quests_catalogo_xp 
  ON public.quests_catalogo(xp);

-- =====================================================
-- 3. ATUALIZAR: Todas as quests para xp = 10
-- =====================================================

UPDATE public.quests_catalogo
SET xp = 10
WHERE xp IS NULL OR xp != 10;

-- =====================================================
-- 4. REMOVER: Tabela metas_catalogo
-- =====================================================

-- Dropar a tabela completamente
DROP TABLE IF EXISTS public.metas_catalogo CASCADE;

COMMIT;

-- =====================================================
-- NOTAS:
-- - meta_codigo ainda existe (comentado para remoção futura)
-- - Conversas precisarão criar quest reflexao_diaria primeiro
-- - Próximo passo: Atualizar workflow sw_xp_quest
-- =====================================================

