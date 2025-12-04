# API - Referência Rápida

**Data:** 2025-12-04

## Arquitetura

Router consolidado em `api/[...slug].ts` (evita limite de 12 Serverless Functions na Vercel)

## Adicionar Novo Endpoint

### 1. Registrar no ENDPOINT_MAP

```typescript
// api/[...slug].ts - linha ~105
const ENDPOINT_MAP: Record<string, string> = {
  'meu-endpoint': '/meu-endpoint',
  'categoria/acao': '/categoria/acao',
};
```

### 2. GET Simples (query params direto)

```typescript
// Adicionar ao array SIMPLE_GET_ENDPOINTS (~linha 145)
const SIMPLE_GET_ENDPOINTS = [
  'meu-endpoint',
];
```

### 3. Lógica Customizada

```typescript
// Bloco GET ou POST
if (endpoint === 'meu-endpoint') {
  const usuarioId = readUsuarioId(req.query);
  if (!usuarioId) {
    res.status(400).json({ success: false, error: 'user_id obrigatório' });
    return;
  }
  const url = new URL(remoteEndpoint);
  url.searchParams.set('user_id', usuarioId);
  const upstreamResponse = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  await handleResponse(upstreamResponse, res);
  return;
}
```

## Padrões

| Item | Uso |
|------|-----|
| CORS | `setCorsHeaders()` (já tratado) |
| OPTIONS | Já tratado globalmente |
| Webhook base | `WEBHOOK_BASE_URL` |
| Parsing body | `parseBody(req.body)` |
| User ID | `readUsuarioId(source)` |
| Resposta | `handleResponse(upstreamResponse, res)` |

## Teste Local

```bash
npm run dev  # Vite proxy ativo em /api/*
```

Frontend usa `/api/meu-endpoint` → proxy redireciona para n8n webhook

## Extração de Endpoint (Vercel)

Fallback múltiplo:
1. `req.query.slug` (padrão Vercel)
2. Parse de `req.url` se slug não disponível
3. Regex `/api/([^?]+)` como último recurso

**Por quê?** Na Vercel com query params, `req.query.slug` pode não estar disponível

## vercel.json - Regras

**❌ EVITAR** rewrites genéricos:
```json
{
  "source": "/api/(.*)",
  "destination": "/api/$1"
}
```

**✅ OK** rewrites específicos:
```json
{
  "source": "/api/humor-historico",
  "destination": "/api/insights"
}
```

## Debug

Router loga automaticamente:
```typescript
console.log(`[Router] ${req.method} /api/${endpoint}`, { 
  query: req.query, 
  url: req.url 
});
```

**Se endpoint retornar 404:**
1. Ver logs da Vercel
2. Confirmar endpoint no `ENDPOINT_MAP`
3. Verificar rewrites conflitantes

## Diferenças Local vs Produção

| Ambiente | Comportamento |
|----------|---------------|
| Local (dev) | Vite proxy → n8n direto (não passa pelo router) |
| Produção (Vercel) | Router processa todas as rotas `/api/*` |

**Sempre testar em produção** após mudanças

## Checklist

- [ ] Endpoint no `ENDPOINT_MAP`
- [ ] Handler GET ou POST implementado
- [ ] Validação de parâmetros obrigatórios
- [ ] Testado localmente (`npm run dev`)
- [ ] Sem rewrites conflitantes no `vercel.json`
- [ ] Deploy Vercel validado
- [ ] Logs da Vercel verificados

## Documentação Completa

Ver `docs/espec/api/manual_novos_endpoints.md` para detalhes completos.

