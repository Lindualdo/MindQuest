
## Boas práticas · lições n8n

**🚨 REGRA DE OURO - NODES POSTGRES:**
- **SEMPRE** incluir `operation`, `query` e `options` no mesmo update
- **NUNCA** atualizar apenas `query` ou apenas `options`
- **SEMPRE** validar `operation` após update via `n8n_get_workflow`
- Ver seção "CRÍTICO - Atualização de nodes Postgres via MCP" abaixo para checklist completo

**🚨 REGRA CRÍTICA - WEBHOOKS VIA API/MCP:**
- Ao criar workflows com webhooks via API/MCP, **SEMPRE incluir `webhookId`** no nó webhook
- Sem `webhookId`, o webhook funciona apenas em modo teste (`/webhook-test/...`), mas **NÃO funciona em produção** (`/webhook/...`)
- O `webhookId` deve ser um UUID único (ex: gerado com `crypto.randomUUID()`)
- **Sintoma:** workflow ativo, mas URL de produção retorna 404
- **Solução:** Adicionar `webhookId` ao nó webhook via `n8n_update_partial_workflow`
- Ver seção "CRÍTICO - Webhooks criados via API/MCP" abaixo para template

- Mapear nós/ID via `n8n_get_workflow` antes de editar, evitando nomes desatualizados.
- Usar `n8n_update_partial_workflow` para mudanças cirúrgicas; evitar full update sem necessidade.
- Após alterações, rodar `n8n_get_workflow_structure` para validar nomes, conexões e garantir consistência.
- Ajustar expressões (`$items`, `$node`) sempre que renomear nós para não quebrar dependências.
- Testar execuções manualmente após mudanças relevantes ou documentar se não foi possível testar.
- Sempre definir `operation="executeQuery"` em nós Postgres e validar esse campo após atualizar via MCP.
- Conferir na UI ou via `n8n_get_workflow` se o node mostra "Execute Query" antes de entregar mudança.
- Nós básicos: use `n8n-nodes-base.code` (Code node) para lógica customizada, nunca `function`.
- Sempre confirme o tipo/campos dos nós via MCP (`get_node_info`) antes de supor nomes antigos.
- Verifique se `Code` está em `runOnceForAllItems` quando distribui o mesmo payload para vários destinos.
- **Sub-workflows (sw_*) NUNCA devem ser ativados.** Eles rodam na mesma transação do workflow pai que os chama via `executeWorkflow`. Status `active=false` é correto e NÃO é erro.
- **🚨 REGRA CRÍTICA - WORKFLOWS DO AGENTE DE IA (NUNCA ALTERAR):**
  - **NUNCA alterar os workflows `sw_xp_quest`, `sw_criar_quest` e `sw_xp_conversas` para atender demandas de interface.**
  - Esses workflows são **exclusivos do agente de IA** executado após a conversa guiada.
  - Alterações nesses workflows podem quebrar a lógica do agente de IA.
  - Para demandas de interface, usar os workflows `webhook_*` correspondentes (ex: `webhook_concluir_quest`, `webhook_ativar_quest`, etc.).
- **🚨 CRÍTICO - Atualização de nodes Postgres via MCP - CHECKLIST OBRIGATÓRIO:**
  
  **ANTES de atualizar qualquer nó Postgres, seguir ESTE checklist:**
  
  1. **Ler o nó atual** via `n8n_get_workflow` para obter TODOS os parâmetros existentes
  2. **Preparar o update** incluindo SEMPRE estes 3 campos no mesmo `parameters`:
     - ✅ `operation`: "executeQuery" (ou outra operação válida)
     - ✅ `query`: SQL completa (não pode estar vazia)
     - ✅ `options`: objeto (pode ser `{}` vazio ou `{"queryReplacement": "..."}`)
  3. **NUNCA atualizar apenas um campo** (ex: só `query` ou só `options`)
  4. **Após o update, validar** via `n8n_get_workflow` se `operation` está correto
  
  **⚠️ ERRO COMUM:** Atualizar só a `query` sem incluir `operation` e `options` → n8n reseta `operation` para "Insert" (padrão)
  
  **✅ Template correto (copiar e adaptar):**
  ```json
  {
    "type": "updateNode",
    "nodeId": "abc-123",
    "updates": {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM table WHERE id = $1",
        "options": {"queryReplacement": "={{ [$json.id] }}"}
      }
    }
  }
  ```
  
  **✅ Exemplo com options vazio (quando não precisa queryReplacement):**
  ```json
  {
    "type": "updateNode",
    "nodeId": "abc-123",
    "updates": {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM table",
        "options": {}
      }
    }
  }
  ```
  
  **🔍 Validação pós-update (OBRIGATÓRIA):**
  ```javascript
  // Após atualizar, SEMPRE verificar:
  const workflow = await n8n_get_workflow({id: "workflow-id"});
  const node = workflow.nodes.find(n => n.id === "node-id");
  if (node.parameters.operation !== "executeQuery") {
    throw new Error("ERRO: operation não está como 'executeQuery'!");
  }
  ```
  
  **📝 Ferramentas de apoio:**
  - **Template:** `templates/n8n_postgres_update.json` (exemplos prontos para copiar)
  - **Script de validação:** `scripts/validate_postgres_node.mjs` (valida após update)
    ```bash
    node scripts/validate_postgres_node.mjs <workflow-id> <node-id>
    ```
  - **Documentação:** `templates/README.md` (guia de uso completo)

