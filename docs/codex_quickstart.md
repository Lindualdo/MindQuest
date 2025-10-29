## MindQuest – Guia Rápido para Próximos Chats (Codex)

### Visão geral
- **Produto:** MindQuest Dashboard (React + Vite + Tailwind + Zustand) com IA conversacional via WhatsApp, focado em autoconhecimento e gamificação emocional.
- **Fluxo principal:** usuário acessa com token recebido no onboarding WhatsApp → dashboard exibe métricas (humor, PANAS, insights) → conversas guiadas por IA se refletem no painel.
- **Repositório:** estrutura Vite (`src/` para páginas/ componentes, `docs/` para materiais de apoio, `backups/n8n/` para workflows versionados).
- **Ambiente externo:** N8N hospedado em `https://mindquest-n8n.cloudfy.live` com workflows de conversa, resumo, gamificação etc.

### Contexto do produto
- **MindQuest** é uma plataforma de evolução pessoal guiada por IA (“sua mente fala com você todos os dias; o MindQuest transforma ruídos em clareza e ações em resultados”) — referência completa em `docs/definições do produto.md`.
- Experiência distribuída em quatro pilares:
  - **Dashboard MindQuest:** painel vivo atualizado a cada conversa com humor, roda das emoções, PANAS, sabotadores, gamificação, histórico e insights.
  - **Assistente de Reflexão (IA no WhatsApp):** conduz até 8 trocas diárias com perguntas baseadas em TCC e conversação guiada para mapear emoções e objetivos.
  - **Assistente de Interações:** envia convites, lembretes, resumos semanais/mensais e acompanhamento de metas (integrações WhatsApp → N8N).
  - **Mentor Virtual (Premium):** disponível 24h para conversas livres, combina filosofias e orientações práticas para acelerar a transformação pessoal.
  - **Especialistas de IA:** agentes em background analisam a conversa (Sabotadores de Shirzad Chamine, Roda das Emoções, Sentimentos PANAS, perfis Big Five) e devolvem dados estruturados ao dashboard.
- **Guia público para usuários:** `/suporte/conversation-guide` (código em `src/pages/ConversationGuidePage.tsx`, conteúdo base em `docs/user_conversation_guide.md`) explica a jornada inicial, pilares e o que acontece pós-conversa; sempre referenciar esse material em novos atendimentos.

### Arquitetura Front-end
- **React 18 + TypeScript** com SPA; roteamento manual em `src/App.tsx` (sem react-router), usando `window.location` para decidir a página.
- **Organização das páginas**:
  - Toda view autenticada mora em `src/pages/App/*.tsx` (ex.: `DashboardPage`, `PanasDetailPage`), atuando como *containers* enxutos.
  - Cada página possui seus componentes específicos em `src/components/<NomeDaPagina>/` (ex.: `DashboardPage` consome `src/components/dashboard/*`).
  - Landings públicas seguem o mesmo formato em subpastas como `src/pages/Marketing/`.
- **Rotas principais**:
  - `/` → dashboard protegido (`AuthGuard`) renderiza o container `DashboardPage`, que orquestra os dados via Zustand.
  - `/comecar-agora` → landing pública de campanha (`ComecarAgoraLandingPage`), sem necessidade de token.
  - `/suporte/conversation-guide` → guia público de conversa (`ConversationGuidePage`).
  - Qualquer outra rota → `NotFound`, com mensagem dedicada para slugs ainda não publicados.
- **AuthGuard:** valida token via `useAuth.initializeAuth()`; exibe tela de loading enquanto autentica e fallback amigável em caso de erro (mensagem técnica apenas no console).
- **Estado global:** `src/store/useStore.ts` (Zustand) gerencia dados do dashboard, views, indicadores e interações com serviços (`apiService`, `authService`).
- **UI/Design:** Tailwind classes utilitárias, Framer Motion para animações suaves, componentes reutilizáveis em `src/components/ui`.

### Regras de negócio chave
- **Token**: expira em 7 dias; sem token válido, `AuthGuard` bloqueia e orienta usuário a solicitar novo link.
- **Ciclo de conversa**: 16 mensagens (8 usuário ↔ 8 IA) conforme README; workflows garantem checkpoints (resumo, insights, gamificação).
- **Sessões WhatsApp**:
  - Cada rodada mantém a sessão “em aberto” até completar as 8 interações; o usuário tem até 12 horas (TTL atual da memória) para retomar sem perder o progresso.
  - Ao atingir a 8ª interação, o fluxo grava conversa, aplica especialistas (humor, PANAS, sabotadores, insights) e atualiza o dashboard.
  - Concluída a sessão, é aplicado cooldown de 12 horas (lock em Redis) antes de liberar uma nova rodada; mensagens nesse intervalo recebem aviso automático com horário de retorno.
  - Caso não conclua as 8 interações dentro do TTL, a memória expira e a próxima mensagem inicia um novo ciclo sem gravação anterior.
