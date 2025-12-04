# Manual: Criação de Novos Endpoints API

**Data:** 2025-12-04

## Arquitetura

O projeto usa um **router consolidado** (`api/[...slug].ts`) para evitar limite de Serverless Functions na Vercel (máx 12 no plano Hobby).

## Como Adicionar um Novo Endpoint

### 1. Registrar no `ENDPOINT_MAP`

```typescript
// api/[...slug].ts - linha ~105
const ENDPOINT_MAP: Record<string, string> = {
  // ... endpoints existentes
  'meu-endpoint': '/meu-endpoint',        // path simples
  'categoria/acao': '/categoria/acao',    // subpath
};
```

### 2. Endpoints GET Simples (passam query params direto)

Adicione ao array `SIMPLE_GET_ENDPOINTS` (~linha 145):
```typescript
const SIMPLE_GET_ENDPOINTS = [
  // ... existentes
  'meu-endpoint',
];
```

### 3. Endpoints com Lógica Customizada

Adicione handler no bloco `if (req.method === 'GET')` ou `if (req.method === 'POST')`:

```typescript
if (endpoint === 'meu-endpoint') {
  const usuarioId = readUsuarioId(req.query); // ou parsedBody para POST
  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'user_id obrigatório' });
    return;
  }
  const url = new URL(remoteEndpoint);
  url.searchParams.set('user_id', usuarioId);
  // adicionar outros params se necessário
  const upstreamResponse = await fetch(url.toString(), {
    method: 'GET', // ou 'POST' com body
    headers: { 'Content-Type': 'application/json' },
  });
  await handleResponse(upstreamResponse, res);
  return;
}
```

## Padrões Obrigatórios

| Item | Padrão |
|------|--------|
| CORS | Já tratado pelo `setCorsHeaders()` |
| OPTIONS | Já tratado globalmente |
| Webhook base | `WEBHOOK_BASE_URL` = `https://mindquest-n8n.cloudfy.live/webhook` |
| Parsing body | Use `parseBody(req.body)` |
| User ID | Use `readUsuarioId(source)` - suporta múltiplos nomes |
| Resposta | Use `handleResponse(upstreamResponse, res)` |

## Teste Local

```bash
npm run dev  # Vite proxy ativo em /api/*
```

Frontend usa `/api/meu-endpoint` → proxy redireciona para n8n webhook.

## Checklist

- [ ] Endpoint registrado no `ENDPOINT_MAP`
- [ ] Handler GET ou POST implementado
- [ ] Validação de parâmetros obrigatórios
- [ ] Testado localmente via `npm run dev`
- [ ] Deploy Vercel validado

