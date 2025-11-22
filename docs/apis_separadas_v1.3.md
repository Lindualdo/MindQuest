# APIs Separadas - v1.3.2

**Data:** 2024-11-22  
**Objetivo:** Documentar APIs que devem ser criadas separadamente da autenticação

---

## 📋 Resumo Executivo

### Status das APIs

1. ✅ **Perfil Big Five** → `/perfil` - **JÁ EXISTE** (`getPerfilBigFive()`)
2. ⚠️ **Sabotador** → Verificar se tem API dedicada ou vem via outro card
3. ✅ **Emoções (distribuição + PANAS + humor)** → `/card/emocoes` - **JÁ EXISTE** (`getPanoramaCard()`)
4. ✅ **Histórico Diário** → `/humor-historico` - **JÁ EXISTE** (`getHumorHistorico()`)
5. ⚠️ **Insights** → `/card/insight` - **JÁ EXISTE** (`getInsightCard()`) - verificar se precisa de endpoint separado
6. ❌ **Gamificação** → **NÃO USADO MAIS** na v1.3

### Conclusão

**Apenas Sabotador precisa ser verificado** - todos os outros dados já têm APIs dedicadas funcionando.

---

## 🔌 Especificação das APIs

### 1. GET `/perfil` ✅ **JÁ EXISTE**
**Descrição:** Retorna perfil Big Five do usuário

**Status:** ✅ API já existe e está funcionando

**Request:**
```http
GET /webhook/perfil?user_id={userId}
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "perfil_big_five": {
    "openness": "75",
    "conscientiousness": "82",
    "extraversion": "60",
    "agreeableness": "70",
    "neuroticism": "45",
    "confiabilidade": "85",
    "perfil_primario": "disciplinado",
    "perfil_secundario": "perfeccionista"
  }
}
```

**Uso no Frontend:**
- `DashPerfilPage` → CardPerfilBigFive
- Carregar via `getPerfilBigFive()` (já existe em `apiService.ts`)

---

### 2. GET `/sabotador`
**Descrição:** Retorna sabotador ativo do usuário

**Request:**
```http
GET /webhook/sabotador?token={token}
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "sabotador": {
    "id": "controlador",
    "nome": "Controlador",
    "emoji": "👑",
    "apelido_personalizado": "Rei do Controle",
    "contexto_principal": "Tendência a querer controlar situações...",
    "insight_atual": "Você tem demonstrado necessidade de controle...",
    "contramedida_ativa": "Pratique delegar pequenas tarefas..."
  }
}
```

**Uso no Frontend:**
- `SabotadorDetailPageV13`
- `CardSabotadorAtivo` (HomeV1_3)
- Carregar via nova função `loadSabotador()`

---

### 3. GET `/emocoes` ✅ **JÁ EXISTE**
**Descrição:** Retorna distribuição das 8 emoções primárias + análise PANAS + humor

**Status:** ✅ API já existe e está funcionando

**Request:**
```http
GET /webhook/card/emocoes?user_id={userId}
```

**Response:**
```json
{
  "success": true,
  "card_panorama_emocional": {
    "distribuicao_emocoes": {
      "alegria": 25,
      "confianca": 20,
      "medo": 10,
      "surpresa": 15,
      "tristeza": 8,
      "angustia": 5,
      "raiva": 12,
      "expectativa": 5
    },
    "panas": {
      "positivas": 45,
      "negativas": 20,
      "neutras": 35,
      "total": 100,
      "percentual_positivas": 45,
      "percentual_negativas": 20,
      "percentual_neutras": 35
    },
    "humor": { ... }
  }
}
```

**Uso no Frontend:**
- `DashPerfilPage` → EmotionWheel + CardPerfilBigFive
- Carregar via `getPanoramaCard()` (já existe em `apiService.ts`)

---

### 5. GET `/historico/diario` ✅ **JÁ EXISTE**
**Descrição:** Retorna histórico de check-ins diários

**Status:** ✅ API já existe e está funcionando

**Request:**
```http
GET /webhook/humor-historico?user_id={userId}
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "serie": [...],
  "periodo": {...},
  "detalhes": [
    {
      "data": "2024-11-22",
      "humor": 7,
      "emocao": "alegria",
      "emoji": "😊",
      "energia": 8,
      "qualidade": 9
    }
  ]
}
```

**Uso no Frontend:**
- `HumorHistoryPageV13`
- `HomeV1_3` → CardMoodEnergy
- `checkins_historico` (Dashboard)
- Carregar via `getHumorHistorico()` (já existe em `apiService.ts`)

---

### 6. GET `/insights`
**Descrição:** Retorna lista de insights do usuário

**Request:**
```http
GET /webhook/insights?token={token}
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "insights": [
    {
      "id": "uuid",
      "tipo": "alerta",
      "categoria": "comportamental",
      "titulo": "Padrão detectado",
      "descricao": "Você tem demonstrado...",
      "icone": "⚠️",
      "prioridade": "alta",
      "data_criacao": "2024-11-22T10:00:00Z"
    }
  ]
}
```

**Uso no Frontend:**
- `InsightsDashboardPageV13`
- `InsightDetailPageV13`
- `CardInsightUltimaConversa` (HomeV1_3)
- Carregar via `loadInsightCard()` ou nova função `loadInsights()`

---

### 7. GET `/gamificacao` ❌ **NÃO USADO MAIS**
**Descrição:** Dados de gamificação não são mais usados na v1.3

**Status:** ❌ Removido - não necessário na v1.3

**Decisão:** Não criar API - v1.3 não usa gamificação (níveis, jornada, conquistas)

---

## 🔄 Migração Proposta

### Fase 1: Autenticação Limpa
1. ✅ Atualizar `authService` para retornar apenas usuário
2. ✅ Remover `getDashboardData()` da autenticação
3. ✅ Atualizar `useStore` para não carregar tudo na autenticação

### Fase 2: APIs Separadas (Backend)
1. ⏳ Criar endpoints separados no n8n
2. ⏳ Migrar lógica de cada tipo de dado
3. ⏳ Manter compatibilidade temporária

### Fase 3: Frontend (Carregamento Sob Demanda)
1. ⏳ Atualizar páginas para carregar dados sob demanda
2. ⏳ Implementar cache local
3. ⏳ Gerenciar loading states por página

---

## 📊 Benefícios

- ✅ **Autenticação rápida:** ~1-2KB vs ~50-100KB
- ✅ **Carregamento sob demanda:** Apenas o necessário
- ✅ **Cache inteligente:** Dados carregados uma vez
- ✅ **Manutenibilidade:** APIs específicas e testáveis
- ✅ **Escalabilidade:** Fácil adicionar novos tipos de dados

---

**Status:** ⏳ Aguardando implementação

