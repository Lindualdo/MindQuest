# Referência Técnica — Quests v1.3.5

**Data:** 2025-11-24  
**Versão:** 1.3.5  
**Objetivo:** Referência rápida para desenvolvimento e manutenção

---

## 1. Webhooks Principais

### `webhook_quests`
- **Path:** `/webhook/quests`
- **Método:** GET
- **Parâmetro:** `user_id` (query)
- **Retorna:** Lista de quests (pendentes e concluídas) do usuário
- **Workflow ID:** `yvg9NkBsLF3mbr5f`
- **Campos importantes retornados:**
  - `titulo` (prioriza `config->>'titulo'` sobre `qc.titulo`)
  - `tipo`, `catalogo_codigo`, `config` (para identificar quests de conversa)
  - `qtdQuestsPrevistas`, `qtdQuestsConcluidas` (por dia)
  - `datas_concluidas` (array de datas)

### `webhook_progresso_semanal`
- **Path:** `/webhook/progresso-semanal`
- **Método:** GET
- **Parâmetro:** `user_id` (query)
- **Retorna:** Progresso semanal (conversas + quests)
- **Workflow ID:** `gMb1UwtmEh5pkfxR`
- **Campos importantes retornados:**
  - `qtdQuestsPrevistas` (por dia e total da semana)
  - `qtdQuestsConcluidas` (por dia e total da semana)
  - `xpConversa`, `xpQuests` (para referência, mas lógica usa quantidade)
  - `status` (concluido/parcial/pendente) baseado em quantidade

### `webhook_concluir_quest`
- **Path:** `/webhook/concluir-quest`
- **Método:** GET
- **Parâmetros:** `usuario_id`, `quest_id`, `data_referencia` (opcional)
- **Ação:** Marca quest como concluída e calcula XP
- **Workflow ID:** `YF4CyvHY0BbLWNwC`
- **Chama:** `sw_xp_quest` para processar XP e atualizar histórico

---

## 1.1. Componentes Frontend que Consomem Webhooks

### `PainelQuestsPageV13`
- **Arquivo:** `src/pages/App/v1.3/PainelQuestsPageV13.tsx`
- **Webhooks consumidos:**
  - `webhook_quests` → via `loadQuestSnapshot()` (store)
  - `webhook_progresso_semanal` → via `loadWeeklyProgressCard()` (store)
  - `webhook_concluir_quest` → via `concluirQuest()` (store)
- **Funcionalidades:**
  - Exibe lista de quests pendentes e concluídas
  - Barra de progresso semanal (horizontal e vertical por dia)
  - Filtro por data (abas "Pendentes" e "Concluídas")
  - Botão "Concluir" (oculto para quests de conversa)
- **Dados principais:**
  - `questSnapshot.quests_personalizadas[]` (lista de quests)
  - `weeklyProgressCard.dias[]` (progresso por dia)
  - `weeklyProgressCard.qtdQuestsPrevistasSemana` / `qtdQuestsConcluidasSemana`

### `CardWeeklyProgress`
- **Arquivo:** `src/components/app/v1.3/CardWeeklyProgress.tsx`
- **Webhooks consumidos:**
  - `webhook_progresso_semanal` → via `loadWeeklyProgressCard()` (store)
- **Funcionalidades:**
  - Card de progresso semanal na home
  - Seção "Conversas" (checkboxes por dia)
  - Seção "Quests" (barra horizontal + barras verticais por dia)
- **Dados principais:**
  - `summary.dias[]` (progresso por dia)
  - `summary.qtdQuestsPrevistasSemana` / `qtdQuestsConcluidasSemana`
  - Cálculo de progresso: `qtdConcluidas / qtdPrevistas`

### `HomeV1_3`
- **Arquivo:** `src/pages/App/v1.3/HomeV1_3.tsx`
- **Webhooks consumidos:**
  - `webhook_progresso_semanal` → via `loadWeeklyProgressCard()` (store)
- **Funcionalidades:**
  - Renderiza `CardWeeklyProgress` na home
  - Carrega dados na montagem do componente

### `QuestDetailPageV13`
- **Arquivo:** `src/pages/App/v1.3/QuestDetailPageV13.tsx`
- **Webhooks consumidos:**
  - `webhook_concluir_quest` → via `concluirQuest()` (store)
- **Funcionalidades:**
  - Página de detalhes da quest
  - Botão para concluir quest
  - Atualiza dados após conclusão

### Fluxo de Dados (Store)
- **Arquivo:** `src/store/useStore.ts`
- **Funções principais:**
  - `loadQuestSnapshot()` → chama `apiService.getQuestSnapshot()` → `webhook_quests`
  - `loadWeeklyProgressCard()` → chama `apiService.getWeeklyProgressCard()` → `webhook_progresso_semanal`
  - `concluirQuest()` → chama `apiService.concluirQuest()` → `webhook_concluir_quest`
- **Estado global:**
  - `questSnapshot`: Dados de quests do usuário
  - `weeklyProgressCard`: Progresso semanal
  - `questLoading`, `weeklyProgressCardLoading`: Estados de carregamento

