-- Query corrigida para o nó "Verificar e Criar Quest Inicial" do workflow sw_xp_quest
-- Data: 2025-01-22
-- Correção: Removidos campos inexistentes e corrigido erro de sintaxe SQL

WITH payload AS (
  SELECT $1::uuid AS usuario_id
),
verificar_quests AS (
  SELECT COUNT(*) AS total_quests
  FROM public.usuarios_quest uq
  WHERE uq.usuario_id = (SELECT usuario_id FROM payload)
    AND uq.status NOT IN ('cancelada', 'vencida')
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
    janela_inicio,
    janela_fim,
    ativado_em,
    atualizado_em,
    concluido_em,
    config,
    recorrencias,
    quest_estagio
  )
  SELECT
    gen_random_uuid(),
    (SELECT usuario_id FROM payload),
    brd.id,
    'ativa',
    CURRENT_DATE,
    (CURRENT_DATE + INTERVAL '6 days' - EXTRACT(DOW FROM CURRENT_DATE)::int)::date,
    NOW(),
    NOW(),
    NULL,
    jsonb_build_object(
      'titulo', 'Reflexão Diária',
      'descricao', 'Conversa com seu Assistente de reflexão',
      'prioridade', 'alta',
      'recorrencia', 'diaria',
      'conversa', true,
      'contexto_origem', 'sistema'
    ),
    jsonb_build_object(
      'tipo', 'diaria',
      'janela', jsonb_build_object(
        'inicio', CURRENT_DATE::text,
        'fim', (CURRENT_DATE + INTERVAL '6 days' - EXTRACT(DOW FROM CURRENT_DATE)::int)::date::text
      ),
      'dias', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'data', dia::date::text,
            'xp_previsto', 10
          ) ORDER BY dia
        )
        FROM generate_series(
          CURRENT_DATE,
          (CURRENT_DATE + INTERVAL '6 days' - EXTRACT(DOW FROM CURRENT_DATE)::int)::date,
          '1 day'
        ) AS dia
      )
    ),
    'fazendo'
  FROM buscar_reflexao_diaria brd
  CROSS JOIN verificar_quests vq
  WHERE vq.total_quests = 0
  RETURNING id
)
SELECT
  (SELECT usuario_id FROM payload) AS usuario_id,
  COALESCE((SELECT COUNT(*) FROM criar_quest_inicial), 0) AS quest_inicial_criada;

