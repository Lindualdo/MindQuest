-- Query corrigida para o nó "Buscar Quests Catálogo"
-- Permite quests de sabotador independentemente do nivel_prioridade

WITH estagio_user AS (
  SELECT estagio_jornada FROM public.usuarios WHERE id = $1::uuid
)
SELECT json_build_object(
  'quests_catalogo',
  COALESCE(json_agg(
    json_build_object(
      'id', qc.id,
      'codigo', qc.codigo,
      'titulo', qc.titulo,
      'descricao', qc.descricao,
      'categoria', qc.categoria,
      'sabotador_id', qc.sabotador_id,
      'base_cientifica', qc.base_cientifica,
      'instrucoes', qc.instrucoes,
      'tempo_estimado_min', qc.tempo_estimado_min,
      'dificuldade', qc.dificuldade,
      'nivel_prioridade', qc.nivel_prioridade,
      'xp', qc.xp
    )
    ORDER BY 
      qc.dificuldade ASC,
      qc.nivel_prioridade DESC
  ), '[]'::json)
) AS catalogo
FROM public.quests_catalogo qc
CROSS JOIN estagio_user eu
WHERE qc.ativo IS TRUE
  AND (
    -- Excluir apenas reflexão (criada automaticamente) e categoria personalizada
    qc.codigo != 'reflexao_diaria'
    AND qc.categoria != 'personalizada'
    AND (
      -- Incluir quests de sabotador OU
      qc.sabotador_id IS NOT NULL
      OR
      -- Incluir todas as outras categorias (TCC, Estoicismo, Essencial, Neurociência, Boa Prática, etc.)
      (qc.categoria IS NOT NULL AND qc.sabotador_id IS NULL)
    )
  )
  AND (
    -- Quests de sabotador: ignorar nivel_prioridade (sempre disponíveis se dificuldade adequada)
    (qc.sabotador_id IS NOT NULL AND (
      (eu.estagio_jornada = 1 AND qc.dificuldade <= 2)
      OR (eu.estagio_jornada = 2 AND qc.dificuldade >= 2 AND qc.dificuldade <= 3)
      OR (eu.estagio_jornada = 3 AND qc.dificuldade >= 2)
      OR (eu.estagio_jornada = 4)
    ))
    OR
    -- Outras quests: aplicar filtro completo (incluindo nivel_prioridade)
    (qc.sabotador_id IS NULL AND (
      (eu.estagio_jornada = 1 AND qc.dificuldade <= 2 AND qc.nivel_prioridade >= 2)
      OR (eu.estagio_jornada = 2 AND qc.dificuldade >= 2 AND qc.dificuldade <= 3)
      OR (eu.estagio_jornada = 3 AND qc.dificuldade >= 2)
      OR (eu.estagio_jornada = 4)
    ))
  );

