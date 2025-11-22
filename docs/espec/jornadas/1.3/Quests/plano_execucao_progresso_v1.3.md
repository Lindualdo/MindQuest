# Plano de Execução: Progresso v1.3

## Objetivo
Implementar a nova estrutura de progresso conforme definido em `mindquest_progresso_v1.3.md`.

---

## 1. Preparação

### 1.1. Backup
- [ ] Fazer backup do banco de dados
- [ ] Fazer backup dos workflows n8n (`webhook_concluir_quest`, `sw_xp_quest`, `webhook_progresso_semanal`)

### 1.2. Validação de Dados Atuais
- [ ] Verificar registros existentes em `conquistas_historico` (quests)
- [ ] Verificar estrutura atual de `detalhes` para identificar necessidade de migração

---

## 2. Alterações em Workflows n8n

### 2.1. Workflow: `sw_xp_quest` (ID: `bTeLj5qOKQo9PDMO`)

#### 2.1.1. Node "Aplicar Atualizacoes"
**Objetivo:** Atualizar a query SQL para incluir as 3 datas no campo `detalhes`.

**Alterações necessárias:**
- [ ] Receber `data_referencia` via parâmetro `atualizacoes_status`
- [ ] Buscar `data_planejada` de `usuarios_quest.recorrencias->dias[]` correspondente
- [ ] Modificar o `INSERT/UPDATE` em `conquistas_historico` para incluir:
  ```json
  {
    "recorrencia": "...",
    "data_conclusao": "data_concluida (última)",
    "total_concluidas": N,
    "ocorrencias": [
      {
        "data_planejada": "de recorrencias",
        "data_concluida": "data_referencia",
        "data_registrada": "NOW()",
        "xp_base": 30,
        "xp_bonus": 6
      }
    ]
  }
  ```
- [ ] Preencher `meta_titulo` com `usuarios_quest.config->>'titulo'` (na criação)
- [ ] **NÃO** incluir `quest_id` no `detalhes` (relacionamento via `meta_codigo`)

**Arquivo:** `backups/n8n/sw_xp_quest.json`

---

### 2.2. Workflow: `webhook_concluir_quest` (ID: `YF4CyvHY0BbLWNwC`)

#### 2.2.1. Node "Normalizar Entrada"
**Status:** ✅ Já recebe `data_referencia`

#### 2.2.2. Node "Atualizar Recorrencia"
**Status:** ✅ Já atualiza `usuarios_quest.recorrencias`

#### 2.2.3. Node "Calcular XP Quest"
**Alterações necessárias:**
- [ ] Passar `data_referencia` via `atualizacoes_status` para `sw_xp_quest`
- [ ] Incluir `data_referencia` no JSON enviado ao sub-workflow

**Arquivo:** `backups/n8n/webhook_concluir_quest.json`

---

### 2.3. Workflow: `webhook_progresso_semanal` (ID: `gMb1UwtmEh5pkfxR`)

#### 2.3.1. Node "Calcular Semana"
**Objetivo:** Atualizar query SQL para usar `data_concluida` ao invés de `registrado_em`.

**Alterações necessárias:**
- [ ] Modificar CTE `quests_concluidas` para usar:
  ```sql
  (occ->>'data_concluida')::date AS data
  ```
  ao invés de:
  ```sql
  (ch.registrado_em AT TIME ZONE 'America/Sao_Paulo')::date AS data
  ```
- [ ] Garantir que está usando `detalhes->'ocorrencias'` para buscar conclusões
- [ ] Filtrar por `data_concluida` na cláusula `WHERE`

**Arquivo:** `data/query_progresso_semanal_refactored.sql`

---

## 3. Validação e Testes

### 3.1. Testes de Conclusão de Quest

#### 3.1.1. Quest Única
- [ ] Concluir quest única
- [ ] Verificar `conquistas_historico.detalhes` tem estrutura correta
- [ ] Verificar `data_planejada`, `data_concluida`, `data_registrada`
- [ ] Verificar `meta_titulo` foi preenchido

#### 3.1.2. Quest Recorrente - Mesmo Dia
- [ ] Concluir quest no dia planejado
- [ ] Verificar `data_planejada = data_concluida`
- [ ] Verificar ocorrência foi adicionada ao array

