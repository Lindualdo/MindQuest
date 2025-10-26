## MindQuest – Guia Rápido para Próximos Chats (Codex)

### Visão geral
- **Produto:** MindQuest Dashboard (React + Vite + Tailwind + Zustand) com IA conversacional via WhatsApp, focado em autoconhecimento e gamificação emocional.
- **Fluxo principal:** usuário acessa com token recebido no onboarding WhatsApp → dashboard exibe métricas (humor, PANAS, insights) → conversas guiadas por IA se refletem no painel.
- **Repositório:** estrutura Vite (`src/` para páginas/ componentes, `docs/` para materiais de apoio, `backups/n8n/` para workflows versionados).
- **Ambiente externo:** N8N hospedado em `https://mindquest-n8n.cloudfy.live` com workflows de conversa, resumo, gamificação etc.

### Arquitetura Front-end
- **React 18 + TypeScript** com SPA; roteamento manual em `src/App.tsx` (sem react-router), usando `window.location` para decidir a página.
- **Páginas principais**:
  - `/` → dashboard protegido (`AuthGuard`) renderiza componentes conforme estado `view` (`useDashboard`).
  - `/blog/*` → landings públicas (`Home`, `LpStart`, `Premium`, `ProductDefinition`).
  - `/suporte` → home de suporte (`SupportHomePage`).
  - `/suporte/conversation-guide` → guia público de conversa (`ConversationGuidePage`).
  - Qualquer outra rota → `NotFound`.
- **AuthGuard:** valida token via `useAuth.initializeAuth()`; exibe tela de loading enquanto autentica e fallback amigável em caso de erro (mensagem técnica apenas no console).
- **Estado global:** `src/store/useStore.ts` (Zustand) gerencia dados do dashboard, views, indicadores e interações com serviços (`apiService`, `authService`).
- **UI/Design:** Tailwind classes utilitárias, Framer Motion para animações suaves, componentes reutilizáveis em `src/components/ui`.

### Regras de negócio chave
- **Token**: expira em 7 dias; sem token válido, `AuthGuard` bloqueia e orienta usuário a solicitar novo link.
- **Ciclo de conversa**: 16 mensagens (8 usuário ↔ 8 IA) conforme README; workflows garantem checkpoints (resumo, insights, gamificação).
- **Navegação suporte:** qualquer página sob `/suporte/...` deve ser pública e voltar para `/suporte`.
- **Naming de URLs públicas:** usar hífen (`conversation-guide`). Nunca underline (documentado no README).
- **Wait no envio de mensagens:** workflows do n8n mantêm breves waits (~3-5s) para garantir que a Evolution (WhatsApp) finalize o envio antes do workflow encerrar.

### Processo automático de backup (n8n)
- **Scripts principais:**
  - `scripts/run-n8n-backup.mjs` → exporta todos os workflows (não arquivados) por projeto; nomes de arquivos sem ID (fallback adiciona `-id` se houver colisão). Exige `N8N_API_KEY` (armazenado no macOS Keychain).
  - `scripts/install-n8n-launchd.sh` → copiainstala `com.mindquest.n8n-backup.plist` em `~/Library/LaunchAgents/` e carrega job diário às 08h.
- **Configuracões importantes:**
  - `Full Disk Access` para `/bin/zsh` e `/usr/bin/security` em macOS.
  - Logs em `~/Library/Logs/mindquest-n8n-backup.log`.
  - Convenção de nomes padronizada (sem underline, sem ID dinâmico) confirmada no README.
- **Diretório de saída:** `backups/n8n/<projeto>/workflow-name.json` (limpa a pasta antes de cada export).

### Workflows n8n (resumo)
- **sw_chat_interations_v2.json**: fluxo principal de conversa (16 mensagens), chama sub-workflows (`sw_send_message_with_retry`, etc.), gravação de dados, insights, gamificação.
- **sw_send_message_with_retry.json**: envia mensagem via Evolution API, lida com estados `PENDING/QUEUED`, tenta retry com delay curto, aguarda finalização antes de encerrar.
- **sw_agent_conversation_guide.json**, `sw_experts_*`, `sw_trader_cripto_guide.json`: módulos auxiliares (insights, gamificação, recomendações).
- **Foco**: usar estes arquivos apenas como backup informativo; alterações reais devem ser feitas no n8n e exportadas.

