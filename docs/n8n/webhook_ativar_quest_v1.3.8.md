# Webhook Ativar Quest v1.3.8

**Data:** 2025-11-26

## Objetivo
Ativar uma quest disponível e criar recorrências em `quests_recorrencias`.

## Entrada
- `usuario_id` (UUID, obrigatório)
- `quest_id` (UUID, obrigatório) - ID da quest em `usuarios_quest`
- `recorrencia_dias` (integer, obrigatório) - Número de dias (3, 5, 7, 10, 15)

## Processo
1. Validar entrada
2. Verificar se quest existe e está `disponivel`
3. Atualizar `usuarios_quest.status = 'ativa'` e `ativado_em = NOW()`
4. Criar registros em `quests_recorrencias` para os próximos N dias (a partir de hoje)
5. Retornar sucesso com dados da quest ativada

## Query SQL

```sql
WITH payload AS (
  SELECT 
    $1::uuid AS usuario_id,
    $2::uuid AS quest_id,
    $3::integer AS recorrencia_dias
),
validar_quest AS (
  SELECT 
    uq.id,
    uq.usuario_id,
    uq.status,
    COALESCE(qc.xp, 10) AS xp_base
  FROM public.usuarios_quest uq
  LEFT JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  WHERE uq.id = (SELECT quest_id FROM payload)
    AND uq.usuario_id = (SELECT usuario_id FROM payload)
    AND uq.status = 'disponivel'
),
ativar_quest AS (
  UPDATE public.usuarios_quest
  SET 
    status = 'ativa',
    ativado_em = NOW(),
    atualizado_em = NOW()
  FROM validar_quest vq
  WHERE usuarios_quest.id = vq.id
    AND usuarios_quest.status = 'disponivel'
  RETURNING usuarios_quest.id, usuarios_quest.usuario_id
),
criar_recorrencias AS (
  INSERT INTO public.quests_recorrencias (
    usuarios_quest_id,
    data_planejada,
    status,
    xp_base,
    criado_em,
    atualizado_em
  )
  SELECT
    aq.id,
    (CURRENT_DATE + generate_series(0, (SELECT recorrencia_dias FROM payload) - 1))::date AS data_planejada,
    'pendente',
    vq.xp_base,
    NOW(),
    NOW()
  FROM ativar_quest aq
  CROSS JOIN validar_quest vq
  WHERE aq.id IS NOT NULL
  RETURNING id, usuarios_quest_id, data_planejada, status
)
SELECT
  (SELECT usuario_id FROM payload) AS usuario_id,
  (SELECT quest_id FROM payload) AS quest_id,
  (SELECT COUNT(*) FROM ativar_quest) AS quest_ativada,
  (SELECT COUNT(*) FROM criar_recorrencias) AS recorrencias_criadas,
  (SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'data_planejada', data_planejada,
      'status', status
    )
  ) FROM criar_recorrencias) AS recorrencias;
```

## Resposta
```json
{
  "success": true,
  "usuario_id": "...",
  "quest_id": "...",
  "quest_ativada": 1,
  "recorrencias_criadas": 3,
  "recorrencias": [...]
}
```

