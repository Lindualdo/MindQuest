-- ============================================================
-- MindQuest - Tabelas de Suporte a Quests e Conquistas
-- Objetivo: externalizar regras hard-coded do fluxo sw_experts_gamification
-- ============================================================

-- Catalogo de quests padrão (desafios do sistema e diários)
CREATE TABLE public.quest_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    'sistema',        -- quests globais definidos pelo produto
    'diaria',         -- quests diárias rotativas
    'assistente'      -- quests criadas dinamicamente pelo assistente/IA
  )),
  gatilho_tipo varchar(30) NOT NULL CHECK (gatilho_tipo IN (
    'total_conversas',   -- baseado no total de conversas acumuladas
    'dias_consecutivos', -- streak de conversas
    'total_reflexoes',   -- total de reflexões completadas
    'manual',            -- dispara via fluxo externo
    'diario'             -- reaplicado por intervalo (ex.: quests diárias)
  )),
  gatilho_valor integer,
  xp_recompensa integer NOT NULL DEFAULT 0 CHECK (xp_recompensa >= 0),
  repeticao varchar(20) NOT NULL DEFAULT 'unica' CHECK (repeticao IN (
    'unica',       -- só pode ser concluída uma vez por usuário
    'recorrente',  -- pode reabrir conforme regra (ex.: semanal)
    'diaria'       -- instâncias por dia
  )),
  ordem_inicial smallint,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamp without time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp without time zone NOT NULL DEFAULT now()
);

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
    'Primeira Semente',
    'Complete sua primeira conversa guiada com o assistente.',
    'primeiros_passos',
    'sistema',
    'total_conversas',
    1,
    50,
    'unica',
    1
  ),
  (
    'primeira_semana',
    'Semana Completa',
    'Conclua sete conversas para completar a primeira semana de prática.',
    'primeiros_passos',
    'sistema',
    'total_conversas',
    7,
    100,
    'unica',
    2
  ),
  (
    'streak_7_dias',
    'Chama Acesa',
    'Mantenha um streak de sete dias conversando com o assistente sem pular dias.',
    'consistencia',
    'sistema',
    'dias_consecutivos',
    7,
    150,
    'unica',
    3
  ),
  (
    'streak_30_dias',
    'Consistência Bronze',
    'Sustente trinta dias consecutivos de conversas para consolidar sua rotina.',
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
    'Pensador',
    'Registre sua primeira reflexão profunda após uma conversa.',
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
    'Reflexão Profunda',
    'Acumule dez reflexões para evoluir na jornada de autoconhecimento.',
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
    'Diária · Reflexão Profunda',
    'Complete sua conversa diária e faça uma reflexão profunda sobre seu dia.',
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
    'Diária · Sentimentos de Hoje',
    'Compartilhe como você está se sentindo hoje e o que te trouxe energia.',
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
    'Diária · Vitória do Dia',
    'Reflita sobre uma pequena vitória de hoje, por menor que pareça.',
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
    'Diária · Emoção em Foco',
    'Identifique uma emoção que sentiu hoje e explore o que a causou.',
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
