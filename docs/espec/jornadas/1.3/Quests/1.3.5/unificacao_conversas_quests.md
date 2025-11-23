# Unificação de Conversas e Quests

**Data:** 2025-11-23 17:05  
**Última atualização:** 2025-11-23 17:23  
**Versão:** 1.3.5  
**Objetivo:** Documentar a unificação do tratamento de conversas e quests no sistema

---

## Contexto

Anteriormente, conversas e quests eram tratadas de forma separada:
- **Conversas:** Registradas em `conquistas_historico` com `tipo = 'conversa'` e `meta_codigo = 'conversa_diaria'`
- **Quests:** Registradas em `conquistas_historico` com `tipo = 'quest'` e `meta_codigo = usuarios_quest.id`
- **XP:** Buscado de `metas_catalogo` (tabela separada)

**Problema:** Duplicação de lógica, manutenção complexa, inconsistências.

---

## Solução Implementada

### 1. Unificação de Regras

**Tudo é tratado como quest:**
- Conversas agora são quests do catálogo (`reflexao_diaria`)
- Mesma estrutura de dados (`usuarios_quest`)
- Mesma lógica de XP e pontuação
- Tipo `conversa` mantido apenas para contagem/filtros

### 2. Mudanças no Banco de Dados

#### Tabela `conquistas_historico`
- **Campo renomeado:** `meta_codigo` → `usuarios_quest_id`
- **Migração:**
  - Se `tipo = 'quest'` e `meta_codigo` é UUID válido → copia para `usuarios_quest_id`
  - Se `tipo = 'conversa'` → busca `usuarios_quest.id` da quest `reflexao_diaria` do usuário
- **Compatibilidade:** Campo `meta_codigo` mantido temporariamente para migração

#### Tabela `quests_catalogo`
- **Novo campo:** `xp` (INTEGER, padrão 10)
- **Atualização:** Todas as quests do catálogo agora têm `xp = 10`
- **Uso:** XP é buscado diretamente do catálogo via `catalogo_id`

#### Tabela `metas_catalogo`
- **Removida:** Tabela completamente dropada
- **Razão:** XP agora vem de `quests_catalogo.xp`

### 3. Sistema de XP Unificado

#### Regras de Pontuação
- **XP Base:** Buscado de `quests_catalogo.xp` via `catalogo_id`
- **Valor padrão:** 10 XP para todas as quests (configurável por quest no catálogo)
- **Bônus:** Desabilitado por enquanto (0 XP bônus)
- **Quest personalizada:** Se não tiver `catalogo_id`, usa 10 XP como padrão

#### Busca de XP
- **Antes:** Buscava `xp_base_quest` e `xp_bonus_recorrencia` de `metas_catalogo`
- **Agora:** Busca `xp` de `quests_catalogo` via `LEFT JOIN` com `usuarios_quest.catalogo_id`
- **Fallback:** Se não houver `catalogo_id`, usa 10 XP

### 4. Quest Inicial Automática

#### Criação Automática
- **Quando:** Usuário não tem nenhuma quest em `usuarios_quest`
- **O que:** Cria quest `reflexao_diaria` automaticamente
- **Recorrências:** Para os dias restantes da semana corrente (hoje até sábado)
- **Semana:** Sempre de domingo a sábado

#### Implementação
- **Workflow:** `sw_xp_quest`
- **Nó:** "Verificar e Criar Quest Inicial"
- **Lógica:**
  1. Verifica se usuário tem quests
  2. Se não tiver, busca `reflexao_diaria` do catálogo
  3. Calcula dias restantes da semana (hoje até sábado)
  4. Cria quest com recorrências para esses dias
  5. Define `quest_estagio = 'fazendo'` (não `a_fazer`)

#### Regras Específicas para Conversas

**Diferenças em relação a outras quests:**

