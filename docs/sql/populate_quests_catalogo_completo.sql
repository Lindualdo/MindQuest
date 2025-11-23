-- =====================================================
-- Popular Catálogo de Quests - Carga Completa
-- Data: 2025-11-23
-- =====================================================

BEGIN;

-- =====================================================
-- QUEST CUSTOM (Sempre primeira - ID fixo)
-- =====================================================

INSERT INTO public.quests_catalogo (
    id, codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, ativo
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

-- =====================================================
-- QUESTS TRANSFORMADORAS (Nível 2)
-- =====================================================

-- Micro-ação de Coragem
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'micro_acao_coragem',
    'Micro-ação de Coragem',
    'Fazer 1 coisa que gera desconforto leve mas é importante para seu crescimento',
    'neurociencia',
    2,
    'semanal',
    10,
    2,
    '{
        "fundamentos": "Neurociência: Quebra padrões neurais de medo/evitação, cria novos caminhos neurais (neuroplasticidade), fortalece autoconfiança",
        "objetivo": "Quebrar padrões de medo e criar novos caminhos neurais",
        "como_aplicar": "Identifique 1 ação que gera desconforto leve mas é importante. Exemplos: ligar para alguém, iniciar conversa difícil, dizer não, pedir ajuda. Execute mesmo com desconforto.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Reconhecimento de Progresso
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'reconhecimento_progresso',
    'Reconhecimento de Progresso',
    'Registrar 1-3 micro-vitórias do dia e reconhecer 1 progresso em área importante',
    'tcc',
    2,
    'diaria',
    3,
    1,
    '{
        "fundamentos": "TCC: Reforço positivo. Neurociência: Ativa sistema de recompensa (dopamina), reduz viés de negatividade",
        "objetivo": "Reforçar comportamentos positivos e reduzir foco no que falta",
        "como_aplicar": "Ao final do dia, liste 1-3 micro-vitórias (mesmo pequenas). Reconheça 1 progresso específico em área importante. Agradeça por 1 coisa específica (não genérica).",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- TÉCNICAS DE TCC (Nível 2-3)
-- =====================================================

-- Identificação de Pensamentos Automáticos
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_identificacao_pensamentos',
    'Identificar Pensamentos Automáticos',
    'Quando surgir emoção negativa, perguntar: "O que estou pensando agora?" e registrar o pensamento automático',
    'tcc',
    2,
    'contextual',
    3,
    2,
    '{
        "fundamentos": "TCC: Base para reestruturação cognitiva. Neurociência: Ativa córtex pré-frontal (consciência metacognitiva), interrompe padrão automático",
        "objetivo": "Identificar pensamentos automáticos que influenciam emoções e comportamentos",
        "como_aplicar": "Quando surgir emoção negativa: 1. Pare e pergunte: O que estou pensando agora? 2. Registre o pensamento em 1 frase. 3. Observe sem julgar.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Reestruturação Cognitiva
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_reestruturacao_cognitiva',
    'Reestruturação Cognitiva',
    'Após identificar pensamento automático, fazer 3 perguntas de desafio para encontrar alternativas mais realistas',
    'tcc',
    2,
    'contextual',
    5,
    2,
    '{
        "fundamentos": "TCC: Desafia crenças irracionais, promove pensamento equilibrado. Neurociência: Fortalece conexões pré-frontais, reduz ativação da amígdala",
        "objetivo": "Desafiar pensamentos disfuncionais e encontrar alternativas mais realistas",
        "como_aplicar": "Após identificar pensamento automático, faça 3 perguntas: 1. Que evidência tenho disso? 2. Há outra forma de ver isso? 3. O que eu diria a um amigo nessa situação?",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Registro de Pensamentos (Diário Cognitivo)
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_registro_pensamentos',
    'Registro de Pensamentos',
    'Registrar 1 situação + pensamento + emoção + comportamento para identificar padrões',
    'tcc',
    2,
    'diaria',
    5,
    2,
    '{
        "fundamentos": "TCC: Base para análise cognitiva, identifica padrões disfuncionais. Neurociência: Fortalece memória de trabalho, cria padrão de autorreflexão",
        "objetivo": "Identificar padrões entre pensamentos, emoções e comportamentos",
        "como_aplicar": "Registre: Situação: X | Pensamento: Y | Emoção: Z | Ação: W. Faça 1x ao dia quando surgir emoção negativa.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Exposição Gradual
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_exposicao_gradual',
    'Exposição Gradual',
    'Enfrentar progressivamente situações que geram ansiedade, começando com pequenos passos',
    'tcc',
    3,
    'contextual',
    10,
    3,
    '{
        "fundamentos": "TCC: Reduz evitação comportamental, promove enfrentamento gradual. Neurociência: Reduz ativação da amígdala, cria novos caminhos neurais (habituação)",
        "objetivo": "Reduzir ansiedade através de enfrentamento gradual",
        "como_aplicar": "Identifique 1 situação que gera ansiedade leve. Faça pequeno passo em direção a ela (ex: pensar sobre, visualizar, aproximar-se). Aumente gradualmente.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Relaxamento 4-7-8
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_relaxamento_4_7_8',
    'Relaxamento Respiração 4-7-8',
    'Respirar 4s (inspirar) → 7s (segurar) → 8s (expirar), fazer 4 ciclos completos',
    'tcc',
    3,
    'contextual',
    3,
    1,
    '{
        "fundamentos": "TCC: Reduz ansiedade física, melhora regulação emocional. Neurociência: Ativa sistema parassimpático, reduz cortisol",
        "objetivo": "Reduzir ansiedade física e melhorar regulação emocional",
        "como_aplicar": "3x ao dia: Respirar 4s (inspirar) → 7s (segurar) → 8s (expirar). Fazer 4 ciclos completos. Focar apenas na respiração.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Mindfulness Ancoragem
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_mindfulness_ancoragem',
    'Mindfulness - Ancoragem no Presente',
    'Pausar e nomear 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia',
    'tcc',
    3,
    'contextual',
    2,
    1,
    '{
        "fundamentos": "TCC: Reduz ruminação, aumenta consciência do presente. Neurociência: Reduz ativação da rede de modo padrão, fortalece atenção plena",
        "objetivo": "Reduzir ruminação e aumentar consciência do momento presente",
        "como_aplicar": "3x ao dia: Pausar e nomear 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia. Focar apenas nos sentidos.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Resolução de Problemas Estruturada
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_resolucao_problemas',
    'Resolução de Problemas Estruturada',
    'Seguir 4 passos estruturados para resolver problemas: definir, listar soluções, escolher ação, executar',
    'tcc',
    3,
    'contextual',
    10,
    2,
    '{
        "fundamentos": "TCC: Reduz paralisia por análise, promove ação orientada a solução. Neurociência: Ativa córtex pré-frontal, reduz ativação de áreas de preocupação",
        "objetivo": "Resolver problemas de forma estruturada e eficaz",
        "como_aplicar": "1. Definir problema claramente (1 frase). 2. Listar 3 soluções possíveis. 3. Escolher 1 solução e definir 1 ação imediata. 4. Executar ação (mesmo que pequena).",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Aceitação e Compromisso
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_aceitacao_compromisso',
    'Aceitação e Compromisso',
    'Quando surgir pensamento/emoção difícil: reconhecer, identificar valores, agir alinhado aos valores',
    'tcc',
    3,
    'contextual',
    5,
    2,
    '{
        "fundamentos": "ACT: Reduz evitação experiencial, promove ação orientada a valores. Neurociência: Reduz luta contra emoções, fortalece flexibilidade psicológica",
        "objetivo": "Aceitar emoções difíceis e agir alinhado aos valores pessoais",
        "como_aplicar": "1. Reconhecer: Estou sentindo X (aceitação). 2. Perguntar: O que é importante para mim aqui? (valores). 3. Agir alinhado ao valor (mesmo com desconforto).",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Autocompaixão Estruturada
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'tcc_autocompaixao',
    'Autocompaixão Estruturada',
    'Quando surgir autocrítica: reconhecer sofrimento, humanidade comum, bondade consigo, ação compassiva',
    'tcc',
    3,
    'contextual',
    5,
    2,
    '{
        "fundamentos": "TCC: Reduz autocrítica, promove bem-estar emocional. Neurociência: Ativa sistema de cuidado (ocitocina), reduz ativação de áreas de crítica",
        "objetivo": "Reduzir autocrítica e promover bem-estar emocional",
        "como_aplicar": "1. Reconhecer sofrimento: Estou sofrendo agora. 2. Humanidade comum: Outros também passam por isso. 3. Bondade consigo: O que eu preciso agora? 4. Ação compassiva: Fazer 1 coisa gentil para si.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- PRÁTICAS DE ESTOICISMO (Nível 2-3)
-- =====================================================

-- Reflexão sobre Controle
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'estoicismo_reflexao_controle',
    'Reflexão sobre Controle',
    'Quando surgir preocupação/ansiedade: listar o que está sob controle e o que está fora, agir apenas no primeiro grupo',
    'estoicismo',
    3,
    'contextual',
    5,
    2,
    '{
        "fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Reduz ativação de áreas de preocupação, libera recursos cognitivos",
        "objetivo": "Reduzir ansiedade focando apenas no que está ao alcance",
        "como_aplicar": "Quando surgir preocupação: 1. Listar: O que está sob meu controle aqui? 2. Listar: O que está fora do meu controle? 3. Agir apenas no primeiro grupo.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Gratidão Específica
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'estoicismo_gratidao_especifica',
    'Gratidão Específica',
    'Ao final do dia, listar 3 coisas específicas pelas quais é grato (não genéricas)',
    'estoicismo',
    2,
    'diaria',
    3,
    1,
    '{
        "fundamentos": "Estoicismo: Prática de gratidão (Epicteto). Neurociência: Ativa sistema de recompensa, reduz viés de negatividade",
        "objetivo": "Melhorar humor e perspectiva através de gratidão específica",
        "como_aplicar": "Ao final do dia, liste 3 coisas específicas pelas quais é grato. Seja específico (não genérico): Gratidão por X porque Y.",
        "tipo": "tecnica",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- BOAS PRÁTICAS GERAIS (Nível 4)
-- =====================================================

-- Atividade Física Micro
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'boa_pratica_atividade_fisica',
    'Atividade Física - Micro-Movimento',
    '1 movimento físico por dia (ex: 10 min caminhada, 5 min alongamento, 3 min dança)',
    'boa_pratica_geral',
    4,
    'diaria',
    10,
    1,
    '{
        "fundamentos": "Neurociência: Libera endorfinas e dopamina, reduz cortisol, melhora neuroplasticidade",
        "objetivo": "Melhorar humor, energia e reduzir ansiedade",
        "como_aplicar": "Faça 1 movimento físico por dia. Foco em movimento, não em performance. Exemplos: 10 min caminhada, 5 min alongamento, 3 min dança.",
        "tipo": "ferramenta",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

-- Conexão Social
INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia,
    tempo_estimado_min, dificuldade, base_cientifica, ativo
) VALUES (
    'boa_pratica_conexao_social',
    'Conexão Social',
    '1 interação social significativa por dia (mensagem, ligação, conversa presencial)',
    'boa_pratica_geral',
    4,
    'diaria',
    10,
    1,
    '{
        "fundamentos": "Neurociência: Libera ocitocina (vínculo), reduz cortisol, fortalece sistema de apoio",
        "objetivo": "Melhorar bem-estar emocional e reduzir solidão",
        "como_aplicar": "Faça 1 interação social significativa por dia. Exemplos: mensagem para amigo, ligação rápida, conversa presencial. Foco em conexão, não em quantidade.",
        "tipo": "ferramenta",
        "links_referencias": []
    }'::jsonb,
    true
) ON CONFLICT (codigo) DO NOTHING;

