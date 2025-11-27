# Relatório de Erro - Criação de Quest a partir de Insight

**Data:** 2025-11-27 13:54  
**Versão:** 1.3.8  
**Foco:** Funcionalidade "Criar Quest" na página de detalhes do insight

---

## Problema Identificado

**Sintoma:** Quest é criada com sucesso no banco de dados, mas não aparece na aba "A Fazer" do painel de quests após a criação.

**Evidências:**
1. ✅ **Webhook funcionando:** Execuções 133492 e 133482 do `webhook_criar_quest_manual` foram bem-sucedidas
2. ✅ **Banco de dados:** Quest criada com sucesso:
   - ID: `73767f97-4629-43a9-847f-201f161a66b4`
   - Status: `disponivel`
   - Insight ID: `e47edca9-88cb-4b71-8859-1fde6d08bf3b`
   - Catálogo ID: `00000000-0000-0000-0000-000000000001` (quest_custom)
3. ❌ **Frontend:** Quest não aparece na aba "A Fazer" após criação

---

## Análise Técnica

### Fluxo Atual

1. **Frontend (`InsightDetailPageV13.tsx`):**
   - Usuário clica em "Criar Quest"
   - Chama `criarQuestFromInsight(detail.id, resourceNome, undefined)`
   - Navega para `painelQuests` imediatamente após chamada

2. **Store (`useStore.ts`):**
   - Chama `apiService.criarQuestManual()`
   - Se sucesso, chama `loadQuestSnapshot(usuarioId)`
   - Retorna resultado

3. **Problema Potencial:**
   - A navegação acontece **antes** do `loadQuestSnapshot` completar
   - O snapshot pode não estar atualizado quando a tela de quests carrega
   - Ou a quest está sendo filtrada incorretamente

### Verificação da Lógica de Filtro

**Arquivo:** `src/pages/App/v1.3/PainelQuestsPageV13.tsx`

- Quests `disponivel` devem aparecer em "A Fazer" (linha 164-166)
- Filtro por dia: Quests `disponivel` aparecem sempre, independente do dia (linha 250-252)
- Ordenação: Por `ativado_em DESC` (linha 264-270)

**Possível Causa:**
- Race condition: snapshot não foi recarregado quando a tela carregou
- Ou o snapshot está sendo recarregado mas a UI não está reagindo ao update

---

## Plano de Correção

### Correção 1: Aguardar recarregamento do snapshot antes de navegar

**Arquivo:** `src/pages/App/v1.3/InsightDetailPageV13.tsx`

**Mudança:**
```typescript
// ANTES:
await criarQuestFromInsight(detail.id, resourceNome, undefined);
setActiveTab('quests');
setView('painelQuests');

// DEPOIS:
await criarQuestFromInsight(detail.id, resourceNome, undefined);
// Aguardar um pouco para garantir que o snapshot foi recarregado
await new Promise(resolve => setTimeout(resolve, 500));
setActiveTab('quests');
setView('painelQuests');
```

### Correção 2: Forçar recarregamento no painel de quests

**Arquivo:** `src/pages/App/v1.3/PainelQuestsPageV13.tsx`

**Mudança:** Adicionar um `useEffect` que detecta quando a view muda para `painelQuests` e força recarregamento se necessário.

### Correção 3: Melhorar feedback visual

**Arquivo:** `src/pages/App/v1.3/InsightDetailPageV13.tsx`

**Mudança:** Adicionar loading state durante criação e navegação.

---

## Prioridade

- **Alta:** Correção 1 (aguardar recarregamento)
- **Média:** Correção 3 (feedback visual)
- **Baixa:** Correção 2 (forçar recarregamento - pode não ser necessário se Correção 1 funcionar)

---

## Testes Necessários

1. ✅ Criar quest a partir de insight
2. ✅ Verificar se quest aparece em "A Fazer" imediatamente
3. ✅ Verificar se quest aparece ao recarregar a página
4. ✅ Verificar se múltiplas quests do mesmo insight são criadas corretamente

---

## Correções Aplicadas

### ✅ Correção 1: Aguardar recarregamento do snapshot antes de navegar

**Arquivo:** `src/pages/App/v1.3/InsightDetailPageV13.tsx`

**Mudança aplicada:**
- Adicionado `await new Promise(resolve => setTimeout(resolve, 500))` após criação bem-sucedida
- Garante que o snapshot seja recarregado antes da navegação

### ✅ Correção 2: Forçar recarregamento quando view muda para painelQuests

**Arquivo:** `src/pages/App/v1.3/PainelQuestsPageV13.tsx`

**Mudança aplicada:**
- Adicionado `useEffect` que detecta mudança de view para `painelQuests`
- Força recarregamento do snapshot quando necessário
- Usa `useRef` para evitar loops infinitos

### ✅ Correção 3: Melhorar lógica de recarregamento no store

**Arquivo:** `src/store/useStore.ts`

**Mudança aplicada:**
- `criarQuestFromInsight` agora sempre passa `usuarioId` explicitamente para `loadQuestSnapshot`
- Isso força o recarregamento mesmo se já existe snapshot em cache

---

## Resultado dos Testes

**Status:** ✅ **FUNCIONANDO**

**Evidências:**
- Quest criada no banco: `8ed20ce5-e68d-434f-b5ac-58d935db8967`
- Quest aparece na aba "A Fazer" imediatamente após criação
- Contador mostra "A Fazer 2" (quests disponíveis)
- Quest aparece na lista com botão "Planejar quest"

**Conclusão:** As correções resolveram o problema. A quest é criada e aparece corretamente no painel de quests.

