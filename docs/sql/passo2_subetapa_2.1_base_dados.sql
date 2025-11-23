-- =====================================================
-- Passo 2 - Sub-etapa 2.1: Atualização na Base de Dados
-- Data: 2025-11-23
-- =====================================================

BEGIN;

-- =====================================================
-- 1. Adicionar campo quest_estagio em usuarios_quest
-- =====================================================

ALTER TABLE public.usuarios_quest
  ADD COLUMN IF NOT EXISTS quest_estagio VARCHAR(20) NOT NULL DEFAULT 'a_fazer';

-- Constraint para valores válidos
ALTER TABLE public.usuarios_quest
  ADD CONSTRAINT usuarios_quest_quest_estagio_check 
    CHECK (quest_estagio IN ('a_fazer', 'fazendo', 'feito'));

-- Comentário
COMMENT ON COLUMN public.usuarios_quest.quest_estagio IS 
  'Estágio da quest: a_fazer (criada, não planejada), fazendo (planejada, em execução), feito (todas recorrências concluídas)';

-- Índice para consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_quest_quest_estagio 
  ON public.usuarios_quest(quest_estagio) 
  WHERE quest_estagio IS NOT NULL;

-- =====================================================
-- 2. Adicionar campo estagio_jornada em usuarios
-- =====================================================

ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS estagio_jornada SMALLINT NOT NULL DEFAULT 1;

-- Constraint para valores válidos (1-4)
ALTER TABLE public.usuarios
  ADD CONSTRAINT usuarios_estagio_jornada_check 
    CHECK (estagio_jornada BETWEEN 1 AND 4);

-- Comentário
COMMENT ON COLUMN public.usuarios.estagio_jornada IS 
  'Cache do estágio da jornada: 1=Fundação (níveis 1-3), 2=Transformação (níveis 4-5), 3=Integração (níveis 6-7), 4=Mestria (níveis 8-10)';

-- Índice para consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_estagio_jornada 
  ON public.usuarios(estagio_jornada);

-- =====================================================
-- 3. Criar função para calcular estágio da jornada
-- =====================================================

CREATE OR REPLACE FUNCTION public.calcular_estagio_jornada(p_xp_total INTEGER)
RETURNS SMALLINT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_nivel INTEGER;
BEGIN
  -- Buscar nível baseado em XP
  SELECT nivel INTO v_nivel
  FROM public.jornada_niveis
  WHERE p_xp_total >= xp_minimo
    AND (xp_proximo_nivel IS NULL OR p_xp_total < xp_proximo_nivel)
  ORDER BY nivel DESC
  LIMIT 1;
  
  -- Mapear nível para estágio (1-4)
  RETURN CASE
    WHEN v_nivel BETWEEN 1 AND 3 THEN 1  -- Fundação
    WHEN v_nivel BETWEEN 4 AND 5 THEN 2  -- Transformação
    WHEN v_nivel BETWEEN 6 AND 7 THEN 3  -- Integração
    WHEN v_nivel BETWEEN 8 AND 10 THEN 4 -- Mestria
    ELSE 1 -- Default: Fundação
  END;
END;
$$;

-- Comentário
COMMENT ON FUNCTION public.calcular_estagio_jornada(INTEGER) IS 
  'Calcula estágio da jornada (1-4) baseado no XP total. Mapeia: Níveis 1-3 → Estágio 1, Níveis 4-5 → Estágio 2, Níveis 6-7 → Estágio 3, Níveis 8-10 → Estágio 4';

-- =====================================================
-- 4. Atualizar estagio_jornada para usuários existentes
-- =====================================================

UPDATE public.usuarios u
SET estagio_jornada = public.calcular_estagio_jornada(
  COALESCE(uc.xp_total, 0)
)
FROM public.usuarios_conquistas uc
WHERE uc.usuario_id = u.id;

-- Para usuários sem registro em usuarios_conquistas, manter default (1)
-- (já está como DEFAULT 1 no campo)

COMMIT;

-- =====================================================
-- Validação
-- =====================================================

-- Verificar campos criados
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'usuarios_quest'
  AND column_name = 'quest_estagio';

SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'usuarios'
  AND column_name = 'estagio_jornada';

-- Verificar função criada
SELECT 
  routine_name, 
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'calcular_estagio_jornada';

-- =====================================================
-- FIM: Sub-etapa 2.1 concluída
-- Próximo: Sub-etapa 2.2 (Atualizar sw_criar_quest)
-- =====================================================

