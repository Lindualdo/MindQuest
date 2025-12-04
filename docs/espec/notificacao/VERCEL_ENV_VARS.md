# Variáveis de Ambiente VAPID - Vercel

## Chaves VAPID Geradas

**Data:** $(date)

### Variáveis para Configurar na Vercel

Acesse: **Settings → Environment Variables** no dashboard da Vercel

---

### 1. VAPID_PUBLIC_KEY

```
BDFvqrQTPxtRfsh79LQ5DsVsDUtAOOulOwRE1BKMkPklnYQjqbbftZjFemkyJDxf5r8krPpGJL1TNBMTe9i7wiE
```

**Configurar em:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

### 2. VAPID_PRIVATE_KEY

```
a3SPu6YIaQzf2fVHfvU-QYCNZn0e0nBqMcQejHFH7WU
```

**Configurar em:**
- ✅ Production
- ✅ Preview
- ✅ Development

⚠️ **IMPORTANTE:** Mantenha esta chave privada segura. Não compartilhe publicamente.

---

## Passo a Passo na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: `mind-quest-orcin`
3. Vá em: **Settings → Environment Variables**
4. Clique em: **Add New**
5. Configure cada variável:
   - **Key:** `VAPID_PUBLIC_KEY`
   - **Value:** `BDFvqrQTPxtRfsh79LQ5DsVsDUtAOOulOwRE1BKMkPklnYQjqbbftZjFemkyJDxf5r8krPpGJL1TNBMTe9i7wiE`
   - **Environments:** Marque Production, Preview e Development
   - Clique em **Save**
6. Repita para `VAPID_PRIVATE_KEY`
7. **Após configurar:** Faça um redeploy ou push novo commit

---

## Verificar Configuração

Após configurar e fazer deploy, teste:
```bash
node scripts/test-push-api.mjs
```

A resposta deve mostrar:
```json
{
  "debug": {
    "hasEnvVars": true,
    "envVars": {
      "publicPresent": true,
      "privatePresent": true
    }
  }
}
```

