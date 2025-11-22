# Análise: Dados Recebidos na Autenticação - v1.3

**Data:** 2024-11-22  
**Versão:** 1.3.2

---

## 📊 Dados Recebidos da API (`getDashboardData`)

### Interface `DashboardApiResponse`

```typescript
{
  user: { ... },                    // ✅ USADO
  proxima_jornada?: { ... },        // ❌ NÃO USADO na v1.3
  perfil_big_five: { ... },         // ✅ USADO
  gamificacao: { ... },             // ⚠️ PARCIALMENTE USADO
  sabotador: { ... },               // ✅ USADO
  distribuicao_emocoes: { ... },    // ✅ USADO
  panas: { ... },                   // ✅ USADO
  historico_diario: [ ... ],        // ✅ USADO
  insights: [ ... ],                // ✅ USADO
  timestamp: string                  // ⚠️ VERIFICAR
}
```

---

## 🔍 Análise Detalhada

### ✅ **DADOS USADOS** (Manter)

#### 1. `user` (Obrigatório)
```typescript
{
  id: string;                       // ✅ USADO em todas as páginas
  nome: string;                      // ✅ USADO (exibição)
  nome_preferencia: string;          // ✅ USADO (exibição)
  whatsapp_numero: string;           // ⚠️ VERIFICAR se usado
  cronotipo_detectado: string;      // ✅ USADO (DashPerfilPage)
  status_onboarding: string;         // ⚠️ VERIFICAR se usado
  criado_em: string;                 // ⚠️ VERIFICAR se usado
}
```

**Uso na v1.3:**
- `id`: usado em todas as chamadas de API
- `nome_preferencia`: usado em headers e exibições
- `cronotipo_detectado`: usado em DashPerfilPage

#### 2. `perfil_big_five` (Obrigatório)
```typescript
{
  openness: string;
  conscientiousness: string;
  extraversion: string;
  agreeableness: string;
  neuroticism: string;
  confiabilidade: string;
  perfil_primario: string;          // ✅ USADO (exibição)
  perfil_secundario: string;        // ⚠️ VERIFICAR
}
```

**Uso na v1.3:**
- `perfil_primario`: usado em DashPerfilPage (CardPerfilBigFive)
- Outros campos: usados para cálculo do perfil

#### 3. `sabotador` (Obrigatório)
```typescript
{
  id: string;                       // ✅ USADO
  nome: string;                     // ✅ USADO
  emoji: string;                    // ✅ USADO
  apelido_personalizado: string;    // ✅ USADO
  total_deteccoes: string;          // ⚠️ VERIFICAR
  contexto_principal?: string;      // ✅ USADO
  insight_atual?: string;           // ✅ USADO
  contramedida_ativa?: string;      // ✅ USADO
  intensidade_media?: string;       // ⚠️ VERIFICAR
  total_conversas?: string;         // ⚠️ VERIFICAR
}
```

**Uso na v1.3:**
- Usado em `SabotadorDetailPageV13`
- Usado em `CardSabotadorAtivo` (HomeV1_3)

#### 4. `distribuicao_emocoes` (Obrigatório)
```typescript
{
  alegria: number;
  confianca: number;
  medo: number;
  surpresa: number;
  tristeza: number;
  angustia: number;
  raiva: number;
  expectativa: number;
}
```

**Uso na v1.3:**
- Usado em `DashPerfilPage` (EmotionWheel)
- Usado em `roda_emocoes` do dashboardData

#### 5. `panas` (Obrigatório)
```typescript
{
  positivas: number;
  negativas: number;
  neutras: number;
  total: number;
  percentual_positivas: number;    // ✅ USADO
  percentual_negativas: number;
  percentual_neutras: number;
}
```

**Uso na v1.3:**
- Usado em `DashPerfilPage` (CardPerfilBigFive)
- Usado em `distribuicao_panas` do dashboardData

#### 6. `historico_diario` (Obrigatório)
```typescript
Array<{
  data: string;
  humor: number;
  emocao: string;
  emoji: string;
  energia: number;
  qualidade: number;
}>
```

**Uso na v1.3:**
- Usado em `checkins_historico` do dashboardData
- Usado em `HumorHistoryPageV13`
- Usado em `HomeV1_3` (CardMoodEnergy)

#### 7. `insights` (Obrigatório)
```typescript
Array<{
  id: string;
  tipo: string;
  categoria: string;
  titulo: string;
  descricao: string;
  icone: string;
  prioridade: string;
  data_criacao: string;
}>
```

**Uso na v1.3:**
- Usado em `InsightsDashboardPageV13`
- Usado em `InsightDetailPageV13`
- Usado em `CardInsightUltimaConversa` (HomeV1_3)

---

### ⚠️ **DADOS PARCIALMENTE USADOS** (Revisar)