COMMIT;

-- =====================================================
-- NOTA: 
-- - Quest custom criada
-- - 1 quest essencial criada
-- - 2 quests transformadoras criadas
-- - 10 técnicas de TCC criadas
-- - 2 práticas de estoicismo criadas
-- - 2 boas práticas gerais criadas
-- - Próximo: Adicionar contramedidas por sabotador (100)
-- =====================================================

-- =====================================================
-- CONTRAMEDIDAS POR SABOTADOR (10 por sabotador = 100)
-- =====================================================

-- CRÍTICO (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_critico_01', 'Reconhecer Vitórias Diárias', 'Reconhecer vitórias e progressos reais diariamente', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Ativa sistema de recompensa", "objetivo": "Reduzir foco no que falta e aumentar reconhecimento de progressos", "como_aplicar": "Ao final do dia, liste 1-3 vitórias reais (mesmo pequenas)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_02', 'Autocompaixão Antes de Revisar', 'Praticar autocompaixão antes de revisar resultados', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Reduz autocrítica. Neurociência: Ativa sistema de cuidado", "objetivo": "Reduzir autocrítica excessiva", "como_aplicar": "Antes de revisar algo, pergunte: Se um amigo estivesse nessa situação, o que eu diria?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_03', 'Feedback Apreciativo', 'Investir em feedback apreciativo com equipe e consigo', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Fortalece conexões positivas", "objetivo": "Criar ambiente de apoio e reconhecimento", "como_aplicar": "Dê 1 feedback apreciativo por dia (para si ou para outros)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_04', 'Questionar Evidências', 'Quando surgir julgamento, perguntar: Que evidência tenho disso?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Desafia pensamentos automáticos. Neurociência: Interrompe padrão automático", "objetivo": "Interromper julgamentos automáticos", "como_aplicar": "Quando surgir julgamento, pare e pergunte: Que evidência tenho disso?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_05', 'Refletir sobre Controle', 'Perguntar: O que está sob meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Reduz ansiedade", "objetivo": "Focar apenas no que pode controlar", "como_aplicar": "Quando surgir crítica, pergunte: O que está sob meu controle aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_06', 'Reformular Críticas', 'Transformar Isso está errado em O que posso aprender aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Reestruturação cognitiva. Neurociência: Cria novos caminhos neurais", "objetivo": "Transformar crítica em aprendizado", "como_aplicar": "Quando surgir crítica, reformule: O que posso aprender aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_07', 'Pausa de 3 Respirações', 'Antes de criticar, respirar 3 vezes conscientemente', 'contramedida_sabotador', 1, 'contextual', 1, 1, '{"fundamentos": "Neurociência: Ativa córtex pré-frontal, reduz reatividade", "objetivo": "Criar espaço entre estímulo e resposta", "como_aplicar": "Antes de criticar, pare e respire 3 vezes conscientemente", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_08', 'Registrar 3 Coisas Boas', 'Ao final do dia, listar 3 aspectos positivos', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reduz viés de negatividade. Neurociência: Fortalece memória positiva", "objetivo": "Reduzir foco no negativo", "como_aplicar": "Ao final do dia, liste 3 aspectos positivos do dia", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_09', 'Gratidão por Progresso', 'Agradecer por 1 progresso concreto do dia', 'contramedida_sabotador', 1, 'diaria', 2, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Ativa sistema de recompensa", "objetivo": "Reconhecer progressos concretos", "como_aplicar": "Agradeça por 1 progresso específico do dia (seja concreto)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true),
('contramedida_critico_10', 'Compaixão Estruturada', 'Se um amigo estivesse nessa situação, o que eu diria?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Autocompaixão. Neurociência: Reduz autocrítica", "objetivo": "Reduzir autocrítica excessiva", "como_aplicar": "Quando surgir autocrítica, pergunte: Se um amigo estivesse nessa situação, o que eu diria?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'critico', true)
ON CONFLICT (codigo) DO NOTHING;

-- INSISTENTE (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_insistente_01', 'Bom o Suficiente', 'Praticar "bom o suficiente" em tarefas de baixo risco', 'contramedida_sabotador', 1, 'contextual', 3, 2, '{"fundamentos": "TCC: Reduz perfeccionismo. Neurociência: Reduz ansiedade", "objetivo": "Reduzir perfeccionismo excessivo", "como_aplicar": "Em tarefas de baixo risco, pare quando estiver bom o suficiente", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_02', 'Delegar com Aceitação', 'Delegar com checklists claros e aceitar estilos diferentes', 'contramedida_sabotador', 1, 'contextual', 5, 2, '{"fundamentos": "TCC: Reduz controle excessivo. Neurociência: Fortalece confiança", "objetivo": "Reduzir necessidade de controle total", "como_aplicar": "Delegue 1 tarefa com checklist claro e aceite que o estilo pode ser diferente", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_03', 'Hobbies Lúdicos', 'Usar hobbies lúdicos sem meta de produtividade', 'contramedida_sabotador', 1, 'semanal', 15, 1, '{"fundamentos": "TCC: Reduz perfeccionismo. Neurociência: Ativa sistema de recompensa", "objetivo": "Criar espaço para atividades sem objetivo", "como_aplicar": "Dedique 15 min a 1 hobby sem objetivo de produtividade", "tipo": "ferramenta", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_04', 'Celebrar Imperfeições', 'Celebrar pequenas imperfeições como oportunidade de aprendizagem', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Reestruturação cognitiva. Neurociência: Reduz medo de erro", "objetivo": "Transformar imperfeições em aprendizado", "como_aplicar": "Quando encontrar imperfeição, pergunte: O que posso aprender aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_05', 'Regra dos 80%', 'Parar quando 80% está pronto', 'contramedida_sabotador', 1, 'contextual', 1, 2, '{"fundamentos": "TCC: Reduz perfeccionismo. Neurociência: Reduz ansiedade", "objetivo": "Evitar perfeccionismo excessivo", "como_aplicar": "Defina: quando 80% estiver pronto, pare. Não busque os 20% restantes", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_06', 'Teste E Se', 'Perguntar: E se eu não fizer perfeito, o que acontece?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Desafia crença irracional. Neurociência: Reduz ansiedade", "objetivo": "Questionar necessidade de perfeição", "como_aplicar": "Quando surgir perfeccionismo, pergunte: E se eu não fizer perfeito, o que acontece?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_07', 'Tempo Limitado', 'Definir tempo máximo para tarefas (ex: 30 min, depois parar)', 'contramedida_sabotador', 1, 'contextual', 1, 2, '{"fundamentos": "TCC: Reduz perfeccionismo. Neurociência: Cria limites claros", "objetivo": "Evitar gastar tempo excessivo", "como_aplicar": "Antes de começar tarefa, defina tempo máximo. Quando acabar, pare", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_08', 'Aceitar Imprevistos', 'Praticar 1 mudança de plano por dia', 'contramedida_sabotador', 1, 'diaria', 5, 2, '{"fundamentos": "TCC: Fortalece flexibilidade. Neurociência: Reduz rigidez", "objetivo": "Aumentar flexibilidade", "como_aplicar": "Quando surgir imprevisto, aceite e ajuste o plano (não resista)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_09', 'Reflexão sobre Controle', 'Perguntar: O que está fora do meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Reduz ansiedade", "objetivo": "Aceitar o que não pode controlar", "como_aplicar": "Quando surgir rigidez, pergunte: O que está fora do meu controle aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true),
('contramedida_insistente_10', 'Celebrar Suficiente', 'Ao final do dia, reconhecer 1 coisa que foi "suficiente" (não perfeita)', 'contramedida_sabotador', 1, 'diaria', 2, 1, '{"fundamentos": "TCC: Reduz perfeccionismo. Neurociência: Fortalece memória positiva", "objetivo": "Reconhecer que suficiente é suficiente", "como_aplicar": "Ao final do dia, reconheça 1 coisa que foi suficiente (não perfeita) e está ok", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'insistente', true)
ON CONFLICT (codigo) DO NOTHING;

-- PRESTATIVO (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_prestativo_01', 'Pedir Apoio Direto', 'Praticar pedidos diretos de apoio ou descanso', 'contramedida_sabotador', 1, 'contextual', 3, 2, '{"fundamentos": "TCC: Assertividade. Neurociência: Reduz sobrecarga", "objetivo": "Equilibrar dar e receber", "como_aplicar": "Peça ajuda ou descanso diretamente, sem justificar excessivamente", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_02', 'Definir Limites Claros', 'Definir limites claros e comunicar expectativas', 'contramedida_sabotador', 1, 'contextual', 5, 2, '{"fundamentos": "TCC: Assertividade. Neurociência: Reduz sobrecarga", "objetivo": "Proteger próprio bem-estar", "como_aplicar": "Defina 1 limite claro e comunique de forma direta e respeitosa", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_03', 'Autocuidado Não Negociável', 'Reservar tempo semanal para autocuidado não negociável', 'contramedida_sabotador', 1, 'semanal', 30, 2, '{"fundamentos": "TCC: Autocuidado. Neurociência: Reduz esgotamento", "objetivo": "Priorizar próprio bem-estar", "como_aplicar": "Reserve 30 min por semana para autocuidado (não negociável)", "tipo": "ferramenta", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_04', 'Celebrar Reciprocidade', 'Celebrar relacionamentos baseados em reciprocidade', 'contramedida_sabotador', 1, 'semanal', 3, 1, '{"fundamentos": "TCC: Relacionamentos saudáveis. Neurociência: Fortalece vínculos", "objetivo": "Reconhecer relacionamentos equilibrados", "como_aplicar": "Reconheça 1 relacionamento baseado em reciprocidade (dar e receber)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_05', 'Pergunta Antes de Ajudar', 'Perguntar: Você quer ajuda ou apenas ser ouvido?', 'contramedida_sabotador', 1, 'contextual', 1, 1, '{"fundamentos": "TCC: Comunicação assertiva. Neurociência: Reduz interferência", "objetivo": "Respeitar necessidade do outro", "como_aplicar": "Antes de ajudar, pergunte: Você quer ajuda ou apenas ser ouvido?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_06', 'Regra do Não Diário', 'Dizer "não" para 1 pedido por dia', 'contramedida_sabotador', 1, 'diaria', 1, 2, '{"fundamentos": "TCC: Assertividade. Neurociência: Fortalece limites", "objetivo": "Praticar dizer não", "como_aplicar": "Diga não para 1 pedido por dia (quando apropriado)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_07', 'Check-in Consigo', 'Antes de ajudar, perguntar: O que EU preciso agora?', 'contramedida_sabotador', 1, 'contextual', 2, 2, '{"fundamentos": "TCC: Autocuidado. Neurociência: Reduz negligência própria", "objetivo": "Priorizar próprias necessidades", "como_aplicar": "Antes de ajudar alguém, pergunte: O que EU preciso agora?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_08', 'Gratidão por Limites', 'Agradecer por ter estabelecido 1 limite', 'contramedida_sabotador', 1, 'diaria', 1, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reforça comportamento", "objetivo": "Reforçar estabelecimento de limites", "como_aplicar": "Agradeça por ter estabelecido 1 limite hoje (reforça comportamento)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_09', 'Prática de Vulnerabilidade', 'Compartilhar 1 necessidade própria por dia', 'contramedida_sabotador', 1, 'diaria', 3, 2, '{"fundamentos": "TCC: Vulnerabilidade. Neurociência: Fortalece conexões", "objetivo": "Quebrar padrão de sempre ajudar", "como_aplicar": "Compartilhe 1 necessidade própria com alguém (quebra padrão)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true),
('contramedida_prestativo_10', 'Reflexão sobre Controle', 'Perguntar: O que está sob meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Reduz sobrecarga", "objetivo": "Evitar assumir responsabilidades alheias", "como_aplicar": "Quando surgir vontade de ajudar, pergunte: O que está sob meu controle aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'prestativo', true)
ON CONFLICT (codigo) DO NOTHING;

-- HIPER-REALIZADOR (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_hiper_realizador_01', 'Metas de Bem-estar', 'Definir metas de bem-estar tão importantes quanto metas técnicas', 'contramedida_sabotador', 1, 'semanal', 10, 2, '{"fundamentos": "TCC: Equilíbrio vida-trabalho. Neurociência: Reduz burnout", "objetivo": "Equilibrar produtividade e bem-estar", "como_aplicar": "Defina 1 meta de bem-estar para cada meta técnica", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_02', 'Check-in Emocional Semanal', 'Praticar check-ins emocionais semanais', 'contramedida_sabotador', 1, 'semanal', 10, 2, '{"fundamentos": "TCC: Autoconsciência emocional. Neurociência: Fortalece regulação", "objetivo": "Manter conexão com emoções", "como_aplicar": "1x por semana, pergunte: Como estou me sentindo? O que preciso?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_03', 'Celebrar Progresso', 'Celebrar progresso sem falar de próxima meta', 'contramedida_sabotador', 1, 'contextual', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Ativa sistema de recompensa", "objetivo": "Apreciar conquistas sem focar no próximo", "como_aplicar": "Ao concluir algo, celebre sem mencionar próxima meta", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_04', 'Pedir Ajuda e Delegar', 'Autorizar-se a pedir ajuda e delegar etapas', 'contramedida_sabotador', 1, 'contextual', 5, 2, '{"fundamentos": "TCC: Vulnerabilidade. Neurociência: Reduz sobrecarga", "objetivo": "Reconhecer que não precisa fazer tudo sozinho", "como_aplicar": "Peça ajuda ou delegue 1 tarefa por dia", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_05', 'Pausa de 5 Minutos', 'A cada 2 horas, parar 5 min sem fazer nada', 'contramedida_sabotador', 1, 'diaria', 5, 1, '{"fundamentos": "Neurociência: Reduz compulsão, melhora foco", "objetivo": "Reduzir compulsão por produtividade", "como_aplicar": "A cada 2 horas, pare 5 min sem fazer nada (apenas descansar)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_06', 'Registrar Vitórias', 'Ao concluir algo, escrever "Completei X" e pausar', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Reforça conclusão", "objetivo": "Reconhecer conclusões antes de partir para próximo", "como_aplicar": "Ao concluir algo, escreva \"Completei X\" e pause (não vá direto para próximo)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_07', 'Prática de Presença', '1 atividade por dia sem objetivo de resultado', 'contramedida_sabotador', 1, 'diaria', 15, 2, '{"fundamentos": "TCC: Mindfulness. Neurociência: Reduz compulsão", "objetivo": "Criar espaço sem objetivo produtivo", "como_aplicar": "Faça 1 atividade sem objetivo (ex: caminhar sem meta, apenas caminhar)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_08', 'Reconhecer Progresso', 'Listar 3 coisas que já foram alcançadas', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reduz foco no que falta. Neurociência: Fortalece memória positiva", "objetivo": "Reconhecer o que já foi feito", "como_aplicar": "Liste 3 coisas que já foram alcançadas (reduz foco no que falta)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_09', 'Reflexão sobre Valor', 'Perguntar: Meu valor não está apenas no que entrego', 'contramedida_sabotador', 1, 'contextual', 2, 2, '{"fundamentos": "TCC: Questiona crença. Neurociência: Reduz dependência de validação externa", "objetivo": "Questionar crença de que valor = resultados", "como_aplicar": "Quando surgir autocobrança, pergunte: Meu valor não está apenas no que entrego", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true),
('contramedida_hiper_realizador_10', 'Gratidão por Descanso', 'Agradecer por ter descansado', 'contramedida_sabotador', 1, 'diaria', 1, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reforça comportamento", "objetivo": "Reconhecer que descanso é importante", "como_aplicar": "Agradeça por ter descansado (reforça que descanso é válido)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_realizador', true)
ON CONFLICT (codigo) DO NOTHING;

-- HIPER-VIGILANTE (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_hiper_vigilante_01', 'Janelas para Planejar Riscos', 'Definir janelas específicas para planejar riscos', 'contramedida_sabotador', 1, 'diaria', 10, 2, '{"fundamentos": "TCC: Controle de preocupação. Neurociência: Reduz ruminação", "objetivo": "Limitar tempo de preocupação", "como_aplicar": "Defina 1 horário específico (ex: 15h) para planejar riscos. Fora desse horário, não planeje", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_02', 'Descanso Sensorial', 'Praticar descanso sensorial (respiração, mindfulness)', 'contramedida_sabotador', 1, 'diaria', 5, 1, '{"fundamentos": "TCC: Relaxamento. Neurociência: Ativa sistema parassimpático", "objetivo": "Reduzir hipervigilância física", "como_aplicar": "3x ao dia, pratique 5 min de respiração ou mindfulness", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_03', 'Compartilhar Preocupações', 'Compartilhar preocupações com parceiro confiável', 'contramedida_sabotador', 1, 'semanal', 15, 2, '{"fundamentos": "TCC: Suporte social. Neurociência: Reduz isolamento", "objetivo": "Compartilhar carga de preocupação", "como_aplicar": "Compartilhe preocupações com alguém confiável (não guarde tudo)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_04', 'Celebrar Não-Catástrofes', 'Celebrar quando algo acontece sem "catástrofe"', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "TCC: Reestruturação cognitiva. Neurociência: Reduz catastrofização", "objetivo": "Reconhecer que preocupações não se concretizam", "como_aplicar": "Quando algo acontece sem catástrofe, celebre: \"Não deu errado como eu pensava\"", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_05', 'Pergunta de Controle', 'Perguntar: O que está sob meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Reduz preocupação excessiva", "objetivo": "Focar apenas no que pode controlar", "como_aplicar": "Quando surgir preocupação, pergunte: O que está sob meu controle aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_06', 'Teste de Realidade', 'Perguntar: Qual a probabilidade real disso acontecer?', 'contramedida_sabotador', 1, 'contextual', 3, 2, '{"fundamentos": "TCC: Questiona catastrofização. Neurociência: Reduz ansiedade", "objetivo": "Questionar probabilidade real de catástrofe", "como_aplicar": "Quando surgir preocupação, pergunte: Qual a probabilidade real disso acontecer?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_07', 'Respiração 4-7-8', '4 vezes ao dia, respirar 4s-7s-8s', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Relaxamento. Neurociência: Ativa sistema parassimpático", "objetivo": "Reduzir ansiedade física", "como_aplicar": "4x ao dia: Respirar 4s (inspirar) → 7s (segurar) → 8s (expirar). 4 ciclos", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_08', 'Registrar Não-Catástrofes', 'Listar 3 coisas que não deram errado', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reduz viés negativo. Neurociência: Fortalece memória positiva", "objetivo": "Reconhecer que coisas não dão errado", "como_aplicar": "Liste 3 coisas que você temia mas não deram errado", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_09', 'Prática de Confiança', 'Delegar 1 pequena tarefa sem verificar', 'contramedida_sabotador', 1, 'semanal', 5, 2, '{"fundamentos": "TCC: Reduz controle excessivo. Neurociência: Fortalece confiança", "objetivo": "Praticar confiar sem verificar", "como_aplicar": "Delegue 1 tarefa pequena e não verifique (confie)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true),
('contramedida_hiper_vigilante_10', 'Gratidão por Segurança', 'Agradecer por estar seguro agora', 'contramedida_sabotador', 1, 'diaria', 2, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reduz ansiedade futura", "objetivo": "Focar no presente seguro", "como_aplicar": "Agradeça por estar seguro agora (reduz ansiedade futura)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_vigilante', true)
ON CONFLICT (codigo) DO NOTHING;

-- HIPER-RACIONAL (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_hiper_racional_01', 'Conversas sem Objetivo', 'Separar tempo para conversas sem objetivo além da conexão', 'contramedida_sabotador', 1, 'semanal', 15, 2, '{"fundamentos": "TCC: Conexão emocional. Neurociência: Fortalece vínculos", "objetivo": "Criar espaço para conexão sem objetivo", "como_aplicar": "Tenha 1 conversa por semana sem objetivo além de conectar", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_02', 'Nomear Emoções', 'Praticar nomeação de emoções em tempo real', 'contramedida_sabotador', 1, 'diaria', 2, 1, '{"fundamentos": "TCC: Autoconsciência emocional. Neurociência: Fortalece regulação", "objetivo": "Aumentar consciência de emoções", "como_aplicar": "3x ao dia, pergunte: O que estou sentindo agora? Nomeie a emoção", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_03', 'Perguntar Antes de Resolver', 'Perguntar "o que você precisa de mim agora?" antes de propor solução', 'contramedida_sabotador', 1, 'contextual', 2, 2, '{"fundamentos": "TCC: Comunicação empática. Neurociência: Reduz impulsividade", "objetivo": "Ouvir antes de resolver", "como_aplicar": "Antes de propor solução, pergunte: O que você precisa de mim agora?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_04', 'Integrar Corpo e Mente', 'Práticas somáticas, arte, música', 'contramedida_sabotador', 1, 'diaria', 15, 2, '{"fundamentos": "TCC: Integração somática. Neurociência: Conecta corpo e mente", "objetivo": "Integrar experiência corporal com mental", "como_aplicar": "Faça 1 atividade corporal por dia (ex: alongamento, dança, arte) sem objetivo racional", "tipo": "ferramenta", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_05', 'Check-in Emocional', '3x ao dia, perguntar "O que estou sentindo agora?"', 'contramedida_sabotador', 1, 'diaria', 2, 1, '{"fundamentos": "TCC: Autoconsciência. Neurociência: Fortalece consciência emocional", "objetivo": "Manter conexão com emoções", "como_aplicar": "3x ao dia, pare e pergunte: O que estou sentindo agora?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_06', 'Pausa Antes de Resolver', 'Antes de propor solução, ouvir 2 minutos sem falar', 'contramedida_sabotador', 1, 'contextual', 2, 2, '{"fundamentos": "TCC: Escuta ativa. Neurociência: Reduz impulsividade", "objetivo": "Ouvir antes de resolver", "como_aplicar": "Antes de propor solução, ouça 2 minutos sem falar (apenas ouça)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_07', 'Prática Somática', '1 atividade corporal por dia sem objetivo', 'contramedida_sabotador', 1, 'diaria', 15, 2, '{"fundamentos": "TCC: Integração somática. Neurociência: Conecta corpo e mente", "objetivo": "Experienciar corpo sem análise", "como_aplicar": "Faça 1 atividade corporal (ex: alongamento, dança) sem objetivo racional", "tipo": "ferramenta", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_08', 'Validar Emoções', 'Quando alguém expressar emoção, dizer "Faz sentido você se sentir assim"', 'contramedida_sabotador', 1, 'contextual', 1, 2, '{"fundamentos": "TCC: Validação emocional. Neurociência: Fortalece conexão", "objetivo": "Validar emoções sem resolver", "como_aplicar": "Quando alguém expressar emoção, diga: Faz sentido você se sentir assim (não resolva)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_09', 'Reflexão sobre Controle', 'Perguntar: O que está sob meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Aceita que emoções não se controlam", "objetivo": "Aceitar que emoções não se controlam racionalmente", "como_aplicar": "Quando surgir emoção, pergunte: O que está sob meu controle aqui? (aceite emoção)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true),
('contramedida_hiper_racional_10', 'Gratidão por Conexão', 'Agradecer por 1 momento de conexão emocional', 'contramedida_sabotador', 1, 'diaria', 1, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reforça comportamento", "objetivo": "Reconhecer valor de conexão emocional", "como_aplicar": "Agradeça por 1 momento de conexão emocional (reforça comportamento)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'hiper_racional', true)
ON CONFLICT (codigo) DO NOTHING;

-- VÍTIMA (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_vitima_01', 'Registrar Vitórias e Escolhas', 'Registrar vitórias e escolhas corajosas diariamente', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Fortalece agência", "objetivo": "Reconhecer protagonismo próprio", "como_aplicar": "Registre 1 vitória e 1 escolha corajosa por dia", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_02', 'Linguagem de Responsabilidade', 'Adotar linguagem de responsabilidade ("eu escolho")', 'contramedida_sabotador', 1, 'diaria', 2, 2, '{"fundamentos": "TCC: Empoderamento. Neurociência: Fortalece senso de controle", "objetivo": "Assumir responsabilidade pelas escolhas", "como_aplicar": "Transforme \"Isso aconteceu comigo\" em \"Eu escolhi...\"", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_03', 'Buscar Apoio Terapêutico', 'Buscar apoio terapêutico para ressignificar traumas', 'contramedida_sabotador', 1, 'semanal', 60, 3, '{"fundamentos": "TCC: Processamento de trauma. Neurociência: Facilita ressignificação", "objetivo": "Processar traumas com apoio profissional", "como_aplicar": "Considere buscar apoio terapêutico para processar traumas", "tipo": "ferramenta", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_04', 'Gratidão Ativa e Serviço', 'Praticar gratidão ativa e serviço voluntário', 'contramedida_sabotador', 1, 'semanal', 30, 2, '{"fundamentos": "TCC: Ação orientada a valores. Neurociência: Fortalece senso de propósito", "objetivo": "Criar senso de propósito e contribuição", "como_aplicar": "Pratique gratidão ativa e considere serviço voluntário", "tipo": "ferramenta", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_05', 'Pergunta de Ação', 'Perguntar: O que está sob meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Foca no que pode mudar", "objetivo": "Focar no que pode fazer", "como_aplicar": "Quando surgir vitimização, pergunte: O que está sob meu controle aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_06', 'Reformular Narrativa', 'Transformar "Isso aconteceu comigo" em "Como posso responder?"', 'contramedida_sabotador', 1, 'contextual', 3, 2, '{"fundamentos": "TCC: Empoderamento. Neurociência: Fortalece agência", "objetivo": "Transformar passividade em ação", "como_aplicar": "Transforme narrativa de vítima em pergunta de ação: Como posso responder?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_07', 'Micro-ação Diária', 'Fazer 1 pequena ação que quebra padrão de passividade', 'contramedida_sabotador', 1, 'diaria', 5, 2, '{"fundamentos": "TCC: Quebra padrão. Neurociência: Fortalece agência", "objetivo": "Quebrar padrão de passividade", "como_aplicar": "Faça 1 pequena ação que quebra padrão de passividade", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_08', 'Registrar Escolhas', 'Listar 3 escolhas que fez hoje', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Reforça protagonismo", "objetivo": "Reconhecer que faz escolhas", "como_aplicar": "Liste 3 escolhas que fez hoje (reforça protagonismo)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_09', 'Gratidão por Capacidade', 'Agradecer por 1 capacidade própria', 'contramedida_sabotador', 1, 'diaria', 2, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reduz foco em limitações", "objetivo": "Reconhecer capacidades próprias", "como_aplicar": "Agradeça por 1 capacidade própria (reduz foco em limitações)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true),
('contramedida_vitima_10', 'Prática de Coragem', 'Fazer 1 coisa que gera medo leve mas é importante', 'contramedida_sabotador', 1, 'semanal', 10, 2, '{"fundamentos": "TCC: Exposição gradual. Neurociência: Fortalece confiança", "objetivo": "Fortalecer confiança através de ação", "como_aplicar": "Faça 1 coisa que gera medo leve mas é importante (fortalece confiança)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'vitima', true)
ON CONFLICT (codigo) DO NOTHING;

-- CONTROLADOR (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_controlador_01', 'Delegação Progressiva', 'Praticar delegação progressiva com confiança explícita', 'contramedida_sabotador', 1, 'semanal', 10, 2, '{"fundamentos": "TCC: Reduz controle excessivo. Neurociência: Fortalece confiança", "objetivo": "Praticar confiar em outros", "como_aplicar": "Delegue 1 tarefa progressivamente (comece pequena) e confie explicitamente", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_02', 'Perguntar Antes de Sugerir', 'Perguntar antes de sugerir ("como você faria?")', 'contramedida_sabotador', 1, 'contextual', 2, 2, '{"fundamentos": "TCC: Comunicação colaborativa. Neurociência: Reduz impulsividade", "objetivo": "Incluir outros na decisão", "como_aplicar": "Antes de sugerir, pergunte: Como você faria?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_03', 'Aceitar Ajuda', 'Aceitar ajuda e comunicar vulnerabilidades', 'contramedida_sabotador', 1, 'contextual', 5, 2, '{"fundamentos": "TCC: Vulnerabilidade. Neurociência: Reduz sobrecarga", "objetivo": "Reconhecer que não precisa controlar tudo", "como_aplicar": "Aceite ajuda quando oferecida e comunique 1 vulnerabilidade", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_04', 'Meditar ou Respirar', 'Meditar ou praticar respirações para desacelerar impulsos', 'contramedida_sabotador', 1, 'diaria', 5, 1, '{"fundamentos": "TCC: Relaxamento. Neurociência: Reduz impulsividade", "objetivo": "Desacelerar impulsos de controle", "como_aplicar": "Quando surgir impulso de controlar, pare e respire 5 vezes", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_05', 'Pergunta de Controle', 'Perguntar: O que está fora do meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Aceita incerteza", "objetivo": "Aceitar o que não pode controlar", "como_aplicar": "Quando surgir necessidade de controle, pergunte: O que está fora do meu controle aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_06', 'Pausa Antes de Decidir', 'Antes de tomar decisão, esperar 5 minutos', 'contramedida_sabotador', 1, 'contextual', 5, 2, '{"fundamentos": "TCC: Reduz impulsividade. Neurociência: Ativa córtex pré-frontal", "objetivo": "Reduzir decisões impulsivas", "como_aplicar": "Antes de tomar decisão, espere 5 minutos (reduz impulsividade)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_07', 'Prática de Confiança', 'Delegar 1 tarefa sem microgerenciar', 'contramedida_sabotador', 1, 'semanal', 5, 2, '{"fundamentos": "TCC: Reduz microgerenciamento. Neurociência: Fortalece confiança", "objetivo": "Praticar confiar sem verificar", "como_aplicar": "Delegue 1 tarefa e não microgerencie (confie)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_08', 'Reconhecer Ajuda Recebida', 'Agradecer por 1 ajuda que recebeu', 'contramedida_sabotador', 1, 'diaria', 1, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reduz necessidade de controle", "objetivo": "Reconhecer que outros ajudam", "como_aplicar": "Agradeça por 1 ajuda que recebeu (reduz necessidade de controle)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_09', 'Reflexão sobre Vulnerabilidade', 'Perguntar: O que acontece se eu não controlar isso?', 'contramedida_sabotador', 1, 'contextual', 3, 2, '{"fundamentos": "TCC: Questiona medo. Neurociência: Reduz ansiedade", "objetivo": "Questionar necessidade de controle", "como_aplicar": "Quando surgir necessidade de controle, pergunte: O que acontece se eu não controlar isso?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true),
('contramedida_controlador_10', 'Gratidão por Colaboração', 'Agradecer por 1 resultado alcançado em equipe', 'contramedida_sabotador', 1, 'semanal', 2, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reforça colaboração", "objetivo": "Reconhecer valor de colaboração", "como_aplicar": "Agradeça por 1 resultado alcançado em equipe (reforça colaboração)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'controlador', true)
ON CONFLICT (codigo) DO NOTHING;

-- ESQUIVO (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_esquivo_01', 'Pequenos Passos Diários', 'Definir pequenos passos diários para temas pendentes', 'contramedida_sabotador', 1, 'diaria', 5, 2, '{"fundamentos": "TCC: Quebra tarefas grandes. Neurociência: Reduz atrito", "objetivo": "Reduzir procrastinação", "como_aplicar": "Defina 1 pequeno passo diário para 1 tema pendente", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_02', 'Preparar Argumentos', 'Preparar argumentos por escrito antes de uma conversa difícil', 'contramedida_sabotador', 1, 'contextual', 10, 2, '{"fundamentos": "TCC: Preparação reduz ansiedade. Neurociência: Fortalece confiança", "objetivo": "Reduzir ansiedade em conversas difíceis", "como_aplicar": "Antes de conversa difícil, prepare argumentos por escrito", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_03', 'Recompensar-se', 'Recompensar-se após enfrentar desconforto', 'contramedida_sabotador', 1, 'contextual', 5, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Reforça comportamento", "objetivo": "Reforçar enfrentamento de desconforto", "como_aplicar": "Após enfrentar desconforto, recompense-se (ex: algo prazeroso)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_04', 'Comunicação Não-Violenta', 'Aprender técnicas de comunicação não-violenta', 'contramedida_sabotador', 1, 'semanal', 15, 2, '{"fundamentos": "TCC: Comunicação assertiva. Neurociência: Reduz medo de conflito", "objetivo": "Melhorar comunicação em situações difíceis", "como_aplicar": "Pratique comunicação não-violenta (observação, sentimento, necessidade, pedido)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_05', 'Micro-ação de Coragem', 'Fazer 1 coisa desconfortável por dia', 'contramedida_sabotador', 1, 'diaria', 5, 2, '{"fundamentos": "TCC: Exposição gradual. Neurociência: Fortalece capacidade", "objetivo": "Quebrar padrão de evitação", "como_aplicar": "Faça 1 coisa desconfortável por dia (fortalece capacidade)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_06', 'Pergunta de Ação', 'Perguntar: O que está sob meu controle aqui?', 'contramedida_sabotador', 1, 'contextual', 2, 1, '{"fundamentos": "Estoicismo: Dichotomia de controle. Neurociência: Foca no que pode fazer", "objetivo": "Focar no que pode fazer", "como_aplicar": "Quando surgir evitação, pergunte: O que está sob meu controle aqui?", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_07', 'Regra dos 2 Minutos', 'Se algo leva < 2 min, fazer imediatamente', 'contramedida_sabotador', 1, 'diaria', 2, 1, '{"fundamentos": "TCC: Reduz procrastinação. Neurociência: Reduz atrito", "objetivo": "Reduzir procrastinação", "como_aplicar": "Se algo leva menos de 2 minutos, faça imediatamente (não adie)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_08', 'Registrar Enfrentamentos', 'Listar 3 coisas que enfrentou hoje', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Reforça comportamento", "objetivo": "Reconhecer enfrentamentos", "como_aplicar": "Liste 3 coisas que enfrentou hoje (reforça comportamento)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_09', 'Gratidão por Coragem', 'Agradecer por ter enfrentado 1 desconforto', 'contramedida_sabotador', 1, 'diaria', 1, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reforça ação", "objetivo": "Reforçar enfrentamento de desconforto", "como_aplicar": "Agradeça por ter enfrentado 1 desconforto (reforça ação)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true),
('contramedida_esquivo_10', 'Prática de Posicionamento', 'Expressar 1 necessidade ou opinião por dia', 'contramedida_sabotador', 1, 'diaria', 3, 2, '{"fundamentos": "TCC: Assertividade. Neurociência: Fortalece confiança", "objetivo": "Fortalecer assertividade", "como_aplicar": "Expresse 1 necessidade ou opinião por dia (fortalece assertividade)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'esquivo', true)
ON CONFLICT (codigo) DO NOTHING;

-- INQUIETO (10 contramedidas)
INSERT INTO public.quests_catalogo (codigo, titulo, descricao, categoria, nivel_prioridade, tipo_recorrencia, tempo_estimado_min, dificuldade, base_cientifica, sabotador_id, ativo) VALUES
('contramedida_inquieto_01', 'Praticar Presença', 'Praticar presença (mindfulness, respiração)', 'contramedida_sabotador', 1, 'diaria', 5, 1, '{"fundamentos": "TCC: Mindfulness. Neurociência: Reduz inquietação", "objetivo": "Reduzir inquietação física e mental", "como_aplicar": "Pratique 5 min de mindfulness ou respiração por dia", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_02', 'Selecionar Poucas Metas', 'Selecionar poucas metas por trimestre e revisitar semanalmente', 'contramedida_sabotador', 1, 'semanal', 10, 2, '{"fundamentos": "TCC: Foco. Neurociência: Reduz dispersão", "objetivo": "Manter foco em poucas metas", "como_aplicar": "Selecione 2-3 metas por trimestre e revise semanalmente", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_03', 'Rituais de Celebração', 'Criar rituais de celebração ao concluir tarefas', 'contramedida_sabotador', 1, 'contextual', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Reforça conclusão", "objetivo": "Celebrar conclusões", "como_aplicar": "Ao concluir tarefa, celebre (ex: pausa, reconhecimento)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_04', 'Accountability', 'Construir accountability com parceiros confiáveis', 'contramedida_sabotador', 1, 'semanal', 15, 2, '{"fundamentos": "TCC: Suporte social. Neurociência: Fortalece comprometimento", "objetivo": "Manter comprometimento com metas", "como_aplicar": "Tenha 1 parceiro de accountability para revisar progresso semanalmente", "tipo": "ferramenta", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_05', 'Pausa de 3 Respirações', 'Antes de iniciar nova tarefa, respirar 3 vezes', 'contramedida_sabotador', 1, 'contextual', 1, 1, '{"fundamentos": "TCC: Reduz impulsividade. Neurociência: Ativa córtex pré-frontal", "objetivo": "Reduzir impulsividade", "como_aplicar": "Antes de iniciar nova tarefa, respire 3 vezes (reduz impulsividade)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_06', 'Regra do Não a Novidades', 'Dizer "não" para 1 oportunidade nova por dia', 'contramedida_sabotador', 1, 'diaria', 1, 2, '{"fundamentos": "TCC: Assertividade. Neurociência: Fortalece foco", "objetivo": "Manter foco em vez de dispersar", "como_aplicar": "Diga não para 1 oportunidade nova por dia (fortalece foco)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_07', 'Completar Antes de Começar', 'Terminar 1 tarefa antes de iniciar outra', 'contramedida_sabotador', 1, 'diaria', 5, 2, '{"fundamentos": "TCC: Reduz dispersão. Neurociência: Reforça conclusão", "objetivo": "Reduzir dispersão", "como_aplicar": "Termine 1 tarefa antes de iniciar outra (reduz dispersão)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_08', 'Registrar Conclusões', 'Listar 3 coisas que completou hoje', 'contramedida_sabotador', 1, 'diaria', 3, 1, '{"fundamentos": "TCC: Reforço positivo. Neurociência: Reforça conclusão", "objetivo": "Reconhecer conclusões", "como_aplicar": "Liste 3 coisas que completou hoje (reforça conclusão)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_09', 'Gratidão por Foco', 'Agradecer por ter focado em 1 coisa', 'contramedida_sabotador', 1, 'diaria', 1, 1, '{"fundamentos": "Estoicismo: Gratidão. Neurociência: Reforça comportamento", "objetivo": "Reforçar foco", "como_aplicar": "Agradeça por ter focado em 1 coisa (reforça comportamento)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true),
('contramedida_inquieto_10', 'Prática de Presença', '1 atividade por dia sem distrações (ex: comer sem celular)', 'contramedida_sabotador', 1, 'diaria', 15, 2, '{"fundamentos": "TCC: Mindfulness. Neurociência: Fortalece atenção", "objetivo": "Fortalecer atenção plena", "como_aplicar": "Faça 1 atividade por dia sem distrações (ex: comer sem celular)", "tipo": "tecnica", "links_referencias": []}'::jsonb, 'inquieto', true)
ON CONFLICT (codigo) DO NOTHING;

COMMIT;

-- =====================================================
-- RESUMO: 
-- - Quest custom: 1
-- - Essenciais: 1 (reflexao_diaria)
-- - Transformadoras: 2
-- - TCC: 10
-- - Estoicismo: 2
-- - Boas Práticas: 2
-- - Contramedidas: 100 (10 sabotadores × 10)
-- TOTAL: 118 quests no catálogo
-- =====================================================

