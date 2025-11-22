# Limpeza de Autenticação - v1.3.2

**Data:** 2024-11-22  
**Objetivo:** Autenticação deve retornar apenas dados do usuário (campos usados)

---

## ✅ Campos de Usuário USADOS na v1.3

### Campos Essenciais (Manter)
```typescript
{
  id: string;                       // ✅ USADO - todas as chamadas de API
  nome: string;                     // ✅ USADO - exibição (fallback)
  nome_preferencia: string;         // ✅ USADO - exibição em headers/páginas
  cronotipo_detectado: string;      // ✅ USADO - DashPerfilPage
}
```

### Campos NÃO USADOS (Remover)
```typescript
{
  whatsapp_numero: string;          // ❌ REMOVER
  status_onboarding: string;         // ❌ REMOVER
  criado_em: string;                 // ❌ REMOVER
}
```

---

## ❌ Dados NÃO do Usuário (Remover da Autenticação)

Todos estes dados devem ir para **APIs separadas**:

### 1. **Perfil Big Five** → API `/perfil`
```typescript
perfil_big_five: {
  openness, conscientiousness, extraversion, 
  agreeableness, neuroticism, confiabilidade,
  perfil_primario, perfil_secundario
}
```
**Uso:** DashPerfilPage (CardPerfilBigFive)

### 2. **Sabotador** → API `/sabotador`
```typescript
sabotador: {
  id, nome, emoji, apelido_personalizado,
  contexto_principal, insight_atual, contramedida_ativa
}
```
**Uso:** SabotadorDetailPageV13, CardSabotadorAtivo

### 3. **Distribuição Emoções** → API `/emocoes/distribuicao`
```typescript
distribuicao_emocoes: {
  alegria, confianca, medo, surpresa,
  tristeza, angustia, raiva, expectativa
}
```
**Uso:** DashPerfilPage (EmotionWheel)

### 4. **PANAS** → API `/emocoes/panas`
```typescript
panas: {
  positivas, negativas, neutras, total,
  percentual_positivas, percentual_negativas, percentual_neutras
}
```
**Uso:** DashPerfilPage (CardPerfilBigFive)

### 5. **Histórico Diário** → API `/historico/diario`
```typescript
historico_diario: Array<{
  data, humor, emocao, emoji, energia, qualidade
}>
```
**Uso:** HumorHistoryPageV13, HomeV1_3 (CardMoodEnergy), checkins_historico

### 6. **Insights** → API `/insights`
```typescript
insights: Array<{
  id, tipo, categoria, titulo, descricao,
  icone, prioridade, data_criacao
}>
```
**Uso:** InsightsDashboardPageV13, InsightDetailPageV13, CardInsightUltimaConversa

### 7. **Gamificação** → API `/gamificacao` (ou remover se não usado)
```typescript
gamificacao: {
  streak_conversas_dias  // ⚠️ Verificar se ainda é usado
}
```
**Nota:** Na v1.3 não exibimos níveis/jornada. Verificar se streak é usado.

### 8. **Próxima Jornada** → ❌ REMOVER COMPLETO
```typescript
proxima_jornada: { ... }  // ❌ Não usado na v1.3
```

---

## 📋 Resumo para APIs Separadas

### 1. API `/perfil` (GET)
**Dados:**
- `perfil_big_five` (openness, conscientiousness, extraversion, agreeableness, neuroticism, confiabilidade, perfil_primario, perfil_secundario)

**Uso:** DashPerfilPage (CardPerfilBigFive)  
**Carregamento:** Sob demanda quando acessa DashPerfilPage

---

### 2. API `/sabotador` (GET)
**Dados:**
- `sabotador` (id, nome, emoji, apelido_personalizado, contexto_principal, insight_atual, contramedida_ativa)

**Uso:** SabotadorDetailPageV13, CardSabotadorAtivo (HomeV1_3)  
**Carregamento:** Sob demanda quando acessa páginas relacionadas

---

### 3. API `/emocoes/distribuicao` (GET)
**Dados:**
- `distribuicao_emocoes` (alegria, confianca, medo, surpresa, tristeza, angustia, raiva, expectativa)

**Uso:** DashPerfilPage (EmotionWheel)  
**Carregamento:** Sob demanda quando acessa DashPerfilPage

---

