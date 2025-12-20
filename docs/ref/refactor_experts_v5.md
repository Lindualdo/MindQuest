# Refactor v5 - Controle Individual de Experts com Retry

**Data:** 2025-12-20

## Objetivo

Resolver loop infinito do `job_experts` quando um expert falha, implementando:
- Controle individual por expert via `usr_chat.experts_processados` (jsonb)
- Retry com limite (máx 5 tentativas)
- Reprocessamento seletivo (apenas experts com erro)
- Status de bloqueio para experts com falhas consecutivas

---

## Estrutura `experts_processados`

```json
{
  "sabotadores": {
    "processado_em": "2025-12-20T10:30:00",
    "status": "sucesso|erro|bloqueado",
    "tentativas": 0,
    "ultimo_erro_em": "2025-12-20T10:30:00",  // só se status=erro
    "ultimo_erro_msg": "mensagem"              // só se status=erro
  },
  "emocoes": {...},
  "humor": {...},
  "bigfive": {...},
  "insights": {...}
}
```

---

## Migration SQL

```sql
-- Adicionar coluna experts_processados
ALTER TABLE usr_chat 
ADD COLUMN IF NOT EXISTS experts_processados jsonb DEFAULT '{}'::jsonb;

-- Índice para queries
CREATE INDEX IF NOT EXISTS idx_usr_chat_experts_processados 
ON usr_chat USING gin (experts_processados);
```

---

## job_experts_v5

### Query: Buscar Chats Pendentes

```sql
-- Regra 1: Nova conversa (atualizado_em > processado_em)
WITH chats_novos AS (
  SELECT chat_id, usuario_id, ..., 'nova_conversa' AS motivo, '[]'::jsonb AS experts_retry
  FROM usr_chat c
  WHERE c.atualizado_em > COALESCE(c.processado_em, '1970-01-01'::timestamp)
),
-- Regra 2: Expert com erro (status='erro' e tentativas < 5)
chats_com_erro AS (
  SELECT chat_id, usuario_id, ..., 'expert_com_erro' AS motivo,
    jsonb_agg(jsonb_build_object('expert', expert_key, 'tentativas', ...)) AS experts_retry
  FROM usr_chat c,
  LATERAL jsonb_each(c.experts_processados) AS expert(expert_key, expert_value)
  WHERE c.atualizado_em <= COALESCE(c.processado_em, NOW())
    AND expert_value->>'status' = 'erro'
    AND COALESCE((expert_value->>'tentativas')::int, 0) < 5
  GROUP BY c.id, ...
)
SELECT * FROM chats_novos UNION SELECT * FROM chats_com_erro
ORDER BY atualizado_em DESC LIMIT 50;
```

### Fluxo

1. **Schedule Trigger** (30min)
2. **Buscar Chats Pendentes** → retorna `motivo` + `experts_retry`
3. **Loop Over Items**
4. **Preparar Dados** → define `experts_para_processar`:
   - Se `motivo='nova_conversa'`: todos experts
   - Se `motivo='expert_com_erro'`: apenas experts com erro
5. **Marcar Processamento** → `UPDATE usr_chat SET processado_em = NOW()`
6. **Chamar sw_expert_v5** (passa lista de experts)
7. **IF Sucesso?**
   - ✅ Sucesso: volta ao loop
   - ❌ Erro: atualiza `experts_processados` com status='erro', incrementa tentativas

### Tratamento de Erro (branch erro)

```javascript
// Code Node: Registrar Erro
const expertsErro = {};
for (const expert of expertsParaProcessar) {
  expertsErro[expert] = {
    processado_em: new Date().toISOString(),
    status: 'erro',
    tentativas: (experts_processados_atual?.[expert]?.tentativas || 0) + 1,
    ultimo_erro_em: new Date().toISOString(),
    ultimo_erro_msg: erro
  };
}

// UPDATE usr_chat
// SET experts_processados = experts_processados || $2::jsonb
// WHERE id = $1::uuid
```

---

## sw_expert_v5

### Inputs

