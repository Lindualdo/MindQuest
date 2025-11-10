WITH quest_tables AS (
    SELECT unnest(ARRAY[
        'usr_chat', -- tabela de conversas dos usuários
        'metas_catalogo', -- tabela de modelos das metas streak/quests
        'usuarios_quest', -- tabela de quests atribuídas aos usuários
        'usuarios_conquistas', -- resumo da jornada gamificada dos usuários
        'conquistas_historico', -- histórico analítico de conquistas
        'jornada_niveis' -- níveis da jornada gamificada
    ]) AS table_name
), quest_columns AS (
    SELECT
        c.table_name,
        c.ordinal_position,
        c.column_name,
        jsonb_build_object(
            'posicao', c.ordinal_position,
            'tipo', c.data_type,
            'tamanho', c.character_maximum_length,
            'precisao', c.numeric_precision,
            'escala', c.numeric_scale,
            'nulos', c.is_nullable,
            'default', c.column_default
        ) AS column_detail
    FROM information_schema.columns c
    JOIN quest_tables qt
      ON c.table_schema = 'public'
     AND c.table_name = qt.table_name
)
SELECT jsonb_pretty(
    jsonb_agg(
        jsonb_build_object(
            'tabela', table_name,
            'campos', campos
        )
        ORDER BY table_name
    )
)
FROM (
    SELECT
        table_name,
        jsonb_agg(
            jsonb_build_object(
                'campo', column_name,
                'detalhe', column_detail
            )
            ORDER BY ordinal_position
        ) AS campos
    FROM quest_columns
    GROUP BY table_name
) AS table_schema_json;
