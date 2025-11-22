# Resumo: Atualização do Webhook de Autenticação

**Status:** ⏳ Aguardando atualização no n8n

---

## Alterações Necessárias

### 1. Nó `01_Validar_Usuario` (Postgres)
- **Query:** Remover campos `whatsapp_numero`, `status_onboarding`, `criado_em`, `token_expira_em`
- **Manter apenas:** `id`, `nome`, `nome_preferencia`, `cronotipo_detectado`

### 2. Nó `organiza_dados` (Code)
- **Substituir código completo** por versão simplificada que retorna apenas `user`

---

## Script Pronto

**Arquivo:** `scripts/update-auth-workflow.mjs`

**Uso:**
```bash
export N8N_API_KEY="sua-api-key"
node scripts/update-auth-workflow.mjs
```

---

## Teste de Autenticação

**URL testada:** `http://localhost:5173/app/auth?token=...`

**Resultado:** ✅ Autenticação funcionando
- Sistema carrega corretamente
- Dashboard exibido
- Cards carregados via APIs separadas

**Observação:** Payload atual ainda pode conter dados legados (precisa atualizar workflow no n8n)

---

**Próximo passo:** Atualizar workflow no n8n usando script ou manualmente conforme `docs/atualizacao_n8n_auth_manual.md`