#### 3.1.3. Quest Recorrente - Conclusão Retroativa
- [ ] Hoje (20/11) concluir quest planejada para ontem (19/11)
- [ ] Verificar `data_planejada = 2025-11-19`
- [ ] Verificar `data_concluida = 2025-11-19`
- [ ] Verificar `data_registrada = 2025-11-20T...` (timestamp de hoje)

#### 3.1.4. Múltiplas Conclusões
- [ ] Concluir a mesma quest em dias diferentes
- [ ] Verificar `total_concluidas` está incrementando
- [ ] Verificar `data_conclusao` (nível raiz) é atualizada para última conclusão
- [ ] Verificar todas as ocorrências no array `ocorrencias`

### 3.2. Testes de Progresso Semanal

#### 3.2.1. Meta (Planejado)
- [ ] Verificar query de meta usa `usuarios_quest.recorrencias->dias[]`
- [ ] Validar cálculo de `xp_previsto` por dia

#### 3.2.2. Concluídas (Realizado)
- [ ] Verificar query usa `data_concluida` de `detalhes->'ocorrencias'`
- [ ] Validar XP atribuído ao dia correto
- [ ] Validar conclusões retroativas aparecem no dia correto

#### 3.2.3. Barras de Progresso
- [ ] Verificar barras horizontais (semana total)
- [ ] Verificar barras verticais (dia a dia)
- [ ] Verificar conclusão retroativa aparece no dia correto

### 3.3. Validações de Dados

#### 3.3.1. Relacionamento 1:1
- [ ] Verificar `usuarios_quest.id = conquistas_historico.meta_codigo`
- [ ] Verificar não há duplicatas

#### 3.3.2. Auditoria
- [ ] Verificar `data_planejada` corresponde a `usuarios_quest.recorrencias->dias[].data`
- [ ] Verificar `meta_titulo` corresponde a `usuarios_quest.config->>'titulo'`

#### 3.3.3. Estrutura JSON
- [ ] Verificar `detalhes` não contém `quest_id`
- [ ] Verificar todas as ocorrências têm as 3 datas
- [ ] Verificar formato de datas está correto (YYYY-MM-DD e ISO 8601)

---

## 4. Ordem de Execução

### Fase 1: Preparação
1. ✅ Fazer backups
2. ✅ Validar dados atuais

### Fase 2: Implementação (Workflows)
1. ✅ Atualizar `sw_xp_quest` (Node "Aplicar Atualizacoes")
2. ✅ Atualizar `webhook_concluir_quest` (Node "Calcular XP Quest")
3. ✅ Atualizar `webhook_progresso_semanal` (Node "Calcular Semana")

### Fase 3: Testes
1. ✅ Testes de conclusão (única, recorrente, retroativa)
2. ✅ Testes de progresso semanal
3. ✅ Validações de dados

### Fase 4: Validação Final
1. ✅ Testar fluxo completo end-to-end
2. ✅ Validar frontend mostra dados corretos
3. ✅ Validar barras de progresso funcionam corretamente

---

## 5. Rollback (Se Necessário)

### 5.1. Restaurar Workflows
- [ ] Restaurar backups dos workflows n8n

### 5.2. Restaurar Banco
- [ ] Restaurar backup do banco de dados (se houver migração)

---

## 6. Documentação

- [ ] Atualizar `docs/espec/mindquest_progresso_v1.3.md` com observações de implementação
- [ ] Documentar alterações nos workflows n8n
- [ ] Documentar queries SQL modificadas

---

## 7. Checklist Final

Antes de considerar implementação completa:

- [ ] Todos os workflows atualizados
- [ ] Todos os testes passando
- [ ] Dados validados no banco
- [ ] Frontend funcionando corretamente
- [ ] Barras de progresso mostrando dados corretos
- [ ] Conclusão retroativa funcionando
- [ ] Documentação atualizada

---

## Notas Importantes

1. **NUNCA atualizar apenas um campo** em nodes Postgres via MCP - sempre incluir `operation`, `query` e `options` completos
2. **Sub-workflows (sw_*)** não devem ser ativados
3. **Bônus não conta** para meta/progresso, apenas para nível
4. **Relacionamento 1:1** via `meta_codigo`, não incluir `quest_id` no `detalhes`
5. **Meta_titulo** é snapshot histórico, não atualizar após criação

