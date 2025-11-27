# Teste de Conclusão de Quest "A Fazer"

**Data:** 2025-11-27  
**Objetivo:** Testar conclusão de quest em status "a fazer" sem recorrências planejadas

## Fase 1: Plano de Teste

### Passos do Teste

1. Navegar até o painel de quests (clicando em "Continuar" no painel de progresso semanal na home)
2. Escolher uma das quests "a fazer"
3. Clicar no botão "Ver detalhes"
4. Concluir a quest clicando no botão "Concluir Quest" da página de detalhes
5. Anotar erros e inconsistências
6. Capturar logs do browser
7. Capturar logs de execução do n8n (correspondente ao registro)
8. Fazer relatório detalhado com as correções a serem aplicadas

## Análise Inicial do Código

### Fluxo Atual

1. **Frontend (`QuestDetailPageV13.tsx`):**
   - Botão "Concluir Quest" chama `handleConcluirQuest()`
   - Determina `dataReferencia` (data selecionada ou data atual)
   - Chama `concluirQuest(detail.id, dataReferencia)`

2. **API (`api/concluir-quest.ts`):**
   - Recebe GET com `usuario_id`, `quest_id`, `data_referencia`
   - Chama webhook n8n `webhook_concluir_quest`

3. **Workflow n8n (`webhook_concluir_quest`):**
   - Normaliza entrada
   - Valida atualização
   - Chama `sw_xp_quest` com `atualizacoes_status` contendo:
     ```json
     [{
       "instancia_id": "quest_id",
       "novo_status": "concluida",
       "progresso_atual": 0,
       "xp_extra": 0,
       "data_referencia": "2025-11-27"
     }]
     ```

4. **Sub-workflow (`sw_xp_quest` - nó "Aplicar Atualizacoes"):**
   - Atualiza status da quest em `usuarios_quest`
   - Tenta atualizar recorrência existente (`recorrencia_atualizada`)
   - Se não encontrar, insere nova recorrência (`recorrencia_inserida`)

### Problema Identificado

A query `recorrencia_inserida` no nó "Aplicar Atualizacoes" tem a seguinte condição:

```sql
recorrencia_inserida AS (
  INSERT INTO public.quests_recorrencias (
    usuarios_quest_id,
    data_planejada,
    data_concluida,
    status,
    xp_base,
    xp_bonus
  )
  SELECT
    upd.id,
    upd.data_referencia,
    upd.data_referencia,
    'concluida',
    upd.xp_base_evento,
    upd.xp_bonus_evento + upd.xp_extra
  FROM atualizados upd
  WHERE upd.novo_status = 'concluida'
    AND NOT EXISTS (
      SELECT 1 FROM recorrencia_atualizada rau WHERE rau.quest_id = upd.id
    )
  RETURNING id
)
```

**Possível problema:** A condição `NOT EXISTS (SELECT 1 FROM recorrencia_atualizada ...)` pode não estar funcionando corretamente quando `recorrencia_atualizada` está vazio (nenhuma recorrência foi atualizada porque não existia nenhuma).

## Análise Detalhada da Query SQL

### Query do Nó "Aplicar Atualizacoes" (sw_xp_quest)

A query tem duas CTEs principais para lidar com recorrências:

1. **`recorrencia_atualizada`**: Atualiza recorrência existente onde `qr.data_planejada = upd.data_referencia`
2. **`recorrencia_inserida`**: Insere nova recorrência se não encontrar uma existente

### Problema Identificado

A condição `NOT EXISTS` em `recorrencia_inserida` verifica:
```sql
NOT EXISTS (
  SELECT 1 FROM recorrencia_atualizada rau WHERE rau.quest_id = upd.id
)
```

**Análise:**
- Se `recorrencia_atualizada` estiver vazia (nenhuma recorrência foi atualizada), `NOT EXISTS` deveria retornar `true`
- No entanto, há um problema potencial: a verificação usa `rau.quest_id`, mas `recorrencia_atualizada` retorna `qr.id, upd.id AS quest_id`
- Se não houver recorrência para atualizar, a CTE estará vazia e a condição deveria funcionar

**Possível causa raiz:**
A query pode estar falhando porque:
1. `data_referencia` pode estar NULL ou em formato incorreto
2. A lógica de `recorrencia_atualizada` pode não estar retornando o `quest_id` corretamente quando vazia
3. Pode haver um problema com a ordem de execução das CTEs

### Correção Proposta

A correção deve garantir que:
1. Se não houver recorrência planejada para a data, insira uma nova com status "concluida"
2. A verificação deve ser mais robusta, checando diretamente na tabela `quests_recorrencias` se já existe uma recorrência para aquela quest e data

**Nova lógica proposta:**
```sql
recorrencia_inserida AS (
  INSERT INTO public.quests_recorrencias (
    usuarios_quest_id,
    data_planejada,
    data_concluida,
    status,
    xp_base,
    xp_bonus
  )
  SELECT
    upd.id,
    upd.data_referencia,
    upd.data_referencia,
    'concluida',
    upd.xp_base_evento,
    upd.xp_bonus_evento + upd.xp_extra
  FROM atualizados upd
  WHERE upd.novo_status = 'concluida'
    AND NOT EXISTS (
      SELECT 1 
      FROM public.quests_recorrencias qr_existente
      WHERE qr_existente.usuarios_quest_id = upd.id
        AND qr_existente.data_planejada = upd.data_referencia
    )
    AND NOT EXISTS (
      SELECT 1 FROM recorrencia_atualizada rau WHERE rau.quest_id = upd.id
    )
  RETURNING id
)
```

