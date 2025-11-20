# Status da Implementação — Refactory Quests Recorrentes

## ✅ Concluído

### 1. Database
- ✅ Coluna `recorrencias` JSONB criada em `usuarios_quest`
- ✅ Index GIN criado para performance
- ✅ Backfill de 3 quests existentes

### 2. Webhook de Conclusão
- ✅ `webhook_concluir_quest` atualiza JSONB ao concluir quest
- ✅ Registra `status: 'concluida'` e `concluido_em` no dia correspondente

### 3. Webhooks de Progresso
- ✅ `webhook_progresso_semanal` (home card) usa `recorrencias` para calcular meta
- ✅ `webhook_progresso_quests_semanal` (painel) usa `recorrencias` para calcular meta
- ✅ Queries otimizadas com `CROSS JOIN LATERAL jsonb_array_elements`

### 4. Criação de Quests (`sw_xp_quest`)
- ✅ Query de INSERT atualizada com CTE `recorrencias_quest`
- ✅ Campo `recorrencias` populado automaticamente ao criar quest
- ✅ Lógica integrada: gera agenda de dias entre `prazo_inicio` e `prazo_fim`
- ✅ Suporta qualquer tipo de recorrência diferente de 'unica'

**Estrutura do JSONB:**
```json
{
  "tipo": "diaria",
  "janela": {
    "inicio": "2025-11-19",
    "fim": "2025-11-25"
  },
  "dias": [
    {
      "data": "2025-11-19",
      "status": "pendente",
      "xp_previsto": 30,
      "concluido_em": null
    },
    ...
  ]
}
```

## 📋 Próximos Passos

1. **Testar webhooks atualizados:**
   - Home card: `/card/weekly-progress?user_id=...`
   - Painel: `/card/quests-weekly-progress?user_id=...`

2. **Integrar função no `sw_xp_quest`:**
   - Abrir workflow no n8n
   - Localizar nó de INSERT
   - Adicionar node Code antes
   - Testar criação de quest recorrente

3. **Validar end-to-end:**
   - Criar quest diária via chat
   - Concluir quest no painel
   - Verificar atualização no JSONB
   - Conferir cálculo de meta nos webhooks

## 📝 Arquivos de Referência

- Especificação: `docs/espec/refactory_quests_recorrentes.md`
- Queries: `data/query_progresso_semanal_refactored.sql`, `data/query_quests_semanal_refactored.sql`
- Função JS: `data/funcao_popular_recorrencias.js`
- Backups n8n: `backups/n8n/webhook_*.json`

