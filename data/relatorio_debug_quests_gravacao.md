# Relatório de Debug — Quests não estão sendo gravadas

**Data:** 2025-11-24 12:45  
**Objetivo:** Identificar por que quests e conquistas não estão sendo gravadas no banco

---

## 1. Problemas Identificados

### 1.1. Quest não está sendo inserida no banco

**Evidência:**
- Execução `82631` (`sw_criar_quest`): Agente gerou 1 quest válida
- Execução `82632` (`sw_xp_quest`): Nó "Inserir Instancias" retornou `novas_inseridas: "0"`

**Causa raiz:**
- Query SQL do nó "Inserir Instancias" em `sw_xp_quest` **não inclui `catalogo_id`** no INSERT
- Query atual busca `quest_custom` mas não usa o resultado
- Campo `catalogo_id` é obrigatório na tabela `usuarios_quest` (FK para `quests_catalogo`)

**Query atual (linha 151 do workflow):**
```sql
buscar_quest_custom AS (
  SELECT id FROM public.quests_catalogo WHERE codigo = 'quest_custom' LIMIT 1
),
...
INSERT INTO public.usuarios_quest (
  id, usuario_id, catalogo_id, status, quest_estagio, ...
)
SELECT
  gen_random_uuid(), rq.usuario_id, rq.catalogo_id, ...
FROM recorrencias_quest rq
WHERE rq.catalogo_id IS NOT NULL
```

**Problema:**
- `rq.catalogo_id` vem de `COALESCE(NULLIF((rec->>'catalogo_id')::uuid, NULL), (SELECT id FROM buscar_quest_custom))`
- Mas o agente **não envia `catalogo_id`** nas novas quests
- A query busca `quest_custom` mas não está sendo usada corretamente

### 1.2. Validação de `sabotador_id` está removendo valor válido

**Evidência:**
- Execução `82631`: Agente enviou `sabotador_id: "esquivo"`
- Nó "Aplicar Limites & Dedupe" removeu o valor (virou `null`)

**Causa:**
- Código valida `sabotador_id` como UUID, mas catálogo usa strings ("esquivo", "controlador", etc.)
- Validação incorreta: `uuidRegex.test(trimmed)` falha para strings

**Código problemático:**
```javascript
let sabotadorId = null;
if (typeof quest.sabotador_id === 'string') {
  const trimmed = quest.sabotador_id.trim();
  if (trimmed && uuidRegex.test(trimmed)) {  // ❌ FALHA: "esquivo" não é UUID
    sabotadorId = trimmed;
  }
}
```

### 1.3. Campo `usuarios_quest_id` não está sendo preenchido em `conquistas_historico`

**Evidência:**
- Query "Aplicar Atualizacoes" usa `meta_codigo = upd.id::text` mas não preenche `usuarios_quest_id`
- Campo `usuarios_quest_id` é FK obrigatória para relacionamento unificado

**Query atual:**
```sql
historico_inserido AS (
  INSERT INTO public.conquistas_historico (
    usuario_id, tipo, meta_codigo, meta_titulo, ...
  )
  ...
  WHERE ... AND ch.meta_codigo = upd.id::text
)
```

**Problema:**
- Não inclui `usuarios_quest_id` no INSERT/UPDATE
- Relacionamento unificado não está sendo estabelecido

---

## 2. Fluxo de Dados (O que deveria acontecer)

1. `sw_criar_quest` → Agente gera quests → Valida e filtra → Chama `sw_xp_quest`
2. `sw_xp_quest` → Recebe quests → Busca `catalogo_id` (quest_custom) → Insere em `usuarios_quest` → Cria `conquistas_historico` quando concluída

**Onde está quebrando:**
- Passo 2: INSERT falha silenciosamente porque `catalogo_id` não está sendo resolvido corretamente

---

## 3. Análise Técnica

### 3.1. Estrutura esperada vs atual

**Esperado:**
- `usuarios_quest.catalogo_id` → FK para `quests_catalogo.id`
- `conquistas_historico.usuarios_quest_id` → FK para `usuarios_quest.id`
- `conquistas_historico.meta_codigo` → mantido para compatibilidade

**Atual:**
- `catalogo_id` não está sendo preenchido corretamente
- `usuarios_quest_id` não está sendo preenchido em `conquistas_historico`

### 3.2. Validações que estão bloqueando

1. **UUID validation para `sabotador_id`:** Remove valores válidos do catálogo
2. **`catalogo_id IS NOT NULL`:** Bloqueia INSERT se não encontrar `quest_custom`

---

## 4. Próximos Passos (Aguardando Decisão)

### Opção A: Corrigir apenas o essencial
1. Ajustar query "Inserir Instancias" para garantir `catalogo_id` sempre preenchido
2. Remover validação UUID de `sabotador_id` (aceitar strings do catálogo)
3. Adicionar `usuarios_quest_id` em `conquistas_historico`

### Opção B: Refatoração completa
1. Revisar toda a estrutura de dados conforme `quests_1.3.5.md`
2. Ajustar todos os workflows relacionados
3. Validar relacionamentos unificados

---

## 5. Dados de Teste

**Execução analisada:**
- `sw_criar_quest`: 82631
- `sw_xp_quest`: 82632, 82641

**Quest gerada (exemplo):**
```json
{
  "titulo": "Pequenos compromissos diários para equilíbrio",
  "insight_id": "073e5f23-b649-45b3-9c16-6e4f92167c92",
  "sabotador_id": "esquivo",  // ❌ Removido pela validação
  "area_vida_id": "77777777-7777-4777-8777-777777777777"
}
```

**Resultado:**
- `novas_inseridas: "0"` → Nenhuma quest foi gravada

---

*Relatório gerado para discussão antes de implementar correções*


