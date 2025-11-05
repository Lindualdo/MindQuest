# Especificação Técnica · Sistema de Quests MindQuest

## Visão geral

- Banco: PostgreSQL.
- Schema padrão `public`.
- Todas as tabelas usam UUID (`gen_random_uuid()`) como chave primária, exceto `quest_niveis` (chave natural `nivel`).
- Status e tipos são restritos via `CHECK` para evitar valores fora da especificação funcional.
- Timestamps padronizados (`criado_em`, `atualizado_em`) com `DEFAULT now()`.

## Tabelas

### `quest_modelos`

Catálogo das quests disponíveis.

```sql
CREATE TABLE public.quest_modelos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo varchar(64) NOT NULL UNIQUE,
    titulo varchar(120) NOT NULL,
    descricao text,
    tipo varchar(20) NOT NULL, -- sequencia | personalizada
    gatilho_codigo varchar(30) NOT NULL, -- conversas_consecutivas | conversas_totais | insight | manual
    gatilho_valor integer,
    xp_recompensa integer DEFAULT 0 NOT NULL,
    repeticao varchar(20) DEFAULT 'unica' NOT NULL, -- unica | recorrente
    ordem_inicial smallint,
    ativo boolean DEFAULT true NOT NULL,
    config jsonb DEFAULT '{}'::jsonb,
    criado_em timestamp DEFAULT now() NOT NULL,
    atualizado_em timestamp DEFAULT now() NOT NULL,
    CONSTRAINT quest_modelos_tipo_check CHECK (tipo IN ('sequencia', 'personalizada')),
    CONSTRAINT quest_modelos_gatilho_check CHECK (gatilho_codigo IN ('conversas_consecutivas', 'conversas_totais', 'insight', 'manual')),
    CONSTRAINT quest_modelos_repeticao_check CHECK (repeticao IN ('unica', 'recorrente')),
    CONSTRAINT quest_modelos_xp_check CHECK (xp_recompensa >= 0)
);
```

Índices recomendados:

```sql
CREATE INDEX idx_quest_modelos_tipo ON public.quest_modelos (tipo);
CREATE INDEX idx_quest_modelos_ativo ON public.quest_modelos (ativo) WHERE ativo = true;
```

### `quest_instancias`

Instâncias por usuário.

```sql
CREATE TABLE public.quest_instancias (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id uuid NOT NULL,
    modelo_id uuid NOT NULL REFERENCES public.quest_modelos(id),
    meta_codigo varchar(64),
    status varchar(20) NOT NULL DEFAULT 'pendente',
    progresso_atual integer DEFAULT 0 NOT NULL,
    progresso_meta integer,
    progresso_percentual integer DEFAULT 0 NOT NULL,
    xp_concedido integer DEFAULT 0 NOT NULL,
    tentativas integer DEFAULT 0 NOT NULL,
    janela_inicio date,
    janela_fim date,
    contexto_origem text,
    referencia_data date,
    reiniciada_em timestamp,
    ativado_em timestamp DEFAULT now() NOT NULL,
    atualizado_em timestamp DEFAULT now() NOT NULL,
    concluido_em timestamp,
    cancelado_em timestamp,
    CONSTRAINT quest_instancias_status_check CHECK (status IN ('pendente','ativa','concluida','vencida','cancelada','reiniciada')),
    CONSTRAINT quest_instancias_progresso_check CHECK (progresso_atual >= 0 AND progresso_percentual BETWEEN 0 AND 100),
    CONSTRAINT quest_instancias_xp_check CHECK (xp_concedido >= 0)
);
```

Índices:

```sql
CREATE INDEX idx_quest_instancias_usuario ON public.quest_instancias (usuario_id);
CREATE INDEX idx_quest_instancias_status ON public.quest_instancias (usuario_id, status);
CREATE INDEX idx_quest_instancias_meta ON public.quest_instancias (usuario_id, meta_codigo);
```

### `quest_estado_usuario`

Snaphot consolidado por usuário.

