# Experts - Documentação Técnica

> Detalhes de implementação, arquitetura e troubleshooting

---

## Arquitetura

### Workflows

| Workflow | ID | Tipo | Descrição |
|----------|-----|------|-----------|
| `job_experts` | `BdfMcFNxLd0CbwZN` | Schedule | Agendador principal (30 min) |
| `sw_expert_v6` | `S8RDRKmUOvoynWol` | Sub-workflow | Orquestrador de experts com retry |
| `sw_xp_conversas` | `W0i3ufnDIIcx75ez` | Sub-workflow | XP de conversas (1x/dia) |
| `sw_bigfive` | `JOqIaAhynreLzGPs` | Sub-workflow | Análise de personalidade |
| `sw_sabotadores` | `rMbgvBQIx0j3XQiy` | Sub-workflow | Detecção de sabotadores |
| `sw_insights` | `HlrSjUpsESMuWGKy` | Sub-workflow | Geração de insights |
| `sw_humor` | `YJzwKg6vmlEMFEX5` | Sub-workflow | Análise humor/energia |
| `sw_emocoes` | `894DcPpjiaRYbW5J` | Sub-workflow | Detecção de emoções |
| `sw_criar_quest` | `QyIfpyS7zBCOe8AC` | Sub-workflow | Criação de quests |

---

## job_experts

### Query: Buscar Chats Pendentes

```sql
SELECT 
  c.id AS chat_id,
  c.usuario_id,
  c.data_conversa,
  c.status,
  c.total_interactions,
  c.atualizado_em,
  c.processado_em,
  u.nome_preferencia AS usr_nome_preferencia
FROM usr_chat c
JOIN usuarios u ON u.id = c.usuario_id
WHERE 
  -- Novos chats pendentes
  (c.atualizado_em > COALESCE(c.processado_em, '1970-01-01'::timestamp) 
   AND c.status != 'processando')
  -- OU chats processando com ALGUM expert com erro e tentativas < 5
  OR (
    c.status = 'processando' 
    AND EXISTS (
      SELECT 1 FROM jsonb_each(c.experts_processados) AS e(key, value)
      WHERE key NOT IN ('inicio', 'tentativas')
        AND (value->>'status') = 'erro'
        AND COALESCE((value->>'tentativas')::int, 0) < 5
    )
  )
ORDER BY c.atualizado_em DESC
LIMIT 50;
```

### Node: Marcar Processando

```sql
UPDATE usr_chat 
SET 
  status = 'processando',
  experts_processados = COALESCE(experts_processados, '{}'::jsonb) || 
    jsonb_build_object('inicio', NOW()::text)
WHERE id = $1::uuid
RETURNING id, status, experts_processados;
```

**Parâmetros:** `$1 = chat_id`

### Node: Atualizar Status Final

```sql
-- Se sucesso
UPDATE usr_chat 
SET 
  status = 'finalizado',
  processado_em = NOW()
WHERE id = $1::uuid;

-- Se erro, mantém 'processando' (nada a fazer)
```

---

## sw_expert_v6

### Fluxo de Nodes

```
start → Buscar Dados Chat → resumo conversa → Tem Contexto?
                                                    ↓ (true)
                                          Atualizar usr_chat
                                                    ↓
                                          Preparar Lista Experts
                                                    ↓
                                              Loop Experts ←─────┐
                                                    │             │
                                           (loop) → Executar Expert
                                                    ↓             │
                                               Preparar Log       │
                                                    ↓             │
                                             Gravar Log Expert ───┘
                                                    │
                                           (done) → Consolidar Resultado
```

### Node: Preparar Lista Experts

**Tipo:** Code (JavaScript)

```javascript
// v6: Prepara lista de experts para processar
const start = $('start').first().json;
const chatData = $('Buscar Dados Chat').first().json;
const ep = chatData.experts_processado || {};
const isRetry = chatData.status === 'processando';

// Mapeamento expert -> workflowId
const EXPERTS = [
  { key: 'xp_conversas', workflowId: 'W0i3ufnDIIcx75ez' },
  { key: 'bigfive', workflowId: 'JOqIaAhynreLzGPs' },
  { key: 'sabotadores', workflowId: 'rMbgvBQIx0j3XQiy' },
  { key: 'insights', workflowId: 'HlrSjUpsESMuWGKy' },
  { key: 'humor', workflowId: 'YJzwKg6vmlEMFEX5' },
  { key: 'emocoes', workflowId: '894DcPpjiaRYbW5J' },
  { key: 'quests', workflowId: 'QyIfpyS7zBCOe8AC' }
];

// Filtra: retry só erros com tentativas < 5, novo todos
const lista = EXPERTS.filter(e => {
  if (!isRetry) return true;
  const log = ep[e.key];
  if (!log) return true;
  return log.status === 'erro' && (log.tentativas || 0) < 5;
});

// Dados comuns para todos os subworkflows
const dadosComuns = {
  usuario_id: start.usuario_id,
  chat_id: start.chat_id,
  data_conversa: start.data_conversa.replace(/"/g, ''),
  usr_nome_preferencia: start.usr_nome_preferencia || chatData.usr_nome_preferencia,
  total_interactions: chatData.total_interactions || 0
};

// Retorna cada expert como item separado
return lista.map(e => ({
  json: {
    expert_key: e.key,
    workflow_id: e.workflowId,
    ...dadosComuns,
    experts_processado: ep
  }
}));
```

### Node: Executar Expert

