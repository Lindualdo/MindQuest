-- =====================================================
-- Inserir Quests Faltantes no Catálogo
-- Data: 2025-01-22
-- Baseado em: docs/espec/quests/faltantes/
-- =====================================================

BEGIN;

-- =====================================================
-- 1. TCC - Treinamento de Habilidades Sociais
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade, 
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'tcc_habilidades_sociais',
    'Treinamento de Habilidades Sociais - Preparação',
    'Preparar-se para interações sociais importantes definindo objetivos claros e visualizando interações positivas',
    'tcc',
    3,
    'eventual',
    5,
    2,
    '{
        "tipo": "tecnica",
        "objetivo": "Reduz ansiedade social e aumentar confiança em interações através de preparação estruturada",
        "fundamentos": "TCC: Técnica de preparação e ensaio comportamental. Neurociência: Reduz ativação da amígdala (medo social), fortalece córtex pré-frontal (planejamento), cria sensação de preparação que reduz ansiedade antecipatória",
        "como_aplicar": "Antes de interação social importante:\n1. Definir 1 objetivo claro (ex: \"ouvir mais\", \"expressar opinião\", \"fazer pergunta específica\")\n2. Preparar 1 frase de abertura ou resposta\n3. Visualizar interação positiva (imaginando sucesso)\n4. Durante a interação, lembrar do objetivo definido\n5. Após a interação, reconhecer o que funcionou bem",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 2. ESSENCIAL - Pausa de Consciência (Mindfulness Prático)
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'pausa_consciencia_mindfulness',
    'Pausa de Consciência - Mindfulness Prático',
    'Fazer 3 pausas de 1 minuto ao longo do dia para respirar conscientemente e observar pensamentos/emoções sem julgar',
    'essencial',
    1,
    'diaria',
    3,
    1,
    '{
        "tipo": "tecnica",
        "objetivo": "Reduzir reatividade emocional e fortalecer atenção plena criando espaço entre estímulo e resposta",
        "fundamentos": "Neurociência: Reduz ativação da amígdala, fortalece córtex cingulado anterior (regulação emocional), aumenta densidade de massa cinzenta (estudos de meditação). Estoicismo: Prática de atenção plena, foco no presente, cultiva virtude da sabedoria",
        "como_aplicar": "Ao longo do dia, fazer 3 pausas de 1 minuto:\n1. Parar completamente (físico e mental)\n2. Respirar conscientemente (3-4 respirações profundas)\n3. Observar pensamentos e emoções sem julgar (apenas notar)\n4. Retornar ao presente com maior consciência\n\nSugestão de horários: manhã (após acordar), meio-dia (antes do almoço), noite (antes de dormir)",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 3. ESSENCIAL - Ação Imediata em Pequenos Passos
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'acao_imediata_pequenos_passos',
    'Ação Imediata em Pequenos Passos',
    'Identificar 1 tarefa importante adiada e fazer apenas o primeiro passo (2-5 minutos) para criar momentum e evitar procrastinação',
    'essencial',
    1,
    'diaria',
    5,
    1,
    '{
        "tipo": "tecnica",
        "objetivo": "Reduzir procrastinação e criar momentum através de ação imediata em pequenos passos",
        "fundamentos": "Neurociência: Reduz ativação de áreas de conflito (evitar vs fazer), cria momentum dopaminérgico, fortalece intenção de implementação. Estoicismo: Prática de ação imediata, cultiva virtude da coragem (agir apesar da resistência)",
        "como_aplicar": "1. Identificar 1 tarefa importante que foi adiada\n2. Dividir em menor passo possível (ex: \"escrever 1 parágrafo\" em vez de \"escrever artigo completo\")\n3. Fazer apenas esse primeiro passo (2-5 minutos)\n4. Reconhecer o progresso (mesmo que pequeno)\n5. Se quiser continuar, ótimo; se não, já teve progresso\n\nExemplos:\n- \"Ligar para X\" → \"Enviar mensagem para X\"\n- \"Fazer exercício completo\" → \"Fazer 5 minutos de alongamento\"\n- \"Limpar casa toda\" → \"Organizar 1 gaveta\"",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 4. BOA PRÁTICA - Alimentação Consciente
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_alimentacao_consciente',
    'Alimentação Consciente - 1 Escolha Nutritiva',
    'Fazer 1 escolha alimentar consciente por dia para melhorar bem-estar físico e clareza mental',
    'boa_pratica_geral',
    3,
    'diaria',
    2,
    1,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Melhorar função cognitiva, regular humor e aumentar energia através de escolhas alimentares conscientes",
        "fundamentos": "Neurociência: Melhora função cognitiva, regula humor (serotonina), aumenta energia sustentável. Nutrição: Alimentos ricos em nutrientes melhoram função cerebral e bem-estar geral",
        "como_aplicar": "Ao longo do dia, fazer 1 escolha alimentar consciente:\n\nExemplos:\n- Adicionar 1 fruta à refeição\n- Beber 1 copo de água extra\n- Comer 1 refeição sem distrações (celular, TV)\n- Escolher opção mais nutritiva entre alternativas\n- Adicionar 1 vegetal ao prato\n\nFoco: consciência na escolha, não em perfeição",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 5. BOA PRÁTICA - Rotina de Sono
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_rotina_sono',
    'Rotina de Sono - Ritual Pré-Sono',
    'Criar ritual relaxante 30 minutos antes de dormir para melhorar qualidade do sono',
    'boa_pratica_geral',
    2,
    'diaria',
    30,
    2,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Melhorar qualidade do sono, regular ritmo circadiano e facilitar consolidação de memória",
        "fundamentos": "Neurociência: Melhora qualidade do sono, regula ritmo circadiano, facilita consolidação de memória. Sono: Rotinas pré-sono sinalizam ao cérebro que é hora de descansar, reduzindo tempo para adormecer",
        "como_aplicar": "30 minutos antes de dormir:\n\n1. Desligar telas (celular, TV, computador)\n2. Fazer 1 atividade relaxante:\n   - Ler livro físico\n   - Fazer alongamento suave\n   - Respirar conscientemente (4-7-8)\n   - Escrever gratidão ou reflexão\n   - Tomar banho quente\n   - Ouvir música calma\n\n3. Criar ambiente adequado:\n   - Luz ambiente baixa\n   - Temperatura confortável\n   - Silêncio ou som ambiente suave",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 6. BOA PRÁTICA - Hobbies e Interesses
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_hobbies_interesses',
    'Hobbies e Interesses - Tempo de Prazer',
    'Dedicar 15 minutos por dia a 1 atividade prazerosa sem objetivo produtivo para melhorar bem-estar emocional',
    'boa_pratica_geral',
    3,
    'diaria',
    15,
    1,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Ativar sistema de recompensa, reduzir estresse e aumentar criatividade através de atividades prazerosas",
        "fundamentos": "Neurociência: Ativa sistema de recompensa (dopamina), reduz estresse (cortisol), aumenta criatividade. Psicologia positiva: Atividades prazerosas aumentam bem-estar e satisfação de vida",
        "como_aplicar": "Todos os dias, dedicar 15 minutos a 1 atividade prazerosa SEM objetivo produtivo:\n\nExemplos:\n- Ler livro por prazer (não para aprendizado)\n- Desenhar ou pintar\n- Tocar instrumento musical\n- Cozinhar receita nova\n- Jardinagem\n- Trabalhos manuais\n- Dançar livremente\n- Fazer artesanato\n\nRegra: sem meta, sem performance, apenas prazer",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 7. BOA PRÁTICA - Gratidão Específica
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_gratidao_especifica',
    'Gratidão Específica - 3 Coisas',
    'Listar 3 coisas específicas pelas quais é grato ao final do dia para melhorar humor e reduzir viés de negatividade',
    'boa_pratica_geral',
    2,
    'diaria',
    5,
    1,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Ativar sistema de recompensa, reduzir viés de negatividade e fortalecer memória positiva",
        "fundamentos": "Neurociência: Ativa sistema de recompensa (dopamina), reduz viés de negatividade, fortalece memória positiva. Psicologia positiva: Prática de gratidão correlaciona com maior satisfação de vida e menor depressão",
        "como_aplicar": "Ao final do dia, listar 3 coisas específicas pelas quais é grato:\n\nFormato: \"Gratidão por X porque Y\"\n\nExemplos:\n- \"Gratidão por ter tido uma conversa significativa com João porque me fez sentir compreendido\"\n- \"Gratidão por ter concluído o relatório porque reduziu minha ansiedade\"\n- \"Gratidão por ter caminhado no parque porque me deu energia\"\n\nEvitar genéricos como \"gratidão pela família\" - ser específico sobre o momento ou ação",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 8. BOA PRÁTICA - Limpeza e Organização
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_limpeza_organizacao',
    'Limpeza e Organização - Micro-Ambiente',
    'Organizar 1 pequena área por dia para reduzir sobrecarga cognitiva e criar sensação de controle',
    'boa_pratica_geral',
    3,
    'diaria',
    10,
    1,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Reduzir sobrecarga cognitiva, criar sensação de controle e melhorar foco através de organização de micro-ambientes",
        "fundamentos": "Neurociência: Reduz sobrecarga cognitiva (menos distrações visuais), cria sensação de controle, melhora foco. Psicologia ambiental: Ambientes organizados reduzem ansiedade e aumentam produtividade",
        "como_aplicar": "Todos os dias, organizar 1 pequena área (5-10 minutos):\n\nExemplos:\n- Mesa de trabalho (arrumar itens, descartar lixo)\n- 1 gaveta\n- 1 prateleira\n- Área da cozinha (balcão)\n- Cabeceira da cama\n- Escrivaninha\n\nFoco: 1 área pequena por dia, não tudo de uma vez. Pequenas ações consistentes criam mudança duradoura",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 9. BOA PRÁTICA - Aprendizado Contínuo
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_aprendizado_continuo',
    'Aprendizado Contínuo - Micro-Aprendizado',
    'Aprender 1 coisa nova por dia focando em curiosidade para fortalecer neuroplasticidade',
    'boa_pratica_geral',
    3,
    'diaria',
    15,
    1,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Fortalecer neuroplasticidade, criar novos caminhos neurais e aumentar senso de crescimento",
        "fundamentos": "Neurociência: Fortalece neuroplasticidade, cria novos caminhos neurais, aumenta confiança. Aprendizado: Curiosidade motiva aprendizado contínuo, mantém cérebro ativo",
        "como_aplicar": "Todos os dias, aprender 1 coisa nova (10-15 minutos):\n\nExemplos:\n- Ler 1 artigo interessante\n- Assistir 1 vídeo educativo (curso, documentário)\n- Praticar 1 habilidade nova (idioma, instrumento, técnica)\n- Explorar 1 conceito novo (filosofia, ciência, arte)\n- Fazer 1 experimento prático\n\nFoco: curiosidade e exploração, não performance ou domínio completo",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 10. BOA PRÁTICA - Limites e Assertividade
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_limites_assertividade',
    'Limites e Assertividade - 1 \"Não\"',
    'Dizer \"não\" para 1 pedido/convite por dia (quando apropriado) para fortalecer autoconfiança e reduzir sobrecarga',
    'boa_pratica_geral',
    2,
    'diaria',
    2,
    2,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Reduzir sobrecarga, fortalecer autoconfiança e criar sensação de controle através de limites assertivos",
        "fundamentos": "Neurociência: Reduz sobrecarga (cortisol), fortalece autoconfiança, cria sensação de controle. Psicologia: Assertividade melhora relacionamentos e reduz estresse",
        "como_aplicar": "Todos os dias, quando apropriado, dizer \"não\" para 1 pedido ou convite:\n\nComo comunicar:\n- Forma clara e respeitosa\n- Explicação breve (opcional)\n- Alternativa (se possível): \"Não posso agora, mas podemos agendar para...\"\n\nExemplos:\n- \"Não, obrigado pelo convite\"\n- \"Não posso ajudar com isso agora\"\n- \"Não tenho disponibilidade para essa reunião\"\n\nImportante: Aprender a dizer não sem culpa, reconhecendo seus próprios limites",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- 11. BOA PRÁTICA - Reflexão Semanal
