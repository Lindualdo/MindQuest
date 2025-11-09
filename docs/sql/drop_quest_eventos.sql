-- Remove tabela de eventos de quests (não utilizada na arquitetura atual).
-- Execute apenas se já confirmou que não há dependências em uso.

BEGIN;
DROP TABLE IF EXISTS public.quest_eventos CASCADE;
COMMIT;
