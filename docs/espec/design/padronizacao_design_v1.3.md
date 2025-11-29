# Plano de Padronização de Design - MindQuest v1.3

**Data:** 2025-11-29 15:30
**Última atualização:** 2025-11-29 15:30

---

## 1. Análise Atual - Problemas Identificados

### 1.1 Cores Inconsistentes

| Elemento | Variações Encontradas | Padrão Definido |
|----------|----------------------|-----------------|
| Azul Primary | `#0EA5E9`, `#3083DC`, `#2F76D1`, `#2563EB` | `--mq-primary` |
| Azul Hover | `#0C8BD6`, `#0C94D2`, `#266ab0` | `--mq-primary-hover` |
| Texto Dark | `#1C2541`, `#1F2937`, `#111827` | `--mq-text` |
| Texto Muted | `#64748B`, `#475569`, `#94A3B8`, `#7E8CA0` | `--mq-text-muted` |
| Background Page | `#F5EBF3`, `bg-white`, gradientes | `--mq-bg` |

### 1.2 Componentes Inconsistentes

1. **Botão Voltar**: Estilos inline vs classes Tailwind
2. **Cards**: `box-shadow` inline vs classes
3. **Títulos de página**: Variações de tamanho (`text-3xl`, `text-lg`, `text-2xl`)
4. **BottomNavV1_3**: Props inconsistentes em `ObjetivosPageV13`

### 1.3 Arquivos Afetados

- 16 páginas v1.3
- 10 componentes v1.3
- 1 CSS de estilos (`mq-v1_3-styles.css`)

---

## 2. Design Tokens Padronizados

### 2.1 Cores Base

```css
:root {
  /* === BACKGROUND === */
  --mq-bg: #F5EBF3;
  --mq-surface: #E8F3F5;
  --mq-card: #FFFFFF;
  
  /* === BORDAS === */
  --mq-border: #B6D6DF;
  --mq-border-subtle: rgba(28, 37, 65, 0.08);
  
  /* === TEXTOS === */
  --mq-text: #1C2541;
  --mq-text-secondary: #475569;
  --mq-text-muted: #64748B;
  --mq-text-subtle: #94A3B8;
  
  /* === CORES PRIMÁRIAS === */
  --mq-primary: #0EA5E9;
  --mq-primary-hover: #0C8BD6;
  --mq-primary-light: #E0F2FE;
  
  /* === ACCENT === */
  --mq-accent: #D90368;
  --mq-accent-hover: #B80258;
  
  /* === SEMÂNTICAS === */
  --mq-success: #22C55E;
  --mq-success-bg: #ECFDF5;
  --mq-warning: #F59E0B;
  --mq-warning-bg: #FEF3C7;
  --mq-error: #EF4444;
  --mq-error-bg: #FEF2F2;
  --mq-info: #2F76D1;
  --mq-info-bg: #E0F2FE;
  
  /* === SOMBRAS === */
  --mq-shadow-sm: 0 4px 12px rgba(15, 23, 42, 0.04);
  --mq-shadow-md: 0 10px 24px rgba(15, 23, 42, 0.08);
  --mq-shadow-lg: 0 16px 32px rgba(15, 23, 42, 0.12);
  
  /* === RAIOS === */
  --mq-radius-sm: 12px;
  --mq-radius-md: 16px;
  --mq-radius-lg: 24px;
  --mq-radius-full: 9999px;
}
```

### 2.2 Tipografia

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| Page Title | `text-3xl` (1.875rem) | `font-bold` | Títulos de página |
| Page Subtitle | `text-sm` (0.875rem) | `font-normal` | Subtítulo abaixo do título |
| Section Title | `text-lg` (1.125rem) | `font-semibold` | Títulos de seções/cards |
| Eyebrow | `text-[0.72rem]` | `font-semibold uppercase tracking-[0.15em]` | Labels acima de títulos |
| Body | `text-sm` (0.875rem) | `font-normal` | Texto de parágrafo |
| Caption | `text-xs` (0.75rem) | `font-medium` | Legendas, datas |
| Micro | `text-[0.65rem]` | `font-medium` | Contadores, badges minúsculos |

