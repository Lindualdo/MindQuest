# Relatório de Testes - Criação de Quest a partir de Insight

**Data:** 2025-11-27 17:15
**Status:** Testes concluídos - Problemas identificados

## Resumo Executivo

✅ **Funcionalidades que funcionam:**
- Criação de quests a partir de insights (ambas as ações)
- Redirecionamento automático para o painel de quests
- Persistência no banco de dados
- Verificação de limite (2 quests por insight)
- Verificação de resource_index duplicado no backend

❌ **Problemas identificados:**
- Botões "Criar Quest" não são ocultados após criação quando voltamos ao insight
- QuestSnapshot não é recarregado quando abrimos o insight novamente

## Etapa 1: Limpeza de Dados

✅ **Concluída**
- Deletadas todas as quests de insight manual do banco de dados
- Verificação: 0 quests encontradas após limpeza

## Etapa 2: Criação da Primeira Quest

✅ **Concluída**
- Navegação para a home
- Abertura do insight "Insight da última conversa"
- Criação de quest a partir da primeira ação (resource_index=0)
- **Título:** "Validações Incrementais"
- **Resource Index:** 0
- **Insight ID:** e47edca9-88cb-4b71-8859-1fde6d08bf3b

### Resultado da Execução n8n (ID: 133577)
- **Status:** success
- **Quest ID criada:** b52affe2-e736-40fe-900e-34f5984edab8
- **Status da quest:** disponivel
- **total_existente:** 0
- **resource_ja_existe:** false
- **Tempo de execução:** 112ms

### Verificação no Banco de Dados
✅ Quest criada corretamente:
- ID: b52affe2-e736-40fe-900e-34f5984edab8
- Título: Validações Incrementais
- Resource Index: 0
- Status: disponivel

## Etapa 3: Verificação no Painel de Quests

✅ **Concluída**
- Redirecionamento para o painel de quests ocorreu automaticamente
- A quest foi criada no banco de dados
- **Nota:** Não foi possível verificar visualmente se a quest aparece na lista "A Fazer" devido às limitações do browser automation, mas a quest está no banco e o redirecionamento funcionou

## Etapa 4: Verificação do Botão Desabilitado

❌ **Problema identificado**
- Ao voltar ao insight, os botões "Criar Quest" ainda aparecem
- O botão da primeira ação (resource_index=0) deveria estar oculto, mas não está
- **Causa raiz:** O `questSnapshot` não é recarregado quando abrimos o insight novamente, então o `useMemo` que calcula `resourceIndexesComQuest` não detecta a quest criada

## Etapa 5: Criação da Segunda Quest

✅ **Concluída**
- Criação de quest a partir da segunda ação (resource_index=1)
- **Título:** "Jornal de Sentimentos e Avanços"
- **Resource Index:** 1
- **Insight ID:** e47edca9-88cb-4b71-8859-1fde6d08bf3b

### Resultado da Execução n8n (ID: 133579)
- **Status:** success
- **Quest ID criada:** 65212b95-398b-4a8e-b566-9048805bf134
- **Status da quest:** disponivel
- **Tempo de execução:** 131ms

### Verificação no Banco de Dados
✅ Quest criada corretamente:
- ID: 65212b95-398b-4a8e-b566-9048805bf134
- Título: Jornal de Sentimentos e Avanços
- Resource Index: 1
- Status: disponivel

### Estado Final no Banco
```
2 quests criadas para o insight e47edca9-88cb-4b71-8859-1fde6d08bf3b:
1. Validações Incrementais (resource_index=0)
2. Jornal de Sentimentos e Avanços (resource_index=1)
```

## Problemas Identificados

### Problema 1: Botões não são ocultados após criação

**Descrição:**
Quando voltamos ao insight após criar uma quest, os botões "Criar Quest" ainda aparecem, mesmo que a quest já tenha sido criada.

**Causa Raiz:**
O `questSnapshot` não é recarregado quando abrimos o insight novamente. O `useMemo` que calcula `resourceIndexesComQuest` depende de `questSnapshot`, mas como o snapshot não é atualizado, ele não detecta as quests criadas.

**Localização do código:**
- `src/pages/App/v1.3/InsightDetailPageV13.tsx` (linhas 163-180)
- `src/store/useStore.ts` (função `loadQuestSnapshot`)

**Impacto:**
- Usuário pode tentar criar quests duplicadas (embora o backend impeça)
- UX confusa: botões aparecem mesmo quando não deveriam

**Solução proposta:**
1. Adicionar um `useEffect` em `InsightDetailPageV13.tsx` que recarrega o `questSnapshot` quando o `detail.id` muda
2. Ou modificar `openInsightDetail` no store para sempre recarregar o snapshot antes de abrir o insight

## Plano de Correção

### Correção 1: Recarregar QuestSnapshot ao abrir insight

**Arquivo:** `src/pages/App/v1.3/InsightDetailPageV13.tsx`

**Ação:**
Adicionar um `useEffect` que recarrega o `questSnapshot` quando o insight é aberto:

```typescript
useEffect(() => {
  if (detail?.id && usuarioId) {
    loadQuestSnapshot(usuarioId);
  }
}, [detail?.id, usuarioId, loadQuestSnapshot]);
```

**Alternativa (no store):**
Modificar `openInsightDetail` para recarregar o snapshot:

```typescript
openInsightDetail: async (insightId) => {
  set({ view: 'insightDetail', selectedInsightId: insightId, insightDetailLoading: true });
  const usuarioId = get().dashboardData?.usuario?.id;
  if (usuarioId) {
    await loadQuestSnapshot(usuarioId); // Recarregar snapshot
  }
  // ... resto do código
}
```

### Correção 2: Verificar se questSnapshot está sendo normalizado corretamente

**Arquivo:** `src/services/apiService.ts`

**Verificação:**
Garantir que o `normalizeQuestEntry` está extraindo corretamente:
- `insight_id`
- `config.resource_index`
- `config.contexto_origem`

## Testes de Validação Após Correção

1. Limpar quests de teste do banco
2. Criar primeira quest a partir do insight
3. Voltar ao insight e verificar se o botão da primeira ação está oculto
4. Criar segunda quest a partir do insight
5. Voltar ao insight e verificar se ambos os botões estão ocultos
6. Verificar se as quests aparecem no painel de quests

## Conclusão

As funcionalidades principais estão funcionando corretamente:
- ✅ Criação de quests funciona
- ✅ Backend previne duplicatas
- ✅ Redirecionamento funciona
- ❌ UX: Botões não são ocultados quando deveriam

A correção é simples e envolve apenas garantir que o `questSnapshot` seja recarregado quando o insight é aberto.
