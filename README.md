# MindQuest Dashboard 🧠✨

Sistema gamificado de monitoramento emocional baseado na Roda de Emoções de Plutchik.

## 📌 Status da Versão

- Versão atual: **1.1.3 (estável)**
- Workflow de interação via N8N em produção e monitorado
- Fluxo de conversa validado com 16 mensagens por ciclo (8 do usuário ↔ 8 da IA)
- Fluxo de onboarding concluindo com sucesso
- Validação de sessões de conversa ativa e funcionando

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
- 🤖 Jornada conversacional guiada com validação de sessão a cada ciclo

## 📦 Pré-requisitos

- **Node.js 20 LTS** (testado com 20.11+). Use `nvm` ou `fnm` para garantir a versão correta.
- **npm 10+** (instalado junto com o Node). Caso prefira pnpm/yarn, adapte os comandos.
- **Git** para clonar o repositório.
- **Acesso à API MindQuest (N8N)** em `https://mindquest-n8n.cloudfy.live`. O app consome dados em tempo real desse endpoint.
- **Token de sessão válido** gerado pelo fluxo MindQuest (onboarding via WhatsApp). Sem esse token as rotas autenticadas não carregam.

> 💡 Recomenda-se executar `nvm install 20 && nvm use 20` (ou equivalente) ao entrar na pasta do projeto.

## 🧰 Configuração do ambiente local

1. Clone o repositório e acesse a pasta:
   ```bash
   git clone git@github.com:MindQuest/MindQuest.git
   cd MindQuest
   ```
2. Garanta a versão suportada do Node:
   ```bash
   nvm use 20
   ```
   Se a versão não estiver instalada, rode `nvm install 20`.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie o arquivo de variáveis:
   ```bash
   cp .env.example .env
   ```
5. Ajuste as variáveis conforme necessário (detalhes abaixo).
6. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O Vite abrirá em `http://localhost:5173`. Use `npm run preview` para simular o build.

### Variáveis de ambiente

| Variável              | Descrição                                                                                 | Exemplo                                           | Obrigatório |
|-----------------------|-------------------------------------------------------------------------------------------|---------------------------------------------------|-------------|
| `VITE_API_BASE_URL`   | URL base dos webhooks MindQuest. Se não for definida, o app usa o endpoint de produção.  | `https://mindquest-n8n.cloudfy.live/webhook`      | ✅          |
| `VITE_API_USE_PROXY`  | Define se o app chama a API via proxy local `/api`. Útil em dev para evitar CORS.        | `true` (dev) / `false` (prod)                     | ➖          |

- Quando `VITE_API_USE_PROXY=true`, o Vite roteia chamadas para `MindQuest/api/*` (vide `api/`).
- Em produção, mantenha `VITE_API_USE_PROXY=false` (ou remova a variável) para falar direto com o endpoint externo.
- Tokens de usuário são injetados via URL na primeira visita e persistidos em `localStorage`.

### Dependências externas não versionadas

- **API MindQuest (N8N)**: exposta em `mindquest-n8n.cloudfy.live`. Certifique-se de que sua rede libera requisições HTTPS para esse host.
- **Token MindQuest**: gere pelo fluxo oficial (hoje via WhatsApp). O token deve ser anexado à URL (`?token=...`) na primeira carga do dashboard.
- **Fonts**: o projeto consome fontes via CDN (Inter). Nada adicional é necessário, apenas internet ativa.

## 🛠️ Scripts de desenvolvimento

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

## ⚙️ Notas sobre a API

- Copie `.env.example` para `.env` e ajuste conforme necessário.
- `VITE_API_BASE_URL` define a URL base para os webhooks do MindQuest (padrão aponta para o ambiente de produção).
- Se preferir utilizar o proxy `/api` do Vite durante o desenvolvimento, defina `VITE_API_USE_PROXY=true`. Em produção mantenha `false` (ou remova) para que o app fale diretamente com a API remota.
- As rotas proxy (`api/*.ts`) replicam o comportamento das funções serverless usadas na Vercel e evitam problemas de CORS durante o desenvolvimento local.
- Falhas de autenticação redirecionam o usuário para `/auth-error`. Verifique o token antes de reportar bugs.

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

## 🔁 Backup automático do n8n

- **Primeira execução manual:** `./scripts/run-n8n-backup.sh`. Informe o token obtido no painel do n8n Cloudfy; o script armazena o valor com segurança no Keychain (`account=mindquest_backup_token`, `service=mindquest_n8n_backup`) e organiza os JSON em `backups/n8n/<projeto>/…`.
- **Agendamento diário (08h):** `./scripts/install-n8n-launchd.sh`. O utilitário instala o agente `com.mindquest.n8n-backup` em `~/Library/LaunchAgents/` e agenda a execução via `launchd`. Logs estão em `~/Library/Logs/mindquest-n8n-backup.log`.
- **Permissões necessárias:** conceda *Full Disk Access* para `/bin/zsh` e `/usr/bin/security` em *System Settings → Privacy & Security*. Sem isso o macOS bloqueia o acesso à pasta `Documents` e ao Keychain.
- **Comandos úteis:** `launchctl kickstart -kp gui/$UID/com.mindquest.n8n-backup` força a execução imediata; `launchctl bootout gui/$UID ~/Library/LaunchAgents/com.mindquest.n8n-backup.plist` remove o agendamento; edite `scripts/com.mindquest.n8n-backup.plist` (chave `StartCalendarInterval`) para alterar horário ou frequência.
- **Resolução de problemas:** verifique o log citado acima para mensagens como “Operation not permitted” (permissão ao disco) ou “node: command not found” (garanta `nvm` configurado ou defina `NODE_BIN=/path/do/node` antes de rodar o script/agente).

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

**MindQuest v1.1.3** — Sua jornada para o bem-estar mental 🌟