---

## 3. Componentes Padronizados

### 3.1 Layout de Página

```tsx
// PADRÃO para todas as páginas v1.3
<div className="mq-app-v1_3 flex min-h-screen flex-col bg-[var(--mq-bg)]">
  <HeaderV1_3 nomeUsuario={nomeUsuario} />
  
  <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
    {/* Conteúdo */}
  </main>
  
  <BottomNavV1_3
    active={activeTab}
    onHome={handleNavHome}
    onPerfil={handleNavPerfil}
    onQuests={handleNavQuests}
    onConfig={handleNavConfig}
  />
</div>
```

### 3.2 Card Padrão

```tsx
// Classe: .mq-card
className="rounded-[var(--mq-radius-lg)] border border-[var(--mq-border)] bg-[var(--mq-surface)] px-4 py-4 shadow-[var(--mq-shadow-md)]"

// Ou via style (quando necessário):
style={{ 
  borderRadius: 'var(--mq-radius-lg)', 
  boxShadow: 'var(--mq-shadow-md)' 
}}
```

### 3.3 Botão Voltar

```tsx
// PADRÃO para todas as páginas
<button
  type="button"
  onClick={handleBack}
  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--mq-text)] shadow-[var(--mq-shadow-sm)] hover:shadow-[var(--mq-shadow-md)] transition-all active:scale-[0.98]"
>
  <ArrowLeft size={18} />
  Voltar
</button>
```

### 3.4 Botão CTA Primário

```tsx
className="w-full rounded-[var(--mq-radius-md)] bg-[var(--mq-primary)] px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-[var(--mq-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
```

### 3.5 Título de Página

```tsx
<div className="mb-6 text-center">
  <h1 className="text-3xl font-bold text-[var(--mq-text)] mb-1">
    {titulo}
  </h1>
  <p className="text-sm text-[var(--mq-text-muted)]">
    {subtitulo}
  </p>
</div>
```

### 3.6 Eyebrow Label

```tsx
<p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[var(--mq-info)]">
  {label}
</p>
```

---

## 4. Checklist de Alterações por Arquivo

### 4.1 CSS Global

**Arquivo:** `src/components/app/v1.3/styles/mq-v1_3-styles.css`

- [ ] Adicionar CSS Variables conforme seção 2.1
- [ ] Remover cores hardcoded
- [ ] Adicionar classes utilitárias: `.mq-card`, `.mq-btn-primary`, `.mq-btn-back`, `.mq-page-title`

### 4.2 Páginas

| Arquivo | Alterações |
|---------|------------|
| `HomeV1_3.tsx` | OK (modelo padrão) |
| `PainelQuestsPageV13.tsx` | Remover `bg-gradient-to-b` → usar `bg-[var(--mq-bg)]` |
| `InsightsDashboardPageV13.tsx` | OK |
| `InsightsHistoricoPageV13.tsx` | OK |
| `InsightDetailPageV13.tsx` | OK |
| `QuestDetailPageV13.tsx` | OK |
| `EvoluirPageV13.tsx` | ⚠️ Corrigir `bg-white` → `bg-[var(--mq-bg)]`; Remover `className` duplicado |
| `ConversaResumoPageV13.tsx` | OK |
| `DashPerfilPage.tsx` | OK |
| `HumorHistoryPageV13.tsx` | OK |
| `SabotadorDetailPageV13.tsx` | OK |
| `ObjetivosPageV13.tsx` | ⚠️ Corrigir props do BottomNavV1_3 |
| `PerfilPessoalPageV13.tsx` | OK |
| `MapaMentalPage.tsx` | Verificar padrão |
| `MapaMentalVisualPage.tsx` | Verificar padrão |
| `PlanejamentoQuestsPage.tsx` | Verificar padrão |

### 4.3 Componentes

