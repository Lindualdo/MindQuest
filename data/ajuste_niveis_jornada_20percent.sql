-- Ajustar níveis da jornada para 20% do valor atual
-- Backup dos valores originais antes de executar

-- 1. Verificar valores atuais
SELECT 
  nivel,
  nome,
  xp_minimo AS xp_minimo_original,
  ROUND(xp_minimo * 0.2) AS xp_minimo_novo,
  xp_proximo_nivel AS xp_proximo_nivel_original,
  CASE 
    WHEN xp_proximo_nivel IS NOT NULL THEN ROUND(xp_proximo_nivel * 0.2)
    ELSE NULL
  END AS xp_proximo_nivel_novo
FROM jornada_niveis
ORDER BY nivel;

-- 2. Aplicar atualização (comentado por segurança)
-- DESCOMENTE APÓS REVISAR OS VALORES ACIMA

/*
UPDATE jornada_niveis
SET
  xp_minimo = ROUND(xp_minimo * 0.2),
  xp_proximo_nivel = CASE 
    WHEN xp_proximo_nivel IS NOT NULL THEN ROUND(xp_proximo_nivel * 0.2)
    ELSE NULL
  END,
  atualizado_em = CURRENT_TIMESTAMP;
*/

-- 3. Verificar resultado após aplicar
/*
SELECT 
  nivel,
  nome,
  xp_minimo,
  xp_proximo_nivel
FROM jornada_niveis
ORDER BY nivel;
*/

