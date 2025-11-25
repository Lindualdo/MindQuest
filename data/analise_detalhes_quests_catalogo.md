# Análise: Implementação de Detalhes das Quests do Catálogo

**Data:** 2025-01-22

## Contexto

Implementar tela de detalhes da quest ao clicar em "Saber mais" no painel de quests, exibindo informações do catálogo de quests (`quests_catalogo`):
- Referências científicas
- Como aplicar
- Benefícios
- Ferramentas e recursos

---

## 1. Situação Atual

### 1.1 Fluxo Frontend

1. **PainelQuestsPageV13.tsx** (linha 287):
   - Botão "Saber mais" chama `openQuestDetail(questId)`

2. **Store (useStore.ts)** (linha 939):
   - `openQuestDetail()` chama `apiService.getQuestDetail(userId, questId)`
   - Muda view para `'questDetail'`

3. **apiService.ts** (linha 1229):
   - Endpoint: `/quest-detail?user_id=...&quest_id=...`
   - Retorna objeto `QuestDetail`

4. **QuestDetailPageV13.tsx**:
   - Exibe dados da quest
   - Campos atuais: título, descrição, XP, área de vida, insight, sabotador
   - **NÃO exibe dados do catálogo**

### 1.2 Fluxo Backend (n8n)

**Workflow:** `webhook_quest_detail` (ID: `pTtnu2YVLGuV7IxM`)
- **Path:** `/quest-detail`
- **Query atual:**
  ```sql
  SELECT
    uq.id, uq.usuario_id, uq.status, uq.config->>'titulo' AS titulo,
    uq.config->>'descricao' AS descricao, ...
    -- Busca dados de usuarios_quest, areas_vida, insights, sabotadores
  FROM public.usuarios_quest uq
  LEFT JOIN public.areas_vida_catalogo av ON av.id = uq.area_vida_id
  LEFT JOIN public.insights i ON i.id = uq.insight_id
  LEFT JOIN public.sabotadores_catalogo sc ON sc.id = uq.sabotador_id
  WHERE uq.id = $1::uuid AND uq.usuario_id = $2::uuid;
  ```

**Problemas:**
1. Query NÃO busca dados de `quests_catalogo`
2. Query ainda busca dados de `insights` via `LEFT JOIN public.insights i ON i.id = uq.insight_id` — **DEPRECADO**
3. **Nova arquitetura:** Quests agora estão relacionadas apenas com `quests_catalogo` via `catalogo_id`
4. Campo `instrucoes` (jsonb) em `quests_catalogo` deve ser a fonte principal de informações

---

## 2. Estrutura do Banco de Dados

### 2.1 Tabela `quests_catalogo`

**Campos principais:**
```sql
- id (uuid, PK)
- codigo (varchar(64), UNIQUE) -- Ex: 'reflexao_diaria', 'micro_acao_coragem'
- titulo (varchar(200))
- descricao (text)
- instrucoes (jsonb) -- ✅ NOVA FONTE PRINCIPAL DE INFORMAÇÕES
- categoria (varchar(50))
- nivel_prioridade (smallint, 1-4)
- tipo_recorrencia (varchar(20))
- tempo_estimado_min (smallint)
- dificuldade (smallint, 1-3)
- base_cientifica (jsonb) -- ✅ TEM OS DADOS QUE PRECISAMOS!
- areas_vida_ids (uuid[])
- sabotador_id (text)
- ativo (boolean)
- xp (integer)
```

**NOTA:** Campo `instrucoes` está vazio atualmente, mas é onde devem estar as informações futuramente.

### 2.2 Campo `base_cientifica` (jsonb) - ESTRUTURA

Exemplos encontrados:

**Quest: `micro_acao_coragem`**
```json
{
  "tipo": "tecnica",
  "objetivo": "Quebrar padrões de medo e criar novos caminhos neurais",
  "fundamentos": "Neurociência: Quebra padrões neurais de medo/evitação, cria novos caminhos neurais (neuroplasticidade), fortalece autoconfiança",
  "como_aplicar": "Identifique 1 ação que gera desconforto leve mas é importante. Exemplos: ligar para alguém, iniciar conversa difícil, dizer não, pedir ajuda. Execute mesmo com desconforto.",
  "links_referencias": []
}
```

**Quest: `reconhecimento_progresso`**
```json
{
  "tipo": "tecnica",
  "objetivo": "Reforçar comportamentos positivos e reduzir foco no que falta",
  "fundamentos": "TCC: Reforço positivo. Neurociência: Ativa sistema de recompensa (dopamina), reduz viés de negatividade",
  "como_aplicar": "Ao final do dia, liste 1-3 micro-vitórias (mesmo pequenas). Reconheça 1 progresso específico em área importante. Agradeça por 1 coisa específica (não genérica).",
  "links_referencias": []
}
```

**Quest: `reflexao_diaria`**
```json
{
  "tipo": "tecnica",
  "objetivo": "Criar autoconsciência, alinhar intenções com ações e consolidar aprendizados diários",
  "fundamentos": "Neurociência: Ativa córtex pré-frontal (controle executivo) e fortalece memória de trabalho. Estoicismo: Prática de exame de consciência e dichotomia de controle",
  "como_aplicar": "1. Manhã: Conversar com assistente sobre o que está sob seu controle hoje. 2. Durante o dia: Conversa livre com assistente para reflexão. 3. Noite: Revisar o dia com assistente - o que fez bem e o que aprendeu",
  "links_referencias": []
}
```

### 2.3 Relacionamento

**`usuarios_quest` → `quests_catalogo`**
- Campo `usuarios_quest.catalogo_id` (FK para `quests_catalogo.id`) — **FONTE PRINCIPAL**
- **IMPORTANTE:** Nem todas as quests têm `catalogo_id` preenchido
- Quests personalizadas podem ter `catalogo_id = '00000000-0000-0000-0000-000000000001'` (quest_custom)

**⚠️ MUDANÇA ARQUITETURAL:**
- **ANTES:** `usuarios_quest.insight_id` → `insights` (DEPRECADO - não usar mais)
- **AGORA:** `usuarios_quest.catalogo_id` → `quests_catalogo` (fonte única de dados)
- Campo `instrucoes` em `quests_catalogo` é a nova fonte de informações detalhadas

---

## 3. Mapeamento: O que o usuário quer vs. O que temos no banco

| Solicitação | Campo no Banco | Estrutura |
|------------|----------------|-----------|
| **Referências científicas** | `base_cientifica.fundamentos` | String com explicação científica |
| **Como aplicar** | `base_cientifica.como_aplicar` OU `instrucoes` | String com instruções passo a passo |
| **Benefícios** | `base_cientifica.objetivo` | String explicando o objetivo/benefício |
| **Ferramentas e recursos** | `instrucoes` (jsonb) | JSONB — **FONTE PRINCIPAL** (estrutura a definir) OU `base_cientifica.links_referencias` (array) |

**Prioridade de fontes:**
1. `quests_catalogo.instrucoes` (nova fonte principal — quando preenchido)
2. `quests_catalogo.base_cientifica` (fonte atual — já preenchido)
3. `base_cientifica.links_referencias` (array de links)

---

## 4. Interface TypeScript Atual

**`src/types/emotions.ts`** - Interface `QuestDetail`:
```typescript
export interface QuestDetail {
  id: string;
  usuario_id: string;
  status: QuestStatus;
  titulo: string;
  descricao?: string;
  xp_recompensa?: number | null;
  prioridade?: string;
  tipo?: string | null;
  complexidade: number;
  progresso_meta?: number | null;
  progresso_atual: number;
  xp_concedido: number;
  recorrencias?: any | null;
  area_vida?: AreaVida | null;
  insight?: QuestDetailInsight | null;
  sabotador?: QuestDetailSabotador | null;
  // ❌ FALTANDO: Dados do catálogo
}
```

