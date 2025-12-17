# Plano de Melhoria - Notificações de Lembretes
## Versão Técnica

**Data:** 2025-12-05  
**Workflow antigo:** `job_notificacoes_lembretes` (ID: `uhyvgbzJl1r1LXoV`)  
**Workflow novo:** `job_notificacoes_lembretes_v2` (ID: `i5VG5rHZ39ytueyu`)  
**Status:** ✅ Implementado

---

## 1. Análise do Workflow Atual

### 1.1 Estrutura de Nodes (14 total)

| Node | Tipo | Função | Problema |
|------|------|--------|----------|
| Manual Trigger | manualTrigger | Disparo teste | Sem scheduler |
| Buscar Usuários | postgres | Query inicial | OK |
| Verificar Período | code | Filtro JS período | OK |
| Buscar Tokens Push | postgres | Query por usuário | N+1 queries |
| Buscar WhatsApp | postgres | Query por usuário | N+1 queries |
| Verificar Conversas | postgres | Query por usuário | N+1 queries |
| Verificar Quests | postgres | Query por usuário | N+1 queries |
| Merge Dados | merge | 4 inputs | Gera duplicação |
| Preparar Notificações | code | Agrupamento | 130 linhas |
| Switch Canal | switch | Push/WhatsApp | OK |
| Enviar Push | httpRequest | API push | OK |
| config | dataTable | Busca config | Redundante |
| sw_evolution | executeWorkflow | WhatsApp | OK |
| end | noOp | Finalização | OK |

### 1.2 Problemas Identificados

1. **Sem controle de reenvio**
   - Não existe log de notificações enviadas
   - Cada execução reenvia para todos os usuários

2. **N+1 Queries**
   - 4 queries adicionais por usuário
   - 10 usuários = 40 queries extras

3. **Multiplicação no Merge**
   - Execução real: 1 usuário gerou 19 items
   - Causa: merge de 4 branches multiplica dados

4. **Sem scheduler**
   - Apenas trigger manual
   - Não há automação de envio

5. **Canais não implementados**
   - SMS: estrutura ausente
   - Email: estrutura ausente

### 1.3 Subworkflow Existente

**`sw_evolution_send_message_v2`** (ID: `DJB5qWudX1Hqap1O`)

```
Inputs:
- instanceName: string (ex: "MindQuest")
- remoteJidOrNumber: string (número WhatsApp)
- messageText: string (mensagem)
- linkPreview: string ("true"/"false")
- minDelayMs: string (delay em ms)

Fluxo interno:
start → Normalize JID → Min Delay → Send Message (Evolution API) → Classify Result
```

---

## 2. Solução Proposta

### 2.1 Nova Tabela: `notificacoes_log`

```sql
-- Criar tabela de log
CREATE TABLE notificacoes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  canal VARCHAR(20) NOT NULL,      -- push, whatsapp, sms, email
  tipo VARCHAR(30) NOT NULL,       -- lembrete_conversa, lembrete_quest, interacao
  referencia_id UUID,              -- id da conversa/quest (opcional)
  mensagem TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'enviado', -- enviado, falha
  erro TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_notificacoes_log_usuario 
  ON notificacoes_log(usuario_id, criado_em);

CREATE INDEX idx_notificacoes_log_dedup 
  ON notificacoes_log(usuario_id, tipo, DATE(criado_em));

-- Comentários
COMMENT ON TABLE notificacoes_log IS 'Log de notificações enviadas para controle de reenvio';
COMMENT ON COLUMN notificacoes_log.tipo IS 'Tipos: lembrete_conversa, lembrete_quest, interacao';
COMMENT ON COLUMN notificacoes_log.canal IS 'Canais: push, whatsapp, sms, email';
```

### 2.2 Query Consolidada

Substitui 5 queries por 1 única:

