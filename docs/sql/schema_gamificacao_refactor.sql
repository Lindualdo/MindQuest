-- Refatoração das tabelas de gamificação/jornada.
-- Executar em staging antes de produção. Garante compatibilidade com os novos nomes:
-- metas_catalogo, usuarios_conquistas, usuarios_quest e conquistas_historico.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

------------------------------------------------------------------------------
-- 1) Renomear tabelas centrais
------------------------------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'quest_templates'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'metas_catalogo'
        ) THEN
            EXECUTE 'DROP TABLE public.metas_catalogo CASCADE';
        END IF;
        EXECUTE 'ALTER TABLE public.quest_templates RENAME TO metas_catalogo';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'quest_atribuidas'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'usuarios_quest'
        ) THEN
            EXECUTE 'DROP TABLE public.usuarios_quest CASCADE';
        END IF;
        EXECUTE 'ALTER TABLE public.quest_atribuidas RENAME TO usuarios_quest';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'resumo_jornada'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'usuarios_conquistas'
        ) THEN
            EXECUTE 'DROP TABLE public.usuarios_conquistas CASCADE';
        END IF;
        EXECUTE 'ALTER TABLE public.resumo_jornada RENAME TO usuarios_conquistas';
    END IF;
END$$;

------------------------------------------------------------------------------
-- 2) Views de compatibilidade (caso algum workflow antigo consulte os nomes anteriores)
------------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.quest_templates AS SELECT * FROM public.metas_catalogo;
CREATE OR REPLACE VIEW public.quest_atribuidas AS SELECT * FROM public.usuarios_quest;
CREATE OR REPLACE VIEW public.resumo_jornada AS SELECT * FROM public.usuarios_conquistas;

------------------------------------------------------------------------------
-- 3) Ajustar estrutura de usuarios_conquistas
------------------------------------------------------------------------------

ALTER TABLE public.usuarios_conquistas
    ADD COLUMN IF NOT EXISTS xp_base INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS xp_bonus INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS historico_resumido JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Garantir índices úteis
CREATE INDEX IF NOT EXISTS idx_usuarios_conquistas_usuario ON public.usuarios_conquistas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_conquistas_atualizado_em ON public.usuarios_conquistas (atualizado_em);

------------------------------------------------------------------------------
-- 4) Tabela de histórico de conquistas
------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.conquistas_historico (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id        UUID NOT NULL,
    tipo              TEXT NOT NULL, -- conversa | quest
    meta_codigo       TEXT NOT NULL,
    meta_titulo       TEXT NOT NULL,
    xp_base           INTEGER NOT NULL DEFAULT 0,
    xp_bonus          INTEGER NOT NULL DEFAULT 0,
    nivel_anterior    INTEGER,
    nivel_novo        INTEGER,
    detalhes          JSONB NOT NULL DEFAULT '{}'::jsonb,
    registrado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conquistas_historico_usuario ON public.conquistas_historico (usuario_id);
CREATE INDEX IF NOT EXISTS idx_conquistas_historico_tipo ON public.conquistas_historico (tipo);
CREATE INDEX IF NOT EXISTS idx_conquistas_historico_meta ON public.conquistas_historico (meta_codigo);

------------------------------------------------------------------------------
-- 5) Catálogo de metas atualizado
------------------------------------------------------------------------------

INSERT INTO public.metas_catalogo (
    id,
    codigo,
    titulo,
    descricao,
    tipo,
    gatilho_codigo,
    gatilho_valor,
    xp_recompensa,
    repeticao,
    ordem_inicial,
    ativo,
    config,
    criado_em,
    atualizado_em
)
SELECT
    gen_random_uuid(),
    'primeira_conversa',
    'Primeira conversa',
    'Realize a primeira conversa com o mentor para desbloquear o bônus inicial.',
    'sequencia',
    'conversas_consecutivas',
    1,
    75,
    'unica',
    0,
    TRUE,
    '{"bonus_xp":75}'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.metas_catalogo WHERE codigo = 'primeira_conversa'
);

INSERT INTO public.metas_catalogo (
    id,
    codigo,
    titulo,
    descricao,
    tipo,
    gatilho_codigo,
    gatilho_valor,
    xp_recompensa,
    repeticao,
    ordem_inicial,
    ativo,
    config,
    criado_em,
    atualizado_em
)
SELECT
    gen_random_uuid(),
    'conversa_diaria',
    'Conversa diária',
    'Registra o XP base concedido em cada dia com pelo menos uma conversa válida.',
    'recorrente',
    'conversas_diarias',
    1,
    75,
    'recorrente',
    0,
    TRUE,
    '{"tipo":"xp_diaria"}'::jsonb,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.metas_catalogo WHERE codigo = 'conversa_diaria'
);

COMMIT;
