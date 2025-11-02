-- ============================================================
-- MindQuest - Ajustes de Gamificação (Níveis e Insights)
-- Este script deve ser executado após as migrações iniciais
-- 1) Cria a tabela pública gamificacao_niveis
-- 2) Adiciona suporte a insights na tabela usuarios_quest
-- ============================================================

-- ------------------------------------------------------------
-- Tabela de níveis de gamificação
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gamificacao_niveis (
  nivel integer PRIMARY KEY,
  xp_minimo integer NOT NULL CHECK (xp_minimo >= 0),
  xp_proximo_nivel integer CHECK (
    xp_proximo_nivel IS NULL OR xp_proximo_nivel > xp_minimo
  ),
  titulo varchar(60) NOT NULL,
  descricao text,
  criado_em timestamp without time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp without time zone NOT NULL DEFAULT now()
);

INSERT INTO public.gamificacao_niveis (nivel, xp_minimo, xp_proximo_nivel, titulo, descricao)
VALUES
  (1,    0,   200,  'Explorador',    'Início da jornada de autoconhecimento.'),
  (2,  200,   550,  'Aprendiz',      'Estabelece o hábito e começa a aplicar aprendizados.'),
  (3,  550,  1050,  'Observador',    'Reconhece padrões e responde com consciência.'),
  (4, 1050,  1700,  'Focado',        'Mantém consistência e amplia a profundidade das reflexões.'),
  (5, 1700,  2500,  'Praticante',    'Transforma insights em ações práticas no dia a dia.'),
  (6, 2500,  3450,  'Consciente',    'Demonstra autoconsciência contínua e resiliente.'),
  (7, 3450,  4550,  'Iluminado',     'Consolida rotinas sólidas e inspira evolução.'),
  (8, 4550,  5800,  'Sábio',         'Integra emoções e ações com equilíbrio.'),
  (9, 5800,  7200,  'Ascendente',    'Eleva a prática a um novo patamar de consistência.'),
  (10,7200,  9000,  'Mestre',        'Domina a jornada e serve de referência.'),
  (11,9000, 12000,  'Mentor',        'Compartilha aprendizados e amplia impacto.'),
  (12,12000,15000,  'Guardião',      'Protege hábitos saudáveis e permanece atento.'),
  (13,15000,20000,  'Visionário',    'Projeta novos horizontes com clareza e coragem.'),
  (14,20000,26000,  'Arquiteto',     'Desenha a própria evolução com propósito.'),
  (15,26000, NULL,  'Transcendente', 'Mantém equilíbrio pleno e busca evolução contínua.')
ON CONFLICT (nivel) DO UPDATE
SET
  xp_minimo = EXCLUDED.xp_minimo,
  xp_proximo_nivel = EXCLUDED.xp_proximo_nivel,
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  atualizado_em = now();

-- ------------------------------------------------------------
-- Suporte a quests derivadas de insights
-- ------------------------------------------------------------
ALTER TABLE public.usuarios_quest
  ADD COLUMN IF NOT EXISTS insight_id uuid REFERENCES public.insights(id) ON DELETE SET NULL;

ALTER TABLE public.usuarios_quest
  ADD COLUMN IF NOT EXISTS insight_tipo varchar(20)
    CHECK (insight_tipo IN ('usuario', 'assistente'));

CREATE INDEX IF NOT EXISTS idx_usuarios_quest_insight
  ON public.usuarios_quest (insight_id);

-- Sugestão operacional (não automatizada aqui):
-- quests criadas a partir de insights devem popular xp_recompensa com valores superiores
-- aos desafios padrão. Enquanto não houver regra dinâmica, recomenda-se:
--   insight_tipo = 'usuario'    -> 250 XP
--   insight_tipo = 'assistente' -> 300 XP
