# MindQuest Dashboard 🧠✨

Sistema gamificado de monitoramento emocional baseado na Roda de Emoções de Plutchik.

## 🚀 Tecnologias

- **React 18** + TypeScript
- **Vite** para build rápido
- **Tailwind CSS** para styling
- **Framer Motion** para animações
- **Zustand** para gerenciamento de estado
- **Lucide React** para ícones

## 🎮 Funcionalidades

- 📊 Dashboard interativo com métricas emocionais
- 🎯 Sistema de gamificação com XP e conquistas
- 📱 Design responsivo (mobile-first)
- 🌈 Roda de emoções baseada em Plutchik
- 📈 Gráficos PANAS para análise emocional
- 🏆 Sistema de insights e recomendações
- ⚡ Animações fluidas com Framer Motion
- 🔄 Seletor de períodos (semana/mês/trimestre)

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificar tipos
npm run typecheck

# Lint do código
npm run lint
```

## 📁 Estrutura

```
src/
├── components/
│   ├── dashboard/     # Componentes principais do dashboard
│   │   ├── Dashboard.tsx
│   │   ├── PeriodSelector.tsx
│   │   ├── MoodGauge.tsx
│   │   ├── PanasChart.tsx
│   │   ├── EmotionWheel.tsx
│   │   └── InsightsPanel.tsx
│   └── ui/           # Componentes reutilizáveis
│       ├── Card.tsx
│       └── Button.tsx
├── store/            # Estado global (Zustand)
│   └── useStore.ts
├── types/            # Tipagem TypeScript
│   └── emotions.ts
├── data/             # Dados mockados
│   └── mockData.ts
└── utils/            # Utilitários (futuro)
```

## 🎨 Design System

- **Cores**: Gradientes azul/roxo com acentos coloridos
- **Tipografia**: Inter font family
- **Animações**: Framer Motion com easing suave
- **Glass Morphism**: Cards translúcidos com blur
- **Responsividade**: Mobile-first approach

## 📊 Componentes

### MoodGauge
Gauge animado que exibe o nível de humor em escala -5 a +5 com:
- Indicador visual colorido
- Animação da agulha
- Comparação com período anterior

### PanasChart
Gráfico de barras animado mostrando distribuição PANAS:
- Emoções positivas, negativas e neutras
- Barras animadas com shimmer effect
- Meta de positividade

### EmotionWheel
Roda das emoções interativa baseada em Plutchik:
- 8 emoções primárias
- SVG animado com opacidade baseada na intensidade
- Legenda com frequências

### InsightsPanel
Panel gamificado com insights inteligentes:
- Categorização por tipo (padrão, melhoria, positivo, alerta)
- Sistema de XP e conquistas
- Quest diária com progress bar

---

**MindQuest** - Sua jornada para o bem-estar mental 🌟