**Tipo:** Execute Workflow  
**Propriedades:**
- `continueOnFail: true` → Não para se falhar
- `workflowId: {{ $json.workflow_id }}` → Dinâmico
- `workflowInputs`:
  ```json
  {
    "usuario_id": "={{ $json.usuario_id }}",
    "chat_id": "={{ $json.chat_id }}",
    "data_conversa": "={{ $json.data_conversa }}",
    "usr_nome_preferencia": "={{ $json.usr_nome_preferencia }}",
    "total_interactions": "={{ $json.total_interactions }}"
  }
  ```

### Node: Preparar Log

**Tipo:** Code (JavaScript)

```javascript
// Pega dados do item atual do loop
const loopItem = $('Loop Experts').item.json;

// Pega resultado da execução (pode ter erro ou sucesso)
const execResult = $input.item.json;
const hasError = !!execResult.error;
const errorMsg = hasError ? (execResult.error.message || 'Erro desconhecido') : null;

return [{
  json: {
    chat_id: loopItem.chat_id,
    expert_key: loopItem.expert_key,
    has_error: hasError,
    error_message: errorMsg
  }
}];
```

### Node: Gravar Log Expert

**Tipo:** Postgres  
**Query:**

```sql
-- v6: Grava log do expert processado
UPDATE usr_chat 
SET experts_processados = COALESCE(experts_processados, '{}'::jsonb) || 
  jsonb_build_object($2::text, jsonb_build_object(
    'status', CASE WHEN $3::boolean THEN 'erro' ELSE 'sucesso' END,
    'tentativas', COALESCE((experts_processados->$2::text->>'tentativas')::int, 0) + 1,
    'data', NOW()::text,
    'erro', CASE WHEN $3::boolean THEN $4::text ELSE null END
  ))
WHERE id = $1::uuid
RETURNING id, experts_processados;
```

**Parâmetros:**
```javascript
={{ [
  $json.chat_id,           // $1
  $json.expert_key,        // $2
  $json.has_error,         // $3
  $json.error_message      // $4
] }}
```

**Propriedades:**
- `continueOnFail: true` → Se gravar log falhar, continua

### Node: Consolidar Resultado

**Tipo:** Code (JavaScript)

```javascript
// v6: Consolida resultado lendo logs do banco
const chatId = $('start').first().json.chat_id;

// Busca últimos logs gravados no banco
const allItems = $('Gravar Log Expert').all();

let temErro = false;
const resultados = {};

for (const item of allItems) {
  const ep = item.json.experts_processados || {};
  for (const key of Object.keys(ep)) {
    if (ep[key] && ep[key].status) {
      resultados[key] = ep[key].status;
      if (ep[key].status === 'erro') temErro = true;
    }
  }
}

return [{
  json: {
    chat_id: chatId,
    sucesso: !temErro,
    resultados: resultados,
    motivo: temErro ? 'Alguns experts falharam' : 'Todos experts processados'
  }
}];
```

---

## Troubleshooting

### Expert não gravou log

**Sintoma:** Expert executou mas `experts_processados` não foi atualizado.

**Causas:**
1. **Erro na expressão `queryReplacement`:**
   - Verificar `=={{ }}` (dois `=` não funciona)
   - Correto: `={{ [] }}`

2. **Referência de contexto perdida:**
   - `$('Loop Experts').item.json` perde contexto com `continueOnFail: true`
   - Solução: usar `$items('Loop Experts')[0].json`

3. **Conexão incorreta:**
   - Loop deve conectar: `Executar Expert → Preparar Log → Gravar Log → Loop`

### Chat fica em 'processando' eternamente

**Sintoma:** Chat nunca muda para `finalizado`.

**Causas:**
1. **Query de retry não encontra experts com erro:**
   - Verificar estrutura de `experts_processados`
   - Query busca por `(value->>'status') = 'erro'`

2. **Consolidar retorna sucesso mesmo com erros:**
   - Verificar lógica de leitura de logs
   - Deve ler de `$('Gravar Log Expert').all()`, não do input

### Expert processado múltiplas vezes no mesmo dia

**Sintoma:** XP duplicado ou dados sobrescritos incorretamente.

**Expert específico:**
- `xp_conversas`: Deve validar se já processou hoje (tabela `quests_recorrencias`)
- Outros experts: Comportamento UPSERT correto (média ou sobrescreve)

---

## Constraints e Índices

### usr_chat

```sql
-- Status válidos
ALTER TABLE usr_chat ADD CONSTRAINT usr_chat_status_check 
  CHECK (status IN ('completa', 'incompleta', 'processada', 'em_andamento', 'finalizado', 'processando'));

-- Índice para busca de pendentes
CREATE INDEX idx_usr_chat_status_atualizado 
  ON usr_chat (status, atualizado_em);
```

### experts_processados

```sql
-- Índice GIN para busca em JSONB
CREATE INDEX idx_usr_chat_experts_processados 
  ON usr_chat USING GIN (experts_processados);
```

---

## Monitoramento

### Query: Chats com erros

```sql
SELECT 
  c.id,
  c.usuario_id,
  c.status,
  c.experts_processados
FROM usr_chat c
WHERE c.status = 'processando'
  AND EXISTS (
    SELECT 1 FROM jsonb_each(c.experts_processados) AS e(key, value)
    WHERE (value->>'status') = 'erro'
  );
```

### Query: Taxa de sucesso por expert

```sql
SELECT 
  expert,
  COUNT(*) FILTER (WHERE status = 'sucesso') AS sucessos,
  COUNT(*) FILTER (WHERE status = 'erro') AS erros,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'sucesso')::numeric / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) AS taxa_sucesso
FROM usr_chat,
     jsonb_each(experts_processados) AS e(expert, log)
WHERE expert NOT IN ('inicio', 'tentativas')
GROUP BY expert;
```

---

*Última atualização: 2025-12-21*

