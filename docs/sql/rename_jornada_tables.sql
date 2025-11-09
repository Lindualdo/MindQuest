-- Renomeia as tabelas principais da jornada e recria views de compatibilidade.
-- Seguro para múltiplas execuções (DROP VIEW IF EXISTS).

BEGIN;

DO $$
DECLARE
    legado_resumo BOOLEAN := EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'quest_estado_usuario'
    );
    legado_niveis BOOLEAN := EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'quest_niveis'
    );
BEGIN
    IF legado_resumo THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = 'resumo_jornada'
        ) THEN
            EXECUTE 'DROP TABLE public.resumo_jornada';
        END IF;
        EXECUTE 'ALTER TABLE public.quest_estado_usuario RENAME TO resumo_jornada';
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'resumo_jornada'
    ) THEN
        RAISE EXCEPTION 'Nenhuma tabela encontrada para resumo_jornada ou quest_estado_usuario.';
    END IF;

    IF legado_niveis THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = 'jornada_niveis'
        ) THEN
            EXECUTE 'DROP TABLE public.jornada_niveis';
        END IF;
        EXECUTE 'ALTER TABLE public.quest_niveis RENAME TO jornada_niveis';
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'jornada_niveis'
    ) THEN
        RAISE EXCEPTION 'Nenhuma tabela encontrada para jornada_niveis ou quest_niveis.';
    END IF;

    IF (SELECT EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public'
          AND table_name = 'quest_estado_usuario'
    )) THEN
        EXECUTE 'DROP VIEW public.quest_estado_usuario';
    END IF;

    IF (SELECT EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public'
          AND table_name = 'quest_niveis'
    )) THEN
        EXECUTE 'DROP VIEW public.quest_niveis';
    END IF;

    EXECUTE 'CREATE OR REPLACE VIEW public.quest_estado_usuario AS SELECT * FROM public.resumo_jornada';
    EXECUTE 'CREATE OR REPLACE VIEW public.quest_niveis AS SELECT * FROM public.jornada_niveis';
END$$;

COMMIT;
