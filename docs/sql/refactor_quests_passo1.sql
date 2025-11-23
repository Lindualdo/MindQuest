-- =====================================================
-- Refactor Quests - Passo 1: Catálogo Estruturado
-- Data: 2025-11-23
-- =====================================================

BEGIN;

-- =====================================================
-- 1. LIMPEZA: Remover campos desnecessários de usuarios_quest
-- =====================================================

-- Fase 1: Campos seguros (nunca usados)
ALTER TABLE public.usuarios_quest
  DROP COLUMN IF EXISTS tentativas,
  DROP COLUMN IF EXISTS cancelado_em,
  DROP COLUMN IF EXISTS referencia_data;

-- Fase 2: Campos legados (progresso e XP)
ALTER TABLE public.usuarios_quest
  DROP COLUMN IF EXISTS progresso_atual,
  DROP COLUMN IF EXISTS progresso_meta,
  DROP COLUMN IF EXISTS progresso_percentual,
  DROP COLUMN IF EXISTS xp_concedido,
  DROP COLUMN IF EXISTS reiniciada_em;

-- Remover constraints relacionadas
ALTER TABLE public.usuarios_quest
  DROP CONSTRAINT IF EXISTS quest_instancias_progresso_check,
  DROP CONSTRAINT IF EXISTS quest_instancias_xp_check;

-- Migrar contexto_origem para config JSONB (se existir)
UPDATE public.usuarios_quest
SET config = jsonb_set(
  COALESCE(config, '{}'::jsonb),
  '{contexto_origem}',
  to_jsonb(contexto_origem)
)
WHERE contexto_origem IS NOT NULL
  AND (config->>'contexto_origem') IS NULL;

-- Remover contexto_origem após migração
ALTER TABLE public.usuarios_quest
  DROP COLUMN IF EXISTS contexto_origem;

-- =====================================================
-- 2. CRIAR: Tabela quests_catalogo
-- =====================================================

CREATE TABLE IF NOT EXISTS public.quests_catalogo (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo              VARCHAR(64) NOT NULL UNIQUE,
    titulo              VARCHAR(200) NOT NULL,
    descricao           TEXT,
    instrucoes          JSONB NOT NULL DEFAULT '{}',
    categoria           VARCHAR(50) NOT NULL,
    nivel_prioridade    SMALLINT NOT NULL DEFAULT 3,
    tipo_recorrencia    VARCHAR(20),
    tempo_estimado_min  SMALLINT NOT NULL DEFAULT 5,
    dificuldade         SMALLINT NOT NULL DEFAULT 2,
    base_cientifica     JSONB DEFAULT '{}',
    areas_vida_ids      UUID[],
    sabotador_id        TEXT,
    ativo               BOOLEAN NOT NULL DEFAULT true,
    criado_em           TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em       TIMESTAMP NOT NULL DEFAULT now(),
    
    CONSTRAINT quests_catalogo_nivel_prioridade_check 
      CHECK (nivel_prioridade BETWEEN 1 AND 4),
    CONSTRAINT quests_catalogo_dificuldade_check 
      CHECK (dificuldade BETWEEN 1 AND 3),
    CONSTRAINT quests_catalogo_tipo_recorrencia_check 
      CHECK (tipo_recorrencia IN ('diaria', 'semanal', 'unica', 'contextual', NULL))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_quests_catalogo_codigo ON public.quests_catalogo(codigo);
CREATE INDEX IF NOT EXISTS idx_quests_catalogo_categoria ON public.quests_catalogo(categoria);
CREATE INDEX IF NOT EXISTS idx_quests_catalogo_nivel_prioridade ON public.quests_catalogo(nivel_prioridade);
CREATE INDEX IF NOT EXISTS idx_quests_catalogo_sabotador ON public.quests_catalogo(sabotador_id) WHERE sabotador_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quests_catalogo_areas_vida ON public.quests_catalogo USING gin(areas_vida_ids);

-- Comentários
COMMENT ON TABLE public.quests_catalogo IS 'Catálogo de quests disponíveis no sistema (templates/modelos)';
COMMENT ON COLUMN public.quests_catalogo.codigo IS 'Código único identificador da quest (ex: reflexao_matinal)';
COMMENT ON COLUMN public.quests_catalogo.nivel_prioridade IS '1=essencial, 2=transformador, 3=apoio, 4=opcional';
COMMENT ON COLUMN public.quests_catalogo.dificuldade IS '1=facil, 2=moderada, 3=desafiadora';
COMMENT ON COLUMN public.quests_catalogo.base_cientifica IS 'JSONB com fundamentos, objetivo, como aplicar, tipo, links e referências';

-- =====================================================
-- 3. ADICIONAR: Campo catalogo_id em usuarios_quest
-- =====================================================

ALTER TABLE public.usuarios_quest
  ADD COLUMN IF NOT EXISTS catalogo_id UUID;

-- Foreign Key
ALTER TABLE public.usuarios_quest
  ADD CONSTRAINT fk_usuarios_quest_catalogo 
    FOREIGN KEY (catalogo_id) 
    REFERENCES public.quests_catalogo(id) 
    ON DELETE SET NULL;

-- Índice
CREATE INDEX IF NOT EXISTS idx_usuarios_quest_catalogo 
  ON public.usuarios_quest(catalogo_id) 
  WHERE catalogo_id IS NOT NULL;

COMMIT;

-- =====================================================
-- FIM: Estrutura criada
-- Próximo passo: Popular catálogo inicial
-- =====================================================

