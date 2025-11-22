# Resumo: Limpeza de Autenticação - v1.3.2

**Data:** 2024-11-22  
**Status:** ✅ Análise concluída, aguardando implementação

---

## ✅ O Que Foi Feito

### 1. Análise Completa
- ✅ Identificados todos os dados recebidos na autenticação
- ✅ Verificado uso de cada campo na v1.3
- ✅ Documentado em `analise_dados_autenticacao_v1.3.md`

### 2. Limpeza da Interface de Autenticação
- ✅ Atualizado `AuthResponse` para incluir apenas:
  - `id` (obrigatório)
  - `nome` (obrigatório)
  - `nome_preferencia` (obrigatório)
  - `cronotipo_detectado` (obrigatório)
- ✅ Removido `status_onboarding` (não usado)

### 3. Documentação de APIs Separadas
- ✅ Criado `apis_separadas_v1.3.md` com especificação de cada API
- ✅ Criado `limpeza_autenticacao_v1.3.md` com plano de migração

---

## 📋 Dados do Usuário (Manter na Autenticação)

```typescript
{
  id: string;                       // ✅ USADO - todas as chamadas
  nome: string;                     // ✅ USADO - fallback exibição
  nome_preferencia: string;         // ✅ USADO - exibição em headers
  cronotipo_detectado: string | null; // ✅ USADO - DashPerfilPage
}
```

**Total:** 4 campos essenciais

---

## 📋 Dados para APIs Separadas (Resumo)

### 1. `/perfil` → Perfil Big Five
- **Campos:** openness, conscientiousness, extraversion, agreeableness, neuroticism, confiabilidade, perfil_primario, perfil_secundario
- **Uso:** DashPerfilPage
- **Prioridade:** Alta

### 2. `/sabotador` → Sabotador Ativo
- **Campos:** id, nome, emoji, apelido_personalizado, contexto_principal, insight_atual, contramedida_ativa
- **Uso:** SabotadorDetailPageV13, CardSabotadorAtivo
- **Prioridade:** Alta

### 3. `/emocoes/distribuicao` → 8 Emoções
- **Campos:** alegria, confianca, medo, surpresa, tristeza, angustia, raiva, expectativa
- **Uso:** DashPerfilPage (EmotionWheel)
- **Prioridade:** Alta

### 4. `/emocoes/panas` → Análise PANAS
- **Campos:** positivas, negativas, neutras, percentuais
- **Uso:** DashPerfilPage (CardPerfilBigFive)
- **Prioridade:** Alta

### 5. `/historico/diario` → Check-ins
- **Campos:** array de check-ins (data, humor, emocao, emoji, energia, qualidade)
- **Uso:** HumorHistoryPageV13, HomeV1_3, checkins_historico
- **Prioridade:** Alta

### 6. `/insights` → Insights
- **Campos:** array de insights (id, tipo, categoria, titulo, descricao, icone, prioridade, data_criacao)
- **Uso:** InsightsDashboardPageV13, InsightDetailPageV13, CardInsightUltimaConversa
- **Prioridade:** Alta

### 7. `/gamificacao` → Gamificação
- **Campos:** streak_conversas_dias (se ainda usado)
- **Uso:** ⚠️ Verificar se ainda é necessário
- **Prioridade:** Baixa (avaliar necessidade)

---

## ❌ Dados Removidos (Não Usados)

### Do `user`:
- ❌ `whatsapp_numero`
- ❌ `status_onboarding`
- ❌ `criado_em`

### Do `gamificacao`:
- ❌ `xp_total`, `xp_proximo_nivel`, `nivel_atual`, `titulo_nivel`
- ❌ `quest_diaria_*` (todos)
- ❌ `conquistas_desbloqueadas`, `conquistas_proximas`
- ❌ `total_xp_ganho_hoje`, `ultima_conquista_*`
- ❌ `streak_protecao_*`, `melhor_streak`
- ❌ `total_reflexoes`, `criado_em`

### Do `sabotador`:
- ❌ `total_deteccoes`, `intensidade_media`, `total_conversas`

### Objeto Completo:
- ❌ `proxima_jornada` (todo o objeto)

---

## 📊 Impacto Esperado

### Redução de Payload
- **Antes:** ~50-100KB (todos os dados)
- **Depois:** ~1-2KB (apenas usuário)
- **Redução:** ~95-98%

### Performance
- ✅ Autenticação instantânea
- ✅ Carregamento sob demanda
- ✅ Cache por tipo de dado

---

## 🔄 Próximos Passos

### Backend (n8n)
1. ⏳ Atualizar `/auth/validate` para retornar apenas usuário
2. ⏳ Criar endpoints separados para cada tipo de dado
3. ⏳ Manter compatibilidade temporária durante migração

### Frontend
1. ⏳ Atualizar `useStore` para não carregar tudo na autenticação
2. ⏳ Criar funções de carregamento sob demanda
3. ⏳ Implementar cache local
4. ⏳ Atualizar páginas para carregar dados quando necessário

---

## 📝 Documentos Criados

1. `analise_dados_autenticacao_v1.3.md` - Análise completa dos dados
2. `limpeza_autenticacao_v1.3.md` - Plano de limpeza e migração
3. `apis_separadas_v1.3.md` - Especificação das APIs separadas
4. `resumo_limpeza_autenticacao.md` - Este resumo

---

**Status:** ✅ Análise concluída, pronto para implementação

