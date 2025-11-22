# Simplificação do Webhook de Autenticação

**Data:** 2024-11-22  
**Workflow:** `webhook_app_authentication`  
**ID:** `r0CuG6F3S1TR8ohs`

---

## Objetivo

Simplificar o webhook `/auth/validate` para retornar apenas dados do usuário:
- `id`
- `nome`
- `nome_preferencia`
- `cronotipo_detectado`

---

## Alterações Necessárias

### 1. Nó `01_Validar_Usuario` (Postgres)
**Node ID:** `a89eea39-2f9c-426f-8306-1df9868e1596`

**Query Atual:**
```sql
SELECT 
    u.id as user_id,
    u.nome,
    u.nome_preferencia,
    u.whatsapp_numero,
    COALESCE(u.cronotipo_detectado, 'null') as cronotipo_detectado,
    u.status_onboarding,
    u.criado_em,
    u.token_expira_em
FROM usuarios u
WHERE u.token_acesso = $1 
  AND u.token_expira_em > CURRENT_TIMESTAMP
LIMIT 1;
```

**Query Nova:**
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

**Campos Removidos:**
- `whatsapp_numero`
- `status_onboarding`
- `criado_em`
- `token_expira_em`

---

### 2. Nó `organiza_dados` (Code)
**Node ID:** `b43955dd-13ae-4738-b3d5-45f9b5e7d47b`

**Código Novo (Simplificado):**
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

**Removido:**
- Todo processamento de perfil Big Five
- Todo processamento de gamificação
- Todo processamento de próxima jornada
- Todo processamento de sabotador
- Todo processamento de humor
- Todo processamento de emoções
- Todo processamento de PANAS
- Todo processamento de histórico diário
- Todo processamento de insights

---

## Estrutura Final

```
Webhook (POST /auth/validate)
  ↓
01_Validar_Usuario (Postgres - apenas dados do usuário)
  ↓
organiza_dados (Code - simplificado)
  ↓
Respond to Webhook
```

**Nós Desabilitados (manter desabilitados):**
- Big_five
- roda_emocoes
- Humor
- 04_Sabotador
- Gameficacao
- Proxima_Jornada
- 07_Analise_PANAS
- 08_Historico_Diario
- 09_Insights
- Merge

---

## Payload de Resposta

**Antes:**
```json
{
  "response": {
    "success": true,
    "humor": {...},
    "user": {...},
    "perfil_big_five": {...},
    "gamificacao": {...},
    "proxima_jornada": {...},
    "sabotador": {...},
    "roda_emocoes": {...},
    "panas": {...},
    "historico_diario": [...],
    "historico_resumo": {...},
    "insights": [...],
    "timestamp": "..."
  }
}
```

**Depois:**
```json
{
  "response": {
    "success": true,
    "user": {
      "id": "uuid",
      "nome": "Aldo",
      "nome_preferencia": "Aldo",
      "cronotipo_detectado": "matutino"
    }
  }
}
```

**Em caso de erro:**
```json
{
  "response": {
    "success": false,
    "error": "Token inválido ou expirado"
  }
}
```

---

## Impacto

- **Redução de payload:** ~95-98% (de ~50-100KB para ~200-500 bytes)
- **Performance:** Autenticação instantânea
- **Manutenibilidade:** Código muito mais simples
- **Clareza:** Apenas dados essenciais

---

**Status:** ⏳ Aguardando implementação no n8n