- **🚨 CRÍTICO - Webhooks criados via API/MCP - OBRIGATÓRIO `webhookId`:**
  
  **Problema:** Workflows criados via API/MCP não registram URL de produção sem `webhookId`.
  
  **Sintomas:**
  - ✅ Webhook funciona em modo teste: `/webhook-test/path`
  - ❌ Webhook retorna 404 em produção: `/webhook/path`
  - Workflow aparece como `active: true` no n8n
  
  **Causa:** O `webhookId` é necessário para registrar a rota de produção. Quando criado pela UI, o n8n gera automaticamente. Via API/MCP, não é gerado.
  
  **✅ Template correto para criar webhook via API:**
  ```json
  {
    "type": "n8n-nodes-base.webhook",
    "typeVersion": 2,
    "id": "node-uuid",
    "name": "Webhook GET",
    "webhookId": "UUID-UNICO-AQUI",
    "position": [250, 300],
    "parameters": {
      "path": "meu-endpoint",
      "httpMethod": "GET",
      "responseMode": "lastNode"
    }
  }
  ```
  
  **✅ Para corrigir webhook existente (adicionar webhookId):**
  ```json
  {
    "type": "updateNode",
    "nodeId": "id-do-no-webhook",
    "updates": {
      "webhookId": "gerar-uuid-unico"
    }
  }
  ```
  
  **🔍 Como verificar se está correto:**
  ```javascript
  const workflow = await n8n_get_workflow({id: "workflow-id"});
  const webhookNode = workflow.nodes.find(n => n.type === "n8n-nodes-base.webhook");
  if (!webhookNode.webhookId) {
    console.error("ERRO: webhookId não definido!");
  }
  ```
  
  **📝 Gerar UUID:**
  - Node.js: `crypto.randomUUID()`
  - Terminal: `uuidgen` (macOS) ou `cat /proc/sys/kernel/random/uuid` (Linux)

## Debug de Execução (Padrão)
- Quando o usuário pedir o “log/saída” de um nó do n8n, seguir estes passos com MCP:
  - `n8n_list_workflows` → localizar o workflow pelo nome e obter `workflowId`.
  - `n8n_list_executions` com `workflowId` (ordenado por mais recente) → escolher a última execução relevante (idealmente `status = success`).
  - `n8n_get_execution`:
    - Modo rápido: `mode="summary"` para ver a amostra de saída de cada nó.
    - Se quiser apenas um nó: `mode="filtered"` com `nodeNames=["<Nome do Nó>"]`.
  - Capturar exatamente o objeto JSON de saída do nó (ex.: campo `output`).
- Formato padrão do arquivo local para debug:
  - Caminho: `data/<NomeDoNo>.json` (ex.: `data/Mentor.json`).
  - Conteúdo: array com um objeto contendo a chave `"output"` e o texto completo do agente, por exemplo:
    ```json
    [
      {
        "output": "Oi, Aldo. Vejo que enviou \"jupter123\". Gostaria de saber se quer compartilhar algo específico ou se prefere seguir conversando sobre seus planos e estratégias? Estou aqui para ajudar no que precisar."
      }
    ]
    ```
- Regras:
  - Manter os dados e a formatação exatamente como retornados pelo n8n, escapando quebras de linha com `\n` quando necessário (JSON válido).
  - Não alterar conteúdo (sem correções, truncamentos ou reescritas).
  - Não modificar workflows ao fazer debug (somente leitura).

# n8n / MCP
- Ao pesquisar, usar ferramentas MCP de n8n (search_nodes, get_node_info, validate_workflow).
- Evitar suposições de APIs; verificar propriedades com MCP.