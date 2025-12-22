# sw_quest_hub - Detalhamento do Workflow

**Data:** 2025-12-22  
**Versão:** 1.0  
**Arquivo:** `backups/n8n/sw_quest_hub.json`

---

## Visão Geral

Workflow responsável por **rotear a criação de quests** para agentes especialistas. Recebe `usuario_id` e `chat_id`, busca contexto completo, aplica regras de negócio e decide qual(is) tipo(s) de quest criar.

---

## Nodes do Workflow

### 1. start (Execute Workflow Trigger)
**ID:** `a1b2c3d4-0001-4000-8000-000000000001`  
**Tipo:** `n8n-nodes-base.executeWorkflowTrigger`  
**Posição:** [200, 300]

**Objetivo:** Ponto de entrada do workflow quando chamado por outro workflow.

**Inputs:**
- `usuario_id` (uuid) - ID do usuário
- `chat_id` (uuid) - ID da conversa atual

**Output:** Passa os inputs para o próximo node.

---

### 2. Buscar Contexto (Postgres)
**ID:** `a1b2c3d4-0002-4000-8000-000000000002`  
**Tipo:** `n8n-nodes-base.postgres`  
**Posição:** [420, 300]

**Objetivo:** Buscar TODOS os dados necessários para decisão em uma única query otimizada.

**Query:** CTE (Common Table Expression) com múltiplas subconsultas:

| CTE | Objetivo | Campo retornado |
|-----|----------|-----------------|
| `conversas_finalizadas` | Contar conversas para onboarding | `conversas_finalizadas` |
| `humor_atual` | Humor da conversa atual | `humor` |
| `energia_panas` | Energia baseada em PANAS | `energia` |
| `sabotador_mais_ativo` | Sabotador com maior score | `sabotador_mais_ativo` |
| `sabotador_conversa` | Sabotador detectado no chat atual | `sabotador_conversa` |
| `objetivos_especificos` | Objetivos ativos (não padrão) | `objetivos_especificos` |
| `quests_hoje` | Total quests criadas hoje | `quests_hoje` |
| `quests_ativas_disponiveis` | Total quests ativas+disponíveis | `quests_ativas_disponiveis` |
| `quests_existentes` | Quests ativas/disponíveis (anti-dup) | `quests_existentes` |
| `quests_dia_excluir` | IDs de quests do dia para excluir | `quests_dia_excluir_ids` |
| `mensagens_conversa` | Mensagens da conversa atual | `mensagens` |

**Output:** JSON com campo `contexto` contendo todos os dados.

**Parâmetros:**
- `$1` = usuario_id
- `$2` = chat_id

---

### 3. Excluir Quests Dia (Postgres)
**ID:** `a1b2c3d4-0003-4000-8000-000000000003`  
**Tipo:** `n8n-nodes-base.postgres`  
**Posição:** [640, 300]

**Objetivo:** Excluir quests do dia com status `disponivel` para permitir recriação.

**Regras:**
- ✅ Exclui: quests criadas hoje, status `disponivel`
- ❌ NÃO exclui: quests com status `ativa` (usuário já está fazendo)
- ❌ NÃO exclui: reflexão diária (`catalogo_id != '775a9df0-...'`)

**Por quê:** Chat fica aberto o dia todo. Workflow é chamado várias vezes. Precisa recriar quests baseadas no contexto mais recente.

**Query:**
```sql
DELETE FROM usuarios_quest
WHERE id = ANY($1::uuid[])
RETURNING id;
```

**Parâmetros:**
- `$1` = array de IDs (de `quests_dia_excluir_ids`)

---

### 4. Verificar Limites (Code Node)
**ID:** `a1b2c3d4-0004-4000-8000-000000000004`  
**Tipo:** `n8n-nodes-base.code`  
**Posição:** [860, 300]

**Objetivo:** Aplicar regras R1, R7, R7b **SEM usar IA** (mais rápido e determinístico).

**Regras verificadas:**

| Regra | Condição | Ação |
|-------|----------|------|
| **R1** | `conversas_finalizadas <= 3` | BLOQUEIA (onboarding) |
| **R7b** | `quests_ativas_disponiveis >= 15` | BLOQUEIA (limite total) |
| **R7** | `quests_hoje >= 2` | Marca `limite_diario_atingido = true` |

