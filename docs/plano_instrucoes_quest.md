# Plano Detalhado: Separação Quest-Insight com Campo `instrucoes`

## Confirmação de Entendimento

### Estrutura Proposta

**Fluxo atual**:
1. `sw_criar_quest` → Agente IA gera quests
2. `sw_xp_quest` → Persiste na tabela `usuarios_quest`
3. Quest busca dados do `insight` via JOIN

**Fluxo objetivo**:
1. `sw_criar_quest` → Agente IA gera quests **completas** (incluindo instruções)
2. `sw_xp_quest` → Persiste na tabela `usuarios_quest` com novo campo `instrucoes`
3. Quest é **autocontida** (não depende do insight)

### Novo Campo: `usuarios_quest.instrucoes` (JSONB)

**Conteúdo**:
```json
{
  "feedback_importancia": "Por que é importante fazer essa quest...",
  "feedback_orientacao": "Atenção para...",
  "feedback_motivacional": "Motivação para...",
  "recursos_sugeridos": [
    {
      "nome": "...",
      "tipo": "tecnica|pratica|reflexao|conceito|leitura",
      "descricao": "...",
      "aplicacao_pratica": "..."
    }
  ]
}
```

---

## Análise dos Workflows

### 1. `sw_criar_quest` (Workflow de Criação)

**Localização**: `backups/n8n/sw_criar_quest.json`

**Fluxo atual**:
1. Normalizar Entrada
2. Buscar contexto (quests, conversas, insights, sabotadores, áreas)
3. Montar Contexto
4. **Agente Quests** (linha 223) - Gera JSON de quests
5. Interpretar Resultado
6. Aplicar Limites & Dedupe (linha 263) - Valida e filtra
7. Chama `sw_xp_quest`

**Nodes relevantes**:
- **Node "Agente Quests"** (linha 223):
  - Prompt atual (linha 214): Gera apenas campos básicos
  - JSON Schema Example (linha 233): Exemplo básico
  
- **Node "Aplicar Limites & Dedupe"** (linha 263):
  - Valida e filtra quests
  - Monta objeto final com campos básicos

**Campos gerados atualmente**:
- `titulo`, `descricao`, `contexto_origem`, `prioridade`, `recorrencia`
- `prazo_inicio`, `prazo_fim`, `progresso_meta`, `status_inicial`
- `xp_recompensa`, `insight_id`, `sabotador_id`, `area_vida_id`, `complexidade`
- `payload_extra`

**Campos a adicionar**:
- `feedback_importancia`
- `feedback_orientacao`
- `feedback_motivacional`
- `recursos_sugeridos` (array)

---

### 2. `sw_xp_quest` (Workflow de Persistência)

**Localização**: `backups/n8n/sw_xp_quest.json`

**Fluxo atual**:
1. Normalizar Entrada
2. Preparar Operacoes
3. **Inserir Instancias** (linha 136) - Insere na tabela
4. Aplicar Atualizacoes

**Node "Inserir Instancias"** (linha 136):
- Query SQL (linha 130)
- Extrai campos do JSON recebido
- Monta campo `config` com: `titulo`, `descricao`, `prioridade`, `recorrencia`, `payload_extra`
- **NÃO** extrai nem insere os novos campos

**Mudança necessária**:
- Extrair campos de instruções do JSON recebido
- Inserir no campo `instrucoes` (novo campo JSONB)
- Ou manter em `config` se preferir (preciso confirmar estrutura)

---

## Plano de Trabalho Detalhado

### FASE 1: Criar Campo `instrucoes` na Tabela

#### 1.1 Migration SQL

**Arquivo**: Criar novo arquivo de migration ou executar diretamente

**SQL**:
```sql
-- Adicionar coluna instrucoes (JSONB)
ALTER TABLE public.usuarios_quest 
ADD COLUMN IF NOT EXISTS instrucoes JSONB DEFAULT NULL;

-- Index para queries rápidas (opcional, mas recomendado)
CREATE INDEX IF NOT EXISTS idx_usuarios_quest_instrucoes 
ON public.usuarios_quest USING gin(instrucoes);

-- Comentário
COMMENT ON COLUMN public.usuarios_quest.instrucoes IS 
'Instruções completas da quest: feedback_importancia, feedback_orientacao, feedback_motivacional e recursos_sugeridos. Quest autocontida, não depende do insight.';
```

