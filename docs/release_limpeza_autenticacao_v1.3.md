# Release: Limpeza de Autenticação v1.3

**Data:** 2025-01-22  
**Versão:** 1.3.2  
**Status:** ✅ Concluído

---

## Objetivo

Simplificar o payload de autenticação removendo todos os dados legados e mantendo apenas informações essenciais do usuário, reduzindo o tamanho da resposta de ~50-100KB para ~200-500 bytes.

---

## Alterações Realizadas

### 1. Frontend - `authService.ts`

**Interface `AuthResponse` simplificada:**
```typescript
interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    nome: string;
    nome_preferencia: string;
    cronotipo_detectado: string | null;
  };
  error?: string;
}
```

**Campos removidos:**
- `whatsapp_numero`
- `status_onboarding`
- `criado_em`

**Método `validateToken()` atualizado:**
- Retorna apenas dados do usuário
- Remove processamento de dados legados

---

### 2. Frontend - `apiService.ts`

**Removido:**
- Interface `DashboardApiResponse`
- Método `getDashboardData()`
- Método `refreshDashboardData()`
- Método `extractDashboardPayload()`
- Método `validateTokenAndGetData()`

**Motivo:** Dados agora são carregados via APIs dedicadas após autenticação.

---

### 3. Frontend - `useStore.ts`

**Removido:**
- Ação `loadDashboardData()`

**Atualizado:**
- `initializeAuth()`: carrega cards individuais após autenticação
- `refreshData()`: recarrega cards individuais diretamente

**Cards carregados individualmente:**
- QuestSnapshot
- PanoramaCard
- ConversasCard
- JornadaCard
- RodaEmocoes

---

### 4. Frontend - `dataAdapter.ts`

**Removido:**
- Método `convertApiToDashboard()`
- Processamento de dados legados:
  - `proxima_jornada`
  - Gamificação (xp_total, nivel_atual, conquistas, etc.)
  - Sabotador (total_deteccoes, intensidade_media, total_conversas)
  - Histórico diário
  - Emoções/PANAS

**Motivo:** Dados agora vêm de APIs dedicadas.

---

### 5. n8n - Webhook de Autenticação

**Workflow:** `webhook_app_authentication`  
**ID:** `r0CuG6F3S1TR8ohs`

#### Nó `01_Validar_Usuario` (Postgres)

**Query SQL simplificada:**
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

**Campos removidos:**
- `whatsapp_numero`
- `status_onboarding`
- `criado_em`
- `token_expira_em`

#### Nó `organiza_dados` (Code)

**Código JavaScript simplificado:**
- Remove todo processamento de dados legados
- Retorna apenas dados do usuário
- Validação de token mantida
- `mode: "runOnceForAllItems"` configurado

**Dados removidos do processamento:**
- Perfil Big Five
- Gamificação
- Próxima Jornada
- Sabotador
- Humor
- Emoções (roda_emocoes)
- PANAS
- Histórico diário
- Insights

---

## Estrutura de Resposta

### Antes (Legado)
```json
{
  "success": true,
  "user": { ... },
  "perfil_big_five": { ... },
  "gamificacao": { ... },
  "proxima_jornada": { ... },
  "sabotador": { ... },
  "humor": { ... },
  "roda_emocoes": { ... },
  "panas": { ... },
  "historico_diario": [ ... ],
  "historico_resumo": { ... },
  "insights": [ ... ],
  "timestamp": "..."
}
```
**Tamanho:** ~50-100KB

### Depois (v1.3)
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
**Tamanho:** ~200-500 bytes

---

## APIs Dedicadas (Carregamento Pós-Autenticação)

Dados removidos do authentication são carregados via APIs separadas:

- **QuestSnapshot:** `/webhook/quests?usuario_id={id}`
- **Emoções:** `/webhook/card/emocoes?user_id={id}`
- **Conversas:** `/webhook/card/conversas?user_id={id}`
- **Jornada:** `/webhook/card/jornada?user_id={id}`
- **Roda Emoções:** `/webhook/roda/emocoes?user_id={id}`
- **Insight:** `/webhook/card/insight?user_id={id}`
- **Progresso Semanal:** `/webhook/progresso-semanal?user_id={id}`

---

## Arquivos Modificados

### Frontend
- `src/services/authService.ts`
- `src/services/apiService.ts`
- `src/store/useStore.ts`
- `src/utils/dataAdapter.ts`

### n8n
- `backups/n8n/webhook_app_authentication.json`

### Documentação
- `docs/analise_dados_autenticacao_v1.3.md`
- `docs/limpeza_autenticacao_v1.3.md`
- `docs/apis_separadas_v1.3.md`
- `docs/resumo_limpeza_autenticacao.md`
- `docs/simplificacao_webhook_auth.md`
- `docs/atualizacao_n8n_auth_manual.md`
- `docs/resumo_atualizacao_n8n.md`

### Scripts
- `scripts/update-auth-workflow.mjs`

---

## Testes Realizados

✅ **Autenticação funcionando:**
- URL testada: `http://localhost:5173/app/auth?token=...`
- Sistema carrega corretamente
- Dashboard exibido
- Cards carregados via APIs separadas
- Navegação funcionando

✅ **Workflow n8n atualizado:**
- Query SQL simplificada
- Código JavaScript simplificado
- Backup local atualizado
- Payload reduzido conforme esperado

---

## Impacto

### Performance
- **Redução de payload:** ~99% (de 50-100KB para 200-500 bytes)
- **Tempo de resposta:** Redução significativa no tempo de autenticação
- **Uso de banda:** Redução drástica no consumo de dados

### Arquitetura
- **Separação de responsabilidades:** Authentication apenas valida usuário
- **APIs dedicadas:** Dados carregados sob demanda
- **Manutenibilidade:** Código mais simples e focado

### Compatibilidade
- **Frontend v1.3:** Totalmente compatível
- **APIs dedicadas:** Funcionando corretamente
- **Legado:** Removido completamente

---

## Próximos Passos

1. ✅ Autenticação simplificada
2. ✅ Frontend atualizado
3. ✅ n8n workflow atualizado
4. ✅ Backup local atualizado
5. ✅ Documentação criada
6. ✅ Testes realizados

**Status:** Release concluída e funcionando.

---

## Notas Técnicas

- **n8n workflow:** Atualizado via script ou manualmente conforme `docs/atualizacao_n8n_auth_manual.md`
- **Backup local:** `backups/n8n/webhook_app_authentication.json` reflete as alterações
- **Script de atualização:** `scripts/update-auth-workflow.mjs` disponível para uso futuro

---

**Release concluída com sucesso.** ✅