**Output:**
```json
{
  "pode_processar": true/false,
  "motivo": "onboarding|limite_total",
  "mensagem": "...",
  "limite_diario_atingido": true/false,
  "pode_criar_hoje": 0|1|2,
  "contexto": { ... }
}
```

---

### 5. Pode Processar? (IF Node)
**ID:** `a1b2c3d4-0005-4000-8000-000000000005`  
**Tipo:** `n8n-nodes-base.if`  
**Posição:** [1080, 300]

**Objetivo:** Decidir se continua para o agente IA ou termina o fluxo.

**Condição:** `$json.pode_processar == true`

**Saídas:**
- **TRUE (index 0):** → Agente Roteador
- **FALSE (index 1):** → Saida Bloqueado

---

### 6. Saida Bloqueado (Code Node)
**ID:** `a1b2c3d4-0006-4000-8000-000000000006`  
**Tipo:** `n8n-nodes-base.code`  
**Posição:** [1300, 500]

**Objetivo:** Retornar resposta estruturada quando workflow é bloqueado.

**Output:**
```json
{
  "sucesso": false,
  "motivo": "onboarding|limite_total",
  "mensagem": "Descrição legível",
  "quests_criadas": []
}
```

**Fim do fluxo.**

---

### 7. OpenRouter (Language Model)
**ID:** `a1b2c3d4-0007-4000-8000-000000000007`  
**Tipo:** `@n8n/n8n-nodes-langchain.lmChatOpenRouter`  
**Posição:** [1300, 120]

**Objetivo:** Fornecer modelo de IA para o Agente Roteador.

**Modelo:** `google/gemini-2.0-flash-001`  
**Credenciais:** OpenRouter account

**Conecta a:**
- Agente Roteador (entrada de IA)
- Parser Roteador (validação de output)

---

### 8. Parser Roteador (Output Parser)
**ID:** `a1b2c3d4-0008-4000-8000-000000000008`  
**Tipo:** `@n8n/n8n-nodes-langchain.outputParserStructured`  
**Posição:** [1520, 120]

**Objetivo:** Forçar o agente a retornar JSON estruturado válido.

**Schema JSON:**
```json
{
  "pode_criar": boolean,
  "pedido_explicito": boolean,
  "destinos": [
    {
      "tipo": "mentalidade|sabotador|objetivos|personalizada",
      "prioridade": number,
      "catalogo_sugerido": string,
      "contexto": object
    }
  ],
  "excluidos": [
    { "tipo": string, "motivo": string }
  ],
  "justificativa": string
}
```

**Benefício:** Se agente retornar texto livre, parser tenta corrigir automaticamente.

---

### 9. Agente Roteador (AI Agent)
**ID:** `a1b2c3d4-0009-4000-8000-000000000009`  
**Tipo:** `@n8n/n8n-nodes-langchain.agent`  
**Posição:** [1300, 300]

**Objetivo:** DECIDIR quais tipos de quest criar (não cria as quests, apenas roteia).

**Input (User Prompt):**
- Limites (pode_criar_hoje, quests_hoje, etc)
- Estado emocional (humor, energia)
- Sabotador mais ativo
- Sabotador conversa atual
- Objetivos específicos
- Quests existentes (anti-duplicação)
- Mensagens da conversa

**System Prompt - Regras implementadas:**

| Regra | Descrição |
|-------|-----------|
| **R2** | Detectar pedido explícito ("quero uma quest...") |
| **R3** | Se humor < 5 OU energia < 5 → adicionar `mentalidade` |
| **R4** | Se sabotador detectado → adicionar `sabotador` |
| **R5** | Se objetivos ativos → adicionar `objetivos` |
| **R6** | Validar anti-duplicação (não adicionar se já existe) |
| **R7** | Respeitar limite diário (exceto se pedido explícito) |

**Output:** JSON estruturado com lista de destinos e justificativa.

---

### 10. Processar Roteamento (Code Node)
**ID:** `a1b2c3d4-0010-4000-8000-000000000010`  
**Tipo:** `n8n-nodes-base.code`  
**Posição:** [1580, 300]