Ou, de forma mais simples e direta:
```sql
recorrencia_inserida AS (
  INSERT INTO public.quests_recorrencias (
    usuarios_quest_id,
    data_planejada,
    data_concluida,
    status,
    xp_base,
    xp_bonus
  )
  SELECT
    upd.id,
    upd.data_referencia,
    upd.data_referencia,
    'concluida',
    upd.xp_base_evento,
    upd.xp_bonus_evento + upd.xp_extra
  FROM atualizados upd
  LEFT JOIN recorrencia_atualizada rau ON rau.quest_id = upd.id
  WHERE upd.novo_status = 'concluida'
    AND rau.quest_id IS NULL
    AND NOT EXISTS (
      SELECT 1 
      FROM public.quests_recorrencias qr_existente
      WHERE qr_existente.usuarios_quest_id = upd.id
        AND qr_existente.data_planejada = upd.data_referencia
    )
  RETURNING id
)
```

## ⚠️ ERRO IDENTIFICADO E CORRIGIDO

**Data:** 2025-11-27 18:54

**ERRO:** Foi aplicada incorretamente uma correção no workflow `sw_xp_quest`, que é **exclusivo do agente de IA** e não deve ser alterado para atender demandas de interface.

**AÇÃO:** Correção revertida. O workflow `sw_xp_quest` foi restaurado ao estado original.

**REGRA CRÍTICA:** 
- **NUNCA alterar os workflows `sw_xp_quest`, `sw_criar_quest` e `sw_xp_conversas` para atender demandas de interface.**
- Esses workflows são exclusivos do agente de IA executado após a conversa guiada.
- Para demandas de interface, usar os workflows `webhook_*` correspondentes (ex: `webhook_concluir_quest`).

**PRÓXIMA AÇÃO:** A correção deve ser aplicada no workflow `webhook_concluir_quest` ou criar lógica específica para tratar quests "a fazer" sem recorrências planejadas.

## Correção Aplicada (Correta)

**Data:** 2025-11-27 18:57

**Workflow corrigido:** `webhook_concluir_quest` (workflow de interface)

**Mudança implementada:**
- Adicionado nó "Criar Recorrencia se Necessario" entre "Validar Atualização" e "Calcular XP Quest"
- O nó verifica se a quest está em status "disponivel" e não tem recorrência para a data
- Se não tiver, cria automaticamente um registro em `quests_recorrencias` com status "concluida"
- Fluxo: `Validar Atualização` → `Criar Recorrencia se Necessario` → `Calcular XP Quest` → ...

**Query SQL do novo nó:**
```sql
WITH dados AS (
  SELECT $1::uuid AS quest_id, $2::uuid AS usuario_id, $3::date AS data_referencia
),
quest_info AS (
  SELECT uq.id, uq.status, uq.catalogo_id, COALESCE(qc.xp, 10) AS xp_base
  FROM public.usuarios_quest uq
  LEFT JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  WHERE uq.id = (SELECT quest_id FROM dados) AND uq.usuario_id = (SELECT usuario_id FROM dados)
  LIMIT 1
),
verificar_recorrencia AS (
  SELECT COUNT(*) AS existe
  FROM public.quests_recorrencias qr
  WHERE qr.usuarios_quest_id = (SELECT quest_id FROM dados)
    AND qr.data_planejada = (SELECT data_referencia FROM dados)
),
criar_recorrencia AS (
  INSERT INTO public.quests_recorrencias (
    usuarios_quest_id, data_planejada, data_concluida, status, xp_base, xp_bonus
  )
  SELECT qi.id, d.data_referencia, d.data_referencia, 'concluida', qi.xp_base, 0
  FROM quest_info qi
  CROSS JOIN dados d
  CROSS JOIN verificar_recorrencia vr
  WHERE qi.status = 'disponivel' AND vr.existe = 0
  RETURNING id
)
SELECT d.quest_id, d.usuario_id, d.data_referencia,
  COALESCE((SELECT COUNT(*) FROM criar_recorrencia), 0) AS recorrencia_criada
FROM dados d;
```

**Resultado esperado:**
Quando uma quest em status "disponivel" for concluída:
1. O nó "Criar Recorrencia se Necessario" verifica se já existe recorrência para aquela data
2. Se não existir e a quest estiver em "disponivel", cria o registro automaticamente
3. O `sw_xp_quest` então processa a conclusão normalmente (já encontrando a recorrência criada)


## Próximos Passos

1. ✅ Análise do código concluída
2. ✅ Correção aplicada no workflow correto (`webhook_concluir_quest`)
3. ⏳ Testar a correção (seguir plano de teste da Fase 1)
4. ⏳ Validar que o registro é criado em `quests_recorrencias`

