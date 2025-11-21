# Plano de Correção: Separação Insight ↔ Quest

## Confirmação de Entendimento

### Estrutura Proposta

**ANTES (atual)**:
- **Conversa** → gera **Insight** (feedback + recursos + ações)
- **Quest** busca informações do **Insight** (feedback, recursos)

**DEPOIS (objetivo)**:
- **Conversa** → gera **Insight** (APENAS feedback sanduíche: positivo, desenvolvimento, motivacional)
- **Quest** tem suas próprias informações completas (por que é importante, como praticar, recursos)

### Responsabilidades Separadas

1. **Insight**:
   - Apenas feedback "sanduíche"
   - `feedback_positivo`: Ponto forte
   - `feedback_desenvolvimento`: Atenção/desenvolvimento
   - `feedback_motivacional`: Motivação
   - ❌ **SEM** recursos sugeridos
   - ❌ **SEM** ações/quests

2. **Quest**:
   - Todas as informações de execução
   - `feedback_importancia`: Por que é importante?
   - `feedback_orientacao`: Orientação/atenção
   - `feedback_motivacional`: Motivação
   - `recursos_sugeridos`: Array de recursos práticos
   - ✅ **AUTOCONTIDA** (não depende do insight)

---

## Análise da Estrutura Atual

### 1. Onde Quests São Geradas

**Workflow**: `sw_xp_quest.json`
- Node "Inserir Instancias" (linha 130)
- Campo `config` JSONB em `usuarios_quest`:
  ```json
  {
    "titulo": "...",
    "descricao": "...",
    "prioridade": "media",
    "recorrencia": "unica",
    "payload_extra": {}
  }
  ```

**Atualmente NÃO inclui**:
- ❌ `feedback_importancia`
- ❌ `feedback_orientacao`
- ❌ `feedback_motivacional`
- ❌ `recursos_sugeridos`

### 2. Onde Quests Buscam do Insight

**Workflow**: `webhook_quest_detail.json`
- Node "Buscar Quest Detail" (linha 24)
- JOIN com tabela `insights`:
  ```sql
  LEFT JOIN public.insights i ON i.id = uq.insight_id
  ```
- Busca:
  - `i.feedback_positivo`
  - `i.feedback_desenvolvimento`
  - `i.feedback_motivacional`
  - `i.recursos_sugeridos`

### 3. Onde Insights Exibem Recursos

**Frontend**: `InsightDetailPageV13.tsx`
- Linha 196-280: Seção "Recursos recomendados"
- Exibe `detail.recursos_sugeridos`

---

## Plano de Correção

### FASE 1: Ajustar Estrutura do Banco

#### 1.1 Atualizar campo `config` em `usuarios_quest`

**Objetivo**: Suportar novos campos no JSONB `config`

**Campos a adicionar**:
```json
{
  "titulo": "...",
  "descricao": "...",
  "prioridade": "media",
  "recorrencia": "unica",
  "xp_recompensa": 30,
  
  // NOVOS CAMPOS:
  "feedback_importancia": "Por que é importante fazer essa quest...",
  "feedback_orientacao": "Atenção para...",
  "feedback_motivacional": "Motivação para...",
  "recursos_sugeridos": [
    {
      "nome": "...",
      "tipo": "tecnica|pratica|reflexao",
      "descricao": "...",
      "aplicacao_pratica": "..."
    }
  ]
}
```

**Arquivos**:
- `backups/n8n/sw_xp_quest.json` - Node "Inserir Instancias" (linha 130)

---

### FASE 2: Atualizar Workflows de Criação de Quest

#### 2.1 Ajustar `sw_xp_quest.json`

**Node "Inserir Instancias" (linha 130)**:

**Mudança na query**:
```sql
jsonb_build_object(
  'titulo', rq.titulo,
  'descricao', rq.descricao,
  'prioridade', rq.prioridade,
  'recorrencia', rq.recorrencia,
  'xp_recompensa', rq.xp_recompensa,
  'payload_extra', rq.payload_extra,
  -- NOVOS CAMPOS:
  'feedback_importancia', COALESCE(rec->>'feedback_importancia', NULL),
  'feedback_orientacao', COALESCE(rec->>'feedback_orientacao', NULL),
  'feedback_motivacional', COALESCE(rec->>'feedback_motivacional', NULL),
  'recursos_sugeridos', COALESCE(rec->'recursos_sugeridos', '[]'::jsonb)
)
```

**Também extrair no CTE `rows`**:
```sql
rec->>'feedback_importancia' AS feedback_importancia,
rec->>'feedback_orientacao' AS feedback_orientacao,
rec->>'feedback_motivacional' AS feedback_motivacional,
COALESCE(rec->'recursos_sugeridos', '[]'::jsonb) AS recursos_sugeridos
```

#### 2.2 Identificar onde quests são geradas a partir de insights

**Workflow**: `sw_expert_insights_acionaveis.json` (precisa verificar)

**Ação**: Ajustar para incluir novos campos quando gerar quest a partir de insight.

---

### FASE 3: Atualizar Webhook de Detalhes da Quest

#### 3.1 Ajustar `webhook_quest_detail.json`

**Node "Buscar Quest Detail" (linha 24)**:

**Remover**:
- ❌ JOIN com `insights`
- ❌ Campos do insight (`i.feedback_positivo`, `i.recursos_sugeridos`, etc.)

**Manter**:
- ✅ JOIN com `areas_vida_catalogo`
- ✅ JOIN com `sabotadores_catalogo` (se necessário)
- ✅ Campos da própria quest

