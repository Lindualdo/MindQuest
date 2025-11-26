# Status e Estágios das Quests v1.3.8

**Data:** 2025-01-22  
**Versão:** 1.3.8

---

## Estrutura

- **`usuarios_quest`**: Quest pai
- **`quests_recorrencias`**: Planejado e concluído unificados (uma linha por dia)
- **`usuarios_conquistas`**: Pontos consolidados

---

## Status

### `usuarios_quest` (quest pai)
- `disponivel` - Criada, aguardando usuário ativar
- `ativa` - Usuário ativou, em andamento
- `inativa` - Todas instâncias concluídas ou vencidas (pode reativar)

### `quests_recorrencias` (cada ocorrência)
- `pendente` - Planejada, não concluída
- `concluida` - Concluída pelo usuário
- `perdida` - Prazo passou sem concluir (opcional)

---

## Interface do Usuário

### A fazer
- `usuarios_quest.status = 'disponivel'`

### Fazendo
- `usuarios_quest.status = 'ativa'` 
- E `quests_recorrencias.status = 'pendente'` (pelo menos uma)

### Feito
- `quests_recorrencias.status = 'concluida'` (pelo menos uma)

### Inativa
- Todas instâncias concluídas ou vencidas → `usuarios_quest.status = 'inativa'`

---

## Regras

1. **Criação automática** → `usuarios_quest.status='disponivel'`
2. **Usuário ativa** → `usuarios_quest.status='ativa'` + cria `quests_recorrencias` com `status='pendente'`
3. **Usuário conclui dia** → `quests_recorrencias.status='concluida'`
4. **Todas concluídas/vencidas** → `usuarios_quest.status='inativa'`
5. **Reativar** → `usuarios_quest.status='ativa'` + novos registros em `quests_recorrencias`

**Conversas:** Sempre `usuarios_quest.status='ativa'` (nunca muda)

---

**Última atualização:** 2025-01-22

