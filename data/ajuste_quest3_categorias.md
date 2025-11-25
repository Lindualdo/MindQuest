# Ajuste - Quest 3: TCC/Estoicismo e Outras Categorias

**Data:** 2025-01-22  
**Status:** ✅ Implementado

---

## Regra Implementada

A **Quest 3** pode ser de qualquer categoria disponível no catálogo, desde que seja **diferente de sabotador**.

**Categorias incluídas:**
- ✅ TCC
- ✅ Estoicismo
- ✅ Essencial
- ✅ Neurociência
- ✅ Boa Prática Geral
- ✅ Outras categorias disponíveis no catálogo

**Categorias excluídas:**
- ❌ Sabotador (já usada na Quest 2)
- ❌ Reflexão (criada automaticamente pelo sistema)
- ❌ Personalizada (só para Quest 1)

---

## Query "Buscar Quests Catálogo"

Atualizada para incluir:
```sql
WHERE qc.ativo IS TRUE
  AND (
    -- Excluir reflexão e categoria personalizada
    qc.codigo != 'reflexao_diaria'
    AND qc.categoria != 'personalizada'
    AND (
      -- Incluir quests de sabotador OU
      qc.sabotador_id IS NOT NULL
      OR
      -- Incluir todas as outras categorias
      (qc.categoria IS NOT NULL AND qc.sabotador_id IS NULL)
    )
  )
```

---

## Node "Preparar Quest do Catálogo"

Escolhe para Quest 3:
- Todas as categorias disponíveis
- Exceto sabotador (usado na Quest 2)
- Exceto reflexão (criada automaticamente)
- Filtra por estágio do usuário
- Prioriza quests novas

**Lógica:**
```javascript
const questsTCCEstoicismoOutras = todasQuests.filter(q => {
  // Excluir sabotador e reflexão
  if (q.sabotador_id) return false;
  if (q.codigo === 'reflexao_diaria') return false;
  // Incluir todas as outras categorias
  return q.categoria && q.categoria !== 'personalizada';
});
```

---

## Prompt do Agente

Atualizado para indicar que Quest 3 pode ser de qualquer categoria diferente:
- Quest 3: TCC/Estoicismo/Outras - baseada no catálogo (já escolhida)
- Pode ser TCC, Estoicismo ou outras categorias (diferentes de sabotador)

---

**Ajuste implementado! Quest 3 pode ser de qualquer categoria disponível. ✅**

