# Query Corrigida - webhook_quests v1.3.8

**Data:** 2025-01-22

**Ajustes:**
- Remover campos: `quest_estagio`, `concluido_em`, `recorrencias` (JSONB)
- Usar: `quests_recorrencias` para recorrências
- Status: `disponivel`, `ativa`, `inativa`
- Calcular estágio baseado nos novos status

---

## Query Ajustada - Nó "Listar Usuarios Quest"

```sql
SELECT
  quests.id AS instancia_id,
  quests.meta_codigo,
  quests.status,
  quests.atualizado_em,
  quests.ativado_em,
  quests.area_vida_id,
  quests.sabotador_id,
  quests.insight_id,
  quests.titulo,
  quests.descricao,
  quests.config,
  quests.xp_recompensa,
  quests.meta_codigo AS modelo_codigo,
  quests.tipo,
  quests.catalogo_id,
  quests.catalogo_codigo,
  quests.catalogo_titulo,
  quests.catalogo_xp,
  -- Calcular estágio baseado nos novos status
  CASE
    WHEN quests.status = 'disponivel' THEN 'a_fazer'
    WHEN quests.status = 'ativa' AND EXISTS (
      SELECT 1 FROM public.quests_recorrencias qr
      WHERE qr.usuarios_quest_id = quests.id
        AND qr.status = 'pendente'
    ) THEN 'fazendo'
    WHEN EXISTS (
      SELECT 1 FROM public.quests_recorrencias qr
      WHERE qr.usuarios_quest_id = quests.id
        AND qr.status = 'concluida'
    ) THEN 'feito'
    ELSE 'a_fazer'
  END AS quest_estagio,
  -- Recorrências: buscar de quests_recorrencias
  COALESCE(
    (
      SELECT jsonb_build_object(
        'dias', jsonb_agg(
          jsonb_build_object(
            'data', qr.data_planejada::text,
            'xp_previsto', qr.xp_base,
            'status', qr.status
          ) ORDER BY qr.data_planejada
        )
      )
      FROM public.quests_recorrencias qr
      WHERE qr.usuarios_quest_id = quests.id
    ),
    '{"dias": []}'::jsonb
  ) AS recorrencias,
  -- Datas concluídas: buscar de quests_recorrencias
  COALESCE(
    (
      SELECT jsonb_agg(DISTINCT qr.data_concluida::text)
      FROM public.quests_recorrencias qr
      WHERE qr.usuarios_quest_id = quests.id
        AND qr.status = 'concluida'
        AND qr.data_concluida IS NOT NULL
    ),
    '[]'::jsonb
  ) AS datas_concluidas,
  -- Data de conclusão: última data concluída
  (
    SELECT MAX(qr.data_concluida)
    FROM public.quests_recorrencias qr
    WHERE qr.usuarios_quest_id = quests.id
      AND qr.status = 'concluida'
  ) AS concluido_em
FROM (
  SELECT
    uq.id,
    uq.status,
    uq.atualizado_em,
    uq.ativado_em,
    uq.area_vida_id,
    uq.sabotador_id,
    uq.insight_id,
    uq.config,
    uq.catalogo_id,
    COALESCE(uq.config->>'meta_codigo', uq.id::text) AS meta_codigo,
    COALESCE(
      uq.config->>'titulo',
      qc.titulo,
      'Quest personalizada'
    ) AS titulo,
    COALESCE(
      uq.config->>'descricao',
      qc.descricao
    ) AS descricao,
    uq.config->>'prioridade' AS prioridade,
    uq.config->>'recorrencia' AS recorrencia,
    COALESCE(
      qc.xp,
      (uq.config->>'xp_recompensa')::int,
      NULL
    ) AS xp_recompensa,
    COALESCE(
      qc.codigo,
      uq.config->>'tipo',
      NULL
    ) AS tipo,
    qc.codigo AS catalogo_codigo,
    qc.titulo AS catalogo_titulo,
    qc.xp AS catalogo_xp
  FROM public.usuarios_quest uq
  LEFT JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  WHERE uq.usuario_id = $1::uuid
    AND uq.status IN ('disponivel', 'ativa', 'inativa')
) AS quests
ORDER BY
  CASE quests.status
    WHEN 'ativa' THEN 0
    WHEN 'disponivel' THEN 1
    WHEN 'inativa' THEN 2
    ELSE 3
  END,
  quests.atualizado_em DESC;
```

---

**Última atualização:** 2025-01-22

