# Release 1.3.21 - Notificações Inteligentes (Push + WhatsApp)

**Data:** 2025-12-06
**Última atualização:** 2025-12-06 00:35
**Status:** ✅ Concluído

## Resumo Executivo

| Fase | Status | Progresso |
|------|--------|-----------|
| **Configuração** | ✅ Concluído | 100% |
| **Infraestrutura Push** | ✅ Concluído | 100% |
| **Notificação Push** | ✅ Concluído | 100% |
| **Notificação WhatsApp** | ✅ Concluído | 100% |
| **Notificações Inteligentes v2** | ✅ Concluído | 100% |

---

## Fase 1: Configuração

### ✅ Concluído

- [x] Página de configurações de notificações
- [x] Campos de período (manhã/tarde/noite)
- [x] Seleção de canais (push, whatsapp, email, sms)
- [x] Tabela `notificacoes` no banco de dados
- [x] API de configurações (`api/notificacoes.ts`)
- [x] Workflow n8n para salvar configurações
- [x] Integração automática no App.tsx

---

## Fase 2: Infraestrutura Push

### ✅ Concluído

- [x] **Service Worker** (`public/sw.js`)
  - [x] Instalação e ativação
  - [x] Handler de eventos push
  - [x] Processamento de payload (JSON e texto)
  - [x] Exibição de notificações
  - [x] Handler de clique em notificação
  - [x] Testado e funcionando em produção

- [x] **VAPID Keys**
  - [x] Geração de chaves VAPID
  - [x] Configuração `VAPID_PUBLIC_KEY` na Vercel
  - [x] Configuração `VAPID_PRIVATE_KEY` na Vercel
  - [x] Configuração `VITE_VAPID_PUBLIC_KEY` na Vercel
  - [x] Documentação atualizada

- [x] **Utilitário de Push** (`src/utils/pushNotifications.ts`)
  - [x] Registro automático de Service Worker
  - [x] Solicitação de permissão
  - [x] Criação de subscription
  - [x] Captura de token
  - [x] Integração com API

- [x] **API de Push**
  - [x] API de registro de tokens (`/api/push-token`)
  - [x] API de envio de push (`/api/send-push`)
  - [x] Validação de VAPID keys
  - [x] Tratamento de erros (410, 404, 429)
  - [x] Testado e funcionando

- [x] **Workflow n8n**
  - [x] Workflow de registro de tokens (`webhook_push_token`)
  - [x] Persistência no banco (`dispositivos_push`)
  - [x] Atualização de tokens existentes

- [x] **Banco de Dados**
  - [x] Tabela `dispositivos_push` criada
  - [x] Estrutura de dados validada

- [x] **Testes**
  - [x] Service Worker recebe push ✅
  - [x] Payload processado corretamente ✅
  - [x] Notificação exibida com sucesso ✅
  - [x] API retorna status 201 (FCM confirmou) ✅
  - [x] Fluxo completo testado em produção ✅

---

## Fase 3: Execução - notificação push

### ✅ Concluído

- [x] Workflow agendado (`job_notificacoes_lembretes`)
- [x] Busca de usuários com notificações ativas
- [x] Verificação de período do dia
- [x] Busca de tokens de dispositivos
- [x] Preparação de notificações (array de tokens)
- [x] Verificação de conversas pendentes
- [x] Verificação de quests pendentes
- [x] Envio de push via API (`/api/send-push`)
- [x] Processamento de resposta
- [x] Sistema de logs básico
- [x] Correção de conversão base64 (ArrayBuffer)
- [x] Teste de workflow completo (execução manual)

---

## Fase 4: Notificações Inteligentes v2

### ✅ Concluído

Workflow: `job_notificacoes_lembretes` (ID: `i5VG5rHZ39ytueyu`)

#### Arquitetura
- [x] Query consolidada de contexto (usuário, XP, streaks, conversas, quests)
- [x] Separação de notificações: **Conversa** vs **Ação**
- [x] Agentes de IA (OpenRouter) para mensagens personalizadas
- [x] Output Parser estruturado para respostas JSON
- [x] Fallback para mensagens padrão se IA falhar

