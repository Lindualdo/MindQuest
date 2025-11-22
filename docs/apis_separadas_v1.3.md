# APIs Separadas - v1.3.2

**Data:** 2024-11-22  
**Objetivo:** Documentar APIs que devem ser criadas separadamente da autenticação

---

## 📋 Resumo Executivo

Dados que **NÃO são do usuário** e devem ser movidos para **APIs separadas**:

1. **Perfil Big Five** → `/perfil`
2. **Sabotador** → `/sabotador`
3. **Distribuição Emoções** → `/emocoes/distribuicao`
4. **PANAS** → `/emocoes/panas`
5. **Histórico Diário** → `/historico/diario`
6. **Insights** → `/insights`
7. **Gamificação** → `/gamificacao` (avaliar necessidade)

---

## 🔌 Especificação das APIs

### 1. GET `/perfil`
**Descrição:** Retorna perfil Big Five do usuário

**Request:**
```http
GET /webhook/perfil?token={token}
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
- Carregar via `loadPanoramaCard()` ou nova função `loadPerfil()`

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

### 3. GET `/emocoes/distribuicao`
**Descrição:** Retorna distribuição das 8 emoções primárias

**Request:**
```http
GET /webhook/emocoes/distribuicao?token={token}
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "distribuicao_emocoes": {
    "alegria": 25,
    "confianca": 20,
    "medo": 10,
    "surpresa": 15,
    "tristeza": 8,
    "angustia": 5,
    "raiva": 12,
    "expectativa": 5
  }
}
```

**Uso no Frontend:**
- `DashPerfilPage` → EmotionWheel
- Carregar via `loadRodaEmocoes()` (já existe)

---

### 4. GET `/emocoes/panas`
**Descrição:** Retorna análise PANAS (emoções positivas/negativas/neutras)

**Request:**
```http
GET /webhook/emocoes/panas?token={token}
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "panas": {
    "positivas": 45,
    "negativas": 20,
    "neutras": 35,
    "total": 100,
    "percentual_positivas": 45,
    "percentual_negativas": 20,
    "percentual_neutras": 35
  }
}
```

**Uso no Frontend:**
- `DashPerfilPage` → CardPerfilBigFive
- Carregar via `loadPanoramaCard()` (já inclui PANAS)

---

### 5. GET `/historico/diario`
**Descrição:** Retorna histórico de check-ins diários

**Request:**
```http
GET /webhook/historico/diario?token={token}&periodo=semana
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "historico_diario": [
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
- Carregar via `loadPanoramaCard()` ou nova função `loadHistoricoDiario()`

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

### 7. GET `/gamificacao` - ⚠️ AVALIAR
**Descrição:** Retorna dados de gamificação (se ainda necessário)

**Request:**
```http
GET /webhook/gamificacao?token={token}
```

**Response:**
```json
{
  "success": true,
  "usuario_id": "uuid",
  "gamificacao": {
    "streak_conversas_dias": 5
  }
}
```

**Uso no Frontend:**
- ⚠️ **Verificar se ainda é usado na v1.3**
- Na v1.3 não exibimos níveis/jornada
- Streak pode ser usado indiretamente

**Decisão:** Avaliar se ainda é necessário ou pode ser removido completamente.

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