**Objetivo:** Processar output do agente e aplicar lógica final de limite.

**Lógica:**
1. Parse do JSON retornado (string → objeto)
2. Extrair `destinos` e `pedido_explicito`
3. Se `limite_diario_atingido = true` E `pedido_explicito = false`:
   - Zerar destinos (não criar nada)
4. Ordenar destinos por prioridade (menor número = mais alta)
5. Limitar a `pode_criar_hoje` (0, 1 ou 2)
6. Se `pedido_explicito = true`: ignorar limite

**Output:**
```json
{
  "usuario_id": uuid,
  "chat_id": uuid,
  "pode_criar": boolean,
  "pedido_explicito": boolean,
  "destinos": [...],
  "excluidos": [...],
  "justificativa": string,
  "contexto_completo": {...}
}
```

---

### 11. Tem Destinos? (IF Node)
**ID:** `a1b2c3d4-0011-4000-8000-000000000011`  
**Tipo:** `n8n-nodes-base.if`  
**Posição:** [1800, 300]

**Objetivo:** Verificar se há quests para criar.

**Condição:** `$json.destinos.length > 0`

**Saídas:**
- **TRUE (index 0):** → Preparar Loop
- **FALSE (index 1):** → Saida Sem Destinos

---

### 12. Preparar Loop (Code Node)
**ID:** `a1b2c3d4-0012-4000-8000-000000000012`  
**Tipo:** `n8n-nodes-base.code`  
**Posição:** [2020, 200]

**Objetivo:** Transformar array de destinos em múltiplos items para processamento individual.

**Input:** 1 item com `destinos: [d1, d2, d3]`  
**Output:** 3 items separados:
```json
[
  { "destino": d1, "index": 0, "total": 3, ... },
  { "destino": d2, "index": 1, "total": 3, ... },
  { "destino": d3, "index": 2, "total": 3, ... }
]
```

**Por quê:** Permite que Switch processe cada destino individualmente.

---

### 13. Saida Sem Destinos (Code Node)
**ID:** `a1b2c3d4-0013-4000-8000-000000000013`  
**Tipo:** `n8n-nodes-base.code`  
**Posição:** [2020, 420]

**Objetivo:** Retornar resposta quando não há quests a criar.

**Casos:**
- Todos os tipos foram excluídos por anti-duplicação (R6)
- Agente decidiu não criar nada

**Output:**
```json
{
  "sucesso": true,
  "motivo": "sem_destinos",
  "mensagem": "Nenhuma quest a criar",
  "excluidos": [...],
  "quests_criadas": []
}
```

**Não é erro** - apenas "nada a fazer no momento".

---

### 14. Switch Tipo (Switch Node)
**ID:** `a1b2c3d4-0014-4000-8000-000000000014`  
**Tipo:** `n8n-nodes-base.switch`  
**Posição:** [2240, 200]

**Objetivo:** Rotear cada destino para o sub-workflow especialista correto.

**Condição:** `$json.destino.tipo`

**Saídas (4):**

| Index | Valor | Destino |
|-------|-------|---------|
| 0 | `"mentalidade"` | sw_quest_mentalidade |
| 1 | `"sabotador"` | sw_quest_sabotador |
| 2 | `"objetivos"` | sw_quest_objetivos |
| 3 | `"personalizada"` | sw_quest_personalizada |

---

### 15-18. Placeholders (NoOp)
**IDs:**
- `a1b2c3d4-0016-...-000016` (Mentalidade)
- `a1b2c3d4-0017-...-000017` (Sabotador)
- `a1b2c3d4-0018-...-000018` (Objetivos)
- `a1b2c3d4-0019-...-000019` (Personalizada)

**Tipo:** `n8n-nodes-base.noOp`  
**Posições:** [2500, 0/140/280/420]

**Objetivo:** Marcadores temporários para onde conectar os sub-workflows.

**Status atual:** Não fazem nada (NoOp = No Operation).

**Próximo passo:** Substituir por **Execute Workflow** nodes que chamarão:
- `sw_quest_mentalidade`
- `sw_quest_sabotador`
- `sw_quest_objetivos`
- `sw_quest_personalizada`

