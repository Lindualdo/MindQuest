# Query Corrigida - webhook_progresso_semanal v1.3.8

**Data:** 2025-01-22

**Requisitos:**
1. Todos os dias precisam ter uma quest de reflexão diária pendente (conversa)
2. Quests já planejadas: somar com as quests de reflexão
3. Mostrar quantidade pendente e concluída

---

## Query Ajustada

```sql
WITH params AS (
  SELECT
    $1::uuid AS usuario_id,
    (date_trunc('week', CURRENT_DATE + 1)::date - 1) AS semana_inicio
),
limites AS (
  SELECT
    usuario_id,
    semana_inicio,
    semana_inicio + 6 AS semana_fim
  FROM params
),
dias AS (
  SELECT
    l.usuario_id,
    generate_series(l.semana_inicio, l.semana_fim, INTERVAL '1 day')::date AS data
  FROM limites l
),
meta_conversa AS (
  SELECT
    l.usuario_id,
    COALESCE(qc.xp, 10) AS pontos_por_dia
  FROM limites l
  LEFT JOIN public.quests_catalogo qc ON qc.codigo = 'reflexao_diaria'
),
quest_reflexao_diaria AS (
  SELECT
    uq.usuario_id,
    uq.id AS usuarios_quest_id
  FROM public.usuarios_quest uq
  JOIN limites l ON l.usuario_id = uq.usuario_id
  JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  WHERE qc.codigo = 'reflexao_diaria'
    AND uq.status = 'ativa'
),
-- Reflexão diária: TODOS os dias da semana têm uma pendente
reflexao_todos_dias AS (
  SELECT
    qrd.usuario_id,
    qrd.usuarios_quest_id AS quest_id,
    d.data,
    COALESCE(qc.xp, 10) AS xp_previsto,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM public.quests_recorrencias qr
        WHERE qr.usuarios_quest_id = qrd.usuarios_quest_id
          AND qr.data_planejada = d.data
          AND qr.status = 'concluida'
      ) THEN 'concluida'
      ELSE 'pendente'
    END AS status_reflexao
  FROM quest_reflexao_diaria qrd
  JOIN dias d ON d.usuario_id = qrd.usuario_id
  LEFT JOIN public.quests_catalogo qc ON qc.codigo = 'reflexao_diaria'
),
-- Quests já planejadas (com recorrências criadas)
quests_planejadas AS (
  SELECT
    qr.usuarios_quest_id AS quest_id,
    uq.usuario_id,
    qr.data_planejada AS data,
    qr.xp_base AS xp_previsto,
    qr.status
  FROM public.quests_recorrencias qr
  JOIN public.usuarios_quest uq ON uq.id = qr.usuarios_quest_id
  JOIN limites l ON l.usuario_id = uq.usuario_id
  JOIN public.quests_catalogo qc ON qc.id = uq.catalogo_id
  WHERE qc.codigo != 'reflexao_diaria'
    AND qr.data_planejada BETWEEN l.semana_inicio AND l.semana_fim
    AND uq.status IN ('disponivel', 'ativa')
),
-- Unificar todas as quests (reflexão + planejadas)
quests_todas AS (
  SELECT usuario_id, quest_id, data, xp_previsto, status_reflexao AS status FROM reflexao_todos_dias
  UNION ALL
  SELECT usuario_id, quest_id, data, xp_previsto, status FROM quests_planejadas
),
-- Meta de quests por dia
meta_quest_diaria AS (
  SELECT
    usuario_id,
    data,
    COALESCE(SUM(xp_previsto), 0) AS meta_quests
  FROM quests_todas
  GROUP BY usuario_id, data
),
-- Quantidade de quests previstas por dia
qtd_quests_previstas AS (
  SELECT
    usuario_id,
    data,
    COUNT(DISTINCT quest_id) AS qtd_quests_previstas
  FROM quests_todas
  GROUP BY usuario_id, data
),
-- Quantidade de quests concluídas por dia
qtd_quests_concluidas AS (
  SELECT
    usuario_id,
    data,
    COUNT(DISTINCT quest_id) FILTER (WHERE status = 'concluida') AS qtd_quests_concluidas
  FROM quests_todas
  GROUP BY usuario_id, data
),
-- Pontos de conversa (reflexão concluída)
pontos_conversa AS (
  SELECT
    d.usuario_id,
    d.data,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM reflexao_todos_dias rtd
        WHERE rtd.usuario_id = d.usuario_id
          AND rtd.data = d.data
          AND rtd.status_reflexao = 'concluida'
      ) THEN mc.pontos_por_dia
      ELSE 0
    END AS xp_conversa
  FROM dias d
  LEFT JOIN meta_conversa mc ON mc.usuario_id = d.usuario_id
),
-- Pontos de quests concluídas
pontos_quest AS (
  SELECT
    d.usuario_id,
    d.data,
    COALESCE(SUM(qt.xp_previsto) FILTER (WHERE qt.status = 'concluida'), 0) AS xp_base,
    0 AS xp_bonus
  FROM dias d
  LEFT JOIN quests_todas qt ON qt.usuario_id = d.usuario_id AND qt.data = d.data
  GROUP BY d.usuario_id, d.data
),
-- Resumo por dia
resumo_dias AS (
  SELECT
    d.usuario_id,
    d.data,
    mc.pontos_por_dia AS meta_conversa,
    COALESCE(mqd.meta_quests, 0) AS meta_quests,
    mc.pontos_por_dia + COALESCE(mqd.meta_quests, 0) AS meta_total,
    pc.xp_conversa,
    pq.xp_base AS xp_quests,
    pq.xp_bonus,
    pc.xp_conversa + pq.xp_base AS xp_total,
    COALESCE(qqp.qtd_quests_previstas, 0) AS qtd_quests_previstas,
    COALESCE(qqc.qtd_quests_concluidas, 0) AS qtd_quests_concluidas
  FROM dias d
  LEFT JOIN meta_conversa mc ON mc.usuario_id = d.usuario_id
  LEFT JOIN meta_quest_diaria mqd ON mqd.usuario_id = d.usuario_id AND mqd.data = d.data
  LEFT JOIN qtd_quests_previstas qqp ON qqp.usuario_id = d.usuario_id AND qqp.data = d.data
  LEFT JOIN qtd_quests_concluidas qqc ON qqc.usuario_id = d.usuario_id AND qqc.data = d.data
  LEFT JOIN pontos_conversa pc ON pc.usuario_id = d.usuario_id AND pc.data = d.data
  LEFT JOIN pontos_quest pq ON pq.usuario_id = d.usuario_id AND pq.data = d.data
)
SELECT
  l.usuario_id,
  l.semana_inicio,
  l.semana_fim,
  COALESCE(uc.sequencia_atual, 0) AS sequencia_atual,
  COALESCE(SUM(r.xp_total), 0) AS xp_semana_total,
  COALESCE(SUM(r.meta_total), 0) AS meta_semana_total,
  COUNT(*) FILTER (WHERE r.xp_total > 0) AS streak_dias,
  COALESCE(SUM(r.qtd_quests_previstas), 0) AS qtd_quests_previstas_semana,
  COALESCE(SUM(r.qtd_quests_concluidas), 0) AS qtd_quests_concluidas_semana,
  json_agg(
    json_build_object(
      'data', r.data::text,
      'label', CASE EXTRACT(ISODOW FROM r.data)
                 WHEN 7 THEN 'Dom'
                 WHEN 1 THEN 'Seg'
                 WHEN 2 THEN 'Ter'
                 WHEN 3 THEN 'Qua'
                 WHEN 4 THEN 'Qui'
                 WHEN 5 THEN 'Sex'
                 WHEN 6 THEN 'Sáb'
               END,
      'totalXp', r.xp_total,
      'xpBase', r.xp_total,
      'xpBonus', r.xp_bonus,
      'xpConversa', r.xp_conversa,
      'xpQuests', r.xp_quests,
      'metaDia', r.meta_total,
      'metaConversa', r.meta_conversa,
      'metaQuests', r.meta_quests,
      'qtdQuestsPrevistas', r.qtd_quests_previstas,
      'qtdQuestsConcluidas', r.qtd_quests_concluidas
    )
    ORDER BY r.data
  ) AS dias
FROM limites l
LEFT JOIN resumo_dias r ON r.usuario_id = l.usuario_id
LEFT JOIN public.usuarios_conquistas uc ON uc.usuario_id = l.usuario_id
GROUP BY l.usuario_id, l.semana_inicio, l.semana_fim, uc.sequencia_atual;
```

---

**Última atualização:** 2025-01-22