**Status**: ⏳ Aguardando execução

---

### FASE 2: Ajustar `sw_criar_quest` - Prompt do Agente

#### 2.1 Atualizar Prompt do Agente Quests

**Node**: "Agente Quests" (linha 223)

**Arquivo**: `backups/n8n/sw_criar_quest.json`

**Mudança no prompt** (linha 214):
- **ADICIONAR** instruções para gerar:
  - `feedback_importancia`: "Por que é importante fazer essa quest" (20-30 palavras)
  - `feedback_orientacao`: "Atenção para..." ou "Orientações importantes" (20-30 palavras)
  - `feedback_motivacional`: "Motivação para executar" (20-30 palavras)
  - `recursos_sugeridos`: Array de 2-4 recursos práticos

**Seção a adicionar no prompt**:
```
=== Estrutura de cada Quest ===
Para cada quest, forneça também:
- feedback_importancia: Explicação breve (20-30 palavras) sobre por que é importante fazer essa quest
- feedback_orientacao: Atenções ou orientações importantes (20-30 palavras)
- feedback_motivacional: Mensagem motivacional para executar (20-30 palavras)
- recursos_sugeridos: Array de 2-4 recursos práticos com:
  * nome: Nome do recurso
  * tipo: "tecnica"|"pratica"|"reflexao"|"conceito"|"leitura"
  * descricao: Descrição breve do recurso
  * aplicacao_pratica: Como aplicar na prática
```

**Status**: ⏳ Aguardando implementação

---

#### 2.2 Atualizar JSON Schema Example

**Node**: "Parser JSON" (linha 237)

**Arquivo**: `backups/n8n/sw_criar_quest.json`

**Mudança no exemplo** (linha 233):
- **ADICIONAR** os novos campos no exemplo JSON

**Exemplo atual**:
```json
{"novas_quests":[{"titulo":"Check-in matinal","descricao":"Registrar uma vitória pequena toda manhã","contexto_origem":"manter_foco","prioridade":"media","recorrencia":"diaria","prazo_inicio":"2025-11-05","prazo_fim":"2025-11-11","progresso_meta":5,"status_inicial":"pendente","xp_recompensa":40,"insight_id":"33333333-3333-4333-8333-333333333333","sabotador_id":"11111111-1111-1111-1111-111111111111","area_vida_id":"22222222-2222-2222-2222-222222222222","complexidade":2,"payload_extra":{"canal":"app"}}],...}
```

**Exemplo novo** (adicionar campos):
```json
{"novas_quests":[{"titulo":"Check-in matinal","descricao":"Registrar uma vitória pequena toda manhã","contexto_origem":"manter_foco","prioridade":"media","recorrencia":"diaria","prazo_inicio":"2025-11-05","prazo_fim":"2025-11-11","progresso_meta":5,"status_inicial":"pendente","xp_recompensa":40,"insight_id":"33333333-3333-4333-8333-333333333333","sabotador_id":"11111111-1111-1111-1111-111111111111","area_vida_id":"22222222-2222-2222-2222-222222222222","complexidade":2,"payload_extra":{"canal":"app"},"feedback_importancia":"Registrar vitórias diárias fortalece o senso de controle e ajuda a equilibrar o foco negativo, aumentando motivação.","feedback_orientacao":"Seja específico ao registrar. Qualquer pequeno progresso conta, mesmo que pareça insignificante.","feedback_motivacional":"Cada vitória registrada é um passo firme na direção de maior autoconfiança e clareza sobre seus avanços.","recursos_sugeridos":[{"nome":"Diário de Vitórias","tipo":"pratica","descricao":"Registro diário de conquistas pequenas e grandes.","aplicacao_pratica":"No final do dia, escreva 1-3 vitórias específicas. Pode ser no app ou em um caderno físico."}]}],...}
```

**Status**: ⏳ Aguardando implementação

---

#### 2.3 Atualizar Node "Aplicar Limites & Dedupe"

