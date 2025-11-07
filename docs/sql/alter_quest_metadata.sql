BEGIN;

-- Adiciona metadados aos modelos de quest
ALTER TABLE public.quest_modelos
  ADD COLUMN IF NOT EXISTS area_vida_id uuid,
  ADD COLUMN IF NOT EXISTS sabotador_id text,
  ADD COLUMN IF NOT EXISTS insight_id uuid,
  ADD COLUMN IF NOT EXISTS complexidade smallint NOT NULL DEFAULT 0;

-- Garante valores válidos
UPDATE public.quest_modelos
SET complexidade = COALESCE(complexidade, 0);

-- Opcional: vincula às tabelas de catálogo
ALTER TABLE public.quest_modelos
  DROP CONSTRAINT IF EXISTS quest_modelos_area_vida_fkey,
  ADD CONSTRAINT quest_modelos_area_vida_fkey
    FOREIGN KEY (area_vida_id) REFERENCES public.areas_vida_catalogo (id)
      ON UPDATE CASCADE ON DELETE SET NULL
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE public.quest_modelos
  DROP CONSTRAINT IF EXISTS quest_modelos_sabotador_fkey,
  ADD CONSTRAINT quest_modelos_sabotador_fkey
    FOREIGN KEY (sabotador_id) REFERENCES public.sabotadores_catalogo (id)
      ON UPDATE CASCADE ON DELETE SET NULL
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE public.quest_modelos
  DROP CONSTRAINT IF EXISTS quest_modelos_insight_fkey,
  ADD CONSTRAINT quest_modelos_insight_fkey
    FOREIGN KEY (insight_id) REFERENCES public.insights (id)
      ON UPDATE CASCADE ON DELETE SET NULL
  DEFERRABLE INITIALLY IMMEDIATE;

-- Adiciona metadados às instâncias
ALTER TABLE public.quest_instancias
  ADD COLUMN IF NOT EXISTS area_vida_id uuid,
  ADD COLUMN IF NOT EXISTS sabotador_id text,
  ADD COLUMN IF NOT EXISTS insight_id uuid,
  ADD COLUMN IF NOT EXISTS complexidade smallint NOT NULL DEFAULT 0;

UPDATE public.quest_instancias
SET complexidade = COALESCE(complexidade, 0);

ALTER TABLE public.quest_instancias
  DROP CONSTRAINT IF EXISTS quest_instancias_area_vida_fkey,
  ADD CONSTRAINT quest_instancias_area_vida_fkey
    FOREIGN KEY (area_vida_id) REFERENCES public.areas_vida_catalogo (id)
      ON UPDATE CASCADE ON DELETE SET NULL
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE public.quest_instancias
  DROP CONSTRAINT IF EXISTS quest_instancias_sabotador_fkey,
  ADD CONSTRAINT quest_instancias_sabotador_fkey
    FOREIGN KEY (sabotador_id) REFERENCES public.sabotadores_catalogo (id)
      ON UPDATE CASCADE ON DELETE SET NULL
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE public.quest_instancias
  DROP CONSTRAINT IF EXISTS quest_instancias_insight_fkey,
  ADD CONSTRAINT quest_instancias_insight_fkey
    FOREIGN KEY (insight_id) REFERENCES public.insights (id)
      ON UPDATE CASCADE ON DELETE SET NULL
  DEFERRABLE INITIALLY IMMEDIATE;

COMMIT;