Cada especialista receberá:
- `usuario_id`
- `chat_id`
- `destino.contexto` (dados específicos do tipo)
- `contexto_completo` (para referência)

---

### 19. Sticky Note (Documentação)
**ID:** `a1b2c3d4-0015-4000-8000-000000000015`  
**Tipo:** `n8n-nodes-base.stickyNote`  
**Posição:** [-60, 80]

**Objetivo:** Documentação visual no canvas do n8n.

**Conteúdo:**
- Resumo do fluxo
- Regras implementadas (R1-R8)
- Próximos passos

**Não executa** - apenas anotação.

---

## Fluxo Completo

```
┌─────────┐
│  start  │ (recebe usuario_id, chat_id)
└────┬────┘
     │
     v
┌──────────────────┐
│ Buscar Contexto  │ (1 query CTE → todos os dados)
└────┬─────────────┘
     │
     v
┌─────────────────────┐
│ Excluir Quests Dia  │ (deleta disponíveis, mantém ativas)
└────┬────────────────┘
     │
     v
┌──────────────────┐
│Verificar Limites │ (R1, R7, R7b sem IA)
└────┬─────────────┘
     │
     v
┌────────────────┐     FALSE
│Pode Processar? ├──────────► Saida Bloqueado
└────┬───────────┘
     │ TRUE
     v
┌──────────────────┐
│ Agente Roteador  │ (IA decide tipos: R2-R6)
│  + OpenRouter    │
│  + Parser        │
└────┬─────────────┘
     │
     v
┌─────────────────────┐
│Processar Roteamento │ (aplica limite final)
└────┬────────────────┘
     │
     v
┌──────────────┐     FALSE
│Tem Destinos? ├──────────► Saida Sem Destinos
└────┬─────────┘
     │ TRUE
     v
┌──────────────┐
│Preparar Loop │ (1 item → N items)
└────┬─────────┘
     │
     v
┌─────────────┐
│ Switch Tipo │ (roteia por tipo)
└┬──┬──┬──┬───┘
 │  │  │  │
 │  │  │  └─► Placeholder Personalizada → sw_quest_personalizada
 │  │  └────► Placeholder Objetivos → sw_quest_objetivos
 │  └───────► Placeholder Sabotador → sw_quest_sabotador
 └──────────► Placeholder Mentalidade → sw_quest_mentalidade
```

---

## Regras de Negócio Mapeadas

| Regra | Node Responsável | Tipo |
|-------|------------------|------|
| **R1** Onboarding (<=3) | Verificar Limites | Code (determinístico) |
| **R2** Pedido explícito | Agente Roteador | IA |
| **R3** Mentalidade | Agente Roteador | IA |
| **R4** Sabotador | Agente Roteador | IA |
| **R5** Objetivos | Agente Roteador | IA |
| **R6** Anti-duplicação | Agente Roteador | IA |
| **R7** Limite 2/dia | Verificar Limites + Processar Roteamento | Code |
| **R7b** Limite 15 total | Verificar Limites | Code |
| **R8** Exceção pedido | Processar Roteamento | Code |

---

## Performance

**Otimizações:**
1. **Query única** para buscar contexto (evita múltiplas chamadas ao banco)
2. **Verificações determinísticas primeiro** (R1, R7b) - evita chamar IA desnecessariamente
3. **Agente roteador focado** - não cria quests, apenas decide tipos (mais rápido)
4. **Parser estruturado** - garante output válido sem retry manual

**Estimativa de execução:**
- Sem criar quests (bloqueado): ~500ms
- Com agente IA: ~2-3s
- Cada especialista: +2-4s (futuro)

---

## Próximos Passos

- [ ] Implementar `sw_quest_mentalidade`
- [ ] Implementar `sw_quest_sabotador`
- [ ] Implementar `sw_quest_objetivos`
- [ ] Implementar `sw_quest_personalizada`
- [ ] Substituir NoOp placeholders por Execute Workflow
- [ ] Adicionar agregação de respostas dos especialistas
- [ ] Testar com dados reais (pinData)