1. **Estágio inicial:** Sempre criada com `quest_estagio = 'fazendo'`
   - Conversas não precisam de aprovação do usuário
   - Já nascem prontas para execução

2. **Recorrências fixas:** Usuário **não pode alterar** as recorrências
   - Meta: ser feita todos os dias da semana
   - Recorrências definidas automaticamente pelo sistema

3. **Histórico único:** Sempre terá um único registro em `conquistas_historico`
   - `tipo = 'conversa'`
   - `usuarios_quest_id` aponta para a quest `reflexao_diaria`
   - Todas as ocorrências ficam em `detalhes->ocorrencias[]`
   - Campo `detalhes->total_concluidas` contabiliza todas as conversas

4. **Identificação:** Campo `config->conversa = true` para identificar quests de conversa

---

## Workflows Atualizados

### `sw_xp_quest`
- **Nó "Aplicar Atualizacoes":** Busca XP de cada quest individual via `catalogo_id`
- **Nó "Verificar e Criar Quest Inicial":** Cria quest inicial se necessário
- **Removido:** Nós relacionados a `metas_catalogo` (Listar Config Quest, Anexar Config Quest, Esperar Config Quest)

### `webhook_card_quests`
- **Nó "Estado Quests":** Busca XP de `quests_catalogo` via `catalogo_id`
- **Removido:** Referências a `metas_catalogo`

### `webhook_progresso_semanal`
- **Nó "Calcular Semana":** Busca XP de `reflexao_diaria` do catálogo
- **Atualizado:** `meta_conversa` agora busca de `quests_catalogo` ao invés de `metas_catalogo`

### `sw_xp_conversas`
- **Nó "Listar Metas Sequencia":** 
  - Busca `reflexao_diaria` do catálogo
  - Streaks ainda retornam valores temporários (até migração para catálogo)
- **Nó "Calcular XP Conversas":** Busca `reflexao_diaria` ao invés de `conversa_diaria`

---

## Estrutura de Dados

### `usuarios_quest`
```sql
- catalogo_id (UUID, FK para quests_catalogo.id)
- quest_estagio (VARCHAR): 'a_fazer', 'fazendo', 'feito'
- recorrencias (JSONB): Planejamento apenas (sem status)
```

### `conquistas_historico`
```sql
- usuarios_quest_id (UUID, FK para usuarios_quest.id) -- NOVO
- meta_codigo (TEXT) -- Mantido para compatibilidade
- tipo (TEXT): 'quest' ou 'conversa' (mantido para contagem)
- detalhes->ocorrencias[]: Execução real
```

### `quests_catalogo`
```sql
- xp (INTEGER, padrão 10) -- NOVO
- codigo (VARCHAR): 'reflexao_diaria', etc.
```

---

## Benefícios

1. **Unificação:** Uma única lógica para conversas e quests
2. **Manutenibilidade:** Menos código duplicado, mais fácil de manter
3. **Flexibilidade:** XP configurável por quest no catálogo
4. **Consistência:** Mesma estrutura de dados para tudo
5. **Escalabilidade:** Fácil adicionar novas quests ao catálogo

---

## Migração

### Dados Existentes
- **`conquistas_historico.meta_codigo`:** Mantido para compatibilidade
- **`conquistas_historico.usuarios_quest_id`:** Preenchido automaticamente
- **Conversas antigas:** Relacionadas à quest `reflexao_diaria` quando possível

### Workflows
- Todos os workflows atualizados para usar `quests_catalogo`
- Nenhum workflow mais usa `metas_catalogo`

---

## Próximos Passos

1. **Migrar streaks para catálogo:** Criar quests de streak no `quests_catalogo`
2. **Remover `meta_codigo`:** Após validação completa, remover campo legado
3. **Ajustar XP por quest:** Configurar XP individual no catálogo conforme necessário
4. **Testes:** Validar criação automática de quest inicial

---

*Documento criado para documentar a unificação de conversas e quests no sistema MindQuest v1.3.5*

