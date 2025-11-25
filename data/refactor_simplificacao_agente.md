# Refactor - Simplificação do Agente

**Data:** 2025-01-22  
**Status:** ✅ Implementado

---

## Objetivo

**Tirar peso do agente**: Deixar o prompt mais simples e fazer tratamentos ANTES de enviar o contexto ao agente.

**Princípio:** O agente não decide, apenas gera. A lógica acontece antes dele.

---

## Mudanças Implementadas

### 1. Novo Node: "Preparar Quest do Catálogo"

**Antes do agente**, este node:
- ✅ **Escolhe** quais quests do catálogo serão usadas
- ✅ **Filtra** por estágio do usuário
- ✅ **Prioriza** quests novas (não usadas antes)
- ✅ **Prepara** contexto limpo e direto

**Lógica implementada:**
- Escolhe melhor quest do sabotador (se houver)
- Escolhe quest de reflexão (sempre disponível)
- Escolhe quest TCC/Estoicismo adequada ao estágio
- Separa novas vs usadas
- Filtra por dificuldade baseado no estágio

### 2. Prompt do Agente Simplificado

**ANTES:** Prompt complexo com muitas regras, validações, decisões  
**AGORA:** Prompt simples e direto

**O que o agente recebe:**
- Contexto limpo e preparado
- Lista de quests do catálogo **já escolhidas**
- Conversa atual
- Insights, áreas da vida, sabotador

**O que o agente faz:**
- Apenas gera 3 quests com o contexto recebido
- Não decide, não valida, não escolhe
- Foca em criar conteúdo engajador

**Prompt simplificado:**
```
Você é o agente de geração de quests do MindQuest.

OBJETIVO: Gerar EXATAMENTE 3 quests personalizadas para o usuário.

[Contexto limpo já preparado]

REGAS:
1. Gerar 3 quests (personalizada + 2 do catálogo)
2. Quest personalizada: gerar base_cientifica completo
3. Quests do catálogo: adaptar título/descrição
```

### 3. Estrutura de Resposta

**Formato simplificado:**
```json
{
  "quests": [
    {
      "tipo": "personalizada",
      "catalogo_id": null,
      "base_cientifica": { ... }  // Igual ao formato do catálogo
    },
    {
      "tipo": "catalogo",
      "catalogo_id": "...",
      "titulo": "... adaptado ...",
      "descricao": "... adaptada ..."
    },
    {
      "tipo": "catalogo",
      "catalogo_id": "...",
      "titulo": "... adaptado ..."
    }
  ]
}
```

### 4. Quest Custom - Base Científica

**Formato igual ao catálogo:**
```json
{
  "tipo": "tecnica" | "boa_pratica",
  "objetivo": "...",
  "fundamentos": "...",
  "como_aplicar": "...",
  "links_referencias": []
}
```

Estrutura idêntica à `base_cientifica` de `quests_catalogo`.

### 5. Ajustes de Validação

- **3 quests** ao invés de 4
- Validação mantém verificações de duplicatas
- Interpretação ajustada para ler `quests` ao invés de `novas_quests`

---

## Fluxo Simplificado

```
1. Buscar dados do usuário
   ↓
2. Montar contexto (dados brutos)
   ↓
3. Preparar Quest do Catálogo ← NOVO (lógica de decisão)
   - Escolhe quests
   - Filtra por estágio
   - Prioriza novas
   ↓
4. Agente Quests ← SIMPLIFICADO (só gera)
   - Recebe contexto limpo
   - Gera 3 quests
   ↓
5. Interpretar Resultado
   ↓
6. Aplicar Limites & Dedupe
   ↓
7. Calcular XP
```

---

## Benefícios

✅ **Agente mais eficiente:** Focado apenas em gerar conteúdo  
✅ **Prompt mais simples:** Menos tokens, mais rápido  
✅ **Lógica centralizada:** Decisões em um único lugar (node de preparação)  
✅ **Mais fácil de manter:** Lógica separada da geração  
✅ **Melhor performance:** Menos processamento no agente  

---

**Refactor concluído! Agente simplificado e eficiente. ✅**

