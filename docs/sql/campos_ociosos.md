## Campos não utilizados (workflows de XP e quests)

- Referência: `sw_xp_conversas` (`Buscar Estado`, `Atualizar Estado`) e `webhook_quests` (`Buscar Estado`, `Buscar Quests`).

### `usr_chat`

- `session_id`, `horario_inicio`, `horario_fim`, `total_interactions`, `status`, `mensagens`, `processada_em`, `criado_em`, `resumo_conversa`.
- Observação: os workflows de XP leem apenas `usuario_id`, `data_conversa`, `atualizado_em`, `tem_reflexao` e `total_palavras_usuario`. Os demais campos continuam preenchidos pelo chat-service mas nunca são consultados.

### `metas_catalogo`

- `gatilho_codigo`, `gatilho_valor`.
- `repeticao`, `ordem_inicial`, `ativo`.
- `area_vida_id`, `sabotador_id`, `complexidade`, `insight_id`.
- Observação: após a migração das quests personalizadas para `usuarios_quest`, o catálogo fica restrito às metas padrão (conversas/hábitos). Nele só precisamos de `id`, `codigo`, `titulo`, `descricao`, `tipo` (conversa/quest), `xp_recompensa`, `config` e os `timestamps`. Os campos acima eram usados pelo esquema antigo e hoje nunca são lidos.

### `usuarios_conquistas`

- `historico_resumido`.
- Observação: o snapshot consolidado passou a usar `xp_base`, `xp_bonus`, contadores de quests e streaks. O campo `historico_resumido` ficou redundante porque toda auditoria vai para `conquistas_historico`.

### `conquistas_historico`

- `nivel_anterior`, `nivel_novo`.
- Observação: desde que `sw_calcula_jornada` passou a recalcular níveis após cada evento, ninguém lê os níveis armazenados em cada linha do histórico. Os workflows consideram apenas `tipo`, `meta_codigo`, `xp_base`, `xp_bonus` e `detalhes`.

### Próximos passos

- Validar se algum dashboard/relatório externo ainda depende dos campos listados. Se não houver referências, podemos montar uma migração única (remover colunas + atualizar views) e reaplayar os testes de XP/quests.