**Node**: "Aplicar Limites & Dedupe" (linha 263)

**Arquivo**: `backups/n8n/sw_criar_quest.json`

**Mudança no código JavaScript**:
- **ADICIONAR** extração e validação dos novos campos
- **ADICIONAR** campos ao objeto final enviado para `sw_xp_quest`

**Código atual** (linha 260-310):
- Monta objeto com campos básicos
- Não extrai nem valida novos campos

**Código novo** (adicionar após validação de campos existentes):
```javascript
// Extrair campos de instruções
const feedbackImportancia = quest.feedback_importancia || null;
const feedbackOrientacao = quest.feedback_orientacao || null;
const feedbackMotivacional = quest.feedback_motivacional || null;

// Validar recursos_sugeridos
let recursosSugeridos = [];
if (Array.isArray(quest.recursos_sugeridos)) {
  recursosSugeridos = quest.recursos_sugeridos
    .filter((r) => r && typeof r === 'object' && r.nome && r.tipo)
    .map((r) => ({
      nome: String(r.nome || ''),
      tipo: String(r.tipo || 'pratica'),
      descricao: String(r.descricao || ''),
      aplicacao_pratica: String(r.aplicacao_pratica || '')
    }));
}

// Adicionar ao objeto final
novas.push({
  // ... campos existentes ...
  feedback_importancia: feedbackImportancia,
  feedback_orientacao: feedbackOrientacao,
  feedback_motivacional: feedbackMotivacional,
  recursos_sugeridos: recursosSugeridos
});
```

**Status**: ⏳ Aguardando implementação

---

### FASE 3: Ajustar `sw_xp_quest` - Persistência

#### 3.1 Atualizar Node "Inserir Instancias"

**Node**: "Inserir Instancias" (linha 136)

**Arquivo**: `backups/n8n/sw_xp_quest.json`

**Mudança na query SQL** (linha 130):
- **ADICIONAR** extração dos novos campos no CTE `rows`
- **ADICIONAR** campo `instrucoes` no INSERT
- **ADICIONAR** montagem do JSONB `instrucoes` no INSERT

**Mudanças na query**:

**1. CTE `rows`** - Adicionar extração:
```sql
rec->>'feedback_importancia' AS feedback_importancia,
rec->>'feedback_orientacao' AS feedback_orientacao,
rec->>'feedback_motivacional' AS feedback_motivacional,
COALESCE(rec->'recursos_sugeridos', '[]'::jsonb) AS recursos_sugeridos
```

**2. CTE `recorrencias_quest`** - Passar campos adiante (já vem de `rows`)

**3. INSERT** - Adicionar campo `instrucoes`:
```sql
INSERT INTO public.usuarios_quest (
  -- ... campos existentes ...
  instrucoes  -- NOVO
)
SELECT
  -- ... valores existentes ...
  jsonb_build_object(
    'feedback_importancia', rq.feedback_importancia,
    'feedback_orientacao', rq.feedback_orientacao,
    'feedback_motivacional', rq.feedback_motivacional,
    'recursos_sugeridos', COALESCE(rq.recursos_sugeridos, '[]'::jsonb)
  )  -- NOVO
FROM recorrencias_quest rq
```

**Status**: ⏳ Aguardando implementação

---

### FASE 4: Atualizar `webhook_quest_detail` - Buscar do Campo Correto

#### 4.1 Atualizar Query de Busca

**Node**: "Buscar Quest Detail" (linha 24)

**Arquivo**: `backups/n8n/webhook_quest_detail.json`

**Mudança na query**:
- **REMOVER** JOIN com tabela `insights`
- **ADICIONAR** extração do campo `instrucoes`
- **ADICIONAR** campos de `instrucoes` no SELECT

**Query nova**:
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
  -- Campos de instrucoes (NOVO):
  uq.instrucoes->>'feedback_importancia' AS feedback_importancia,
  uq.instrucoes->>'feedback_orientacao' AS feedback_orientacao,
  uq.instrucoes->>'feedback_motivacional' AS feedback_motivacional,
  uq.instrucoes->'recursos_sugeridos' AS recursos_sugeridos,
  -- Área de vida e sabotador (manter):
  uq.area_vida_id,
  av.nome AS area_vida_nome,
  av.descricao AS area_vida_descricao,
  av.codigo AS area_vida_codigo,
  uq.sabotador_id,
  sc.nome AS sabotador_nome,
  sc.descricao AS sabotador_descricao
  -- REMOVER: campos do insight
