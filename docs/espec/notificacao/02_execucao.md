# Notificações - Fase 2: Execução

**Data:** 2025-12-03
**Última atualização:** 2025-12-03

## Objetivo

Executar rotinas agendadas para enviar notificações aos usuários conforme suas preferências.

## Regras de Negócio

### Agendamento

- **Frequência:** A cada hora (configurável)
- **Verificação de período:** Enviar apenas no período preferido do usuário
- **Evitar duplicatas:** Verificar se notificação já foi enviada hoje

### Tipos de Lembretes

**Conversas Diárias:**
- Verificar se há conversas pendentes no dia
- Enviar apenas se `lembretes_conversas_diarias = true`

**Quests:**
- Verificar quests pendentes
- Enviar apenas se `lembretes_quests = true`

**Conquistas:**
- Verificar novas conquistas ou mudanças de nível
- Enviar apenas se `lembretes_conquistas = true`

### Filtros

- Usuário deve ter `lembretes_ativo = true`
- Canal "push" deve estar em `lembretes_canais[]`
- Deve existir token de dispositivo registrado
- Período atual deve corresponder ao `lembretes_periodo`

## Tecnologias

### Agendamento
- **n8n Schedule Trigger:** Execução periódica (cron-like)
- **Interval:** Configurável (padrão: 1 hora)

### Processamento
- **PostgreSQL:** Queries para buscar usuários e verificar pendências
- **n8n Code Nodes:** Lógica de filtragem e preparação
- **n8n Split in Batches:** Processamento em lotes (futuro)

### Envio de Push

**Web Push API:**
- Padrão W3C para notificações push
- Requer VAPID keys (chave pública/privada)
- Biblioteca: `web-push` (Node.js) ou HTTP Request para serviço externo

**Alternativas:**
- Serviço externo (OneSignal, Firebase Cloud Messaging)
- HTTP Request para API de push notifications

## Estrutura Implementada

- ✅ Workflow agendado (`job_notificacoes_lembretes`)
- ✅ Busca de usuários com notificações ativas
- ✅ Verificação de período do dia
- ✅ Busca de tokens de dispositivos
- ✅ Preparação de notificações (estrutura básica)

## Pendências

- ⏳ Implementar verificação de conversas pendentes
- ⏳ Implementar verificação de quests pendentes
- ⏳ Implementar verificação de conquistas
- ✅ Configurar VAPID keys
- ⏳ Implementar envio real de push notifications
- ⏳ Sistema de logs de notificações enviadas
- ⏳ Tratamento de erros e retry
- ⏳ Rate limiting para APIs externas

## Fluxo de Execução

```
Schedule Trigger (a cada hora)
  → Buscar Usuários com Notificações
  → Verificar Período (filtrar por período atual)
  → Buscar Tokens de Dispositivos
  → Verificar Pendências (conversas/quests/conquistas)
  → Preparar Notificações
  → Enviar Push (via Web Push API ou serviço externo)
  → Registrar Log de Envio
```