- `usuario_id`, `chat_id`, `data_conversa`, `usr_nome_preferencia`
- `motivo`: 'nova_conversa' | 'expert_com_erro'
- `experts_para_processar`: array de strings (ex: `['sabotadores', 'insights']`)
- `experts_processados_atual`: jsonb atual

### Estrutura por Expert

Cada expert segue o padrão:

```
1. Switch: deve_processar_{expert}?
   ├─ SIM (output 0)
   │   ├─ DELETE {expert} (WHERE chat_id)
   │   ├─ Agent LLM
   │   ├─ Gravar {expert}
   │   │   ├─ Sucesso → Log Sucesso {expert}
   │   │   └─ Erro → Log Erro {expert}
   └─ NÃO (output 1): pula
```

### Exemplo: Sabotadores

**1. Switch**
```javascript
value1: "={{ $json.deve_processar_sabotadores }}"
rules: [{ value2: true, output: 0 }]
fallbackOutput: 1
```

**2. DELETE (apenas sabotadores)**
```sql
DELETE FROM usuarios_sabotadores WHERE chat_id = $1::uuid;
```

**3. Gravar**
```sql
INSERT INTO usuarios_sabotadores (...) VALUES (...)
RETURNING id, sabotador_id;
```
- `onError: continueErrorOutput` → branch de erro

**4a. Log Sucesso**
```sql
UPDATE usr_chat
SET experts_processados = jsonb_set(
  COALESCE(experts_processados, '{}'::jsonb),
  '{sabotadores}',
  jsonb_build_object(
    'processado_em', to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS'),
    'status', 'sucesso',
    'tentativas', 0
  )
)
WHERE id = $1::uuid;
```

**4b. Log Erro (branch erro)**
```sql
WITH tentativas_anterior AS (
  SELECT COALESCE((experts_processados->'sabotadores'->>'tentativas')::int, 0) AS t
  FROM usr_chat WHERE id = $1::uuid
)
UPDATE usr_chat
SET experts_processados = jsonb_set(
  COALESCE(experts_processados, '{}'::jsonb),
  '{sabotadores}',
  jsonb_build_object(
    'processado_em', to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS'),
    'status', CASE WHEN (SELECT t FROM tentativas_anterior) >= 4 THEN 'bloqueado' ELSE 'erro' END,
    'tentativas', (SELECT t FROM tentativas_anterior) + 1,
    'ultimo_erro_em', to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS'),
    'ultimo_erro_msg', $2
  )
)
WHERE id = $1::uuid;
```

### Experts

1. **Sabotadores** → `usuarios_sabotadores`
2. **Emoções** → `usuarios_emocoes`
3. **Humor** → `usuarios_humor_energia`
4. **BigFive** → `usuarios_perfis`
5. **Insights** → `insights`

---

## Cenários de Uso

### Cenário 1: Nova Conversa (Sucesso Total)

**Rodada 1:**
- `atualizado_em > processado_em` → busca chat
- Marca `processado_em = NOW()`
- Processa TODOS experts (sabotadores, emocoes, humor, bigfive, insights)
- Todos sucedem → atualiza `experts_processados` com status='sucesso'

**Rodada 2 (30min depois):**
- `atualizado_em == processado_em` → **NÃO entra na busca**

---

### Cenário 2: Nova Conversa com Falha em Sabotadores

**Rodada 1:**
- `atualizado_em > processado_em` → busca chat
- Marca `processado_em = NOW()`
- Processa TODOS experts
- **Sabotadores falha** (ex: constraint violation)
  - Log erro: `{sabotadores: {status: 'erro', tentativas: 1}}`
- Demais experts sucedem

**Rodada 2 (30min depois, SEM nova conversa):**
- `atualizado_em == processado_em` (não entrou na Regra 1)
- **MAS** `sabotadores.status='erro'` e `tentativas=1 < 5` → entra na busca
- Marca `processado_em = NOW()` (para evitar loop se falhar antes de log)
- Processa **APENAS sabotadores** (experts_para_processar=['sabotadores'])
- Se falhar: incrementa tentativas (2)

