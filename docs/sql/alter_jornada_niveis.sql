BEGIN;

ALTER TABLE public.gamificacao_niveis
    RENAME TO jornada_niveis;

ALTER TABLE public.jornada_niveis
    RENAME CONSTRAINT gamificacao_niveis_check TO jornada_niveis_xp_proximo_check;

ALTER TABLE public.jornada_niveis
    RENAME CONSTRAINT gamificacao_niveis_xp_minimo_check TO jornada_niveis_xp_minimo_check;

ALTER TABLE public.jornada_niveis
    RENAME CONSTRAINT gamificacao_niveis_pkey TO jornada_niveis_pkey;

ALTER TABLE public.jornada_niveis
    ADD COLUMN lema character varying(120),
    ADD COLUMN foco_principal text,
    ADD COLUMN meta_principal text,
    ADD COLUMN criterios jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN conquistas jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN recompensas jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN transformacao text;

COMMIT;
