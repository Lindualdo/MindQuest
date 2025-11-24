# Análise de Execução - sw_xp_conversas

**Data:** 2025-01-22 18:30

## Problema Identificado

### Contexto
- Usuário analisado: `0847d8a7-4fba-45f2-9470-a7eeacaa4bd4` (execução 86328)
- Flag: `recalcular_completo = true` (processar todas as conversas)
- Resultado: XP calculado e `usuarios_conquistas` atualizado, mas `conquistas_historico` não foi criado

### Fluxo Atual

1. **"Calcular XP Conversas"**: ✅ Funciona corretamente
   - Calcula `dias_novos: 7`, `xp_base_increment: 70`
   - Retorna dados corretos
   - Tem DUAS saídas:
     - → "Zerar Sequência se Gap" → "Atualizar Usuarios Conquistas" ✅ (funciona)
     - → "Buscar ou Criar Quest Reflexao" → "Preparar XP Diário" ❌ (problema aqui)

2. **"Atualizar Usuarios Conquistas"**: ✅ Funciona corretamente
   - Recebe dados de "Zerar Sequência se Gap" (que vem de "Calcular XP Conversas")
   - Atualiza `xp_total: 70`, `xp_base: 70` corretamente

3. **"Preparar XP Diário"**: ❌ Problema no fluxo de dados
   - Recebe `$json` de "Buscar ou Criar Quest Reflexao" (que só tem `usuarios_quest_id`)
   - Tenta pegar `dias_novos` de `entrada` (que vem de "Buscar ou Criar Quest Reflexao")
   - **PROBLEMA**: Deveria buscar dados de "Calcular XP Conversas" usando `getItem('Calcular XP Conversas')`
   - Como `entrada.dias_novos` é `undefined`, retorna `[]`

### Resultado
- XP calculado corretamente: `xp_total: 70`, `xp_base: 70`
- `usuarios_conquistas` atualizado corretamente
- `conquistas_historico` NÃO criado porque "Preparar XP Diário" retornou `[]`

## Solução Necessária

### Problema Real

O problema NÃO é a flag `recalcular_completo`. O problema é o **fluxo de dados**:

1. **"Preparar XP Diário"** recebe `$json` de "Buscar ou Criar Quest Reflexao"
2. Mas precisa dos dados de "Calcular XP Conversas" (`dias_novos`, `xp_base_increment`, `dias_novos_detalhes`)
3. O código tenta pegar de `entrada` (que vem de "Buscar ou Criar Quest Reflexao"), mas deveria buscar de "Calcular XP Conversas"

### Modificações Necessárias

**"Preparar XP Diário"**:
```javascript
// ANTES (ERRADO):
const entrada = $json || {}; // Vem de "Buscar ou Criar Quest Reflexao"
const diasNovos = entrada.dias_novos || 0; // undefined!

// DEPOIS (CORRETO):
const calcularXP = getItem('Calcular XP Conversas'); // Buscar de "Calcular XP Conversas"
const entrada = calcularXP || {}; // Dados corretos
const diasNovos = entrada.dias_novos || 0; // Agora funciona!
```

### Sobre a Flag `recalcular_completo`

A flag está funcionando corretamente:
- Quando `recalcular_completo = true`, "Calcular XP Conversas" processa todas as conversas dos últimos 45 dias
- O cálculo de `dias_novos` considera apenas dias após `ultima_conversa_em` (comportamento esperado)
- Se o usuário não tem histórico, `ultima_conversa_em` é `null`, então TODAS as conversas são consideradas "novas"

## Flag `recalcular_completo`

### Comportamento Esperado
- `recalcular_completo = false` (ou não informado):
  - Processar apenas conversas novas (após `ultima_conversa_em`)
  
- `recalcular_completo = true`:
  - Se não há histórico: processar TODAS as conversas
  - Se há histórico: processar apenas novas (ou reprocessar tudo, conforme regra de negócio)

### Implementação Atual
- Flag existe e é validada em "Validar Entrada"
- Mas não é usada em "Calcular XP Conversas"
- Sempre calcula apenas dias novos, independente da flag

## Próximos Passos

1. Corrigir "Preparar XP Diário" para buscar dados de "Calcular XP Conversas" ao invés de `$json`
2. Testar com usuário que tem conversas mas não tem histórico
3. Validar que `conquistas_historico` é criado corretamente

