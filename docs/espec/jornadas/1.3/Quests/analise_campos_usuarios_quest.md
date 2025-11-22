# Análise de Campos - `usuarios_quest` v1.3

**Data:** 2025-11-22 20:18  
**Versão:** 1.3  
**Objetivo:** Identificar campos não utilizados para simplificação da tabela

---

## Campos da Tabela `usuarios_quest`

### Campos Existentes (23 campos)

| Campo | Tipo | Uso Atual | Status |
|-------|------|-----------|--------|
| `id` | UUID | ✅ Usado | **Manter** |
| `usuario_id` | UUID | ✅ Usado | **Manter** |
| `status` | VARCHAR(20) | ✅ Usado | **Manter** |
| `progresso_atual` | INTEGER | ⚠️ Legado | **Remover** |
| `progresso_meta` | INTEGER | ⚠️ Legado | **Remover** |
| `progresso_percentual` | INTEGER | ⚠️ Legado | **Remover** |
| `xp_concedido` | INTEGER | ⚠️ Legado | **Remover** |
| `tentativas` | INTEGER | ❌ Não usado | **Remover** |
| `janela_inicio` | DATE | ✅ Usado | **Manter** |
| `janela_fim` | DATE | ✅ Usado | **Manter** |
| `contexto_origem` | TEXT | ⚠️ Consultado mas não essencial | **Avaliar** |
| `referencia_data` | DATE | ⚠️ Legado | **Remover** |
| `reiniciada_em` | TIMESTAMP | ⚠️ Legado | **Remover** |
| `ativado_em` | TIMESTAMP | ✅ Usado | **Manter** |
| `atualizado_em` | TIMESTAMP | ✅ Usado | **Manter** |
| `concluido_em` | TIMESTAMP | ⚠️ Consultado mas status já indica | **Avaliar** |
| `cancelado_em` | TIMESTAMP | ❌ Não usado | **Remover** |
| `area_vida_id` | UUID | ✅ Usado | **Manter** |
| `sabotador_id` | TEXT | ✅ Usado | **Manter** |
| `complexidade` | SMALLINT | ✅ Usado | **Manter** |
| `insight_id` | UUID | ⚠️ Consultado mas não essencial | **Avaliar** |
| `config` | JSONB | ✅ Usado | **Manter** |
| `recorrencias` | JSONB | ✅ Usado (v1.3) | **Manter** |

---

## Análise Detalhada

### Campos para Remover (Legados ou Não Utilizados)

#### 1. `progresso_atual`, `progresso_meta`, `progresso_percentual`
**Motivo:** Sistema v1.3 usa `recorrencias` (planejamento) e `conquistas_historico.detalhes` (execução).

**Evidências:**
- `recorrencias->dias[]` contém `xp_previsto` (planejamento)
- `conquistas_historico.detalhes->ocorrencias[]` contém `xp_base` (execução)
- Campos `progresso_*` aparecem em queries legadas mas não são fonte de verdade

**Impacto:**
- Workflows legados podem consultar, mas não atualizam
- Frontend v1.3 não depende desses campos
- Sistema atual calcula progresso via `recorrencias` vs `conquistas_historico`

**Ação:** Remover após validar que nenhum workflow ativo depende

---

#### 2. `xp_concedido`
**Motivo:** XP agora é armazenado em `conquistas_historico` (fonte de verdade).

**Evidências:**
- `conquistas_historico.xp_base` e `xp_bonus` são a fonte oficial
- `usuarios_conquistas` consolida XP total
- Campo `xp_concedido` não é atualizado nos workflows v1.3

**Impacto:**
- Workflows legados podem consultar, mas não atualizam
- Sistema atual usa `conquistas_historico` para XP

**Ação:** Remover após validar que nenhum workflow ativo depende

---

#### 3. `tentativas`
**Motivo:** Não encontrado uso em nenhum workflow ou frontend.

**Evidências:**
- Não aparece em queries SELECT/UPDATE
- Não usado no frontend
- Sempre inicializado com 0 e nunca atualizado

**Ação:** Remover (sem impacto)

---

#### 4. `referencia_data`
**Motivo:** Legado do sistema antigo. Sistema v1.3 usa `data_referencia` via parâmetro.

**Evidências:**
- Inicializado com `prazo_inicio` no INSERT
- Não é atualizado em workflows v1.3
- `webhook_concluir_quest` passa `data_referencia` via parâmetro

**Ação:** Remover (sem impacto)

---

#### 5. `reiniciada_em`
**Motivo:** Status `reiniciada` já indica o estado. Timestamp não é necessário.

**Evidências:**
- Atualizado apenas em `sw_xp_quest` quando status = 'reiniciada'
- Não consultado em nenhum workflow
- Status já indica o estado

**Ação:** Remover (sem impacto)

---

