select anotacoes_quest, data_planejada, data_concluida,qr.status,xp_base from quests_recorrencias qr 
join usuarios_quest uq on uq.id = qr.usuarios_quest_id
where usuario_id =  'd949d81c-9235-41ce-8b3b-6b5d593c5e24'
order by qr.atualizado_em desc