### 4. API `/emocoes/panas` (GET)
**Dados:**
- `panas` (positivas, negativas, neutras, total, percentual_positivas, percentual_negativas, percentual_neutras)

**Uso:** DashPerfilPage (CardPerfilBigFive)  
**Carregamento:** Sob demanda quando acessa DashPerfilPage

---

### 5. API `/historico/diario` (GET)
**Dados:**
- `historico_diario` (array de check-ins: data, humor, emocao, emoji, energia, qualidade)

**Uso:** HumorHistoryPageV13, HomeV1_3 (CardMoodEnergy), checkins_historico  
**Carregamento:** Sob demanda quando acessa páginas relacionadas

---

### 6. API `/insights` (GET)
**Dados:**
- `insights` (array: id, tipo, categoria, titulo, descricao, icone, prioridade, data_criacao)

**Uso:** InsightsDashboardPageV13, InsightDetailPageV13, CardInsightUltimaConversa (HomeV1_3)  
**Carregamento:** Sob demanda quando acessa páginas relacionadas

---

### 7. API `/gamificacao` (GET) - ⚠️ AVALIAR
**Dados:**
- `streak_conversas_dias` (se ainda usado)

**Uso:** ⚠️ Verificar se ainda é usado na v1.3  
**Carregamento:** Se necessário, sob demanda

**Nota:** Na v1.3 não exibimos níveis/jornada. Verificar se streak é realmente necessário.

---

## 🎯 Nova Interface de Autenticação

### AuthResponse (Simplificado)
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

### DashboardApiResponse (Remover)
❌ **Remover completamente** - não deve existir na autenticação

---

## 📝 Ações Necessárias

### 1. Atualizar `authService.ts`
- ✅ Manter apenas campos de usuário usados
- ❌ Remover `status_onboarding` do AuthResponse

### 2. Atualizar `apiService.ts`
- ❌ Remover `getDashboardData()` da autenticação
- ✅ Criar APIs separadas para cada tipo de dado
- ✅ Manter apenas validação de token na autenticação

### 3. Atualizar `useStore.ts`
- ✅ `initializeAuth()` deve apenas validar token e retornar usuário
- ✅ `loadDashboardData()` deve ser removido ou renomeado
- ✅ Criar funções separadas para carregar cada tipo de dado

### 4. Atualizar `dataAdapter.ts`
- ❌ Remover `convertApiToDashboard()` (não existe mais)
- ✅ Adaptar para processar apenas dados do usuário na autenticação

### 5. Atualizar Backend (n8n)
- ✅ Endpoint `/auth/validate` deve retornar apenas dados do usuário
- ✅ Criar endpoints separados para cada tipo de dado

---

## 🔄 Fluxo Proposto

### Antes (Atual)
```
1. Autenticação → Retorna TUDO (usuário + perfil + sabotador + emoções + insights + ...)
2. Frontend processa tudo de uma vez
```

### Depois (Proposto)
```
1. Autenticação → Retorna apenas USUÁRIO (id, nome, nome_preferencia, cronotipo)
2. Frontend carrega dados sob demanda:
   - /perfil → quando acessa DashPerfilPage
   - /sabotador → quando acessa SabotadorDetailPageV13
   - /emocoes/distribuicao → quando acessa DashPerfilPage
   - /emocoes/panas → quando acessa DashPerfilPage
   - /historico/diario → quando acessa HumorHistoryPageV13
   - /insights → quando acessa InsightsDashboardPageV13
```

---

## 📊 Impacto

### Redução de Payload
- **Antes:** ~50-100KB (todos os dados)
- **Depois:** ~1-2KB (apenas usuário)
- **Redução:** ~95-98%

### Performance
- ✅ Autenticação mais rápida
- ✅ Carregamento sob demanda
- ✅ Cache por tipo de dado

### Manutenibilidade
- ✅ Separação de responsabilidades
- ✅ APIs específicas e testáveis
- ✅ Código mais limpo

---

## ⚠️ Notas Importantes

1. **Backward Compatibility:** Manter compatibilidade temporária durante migração
2. **Cache:** Implementar cache local para dados carregados
3. **Loading States:** Cada página gerencia seu próprio loading
4. **Error Handling:** Tratar erros por API separadamente

---

**Status:** ⏳ Aguardando implementação

