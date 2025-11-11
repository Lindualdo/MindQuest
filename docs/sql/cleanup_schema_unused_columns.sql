-- Limpeza de colunas e constraints que ficaram obsoletas após a nova arquitetura
-- das jornadas / quests. Execute em ambiente de staging antes de aplicar em produção.
-- Passos:
--   1. Backup das tabelas afetadas (já temos JSON das metas personalizadas em backups/).
--   2. Rodar este script em uma transação.
--   3. Revalidar workflows (`sw_xp_conversas`, `sw_xp_quest`, `sw_calcula_jornada`)
--      com os testes de conversas e quests.

BEGIN;

-- metas_catalogo agora serve apenas como catálogo das metas padrão (conversa/quest),
-- então podemos remover campos herdados da geração dinâmica de modelos personalizados.
ALTER TABLE public.metas_catalogo
  DROP CONSTRAINT IF EXISTS quest_modelos_area_vida_fkey,
  DROP CONSTRAINT IF EXISTS quest_modelos_sabotador_fkey,
  DROP CONSTRAINT IF EXISTS quest_modelos_insight_fkey,
  DROP CONSTRAINT IF EXISTS quest_modelos_gatilho_check,
  DROP CONSTRAINT IF EXISTS quest_modelos_repeticao_check;

ALTER TABLE public.metas_catalogo
  DROP COLUMN IF EXISTS gatilho_codigo,
  DROP COLUMN IF EXISTS gatilho_valor,
  DROP COLUMN IF EXISTS repeticao,
  DROP COLUMN IF EXISTS ordem_inicial,
  DROP COLUMN IF EXISTS ativo,
  DROP COLUMN IF EXISTS area_vida_id,
  DROP COLUMN IF EXISTS sabotador_id,
  DROP COLUMN IF EXISTS complexidade,
  DROP COLUMN IF EXISTS insight_id;

-- O snapshot consolidado já expõe xp_base/xp_bonus e contadores, então o histórico resumido
-- ficou redundante.
ALTER TABLE public.usuarios_conquistas
  DROP COLUMN IF EXISTS historico_resumido;

-- Níveis anterior/novo não são mais lidos porque o workflow `sw_calcula_jornada`
-- recalcula o nível após cada evento.
ALTER TABLE public.conquistas_historico
  DROP COLUMN IF EXISTS nivel_anterior,
  DROP COLUMN IF EXISTS nivel_novo;

COMMIT;
