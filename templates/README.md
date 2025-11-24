# Templates n8n

Templates e exemplos para facilitar o trabalho com workflows n8n.

## n8n_postgres_update.json

Template para atualizar nodes Postgres via `n8n_update_partial_workflow`.

### Uso

1. **Copiar o template** e adaptar para seu caso
2. **Sempre incluir** os 3 campos obrigatórios:
   - `operation`: "executeQuery"
   - `query`: SQL completa
   - `options`: {} ou {queryReplacement: "..."}

### Exemplos

**Com queryReplacement:**
```json
{
  "type": "updateNode",
  "nodeId": "abc-123",
  "updates": {
    "parameters": {
      "operation": "executeQuery",
      "query": "SELECT * FROM table WHERE id = $1::uuid",
      "options": {
        "queryReplacement": "={{ [$json.user_id] }}"
      }
    }
  }
}
```

**Sem queryReplacement:**
```json
{
  "type": "updateNode",
  "nodeId": "abc-123",
  "updates": {
    "parameters": {
      "operation": "executeQuery",
      "query": "SELECT * FROM table",
      "options": {}
    }
  }
}
```

### Checklist

- [ ] Ler nó atual via `n8n_get_workflow`
- [ ] Incluir `operation: "executeQuery"`
- [ ] Incluir `query` completa
- [ ] Incluir `options` (vazio ou com queryReplacement)
- [ ] Validar após update via `n8n_get_workflow` ou script de validação

### Validação

Após atualizar, validar com:
```bash
node scripts/validate_postgres_node.mjs <workflow-id> <node-id>
```

