## Campos não utilizados (workflows de XP e quests)

- Referência: `sw_xp_conversas` (`Buscar Estado`, `Atualizar Estado`) e `webhook_quests` (`Buscar Estado`, `Buscar Quests`).

### `usuarios_conquistas`

- `xp_base`.
- `xp_bonus`.
- `historico_resumido`.
- `total_quests_concluidas`.
- `total_quests_personalizadas`.
- `criado_em`.
- `id`.
- Observação: workflows usam apenas snapshot atual (xp, streak, metas); demais colunas não são lidas nem atualizadas.

### `usuarios_quest`

- `tentativas`.
- `janela_inicio`.
- `janela_fim`.
- `referencia_data`.
- `reiniciada_em`.
- `ativado_em`.
- `cancelado_em`.
- `area_vida_id`.
- `sabotador_id`.
- `complexidade`.
- `insight_id`.
- Observação: endpoint limita-se a status, progresso e metadados da quest; campos acima permanecem fora do payload.

### `usr_chat`

- `session_id`.
- `horario_inicio`.
- `horario_fim`.
- `total_interactions`.
- `status`.
- `mensagens`.
- `processada_em`.
- `criado_em`.
- `resumo_conversa`.
- Observação: cálculos só dependem de `usuario_id`, `data_conversa`, `atualizado_em`, `tem_reflexao`, `total_palavras_usuario`.

### `metas_catalogo`

- `repeticao`.
- `ordem_inicial`.
- `ativo`.
- `area_vida_id`.
- `sabotador_id`.
- `complexidade`.
- `insight_id`.
- Observação: `webhook_quests` usa apenas título, descrição, config, xp e gatilhos; demais atributos não chegam ao app.

### Próximos passos

- Validar outros workflows para confirmar se algum deles consome esses campos antes de planejar remoção ou migração.