#### 6. `cancelado_em`
**Motivo:** Não encontrado uso. Status `cancelada` já indica o estado.

**Evidências:**
- Nunca atualizado
- Não consultado
- Status já indica o estado

**Ação:** Remover (sem impacto)

---

### Campos para Avaliar (Podem ser Removidos)

#### 7. `contexto_origem`
**Motivo:** Consultado mas não essencial. Pode estar em `config`.

**Evidências:**
- Aparece em queries SELECT
- Usado no frontend para exibição
- Poderia estar em `config->>'contexto_origem'`

**Ação:** Avaliar se pode migrar para `config` JSONB

---

#### 8. `concluido_em`
**Motivo:** Status `concluida` já indica. Timestamp pode ser obtido de `conquistas_historico`.

**Evidências:**
- Consultado em algumas queries
- Mas `conquistas_historico.detalhes->>'data_conclusao'` já tem essa informação
- Status `concluida` já indica o estado

**Ação:** Avaliar se pode remover e usar `conquistas_historico` como fonte

---

#### 9. `insight_id`
**Motivo:** Consultado mas não essencial. Quest pode ser autocontida.

**Evidências:**
- Aparece em queries SELECT
- Mas quests v1.3 devem ser autocontidas (campo `instrucoes`)
- Foreign key para `insights` pode ser removida

**Ação:** Avaliar se pode remover após implementar campo `instrucoes`

---

## Campos Essenciais (Manter)

### Obrigatórios
- `id`, `usuario_id`, `status`
- `janela_inicio`, `janela_fim`
- `ativado_em`, `atualizado_em`
- `config` (JSONB), `recorrencias` (JSONB)

### Relacionamentos
- `area_vida_id` → `areas_vida_catalogo`
- `sabotador_id` → `sabotadores_catalogo`
- `complexidade` (usado em cálculos)

---

## Resumo de Ações

### Remover Imediatamente (Sem Impacto)
1. ✅ `tentativas`
2. ✅ `cancelado_em`
3. ✅ `referencia_data`

### Remover Após Validação (Legados)
4. ⚠️ `progresso_atual`
5. ⚠️ `progresso_meta`
6. ⚠️ `progresso_percentual`
7. ⚠️ `xp_concedido`
8. ⚠️ `reiniciada_em`

### Avaliar para Remoção Futura
9. 🔍 `contexto_origem` → Migrar para `config`
10. 🔍 `concluido_em` → Usar `conquistas_historico`
11. 🔍 `insight_id` → Remover após `instrucoes`

---

## Migration SQL (Fase 1 - Remoção Segura)

```sql
-- FASE 1: Remover campos não utilizados (sem impacto)
BEGIN;

-- Remover campos que nunca são usados
ALTER TABLE public.usuarios_quest
  DROP COLUMN IF EXISTS tentativas,
  DROP COLUMN IF EXISTS cancelado_em,
  DROP COLUMN IF EXISTS referencia_data;

-- Remover constraint relacionada (se existir)
ALTER TABLE public.usuarios_quest
  DROP CONSTRAINT IF EXISTS quest_instancias_progresso_check;

COMMIT;
```

---

## Migration SQL (Fase 2 - Remoção de Legados)

**⚠️ EXECUTAR APENAS APÓS VALIDAÇÃO COMPLETA**

```sql
-- FASE 2: Remover campos legados (após validação)
BEGIN;

-- Remover campos de progresso legados
ALTER TABLE public.usuarios_quest
  DROP COLUMN IF EXISTS progresso_atual,
  DROP COLUMN IF EXISTS progresso_meta,
  DROP COLUMN IF EXISTS progresso_percentual,
  DROP COLUMN IF EXISTS xp_concedido,
  DROP COLUMN IF EXISTS reiniciada_em;

-- Remover constraint relacionada (se existir)
ALTER TABLE public.usuarios_quest
  DROP CONSTRAINT IF EXISTS quest_instancias_xp_check;

COMMIT;
```

---

## Validação Necessária

Antes de executar Fase 2, validar:

1. ✅ Nenhum workflow ativo consulta `progresso_*` ou `xp_concedido`
2. ✅ Frontend v1.3 não depende desses campos
3. ✅ Queries de relatórios/dashboards não usam esses campos
4. ✅ Testes end-to-end passam sem esses campos

---

## Benefícios da Remoção

1. **Simplificação:** Tabela mais limpa e focada
2. **Clareza:** Apenas campos essenciais
3. **Performance:** Menos colunas = queries mais rápidas
4. **Manutenção:** Menos campos = menos complexidade

---

## Próximos Passos

1. ⏳ Executar Fase 1 (remoção segura)
2. ⏳ Validar workflows e frontend
3. ⏳ Executar Fase 2 (remoção de legados)
4. ⏳ Avaliar Fase 3 (campos para migrar/remover)

---

*Análise baseada em workflows n8n e código frontend v1.3*

