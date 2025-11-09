# Especificação Técnica · Sistema de Quests MindQuest

## Visão geral

- Banco: PostgreSQL.
- Schema padrão `public`.
- Todas as tabelas usam UUID (`gen_random_uuid()`) como chave primária, exceto `jornada_niveis` (chave natural `nivel`).
- Status e tipos são restritos via `CHECK` para evitar valores fora da especificação funcional.
- Timestamps padronizados (`criado_em`, `atualizado_em`) com `DEFAULT now()`.

## Tabelas

### `quest_modelos`

Catálogo de modelos reutilizáveis (sequência e personalizadas).

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

### `jornada_niveis`

Tabela que descreve os 10 níveis da jornada.

```sql
CREATE TABLE public.jornada_niveis (
    nivel integer PRIMARY KEY,
    xp_minimo integer NOT NULL,
    xp_proximo_nivel integer,
    titulo varchar(80) NOT NULL,
    descricao text,
    lema varchar(120),
    foco_principal text,
    meta_principal text,
    criterios jsonb NOT NULL DEFAULT '[]'::jsonb,
    conquistas jsonb NOT NULL DEFAULT '[]'::jsonb,
    recompensas jsonb NOT NULL DEFAULT '[]'::jsonb,
    transformacao text,
    criado_em timestamp DEFAULT now() NOT NULL,
    atualizado_em timestamp DEFAULT now() NOT NULL,
    CONSTRAINT jornada_niveis_xp_check CHECK (xp_minimo >= 0),
    CONSTRAINT jornada_niveis_ordem_check CHECK (xp_proximo_nivel IS NULL OR xp_proximo_nivel > xp_minimo)
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

## Cálculo de XP

- **Conversas**: job diário (ou workflow) consulta `usr_chat` para identificar dias com conversa concluída. Cada dia soma **60 XP fixos** (apenas uma conversa pontua por dia). Os bônus de sequência são aplicados somente quando o usuário completa metas de 3, 7, 10, 20 e 30 dias consecutivos (respeitando +80, +100, +150, +200 e +250 XP). Perder a sequência não remove XP acumulado; apenas reinicia a meta ativa.
- **Quests personalizadas**: a cada atualização que muda o status para `concluida`, o workflow calcula 150 XP base; se o modelo for recorrente (`quest_modelos.repeticao = 'recorrente'`), adiciona +50 XP por repetição (limitado a 15) com base no número de instâncias concluídas daquele `modelo_id`.
- **Sincronização**: `quest_estado_usuario` guarda `xp_total`, `total_xp_hoje`, `sequencia_atual`, `meta_sequencia_codigo` e `proxima_meta_codigo`. Qualquer alteração em `quest_instancias` deve refletir esses campos, mantendo o snapshot pronto para leitura pelo dashboard.

## Cargas iniciais (seed)

1. _Níveis_: inserir 10 registros em `jornada_niveis` conforme tabela funcional (campos `nivel`, `xp_minimo`, `xp_proximo_nivel`, `titulo`, `descricao`, `lema`, `meta_principal`, `criterios`, etc.).
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
- `sw_expert_quest_personalizadas`: agente responsável por sugerir novas quests ou ajustes.
  - Inputs: `usuario_id` (obrigatório) e `chat_id` (opcional).
  - Fluxo detalhado:
    1. Nodes Postgres buscam quests personalizadas ativas/pendentes, as 10 conversas mais recentes (`usr_chat`), 10 insights (`insights`) e 10 registros de `usuarios_sabotadores`.
    2. “Montar Contexto” unifica os dados em JSON único consumido pelo agente.
    3. “Agente Quests” (OpenRouter · `gpt-4.1-mini`) recebe instruções rígidas: micro-hábitos concretos ≤ 7 dias, máximo 4 quests simultâneas, sem duplicar `contexto_origem + título`, possibilidade de propor atualizações de status.
    4. “Parser JSON” valida a resposta; “Interpretar Resultado” repassa apenas arrays válidos.
    5. “Aplicar Limites & Dedupe” reforça as regras (limite de 4, dedupe, defaults de prioridade/recorrência/status/xp, filtro de status permitidos).
    6. “Chamar Gamificação” invoca `sw_gamificacao_quests`, enviando `quests_personalizadas` e `atualizacoes_status` serializados.
    7. “Montar Saída” retorna o que foi registrado (novas quests, atualizações e payload de resposta).
- `sw_gamificacao_quests` (antigo `sw_experts_gamification`): aplica regras de persistência/XP para quests personalizadas.
  - Entrada obrigatória: `usuario_id`.
  - Payload `quests_personalizadas` (lista) e `atualizacoes_status` (lista) com os campos: `codigo`, `titulo`, `descricao`, `contexto_origem`, `prioridade`, `recorrencia`, `prazo_inicio`, `prazo_fim`, `progresso_meta`, `status_inicial`, `xp_recompensa`, `payload_extra`, além de atualizações contendo `meta_codigo`/`instancia_id`, `novo_status`, `progresso_atual`, `xp_extra`.
  - Passos principais:
    1. Validar limite de 4 quests ativas/pendentes e evitar duplicidade `titulo + contexto`.
    2. Criar instâncias para novas quests garantindo vínculo com `quest_modelos`; atualizar `quest_estado_usuario.total_quests_personalizadas`.
    3. Atualizar instâncias existentes (status, progresso, `concluido_em`, `reiniciada_em`, `tentativas`). Ao concluir, conceder XP conforme regra (150 XP base + 50 XP por repetição recorrente, até 15) e somar a `xp_total`, `total_quests_concluidas`, `total_xp_hoje`.
    4. Ao final, chamar `sw_calcula_jornada` para recalcular nível/título antes de responder.
- `sw_xp_conversas`: workflow dedicado a premiar conversas.
  - Entrada: `usuario_id`.
  - Busca `quest_estado_usuario` (sequência atual, recorde, meta/proxima meta, `ultima_conversa_em`, `xp_total`).
  - Consulta `usr_chat` e agrega dias com conversa após `ultima_conversa_em`.
  - Node “Calcular XP Conversas” determina 20/35/50 XP conforme tipo (padrão, insight, profunda), aplica bônus de metas de sequência (3→40, 5→60, 7→90, 10→130, 15→180, 20→250, 25→340, 30→450), atualiza `sequencia_atual`, `sequencia_recorde`, `meta_sequencia_codigo`, `proxima_meta_codigo`, `sequencia_status` e `ultima_conversa_em`.
  - Node Postgres aplica os valores em `quest_estado_usuario` e, ao terminar, chama `sw_calcula_jornada`.
- `sw_calcula_jornada`: serviço de nível reutilizável.
  - Entrada: `usuario_id`.
  - Lê `quest_estado_usuario.xp_total`, localiza a faixa correspondente em `jornada_niveis` e atualiza `nivel_atual`, `titulo_nivel`, `xp_proximo_nivel`, `atualizado_em`.
  - Futuras versões poderão validar automaticamente os critérios qualitativos (metas de sequência cumpridas, quests concluídas, sabotadores mapeados) usando os mesmos dados.
- `job_batch_generate_quests`:
  - Trigger manual (pode ser agendado).
  - “Listar Usuários” executa `SELECT id FROM public.usuarios WHERE COALESCE(ativo, true) = true`.
  - `Split In Batches` (batchSize 1) itera por usuário, chamando `sw_expert_quest_personalizadas` com `chat_id = null` e aguardando cada execução terminar antes de puxar o próximo.
  - O job encerra no node “Concluído” após processar todos os usuários ativos, servindo para cargas iniciais ou rotinas periódicas.

## Integração com Dashboard

- Endpoint `GET/POST /api/quests` (proxy local) encaminha requisições para o webhook `QUESTS_WEBHOOK_URL` (por padrão `https://mindquest-n8n.cloudfy.live/webhook/quests-dashboard`) com `usuario_id` obrigatório.
- O front-end utiliza `QuestPanel` (`src/components/dashboard/QuestPanel.tsx`) para exibir `sequencia_atual`, progresso da meta e até quatro quests personalizadas do snapshot retornado pelo workflow `sw_gamificacao_quests`.

## Referências cruzadas

- Documento funcional: `docs/espec_quest_funcional.md`.
- Scripts de seed e migração devem ser mantidos em `docs/sql/quest_schema_base.sql` e `docs/sql/quest_seed_default.sql`.
