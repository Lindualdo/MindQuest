# Correções Necessárias no Workflow `sw_xp_quest`

**Data:** 2025-01-22 18:30
**Última atualização:** 2025-01-22 18:30

---

## Problemas Identificados

### 1. Nós Obsoletos Ainda Conectados
- **"Listar Config Quest"**: Busca de `metas_catalogo` (tabela removida)
- **"Esperar Config Quest"**: Merge node esperando dados que não existem mais
- **"Anexar Config Quest"**: Anexa `xp_base_quest` e `xp_bonus_recorrencia` que não são mais necessários

**Impacto:** Workflow falha ao tentar buscar de `metas_catalogo` que não existe mais.

### 2. Query "Aplicar Atualizacoes" Desatualizada
- Ainda espera parâmetros `$5` (xp_base_quest) e `$6` (xp_bonus_recorrencia)
- `queryReplacement` tenta passar `$json.xp_base_quest` e `$json.xp_bonus_recorrencia` que não existem
- Query deveria buscar XP diretamente do `quests_catalogo` via `catalogo_id`

**Impacto:** Workflow falha ao executar "Aplicar Atualizacoes" por falta de parâmetros.

### 3. "Inserir Instancias" - Recorrências com Status
- Ainda cria `recorrencias->dias[]` com `status` e `concluido_em`
- Deveria criar apenas `data` e `xp_previsto` (planejamento apenas)

**Impacto:** Dados incorretos em `recorrencias` (deveria ser apenas planejamento).

### 4. Falta Nó "Verificar e Criar Quest Inicial"
- Nó adicionado via MCP não está no arquivo local
- Deveria criar `reflexao_diaria` automaticamente se usuário não tiver quests

**Impacto:** Quest inicial não é criada automaticamente.

---

## Correções Necessárias

### Correção 1: Remover Nós Obsoletos
1. Remover conexão de "Normalizar Entrada" → "Listar Config Quest"
2. Remover nós: "Listar Config Quest", "Esperar Config Quest", "Anexar Config Quest"
3. Conectar "Inserir Instancias" diretamente para "Aplicar Atualizacoes"

### Correção 2: Atualizar Query "Aplicar Atualizacoes"
1. Remover parâmetros `$5` e `$6` da query
2. Buscar XP de `quests_catalogo.xp` via `LEFT JOIN` com `usuarios_quest.catalogo_id`
3. Usar `COALESCE(qc.xp, 10)` como fallback
4. Atualizar `queryReplacement` para remover `xp_base_quest` e `xp_bonus_recorrencia`

### Correção 3: Corrigir "Inserir Instancias"
1. Remover `status` e `concluido_em` de `recorrencias->dias[]`
2. Manter apenas `data` e `xp_previsto`

### Correção 4: Adicionar Nó "Verificar e Criar Quest Inicial"
1. Adicionar nó após "Preparar Operacoes"
2. Verificar se usuário tem quests
3. Se não tiver, criar `reflexao_diaria` para dias restantes da semana
4. Conectar para "Inserir Instancias"

---

## Status

- ⏳ **Pendente:** Aplicar correções no workflow via MCP