```sql
WITH usuario_config AS (
  SELECT 
    n.usuario_id,
    n.lembretes_periodo,
    n.lembretes_conversas_diarias,
    n.lembretes_quests,
    n.lembretes_canais,
    u.whatsapp_numero,
    ARRAY_AGG(DISTINCT dp.token) FILTER (WHERE dp.token IS NOT NULL) AS push_tokens
  FROM notificacoes n
  JOIN usuarios u ON u.id = n.usuario_id
  LEFT JOIN dispositivos_push dp ON dp.usuario_id = n.usuario_id
  WHERE n.lembretes_ativo = true
  GROUP BY n.usuario_id, n.lembretes_periodo, n.lembretes_conversas_diarias, 
           n.lembretes_quests, n.lembretes_canais, u.whatsapp_numero
),
conversas_hoje AS (
  SELECT usuario_id, COUNT(*) > 0 AS teve_conversa
  FROM usr_chat 
  WHERE DATE(criado_em) = CURRENT_DATE
  GROUP BY usuario_id
),
quests_pendentes AS (
  SELECT 
    uq.usuario_id,
    COUNT(*) AS total_quests,
    ARRAY_AGG(COALESCE(uq.config->>'titulo', 'Quest')) AS titulos_quests
  FROM quests_recorrencias qr
  JOIN usuarios_quest uq ON uq.id = qr.usuarios_quest_id
  WHERE qr.data_planejada = CURRENT_DATE AND qr.status = 'pendente'
  GROUP BY uq.usuario_id
),
ja_notificado AS (
  SELECT usuario_id, tipo
  FROM notificacoes_log
  WHERE DATE(criado_em) = CURRENT_DATE
    AND tipo IN ('lembrete_conversa', 'lembrete_quest')
)
SELECT 
  uc.usuario_id,
  uc.lembretes_periodo,
  uc.lembretes_conversas_diarias,
  uc.lembretes_quests,
  uc.lembretes_canais,
  uc.whatsapp_numero,
  uc.push_tokens,
  COALESCE(ch.teve_conversa, false) AS teve_conversa_hoje,
  COALESCE(qp.total_quests, 0) AS quests_pendentes,
  qp.titulos_quests,
  EXISTS(SELECT 1 FROM ja_notificado jn 
         WHERE jn.usuario_id = uc.usuario_id 
         AND jn.tipo = 'lembrete_conversa') AS ja_notificou_conversa,
  EXISTS(SELECT 1 FROM ja_notificado jn 
         WHERE jn.usuario_id = uc.usuario_id 
         AND jn.tipo = 'lembrete_quest') AS ja_notificou_quest
FROM usuario_config uc
LEFT JOIN conversas_hoje ch ON ch.usuario_id = uc.usuario_id
LEFT JOIN quests_pendentes qp ON qp.usuario_id = uc.usuario_id;
```

### 2.3 Estrutura do Novo Workflow

```
[Schedule Trigger] (8h, 13h, 19h)
    ↓
[Query Consolidada] (Postgres)
    ↓
[Filtrar e Preparar] (Code)
    ↓
[Switch Canal]
    ├─→ Output 0: [Push] → HTTP Request → [Log Push]
    ├─→ Output 1: [WhatsApp] → config → sw_evolution → [Log WhatsApp]
    ├─→ Output 2: [SMS] → NoOp (TODO)
    └─→ Output 3: [Email] → NoOp (TODO)
```

### 2.4 Especificação dos Nodes

#### Node 1: Schedule Trigger

```json
{
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2,
  "parameters": {
    "rule": {
      "interval": [
        { "field": "cronExpression", "expression": "0 8,13,19 * * *" }
      ]
    }
  }
}
```

#### Node 2: Query Consolidada

```json
{
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.6,
  "parameters": {
    "operation": "executeQuery",
    "query": "-- SQL do item 2.2 --",
    "options": {}
  },
  "credentials": { "postgres": { "id": "8ySWxtSO7gYK5uue", "name": "Postgres account" } }
}
```

#### Node 3: Filtrar e Preparar (Code)

```javascript
// Determinar período atual
const horaAtual = new Date().getHours();
let periodoAtual = 'noite';
if (horaAtual >= 6 && horaAtual < 12) periodoAtual = 'manha';
else if (horaAtual >= 12 && horaAtual < 18) periodoAtual = 'tarde';

const notificacoes = [];

for (const item of $input.all()) {
  const u = item.json;
  
  // Filtrar por período configurado
  if (u.lembretes_periodo !== periodoAtual) continue;
  
  const mensagens = [];
  const tipos = [];
  
  // Verificar conversa pendente
  if (u.lembretes_conversas_diarias && !u.teve_conversa_hoje && !u.ja_notificou_conversa) {
    mensagens.push('Você ainda não fez sua conversa diária hoje');
    tipos.push('lembrete_conversa');
  }
  
  // Verificar quests pendentes
  if (u.lembretes_quests && u.quests_pendentes > 0 && !u.ja_notificou_quest) {
    const qtd = u.quests_pendentes;
    mensagens.push(`Você tem ${qtd} quest${qtd > 1 ? 's' : ''} pendente${qtd > 1 ? 's' : ''}`);
    tipos.push('lembrete_quest');
  }
  
  // Só continuar se houver pendências
  if (mensagens.length === 0) continue;
  
  const corpo = mensagens.join('. ') + '.';
  const titulo = 'MindQuest - Lembretes';
  
  // Gerar notificação para cada canal habilitado
  for (const canal of u.lembretes_canais || []) {
    if (canal === 'push' && u.push_tokens?.length > 0) {
      for (const token of u.push_tokens) {
        notificacoes.push({
          usuario_id: u.usuario_id,
          canal: 'push',
          token,
          titulo,
          corpo,
          tipos
        });
      }
    } else if (canal === 'whatsapp' && u.whatsapp_numero) {
      notificacoes.push({
        usuario_id: u.usuario_id,
        canal: 'whatsapp',
        whatsapp_numero: u.whatsapp_numero,
        titulo,
        corpo,
        tipos
      });
    } else if (canal === 'sms') {
      notificacoes.push({
        usuario_id: u.usuario_id,
        canal: 'sms',
        titulo,
        corpo,
        tipos,
        _todo: true
      });
    } else if (canal === 'email') {
      notificacoes.push({
        usuario_id: u.usuario_id,
        canal: 'email',
        titulo,
        corpo,
        tipos,
        _todo: true
      });
    }
  }
}

return notificacoes.map(n => ({ json: n }));
```

