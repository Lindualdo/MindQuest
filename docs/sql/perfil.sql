SELECT perfil_primario, COUNT(*) AS total_deteccoes
  FROM usuarios_perfis
  WHERE usuario_id =  'd949d81c-9235-41ce-8b3b-6b5d593c5e24'
  GROUP BY perfil_primario
  ORDER BY COUNT(*) DESC, AVG(confianca_media) DESC
  LIMIT 1