**Rodada 3-5:**
- Continua tentando sabotadores
- Tentativas: 2, 3, 4

**Rodada 6:**
- Falhou 5x → status='bloqueado'
- Não entra mais na busca (query filtra `tentativas < 5`)

---

### Cenário 3: Nova Conversa Durante Retry

**Rodada 1:**
- Sabotadores falha → `{sabotadores: {status: 'erro', tentativas: 1}}`

**Rodada 2:**
- Tenta sabotadores → falha → `tentativas: 2`

**Entre Rodada 2-3: Usuário envia nova mensagem**
- `atualizado_em` aumenta

**Rodada 3:**
- `atualizado_em > processado_em` → entra na Regra 1
- `motivo='nova_conversa'` → processa **TODOS experts** (não só sabotadores)
- Se sabotadores suceder: `status='sucesso', tentativas=0` (limpa erro)

---

## Implementação

### Passo 1: Migration
```bash
psql -f sql/migration_experts_v5.sql
```

### Passo 2: Criar Workflows
1. Importar `backups/n8n/job_experts_v5.json`
2. Importar `backups/n8n/sw_expert_v5.json`
3. Atualizar ID do `sw_expert_v5` no node "Chamar sw_expert_v5" de `job_experts_v5`

### Passo 3: Copiar Nodes do sw_expert v4
- Copiar todos os agents LLM (sabotadores, emocoes, humor, bigfive, insights)
- Adaptar connections para seguir padrão Switch → DELETE → Agent → Gravar → Log

### Passo 4: Testes
1. Executar `job_experts_v5` manualmente
2. Forçar erro em um expert (ex: alterar constraint)
3. Validar que apenas expert com erro reprocessa
4. Validar bloqueio após 5 tentativas

### Passo 5: Ativação
1. Desativar `job_experts` (v4)
2. Ativar `job_experts_v5`

---

## Monitoramento

### Query: Chats com Experts Bloqueados

```sql
SELECT 
  c.id,
  c.usuario_id,
  u.nome_preferencia,
  jsonb_object_keys(c.experts_processados) AS expert,
  c.experts_processados
FROM usr_chat c
JOIN usuarios u ON u.id = c.usuario_id,
LATERAL jsonb_each(c.experts_processados) AS e(k, v)
WHERE e.v->>'status' = 'bloqueado'
ORDER BY c.atualizado_em DESC;
```

### Query: Chats com Experts com Erro (ainda tentando)

```sql
SELECT 
  c.id,
  c.usuario_id,
  u.nome_preferencia,
  e.k AS expert,
  (e.v->>'tentativas')::int AS tentativas,
  e.v->>'ultimo_erro_msg' AS erro
FROM usr_chat c
JOIN usuarios u ON u.id = c.usuario_id,
LATERAL jsonb_each(c.experts_processados) AS e(k, v)
WHERE e.v->>'status' = 'erro'
  AND (e.v->>'tentativas')::int < 5
ORDER BY c.atualizado_em DESC;
```

---

## Comparação v4 vs v5

| Aspecto | v4 | v5 |
|---------|----|----|
| **Controle** | `processado_em` global | `experts_processados` individual |
| **Erro em 1 expert** | Reprocessa TUDO | Reprocessa APENAS o expert |
| **Loop infinito** | ❌ Sim | ✅ Não (limite 5 tentativas) |
| **DELETE** | Global (todos experts) | Individual (apenas expert necessário) |
| **Retry** | Sem limite | Máx 5 tentativas + bloqueio |
| **Observabilidade** | Baixa | Alta (log detalhado por expert) |
| **Custo tokens** | Alto (reprocessa tudo) | Baixo (reprocessa seletivo) |

---

## Próximos Passos

1. ✅ Criar migration SQL
2. ✅ Criar estrutura base dos workflows v5
3. ⏳ Completar `sw_expert_v5` com todos os 5 experts
4. ⏳ Testar em ambiente de staging
5. ⏳ Ativar em produção
6. ⏳ Criar backoffice para visualizar/desbloquear experts