```sql
CREATE TABLE public.quest_estado_usuario (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id uuid UNIQUE NOT NULL,
    xp_total integer DEFAULT 0 NOT NULL,
    xp_proximo_nivel integer,
    nivel_atual integer DEFAULT 1 NOT NULL,
    titulo_nivel varchar(120),
    sequencia_atual integer DEFAULT 0 NOT NULL,
    sequencia_recorde integer DEFAULT 0 NOT NULL,
    meta_sequencia_codigo varchar(64) NOT NULL DEFAULT 'streak_003',
    proxima_meta_codigo varchar(64),
    sequencia_status jsonb DEFAULT '{}'::jsonb,
    total_quests_concluidas integer DEFAULT 0 NOT NULL,
    total_quests_personalizadas integer DEFAULT 0 NOT NULL,
    total_xp_hoje integer DEFAULT 0 NOT NULL,
    ultima_conversa_em timestamp,
    criado_em timestamp DEFAULT now() NOT NULL,
    atualizado_em timestamp DEFAULT now() NOT NULL,
    CONSTRAINT quest_estado_usuario_xp_check CHECK (xp_total >= 0),
    CONSTRAINT quest_estado_usuario_nivel_check CHECK (nivel_atual >= 1)
);
```

Índices:

```sql
CREATE INDEX idx_quest_estado_usuario_meta ON public.quest_estado_usuario (meta_sequencia_codigo);
```

### `quest_niveis`

Tabela de níveis.

```sql
CREATE TABLE public.quest_niveis (
    nivel integer PRIMARY KEY,
    xp_minimo integer NOT NULL,
    xp_proximo_nivel integer,
    nome varchar(80) NOT NULL,
    descricao text,
    criado_em timestamp DEFAULT now() NOT NULL,
    atualizado_em timestamp DEFAULT now() NOT NULL,
    CONSTRAINT quest_niveis_xp_check CHECK (xp_minimo >= 0),
    CONSTRAINT quest_niveis_ordem_check CHECK (xp_proximo_nivel IS NULL OR xp_proximo_nivel > xp_minimo)
);
```

### `quest_eventos`

Log de auditoria.

```sql
CREATE TABLE public.quest_eventos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id uuid NOT NULL,
    instancia_id uuid,
    tipo_evento varchar(40) NOT NULL, -- reset_sequencia, conclusao_auto, lembrete_envio etc.
    payload jsonb DEFAULT '{}'::jsonb,
    registrado_em timestamp DEFAULT now() NOT NULL
);

CREATE INDEX idx_quest_eventos_usuario ON public.quest_eventos (usuario_id, registrado_em DESC);
```

## Cargas iniciais (seed)

1. _Níveis_: inserir 10 registros conforme tabela funcional (campos `nivel`, `xp_minimo`, `xp_proximo_nivel`, `nome`, `descricao`).
2. _Modelos de sequência_: `streak_003` … `streak_030` (`tipo = 'sequencia'`, `gatilho_codigo = 'conversas_consecutivas'`, `gatilho_valor = X`, `xp_recompensa` conforme funcional, `repeticao = 'unica'`, `ordem_inicial` crescente).
3. Não criaremos mais hábitos diários como catálogo separado; quests personalizadas serão cadastradas dinamicamente.

Script de seed deverá:
- Garantir que cada usuário ativo receba entrada em `quest_estado_usuario`.
- Criar instância inicial da Meta 1 (`quest_instancias` com `meta_codigo = 'streak_003'`, `status = 'ativa'`, `progresso_meta = 3`).
- Pré-criar próxima meta (`meta_codigo = 'streak_005'`, `status = 'pendente'`).

## Regras de consistência

- Triggers ou jobs devem manter `quest_estado_usuario` sincronizado:
  - Ao atualizar `quest_instancias`, recalcular `sequencia_atual`, `meta_sequencia_codigo`, contadores e XP diário.
  - Ao registrar eventos de reset, inserir log em `quest_eventos`.
- Workflows que usam nomes antigos devem ser adaptados para os novos identificadores antes da migração.

## Workflows (n8n)

- `chat_onboarding`: após criar o usuário, roda o SQL de bootstrap que:
  - insere registro em `quest_estado_usuario` (nível 1, meta `streak_003`);
  - garante instâncias iniciais `streak_003` (ativa) e `streak_005` (pendente) em `quest_instancias`.

## Referências cruzadas

- Documento funcional: `docs/espec_quest_funcional.md`.
- Scripts de seed e migração devem ser mantidos em `docs/sql/quest_schema_base.sql` e `docs/sql/quest_seed_default.sql`.
