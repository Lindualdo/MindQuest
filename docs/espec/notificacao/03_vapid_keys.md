# Notificações - Configuração VAPID Keys

**Data:** 2025-12-03
**Última atualização:** 2025-12-03

## Objetivo

Configurar chaves VAPID (Voluntary Application Server Identification) para autenticar o servidor ao enviar notificações push via Web Push API.

## O que são VAPID Keys

- **Chave Pública:** Usada no frontend para criar subscriptions
- **Chave Privada:** Usada no servidor/n8n para assinar e enviar notificações
- **Padrão:** W3C Web Push API

## Como Gerar

### Script Automático

```bash
node scripts/generate-vapid-keys.js
```

O script:
- Instala `web-push` se necessário
- Gera par de chaves VAPID
- Adiciona `VITE_VAPID_PUBLIC_KEY` ao `.env.local`
- Salva ambas as chaves em `config/vapid-keys.json`

### Manual

```bash
npm install web-push --save-dev
npx web-push generate-vapid-keys
```

## Configuração

### Frontend

**Arquivo:** `.env.local`
```env
VITE_VAPID_PUBLIC_KEY=BDy2V8kyKKRSkqmIqB47uoJyiof5xCr_CA5DZ3PGPVWKg9c8pHFUh1YDUv7YNBsngVwHRqbwYOX6VO3ln7a6vfA
```

**Uso:** Carregado automaticamente em `src/utils/pushNotifications.ts`

### Backend (n8n)

**Arquivo:** `config/vapid-keys.json`
```json
{
  "publicKey": "...",
  "privateKey": "...",
  "generatedAt": "2025-12-03T...",
  "note": "Mantenha a chave privada segura!"
}
```

**Uso no n8n:**
- Criar variável de ambiente `VAPID_PRIVATE_KEY`
- Ou usar Code node para ler do arquivo
- Ou passar diretamente no código de envio

## Segurança

- ✅ **Chave pública:** Pode ser versionada (`.env.local`)
- ❌ **Chave privada:** NUNCA commitar (`config/vapid-keys.json` no `.gitignore`)
- 🔒 **Acesso:** Apenas servidor/n8n precisa da chave privada

## Próximos Passos

1. ✅ Chaves geradas
2. ⏳ Configurar variável no n8n
3. ⏳ Implementar envio de push no workflow