**Precisa:**
1. **REMOVER** campo `insight?: QuestDetailInsight | null;` (deprecado)
2. **ADICIONAR** campo `catalogo`:
```typescript
catalogo?: {
  codigo?: string | null;
  base_cientifica?: {
    tipo?: string;
    objetivo?: string;
    fundamentos?: string;
    como_aplicar?: string;
    links_referencias?: string[];
  } | null;
  instrucoes?: Record<string, unknown> | null; // ✅ FONTE PRINCIPAL (quando preenchido)
  tempo_estimado_min?: number | null;
  dificuldade?: number | null;
  categoria?: string | null;
} | null;
```

---

## 5. Plano de Implementação

### FASE 1: Atualizar Backend (n8n)

**Workflow:** `webhook_quest_detail`

**Ações:**
1. **REMOVER** relacionamento com `insights` (deprecado)
2. Atualizar query SQL do nó "Buscar Quest Detail" para incluir JOIN com `quests_catalogo`:
   ```sql
   SELECT
     uq.id,
     uq.usuario_id,
     uq.status,
     uq.progresso_meta,
     uq.progresso_atual,
     uq.xp_concedido,
     uq.complexidade,
     uq.config->>'titulo' AS titulo,
     uq.config->>'descricao' AS descricao,
     uq.config->>'xp_recompensa' AS xp_recompensa,
     uq.config->>'prioridade' AS prioridade,
     uq.config->>'tipo' AS tipo,
     uq.recorrencias,
     uq.area_vida_id,
     av.nome AS area_vida_nome,
     av.descricao AS area_vida_descricao,
     av.codigo AS area_vida_codigo,
     -- ❌ REMOVER: LEFT JOIN public.insights i ON i.id = uq.insight_id
     -- ❌ REMOVER: todos os campos relacionados a insights
     uq.sabotador_id,
     sc.nome AS sabotador_nome,
     sc.descricao AS sabotador_descricao,
     sc.contextos_tipicos AS sabotador_contextos,
     sc.contramedidas_sugeridas AS sabotador_contramedidas,
     -- ✅ NOVO: Dados do catálogo (fonte principal)
     qc.codigo AS catalogo_codigo,
     qc.base_cientifica AS catalogo_base_cientifica,
     qc.instrucoes AS catalogo_instrucoes, -- ✅ NOVA FONTE PRINCIPAL
     qc.tempo_estimado_min AS catalogo_tempo_estimado,
     qc.dificuldade AS catalogo_dificuldade,
     qc.categoria AS catalogo_categoria
   FROM public.usuarios_quest uq
   LEFT JOIN public.areas_vida_catalogo av ON av.id = uq.area_vida_id
   -- ❌ REMOVER: LEFT JOIN public.insights i ON i.id = uq.insight_id
   LEFT JOIN public.sabotadores_catalogo sc ON sc.id = uq.sabotador_id
   LEFT JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id -- ✅ NOVO
   WHERE uq.id = $1::uuid AND uq.usuario_id = $2::uuid;
   ```

2. Atualizar nó "Montar Resposta" para:
   - **REMOVER** construção do objeto `insight` (deprecado)
   - **ADICIONAR** construção do objeto `catalogo`:
   ```javascript
   // ❌ REMOVER: insight: row.insight_id ? { ... } : null
   
   // ✅ ADICIONAR:
   catalogo: row.catalogo_codigo ? {
     codigo: row.catalogo_codigo,
     base_cientifica: row.catalogo_base_cientifica,
     instrucoes: row.catalogo_instrucoes, // ✅ FONTE PRINCIPAL
     tempo_estimado_min: row.catalogo_tempo_estimado,
     dificuldade: row.catalogo_dificuldade,
     categoria: row.catalogo_categoria
   } : null
   ```