| Arquivo | Alterações |
|---------|------------|
| `HeaderV1_3.tsx` | Usar variáveis CSS |
| `BottomNavV1_3.tsx` | Usar variáveis CSS |
| `CardWeeklyProgress.tsx` | Usar variáveis CSS para cores |
| `CardMoodEnergy.tsx` | Usar variáveis CSS para cores |
| `CardInsightUltimaConversa.tsx` | Usar variáveis CSS |
| `CardSabotadorAtivo.tsx` | Usar variáveis CSS |
| `CardSabotadorMente.tsx` | Usar variáveis CSS |
| `CardHumor.tsx` | Usar variáveis CSS |
| `CardEnergia.tsx` | Usar variáveis CSS |
| `Card.tsx` (ui) | Usar variáveis CSS, ajustar `glass-card` |

---

## 5. Detalhamento por Página

### 5.1 EvoluirPageV13.tsx

**Problemas:**
1. Linha 135: `bg-white` → deveria ser `bg-[var(--mq-bg)]`
2. Linhas 173, 196, 216: `className` duplicado (2x no mesmo elemento)
3. Ícones sem cor definida (Star, Target, ChevronRight)

**Correções:**
```tsx
// Linha 135
<div className="mq-app-v1_3 flex min-h-screen flex-col bg-[var(--mq-bg)]">

// Linhas 173, 196, 216 - Remover className duplicado
// DE:
className="w-full rounded-2xl border p-5..."
className="w-full rounded-2xl border border-[#B6D6DF]..."

// PARA:
className="w-full rounded-[var(--mq-radius-lg)] border border-[var(--mq-border)] bg-[var(--mq-surface)] p-5 shadow-[var(--mq-shadow-md)]..."

// Ícones - adicionar cor
<Star size={16} className="text-[var(--mq-warning)]" />
<Target size={20} className="text-[var(--mq-primary)]" />
<ChevronRight size={20} className="text-[var(--mq-text-muted)]" />
```

### 5.2 ObjetivosPageV13.tsx

**Problemas:**
1. Props do BottomNavV1_3 diferentes do padrão

**Correções:**
```tsx
// DE:
<BottomNavV1_3
  activeTab={activeTab}
  onNavHome={handleNavHome}
  onNavPerfil={handleNavPerfil}
  onNavQuests={handleNavQuests}
  onNavAjustes={handleNavAjustes}
/>

// PARA:
<BottomNavV1_3
  active={activeTab}
  onHome={handleNavHome}
  onPerfil={handleNavPerfil}
  onQuests={handleNavQuests}
  onConfig={handleNavConfig}
/>
```

### 5.3 PainelQuestsPageV13.tsx

**Problemas:**
1. Linha 710: `bg-gradient-to-b from-[#F5EBF3] to-[#FFFFFF]`

**Correções:**
```tsx
// Linha 710
// DE:
<div className="mq-app-v1_3 flex min-h-screen flex-col bg-gradient-to-b from-[#F5EBF3] to-[#FFFFFF]">

// PARA:
<div className="mq-app-v1_3 flex min-h-screen flex-col bg-[var(--mq-bg)]">
```

---

## 6. Estrutura de Temas

### 6.1 Arquitetura

```
src/
├── styles/
│   └── themes/
│       ├── base.css          # Tokens base (usados por todos os temas)
│       ├── light.css         # Tema Claro (padrão atual)
│       ├── dark.css          # Tema Escuro
│       ├── warm.css          # Tema Quente
│       └── cool.css          # Tema Frio
```

### 6.2 Definição dos 4 Temas

#### Tema 1: Light (Padrão Atual - "Clareza")
```css
[data-theme="light"] {
  --mq-bg: #F5EBF3;
  --mq-surface: #E8F3F5;
  --mq-card: #FFFFFF;
  --mq-text: #1C2541;
  --mq-primary: #0EA5E9;
  --mq-accent: #D90368;
}
```

#### Tema 2: Dark ("Foco Noturno")
```css
[data-theme="dark"] {
  --mq-bg: #0F172A;
  --mq-surface: #1E293B;
  --mq-card: #334155;
  --mq-text: #F1F5F9;
  --mq-text-secondary: #CBD5E1;
  --mq-text-muted: #94A3B8;
  --mq-border: #475569;
  --mq-primary: #38BDF8;
  --mq-accent: #F472B6;
}
```