FROM public.usuarios_quest uq
LEFT JOIN public.areas_vida_catalogo av ON av.id = uq.area_vida_id
LEFT JOIN public.sabotadores_catalogo sc ON sc.id = uq.sabotador_id
WHERE uq.id = $1::uuid AND uq.usuario_id = $2::uuid;
```

**Status**: ⏳ Aguardando implementação

---

#### 4.2 Atualizar Node "Montar Resposta"

**Node**: "Montar Resposta" (linha 43)

**Arquivo**: `backups/n8n/webhook_quest_detail.json`

**Mudança no JavaScript**:
- **REMOVER** objeto `insight` da resposta
- **ADICIONAR** campos de `instrucoes` na resposta

**Código novo**:
```javascript
{
  // ... campos existentes ...
  feedback_importancia: row.feedback_importancia || null,
  feedback_orientacao: row.feedback_orientacao || null,
  feedback_motivacional: row.feedback_motivacional || null,
  recursos_sugeridos: Array.isArray(row.recursos_sugeridos) 
    ? row.recursos_sugeridos 
    : (row.recursos_sugeridos || []),
  // REMOVER: insight: {...}
}
```

**Status**: ⏳ Aguardando implementação

---

## Checklist de Implementação

### Backend (n8n + Banco)

- [ ] **1.1** Executar migration SQL para criar campo `instrucoes`
- [ ] **2.1** Atualizar prompt do "Agente Quests" em `sw_criar_quest`
- [ ] **2.2** Atualizar JSON Schema Example do "Parser JSON"
- [ ] **2.3** Atualizar node "Aplicar Limites & Dedupe" para passar novos campos
- [ ] **3.1** Atualizar query do "Inserir Instancias" em `sw_xp_quest`
- [ ] **4.1** Atualizar query do "Buscar Quest Detail" em `webhook_quest_detail`
- [ ] **4.2** Atualizar node "Montar Resposta" em `webhook_quest_detail`

### Frontend (já previsto no plano anterior)

- [ ] **5.1** Remover recursos do `InsightDetailPageV13.tsx`
- [ ] **5.2** Atualizar tipos TypeScript (`QuestDetail`)

### Testes

- [ ] **6.1** Testar criação de quest com novos campos via `sw_criar_quest`
- [ ] **6.2** Testar persistência em `usuarios_quest.instrucoes`
- [ ] **6.3** Testar webhook `quest-detail` retorna dados corretos
- [ ] **6.4** Testar página de detalhes de quest exibe instruções corretamente

---

## Ordem de Execução Recomendada

1. **FASE 1**: Criar campo `instrucoes` (migration SQL)
2. **FASE 2**: Ajustar `sw_criar_quest` (geração completa)
3. **FASE 3**: Ajustar `sw_xp_quest` (persistência)
4. **FASE 4**: Ajustar `webhook_quest_detail` (busca correta)
5. **FASE 5**: Frontend (remoção de recursos do insight)

---

## Notas Importantes

1. **Compatibilidade retroativa**: Questas antigas sem campo `instrucoes` devem ser tratadas graciosamente (retornar `null` ou `[]`)

2. **Validação**: Validar se `recursos_sugeridos` é array válido antes de inserir

3. **Fallback**: Se novos campos não forem fornecidos pelo agente, usar valores padrão (`null` ou `[]`)

4. **Teste incremental**: Testar cada fase antes de avançar para a próxima

---

## Próximos Passos

1. ✅ Confirmar entendimento do plano
2. ⏳ Executar FASE 1 (migration SQL)
3. ⏳ Implementar FASE 2 (ajustes em `sw_criar_quest`)
4. ⏳ Implementar FASE 3 (ajustes em `sw_xp_quest`)
5. ⏳ Implementar FASE 4 (ajustes em `webhook_quest_detail`)
6. ⏳ Testar end-to-end
