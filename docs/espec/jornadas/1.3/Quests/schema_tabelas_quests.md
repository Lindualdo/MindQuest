# Schema das Tabelas - Quests v1.3

**Data:** 2025-11-22 20:10  
**Versão:** 1.3  
**Fonte:** Banco de dados PostgreSQL (schema público)

---

## Tabelas Principais

### 1. `usuarios_quest`

**Objetivo:** Armazenar quests do usuário (planejamento e status).

**Schema:**
```sql
CREATE TABLE public.usuarios_quest (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id              UUID NOT NULL,
    status                  VARCHAR(20) NOT NULL DEFAULT 'pendente',
    progresso_atual         INTEGER NOT NULL DEFAULT 0,
    progresso_meta          INTEGER,
    progresso_percentual    INTEGER NOT NULL DEFAULT 0,
    xp_concedido            INTEGER NOT NULL DEFAULT 0,
    tentativas              INTEGER NOT NULL DEFAULT 0,
    janela_inicio           DATE,
    janela_fim              DATE,
    contexto_origem         TEXT,
    referencia_data         DATE,
    reiniciada_em           TIMESTAMP,
    ativado_em              TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em           TIMESTAMP NOT NULL DEFAULT now(),
    concluido_em            TIMESTAMP,
    cancelado_em            TIMESTAMP,
    area_vida_id            UUID,
    sabotador_id            TEXT,
    complexidade            SMALLINT NOT NULL DEFAULT 0,
    insight_id              UUID,
    config                  JSONB NOT NULL DEFAULT '{}',
    recorrencias            JSONB
);
```

**Índices:**
- `quest_instancias_pkey` (PRIMARY KEY) - `id`
- `idx_quest_instancias_status` - `(usuario_id, status)`
- `idx_quest_instancias_usuario` - `usuario_id`
- `idx_usuarios_quest_recorrencias` (GIN) - `recorrencias`

**Constraints:**
- `quest_instancias_progresso_check`: `progresso_atual >= 0 AND progresso_percentual >= 0 AND progresso_percentual <= 100`
- `quest_instancias_status_check`: `status IN ('pendente', 'ativa', 'concluida', 'vencida', 'cancelada', 'reiniciada')`
- `quest_instancias_xp_check`: `xp_concedido >= 0`