#### Tema 3: Warm ("Energia Criativa")
```css
[data-theme="warm"] {
  --mq-bg: #FEF7EC;
  --mq-surface: #FEF3E2;
  --mq-card: #FFFBF5;
  --mq-text: #422006;
  --mq-text-secondary: #78350F;
  --mq-text-muted: #A16207;
  --mq-border: #FDE68A;
  --mq-primary: #F59E0B;
  --mq-accent: #DC2626;
}
```

#### Tema 4: Cool ("Serenidade")
```css
[data-theme="cool"] {
  --mq-bg: #F0FDF4;
  --mq-surface: #DCFCE7;
  --mq-card: #FFFFFF;
  --mq-text: #14532D;
  --mq-text-secondary: #166534;
  --mq-text-muted: #4D7C0F;
  --mq-border: #BBF7D0;
  --mq-primary: #22C55E;
  --mq-accent: #0EA5E9;
}
```

### 6.3 Implementação do Seletor de Tema

**Local:** Página `EvoluirPageV13.tsx` → Seção "Aparência"

```tsx
const temas = [
  { id: 'light', nome: 'Clareza', emoji: '☀️', desc: 'Tema claro padrão' },
  { id: 'dark', nome: 'Foco Noturno', emoji: '🌙', desc: 'Escuro para reduzir cansaço visual' },
  { id: 'warm', nome: 'Energia Criativa', emoji: '🔥', desc: 'Tons quentes e acolhedores' },
  { id: 'cool', nome: 'Serenidade', emoji: '🍃', desc: 'Tons frios e tranquilos' },
];
```

---

## 7. Ordem de Execução

### Fase 1: CSS Variables (1 arquivo)
1. [ ] Atualizar `mq-v1_3-styles.css` com todas as variáveis

### Fase 2: Correções Críticas (3 arquivos)
2. [ ] Corrigir `EvoluirPageV13.tsx` (className duplicado, bg-white)
3. [ ] Corrigir `ObjetivosPageV13.tsx` (props BottomNav)
4. [ ] Corrigir `PainelQuestsPageV13.tsx` (gradient)

### Fase 3: Páginas (13 arquivos)
5. [ ] Substituir cores hardcoded por variáveis em todas as páginas

### Fase 4: Componentes (10 arquivos)
6. [ ] Substituir cores hardcoded por variáveis em todos os componentes

### Fase 5: Sistema de Temas
7. [ ] Criar arquivos de tema em `src/styles/themes/`
8. [ ] Criar hook `useTheme`
9. [ ] Implementar seletor de tema na página Evoluir
10. [ ] Salvar preferência no localStorage/backend

---

## 8. Validação

### Checklist Final
- [ ] Todas as cores usando CSS Variables
- [ ] Nenhum `className` duplicado
- [ ] Props do BottomNavV1_3 padronizadas
- [ ] Background consistente em todas as páginas
- [ ] Sombras usando variáveis
- [ ] Raios de borda usando variáveis
- [ ] 4 temas funcionando corretamente
- [ ] Tema salvo no localStorage

---

## Anexo: Mapeamento de Cores Antigas → Novas

| Cor Antiga | Variável Nova | Uso |
|------------|---------------|-----|
| `#F5EBF3` | `var(--mq-bg)` | Background página |
| `#E8F3F5` | `var(--mq-surface)` | Background cards |
| `#B6D6DF` | `var(--mq-border)` | Borda cards |
| `#1C2541` | `var(--mq-text)` | Texto principal |
| `#64748B` | `var(--mq-text-muted)` | Texto secundário |
| `#94A3B8` | `var(--mq-text-subtle)` | Texto terciário |
| `#0EA5E9` | `var(--mq-primary)` | Botões, links primários |
| `#0C8BD6` | `var(--mq-primary-hover)` | Hover botões |
| `#D90368` | `var(--mq-accent)` | Logo, nav ativa |
| `#2F76D1` | `var(--mq-info)` | Labels info |
| `#22C55E` | `var(--mq-success)` | Sucesso |
| `#F59E0B` | `var(--mq-warning)` | Alertas |
| `#EF4444` | `var(--mq-error)` | Erros |