- **Navegação suporte:** qualquer página sob `/suporte/...` deve ser pública e voltar para `/suporte`.
- **Naming de URLs públicas:** usar hífen (`conversation-guide`). Nunca underline (documentado no README).
- **Wait no envio de mensagens:** workflows do n8n mantêm breves waits (~3-5s) para garantir que a Evolution (WhatsApp) finalize o envio antes do workflow encerrar.
- **Pós-conversa:** conclusão da 8ª interação dispara especialistas, gera resumo estruturado (contagem de palavras, reflexão), ajusta métricas no dashboard e concede XP/conquistas; reforçar para usuários que o painel reflete o que foi validado na última mensagem.

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
- **Proposta de valor:** “Converse com sua IA e entenda o que sua mente quer te dizer”; transformar emoções em clareza e ação diária usando WhatsApp + dashboard + interações automatizadas.
- **Público primário:** mulheres (~80%) e pessoas buscando clareza mental para tirar planos do papel.
- **Visão Free vs Premium:** Free entrega todos os blocos essenciais com limites de profundidade/quantidade; Premium amplia número de sessões (até 5/dia), histórico completo, métricas avançadas e acesso contínuo ao Mentor Virtual (reflexão guiada 24h).
- **Posicionamento:** não é terapia; atua como sistema de desenvolvimento pessoal baseado em dados emocionais e hábitos mentais.

### Autenticação e tokens
- Tokens distribuídos no onboarding WhatsApp; primeiro acesso `?token=<token>` → `authService` captura e salva.
- `AuthGuard` redireciona `/auth` → `/` se autenticado. Em dev, definir `VITE_API_BASE_URL` e `VITE_API_USE_PROXY` conforme README.
- Rotas públicas: `/blog/*`, `/suporte`, `/suporte/conversation-guide`.
- Rotas internas exigem token válido (`/`, `/auth` fallback, views do dashboard via Zustand).

### Navegação e páginas relevantes
- **/ (dashboard)**: Layout principal renderizado por `DashboardPage`, com cards, gráficos e abas (`view` controlado por store) para `dashboard`, `humorHistorico`, `insightDetail`, `conquistas`, `resumoConversas`, `sabotadorDetail`, etc.
- **Landing de campanha**: `/comecar-agora` (pública) reutiliza componentes em `src/components/landing_start`.
- **Suporte**: `/suporte/conversation-guide` permanece público para onboarding e dúvidas rápidas.
- **Fallback**: Qualquer rota não mapeada (incluindo antigos `/blog/*`) cai no `NotFound`, orientando atualização de links.

### Convenções/boas práticas para Codex
- Respeitar convenção de URLs sem underline (documento “Convenções de URL” no README).
- Ao criar uma nova view autenticada, adicionar o container em `src/pages/App` e centralizar os componentes específicos em `src/components/<NomeDaPagina>/`.
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
- `src/pages/App/*.tsx`: containers das páginas autenticadas (`DashboardPage`, `PanasDetailPage`, etc.).
- `src/components/dashboard/*`: blocos reutilizáveis da DashboardPage (cards, gráficos, seletores).
- `src/pages/Marketing/ComecarAgoraLandingPage.tsx`: landing pública de campanha.
- `src/pages/Suport/ConversationGuidePage.tsx`: página pública de suporte.
- `scripts/run-n8n-backup.mjs`: exportador de workflows.
- `docs/user_conversation_guide.md`: base de conteúdo para suporte.

### Próximos passos para novos atendimentos
- Revisar alterações recentes via `git status` (atenção a arquivos deletados/acrescentados como `bkp-n8n-bat.txt`, `docs/MindQuest-home.pdf`).
- Confirmar se a página `/suporte` e o guia `/suporte/conversation-guide` atendem à experiência desejada (cards → posts mais conteúdos podem ser adicionados facilmente).
- Ao trabalhar com workflows n8n, sempre fazer ajustes no painel e importar novamente, preservando convenção de nomes no backup.

---
Este guia deve ser compartilhado no início de novos chats para que o Codex retome rapidamente o contexto (arquitetura, convenções, processos automáticos e regras de negócio).
