-- Query para enriquecer recorrencias com status de conclusão
-- Busca de conquistas_historico.detalhes->ocorrencias[] quais dias estão concluídos
-- Retorna um JSONB com quest_id -> array de datas concluídas

SELECT
  ch.meta_codigo AS quest_id,
  jsonb_agg(
    DISTINCT (occ->>'data_concluida')::date::text
  ) AS datas_concluidas
FROM public.conquistas_historico ch
CROSS JOIN LATERAL jsonb_array_elements(ch.detalhes->'ocorrencias') AS occ
WHERE ch.usuario_id = $1::uuid
  AND ch.tipo = 'quest'
  AND (occ->>'data_concluida') IS NOT NULL
GROUP BY ch.meta_codigo;

