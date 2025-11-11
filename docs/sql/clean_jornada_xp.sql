-- Limpa dados operacionais de jornada/XP, preservando catálogos (`metas_catalogo`, `jornada_niveis`)
-- e o histórico bruto de conversas (`usr_chat`).
-- Uso: revisar em staging e rodar manualmente antes de execuções em lote.

BEGIN;

-- Remove histórico granular de XP/conquistas.
TRUNCATE TABLE public.conquistas_historico RESTART IDENTITY;

-- Remove instâncias ativas/pendentes de quests personalizadas.
TRUNCATE TABLE public.usuarios_quest RESTART IDENTITY CASCADE;

-- Zera o snapshot consolidado de jornada/XPs dos usuários.
TRUNCATE TABLE public.usuarios_conquistas RESTART IDENTITY CASCADE;

-- (Opcional) Reinicia a tabela legada de gamificação se ainda estiver em uso.
TRUNCATE TABLE public.gamificacao RESTART IDENTITY CASCADE;

COMMIT;