### `ApiService`
- **Arquivo:** `src/services/apiService.ts`
- **Métodos relacionados:**
  - `getQuestSnapshot()` → `/quests?usuario_id=...`
  - `getWeeklyProgressCard()` → `/progresso-semanal?user_id=...`
  - `concluirQuest()` → `/concluir-quest?usuario_id=...&quest_id=...`
- **Normalização:**
  - `normalizeQuestEntry()`: Normaliza dados de quest do backend
  - `extractQuestSnapshot()`: Extrai snapshot de diferentes formatos de resposta
  - Prioriza `config->>'titulo'` sobre `qc.titulo` para títulos

---

## 2. Workflows n8n Principais

### `sw_xp_quest`
- **ID:** `bTeLj5qOKQo9PDMO`
- **Status:** `active: false` (sub-workflow, não deve ser ativado)
- **Função:** Processa XP de quests e atualiza `conquistas_historico`
- **Entrada:** `usuario_id`, `quests_personalizadas[]`, `atualizacoes_status[]`
- **Saída:** XP calculado, histórico atualizado

### `sw_xp_conversas`
- **ID:** `ItBastfCTkWxm41M`
- **Status:** `active: false` (sub-workflow)
- **Função:** Processa XP de conversas diárias
- **Regra crítica:** Apenas 1 conversa por dia conta para XP
- **Atualiza:** `conquistas_historico` com `tipo = 'conversa'`

### `sw_criar_quest`
- **ID:** `LKjU8NE9aNHw7kEh`
- **Status:** `active: false`
- **Função:** Cria quests personalizadas via IA
- **Fluxo:** Agente IA → Validação → `sw_xp_quest` → Banco

---

## 3. Estruturas de Tabelas

### `usuarios_quest`
**Campos principais:**
- `id` (uuid, PK)
- `usuario_id` (uuid, FK)
- `status` (varchar): `pendente`, `ativa`, `concluida`, `vencida`, `cancelada`
- `quest_estagio` (varchar): `a_fazer`, `fazendo`, `feito`
- `catalogo_id` (uuid, FK para `quests_catalogo`) — **OBRIGATÓRIO**
- `config` (jsonb): Título, descrição, prioridade, etc.
- `recorrencias` (jsonb): Planejamento (dias, janela, tipo)
- `concluido_em`, `atualizado_em`, `ativado_em` (timestamp)

**Campos que NÃO existem:**
- ❌ `xp_concedido`
- ❌ `progresso_meta`, `progresso_atual`, `progresso_percentual`
- ❌ `contexto_origem` (está em `config`)
- ❌ `referencia_data`

### `conquistas_historico`
**Campos principais:**
- `id` (uuid, PK)
- `usuario_id` (uuid, FK)
- `usuarios_quest_id` (uuid, FK) — **USAR ESTE para joins**
- `tipo` (varchar): `quest` ou `conversa`
- `meta_codigo` (varchar): Código da meta (legado, usar `usuarios_quest_id`)
- `detalhes` (jsonb): Estrutura abaixo

**Estrutura de `detalhes`:**
```json
{
  "total_concluidas": 3,
  "ocorrencias": [
    {
      "data_planejada": "2025-11-24",
      "data_concluida": "2025-11-24",
      "data_registrada": "2025-11-24T21:35:16.842419+00",
      "xp_base": 10,
      "xp_bonus": 0,
      "usr_chat_id": "uuid-para-conversas",
      "data_conversa": "2025-11-24"
    }
  ]
}
```

**Regras:**
- 1 registro por instância de quest (`usuarios_quest_id`)
- Todas as ocorrências em `detalhes->ocorrencias[]`
- Para conversas: inclui `usr_chat_id` e `data_conversa`

### `quests_catalogo`
**Campos principais:**
- `id` (uuid, PK)
- `codigo` (varchar): `reflexao_diaria`, `quest_custom`, etc.
- `titulo`, `descricao`, `xp` (int)
- **Uso:** Referência para quests do sistema

### `usuarios_conquistas`
**Campos principais:**
- `usuario_id` (uuid, PK)
- `xp_total`, `xp_base`, `xp_bonus` (int)
- `total_quests_concluidas`, `total_quests_personalizadas` (int)
- `sequencia_atual` (int)

---

## 4. Regras de Negócio Críticas

### Identificação de Quests de Conversa
**Quests que NÃO podem ser concluídas manualmente:**
- `catalogo_codigo === 'reflexao_diaria'`
- `tipo === 'reflexao_diaria'`
- `config.conversa === true` ou `'true'`

**Ação:** Ocultar botão "Concluir" no frontend para essas quests.

### Cálculo de Progresso
**⚠️ MUDANÇA IMPORTANTE:** Sistema agora conta **quantidade de quests**, não XP.

**Fórmulas:**
- Progresso diário: `qtdConcluidas / qtdPrevistas`
- Progresso semanal: `sum(qtdConcluidas) / sum(qtdPrevistas)`
- Status: `qtdConcluidas >= qtdPrevistas` = concluído

