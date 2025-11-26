# Queries Corrigidas - sw_xp_quest v1.3.8

**Data:** 2025-01-22

Use estas queries diretamente no n8n, copiando e colando no campo "Query" de cada nó.

---

## Nó: "Buscar Estado e Quests" (id: `1b129742-7484-45b4-be33-4a1e2d9ef815`)

```sql
WITH quests AS (
  SELECT
    uq.id,
    uq.status,
    uq.ativado_em,
    uq.atualizado_em,
    uq.catalogo_id,
    COALESCE(uq.config, '{}'::jsonb) AS config
  FROM public.usuarios_quest uq
  WHERE uq.usuario_id = $1::uuid
)
SELECT
  u.usuario_id,
  u.nivel_atual,
  u.titulo_nivel,
  u.xp_total,
  u.total_quests_concluidas,
  u.total_quests_personalizadas,
  u.sequencia_status,
  COALESCE(jsonb_agg(quests) FILTER (WHERE quests.id IS NOT NULL), '[]'::jsonb) AS quests_ativas
FROM public.usuarios_conquistas u
LEFT JOIN quests ON TRUE
WHERE u.usuario_id = $1::uuid
GROUP BY
  u.usuario_id,
  u.nivel_atual,
  u.titulo_nivel,
  u.xp_total,
  u.total_quests_concluidas,
  u.total_quests_personalizadas,
  u.sequencia_status;
```

---

## Nó: "Verificar e Criar Quest Inicial" (id: `df21bd43-d75a-4021-909b-2c3176f77366`)

```sql
WITH payload AS (
  SELECT $1::uuid AS usuario_id,
  $2::jsonb AS novas_quests,
  $3::jsonb AS atualizacoes,
  $4::jsonb AS estado_inicial
),
verificar_quests AS (
  SELECT COUNT(*) AS total_quests
  FROM public.usuarios_quest uq
  WHERE uq.usuario_id = (SELECT usuario_id FROM payload)
    AND uq.status IN ('disponivel', 'ativa')
),
buscar_reflexao_diaria AS (
  SELECT id
  FROM public.quests_catalogo
  WHERE codigo = 'reflexao_diaria'
  LIMIT 1
),
criar_quest_inicial AS (
  INSERT INTO public.usuarios_quest (
    id,
    usuario_id,
    catalogo_id,
    status,
    ativado_em,
    config
  )
  SELECT
    gen_random_uuid(),
    (SELECT usuario_id FROM payload),
    brd.id,
    'ativa',
    NOW(),
    jsonb_build_object(
      'titulo', 'Reflexão Diária',
      'descricao', 'Conversa com seu Assistente de reflexão',
      'prioridade', 'alta',
      'recorrencia', 'diaria',
      'conversa', true,
      'contexto_origem', 'sistema'
    )
  FROM buscar_reflexao_diaria brd
  CROSS JOIN verificar_quests vq
  WHERE vq.total_quests = 0
  RETURNING id
)
SELECT
  (SELECT usuario_id FROM payload) AS usuario_id,
  payload.novas_quests,
  payload.atualizacoes,
  payload.estado_inicial,
  COALESCE((SELECT COUNT(*) FROM criar_quest_inicial), 0) AS quest_inicial_criada
FROM payload;
```

---

## Nó: "Inserir Instancias" (id: `d04134ef-f531-4b8d-b93d-9a2b891da8c5`)

