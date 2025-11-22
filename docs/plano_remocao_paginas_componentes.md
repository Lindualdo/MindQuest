# Plano de Remoção — Páginas e Componentes Não Usados

## Objetivo
Remover todas as páginas e componentes que não são da v1.3 do app nem da página inicial de marketing.

---

## 1. MANTER (v1.3)

### Páginas v1.3
- `src/pages/App/v1.3/HomeV1_3.tsx`
- `src/pages/App/v1.3/DashPerfilPage.tsx`
- `src/pages/App/v1.3/PainelQuestsPageV13.tsx`
- `src/pages/App/v1.3/QuestDetailPageV13.tsx`
- `src/pages/App/v1.3/ConversaResumoPageV13.tsx`
- `src/pages/App/v1.3/SabotadorDetailPageV13.tsx`
- `src/pages/App/v1.3/InsightDetailPageV13.tsx`
- `src/pages/App/v1.3/HumorHistoryPageV13.tsx`
- `src/pages/App/v1.3/MapaMentalPage.tsx`
- `src/pages/App/v1.3/MapaMentalVisualPage.tsx`

### Componentes v1.3
- `src/components/app/v1.3/BottomNavV1_3.tsx`
- `src/components/app/v1.3/CardConversasV13.tsx`
- `src/components/app/v1.3/CardWeeklyProgress.tsx`
- `src/components/app/v1.3/CardMoodEnergy.tsx`
- `src/components/app/v1.3/CardInsightUltimaConversa.tsx`
- `src/components/app/v1.3/CardSabotadorAtivo.tsx`

### Componentes v1.2 (usados por v1.3)
- `src/components/app/v1.2/HeaderV1_2.tsx` ⚠️ **MANTER** (usado por todas as páginas v1.3)
- `src/components/app/v1.2/styles/mq-v1_2-styles.css` ⚠️ **MANTER** (importado por HomeV1_3)

---

## 2. MANTER (Marketing)

### Páginas Marketing
- `src/pages/Marketing/ComecarAgoraLandingPage.tsx`

### Componentes Landing
- `src/components/landing_start/LandingHeader.tsx`
- `src/components/landing_start/LandingFooter.tsx`
- `src/components/landing_start/Hero.tsx`
- `src/components/landing_start/Dores.tsx`
- `src/components/landing_start/Results.tsx`
- `src/components/landing_start/FinalCTA.tsx`
- `src/components/landing_start/Plans.tsx`
- `src/components/landing_start/BehindMindquest.tsx`
- `src/components/landing_start/FAQ.tsx`
- `src/components/landing_start/SectionTitle.tsx`
- `src/components/landing_start/constants.ts`

---

## 3. MANTER (Suporte)

### Páginas Suporte
- `src/pages/Suport/ConversationGuidePage.tsx` (usado no App.tsx)

---

## 4. MANTER (Core — DashboardPage e InsightsDashboardPage)

### Páginas Core
- `src/pages/App/DashboardPage.tsx` (usado no App.tsx como fallback)
- `src/pages/App/InsightsDashboardPage.tsx` (usado no App.tsx)

### Componentes Dashboard (usados por Core ou v1.3)
- `src/components/dashboard/Dashboard.tsx` (usado por DashboardPage)
- `src/components/dashboard/CheckInsHistorico.tsx` (usado por Dashboard)
- `src/components/dashboard/QuestPanel.tsx` (usado por Dashboard)
- `src/components/dashboard/InsightsFilterControls.tsx` (usado por InsightsDashboardPage)
- `src/components/dashboard/insightsFilterOptions.ts` (usado por InsightsDashboardPage)
- `src/components/dashboard/EmotionWheel.tsx` (usado por DashPerfilPageV13)
- `src/components/dashboard/CardPerfilBigFive.tsx` (usado por DashPerfilPageV13)
- `src/components/dashboard/MoodGauge.tsx` ❌ **REMOVER** (usado apenas em EmocoesDashboardPage)
- `src/components/dashboard/PanasChart.tsx` ❌ **REMOVER** (usado apenas em EmocoesDashboardPage e EmocoesDashboardPageV12)