**Nova query**:
```sql
SELECT
  uq.id,
  uq.usuario_id,
  uq.status,
  uq.complexidade,
  uq.config->>'titulo' AS titulo,
  uq.config->>'descricao' AS descricao,
  uq.config->>'xp_recompensa' AS xp_recompensa,
  uq.config->>'prioridade' AS prioridade,
  uq.config->>'feedback_importancia' AS feedback_importancia,
  uq.config->>'feedback_orientacao' AS feedback_orientacao,
  uq.config->>'feedback_motivacional' AS feedback_motivacional,
  uq.config->'recursos_sugeridos' AS recursos_sugeridos,
  uq.area_vida_id,
  av.nome AS area_vida_nome,
  av.descricao AS area_vida_descricao,
  av.codigo AS area_vida_codigo,
  uq.sabotador_id,
  sc.nome AS sabotador_nome,
  sc.descricao AS sabotador_descricao,
  -- Remover campos do insight
FROM public.usuarios_quest uq
LEFT JOIN public.areas_vida_catalogo av ON av.id = uq.area_vida_id
LEFT JOIN public.sabotadores_catalogo sc ON sc.id = uq.sabotador_id
WHERE uq.id = $1::uuid AND uq.usuario_id = $2::uuid;
```

**Node "Montar Resposta" (linha 43)**:

**Ajustar mapeamento**:
```javascript
{
  // ... campos existentes ...
  feedback_importancia: row.feedback_importancia || null,
  feedback_orientacao: row.feedback_orientacao || null,
  feedback_motivacional: row.feedback_motivacional || null,
  recursos_sugeridos: row.recursos_sugeridos || [],
  // Remover: insight: {...}
}
```

---

### FASE 4: Atualizar Frontend

#### 4.1 Remover recursos do Insight Detail Page

**Arquivo**: `src/pages/App/v1.3/InsightDetailPageV13.tsx`

**Linha 196-280**: Remover seção "Recursos recomendados"

**Mudança**:
```tsx
// REMOVER:
{recursosSugeridos.length > 0 && (
  <div className="mt-5 space-y-3">
    <p className="text-sm font-semibold text-[#1C2541]">
      Recursos recomendados
    </p>
    {recursosSugeridos.map((resource) => (
      <ResourceCard
        key={`${resource.nome}-${resource.tipo}`}
        resource={resource}
      />
    ))}
  </div>
)}
```

#### 4.2 Ajustar Quest Detail Page

**Arquivo**: `src/pages/App/v1.3/QuestDetailPageV13.tsx`

**Verificar se já busca do lugar correto** (deve buscar do webhook, não do insight)

---

### FASE 5: Atualizar Tipos TypeScript

#### 5.1 Ajustar interface `QuestDetail`

**Arquivo**: `src/types/emotions.ts`

**Mudança**:
```typescript
export interface QuestDetail {
  id: string;
  usuario_id: string;
  status: 'pendente' | 'ativa' | 'concluida' | 'vencida' | 'cancelada' | 'reiniciada';
  titulo: string;
  descricao: string;
  xp_recompensa?: number;
  prioridade: 'baixa' | 'media' | 'alta';
  complexidade: number;
  area_vida?: AreaVida;
  sabotador?: QuestDetailSabotador;
  concluido_em?: string;
  
  // NOVOS CAMPOS (não mais do insight):
  feedback_importancia?: string;
  feedback_orientacao?: string;
  feedback_motivacional?: string;
  recursos_sugeridos?: InsightResource[];
  
  // REMOVER: insight?: QuestDetailInsight;
}
```

#### 5.2 Ajustar interface `InsightDetail`

**Remover**:
```typescript
// REMOVER:
recursos_sugeridos?: InsightResource[];
```

---

## Checklist de Implementação

### Backend (n8n)

- [ ] **1.1** Atualizar `sw_xp_quest.json` para incluir novos campos no `config`
- [ ] **1.2** Identificar onde quests são geradas a partir de insights
- [ ] **1.3** Ajustar geração de quests para incluir novos campos
- [ ] **2.1** Atualizar `webhook_quest_detail.json` para não buscar do insight
- [ ] **2.2** Remover JOIN com `insights` no webhook
- [ ] **2.3** Ajustar mapeamento de resposta no webhook

### Frontend

- [ ] **3.1** Remover seção de recursos do `InsightDetailPageV13.tsx`
- [ ] **3.2** Verificar `QuestDetailPageV13.tsx` busca dados corretos
- [ ] **3.3** Ajustar tipos TypeScript (`QuestDetail`, `InsightDetail`)
- [ ] **3.4** Atualizar `apiService.getQuestDetail()` se necessário

### Testes

- [ ] **4.1** Testar criação de quest com novos campos
- [ ] **4.2** Testar webhook `quest-detail` retorna dados corretos
- [ ] **4.3** Testar página de detalhes de insight (sem recursos)
- [ ] **4.4** Testar página de detalhes de quest (com recursos)

---

## Notas Importantes

1. **Migração de dados**: Questas existentes precisam ter os campos preenchidos ou buscar do insight na primeira vez
2. **Compatibilidade**: Manter compatibilidade com quests antigas que não têm os novos campos
3. **Geração futura**: Ajustar workflow que gera quests a partir de insights para já incluir os novos campos

---

## Próximos Passos

1. Confirmar entendimento do plano
2. Implementar FASE 1 (estrutura do banco)
3. Implementar FASE 2 (workflows de criação)
4. Implementar FASE 3 (webhook de detalhes)
5. Implementar FASE 4 (frontend)
6. Testar e validar
