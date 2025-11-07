BEGIN;

-- 1) Snapshot opcional (mantido em temp tables para conferência imediata)
DROP TABLE IF EXISTS temp_backup_quest_modelos;
DROP TABLE IF EXISTS temp_backup_quest_instancias;

CREATE TEMP TABLE temp_backup_quest_modelos AS
SELECT *
FROM public.quest_modelos
WHERE tipo = 'personalizada';

CREATE TEMP TABLE temp_backup_quest_instancias AS
SELECT qi.*
FROM public.quest_instancias qi
JOIN temp_backup_quest_modelos qm ON qm.id = qi.modelo_id;

-- 2) Remove instâncias e modelos personalizados
DELETE FROM public.quest_instancias
WHERE modelo_id IN (SELECT id FROM temp_backup_quest_modelos);

DELETE FROM public.quest_modelos
WHERE id IN (SELECT id FROM temp_backup_quest_modelos);

-- 3) Zera contadores agregados ligados a quests personalizadas
UPDATE public.quest_estado_usuario
SET
    total_quests_personalizadas = 0,
    total_quests_concluidas = 0,
    total_xp_hoje = LEAST(total_xp_hoje, xp_total), -- garante coerência caso tenha ficado residual
    atualizado_em = NOW();

COMMIT;

-- Observações
-- * Executar `\copy (SELECT * FROM temp_backup_*) TO '...csv' CSV HEADER` durante a mesma sessão caso
--   seja necessário extrair os dados antigos antes de encerrar a transação.
-- * Após o reset, reimportar os workflows n8n atualizados e rodar o fluxo de geração de quests
--   para repopular os dados.
