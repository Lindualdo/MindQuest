select * from quests_recorrencias qr join usuarios_quest uq on  
uq.id = qr.usuarios_quest_id
where usuarios_quest_id = '515385b6-8097-4274-9962-8c4ac81d598a' and uq.usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'
order by criado_em desc

select * from usuarios_quest where usuario_id = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24'
order by ativado_em desc
--delete from quests_recorrencias where id = 'c34f7071-9f3e-4694-be1b-18f78e07a168'