### Prioridade de Títulos
**Ordem de prioridade para exibir título:**
1. `uq.config->>'titulo'` (quests personalizadas pela IA)
2. `qc.titulo` (catálogo)
3. `'Quest personalizada'` (fallback)

**Query exemplo:**
```sql
COALESCE(
  uq.config->>'titulo',
  qc.titulo,
  'Quest personalizada'
) AS titulo
```

### Conversas Diárias
**Regra crítica:** Apenas 1 conversa por dia conta para XP.
- Todas as conversas são registradas em `usr_chat`
- Apenas 1 por dia gera ocorrência em `conquistas_historico`
- Isso explica diferenças entre total de conversas vs ocorrências

---

## 5. Padrões e Boas Práticas

### Atualização de Nodes Postgres via MCP
**🚨 REGRA CRÍTICA:**
- **SEMPRE** incluir `operation`, `query` e `options` no mesmo update
- **NUNCA** atualizar apenas `query` ou apenas `options`
- **SEMPRE** validar `operation` após update via `n8n_get_workflow`

**Template correto:**
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

### Joins com `conquistas_historico`
**SEMPRE usar `usuarios_quest_id` para joins:**
```sql
WHERE ch.usuarios_quest_id = uq.id
  AND ch.tipo = 'quest'
```

**NÃO usar `meta_codigo`** (campo legado, pode ter inconsistências).

### Extração de Ocorrências
**Padrão para extrair ocorrências:**
```sql
CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
WHERE (occ->>'data_concluida')::date = '2025-11-24'
```

### Contagem de Quests Concluídas
**Padrão para contar quests concluídas por dia:**
```sql
SELECT
  usuario_id,
  data,
  COUNT(DISTINCT quest_id) AS qtd_quests_concluidas
FROM (
  SELECT
    ch.usuario_id,
    ch.usuarios_quest_id AS quest_id,
    (occ->>'data_concluida')::date AS data
  FROM public.conquistas_historico ch
  CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
  WHERE ch.tipo = 'quest'
    AND (occ->>'data_concluida')::date BETWEEN inicio AND fim
) AS quests_concluidas
GROUP BY usuario_id, data
```

---

## 6. Estrutura de Dados Frontend

### `WeeklyProgressDay`
```typescript
{
  data: string; // "2025-11-24"
  label: string; // "Seg"
  qtdQuestsPrevistas: number;
  qtdQuestsConcluidas: number; // ⚠️ Campo crítico
  xpQuests: number; // Para referência, mas lógica usa quantidade
  status: 'concluido' | 'parcial' | 'pendente';
}
```

### `QuestPersonalizadaResumo`
```typescript
{
  instancia_id: string;
  titulo: string; // Prioriza config->titulo
  tipo: string | null;
  catalogo_codigo: string | null;
  config: Record<string, unknown> | null;
  // ... outros campos
}
```

---

## 7. Debug e Validação

### Verificar Quest Concluída
```sql
SELECT 
  ch.*,
  occ->>'data_concluida' as data_concluida,
  occ->>'xp_base' as xp_base
FROM public.conquistas_historico ch
CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
WHERE ch.usuario_id = 'uuid'
  AND ch.usuarios_quest_id = 'uuid'
  AND ch.tipo = 'quest';
```

### Verificar Progresso Semanal
```sql
-- Verificar qtd previstas vs concluídas
SELECT 
  data,
  qtd_previstas,
  qtd_concluidas,
  CASE 
    WHEN qtd_previstas > 0 THEN ROUND((qtd_concluidas::numeric / qtd_previstas) * 100, 2)
    ELSE 0
  END as percentual
FROM (
  -- Query do webhook_progresso_semanal
) AS resumo;
```

### Logs de Execução n8n
**Comandos úteis:**
- `n8n_list_executions` com `workflowId` para ver execuções recentes
- `n8n_get_execution` com `mode: "summary"` para ver saída dos nós
- `n8n_get_execution` com `mode: "filtered"` e `nodeNames` para nó específico

---

## 8. Erros Comuns e Soluções

### Erro: `column uq.progresso_meta does not exist`
**Causa:** Campo não existe mais na tabela `usuarios_quest`.  
**Solução:** Calcular progresso a partir de `recorrencias` e `conquistas_historico`.

### Erro: `column uq.xp_concedido does not exist`
**Causa:** Campo não existe mais.  
**Solução:** Calcular XP a partir de `conquistas_historico.detalhes->ocorrencias`.

### Erro: `operation` volta para "Insert" após update
**Causa:** Update parcial sem incluir todos os parâmetros.  
**Solução:** Sempre incluir `operation`, `query` e `options` no mesmo update.

### Quest aparece como "Quest personalizada"
**Causa:** Query prioriza `qc.titulo` sobre `uq.config->>'titulo'`.  
**Solução:** Inverter ordem no `COALESCE`: `uq.config->>'titulo'` primeiro.

---

**Última atualização:** 2025-11-24

