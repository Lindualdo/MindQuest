# Plano de Refatoração - Quests v1.3.8

**Data:** 2025-01-22  
**Versão:** 1.3.8

---

## Banco de Dados

### Criar
- `quests_recorrencias` (nova tabela)

### Alterar
- `usuarios_quest`:
  - Mudar status: `disponivel`, `ativa`, `inativa`
  - **Remover campos:**
    - `recorrencias` (vai para `quests_recorrencias`)
    - `quest_estagio` (calculado via status + quests_recorrencias)
    - `concluido_em` (olhar última ocorrência)
    - `janela_inicio` (desnecessário)
    - `janela_fim` (desnecessário)
    - `base_cientifica` (manter em config se necessário)
    - `complexidade` (já tem no catálogo)
  - **Manter campos:**
    - `id`, `usuario_id`, `catalogo_id`
    - `status`, `config`
    - `ativado_em`, `atualizado_em`
    - `area_vida_id`, `sabotador_id`, `insight_id` (contexto)

### Adaptar
- `conquistas_historico` (adaptar ou substituir por `quests_recorrencias`)

### Manter
- `usuarios_conquistas` (sem mudanças)

---

## Workflows n8n

### Workflows de Criação e Cálculo de XP
- `sw_criar_quest` - Criar 3 quests via IA (personalizada, sabotador, TCC)
- `sw_xp_quest` - Persistir quests e calcular XP ao concluir
- `sw_xp_conversas` - Calcular XP de conversas diárias e sequência
- `sw_calcula_jornada` - Calcular nível e estágio da jornada

**Ver:** `workflows_criacao_xp.md` para detalhes

### Alterar
- `sw_criar_quest` - ✅ Criar quests com `status='disponivel'`
- `sw_xp_quest` - ✅ Adaptado para nova estrutura
- `sw_xp_conversas` - ✅ Adaptado para nova estrutura
- `sw_calcula_jornada` - ✅ Adaptado para nova estrutura
- `webhook_quests` - Query adaptada para nova estrutura
- `webhook_concluir_quest` - Atualizar `quests_recorrencias` ao invés de `recorrencias`
- `webhook_quest_detail` - Adaptar query
- `webhook_progresso_semanal` - Adaptar para `quests_recorrencias`
- `job_batch_generate_quests` - Criar com `status='disponivel'`
- `job_batch_xp_quest` - Adaptar para nova estrutura

### Criar
- Workflow para ativar quest (criar `quests_recorrencias`)
- Workflow para validar conclusão (marcar `inativa` quando todas concluídas)

---

## APIs (Vercel)

### Alterar
- `api/quests.ts` - Adaptar query
- `api/concluir-quest.ts` - Atualizar `quests_recorrencias`
- `api/criar-quest.ts` - Criar com `status='disponivel'`
- `api/card/quests.ts` - Adaptar query

### Criar
- `api/ativar-quest.ts` - Criar `quests_recorrencias`

---

## Frontend

### Telas
- `PainelQuestsPageV13.tsx` - Adaptar para novos status/estágios
- `PlanejamentoQuestsPage.tsx` - Adaptar para ativar quest
- `QuestDetailPageV13.tsx` - Adaptar para nova estrutura

### Componentes
- `CardWeeklyProgress.tsx` - Adaptar query de progresso

### Services
- `apiService.ts` - Adaptar métodos para nova estrutura
- `useStore.ts` - Adaptar estado e funções

### Types
- `emotions.ts` - Atualizar tipos para nova estrutura

---

## Migração

### Scripts SQL
- Criar tabela `quests_recorrencias`
- Migrar dados de `recorrencias.dias[]` → `quests_recorrencias`
- Migrar dados de `conquistas_historico` → `quests_recorrencias` (se necessário)
- Atualizar `usuarios_quest.status` conforme regras

---

**Última atualização:** 2025-01-22

