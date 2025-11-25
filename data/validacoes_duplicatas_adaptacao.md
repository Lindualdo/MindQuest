# Validações de Duplicatas e Adaptação de Quests

**Data:** 2025-01-22  
**Status:** ✅ Implementado

---

## 1. Validação de Duplicatas - Priorizar Quests Novas

### 1.1. Busca de Quests Já Criadas
A query **"Buscar Quests Ativas"** foi atualizada para incluir:
- Quests ativas/pendentes (como antes)
- **Quests concluídas nos últimos 30 dias** (para evitar duplicatas recentes)

```sql
WHERE uq.usuario_id = $1::uuid
  AND (
    uq.status IN ('pendente','ativa')
    OR (uq.status = 'concluida' AND uq.concluido_em >= NOW() - INTERVAL '30 days')
  )
```

### 1.2. Lista de Quests Já Criadas
O node **"Montar Contexto"** agora inclui:
- `quests_ja_criadas`: Array com todas as quests já criadas (incluindo concluídas recentemente)
  - `id`, `titulo`, `catalogo_id`, `contexto_origem`, `status`, `concluido_em`

### 1.3. Priorização de Quests Novas
O catálogo é separado em:
- `quests_catalogo.novas`: Quests do catálogo que **nunca foram usadas** pelo usuário
- `quests_catalogo.usadas`: Quests do catálogo que **já foram usadas** anteriormente

**Lógica:** Priorizar sempre as quests novas quando possível.

### 1.4. Validação no Agente
O prompt do agente inclui:
```
**🚨 QUESTS JÁ CRIADAS (EVITAR DUPLICATAS):**
{{ JSON.stringify($json.quests_ja_criadas || []) }}

**IMPORTANTE:** Verifique esta lista antes de criar. NÃO crie quests com:
- Mesmo `catalogo_id` já usado recentemente
- Título muito similar a uma quest já criada
- Contexto muito similar

**PRIORIZE:** Quests novas do catálogo (não usadas antes) quando possível.
```

### 1.5. Validação em "Aplicar Limites & Dedupe"
A validação verifica:
- ✅ **`catalogo_id` já usado:** Rejeita quests do catálogo que já foram usadas recentemente
- ✅ **Título similar:** Verifica similaridade de títulos (80% de similaridade = duplicata)
- ✅ **Contexto similar:** Verifica se o contexto já foi usado

**Regras:**
- Se `catalogo_id` já foi usado → **PULA** (prioriza novas)
- Se título é muito similar → **PULA** (evita duplicatas)
- Se contexto já foi usado → **PULA** (evita repetição)

---

## 2. Adaptação de Quests do Catálogo - Títulos Engajadores

### 2.1. Regra Obrigatória
**MESMO usando `catalogo_id`, SEMPRE adaptar `titulo` e `descricao` para o contexto específico do usuário.**

### 2.2. Instruções no Prompt do Agente

```
3. **🎯 ADAPTAÇÃO DE QUESTS DO CATÁLOGO (OBRIGATÓRIO):**
   - **MESMO usando `catalogo_id`, SEMPRE adaptar `titulo` e `descricao` para o contexto específico do usuário**
   - Criar títulos **engajadores e personalizados** baseados na realidade do usuário
   - Referenciar elementos da conversa atual quando relevante
   - Usar linguagem que ressoe com a situação específica do usuário
   - Exemplo: Se a quest do catálogo é "Reflexão Diária", adaptar para "Reflexão sobre [tema da conversa]" ou "Momento de pausa para [contexto específico]"
```

### 2.3. Exemplos de Adaptação

**Quest do Catálogo (genérica):**
- Título: "Reflexão Diária"
- Descrição: "Conversa com assistente para reflexão"

**Quest Adaptada (personalizada):**
- Título: "Reflexão sobre ansiedade no trabalho"
- Descrição: "Momento de pausa para refletir sobre como você está lidando com a pressão no trabalho, baseado na nossa conversa de hoje"

**Quest do Catálogo (genérica):**
- Título: "Técnica de Respiração 4-7-8"
- Descrição: "Prática de respiração para relaxamento"

**Quest Adaptada (personalizada):**
- Título: "Respiração para acalmar antes das reuniões"
- Descrição: "Use a técnica 4-7-8 antes das suas reuniões importantes, especialmente quando sentir aquela ansiedade que você mencionou"

### 2.4. Validação no Schema
O schema do parser JSON inclui exemplos com títulos adaptados:
```json
{
  "tipo": "catalogo",
  "catalogo_id": "uuid-quest-catalogo",
  "titulo": "... título ADAPTADO e engajador baseado no contexto do usuário ...",
  "descricao": "... descrição ADAPTADA que referencia elementos da conversa/realidade do usuário ...",
  ...
}
```

---

## 3. Fluxo Completo de Validação

1. **Buscar Quests Já Criadas**
   - Ativas/pendentes
   - Concluídas nos últimos 30 dias

2. **Montar Contexto**
   - Lista de quests já criadas
   - Separar catálogo em novas/usadas
   - Priorizar quests novas

3. **Agente Gera Quests**
   - Verifica lista de quests já criadas
   - Prioriza quests novas do catálogo
   - **Sempre adapta título/descrição** mesmo para quests do catálogo
   - Cria títulos engajadores baseados no contexto

4. **Validação "Aplicar Limites & Dedupe"**
   - Rejeita `catalogo_id` já usado
   - Rejeita títulos muito similares
   - Rejeita contextos já usados
   - Garante 4 quests válidas

---

## 4. Benefícios

✅ **Evita Duplicatas:** Usuário não recebe a mesma quest repetidamente  
✅ **Prioriza Novas:** Sempre tenta oferecer quests novas do catálogo  
✅ **Títulos Engajadores:** Quests adaptadas ressoam melhor com o usuário  
✅ **Contexto Personalizado:** Referências à conversa atual aumentam engajamento  
✅ **Melhor Experiência:** Usuário sente que as quests são feitas para ele

---

**Validações implementadas e funcionando! ✅**

