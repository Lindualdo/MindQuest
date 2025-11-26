-- Migração Quests v1.3.8
-- Data: 2025-01-22

-- 1. Criar tabela quests_recorrencias
CREATE TABLE IF NOT EXISTS public.quests_recorrencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuarios_quest_id UUID NOT NULL REFERENCES public.usuarios_quest(id) ON DELETE CASCADE,
    data_planejada DATE NOT NULL,
    data_concluida DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida', 'perdida')),
    xp_base INTEGER NOT NULL DEFAULT 10,
    xp_bonus INTEGER NOT NULL DEFAULT 0,
    criado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT quests_recorrencias_unique UNIQUE (usuarios_quest_id, data_planejada)
);

-- Índices
CREATE INDEX idx_quests_recorrencias_usuarios_quest ON public.quests_recorrencias(usuarios_quest_id);
CREATE INDEX idx_quests_recorrencias_status ON public.quests_recorrencias(status);
CREATE INDEX idx_quests_recorrencias_data_planejada ON public.quests_recorrencias(data_planejada);
CREATE INDEX idx_quests_recorrencias_data_concluida ON public.quests_recorrencias(data_concluida) WHERE data_concluida IS NOT NULL;

-- 2. Alterar usuarios_quest: remover campos e atualizar constraints
ALTER TABLE public.usuarios_quest
    DROP COLUMN IF EXISTS recorrencias,
    DROP COLUMN IF EXISTS quest_estagio,
    DROP COLUMN IF EXISTS concluido_em,
    DROP COLUMN IF EXISTS janela_inicio,
    DROP COLUMN IF EXISTS janela_fim,
    DROP COLUMN IF EXISTS base_cientifica,
    DROP COLUMN IF EXISTS complexidade;

-- Atualizar constraint de status
ALTER TABLE public.usuarios_quest
    DROP CONSTRAINT IF EXISTS quest_instancias_status_check;

ALTER TABLE public.usuarios_quest
    ADD CONSTRAINT usuarios_quest_status_check 
    CHECK (status IN ('disponivel', 'ativa', 'inativa'));

-- Atualizar status padrão
ALTER TABLE public.usuarios_quest
    ALTER COLUMN status SET DEFAULT 'disponivel';

-- Remover constraint de quest_estagio (campo removido)
ALTER TABLE public.usuarios_quest
    DROP CONSTRAINT IF EXISTS usuarios_quest_quest_estagio_check;

-- Remover índice de quest_estagio (campo removido)
DROP INDEX IF EXISTS idx_usuarios_quest_quest_estagio;

-- Remover índice de recorrencias (campo removido)
DROP INDEX IF EXISTS idx_usuarios_quest_recorrencias;

