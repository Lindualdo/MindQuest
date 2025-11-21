-- Query atualizada para sw_xp_quest - Node "Aplicar Atualizacoes"
-- Versão v1.3: Inclui as 3 datas (data_planejada, data_concluida, data_registrada) no detalhes
-- IMPORTANTE: Esta query substitui completamente a query anterior, incluindo operation, query e options

WITH payload AS (
  SELECT
    $1::uuid AS usuario_id,
    $2::jsonb AS atualizacoes,
    $3::jsonb AS estado_inicial,
    $4::jsonb AS novas_quests,
    $5::int AS xp_base_quest,
    $6::int AS xp_bonus_recorrencia
),
updates AS (
  SELECT
    payload.usuario_id,
    (rec->>'instancia_id')::uuid AS instancia_id,
    COALESCE(rec->>'novo_status', 'pendente') AS novo_status,
    COALESCE((rec->>'progresso_atual')::int, 0) AS progresso_atual,
    COALESCE((rec->>'xp_extra')::int, 0) AS xp_extra,
    COALESCE((rec->>'data_referencia')::date, CURRENT_DATE) AS data_referencia
  FROM payload,
       jsonb_array_elements(payload.atualizacoes) rec
  WHERE rec ? 'instancia_id'
),
alvos AS (
  SELECT
    uq.id,
    uq.usuario_id,
    uq.status AS status_atual,
    uq.progresso_meta,
    uq.progresso_atual AS progresso_atual_atual,
    uq.concluido_em AS concluido_em_anterior,
    uq.recorrencias,
    updates.novo_status,
    updates.progresso_atual,
    updates.xp_extra,
    updates.data_referencia,
    COALESCE(uq.config, '{}'::jsonb) AS config
  FROM updates
  JOIN public.usuarios_quest uq ON uq.id = updates.instancia_id
  WHERE uq.usuario_id = updates.usuario_id
),
alvos_enriquecidos AS (
  SELECT
    alvos.*,
    COALESCE(alvos.config->>'recorrencia', 'unica') AS recorrencia,
    CASE WHEN alvos.novo_status = 'concluida' THEN payload.xp_base_quest ELSE 0 END AS xp_base_evento,
    CASE WHEN alvos.novo_status = 'concluida' AND COALESCE(alvos.config->>'recorrencia', 'unica') <> 'unica' THEN payload.xp_bonus_recorrencia ELSE 0 END AS xp_bonus_evento,
    -- Buscar data_planejada de recorrencias->dias[] correspondente à data_referencia
    (
      SELECT dia_elem->>'data'
      FROM jsonb_array_elements(alvos.recorrencias->'dias') AS dia_elem
      WHERE (dia_elem->>'data')::date = alvos.data_referencia
      LIMIT 1
    ) AS data_planejada
  FROM alvos, payload
),
atualizados AS (
  UPDATE public.usuarios_quest uq
  SET
    status = CASE
      WHEN ae.novo_status IN ('pendente','ativa','concluida','vencida','cancelada','reiniciada') THEN ae.novo_status
      ELSE uq.status
    END,
    progresso_atual = ae.progresso_atual,
    progresso_percentual = CASE
      WHEN uq.progresso_meta > 0 THEN LEAST(100, GREATEST(0, ROUND(ae.progresso_atual::numeric / uq.progresso_meta::numeric * 100)))
      ELSE uq.progresso_percentual
    END,
    atualizado_em = NOW(),
    concluido_em = CASE
      WHEN ae.novo_status = 'concluida' AND uq.concluido_em IS NULL THEN NOW()
      ELSE uq.concluido_em
    END,
    reiniciada_em = CASE WHEN ae.novo_status = 'reiniciada' THEN NOW() ELSE uq.reiniciada_em END
  FROM alvos_enriquecidos ae
  WHERE uq.id = ae.id
  RETURNING uq.id, ae.usuario_id, ae.novo_status, ae.recorrencia, ae.xp_base_evento, ae.xp_bonus_evento, ae.xp_extra, ae.config, ae.data_referencia, ae.data_planejada, COALESCE(ae.config->>'titulo', 'Quest Personalizada') AS quest_titulo
),
historico_atualizado AS (
  UPDATE public.conquistas_historico ch
  SET
    xp_base = ch.xp_base + upd.xp_base_evento,
    xp_bonus = ch.xp_bonus + (upd.xp_bonus_evento + upd.xp_extra),
    detalhes = jsonb_set(
      jsonb_set(
        jsonb_set(
          COALESCE(ch.detalhes, '{}'::jsonb),
          '{data_conclusao}',
          to_jsonb(upd.data_referencia::text)
        ),
        '{total_concluidas}',
        to_jsonb((COALESCE((ch.detalhes->>'total_concluidas')::int, 0) + 1))
      ),
      '{ocorrencias}',
      (
        COALESCE(ch.detalhes->'ocorrencias', '[]'::jsonb) || 
        jsonb_build_array(
          jsonb_build_object(
            'data_planejada', COALESCE(upd.data_planejada, upd.data_referencia::text),
            'data_concluida', upd.data_referencia::text,
            'data_registrada', NOW()::text,
            'xp_base', upd.xp_base_evento,
            'xp_bonus', upd.xp_bonus_evento + upd.xp_extra
          )
        )
      )
    ),
    registrado_em = NOW()
  FROM atualizados upd
  WHERE ch.usuario_id = upd.usuario_id
    AND ch.meta_codigo = upd.id::text
    AND ch.tipo = 'quest'
    AND upd.novo_status = 'concluida'
  RETURNING ch.id, upd.id AS quest_id
),
historico_inserido AS (
  INSERT INTO public.conquistas_historico (
    usuario_id,
    tipo,
    meta_codigo,
    meta_titulo,
    xp_base,
    xp_bonus,
    registrado_em,
    detalhes
  )
  SELECT
    upd.usuario_id,
    'quest',
    upd.id::text,
    upd.quest_titulo,
    upd.xp_base_evento,
    upd.xp_bonus_evento + upd.xp_extra,
    NOW(),
    jsonb_build_object(
      'recorrencia', upd.recorrencia,
      'data_conclusao', upd.data_referencia::text,
      'total_concluidas', 1,
      'ocorrencias', jsonb_build_array(
        jsonb_build_object(
          'data_planejada', COALESCE(upd.data_planejada, upd.data_referencia::text),
          'data_concluida', upd.data_referencia::text,
          'data_registrada', NOW()::text,
          'xp_base', upd.xp_base_evento,
          'xp_bonus', upd.xp_bonus_evento + upd.xp_extra
        )
      )
    )
  FROM atualizados upd
  WHERE upd.novo_status = 'concluida'
    AND NOT EXISTS (
      SELECT 1 FROM historico_atualizado hau WHERE hau.quest_id = upd.id
    )
  RETURNING id
),
xp_totais AS (
  SELECT
    COALESCE(SUM(upd.xp_base_evento), 0) AS xp_base_total,
    COALESCE(SUM(upd.xp_bonus_evento + upd.xp_extra), 0) AS xp_bonus_total,
    COUNT(*) FILTER (WHERE upd.novo_status = 'concluida') AS concluidas,
    COUNT(*) FILTER (WHERE upd.novo_status = 'reiniciada') AS reinicios
  FROM atualizados upd
),
atualiza_estado AS (
  UPDATE public.usuarios_conquistas rj
  SET
    xp_total = rj.xp_total + ((SELECT xp_base_total FROM xp_totais) + (SELECT xp_bonus_total FROM xp_totais)),
    xp_base = COALESCE(rj.xp_base, 0) + (SELECT xp_base_total FROM xp_totais),
    xp_bonus = COALESCE(rj.xp_bonus, 0) + (SELECT xp_bonus_total FROM xp_totais),
    total_quests_concluidas = rj.total_quests_concluidas + (SELECT concluidas FROM xp_totais),
    total_xp_hoje = (SELECT xp_base_total FROM xp_totais) + (SELECT xp_bonus_total FROM xp_totais),
    atualizado_em = NOW()
  WHERE rj.usuario_id = (SELECT usuario_id FROM payload LIMIT 1)
  RETURNING rj.usuario_id
)
SELECT
  payload.usuario_id,
  payload.novas_quests,
  payload.atualizacoes,
  payload.estado_inicial,
  ((SELECT xp_base_total FROM xp_totais) + (SELECT xp_bonus_total FROM xp_totais)) AS xp_ganho,
  (SELECT xp_base_total FROM xp_totais) AS xp_base_total,
  (SELECT xp_bonus_total FROM xp_totais) AS xp_bonus_total,
  (SELECT concluidas FROM xp_totais) AS quests_concluidas,
  (SELECT reinicios FROM xp_totais) AS reinicios
FROM payload;