### FASE 2: Atualizar Frontend - Tipos TypeScript

**Arquivo:** `src/types/emotions.ts`

**Ações:**
1. Criar interface `QuestDetailCatalogo`:
   ```typescript
   export interface QuestDetailCatalogo {
     codigo?: string | null;
     base_cientifica?: {
       tipo?: string;
       objetivo?: string;
       fundamentos?: string;
       como_aplicar?: string;
       links_referencias?: string[];
     } | null;
     instrucoes?: Record<string, unknown> | null;
     tempo_estimado_min?: number | null;
     dificuldade?: number | null;
     categoria?: string | null;
   }
   ```

2. Adicionar campo `catalogo` na interface `QuestDetail`:
   ```typescript
   export interface QuestDetail {
     // ... campos existentes
     catalogo?: QuestDetailCatalogo | null;
   }
   ```

### FASE 3: Atualizar Frontend - UI

**Arquivo:** `src/pages/App/v1.3/QuestDetailPageV13.tsx`

**Ações:**
1. Adicionar seções após a descrição da quest:

   **a) Referências Científicas** (se `catalogo?.base_cientifica?.fundamentos` existir):
   ```tsx
   {detail.catalogo?.base_cientifica?.fundamentos && (
     <div className="mb-4 rounded-2xl bg-blue-50 px-4 py-3">
       <h3 className="mb-2 text-sm font-semibold text-blue-900">
         📚 Fundamentos Científicos
       </h3>
       <p className="text-sm leading-relaxed text-blue-800">
         {detail.catalogo.base_cientifica.fundamentos}
       </p>
     </div>
   )}
   ```

   **b) Como Aplicar** (se `catalogo?.base_cientifica?.como_aplicar` existir):
   ```tsx
   {detail.catalogo?.base_cientifica?.como_aplicar && (
     <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3">
       <h3 className="mb-2 text-sm font-semibold text-amber-900">
         🎯 Como Aplicar
       </h3>
       <p className="text-sm leading-relaxed text-amber-800 whitespace-pre-line">
         {detail.catalogo.base_cientifica.como_aplicar}
       </p>
     </div>
   )}
   ```

   **c) Benefícios** (se `catalogo?.base_cientifica?.objetivo` existir):
   ```tsx
   {detail.catalogo?.base_cientifica?.objetivo && (
     <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3">
       <h3 className="mb-2 text-sm font-semibold text-emerald-900">
         ✨ Benefícios
       </h3>
       <p className="text-sm leading-relaxed text-emerald-800">
         {detail.catalogo.base_cientifica.objetivo}
       </p>
     </div>
   )}
   ```

   **d) Links de Referências** (se `catalogo?.base_cientifica?.links_referencias` existir):
   ```tsx
   {detail.catalogo?.base_cientifica?.links_referencias?.length > 0 && (
     <div className="mb-4 rounded-2xl bg-purple-50 px-4 py-3">
       <h3 className="mb-2 text-sm font-semibold text-purple-900">
         📖 Referências
       </h3>
       <ul className="space-y-2">
         {detail.catalogo.base_cientifica.links_referencias.map((link, idx) => (
           <li key={idx}>
             <a href={link} target="_blank" rel="noopener noreferrer" 
                className="text-sm text-purple-700 underline">
               {link}
             </a>
           </li>
         ))}
       </ul>
     </div>
   )}
   ```

2. **REMOVER** seções relacionadas a `insight` (deprecado):
   - Feedback positivo (via insight)
   - Como praticar/Recursos (via insight)
   - Link para insight completo