**Foreign Keys:**
- `area_vida_id` → `areas_vida_catalogo(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `insight_id` → `insights(id)` ON UPDATE CASCADE ON DELETE SET NULL
- `sabotador_id` → `sabotadores_catalogo(id)` ON UPDATE CASCADE ON DELETE SET NULL

**Campos JSONB:**
- `config`: Configuração da quest (titulo, descricao, prioridade, recorrencia, etc.)
- `recorrencias`: Planejamento da quest (tipo, janela, dias com xp_previsto)

---

### 2. `conquistas_historico`

**Objetivo:** Histórico de conclusões (execução real).

**Schema:**
```sql
CREATE TABLE public.conquistas_historico (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id    UUID NOT NULL,
    tipo          TEXT NOT NULL,
    meta_codigo   TEXT NOT NULL,
    meta_titulo   TEXT NOT NULL,
    xp_base       INTEGER NOT NULL DEFAULT 0,
    xp_bonus      INTEGER NOT NULL DEFAULT 0,
    detalhes      JSONB NOT NULL DEFAULT '{}',
    registrado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**Índices:**
- `conquistas_historico_pkey` (PRIMARY KEY) - `id`
- `idx_conquistas_historico_meta` - `meta_codigo`
- `idx_conquistas_historico_tipo` - `tipo`
- `idx_conquistas_historico_usuario` - `usuario_id`

**Campos:**
- `tipo`: 'conversa' | 'quest'
- `meta_codigo`: Para quests = `usuarios_quest.id`, para conversas = 'conversa_diaria'
- `detalhes`: JSONB com ocorrências (data_planejada, data_concluida, data_registrada, xp_base, xp_bonus)

**Relacionamento:**
- `usuarios_quest.id` = `conquistas_historico.meta_codigo` AND `tipo = 'quest'`

---

### 3. `usuarios_conquistas`

**Objetivo:** Pontuação consolidada do usuário (para cálculo de nível).

**Schema:**
```sql
CREATE TABLE public.usuarios_conquistas (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id              UUID NOT NULL UNIQUE,
    xp_total                INTEGER NOT NULL DEFAULT 0,
    xp_proximo_nivel        INTEGER,
    nivel_atual             INTEGER NOT NULL DEFAULT 1,
    titulo_nivel            VARCHAR(120),
    sequencia_atual         INTEGER NOT NULL DEFAULT 0,
    sequencia_recorde       INTEGER NOT NULL DEFAULT 0,
    meta_sequencia_codigo   VARCHAR(64) NOT NULL DEFAULT 'streak_003',
    proxima_meta_codigo      VARCHAR(64),
    sequencia_status        JSONB DEFAULT '{}',
    total_quests_concluidas INTEGER NOT NULL DEFAULT 0,
    total_quests_personalizadas INTEGER NOT NULL DEFAULT 0,
    total_xp_hoje           INTEGER NOT NULL DEFAULT 0,
    ultima_conversa_em      TIMESTAMP,
    criado_em               TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em           TIMESTAMP NOT NULL DEFAULT now(),
    xp_base                 INTEGER DEFAULT 0,
    xp_bonus                INTEGER DEFAULT 0
);
```

**Índices:**
- `quest_estado_usuario_pkey` (PRIMARY KEY) - `id`
- `idx_quest_estado_usuario_meta` - `meta_sequencia_codigo`
- `idx_usuarios_conquistas_atualizado_em` - `atualizado_em`
- `idx_usuarios_conquistas_usuario` - `usuario_id`
- `quest_estado_usuario_usuario_id_key` (UNIQUE) - `usuario_id`

**Constraints:**
- `quest_estado_usuario_nivel_check`: `nivel_atual >= 1`
- `quest_estado_usuario_xp_check`: `xp_total >= 0`

**Campos principais:**
- `xp_total`: base + bônus (para cálculo de nível)
- `xp_base`: soma de pontos base (sem bônus)
- `xp_bonus`: soma de pontos bônus
- `total_quests_concluidas`: contador de quests concluídas

---

### 4. `metas_catalogo`

**Objetivo:** Catálogo de pontuações oficiais (valores de XP/pontos).

**Schema:**
```sql
CREATE TABLE public.metas_catalogo (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo        VARCHAR(64) NOT NULL UNIQUE,
    titulo        VARCHAR(120) NOT NULL,
    descricao     TEXT,
    tipo          VARCHAR(20) NOT NULL,
    xp_recompensa INTEGER NOT NULL DEFAULT 0,
    criado_em     TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT now()
);
```

**Índices:**
- `quest_modelos_pkey` (PRIMARY KEY) - `id`
- `idx_quest_modelos_tipo` - `tipo`
- `quest_modelos_codigo_key` (UNIQUE) - `codigo`

**Constraints:**
- `quest_modelos_tipo_check`: `tipo IN ('sequencia', 'personalizada')`
- `quest_modelos_xp_check`: `xp_recompensa >= 0`

**Códigos importantes:**
- `conversa_diaria`: Pontos base de conversa diária
- `xp_base_quest`: Pontos base de quest
- `xp_bonus_recorrencia`: Pontos bônus de recorrência
- `streak_*`: Bônus de sequências

**Regra fundamental:** **SEMPRE consultar esta tabela** para valores de pontuação. **NUNCA usar valores hardcoded**.

---

## Tabelas Relacionadas

### 5. `areas_vida_catalogo`

**Objetivo:** Catálogo de áreas da vida relacionadas às quests.

**Schema:**
```sql
CREATE TABLE public.areas_vida_catalogo (
    id            UUID PRIMARY KEY,
    codigo        TEXT NOT NULL,
    nome          TEXT NOT NULL,
    descricao     TEXT,
    ativo         BOOLEAN NOT NULL DEFAULT true,
    criado_em     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**Relacionamento:**
- `usuarios_quest.area_vida_id` → `areas_vida_catalogo.id`

---

### 6. `sabotadores_catalogo`

**Objetivo:** Catálogo de sabotadores/padrões mentais relacionados às quests.

**Schema:**
```sql
CREATE TABLE public.sabotadores_catalogo (
    id                      VARCHAR PRIMARY KEY,
    nome                    VARCHAR NOT NULL,
    emoji                   VARCHAR,
    descricao               TEXT,
    contextos_tipicos       ARRAY,
    contramedidas_sugeridas ARRAY
);
```

**Relacionamento:**
- `usuarios_quest.sabotador_id` → `sabotadores_catalogo.id`

---

## Relacionamentos Principais

```
usuarios_quest
├── area_vida_id → areas_vida_catalogo.id
├── sabotador_id → sabotadores_catalogo.id
├── insight_id → insights.id
└── id → conquistas_historico.meta_codigo (quando tipo = 'quest')

conquistas_historico
├── meta_codigo = usuarios_quest.id (para quests)
└── meta_codigo = 'conversa_diaria' (para conversas)

usuarios_conquistas
└── usuario_id → usuarios.id (1:1)
```

---

## Estruturas JSONB Importantes

### `usuarios_quest.recorrencias`
```json
{
  "tipo": "diaria" | "semanal" | "unica",
  "janela": {
    "inicio": "YYYY-MM-DD",
    "fim": "YYYY-MM-DD"
  },
  "dias": [
    {
      "data": "YYYY-MM-DD",
      "xp_previsto": 30
    }
  ]
}
```

### `usuarios_quest.config`
```json
{
  "titulo": "Título da quest",
  "descricao": "Descrição da quest",
  "prioridade": "alta" | "media" | "baixa",
  "recorrencia": "diaria" | "semanal" | "unica",
  "payload_extra": {}
}
```

### `conquistas_historico.detalhes`
```json
{
  "recorrencia": "diaria",
  "data_conclusao": "YYYY-MM-DD",
  "total_concluidas": 3,
  "ocorrencias": [
    {
      "data_planejada": "YYYY-MM-DD",
      "data_concluida": "YYYY-MM-DD",
      "data_registrada": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "xp_base": 30,
      "xp_bonus": 6
    }
  ]
}
```

---

## Notas Importantes

1. **Status de quests:** Valores permitidos: `'pendente'`, `'ativa'`, `'concluida'`, `'vencida'`, `'cancelada'`, `'reiniciada'`
2. **Relacionamento 1:1:** `usuarios_quest.id` = `conquistas_historico.meta_codigo` (quando `tipo = 'quest'`)
3. **Pontuações:** **SEMPRE consultar `metas_catalogo`** - nunca usar valores hardcoded
4. **Planejamento vs Execução:** `recorrencias` (planejamento) vs `detalhes->ocorrencias[]` (execução)
5. **Bônus:** `xp_bonus` não conta para metas/progresso, apenas para `xp_total` (nível)

---

*Schema extraído do banco de dados em 2025-11-22 20:10*

