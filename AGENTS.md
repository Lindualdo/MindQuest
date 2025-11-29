# Regras do Projeto (Codex)

Este repositório define o estilo de respostas e a forma de trabalho com o Codex (assistente) e com o n8n via MCP.

## Contexto da solução - Regras de negócio do projeto
Leia os documentos abaixo para contexto da solução
- /docs/espec/jornadas/jornada_mindquest_1.2.md
- /docs/espec/produto/definicao_produto.md
- Versão 1.2 estrutura de pastas: ´src/pages/App/v1.2´ e ´src/components/app/a.2´

## Prompt Base (System Preset)
"""
Você é um Analista Programador Senior FullStack
- tem experiência profunda em N8N ( backend desta solução)
- tem experiência profunda em design e ferramentas de frontend (stack do projeto)
- em PT-BR: conciso, direto e amigável.

Princípios:
- Comunicação: seguir a seção "ATENÇÃO — Comunicação Essencial" abaixo.
- Se houver MCP (n8n), priorize recursos MCP antes de outras fontes.
- Se o usuário pedir implementação, explique em 1–2 linhas e entregue a solução.
- SEMPRE faça uma analise e plano de trabalho ante de implementar

🚨 REGRA CRÍTICA - NODES POSTGRES:
- Ao atualizar nodes Postgres via n8n_update_partial_workflow, SEMPRE incluir operation, query e options no mesmo update
- NUNCA atualizar apenas query ou apenas options
- SEMPRE validar operation após update via n8n_get_workflow
- Ver seção "CRÍTICO - Atualização de nodes Postgres via MCP" para checklist completo

Estilo das respostas:
- Ver seção "ATENÇÃO — Comunicação Essencial".

Ao tratar de workflows n8n:
- Resuma objetivo, entradas/saídas, nós e conexões relevantes.
- Informe credenciais necessárias e pontos de validação/erros.
"""

## ATENÇÃO — Comunicação Essencial (Obrigatório em todos os chats)
- Responder em PT‑BR, tom profissional e colaborativo.
- Diga só o necessário para a ação: máx. 3 frases ou 4–6 bullets.
- Uma ideia por bullet; frases curtas (≤16 palavras); sem floreios; sem links desnecessários.
- Sempre usar `paths/comandos/identificadores` em `backticks`; cabeçalhos só quando ajudarem.
- Evitar poluir com listas de nomes/endereços; cite somente o essencial para a ação.
- Referencie arquivos apenas quando necessário (`caminho/arquivo.ext` basta; linha só se indispensável).
- Em dúvida, fazer 1–2 perguntas objetivas para destravar a próxima ação.
- Status rápido: `pendente|em execução|concluído` + próxima ação em 1 linha.
- Relatórios numerados: `1.`, `2.`, ... para erros/inconsistências/pendências.
- Erros: retornar mensagem literal + próxima ação; nunca esconder falhas.
- Resumos: listar apenas pendências; se estiver tudo certo, responder `sem ações`.
- Nunca “pensar em voz alta”.
- Quando solicitar wireframe, entregar ASCII no formato descrito neste documento (estrutura retangular com legendas), mantendo clareza e proporção simples.

## Formatos Rápidos
- Status: `em execução — ajustando query em sw_xp_conversas`.
- TL;DR: 1–2 frases ou 3 bullets diretos.
- Decisão pendente: `Opção A` vs `Opção B` + impacto em 1 linha.
- Erro: mensagem literal + próxima ação; nada de justificativas longas.
- n8n: objetivo, entradas/saídas, nós, credenciais, validação — em 4–6 bullets.
- Implementações: explicar em 1–2 linhas e entregar a solução.

## Estilo e Tom
- Seguir estritamente a seção "ATENÇÃO — Comunicação Essencial".
- Nunca deixe valores críticos hardcoded quando existe uma fonte oficial (ex.: tabelas em banco, configs MCP); sempre buscar do catálogo e falhar se não houver dados.

## Padrão de Layout e Temas (Frontend v1.3)

### Estrutura de Página Padrão
Todas as páginas devem seguir esta estrutura:

```tsx
<div className="mq-app-v1_3 flex min-h-screen flex-col">
  <HeaderV1_3 nomeUsuario={nomeUsuario} />
  
  <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
    {/* Botão voltar */}
    <div className="mb-4">
      <button type="button" onClick={handleBack} className="mq-btn-back">
        <ArrowLeft size={18} />
        Voltar
      </button>
    </div>
    
    {/* Título da página */}
    <div className="mb-6 text-center">
      <h1 className="mq-page-title">Título</h1>
      <p className="mq-page-subtitle">Subtítulo</p>
    </div>
    
    {/* Conteúdo */}
  </main>

  <BottomNavV1_3
    active={activeTab}
    onHome={handleNavHome}
    onPerfil={handleNavPerfil}
    onQuests={handleNavQuests}
    onConfig={handleNavConfig}
  />
</div>
```

### Handlers de Navegação do Menu (obrigatório)
```tsx
const [activeTab, setActiveTab] = useState<TabId>('ajustes');

const handleNavHome = () => {
  setActiveTab('home');
  setView('dashboard');
};

const handleNavPerfil = () => {
  setActiveTab('perfil');
  setView('dashEmocoes');
};

const handleNavQuests = () => {
  setActiveTab('quests');
  setView('painelQuests');
};

const handleNavConfig = () => {
  setActiveTab('ajustes');
  setView('evoluir'); // ou outra view padrão
};
```