### Componentes UI
- `src/components/ui/Card.tsx` (usado por várias páginas)
- `src/components/ui/Button.tsx` (usado por várias páginas)

### Componentes Auth/Common
- `src/components/auth/AuthGuard.tsx` (core)
- `src/components/common/ErrorBoundary.tsx` (core)

---

## 5. REMOVER — Páginas Antigas (não v1.3)

### Páginas App (antigas)
- ❌ `src/pages/App/ConquistasPage.tsx`
- ❌ `src/pages/App/ProximosNiveisPage.tsx`
- ❌ `src/pages/App/EmocoesDashboardPage.tsx`
- ❌ `src/pages/App/SabotadoresDashboardPage.tsx`
- ❌ `src/pages/App/HumorHistoryPage.tsx`
- ❌ `src/pages/App/FullChatPage.tsx`
- ❌ `src/pages/App/InsightDetailPage.tsx`
- ❌ `src/pages/App/PainelQuestsPage.tsx`
- ❌ `src/pages/App/PanasDetailPage.tsx`
- ❌ `src/pages/App/ResumoConversasPage.tsx`
- ❌ `src/pages/App/SabotadorDetailPage.tsx`

### Páginas v1.2
- ❌ `src/pages/App/v1.2/HomeV1_2.tsx`
- ❌ `src/pages/App/v1.2/HomeV1_2_2.tsx`
- ❌ `src/pages/App/v1.2/dash_emocoes/EmocoesDashboardPageV12.tsx`

---

## 6. REMOVER — Componentes v1.2 (não usados)

### Componentes v1.2 (exceto HeaderV1_2 e styles)
- ❌ `src/components/app/v1.2/CardConversas.tsx`
- ❌ `src/components/app/v1.2/CardEmocoes.tsx`
- ❌ `src/components/app/v1.2/CardJornada.tsx`
- ❌ `src/components/app/v1.2/CardQuest.tsx`
- ❌ `src/components/app/v1.2/FraseTransformacao.tsx`

---

## 7. REMOVER — Componentes Dashboard (não usados)

### Componentes Dashboard (não importados em nenhum lugar)
- ❌ `src/components/dashboard/InsightsPanel.tsx` (não usado)
- ❌ `src/components/dashboard/GamificacaoPanel.tsx` (não usado)
- ❌ `src/components/dashboard/SabotadorCard.tsx` (não usado)
- ❌ `src/components/dashboard/DailyMoodChart.tsx` (não usado)
- ❌ `src/components/dashboard/PeriodSelector.tsx` (não usado)

---

## 8. LIMPEZA NO App.tsx

### Imports a remover
- ❌ `HumorHistoryPage`
- ❌ `FullChatPage`
- ❌ `InsightDetailPage`
- ❌ `ConquistasPage`
- ❌ `ProximosNiveisPage`
- ❌ `SabotadorDetailPage`
- ❌ `ResumoConversasPage`
- ❌ `PainelQuestsPage`
- ❌ `PanasDetailPage`
- ❌ `EmocoesDashboardPage`
- ❌ `SabotadoresDashboardPage`
- ❌ `HomeV1_2`
- ❌ `HomeV1_2_2`

### Rotas a remover do App.tsx
- ❌ `isAppPreviewV12` e `isAppPreviewV12_2` (previews v1.2)
- ❌ `view === 'conquistas'`
- ❌ `view === 'proximosNiveis'`
- ❌ `view === 'dashEmocoes'` (versão antiga)
- ❌ `view === 'dashSabotadores'`
- ❌ `view === 'panasDetail'`
- ❌ `view === 'resumoConversas'` (versão antiga)
- ❌ `view === 'fullChatDetail'`
- ❌ `view === 'painelQuests'` (versão antiga, manter apenas v1.3)
- ❌ `view === 'sabotadorDetail'` (versão antiga, manter apenas v1.3)
- ❌ `view === 'insightDetail'` (versão antiga, manter apenas v1.3)
- ❌ `view === 'humorHistorico'` (versão antiga, manter apenas v1.3)