3. Ordem sugerida de exibição:
   - Título e descrição (existente)
   - **Benefícios** (`catalogo.base_cientifica.objetivo`) (novo)
   - **Referências Científicas** (`catalogo.base_cientifica.fundamentos`) (novo)
   - **Como Aplicar** (`catalogo.base_cientifica.como_aplicar` OU `catalogo.instrucoes`) (novo)
   - **Ferramentas e Recursos** (`catalogo.instrucoes`) (novo — quando estrutura definida)
   - **Links de Referências** (`catalogo.base_cientifica.links_referencias`) (novo)
   - Área de vida (existente)
   - Sabotador (existente - se houver)
   - Botão concluir (existente)

### FASE 4: Validação e Testes

**Checklist:**
- [ ] Testar com quest que TEM `catalogo_id` preenchido
- [ ] Testar com quest que NÃO TEM `catalogo_id` (quest personalizada)
- [ ] Verificar se campos opcionais não quebram quando vazios
- [ ] Validar formatação de texto (quebras de linha em `como_aplicar`)
- [ ] Testar links de referências (se houver)

---

## 6. Observações Importantes

1. **Quests personalizadas (`quest_custom`):**
   - Podem ter `catalogo_id` mas com `base_cientifica` genérico
   - Interface deve tratar caso quando `catalogo` é `null` ou dados são genéricos

2. **Campo `instrucoes`:**
   - Atualmente vazio na maioria das quests
   - Pode ser usado no futuro para ferramentas/recursos adicionais
   - Por enquanto, focar em `base_cientifica`

3. **Mudança arquitetural:**
   - **❌ REMOVER:** Relacionamento com `insights` (deprecado)
   - **✅ NOVO:** Fonte única de dados é `quests_catalogo` via `catalogo_id`
   - **Prioridade de dados:**
     - `catalogo.instrucoes` (quando preenchido) — **FONTE PRINCIPAL**
     - `catalogo.base_cientifica` (já preenchido) — fonte atual
     - Se não tem `catalogo_id`, quest é personalizada e usa apenas dados de `config`

4. **Links de referências:**
   - Campo `links_referencias` existe mas está vazio nos exemplos
   - Preparar estrutura para quando houver dados

---

## 7. Mudanças Arquiteturais Importantes

### 7.1 Relacionamento com Insights - DEPRECADO

**ANTES:**
- `usuarios_quest.insight_id` → `insights`
- Workflow buscava dados de insights para exibir na tela de detalhes

**AGORA:**
- ❌ **NÃO usar mais** relacionamento com `insights`
- ✅ **Usar apenas** `usuarios_quest.catalogo_id` → `quests_catalogo`
- Fonte de dados: `quests_catalogo.instrucoes` + `quests_catalogo.base_cientifica`

### 7.2 Campo `instrucoes` em `quests_catalogo`

- Campo JSONB destinado a ser a **fonte principal** de informações
- Atualmente vazio na maioria das quests
- Estrutura ainda a ser definida
- Por enquanto, usar `base_cientifica` que já está preenchido

---

## 8. Próximos Passos

1. ✅ **Análise completa** (este documento)
2. ⏳ **Revisar plano com usuário**
3. ⏳ **Implementar FASE 1** (Backend n8n - remover insights, adicionar catálogo)
4. ⏳ **Implementar FASE 2** (Tipos TypeScript - remover insight, adicionar catalogo)
5. ⏳ **Implementar FASE 3** (UI - remover seções de insight, adicionar seções do catálogo)
6. ⏳ **FASE 4** (Testes)

---

## 8. Consultas Úteis

**Verificar quests com catálogo:**
```sql
SELECT uq.id, qc.codigo, qc.titulo, qc.base_cientifica
FROM public.usuarios_quest uq
JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
WHERE uq.usuario_id = 'SEU_USER_ID'
LIMIT 5;
```

**Verificar estrutura de base_cientifica:**
```sql
SELECT codigo, titulo, jsonb_pretty(base_cientifica)
FROM public.quests_catalogo
WHERE base_cientifica IS NOT NULL
  AND base_cientifica != '{}'::jsonb
LIMIT 3;
```