#### Inteligência de Horários
- [x] Janelas por período configurado pelo usuário:
  - Manhã: Conversa 7-8h, Ação 10-11h
  - Tarde: Conversa 13-14h, Ação 16-17h
  - Noite: Conversa 19-22h, Ação 21-22h
- [x] Fallback para execução manual (escolhe tipo baseado nos dados)

#### Anti-Spam
- [x] Máximo 2 notificações/dia (1 conversa + 1 ação)
- [x] Verificação de notificações já enviadas (`tipos_notificados_hoje`)
- [x] Log com `WHERE NOT EXISTS` para evitar duplicatas

#### Mensagens Personalizadas
- [x] Contexto completo para IA: nome, nível, streak, última conversa, quests
- [x] Priorização de quests: atrasadas > hoje > não planejadas
- [x] Diversificação: 1 quest sabotador + 1 quest objetivo
- [x] Tom acolhedor alinhado com filosofia MindQuest

#### Canais
- [x] Push: título curto + corpo conciso
- [x] WhatsApp: mensagem completa + sugestões de resposta + contexto mentor
- [x] Email: estrutura preparada (TODO)

#### Banco de Dados
- [x] Tabela `notificacoes_log` com campos adicionais:
  - `titulo`, `contexto_mentor`, `quests_mencionadas`

---

## Testes Realizados

### ✅ Infraestrutura Push

- [x] Service Worker instalado e ativado
- [x] Push recebido pelo Service Worker
- [x] Payload processado (JSON e texto)
- [x] Notificação exibida no sistema
- [x] Clique em notificação funciona
- [x] VAPID keys configuradas corretamente
- [x] Token capturado e formatado
- [x] API `/api/send-push` funcionando
- [x] FCM retorna status 201 (entrega confirmada)

### ✅ Testes v2

- [x] Query de contexto completo executando corretamente
- [x] Determinação de tipo de notificação funcionando
- [x] Agentes de IA gerando mensagens personalizadas
- [x] Envio Push funcionando (múltiplos tokens)
- [x] Envio WhatsApp funcionando (via Evolution API)
- [x] Logs gravados sem duplicatas
- [x] Fallback para execução manual

### ⏳ Melhorias Futuras

- [ ] Verificação de conquistas recentes
- [ ] Rate limiting para APIs externas
- [ ] Processamento em lotes para múltiplos usuários
- [ ] Monitoramento e métricas de entrega
- [ ] Limpeza automática de tokens expirados (410)
- [ ] Teste em diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Teste em dispositivos móveis (iOS, Android)

---

## Próximos Passos

1. ✅ **Infraestrutura Push** - Concluído
2. ✅ **Verificação de pendências** - Concluído (conversas/quests)
3. ✅ **Integração de envio de push** - Concluído
4. ✅ **Testes end-to-end** - Concluído
5. ✅ **Notificações Inteligentes v2** - Concluído
6. **Ativar workflow agendado** (Schedule Trigger) - habilitar após validação
7. **Monitorar entregas** e ajustar prompts conforme feedback

---

## Métricas de Sucesso

- ✅ Usuários podem configurar notificações
- ✅ Tokens são registrados automaticamente
- ✅ Service Worker funcionando em produção
- ✅ API de envio funcionando
- ✅ Notificações são processadas corretamente pelo Service Worker
- ✅ Workflow verifica período correto (manhã/tarde/noite)
- ✅ Workflow envia para todos os dispositivos do usuário
- ✅ FCM confirma recebimento das notificações
- ✅ Mensagens personalizadas via IA
- ✅ Sem duplicatas de notificações (implementado com WHERE NOT EXISTS)
- ✅ WhatsApp integrado via Evolution API
- ⏳ Taxa de entrega visual > 95% (depende de configurações do SO)

---

## Arquivos Principais

### Frontend
- `public/sw.js` - Service Worker
- `src/utils/pushNotifications.ts` - Utilitário de push
- `src/components/notificacoes/ConfiguracoesNotificacoes.tsx` - UI de configuração

### Backend
- `api/push-token.ts` - API de registro de tokens
- `api/send-push.ts` - API de envio de push

### n8n Workflows
- `job_notificacoes_lembretes_v2` (ID: `i5VG5rHZ39ytueyu`) - Workflow principal
- `sw_evolution_send_message_v2` (ID: `DJB5qWudX1Hqap1O`) - Subworkflow WhatsApp