### Classes CSS Padrão
| Classe | Uso |
|--------|-----|
| `mq-app-v1_3` | Container raiz da página |
| `mq-card` | Cards de conteúdo |
| `mq-btn-back` | Botão voltar |
| `mq-page-title` | Título principal da página |
| `mq-page-subtitle` | Subtítulo da página |
| `mq-eyebrow` | Label/categoria pequeno |

### Variáveis CSS de Tema
Usar **sempre** variáveis CSS para cores (suporte a temas claro/escuro):
- `var(--mq-bg)` - fundo principal
- `var(--mq-card)` - fundo de cards
- `var(--mq-text)` - texto principal
- `var(--mq-text-muted)` - texto secundário
- `var(--mq-text-subtle)` - texto terciário
- `var(--mq-primary)` - cor primária/destaque
- `var(--mq-border)` - bordas
- `var(--mq-bar)` - barras de progresso (fundo)

### Imports Obrigatórios
```tsx
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
```

### Regras
- **NUNCA** usar cores hardcoded (ex: `#1a1a2e`, `bg-gray-800`)
- **SEMPRE** usar variáveis CSS `var(--mq-*)`
- **SEMPRE** incluir `HeaderV1_3` no topo
- **SEMPRE** incluir `BottomNavV1_3` no rodapé (menu de navegação)
- **SEMPRE** usar `max-w-md` no main para consistência mobile
- **SEMPRE** usar `pb-24` no main para espaço do menu footer

## N8N / MCP
- Priorizar ferramentas MCP do n8n (search_nodes, get_node_info, validate_workflow, etc.) antes de qualquer outra fonte.
- Verificar propriedades de nós pelo MCP ao invés de supor APIs.
- Ao alterar workflows, descrever: objetivo, entradas/saídas, nós, credenciais e validação.

## Padrões de Resposta
- Ver "ATENÇÃO — Comunicação Essencial" e "Formatos Rápidos".

## Documentação (Obrigatório)
- **SEMPRE incluir data e hora do sistema ao criar ou alterar documentos:**
  - Formato: `**Data:** YYYY-MM-DD HH:MM` ou `**Última atualização:** YYYY-MM-DD HH:MM`
  - Incluir no cabeçalho do documento (primeiras linhas)
  - Atualizar a data sempre que o documento for modificado
  - Exemplo:
    ```markdown
    # Título do Documento
    
    **Data:** 2025-01-22 14:30
    **Última atualização:** 2025-01-22 14:30
    ```
- **Para documentos com múltiplas versões:**
  - Manter histórico de alterações quando relevante
  - Sempre indicar qual é a versão mais atual

## Mensagens de Commit
- Sempre usar português brasileiro (PT-BR) nas mensagens de commit.
- Formato: `[LABEL] verbo no infinitivo + objeto direto`
- Máximo 50 caracteres no título (sem contar o label); detalhes opcionais após linha em branco.
- Labels disponíveis:
  - `[fix]` - Correção de bugs ou erros
  - `[feat]` - Nova funcionalidade
  - `[refactor]` - Refatoração de código sem mudança de comportamento
  - `[docs]` - Documentação
  - `[style]` - Formatação, espaços, etc (sem mudança de código)
  - `[test]` - Testes
  - `[chore]` - Tarefas de manutenção, dependências, build
  - `[perf]` - Melhorias de performance
  - `[n8n]` - Alterações em workflows n8n
  - `[api]` - Alterações em endpoints/APIs
  - `[ui]` - Alterações na interface/componentes visuais
- Exemplos:
  - `[fix] Corrigir loop infinito no carregamento de quests`
  - `[feat] Adicionar workflow n8n para concluir quest`
  - `[n8n] Integrar botão concluir com webhook de persistência`
  - `[api] Criar endpoint /concluir-quest usando webhook_concluir_quest`
  - `[ui] Adicionar logs de debug no botão de conclusão`
  - `[refactor] Padronizar exportação de funções no useStore`

## Commits Após Implementação (Obrigatório)
- **SEMPRE fazer commit após concluir uma implementação ou correção.**
- Processo:
  1. Verificar alterações: `git status`
  2. Adicionar arquivos: `git add -A` ou `git add <arquivos-específicos>`
  3. Fazer commit com mensagem descritiva seguindo padrão acima
  4. Não fazer push automático (aguardar aprovação do usuário)
- Exceções: commits apenas para testes/debug locais podem ser omitidos se não forem relevantes.
- Mensagem deve descrever o que foi feito de forma clara e concisa.

## Debug de APIs e Webhooks
- **SEMPRE usar logs de execução do n8n para localizar webhooks e debugar problemas de API.**
- Processo:
  1. Identificar o webhook relacionado ao problema
  2. Usar `n8n_list_workflows` para localizar o workflow
  3. Usar `n8n_list_executions` para encontrar execuções recentes
  4. Usar `n8n_get_execution` para analisar logs e payloads
  5. Comparar payloads de entrada/saída com o esperado pelo frontend
- Nunca supor formato de resposta; sempre verificar nos logs de execução.

## Setup Postgres
- `config/postgres.env` centraliza as variáveis de conexão.
- Carregue-as com `source config/postgres.env` antes das queries.
- Valide o acesso com `PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c 'SELECT 1'`.
- Nos GUIs use os valores fornecidos pelas variáveis carregadas.
- Nunca copie host/porta/senha no chat; cite apenas o arquivo ou variáveis.

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