#### 8. `gamificacao` (Revisar)
```typescript
{
  xp_total: number;                 // ❌ NÃO USADO na v1.3 (usa pontos semanais)
  xp_proximo_nivel: number;         // ❌ NÃO USADO na v1.3
  nivel_atual: number;              // ❌ NÃO USADO na v1.3 (não exibe níveis)
  titulo_nivel?: string;            // ❌ NÃO USADO na v1.3
  streak_conversas_dias: number;    // ✅ USADO (streak)
  streak_protecao_usada?: boolean; // ⚠️ VERIFICAR
  streak_protecao_resetada_em?: string; // ⚠️ VERIFICAR
  ultima_conversa_data?: string;   // ⚠️ VERIFICAR
  melhor_streak?: number;           // ⚠️ VERIFICAR
  conquistas_desbloqueadas?: Array; // ❌ NÃO USADO na v1.3
  conquistas_proximas?: Array;      // ❌ NÃO USADO na v1.3
  quest_diaria_status: string;      // ⚠️ VERIFICAR (pode ser usado em quests)
  quest_diaria_progresso: number;  // ⚠️ VERIFICAR
  quest_diaria_descricao?: string; // ⚠️ VERIFICAR
  quest_diaria_data?: string;      // ⚠️ VERIFICAR
  quest_streak_dias?: number;       // ⚠️ VERIFICAR
  total_conversas?: number;        // ⚠️ VERIFICAR
  total_reflexoes?: number;        // ⚠️ VERIFICAR
  total_xp_ganho_hoje?: number;     // ❌ NÃO USADO na v1.3
  ultima_conquista_id?: string;    // ❌ NÃO USADO na v1.3
  ultima_conquista_data?: string;  // ❌ NÃO USADO na v1.3
  ultima_atualizacao?: string;     // ⚠️ VERIFICAR
  criado_em?: string;              // ⚠️ VERIFICAR
}
```

**Análise:**
- Na v1.3, **não exibimos níveis/jornada** (conforme especificação)
- Usamos apenas **pontos semanais** (20% dos valores de XP)
- Campos de **conquistas** não são usados
- Campos de **nivel/jornada** não são usados
- **Streak** pode ser usado (verificar)

**Recomendação:** Remover campos não usados ou manter apenas o necessário.

---

### ❌ **DADOS NÃO USADOS** (Remover)

#### 9. `proxima_jornada` (Completo - NÃO USADO)
```typescript
{
  xp_total?: number;
  nivel_atual?: number;
  titulo_atual?: string;
  proximo_nivel?: {
    nivel?: number;
    titulo?: string;
    xp_minimo?: number;
    xp_restante?: number;
    descricao?: string;
  };
  proximos_niveis?: Array;          // ❌ NÃO USADO
  desafios?: Array;                  // ❌ NÃO USADO
}
```

**Análise:**
- **Completamente não usado** na v1.3
- A v1.3 não exibe jornada/níveis (conforme especificação)
- Pode ser removido da API response

**Recomendação:** ❌ **REMOVER**

---

## 📋 Resumo de Recomendações

### ✅ **MANTER** (Dados Essenciais)
1. `user` (todos os campos)
2. `perfil_big_five` (todos os campos)
3. `sabotador` (todos os campos)
4. `distribuicao_emocoes` (todos os campos)
5. `panas` (todos os campos)
6. `historico_diario` (todos os campos)
7. `insights` (todos os campos)
8. `timestamp` (verificar se usado)

### ⚠️ **REVISAR** (Dados Parcialmente Usados)
1. `gamificacao`:
   - ✅ Manter: `streak_conversas_dias`
   - ⚠️ Verificar: `quest_diaria_*`, `total_conversas`, `total_reflexoes`
   - ❌ Remover: `xp_total`, `xp_proximo_nivel`, `nivel_atual`, `titulo_nivel`
   - ❌ Remover: `conquistas_desbloqueadas`, `conquistas_proximas`
   - ❌ Remover: `total_xp_ganho_hoje`, `ultima_conquista_*`

### ❌ **REMOVER** (Dados Não Usados)
1. `proxima_jornada` (completo)

---

## 🔧 Campos Específicos a Verificar

### Campos do `user`:
- [ ] `whatsapp_numero` - usado?
- [ ] `status_onboarding` - usado?
- [ ] `criado_em` - usado?

### Campos do `gamificacao`:
- [ ] `streak_protecao_usada` - usado?
- [ ] `streak_protecao_resetada_em` - usado?
- [ ] `ultima_conversa_data` - usado?
- [ ] `melhor_streak` - usado?
- [ ] `quest_diaria_*` - usado em quests?
- [ ] `total_conversas` - usado?
- [ ] `total_reflexoes` - usado?
- [ ] `ultima_atualizacao` - usado?
- [ ] `criado_em` - usado?

### Campos do `sabotador`:
- [ ] `total_deteccoes` - usado?
- [ ] `intensidade_media` - usado?
- [ ] `total_conversas` - usado?

### Campos do `perfil_big_five`:
- [ ] `perfil_secundario` - usado?

---

## 📝 Próximos Passos

1. **Verificar uso real** de cada campo marcado como "VERIFICAR"
2. **Decidir** quais campos remover
3. **Atualizar** `DashboardApiResponse` interface
4. **Atualizar** `dataAdapter` para não processar campos removidos
5. **Atualizar** backend (n8n) para não enviar campos desnecessários

---

## 🎯 Impacto Esperado

- **Redução de payload:** ~30-40% menor
- **Performance:** Carregamento mais rápido
- **Manutenibilidade:** Código mais limpo
- **Clareza:** Apenas dados necessários

---

**Status:** ⏳ Aguardando decisão sobre campos a remover

