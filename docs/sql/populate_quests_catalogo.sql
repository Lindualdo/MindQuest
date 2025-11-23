-- =====================================================
-- Popular Catálogo de Quests - Carga Inicial
-- Data: 2025-11-23
-- =====================================================

BEGIN;

-- =====================================================
-- QUEST CUSTOM (Sempre primeira - ID fixo para referência)
-- =====================================================

INSERT INTO public.quests_catalogo (
    id,
    codigo,
    titulo,
    descricao,
    categoria,
    nivel_prioridade,
    tipo_recorrencia,
    tempo_estimado_min,
    dificuldade,
    base_cientifica,
    ativo
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'quest_custom',
    'Quest Personalizada',
    'Quest gerada e personalizada pela IA baseada no contexto específico do usuário',
    'personalizada',
    4,
    NULL,
    5,
    2,
    '{
        "fundamentos": "Quest personalizada gerada por IA baseada em insights, conversas e contexto do usuário",
        "objetivo": "Atender necessidades específicas detectadas nas conversas",
        "como_aplicar": "Seguir instruções personalizadas geradas pela IA",
        "tipo": "personalizada",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- QUESTS ESSENCIAIS (Nível 1)
-- =====================================================

-- Reflexão Diária (Consolidada: conversa + matinal + noturna)
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'reflexao_diaria',
    'Reflexão Diária',
    'Reflexão diária completa com três momentos:
- Conversa com seu Assistente de reflexão: diálogo guiado para autoconhecimento
- Conversa matinal: O que está sob meu controle hoje?
- Reflexão noturna: O que eu fiz bem? O que eu aprendi?

O assistente de IA ajudará você nessas reflexões.',
    'essencial',
    1,
    'diaria',
    25,
    1,
    '{
        "fundamentos": "Neurociência: Ativa córtex pré-frontal (controle executivo) e fortalece memória de trabalho. Estoicismo: Prática de exame de consciência e dichotomia de controle",
        "objetivo": "Criar autoconsciência, alinhar intenções com ações e consolidar aprendizados diários",
        "como_aplicar": "1. Manhã: Conversar com assistente sobre o que está sob seu controle hoje. 2. Durante o dia: Conversa livre com assistente para reflexão. 3. Noite: Revisar o dia com assistente - o que fez bem e o que aprendeu",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica;

COMMIT;

-- =====================================================
-- NOTA: 
-- - Quest custom criada (ID fixo para referência)
-- - 1 quest essencial criada (reflexao_diaria - consolidada)
-- - Próximos passos: Adicionar transformadoras, TCC, contramedidas, etc.
-- =====================================================

