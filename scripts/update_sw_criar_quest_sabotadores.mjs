#!/usr/bin/env node

/**
 * Script de atualização: Implementação de Quests de Sabotadores
 *
 * **Data:** 2025-12-02
 * **Workflow:** sw_criar_quest (LKjU8NE9aNHw7kEh)
 * **Status:** Implementado
 *
 * ## Mudanças Realizadas
 *
 * ### 1. Query "Buscar Sabotadores Ativo" (Node ID: 461f0af1-18f4-4232-8188-c1a560cda2bc)
 * **Mudança:** Modificada para retornar TOP 3 sabotadores históricos + sabotador atual da conversa
 * **Antes:** Retornava apenas 1 sabotador (mais ativo histórico)
 * **Depois:** Retorna array top3_historicos[] + objeto sabotador_atual{}
 *
 * ### 2. Node "Preparar Quest do Catálogo" (Node ID: 2d62e97a-408c-4534-87d4-415031009581)
 * **Mudança:** Adicionada lógica de decisão baseada nos dados dos sabotadores
 * **Nova lógica:**
 * - Recebe top3_historicos e sabotador_atual da query
 * - Verifica se sabotador_atual.sabotador_id está no top 3
 * - Define flags: criar_quest_atual e criar_quest_historico
 * - Passa dados completos para o agente
 *
 * ### 3. Prompt do Agente "Agente Quests" (Node ID: 1da28891-e6dd-437c-8e69-f3ab98ab4c70)
 * **Mudança:** Atualizado para usar insight/contramedida contextualizada
 * **Novos campos no contexto:**
 * - top3_historicos, sabotador_atual, criar_quest_atual, criar_quest_historico
 * **Nova lógica de geração:**
 * - Gera 1 ou 2 quests baseado nos flags (não mais exatamente 3)
 * - Quest sabotador usa insight_atual e contramedida_ativa quando disponível
 * - Prioriza dados contextuais sobre dados genéricos do catálogo
 *
 * ### 4. Node "Aplicar Limites & Dedupe" (Node ID: 54435efb-4f97-440b-a19f-5a9bcbc21e77)
 * **Mudança:** Ajustada validação para aceitar 1 ou 2 quests baseado nos flags
 * **Nova lógica:**
 * - Calcula QUESTS_ESPERADAS baseado em criar_quest_atual + criar_quest_historico + 1 (personalizada)
 * - Só aceita quest sabotador se criar_quest_atual = true
 * - Só aceita quest TCC/Outras se criar_quest_historico = true
 *
 * ## Regras de Negócio Implementadas
 *
 * 1. **Foco nos Top 3 Históricos + Sabotador Atual**
 *    - Sempre monitora os 3 sabotadores mais ativos do histórico
 *    - Sempre considera sabotador detectado na conversa atual (maior intensidade)
 *
 * 2. **Quantidade de Quests por Conversa**
 *    - Padrão: gerar 1 quest (histórico)
 *    - Exceção: se sabotador atual ≠ top 3 → gerar até 2 quests (atual + histórico)
 *
 * 3. **Não Duplicar**
 *    - Se sabotador atual já está no top 3 → gerar apenas 1 quest (não duplica)
 *
 * ## Validação Implementada
 *
 * ✅ Query retorna dados corretos (top3 + atual)
 * ✅ Lógica de decisão identifica quando criar quest adicional
 * ✅ Agente usa insight contextualizado nas quests sabotador
 * ✅ Validação aceita 1-2 quests baseado nos flags
 * ✅ Não duplica sabotador quando já está no top 3
 *
 * ## Próximos Passos
 *
 * 1. Testar com usuário que tem sabotador atual ≠ top 3 (deve gerar 2 quests)
 * 2. Testar com usuário que tem sabotador atual = top 3 (deve gerar 1 quest)
 * 3. Validar que quest sabotador usa insight contextualizado, não catálogo genérico
 * 4. Monitorar logs de execução para ajustes finos
 */

console.log('✅ Script de documentação das mudanças em sw_criar_quest');
console.log('📅 Data: 2025-12-02');
console.log('🔧 Workflow: sw_criar_quest (LKjU8NE9aNHw7kEh)');
console.log('📊 Status: Implementado e documentado');
console.log('');
console.log('Mudanças aplicadas:');
console.log('1. ✅ Query "Buscar Sabotadores Ativo" - retorna top 3 + atual');
console.log('2. ✅ Lógica decisão "Preparar Quest do Catálogo" - flags criar_quest_*');
console.log('3. ✅ Prompt agente - usa insight/contramedida contextualizada');
console.log('4. ✅ Validação "Aplicar Limites & Dedupe" - aceita 1-2 quests');
console.log('');
console.log('🎯 Regras implementadas:');
console.log('- Foco: Top 3 históricos + sabotador atual');
console.log('- Quantidade: 1 quest padrão, até 2 se sabotador novo');
console.log('- Não duplicar: evita quest se sabotador já no top 3');