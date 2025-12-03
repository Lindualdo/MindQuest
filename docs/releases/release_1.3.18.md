# Release 1.3.18 - Push Notifications

**Data:** 2025-12-03

APIs `/api/send-push` e `/api/push-token` criadas. Workflow n8n `job_notificacoes_lembretes` envia notificações via Vercel. `web-push` movido para dependencies. Fluxo: n8n → Vercel API → Web Push → navegador. **Status:** Pronto para deploy. Configurar VAPID keys no Vercel após deploy.

## Commits

- `af73acb` [feat] Adicionar APIs de push notification e mover web-push para dependencies
- `3d74c26` [feat] Criar utilitário para gerenciar push notifications
- `3f8d433` [feat] Criar service worker para receber notificações push
- `39d67df` [feat] Criar API para registrar tokens de push notifications
- `19d56f1` [feat] Integrar registro automático de push notifications no App
- `5c3a8b9` [feat] Criar script para gerar chaves VAPID e adicionar web-push
- `a376df6` [chore] Adicionar config/vapid-keys.json ao .gitignore
- `b8e4127` [docs] Criar documentação executiva de notificações (config, execução e status)
- `07d5782` [docs] Documentar configuração VAPID keys e atualizar status
- `e38d898` [docs] Atualizar status de notificações incluindo testes pendentes
- `de911b4` [docs] Adicionar logs de teste de notificações
- `1ac249b` [ui] Alterar campos de horário para período do dia em notificações
- `39915f1` [feat] Criar API e workflow n8n para notificações