### Banco de Dados
- `notificacoes` - Configurações do usuário
- `notificacoes_log` - Log de envios (com campos: titulo, contexto_mentor, quests_mencionadas)
- `dispositivos_push` - Tokens de dispositivos
- `usuarios_conquistas` - XP, nível, streak
- `usuarios_quest` - Quests ativas
- `quests_recorrencias` - Planejamento de quests

### Documentação
- `docs/espec/notificacao/plano_lembretes_executivo.md` - Visão executiva
- `docs/espec/notificacao/plano_lembretes_tecnico.md` - Detalhes técnicos

---

## Problemas Resolvidos

### Fase 1-3 (Push)
1. ✅ **Service Worker não processava push** - Corrigido tratamento síncrono de `event.data.text()`
2. ✅ **VAPID keys incorretas** - Documentação atualizada com chaves corretas
3. ✅ **Variável `VITE_VAPID_PUBLIC_KEY` faltando** - Adicionada na Vercel
4. ✅ **Erro de sintaxe no dataAdapter** - Corrigido `const` para `let` em `proximosNiveis`
5. ✅ **Conversão base64 corrompendo tokens** - Implementada função segura `arrayBufferToBase64()`
6. ✅ **Workflow enviando para 1 token apenas** - Corrigido para enviar para todos os dispositivos (array de tokens)
7. ✅ **p256dh com tamanho incorreto** - Corrigida conversão ArrayBuffer para base64

### Fase 4 (Notificações Inteligentes v2)
8. ✅ **Log duplicando registros** - Implementado `WHERE NOT EXISTS` no INSERT
9. ✅ **Nodes de IA incorretos** - Corrigido para usar `lmChatOpenRouter` + `agent` + `outputParserStructured`
10. ✅ **Tabela `usuarios_jornada` inexistente** - Removida referência, dados vindos de `usuarios_conquistas`
11. ✅ **Coluna `xp_ganho` inexistente** - Corrigido para usar `xp_total` de `usuarios_conquistas`
12. ✅ **Nome tabela incorreto** - Corrigido `usuarios_quests` → `usuarios_quest`
13. ✅ **Node sem saída fora do horário** - Expandidas janelas de horário + fallback para execução manual
14. ✅ **Referência a node inexistente** - Removida referência ao trigger manual no código
15. ✅ **Switch node erro `caseSensitive`** - Adicionado `singleValue: true` ao operador

---

## Release Notes

### 🚀 Novidades da versão 1.3.21

**Notificações Inteligentes com IA**

O MindQuest agora envia lembretes personalizados que entendem seu contexto e momento.

#### O que mudou?

| Antes | Agora |
|-------|-------|
| Mensagens genéricas | Mensagens personalizadas com seu nome e contexto |
| Horário fixo | Horário adaptado ao seu período preferido |
| Uma notificação única | Duas notificações distintas: conversa + ação |
| Texto padrão | IA gera mensagens únicas baseadas no seu progresso |

#### Tipos de Notificação

1. **Convite para Conversa**
   - Reconhece seu esforço e conquistas recentes
   - Faz referência à última conversa
   - Convida de forma acolhedora, sem pressionar

2. **Lembrete de Ação**
   - Destaca quests pendentes mais relevantes
   - Conecta a ação ao seu objetivo ou sabotador
   - Sugere micro-compromissos (5 min, 1 passo)

#### Canais Disponíveis

- ✅ **Push** - Notificações no navegador/celular
- ✅ **WhatsApp** - Mensagens com sugestões de resposta
- ⏳ **Email** - Em breve

#### Horários de Envio

| Período | Conversa | Ação |
|---------|----------|------|
| Manhã | 7h-8h | 10h-11h |
| Tarde | 13h-14h | 16h-17h |
| Noite | 19h-22h | 21h-22h |

#### Proteção Anti-Spam

- Máximo 2 notificações por dia
- Não envia se você já conversou hoje
- Não repete a mesma notificação no mesmo dia

---

### 📋 Para Ativação

1. Acesse **Configurações > Notificações**
2. Ative os lembretes
3. Escolha seu período preferido
4. Selecione os canais desejados
5. Pronto! As notificações começarão automaticamente
