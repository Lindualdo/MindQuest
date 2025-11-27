# Relatório de Inconsistências - Quest Detail Page

**Data:** 2025-11-27 13:09  
**Versão:** 1.3.8  
**Foco:** Tela de Detalhes da Quest

---

## Inconsistências Identificadas

### 1. **Erro Crítico: `detail.catalogo` undefined**

**Erro no Console:**
```
[PainelQuests] Erro ao abrir detalhe: TypeError: Cannot read properties of undefined (reading 'codigo')
```

**Localização:** `src/pages/App/v1.3/QuestDetailPageV13.tsx:201`

**Problema:**
- Ao acessar `detail.catalogo?.codigo`, o objeto `catalogo` está `undefined`
- A verificação `isQuestCustom` falha porque não consegue ler `codigo`
- A lógica de ocultação de informações genéricas não funciona corretamente

**Impacto:**
- **Quests Custom:** Informações genéricas (Benefícios, Fundamentos Científicos, Como Aplicar, Informações Adicionais) não são ocultadas mesmo quando deveriam
- **Quests do Catálogo:** Informações ricas não são exibidas mesmo quando disponíveis no backend

**Causa Raiz:**
- O workflow `webhook_quest_detail` retorna `catalogo: null` quando `catalogo_codigo` é `null/undefined` (linha 63 do backup)
- O erro "Cannot read properties of undefined" sugere que `detail.catalogo` está `undefined`, não `null`
- Isso indica que o campo `catalogo` pode não estar sendo incluído na resposta ou não está sendo processado corretamente pelo `apiService.ts`

**Análise do Workflow:**
- O workflow faz LEFT JOIN com `quests_catalogo`, então `catalogo_codigo` pode ser `null` para quests sem catálogo
- O código JavaScript retorna `catalogo: null` quando não há `catalogo_codigo`
- Mas o erro sugere que `catalogo` está `undefined`, não `null`

**Ação Necessária:**
1. **Verificar o workflow ativo no n8n** (ID não encontrado na lista, pode estar com nome diferente)
2. **Garantir que o objeto `catalogo` seja sempre retornado** (mesmo que `null` para quests custom)
3. **Adicionar validação defensiva no frontend** para lidar com `catalogo` ausente:
   ```typescript
   const isQuestCustom = detail.catalogo?.codigo === 'quest_custom' || !detail.catalogo;
   ```
4. **Verificar o processamento da resposta em `apiService.ts`** (linha 1417-1450) para garantir que `catalogo` seja preservado

---

## Observações Adicionais

### Funcionalidades que Funcionam Corretamente:
- ✅ Navegação entre telas (Home → Quests → Detalhes)
- ✅ Exibição de quests nas abas (A Fazer, Fazendo, Feito)
- ✅ Filtragem por dia nas barras diárias
- ✅ Botão "Concluir Quest" aparece quando apropriado
- ✅ Botão "Voltar" funciona corretamente

### Funcionalidades Afetadas pela Inconsistência:
- ❌ Ocultação condicional de informações genéricas para quests custom
- ❌ Exibição de informações científicas para quests do catálogo
- ❌ Verificação de tipo de quest (`quest_custom` vs outras)

---

## Recomendações

1. **Prioridade Alta:** Corrigir o retorno do `catalogo` no `webhook_quest_detail`
2. **Prioridade Média:** Adicionar validação defensiva no frontend para lidar com `catalogo` ausente
3. **Prioridade Baixa:** Adicionar logs de debug para rastrear quando `catalogo` está ausente

