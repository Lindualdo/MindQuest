-- Ajusta nível, título e próxima meta de XP no resumo_jornada
-- com base na tabela jornada_niveis e no XP total atual.
-- Execute após alterar a tabela de níveis para sincronizar
-- os registros existentes sem precisar resetar toda a base.

WITH nivel_calculado AS (
    SELECT
        r.id,
        j.nivel,
        j.nome,
        j.xp_proximo_nivel
    FROM public.resumo_jornada r
    JOIN LATERAL (
        SELECT j.*
        FROM public.jornada_niveis j
        WHERE r.xp_total >= j.xp_minimo
          AND (j.xp_proximo_nivel IS NULL OR r.xp_total < j.xp_proximo_nivel)
        ORDER BY j.nivel DESC
        LIMIT 1
    ) j ON TRUE
)
UPDATE public.resumo_jornada r
SET
    nivel_atual = n.nivel,
    titulo_nivel = n.nome,
    xp_proximo_nivel = n.xp_proximo_nivel,
    atualizado_em = NOW()
FROM nivel_calculado n
WHERE r.id = n.id;
