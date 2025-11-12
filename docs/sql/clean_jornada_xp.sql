-- Limpa dados operacionais de jornada/XP, preservando catálogos (`metas_catalogo`, `jornada_niveis`)
-- e o histórico bruto de conversas (`usr_chat`).
-- Uso: revisar em staging e rodar manualmente antes de execuções em lote.
-- Teste rápido: esta linha confirma que o agente conseguiu editar o arquivo.
-- Segundo teste: garantindo que novas edições continuam funcionando.

BEGIN;

-- Remove histórico granular de XP/conquistas (conversas + quests).
TRUNCATE TABLE public.conquistas_historico RESTART IDENTITY;

-- Remove instâncias ativas/pendentes de quests personalizadas.
TRUNCATE TABLE public.usuarios_quest RESTART IDENTITY CASCADE;

-- Remove modelos de quests personalizadas do catálogo, preservando apenas metas padrão.
DELETE FROM public.metas_catalogo
WHERE COALESCE(tipo, '') = 'personalizada';

-- Zera o snapshot consolidado de jornada/XPs dos usuários.
TRUNCATE TABLE public.usuarios_conquistas RESTART IDENTITY CASCADE;

-- (Opcional) Reinicia a tabela legada de gamificação se ainda estiver em uso.
TRUNCATE TABLE public.gamificacao RESTART IDENTITY CASCADE;

COMMIT;