### Dados do produto
- **Visão do usuário** (docs/definições do produto.md):Mindquest é Uma plataforma de evolução pessoal guiada por IA -  WhatsApp + dashboard + interações automatizadas
- **Proposta de valor:** transformar emoções em clareza e ação diária, trackear humor/PANAS, insights personalizados, recomendações microplanejadas.
- **Posicionamento:** não é terapia; complementa autoconhecimento e performance.

### Autenticação e tokens
- Tokens distribuídos no onboarding WhatsApp; primeiro acesso `?token=<token>` → `authService` captura e salva.
- `AuthGuard` redireciona `/auth` → `/` se autenticado. Em dev, definir `VITE_API_BASE_URL` e `VITE_API_USE_PROXY` conforme README.
- Rotas públicas: `/blog/*`, `/suporte`, `/suporte/conversation-guide`.
- Rotas internas exigem token válido (`/`, `/auth` fallback, views do dashboard via Zustand).

### Navegação e páginas relevantes
- **/ (dashboard)**: Layout principal com cards, gráficos, abas (`view` controlado por store): `dashboard`, `humorHistorico`, `insightDetail`, `conquistas`, `resumoConversas`, `sabotadorDetail`, etc.
- **Landing pages**: `/blog`, `/blog/lp-start`, `/blog/premium`, `/blog/produto` importadas diretamente em `App.tsx`.
- **Suporte**: `/suporte` (cards estilo posts), `/suporte/conversation-guide` (guia passo a passo).
- **Fallback**: Qualquer `/blog/*` não mapeado → `NotFound` com mensagem orientando atualização de links.

### Convenções/boas práticas para Codex
- Respeitar convenção de URLs sem underline (documento “Convenções de URL” no README).
- Em backups n8n, não editar JSON manualmente salvo quando explicitamente solicitado; alterações devem vir do n8n.
- Para roteamento: considerar nova rota pública antes de acionar hooks de autenticação.
- Manter abordagem mobile-first, gradientes suaves e visuais consistentes com Tailwind.
- Em mensagens de erro ao usuário, ocultar detalhes técnicos (já implementado via `AuthGuard`).

### Comandos úteis
- `npm run dev` → ambiente local Vite.
- `npm run build` / `npm run preview` → build e preview.
- `./scripts/run-n8n-backup.sh` → backup manual (usa token do Keychain).
- `launchctl kickstart -kp gui/$UID/com.mindquest.n8n-backup` → testar job de backup.
- `tail -n 50 ~/Library/Logs/mindquest-n8n-backup.log` → conferir logs.

### Arquivos-chave
- `src/App.tsx`: roteamento manual, tratamentos de autenticação/erro.
- `src/components/auth/AuthGuard.tsx`: valida token, mensagens amigáveis.
- `src/pages/SupportHomePage.tsx`, `src/pages/ConversationGuidePage.tsx`: páginas públicas de suporte.
- `scripts/run-n8n-backup.mjs`: exportador de workflows.
- `docs/user_conversation_guide.md`: base de conteúdo para suporte.

### Próximos passos para novos atendimentos
- Revisar alterações recentes via `git status` (atenção a arquivos deletados/acrescentados como `bkp-n8n-bat.txt`, `docs/MindQuest-home.pdf`).
- Confirmar se a página `/suporte` e o guia `/suporte/conversation-guide` atendem à experiência desejada (cards → posts mais conteúdos podem ser adicionados facilmente).
- Ao trabalhar com workflows n8n, sempre fazer ajustes no painel e importar novamente, preservando convenção de nomes no backup.

---
Este guia deve ser compartilhado no início de novos chats para que o Codex retome rapidamente o contexto (arquitetura, convenções, processos automáticos e regras de negócio).
