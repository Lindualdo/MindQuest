# Plano de Correção: webhook_quests - Versão 2

## Problema Identificado

O node "Montar Resposta" está retornando `recorrencias->dias[]` com todos os dias como `status: "pendente"`, mesmo quando existem conclusões registradas em `conquistas_historico`.

**Causa raiz:** A função `enriquecerRecorrencias` não está funcionando corretamente porque:

1. `usuarios_quest.recorrencias` NÃO deve ter campo `status` - é apenas planejamento (foto estática)
2. `usuarios_quest.recorrencias` NÃO deve ser alterada - sempre planejado
3. O ÚNICO lugar para consultar status é `conquistas_historico.detalhes->ocorrencias[]`
4. Relacionamento: `usuarios_quest.id` = `conquistas_historico.meta_codigo` AND `tipo = 'quest'`

## Regras Fundamentais

### 1. `usuarios_quest.recorrencias` (PLANEJADO)
- **NUNCA** consultar para status de conclusão
- **NUNCA** alterar após criação
- **SEMPRE** apenas planejamento (foto estática)
- Campos permitidos: `data`, `xp_previsto` (sem `status` ou `concluido_em`)

### 2. `conquistas_historico.detalhes->ocorrencias[]` (REALIZADO)
- **ÚNICA** fonte de verdade para status de conclusão
- Consultar `data_concluida` para saber quais dias foram concluídos
- Relacionamento: `usuarios_quest.id` = `conquistas_historico.meta_codigo` AND `tipo = 'quest'`

## Correções Necessárias

### 1. Node "Buscar Conclusoes Historico"
**Status:** ✅ Já está correto
- Query busca `data_concluida` de `conquistas_historico.detalhes->ocorrencias[]`
- Retorna `quest_id` e `datas_concluidas[]`

### 2. Node "Montar Resposta" - Função `enriquecerRecorrencias`
**Problema:** A função está tentando adicionar `status` ao `recorrencias->dias[]`, mas não está encontrando as correspondências corretamente.

**Correção:**
1. Garantir que `recorrencias` vem da base SEM `status` (só `data` e `xp_previsto`)
2. Buscar conclusões de `conquistas_historico` via `conclusoesMap`
3. Para cada dia em `recorrencias->dias[]`, verificar se a data existe em `conclusoesMap[questId]`
4. Se existir, adicionar `status: 'concluida'` temporariamente (só para resposta, não altera a base)
5. Se não existir, adicionar `status: 'pendente'` temporariamente

**Código corrigido:**
```javascript
function normalizarData(data) {
  if (!data) return null;
  const str = String(data);
  // Remove timestamp se existir - sempre retorna YYYY-MM-DD
  return str.split('T')[0].split(' ')[0];
}

function enriquecerRecorrencias(recorrencias, questId, conclusoesMap) {
  if (!recorrencias || !Array.isArray(recorrencias.dias)) {
    return recorrencias;
  }
  
  // Buscar datas concluídas para esta quest
  const datasConcluidas = conclusoesMap[questId] || [];
  
  // Enriquecer cada dia com status (temporariamente, só para resposta)
  const diasEnriquecidos = recorrencias.dias.map((dia) => {
    const dataDia = normalizarData(dia.data);
    
    // Verificar se esta data está nas datas concluídas
    const estaConcluida = dataDia && datasConcluidas.includes(dataDia);
    
    return {
      ...dia,
      status: estaConcluida ? 'concluida' : 'pendente'
    };
  });
  
  return {
    ...recorrencias,
    dias: diasEnriquecidos
  };
}
```

### 3. Node "Montar Resposta" - Construção do `conclusoesMap`
**Problema:** O `conclusoesMap` pode não estar sendo construído corretamente.

**Correção:**
```javascript
// Mapear conclusões por quest_id
const conclusoesMap = {};
conclusoesRaw.forEach((item) => {
  const questId = item.quest_id;
  if (questId) {
    // Garantir que datas_concluidas é array
    let datas = [];
    if (Array.isArray(item.datas_concluidas)) {
      datas = item.datas_concluidas;
    } else if (typeof item.datas_concluidas === 'string') {
      // Se for string JSON, fazer parse
      try {
        const parsed = JSON.parse(item.datas_concluidas);
        datas = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        datas = [];
      }
    }
    
    // Normalizar todas as datas antes de inserir no map
    conclusoesMap[questId] = datas.map((d) => normalizarData(d)).filter((d) => d !== null);
  }
});
```

### 4. Verificar Normalização de Datas
**Problema:** Alguns dias vêm como `"2025-11-20"` (sem timestamp) e outros como `"2025-11-20 00:00:00+00"` (com timestamp).

**Correção:**
- A função `normalizarData` já trata isso, removendo timestamp e retornando sempre `YYYY-MM-DD`
- Garantir que ambas as fontes (recorrencias e conquistas_historico) usem a mesma normalização

## Resultado Esperado

Para o dia 20/11:
- **Quest `56a229b6-9230-4509-8537-c3e7afefbf2e`:**
  - `recorrencias->dias[]` para `2025-11-20` deve ter `status: "concluida"` (temporariamente na resposta)
  - Status vem de `conquistas_historico.detalhes->ocorrencias[]` onde `data_concluida = "2025-11-20"`

- **Quest `1e0bed0a-7f2f-46f5-996f-c73dc6872263`:**
  - `recorrencias->dias[]` para `2025-11-20` deve ter `status: "pendente"` (não existe conclusão para esta data)

## Passos de Implementação

1. ✅ Verificar query do node "Buscar Conclusoes Historico" (já está correto)
2. Corrigir função `normalizarData` para garantir normalização consistente
3. Corrigir construção do `conclusoesMap` para garantir que `datas_concluidas` seja tratado como array
4. Corrigir função `enriquecerRecorrencias` para usar `conclusoesMap` corretamente
5. Testar com dados reais do usuário

## Observações

- `recorrencias` na base de dados NUNCA terá `status` - é apenas planejamento
- O `status` é adicionado temporariamente no node "Montar Resposta" apenas para a resposta do webhook
- O frontend usa este `status` temporário para exibir pendentes vs concluídas
- Se a base estiver correta, o `conclusoesMap` deve ter: `{ "56a229b6-9230-4509-8537-c3e7afefbf2e": ["2025-11-20"] }`

