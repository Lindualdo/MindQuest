BEGIN;

-- Remove versões anteriores (antigo nome sem _catalogo)
DROP TABLE IF EXISTS public.areas_vida CASCADE;
DROP TABLE IF EXISTS public.areas_vida_catalogo CASCADE;

CREATE TABLE public.areas_vida_catalogo (
    id uuid PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,
    descricao text,
    ativo boolean NOT NULL DEFAULT true,
    criado_em timestamptz NOT NULL DEFAULT NOW(),
    atualizado_em timestamptz NOT NULL DEFAULT NOW()
);

INSERT INTO public.areas_vida_catalogo (id, codigo, nome, descricao, ativo)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'saude', 'Saúde', 'Bem-estar físico, mental e emocional.', true),
    ('22222222-2222-4222-8222-222222222222', 'trabalho', 'Trabalho', 'Carreira, desempenho profissional e aprendizado técnico.', true),
    ('33333333-3333-4333-8333-333333333333', 'financas', 'Finanças', 'Organização financeira, investimentos e segurança econômica.', true),
    ('44444444-4444-4444-8444-444444444444', 'espiritualidade', 'Espiritualidade', 'Propósito, valores e conexão espiritual.', true),
    ('55555555-5555-4555-8555-555555555555', 'familia', 'Família', 'Dinâmica familiar e responsabilidades domésticas.', true),
    ('66666666-6666-4666-8666-666666666666', 'relacionamentos', 'Relacionamentos', 'Vínculos amorosos e amizades profundas.', true),
    ('77777777-7777-4777-8777-777777777777', 'laser', 'Lazer', 'Tempo livre, hobbies e prazer pessoal.', true),
    ('88888888-8888-4888-8888-888888888888', 'evolucao', 'Evolução', 'Autoconhecimento, educação contínua e expansão mental/cultural.', true)
ON CONFLICT (codigo) DO UPDATE
SET
    nome        = EXCLUDED.nome,
    descricao   = EXCLUDED.descricao,
    ativo       = EXCLUDED.ativo,
    atualizado_em = NOW();

COMMIT;
