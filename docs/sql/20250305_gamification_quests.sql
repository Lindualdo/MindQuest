-- ============================================================
-- MindQuest - Tabelas de Suporte a Quests e Conquistas
-- Objetivo: externalizar regras hard-coded do fluxo sw_experts_gamification
-- ============================================================

-- Catalogo de quests padrão (desafios do sistema e diários)
DROP TABLE IF EXISTS public.usuarios_quest;
DROP TABLE IF EXISTS public.quest_catalog;

CREATE TABLE public.quest_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequencia bigint GENERATED ALWAYS AS IDENTITY,
  codigo varchar(64) NOT NULL UNIQUE,
  titulo varchar(120) NOT NULL,
  descricao text,
  categoria varchar(30) NOT NULL CHECK (categoria IN (
    'primeiros_passos',
    'consistencia',
    'profundidade',
    'engajamento',
    'diaria'
  )),
  tipo varchar(20) NOT NULL DEFAULT 'sistema' CHECK (tipo IN (
    'sistema',
    'diaria',
    'assistente'
  )),
  gatilho_tipo varchar(30) NOT NULL CHECK (gatilho_tipo IN (
    'total_conversas',
    'dias_consecutivos',
    'total_reflexoes',
    'manual',
    'diario'
  )),
  gatilho_valor integer,
  xp_recompensa integer NOT NULL DEFAULT 0 CHECK (xp_recompensa >= 0),
  repeticao varchar(20) NOT NULL DEFAULT 'unica' CHECK (repeticao IN (
    'unica',
    'recorrente',
    'diaria'
  )),
  ordem_inicial smallint,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamp without time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp without time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uq_quest_catalog_sequencia ON public.quest_catalog (sequencia);
CREATE INDEX idx_quest_catalog_categoria ON public.quest_catalog (categoria);
CREATE INDEX idx_quest_catalog_tipo ON public.quest_catalog (tipo);

-- Relação dos quests atribuídos para cada usuário
CREATE TABLE public.usuarios_quest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES public.quest_catalog(id) ON DELETE CASCADE,
  chat_id uuid REFERENCES public.usr_chat(id) ON DELETE SET NULL,
  status varchar(20) NOT NULL DEFAULT 'pendente' CHECK (status IN (
    'pendente',
    'ativa',
    'completa',
    'expirada',
    'arquivada'
  )),
  progresso_atual integer NOT NULL DEFAULT 0 CHECK (progresso_atual >= 0),
  progresso_meta integer,
  progresso_percentual integer NOT NULL DEFAULT 0 CHECK (progresso_percentual BETWEEN 0 AND 100),
  xp_concedido integer NOT NULL DEFAULT 0 CHECK (xp_concedido >= 0),
  referencia_data date,
  dados_extras jsonb,
  ativado_em timestamp without time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp without time zone NOT NULL DEFAULT now(),
  concluido_em timestamp without time zone
);

CREATE INDEX idx_usuarios_quest_usuario ON public.usuarios_quest (usuario_id);
CREATE INDEX idx_usuarios_quest_status ON public.usuarios_quest (status);
CREATE INDEX idx_usuarios_quest_quest ON public.usuarios_quest (quest_id);
CREATE INDEX idx_usuarios_quest_chat ON public.usuarios_quest (chat_id);

-- Garantir apenas uma instância ativa para quests não recorrentes
CREATE UNIQUE INDEX uq_usuarios_quest_unica ON public.usuarios_quest (usuario_id, quest_id)
WHERE referencia_data IS NULL;

-- Impede duplicidade da mesma quest diária no mesmo dia
CREATE UNIQUE INDEX uq_usuarios_quest_diaria ON public.usuarios_quest (usuario_id, quest_id, referencia_data)
WHERE referencia_data IS NOT NULL;

-- ============================================================
-- Carga inicial do catálogo de quests
-- ============================================================
INSERT INTO public.quest_catalog (
  codigo,
  titulo,
  descricao,
  categoria,
  tipo,
  gatilho_tipo,
  gatilho_valor,
  xp_recompensa,
  repeticao,
  ordem_inicial
)
VALUES
  (
    'primeira_conversa',
    'Quest: Primeira Conversa',
    'Complete a primeira conversa completa guiada pelo assistente e comece sua jornada.',
    'primeiros_passos',
    'sistema',
    'total_conversas',
    1,
    50,
    'unica',
    1
  ),
  (
    'streak_3_dias',
    'Quest: Streak 3 Dias',
    'Converse com o assistente por três dias consecutivos sem quebrar a sequência.',
    'consistencia',
    'sistema',
    'dias_consecutivos',
    3,
    150,
    'unica',
    2
  ),
  (
    'primeira_semana',
    'Quest: Semana Completa',
    'Realize sete conversas no total para fechar a primeira semana de prática.',
    'primeiros_passos',
    'sistema',
    'total_conversas',
    7,
    100,
    'unica',
    3
  ),
  (
    'streak_30_dias',
    'Quest: Streak 30 Dias',
    'Mantenha trinta dias seguidos de conversa ativa para consolidar o hábito.',
    'consistencia',
    'sistema',
    'dias_consecutivos',
    30,
    300,
    'unica',
    4
  ),
  (
    'primeira_reflexao',
    'Quest: Primeira Reflexão',
    'Registre a primeira reflexão profunda após a conversa com o assistente.',
    'primeiros_passos',
    'sistema',
    'total_reflexoes',
    1,
    50,
    'unica',
    5
  ),
  (
    'reflexao_profunda',
    'Quest: 10 Reflexões',
    'Some dez reflexões profundas registradas para avançar na jornada de autoconhecimento.',
    'profundidade',
    'sistema',
    'total_reflexoes',
    10,
    200,
    'unica',
    6
  ),
  (
    'daily_reflexao_profunda',
    'Daily: Reflexão Profunda',
    'No check-in de hoje, conclua a conversa com uma reflexão detalhada sobre o dia.',
    'diaria',
    'diaria',
    'diario',
    NULL,
    30,
    'diaria',
    101
  ),
  (
    'daily_sentimentos',
    'Daily: Sentimentos do Dia',
    'Compartilhe como está se sentindo agora e qual foi a principal fonte de energia do dia.',
    'diaria',
    'diaria',
    'diario',
    NULL,
    30,
    'diaria',
    102
  ),
  (
    'daily_pequena_vitoria',
    'Daily: Pequena Vitória',
    'Descreva uma pequena vitória conquistada hoje, mesmo que pareça simples.',
    'diaria',
    'diaria',
    'diario',
    NULL,
    30,
    'diaria',
    103
  ),
  (
    'daily_emocao',
    'Daily: Emoção em Foco',
    'Identifique uma emoção sentida hoje e explique rapidamente o que a despertou.',
    'diaria',
    'diaria',
    'diario',
    NULL,
    30,
    'diaria',
    104
  )
ON CONFLICT (codigo) DO UPDATE
SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  categoria = EXCLUDED.categoria,
  tipo = EXCLUDED.tipo,
  gatilho_tipo = EXCLUDED.gatilho_tipo,
  gatilho_valor = EXCLUDED.gatilho_valor,
  xp_recompensa = EXCLUDED.xp_recompensa,
  repeticao = EXCLUDED.repeticao,
  ordem_inicial = EXCLUDED.ordem_inicial,
  ativo = TRUE,
  atualizado_em = now();
