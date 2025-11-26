-- Query para atualizar tempo estimado de reflexões guiadas para 10 minutos
-- Aplica-se a todas as quests que têm "Reflexão" no título, exceto a reflexao_diaria (essencial)

UPDATE public.quests_catalogo
SET tempo_estimado_min = 10
WHERE titulo ILIKE '%Reflexão%'
  AND categoria != 'essencial'
  AND codigo != 'reflexao_diaria';

-- Verificar quantas linhas foram atualizadas
SELECT 
  COUNT(*) AS total_atualizadas,
  codigo,
  titulo,
  tempo_estimado_min
FROM public.quests_catalogo
WHERE titulo ILIKE '%Reflexão%'
  AND categoria != 'essencial'
  AND codigo != 'reflexao_diaria'
GROUP BY codigo, titulo, tempo_estimado_min
ORDER BY codigo;

