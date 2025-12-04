# MindQuest Dashboard 🧠✨

Sistema gamificado de monitoramento emocional baseado na Roda de Emoções de Plutchik.

**Versão:** 1.3.19

---

## 🚀 Tecnologias

- **React 18** + TypeScript
- **Vite** para build
- **Tailwind CSS** para styling
- **Framer Motion** para animações
- **Zustand** para estado global
- **Lucide React** para ícones

---

## 📦 Pré-requisitos

- **Node.js 20 LTS** (use `nvm install 20 && nvm use 20`)
- **npm 10+**
- **Token de sessão válido** gerado pelo fluxo MindQuest (onboarding via WhatsApp)

---

## 🧰 Setup

```bash
# Clone e instale
git clone git@github.com:MindQuest/MindQuest.git
cd MindQuest
nvm use 20
npm install

# Configure variáveis (opcional)
cp .env.example .env

# Execute
npm run dev
```

Acesse `http://localhost:5173`

### Variáveis de Ambiente

| Variável              | Descrição                                    | Obrigatório |
|-----------------------|----------------------------------------------|-------------|
| `VITE_API_BASE_URL`   | URL base dos webhooks MindQuest              | ✅          |
| `VITE_API_USE_PROXY`  | Usar proxy local `/api` (dev)               | ➖          |

**API padrão:** `https://mindquest-n8n.cloudfy.live/webhook`

---

## 🛠️ Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Preview do build
npm run lint     # Lint
npm run typecheck # Verificar tipos
```

---

## 📁 Estrutura

```
src/
├── pages/
│   ├── App/v1.3/          # Páginas v1.3 do app
│   ├── Marketing/         # Landing page
│   └── Suport/            # Guia de usuário
├── components/
│   ├── app/v1.3/          # Componentes v1.3
│   ├── dashboard/         # Componentes dashboard
│   ├── landing_start/     # Componentes landing
│   └── ui/                # Componentes compartilhados
├── store/                 # Estado global (Zustand)
├── types/                 # Tipos TypeScript
├── data/                  # Catálogos e mocks
└── utils/                 # Funções auxiliares
```

---

## 🎯 Funcionalidades v1.3

- 📊 Dashboard com progresso semanal
- 🎯 Sistema de pontos e quests
- 📱 Design mobile-first responsivo
- 🌈 Roda de emoções (Plutchik)
- 🏆 Insights e recomendações
- 📈 Análise de humor e energia
- 🤖 Jornada conversacional guiada

---

## 🔤 Rotas

### Públicas
- `/` ou `/comecar-agora` → Landing page
- `/suporte/conversation-guide` → Guia de usuário

### Autenticadas (requer token)
- `/app/1.3` → Home v1.3
- `/app/1.3?view=<view>` → Views específicas

**Views disponíveis:**
- `dashboard` (padrão)
- `dashEmocoes`
- `dashInsights`
- `painelQuests`
- `questDetail`
- `insightDetail`
- `sabotadorDetail`
- `conversaResumo`
- `mapaMental`
- `mapaMentalVisual`
- `humorHistorico`

---

## 🎨 Design System

- **Cores:** Gradientes azul/roxo com acentos
- **Tipografia:** Inter (CDN)
- **Animações:** Framer Motion
- **Layout:** Mobile-first

---

## 📝 Notas

- Tokens são injetados via URL (`?token=...`) e persistidos em `localStorage`
- Todas as rotas `/app` redirecionam para `/app/1.3`
- API base: `mindquest-n8n.cloudfy.live`
- Build validado e testado

---

**MindQuest v1.3.19** — Mente clara, resultados reais 🌟
