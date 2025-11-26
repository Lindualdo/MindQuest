# Ajustes sw_xp_quest v1.3.8

**Data:** 2025-01-22  
**Workflow:** `sw_xp_quest`

---

## Alterações Necessárias

### 1. Nó: "Buscar Estado e Quests" (id: `1b129742-7484-45b4-be33-4a1e2d9ef815`)

**Remover:** `quest_estagio`

**Query ajustada:**
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

### 2. Nó: "Verificar e Criar Quest Inicial" (id: `df21bd43-d75a-4021-909b-2c3176f77366`)

**Remover:** `quest_estagio`, `concluido_em`, `recorrencias`  
**Manter:** `status='ativa'` (quest de conversa sempre ativa)

**Query ajustada:**
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

### 3. Nó: "Inserir Instancias" (id: `d04134ef-f531-4b8d-b93d-9a2b891da8c5`)

**Remover:** `quest_estagio`, `concluido_em`, `recorrencias`  
**Alterar:** `status_inicial` de `'pendente'` para `'disponivel'`  
**Não criar:** `recorrencias` (vai para `quests_recorrencias` quando usuário ativar)

**Query ajustada:**
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

### 4. Nó: "Aplicar Atualizacoes" (id: `83ba4efa-c2a7-4116-a448-f95ae2e5d522`)

**⚠️ ATENÇÃO:** Este nó precisa de refatoração completa para usar `quests_recorrencias` ao invés de `recorrencias` e `conquistas_historico`.

**Por enquanto:** Manter lógica atual mas remover referências a campos removidos.

**Query simplificada (temporária - precisa refatoração completa):**
```sql
-- NOTA: Este nó precisa ser refatorado para usar quests_recorrencias
-- Por enquanto, apenas removendo campos inexistentes
WITH payload AS (
  SELECT
    $1::uuid AS usuario_id,
    $2::jsonb AS atualizacoes,
    $3::jsonb AS estado_inicial,
    $4::jsonb AS novas_quests
),
updates AS (
  SELECT
    payload.usuario_id,
    (rec->>'instancia_id')::uuid AS instancia_id,
    COALESCE(rec->>'novo_status', 'disponivel') AS novo_status,
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
    uq.catalogo_id,
    updates.novo_status,
    updates.xp_extra,
    updates.data_referencia,
    COALESCE(uq.config, '{}'::jsonb) AS config
  FROM updates
  JOIN public.usuarios_quest uq ON uq.id = updates.instancia_id
  WHERE uq.usuario_id = updates.usuario_id
),
buscar_xp AS (
  SELECT
    alvos.id,
    alvos.usuario_id,
    alvos.status_atual,
    alvos.catalogo_id,
    alvos.novo_status,
    alvos.xp_extra,
    alvos.data_referencia,
    alvos.config,
    COALESCE(qc.xp, 10) AS xp_base_quest
  FROM alvos
  LEFT JOIN public.quests_catalogo qc ON qc.id = alvos.catalogo_id
),
alvos_enriquecidos AS (
  SELECT
    buscar_xp.*,
    COALESCE(buscar_xp.config->>'recorrencia', 'unica') AS recorrencia,
    CASE WHEN buscar_xp.novo_status = 'concluida' THEN buscar_xp.xp_base_quest ELSE 0 END AS xp_base_evento,
    0 AS xp_bonus_evento
  FROM buscar_xp
),
atualizados AS (
  UPDATE public.usuarios_quest uq
  SET
    status = CASE
      WHEN ae.novo_status IN ('disponivel', 'ativa', 'inativa') THEN ae.novo_status
      ELSE uq.status
    END,
    atualizado_em = NOW()
  FROM alvos_enriquecidos ae
  WHERE uq.id = ae.id
  RETURNING uq.id, ae.usuario_id, ae.novo_status, ae.recorrencia, ae.xp_base_evento, ae.xp_bonus_evento, ae.xp_extra, ae.config, ae.data_referencia, COALESCE(ae.config->>'titulo', 'Quest Personalizada') AS quest_titulo
),
xp_totais AS (
  SELECT
    COALESCE(SUM(upd.xp_base_evento), 0) AS xp_base_total,
    COALESCE(SUM(upd.xp_bonus_evento + upd.xp_extra), 0) AS xp_bonus_total,
    COUNT(*) FILTER (WHERE upd.novo_status = 'concluida') AS concluidas
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
  0 AS reinicios
FROM payload;
```

---

### 5. Nó: "Buscar Snapshot Final" (id: `bf3cbc9d-2938-44a0-bd99-1739100110d6`)

**Remover:** `quest_estagio`, `concluido_em`

**Query ajustada:**
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

## Resumo das Alterações

1. ✅ Remover `quest_estagio` de todas as queries
2. ✅ Remover `concluido_em` de todas as queries
3. ✅ Remover `recorrencias` de INSERTs (não criar mais)
4. ✅ Mudar `status_inicial` de `'pendente'` para `'disponivel'`
5. ✅ Quest de conversa sempre `status='ativa'`
6. ⚠️ Nó "Aplicar Atualizacoes" precisa refatoração completa para usar `quests_recorrencias`

---

**Última atualização:** 2025-01-22

