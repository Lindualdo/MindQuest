# Fix: Quest de Sabotador Classificada como Personalizada

**Data:** 2025-12-03 07:15  
**Execução analisada:** #143101  
**Workflow:** `sw_criar_quest` (LKjU8NE9aNHw7kEh)

---

## Problema Reportado

1. Agente gerou 3 quests corretamente, mas classificou erroneamente:
   - 2 como "personalizada" (errado - 1 deveria ser sabotador)
   - 1 como "tcc" (correto)
   - 0 como "sabotador" (errado - deveria ter 1)

2. Quest de sabotador foi **removida** no node `Aplicar Limites & Dedupe`

---

## Causa Raiz

### 1. Prompt do Agente não especifica `tipo` corretamente

O agente gerou:
```json
{
  "tipo": "personalizada",  // ❌ ERRADO - deveria ser "sabotador"
  "catalogo_id": null,
  "sabotador_id": "hiper_realizador",  // ✅ Correto
  "contexto_origem": "sabotador_contextualizado",  // ✅ Correto
  "base_cientifica": { "tipo": "sabotador" }  // ✅ Correto
}
```

**O prompt nunca instrui explicitamente que o campo `tipo` deve ser "sabotador".**

### 2. Lógica de classificação no `Aplicar Limites & Dedupe`

```javascript
// Linha problemática (ordem errada)
if (catalogoId === QUEST_CUSTOM_CATALOGO_ID || tipoQuest === 'personalizada') {
  tipoCategoria = 'personalizada';  // ← Entra aqui porque tipo="personalizada"
} else if (catalogoId) {
  if (isSabotadorQuest) {
    tipoCategoria = 'sabotador';  // ← Nunca chega aqui
  }
}
```

**Resultado:** Quest com `sabotador_id` é classificada como "personalizada" porque:
1. `tipoQuest === 'personalizada'` é true
2. Verificação de `sabotador_id` só acontece DEPOIS

### 3. Duplicata de personalizada

Como já existe 1 quest personalizada, a segunda (que era de sabotador) é ignorada:
```javascript
if (tipoCategoria === 'personalizada' && !questsPorTipo.personalizada) {
  questsPorTipo.personalizada = questProcessada;  // Primeira entra
}
// Segunda personalizada é ignorada
```

---

## Solução

### Alteração 1: Prompt do Agente Quests

No node `Agente Quests`, atualizar o systemMessage e text para especificar:

**No exemplo de quest de sabotador:**
```json
{
  "tipo": "sabotador",  // ← CRÍTICO: tipo = "sabotador"
  "catalogo_id": null,
  "sabotador_id": "hiper_realizador",
  "contexto_origem": "sabotador_contextualizado"
}
```

**Adicionar regra explícita:**
```
🚨 REGRA CRÍTICA - CAMPO TIPO:
- Quest personalizada: tipo = "personalizada"
- Quest de sabotador: tipo = "sabotador" (NÃO usar "personalizada")
- Quest TCC/catálogo: tipo = "tcc" ou "catalogo"
```

### Alteração 2: Node `Aplicar Limites & Dedupe`

Corrigir ordem de verificação para priorizar `sabotador_id`:

```javascript
// ANTES (errado)
if (catalogoId === QUEST_CUSTOM_CATALOGO_ID || tipoQuest === 'personalizada') {
  tipoCategoria = 'personalizada';
}

// DEPOIS (correto)
// 1. PRIMEIRO verificar se tem sabotador_id (prioridade absoluta)
if (isSabotadorQuest || sabotadorId) {
  tipoCategoria = 'sabotador';
} else if (catalogoId === QUEST_CUSTOM_CATALOGO_ID || tipoQuest === 'personalizada') {
  tipoCategoria = 'personalizada';
}
```

### Alteração 3: Garantir catalogo_id correto

Para quests personalizadas, garantir que usem o ID do catálogo:
- `00000000-0000-0000-0000-000000000001` = quest_custom

---

## Código Corrigido

### Node: `Aplicar Limites & Dedupe` (linhas ~150-165)

```javascript
// === DETERMINAR TIPO/CATEGORIA ===
let tipoCategoria = 'personalizada';

// 1. PRIMEIRO: verificar se é quest de sabotador (tem sabotador_id)
if (isSabotadorQuest || sabotadorId) {
  tipoCategoria = 'sabotador';
// 2. DEPOIS: verificar personalizada
} else if (catalogoId === QUEST_CUSTOM_CATALOGO_ID || tipoQuest === 'personalizada') {
  tipoCategoria = 'personalizada';
// 3. Verificar reflexão (ignorar)
} else if (contexto.includes('reflexao') || contexto.includes('reflex')) {
  continue;
// 4. Demais (TCC, estoicismo, etc)
} else if (catalogoId) {
  tipoCategoria = 'tcc_estoicismo';
}
```

### Node: `Agente Quests` - System Message

Adicionar no final do systemMessage:

```
🚨🚨🚨 REGRA CRÍTICA - CAMPO "tipo" 🚨🚨🚨

O campo "tipo" DEVE corresponder ao tipo real da quest:
- "personalizada" → quests criadas do zero baseadas na conversa
- "sabotador" → quests de sabotador (OBRIGATÓRIO se sabotador_id existir)
- "tcc" → quests do catálogo TCC/Estoicismo/outras

NUNCA usar tipo="personalizada" para quest de sabotador!
Se tem sabotador_id → tipo DEVE SER "sabotador"
```

### Node: `Agente Quests` - Exemplo no text

Atualizar o exemplo de quest de sabotador no prompt:

```json
{
  "tipo": "sabotador",
  "catalogo_id": null,
  "titulo": "Desafie o Sr. Perfeccionista com pequenas entregas",
  "descricao": "Baseado no insight: [insight_atual do sabotador]...",
  "sabotador_id": "critico",
  "contexto_origem": "sabotador_contextualizado",
  ...
}
```

---

## Impacto

- Quest de sabotador será classificada corretamente
- Saída final terá 3 quests: 1 personalizada + 1 sabotador + 1 TCC
- Se `criar_quest_adicional = true`: 4 quests (1 + 2 + 1)

---

## Checklist de Implementação

- [x] Atualizar systemMessage do `Agente Quests` com regra de tipo
- [x] Atualizar exemplo no text do `Agente Quests`
- [x] Corrigir lógica de tipoCategoria no `Aplicar Limites & Dedupe`
- [ ] Testar execução completa
- [ ] Validar saída final tem quest de sabotador com tipo correto

---

## Implementação Realizada (v1.3.19)

**Data:** 2025-12-03 07:19

### Alterações no Node `Agente Quests`

1. **systemMessage**: Adicionada regra crítica sobre campo `tipo`:
   - `tipo="sabotador"` → obrigatório quando `sabotador_id` existir
   - `tipo="personalizada"` → apenas para quests sem sabotador
   
2. **text**: Atualizado exemplo de quest de sabotador com `tipo: "sabotador"`

### Alterações no Node `Aplicar Limites & Dedupe`

1. **Prioridade de detecção**: `sabotador_id` agora é verificado ANTES do campo `tipo`
2. **Nova lógica `isSabotadorQuest`**:
   ```javascript
   const isSabotadorQuest = sabotadorId !== null || 
                           tipoQuest === 'sabotador' ||
                           contexto.includes('sabotador');
   ```
3. **Forçar tipo correto**: Se `isSabotadorQuest`, `tipoFinal = 'sabotador'`
4. **catalogo_id**: Quests de sabotador usam `null` (não catálogo)

