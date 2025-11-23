# Plano de Implementação - Passo 1: Catálogo Estruturado de Quests

**Data:** 2025-11-23 08:53  
**Versão:** 1.3.5  
**Objetivo:** Definir primeiro passo concreto para refactor do sistema de Quests

---

## Análise do Estado Atual

### ✅ O que já existe:
- Geração de quests via `sw_criar_quest` (IA)
- Persistência via `sw_xp_quest`
- Status: `pendente`, `ativa`, `concluida`
- Limite atual: 4 quests ativas/pendentes
- Estrutura de dados: `usuarios_quest`, `conquistas_historico`

### ⏳ O que precisa ser criado:
- Banco de quests estruturado (catálogo)
- Sistema de estágios (planejada → ativa → concluida)
- Gestão de slots (máx. 5 ativas)
- Quests essenciais padronizadas
- Interface de escolha/ativação

---

## Primeiro Passo: Criar Catálogo Estruturado de Quests

### Por que este é o primeiro passo?

1. **Base para tudo:** Sistema precisa saber quais quests existem antes de sugerir
2. **Não mexe no código:** Apenas estrutura dados (tabela/catálogo)
3. **Valida conceito:** Testa se estrutura faz sentido antes de implementar lógica
4. **Baixo risco:** Não altera comportamento atual, apenas adiciona referência

---

## O que fazer no Passo 1

### 1.1. Criar Tabela `quests_catalogo`

**Objetivo:** Armazenar todas as quests disponíveis no sistema (template/modelo)

**Estrutura proposta:**
```sql
CREATE TABLE public.quests_catalogo (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo                  VARCHAR(64) NOT NULL UNIQUE,
    titulo                  VARCHAR(200) NOT NULL,
    descricao               TEXT,
    instrucoes              JSONB NOT NULL DEFAULT '{}',
    categoria               VARCHAR(50) NOT NULL,
    nivel_prioridade        SMALLINT NOT NULL DEFAULT 3, -- 1=Essencial, 2=Transformador, 3=Apoio, 4=Opcional
    tipo_recorrencia        VARCHAR(20), -- 'diaria', 'semanal', 'unica', 'contextual'
    tempo_estimado_min      SMALLINT NOT NULL DEFAULT 5,
    dificuldade             SMALLINT NOT NULL DEFAULT 2, -- 1=Fácil, 2=Moderada, 3=Desafiadora
    areas_vida_ids          UUID[], -- Array de áreas da vida relacionadas
    sabotador_id            TEXT, -- Sabotador relacionado (se aplicável)
    base_cientifica         TEXT, -- Justificativa (neurociência, TCC, estoicismo)
    impacto_esperado        TEXT, -- O que o usuário pode esperar
    quando_aplicar          TEXT, -- Contexto de aplicação
    quando_nao_aplicar      TEXT, -- Quando evitar
    exemplo_pratico         TEXT,
    quests_relacionadas     UUID[], -- Quests que complementam esta
    ativo                   BOOLEAN NOT NULL DEFAULT true,
    criado_em               TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em           TIMESTAMP NOT NULL DEFAULT now()
);
```

**Índices:**
- `idx_quests_catalogo_codigo` (UNIQUE) - `codigo`
- `idx_quests_catalogo_categoria` - `categoria`
- `idx_quests_catalogo_nivel_prioridade` - `nivel_prioridade`
- `idx_quests_catalogo_sabotador` - `sabotador_id`
- `idx_quests_catalogo_areas_vida` (GIN) - `areas_vida_ids`

---

### 1.2. Estrutura do Campo `instrucoes` (JSONB)

```json
{
  "passos": [
    {
      "ordem": 1,
      "acao": "Pergunte: 'O que está sob meu controle hoje?'",
      "tempo_estimado": 1
    },
    {
      "ordem": 2,
      "acao": "Escolha 1 micro-ação prioritária",
      "tempo_estimado": 2
    },
    {
      "ordem": 3,
      "acao": "Anote em 1 frase",
      "tempo_estimado": 2
    }
  ],
  "dicas": [
    "Faça antes de verificar celular",
    "Seja específico na micro-ação"
  ],
  "exemplo": {
    "situacao": "Manhã de segunda-feira",
    "resposta_exemplo": "Hoje está sob meu controle: fazer 1 ligação importante que estou evitando. Micro-ação: ligar às 10h."
  }
}
```

---

### 1.3. Categorias de Quests

**Baseado na documentação criada:**

1. **essencial** - Quests sempre ativas (reflexão matinal/noturna, contramedida sabotador)
2. **tcc** - Técnicas de Terapia Cognitivo-Comportamental
3. **estoicismo** - Práticas baseadas em filosofia estoica
4. **neurociencia** - Hábitos baseados em neurociência
5. **contramedida_sabotador** - Contramedidas específicas por sabotador
6. **boa_pratica_geral** - Boas práticas de desenvolvimento pessoal
7. **personalizada** - Quests geradas por IA (não entram no catálogo, são dinâmicas)