#### Node 4: Switch Canal

```json
{
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3.2,
  "parameters": {
    "rules": {
      "values": [
        { "conditions": { "conditions": [{ "leftValue": "={{ $json.canal }}", "rightValue": "push", "operator": { "type": "string", "operation": "equals" } }] } },
        { "conditions": { "conditions": [{ "leftValue": "={{ $json.canal }}", "rightValue": "whatsapp", "operator": { "type": "string", "operation": "equals" } }] } },
        { "conditions": { "conditions": [{ "leftValue": "={{ $json.canal }}", "rightValue": "sms", "operator": { "type": "string", "operation": "equals" } }] } },
        { "conditions": { "conditions": [{ "leftValue": "={{ $json.canal }}", "rightValue": "email", "operator": { "type": "string", "operation": "equals" } }] } }
      ]
    }
  }
}
```

#### Node 5: Enviar Push

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "parameters": {
    "method": "POST",
    "url": "https://mindquest.pt/api/send-push",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "token", "value": "={{ $json.token }}" },
        { "name": "titulo", "value": "={{ $json.titulo }}" },
        { "name": "corpo", "value": "={{ $json.corpo }}" },
        { "name": "usuario_id", "value": "={{ $json.usuario_id }}" },
        { "name": "tipo", "value": "lembrete" }
      ]
    }
  }
}
```

#### Node 6: Config (DataTable)

```json
{
  "type": "n8n-nodes-base.dataTable",
  "typeVersion": 1,
  "parameters": {
    "operation": "get",
    "dataTableId": { "__rl": true, "value": "fVrO1PaqFuA957u0", "mode": "list" }
  }
}
```

#### Node 7: WhatsApp (Execute Workflow)

```json
{
  "type": "n8n-nodes-base.executeWorkflow",
  "typeVersion": 1.3,
  "parameters": {
    "workflowId": { "__rl": true, "value": "DJB5qWudX1Hqap1O", "mode": "list" },
    "workflowInputs": {
      "mappingMode": "defineBelow",
      "value": {
        "instanceName": "={{ $json.Instancia_evolution }}",
        "remoteJidOrNumber": "={{ $('Switch Canal').item.json.whatsapp_numero }}",
        "messageText": "={{ $('Switch Canal').item.json.corpo }}",
        "minDelayMs": "2000"
      }
    }
  }
}
```

#### Node 8: Log Envio (Postgres)

```json
{
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.6,
  "parameters": {
    "operation": "executeQuery",
    "query": "INSERT INTO notificacoes_log (usuario_id, canal, tipo, mensagem, status) SELECT $1::uuid, $2, unnest($3::text[]), $4, 'enviado'",
    "options": {
      "queryReplacement": "={{ [$json.usuario_id, $json.canal, $json.tipos, $json.corpo] }}"
    }
  }
}
```

#### Node 9-10: SMS/Email (NoOp - Placeholder)

```json
{
  "type": "n8n-nodes-base.noOp",
  "typeVersion": 1,
  "name": "SMS (TODO)"
}
```

---

## 3. Conexões do Workflow

```
Schedule Trigger → Query Consolidada → Filtrar e Preparar → Switch Canal

Switch Canal (output 0) → Enviar Push → Log Push
Switch Canal (output 1) → Config → WhatsApp → Log WhatsApp
Switch Canal (output 2) → SMS (TODO)
Switch Canal (output 3) → Email (TODO)
```

---

## 4. Checklist de Implementação

- [ ] Criar tabela `notificacoes_log` no Postgres
- [ ] Criar novo workflow `job_notificacoes_lembretes_v2`
- [ ] Configurar Schedule Trigger
- [ ] Implementar Query Consolidada
- [ ] Implementar Code de filtro/preparação
- [ ] Configurar Switch Canal (4 outputs)
- [ ] Conectar Push (manter lógica existente)
- [ ] Conectar WhatsApp (manter config + subworkflow)
- [ ] Adicionar placeholders SMS/Email
- [ ] Implementar Log de envio
- [ ] Testar com trigger manual
- [ ] Ativar schedule
- [ ] Arquivar workflow antigo

---

## 5. Rollback

Em caso de problemas:

1. Desativar novo workflow
2. Reativar workflow antigo (ID: `uhyvgbzJl1r1LXoV`)
3. Tabela `notificacoes_log` pode permanecer (não afeta sistema)
