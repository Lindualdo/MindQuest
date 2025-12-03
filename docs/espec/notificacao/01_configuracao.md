# Notificações - Fase 1: Configuração

**Data:** 2025-12-03
**Última atualização:** 2025-12-03

## Objetivo

Permitir que usuários configurem preferências de notificações: tipos de mensagens, período do dia e canais de entrega.

## Regras de Negócio

### Tipos de Notificações

**Conversas Direcionadas da IA (WhatsApp):**
- Mensagens motivacionais
- Alertas sobre sabotadores detectados
- Resumo semanal

**Lembretes:**
- Conversas diárias pendentes
- Quests pendentes
- Conquistas e mudanças de nível

### Período do Dia

- **Manhã:** 6h - 12h
- **Tarde:** 12h - 18h
- **Noite:** 18h - 6h

Usuário escolhe um período preferido por tipo de notificação.

### Canais de Notificação

- **Push:** Notificações no celular (Web Push API)
- **WhatsApp:** Mensagens via API WhatsApp
- **E-mail:** Envio via SMTP
- **SMS:** Integração com API SMS

Usuário pode selecionar múltiplos canais.

## Tecnologias

### Frontend
- **React/TypeScript:** Interface de configuração
- **Service Worker:** Recepção de push notifications
- **Web Push API:** Padrão W3C para notificações push

### Backend
- **PostgreSQL:** Armazenamento de configurações e tokens
- **n8n:** Workflow para registro de tokens
- **Next.js API Routes:** Proxy para webhooks n8n

### Banco de Dados

**Tabela `notificacoes`:**
- Configurações por usuário (UNIQUE usuario_id)
- Campos de período: `conversas_ia_periodo`, `lembretes_periodo`
- Array de canais: `lembretes_canais[]`
- CHECK constraints para validar períodos

**Tabela `dispositivos_push`:**
- Tokens de dispositivos por usuário
- UNIQUE(usuario_id, token)
- Armazena user_agent para identificação

## Estrutura Implementada

- ✅ Página de configurações (`NotificacoesPageV13.tsx`)
- ✅ API de configurações (`api/notificacoes.ts`)
- ✅ Workflow n8n de configurações (`webhook_notificacoes`)
- ✅ Tabelas no banco de dados
- ✅ Service Worker básico (`public/sw.js`)
- ✅ Utilitário de push (`src/utils/pushNotifications.ts`)
- ✅ API de registro de tokens (`api/push-token.ts`)
- ✅ Workflow n8n de registro (`webhook_push_token`)

## Pendências

- ⏳ Configuração de VAPID keys para Web Push
- ⏳ Testes de registro de tokens
- ⏳ Validação de permissões do usuário

