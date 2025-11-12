-- Ajusta os valores de XP das metas de sequência para refletir a especificação 1.2.
-- Execução segura: aplicar em produção apenas após validar em staging.

WITH ajustes AS (
  SELECT * FROM (VALUES
    ('streak_003',  40),
    ('streak_005',  60),
    ('streak_007',  90),
    ('streak_010', 130),
    ('streak_015', 180),
    ('streak_020', 250),
    ('streak_025', 340),
    ('streak_030', 450)
  ) AS v(codigo, xp_recompensa)
)
UPDATE public.metas_catalogo mc
SET xp_recompensa = ajustes.xp_recompensa,
    atualizado_em = NOW()
FROM ajustes
WHERE mc.codigo = ajustes.codigo;

INSERT INTO public.metas_catalogo (
    codigo,
    titulo,
    descricao,
    tipo,
    xp_recompensa,
    criado_em,
    atualizado_em
)
VALUES (
    'conversa_diaria',
    'Conversa diária',
    'XP base concedido por dia com pelo menos uma conversa concluída',
    'sequencia',
    75,
    NOW(),
    NOW()
)
ON CONFLICT (codigo) DO UPDATE
SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  tipo = EXCLUDED.tipo,
  xp_recompensa = EXCLUDED.xp_recompensa,
  atualizado_em = NOW();

INSERT INTO public.metas_catalogo (
    codigo,
    titulo,
    descricao,
    tipo,
    xp_recompensa,
    criado_em,
    atualizado_em
)
VALUES
  (
    'xp_base_quest',
    'Quest personalizada · XP base',
    'Valor fixo concedido ao concluir qualquer quest personalizada',
    'personalizada',
    150,
    NOW(),
    NOW()
  ),
  (
    'xp_bonus_recorrencia',
    'Quest personalizada · Bônus recorrência',
    'Bônus adicional aplicado a cada ciclo concluído de uma quest recorrente',
    'personalizada',
    30,
    NOW(),
    NOW()
  )
ON CONFLICT (codigo) DO UPDATE
SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  tipo = EXCLUDED.tipo,
  xp_recompensa = EXCLUDED.xp_recompensa,
  atualizado_em = NOW();
