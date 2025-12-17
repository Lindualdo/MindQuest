# Debug VAPID Keys na Vercel

## Problema Identificado

A API `/api/send-push` está retornando:
```json
{
  "success": false,
  "error": "VAPID keys não configuradas",
  "debug": {
    "hasEnvVars": false,
    "envVars": {
      "publicPresent": false,
      "privatePresent": false
    }
  }
}
```

## Checklist de Verificação na Vercel

### 1. Verificar Projeto Correto
- Dashboard: https://vercel.com/dashboard
- Projeto: `mind-quest-orcin` (ou nome correto)
- Settings → Environment Variables

### 2. Verificar Variáveis Configuradas

As seguintes variáveis devem existir:

| Variável | Valor Esperado (início) |
|----------|-------------------------|
| `VAPID_PUBLIC_KEY` | `BDy2V8kyKKRSkqmIqB47uoJy...` |
| `VAPID_PRIVATE_KEY` | `vkKusG-_kYA6kn9NdtWInpeg...` |

### 3. Verificar Ambientes

Cada variável deve estar configurada para:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

### 4. Forçar Redeploy

Após configurar variáveis:
1. Settings → Environment Variables → Salvar
2. Deployments → Último deploy → Redeploy (se necessário)
3. Ou fazer commit + push para trigger automático

### 5. Verificar Nomes Exatos

Os nomes devem ser **EXATAMENTE**:
- `VAPID_PUBLIC_KEY` (não `VAPID_PUBLIC`, não `VAPIDPUBLICKEY`)
- `VAPID_PRIVATE_KEY` (não `VAPID_PRIVATE`, não `VAPIDPRIVATEKEY`)

## Solução Alternativa: Variáveis no Código (Temporário)

Se as variáveis não funcionarem, podemos:
1. Usar arquivo `config/vapid-keys.json` (não versionado)
2. Carregar via import em runtime

⚠️ **NÃO RECOMENDADO para produção** - apenas para debug.

## Teste Manual

Após configurar, testar:
```bash
node scripts/test-push-api.mjs
```

Verificar resposta do debug para confirmar carregamento.