### Manter no App.tsx
- ✅ `DashboardPage` (fallback)
- ✅ `InsightsDashboardPage` (usado)
- ✅ Todas as páginas v1.3
- ✅ `ComecarAgoraLandingPage`
- ✅ `ConversationGuidePage`

---

## 9. ORDEM DE EXECUÇÃO

1. **Fase 1: Análise e validação**
   - Verificar se `MoodGauge` e `PanasChart` são usados (parece que só em `EmocoesDashboardPage`, que será removida)
   - Confirmar que `HeaderV1_2` é o único componente v1.2 necessário

2. **Fase 2: Remover páginas antigas**
   - Deletar páginas não v1.3
   - Deletar páginas v1.2

3. **Fase 3: Remover componentes não usados**
   - Deletar componentes v1.2 (exceto HeaderV1_2 e styles)
   - Deletar componentes dashboard não usados

4. **Fase 4: Limpar App.tsx**
   - Remover imports não usados
   - Remover rotas antigas
   - Manter apenas rotas v1.3, marketing e suporte

5. **Fase 5: Validação**
   - Testar build (`npm run build`)
   - Verificar se não há imports quebrados
   - Testar rotas principais

---

## 10. ARQUIVOS A DELETAR (resumo)

### Páginas (15 arquivos)
```
src/pages/App/ConquistasPage.tsx
src/pages/App/ProximosNiveisPage.tsx
src/pages/App/EmocoesDashboardPage.tsx
src/pages/App/SabotadoresDashboardPage.tsx
src/pages/App/HumorHistoryPage.tsx
src/pages/App/FullChatPage.tsx
src/pages/App/InsightDetailPage.tsx
src/pages/App/PainelQuestsPage.tsx
src/pages/App/PanasDetailPage.tsx
src/pages/App/ResumoConversasPage.tsx
src/pages/App/SabotadorDetailPage.tsx
src/pages/App/v1.2/HomeV1_2.tsx
src/pages/App/v1.2/HomeV1_2_2.tsx
src/pages/App/v1.2/dash_emocoes/EmocoesDashboardPageV12.tsx
```

### Componentes v1.2 (5 arquivos)
```
src/components/app/v1.2/CardConversas.tsx
src/components/app/v1.2/CardEmocoes.tsx
src/components/app/v1.2/CardJornada.tsx
src/components/app/v1.2/CardQuest.tsx
src/components/app/v1.2/FraseTransformacao.tsx
```

### Componentes Dashboard (7 arquivos)
```
src/components/dashboard/InsightsPanel.tsx
src/components/dashboard/GamificacaoPanel.tsx
src/components/dashboard/SabotadorCard.tsx
src/components/dashboard/DailyMoodChart.tsx
src/components/dashboard/PeriodSelector.tsx
src/components/dashboard/MoodGauge.tsx
src/components/dashboard/PanasChart.tsx
```

**Total: 27 arquivos a deletar**

---

## 11. NOTAS IMPORTANTES

- ⚠️ **HeaderV1_2** deve ser mantido pois é usado por todas as páginas v1.3
- ⚠️ **mq-v1_2-styles.css** deve ser mantido pois é importado por HomeV1_3
- ✅ **MoodGauge** e **PanasChart** confirmados: usados apenas em páginas que serão removidas
- ⚠️ Após remover, verificar se há referências quebradas em `useStore.ts` ou outros arquivos
- ⚠️ Manter `DashboardPage` e `InsightsDashboardPage` pois são usados no App.tsx

