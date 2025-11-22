# Atualização Manual do Webhook de Autenticação - n8n

**Workflow:** `webhook_app_authentication`  
**ID:** `r0CuG6F3S1TR8ohs`  
**Endpoint:** `/auth/validate`

---

## Alterações Necessárias

### 1. Nó `01_Validar_Usuario` (Postgres)
**Node ID:** `a89eea39-2f9c-426f-8306-1df9868e1596`

**Atualizar Query SQL:**
```sql
SELECT 
    u.id as user_id,
    u.nome,
    u.nome_preferencia,
    COALESCE(u.cronotipo_detectado, NULL) as cronotipo_detectado
FROM usuarios u
WHERE u.token_acesso = $1 
  AND u.token_expira_em > CURRENT_TIMESTAMP
LIMIT 1;
```

**⚠️ IMPORTANTE:** Ao atualizar via UI do n8n, garantir que:
- `operation` = "Execute Query"
- `query` = SQL acima
- `options.queryReplacement` = `={{ $json.body.token }}`

---

### 2. Nó `organiza_dados` (Code)
**Node ID:** `b43955dd-13ae-4738-b3d5-45f9b5e7d47b`

**Substituir código JavaScript completo por:**
```javascript
const items = $input.all();
const userRow = items[0]?.json || {};

function normalizeString(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string') return String(value);
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'null') return fallback;
  return trimmed;
}

// Validar se usuário foi encontrado
if (!userRow.user_id) {
  return [{
    json: {
      response: {
        success: false,
        error: 'Token inválido ou expirado'
      }
    }
  }];
}

// Retornar apenas dados do usuário
const user = {
  id: normalizeString(userRow.user_id),
  nome: normalizeString(userRow.nome, 'Usuário'),
  nome_preferencia: normalizeString(userRow.nome_preferencia, userRow.nome || 'Usuário'),
  cronotipo_detectado: normalizeString(userRow.cronotipo_detectado, null)
};

return [{
  json: {
    response: {
      success: true,
      user: user
    }
  }
}];
```

**⚠️ IMPORTANTE:** Verificar que `Mode` = "Run Once for All Items"

---

## Estrutura de Conexões (Manter)

```
Webhook → 01_Validar_Usuario → organiza_dados → Respond to Webhook
```

---

## Resultado Esperado

**Payload de Resposta:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "nome": "Aldo",
    "nome_preferencia": "Aldo",
    "cronotipo_detectado": "matutino"
  }
}
```

**Em caso de erro:**
```json
{
  "success": false,
  "error": "Token inválido ou expirado"
}
```

---

## Validação

Após atualizar:
1. Testar endpoint: `POST /webhook/auth/validate` com token válido
2. Verificar que retorna apenas dados do usuário
3. Verificar que payload é ~200-500 bytes (não ~50-100KB)

---

**Status:** ⏳ Aguardando atualização manual no n8n

