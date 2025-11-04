-- Reset total das estruturas de gamificação
-- Este script elimina as tabelas relevantes e recria conforme a nova especificação.

DROP TABLE IF EXISTS public.usuarios_quest CASCADE;
DROP TABLE IF EXISTS public.quest_catalogo CASCADE;
DROP TABLE IF EXISTS public.gamificacao CASCADE;

CREATE TABLE public.quest_catalogo (
  id UUID PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('habit_core', 'habit_deep', 'habit_daily', 'onboarding', 'event')),
  tipo TEXT NOT NULL CHECK (tipo IN ('sistema', 'personalizada', 'eventual')),
  gatilho_tipo TEXT NOT NULL,
  gatilho_valor INTEGER,
  xp_recompensa INTEGER NOT NULL DEFAULT 0,
  repeticao TEXT NOT NULL DEFAULT 'unica',
  ordem_inicial INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  config JSONB,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.usuarios_quest (
  id UUID PRIMARY KEY,
  usuario_id UUID NOT NULL,
  quest_id UUID NOT NULL REFERENCES public.quest_catalogo (id) ON DELETE CASCADE,
  meta_codigo TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ativa', 'pendente', 'completa', 'cancelada', 'reiniciada', 'expirada')),
  progresso_atual INTEGER NOT NULL DEFAULT 0,
  progresso_meta INTEGER NOT NULL,
  progresso_percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  tentativas INTEGER NOT NULL DEFAULT 1,
  xp_concedido INTEGER NOT NULL DEFAULT 0,
  janela_inicio TIMESTAMPTZ,
  janela_fim TIMESTAMPTZ,
  contexto_origem TEXT,
  referencia_data TIMESTAMPTZ,
  reiniciada_em TIMESTAMPTZ,
  dados_extras JSONB,
  ativado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  concluido_em TIMESTAMPTZ,
  insight_id UUID,
  insight_tipo TEXT
);

CREATE INDEX usuarios_quest_usuario_idx ON public.usuarios_quest (usuario_id);
CREATE INDEX usuarios_quest_status_idx ON public.usuarios_quest (status);
CREATE INDEX usuarios_quest_janela_idx ON public.usuarios_quest (janela_inicio, janela_fim);
CREATE UNIQUE INDEX usuarios_quest_unique_meta_idx
  ON public.usuarios_quest (usuario_id, meta_codigo)
  WHERE status IN ('ativa', 'pendente');

CREATE TABLE public.gamificacao (
  id UUID PRIMARY KEY,
  usuario_id UUID NOT NULL UNIQUE,
  xp_total INTEGER NOT NULL DEFAULT 0,
  xp_proximo_nivel INTEGER NOT NULL DEFAULT 0,
  nivel_atual INTEGER NOT NULL DEFAULT 1,
  titulo_nivel TEXT,
  streak_conversas_dias INTEGER NOT NULL DEFAULT 0,
  melhor_streak INTEGER NOT NULL DEFAULT 0,
  streak_meta_atual TEXT NOT NULL,
  streak_meta_proximo TEXT,
  streak_meta_status JSONB,
  streak_protecao_usada BOOLEAN NOT NULL DEFAULT FALSE,
  streak_protecao_resetada_em TIMESTAMPTZ,
  total_conversas INTEGER NOT NULL DEFAULT 0,
  total_reflexoes INTEGER NOT NULL DEFAULT 0,
  total_xp_ganho_hoje INTEGER NOT NULL DEFAULT 0,
  quest_diaria_status TEXT,
  quest_diaria_progresso NUMERIC(5,2),
  quest_diaria_descricao TEXT,
  quest_diaria_data TIMESTAMPTZ,
  quest_streak_dias INTEGER NOT NULL DEFAULT 0,
  habitos_ativos JSONB,
  conquistas_desbloqueadas JSONB,
  ultima_conquista_id UUID,
  ultima_conquista_data TIMESTAMPTZ,
  ultima_conversa_data TIMESTAMPTZ,
  ultima_atualizacao TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX gamificacao_usuario_idx ON public.gamificacao (usuario_id);
CREATE INDEX gamificacao_meta_idx ON public.gamificacao (streak_meta_atual);