---

### 1.4. População Inicial do Catálogo

**Quests Essenciais (Nível 1):**

1. **reflexao_matinal**
   - Categoria: `essencial`
   - Nível prioridade: `1`
   - Base científica: Neurociência + Estoicismo
   - Tempo: 5 min
   - Dificuldade: 1 (Fácil)

2. **reflexao_noturna**
   - Categoria: `essencial`
   - Nível prioridade: `1`
   - Base científica: Neurociência + Estoicismo
   - Tempo: 5 min
   - Dificuldade: 1 (Fácil)

3. **contramedida_sabotador_ativa**
   - Categoria: `contramedida_sabotador`
   - Nível prioridade: `1`
   - Base científica: Neurociência + TCC
   - Tempo: 3-5 min
   - Dificuldade: 2 (Moderada)
   - **Nota:** Esta quest é dinâmica (varia conforme sabotador ativo)

**Quests Transformadoras (Nível 2):**

4. **micro_acao_coragem**
   - Categoria: `neurociencia`
   - Nível prioridade: `2`
   - Base científica: Neurociência (quebra padrões neurais)
   - Tempo: 5-10 min
   - Dificuldade: 2 (Moderada)

5. **reconhecimento_progresso**
   - Categoria: `tcc`
   - Nível prioridade: `2`
   - Base científica: TCC (reforço positivo)
   - Tempo: 3 min
   - Dificuldade: 1 (Fácil)

6. **identificacao_pensamentos_automaticos**
   - Categoria: `tcc`
   - Nível prioridade: `2`
   - Base científica: TCC (base para reestruturação)
   - Tempo: 2-3 min
   - Dificuldade: 2 (Moderada)

**Quests de Apoio (Nível 3):**

7. **acao_imediata** (contextual: quando detectar procrastinação)
8. **pausa_consciencia** (contextual: quando detectar estresse)
9. **reflexao_controle** (contextual: quando detectar ansiedade)
10. **relaxamento_4_7_8** (contextual: quando detectar ansiedade física)
11. **resolucao_problemas** (contextual: quando detectar paralisia)

**Quests Opcionais (Nível 4):**

12-50+. Todas as outras quests do banco (TCC avançadas, boas práticas gerais, etc.)

---

### 1.5. Contramedidas por Sabotador

**Estrutura especial:** Cada sabotador terá múltiplas contramedidas no catálogo

**Exemplo para Crítico:**
- `contramedida_critico_01_questionar_evidencias`
- `contramedida_critico_02_refletir_controle`
- `contramedida_critico_03_reformular_criticas`
- ... (até 10 contramedidas por sabotador)

**Relacionamento:**
- Campo `sabotador_id` = `'critico'`
- Campo `categoria` = `'contramedida_sabotador'`
- Campo `nivel_prioridade` = `1` (essenciais quando sabotador está ativo)

---

## Entregáveis do Passo 1

### 1. Script SQL de Criação
- Arquivo: `docs/sql/create_quests_catalogo.sql`
- Cria tabela `quests_catalogo`
- Cria índices
- Adiciona constraints

### 2. Script SQL de População Inicial
- Arquivo: `docs/sql/populate_quests_catalogo.sql`
- Insere quests essenciais (3)
- Insere quests transformadoras (3)
- Insere quests de apoio (5)
- Insere contramedidas por sabotador (10 sabotadores × 10 contramedidas = 100)
- **Total inicial:** ~111 quests no catálogo

### 3. Documentação do Catálogo
- Arquivo: `docs/espec/jornadas/1.3/Quests/catalogo_quests.md`
- Lista todas as quests
- Explica estrutura
- Define padrões de codificação

### 4. Validação
- Testar inserção de dados
- Validar estrutura JSONB
- Verificar relacionamentos (áreas da vida, sabotadores)

---

## Critérios de Sucesso do Passo 1

✅ Tabela `quests_catalogo` criada no banco  
✅ Estrutura JSONB validada  
✅ Índices criados e funcionando  
✅ Pelo menos 50 quests inseridas (essenciais + transformadoras + contramedidas principais)  
✅ Documentação completa  
✅ Scripts SQL testados e funcionando  

---

## Próximos Passos (Após Passo 1)

**Passo 2:** Atualizar `sw_criar_quest` para consultar catálogo  
**Passo 3:** Implementar sistema de estágios (planejada → ativa)  
**Passo 4:** Criar interface de escolha/ativação no frontend  
**Passo 5:** Implementar gestão de slots (máx. 5 ativas)  

---

## Notas Importantes

1. **Não altera comportamento atual:** Este passo apenas adiciona referência, não muda lógica
2. **Base para tudo:** Sem catálogo, não há como implementar escolha/ativação
3. **Iterativo:** Pode começar com menos quests e expandir depois
4. **Validação:** Testar estrutura antes de implementar lógica que usa

---

*Primeiro passo definido para refactor do sistema de Quests*