-- =====================================================

INSERT INTO public.quests_catalogo (
    codigo, titulo, descricao, categoria, nivel_prioridade,
    tipo_recorrencia, tempo_estimado_min, dificuldade,
    base_cientifica, instrucoes, ativo, xp
) VALUES (
    'boa_pratica_reflexao_semanal',
    'Reflexão Semanal - Review',
    'Refletir ao final da semana sobre o que funcionou, o que foi aprendido e o que ajustar para melhorar progresso contínuo',
    'boa_pratica_geral',
    2,
    'semanal',
    15,
    2,
    '{
        "tipo": "boa_pratica",
        "objetivo": "Fortalecer memória de longo prazo, criar padrão de aprendizado e facilitar ajustes comportamentais",
        "fundamentos": "Neurociência: Fortalece memória de longo prazo, cria padrão de aprendizado, facilita ajustes comportamentais. Aprendizado: Reflexão metacognitiva melhora performance e progresso contínuo",
        "como_aplicar": "Ao final da semana (sugestão: domingo), refletir por 10-15 minutos:\n\n1. O que funcionou bem?\n   - Quais ações trouxeram resultados positivos?\n   - Quais hábitos foram mantidos?\n   - O que gerou bem-estar?\n\n2. O que aprendi?\n   - Quais insights ou lições esta semana trouxe?\n   - Quais padrões identifiquei?\n   - O que descobri sobre mim?\n\n3. O que ajustar na próxima semana?\n   - O que não funcionou e precisa mudar?\n   - Quais pequenos ajustes posso fazer?\n   - Quais prioridades ajustar?\n\nRegistrar brevemente (escrever ajuda a consolidar)",
        "links_referencias": []
    }'::jsonb,
    '{}'::jsonb,
    true,
    10
) ON CONFLICT (codigo) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    descricao = EXCLUDED.descricao,
    base_cientifica = EXCLUDED.base_cientifica,
    tempo_estimado_min = EXCLUDED.tempo_estimado_min,
    dificuldade = EXCLUDED.dificuldade,
    atualizado_em = NOW();

-- =====================================================
-- Verificação e Resumo
-- =====================================================

-- Mostrar quantas quests foram inseridas/atualizadas
SELECT 
    categoria,
    COUNT(*) as total,
    STRING_AGG(codigo, ', ' ORDER BY codigo) as codigos
FROM public.quests_catalogo
WHERE codigo IN (
    'tcc_habilidades_sociais',
    'pausa_consciencia_mindfulness',
    'acao_imediata_pequenos_passos',
    'boa_pratica_alimentacao_consciente',
    'boa_pratica_rotina_sono',
    'boa_pratica_hobbies_interesses',
    'boa_pratica_gratidao_especifica',
    'boa_pratica_limpeza_organizacao',
    'boa_pratica_aprendizado_continuo',
    'boa_pratica_limites_assertividade',
    'boa_pratica_reflexao_semanal'
)
GROUP BY categoria
ORDER BY categoria;

COMMIT;

-- =====================================================
-- Fim do script
-- =====================================================