```sql
WITH payload AS (
  SELECT
    $1::uuid AS usuario_id,
    $2::jsonb AS novas_quests,
    $3::jsonb AS atualizacoes,
    $4::jsonb AS estado_inicial
),
criar_conquistas_se_nao_existe AS (
  INSERT INTO public.usuarios_conquistas (usuario_id, xp_total, nivel_atual, titulo_nivel, xp_proximo_nivel, total_quests_concluidas, total_quests_personalizadas, atualizado_em)
  SELECT
    payload.usuario_id,
    0,
    1,
    (SELECT nome FROM public.jornada_niveis WHERE nivel = 1 LIMIT 1),
    (SELECT xp_proximo_nivel FROM public.jornada_niveis WHERE nivel = 1 LIMIT 1),
    0,
    0,
    NOW()
  FROM payload
  WHERE NOT EXISTS (
    SELECT 1 FROM public.usuarios_conquistas uc WHERE uc.usuario_id = payload.usuario_id
  )
  ON CONFLICT (usuario_id) DO NOTHING
  RETURNING usuario_id
),
buscar_quest_custom AS (
  SELECT id FROM public.quests_catalogo WHERE codigo = 'quest_custom' LIMIT 1
),
rows AS (
  SELECT
    payload.usuario_id,
    rec->>'titulo' AS titulo,
    rec->>'descricao' AS descricao,
    rec->>'contexto_origem' AS contexto_origem,
    COALESCE(rec->>'prioridade', 'media') AS prioridade,
    COALESCE(rec->>'recorrencia', 'unica') AS recorrencia,
    (rec->>'prazo_inicio')::date AS prazo_inicio,
    (rec->>'prazo_fim')::date AS prazo_fim,
    COALESCE(rec->>'status_inicial', 'disponivel') AS status_inicial,
    COALESCE(rec->'payload_extra', '{}'::jsonb) AS payload_extra,
    COALESCE((rec->>'xp_recompensa')::int, 10) AS xp_recompensa,
    COALESCE(
      NULLIF((rec->>'catalogo_id')::uuid, NULL),
      (SELECT id FROM buscar_quest_custom)
    ) AS catalogo_id,
    NULLIF((rec->>'area_vida_id')::uuid, NULL) AS area_vida_id,
    NULLIF(rec->>'sabotador_id', '') AS sabotador_id,
    NULLIF((rec->>'insight_id')::uuid, NULL) AS insight_id
  FROM payload,
       jsonb_array_elements(payload.novas_quests) rec
),
inserted AS (
  INSERT INTO public.usuarios_quest (
    id,
    usuario_id,
    catalogo_id,
    status,
    ativado_em,
    config,
    area_vida_id,
    sabotador_id,
    insight_id
  )
  SELECT
    gen_random_uuid(),
    rq.usuario_id,
    COALESCE(rq.catalogo_id, (SELECT id FROM buscar_quest_custom)),
    rq.status_inicial,
    NOW(),
    jsonb_build_object(
      'titulo', rq.titulo,
      'descricao', rq.descricao,
      'prioridade', rq.prioridade,
      'recorrencia', rq.recorrencia,
      'contexto_origem', rq.contexto_origem,
      'payload_extra', rq.payload_extra,
      'prazo_inicio', rq.prazo_inicio::text,
      'prazo_fim', rq.prazo_fim::text
    ),
    rq.area_vida_id,
    rq.sabotador_id,
    rq.insight_id
  FROM rows rq
  WHERE COALESCE(rq.catalogo_id, (SELECT id FROM buscar_quest_custom)) IS NOT NULL
  RETURNING id
),
atualiza_estado AS (
  UPDATE public.usuarios_conquistas
  SET
    total_quests_personalizadas = total_quests_personalizadas + (SELECT COUNT(*) FROM inserted),
    atualizado_em = NOW()
  WHERE usuario_id = (SELECT usuario_id FROM payload)
  RETURNING total_quests_personalizadas
)
SELECT
  payload.usuario_id,
  payload.novas_quests,
  payload.atualizacoes,
  payload.estado_inicial,
  COALESCE((SELECT COUNT(*) FROM inserted), 0) AS novas_inseridas
FROM payload;
```

---

## Nó: "Buscar Snapshot Final" (id: `bf3cbc9d-2938-44a0-bd99-1739100110d6`)

```sql
WITH personalizadas AS (
  SELECT
    uq.id,
    uq.status,
    uq.catalogo_id,
    uq.ativado_em,
    uq.atualizado_em,
    COALESCE(uq.config, '{}'::jsonb) AS config
  FROM public.usuarios_quest uq
  WHERE uq.usuario_id = $1::uuid
)
SELECT
  rj.usuario_id,
  rj.xp_total,
  rj.nivel_atual,
  rj.titulo_nivel,
  rj.xp_proximo_nivel,
  rj.sequencia_atual,
  rj.sequencia_recorde,
  rj.meta_sequencia_codigo,
  rj.proxima_meta_codigo,
  rj.sequencia_status,
  COALESCE(jsonb_agg(personalizadas) FILTER (WHERE personalizadas.id IS NOT NULL), '[]'::jsonb) AS quests_personalizadas
FROM public.usuarios_conquistas rj
LEFT JOIN personalizadas ON TRUE
WHERE rj.usuario_id = $1::uuid
GROUP BY
  rj.usuario_id,
  rj.xp_total,
  rj.nivel_atual,
  rj.titulo_nivel,
  rj.xp_proximo_nivel,
  rj.sequencia_atual,
  rj.sequencia_recorde,
  rj.meta_sequencia_codigo,
  rj.proxima_meta_codigo,
  rj.sequencia_status;
```

---

**Última atualização:** 2025-01-22

