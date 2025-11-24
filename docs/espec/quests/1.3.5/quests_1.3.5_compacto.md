# Quests MindQuest v1.3.5 — Referência Técnica

**Data:** 2025-11-24 20:30  
**Versão:** 1.3.5  
**Objetivo:** Referência técnica essencial para implementação

---

## 1. Conceito

**Quests = micro-ações personalizadas (IA) para transformar reflexão em ação.**

- **Tipos:** Recorrentes (diárias/semanais) ou únicas
- **Origem:** Sistema (sabotadores), personalizadas (insights), pontuais (conversas)
- **Estágios:** `a_fazer` → `fazendo` → `feito`
- **Status:** `pendente`, `ativa`, `concluida`, `vencida`, `cancelada`

---

## 2. Estrutura de Dados — CRÍTICO

### Planejamento vs Execução

**⚠️ DISTINÇÃO OBRIGATÓRIA:**

| Campo | Propósito | Quando Atualiza |
|-------|-----------|-----------------|
| `usuarios_quest.recorrencias` | **PLANEJAMENTO** — O que foi planejado | Criação/planejamento |
| `conquistas_historico.detalhes` | **EXECUÇÃO** — O que foi concluído | A cada conclusão |

### `usuarios_quest.recorrencias` (JSONB)
```json
{
  "tipo": "diaria",
  "janela": { "inicio": "2025-11-24", "fim": "2025-11-30" },
  "dias": [
    { "data": "2025-11-24", "xp_previsto": 10 }
  ]
}
```
- **Conteúdo:** Apenas planejamento (meta)
- **Não contém:** Status de execução ou conclusões

### `conquistas_historico.detalhes` (JSONB)
```json
{
  "total_concluidas": 3,
  "ocorrencias": [
    {
      "data_planejada": "2025-11-24",
      "data_concluida": "2025-11-24",
      "data_registrada": "2025-11-24T20:00:00Z",
      "xp_base": 10,
      "xp_bonus": 0,
      "usr_chat_id": "uuid-opcional",
      "data_conversa": "2025-11-24-opcional"
    }
  ]
}
```
- **Conteúdo:** Histórico real de conclusões (XP, datas)
- **Para conversas:** Inclui `usr_chat_id` e `data_conversa`

### Regras Críticas

1. **Histórico só existe com conclusões:**
   - Sem conclusões → **NÃO** tem registro em `conquistas_historico`
   - Com conclusões → **1 registro** por `usuarios_quest.id` (todas ocorrências em `detalhes->ocorrencias[]`)

2. **Verificação de conclusão:**
   - Compara: `COUNT(recorrencias->dias[])` vs `detalhes->total_concluidas`

3. **Consolidação XP:**
   - `usuarios_conquistas.xp_total` = soma de todos os XP de `conquistas_historico`

### Relacionamentos

- `usuarios_quest.catalogo_id` → `quests_catalogo.id` (busca XP)
- `conquistas_historico.usuarios_quest_id` → `usuarios_quest.id` (unificado)
- `conquistas_historico.meta_codigo` → legado (compatibilidade)
- `conquistas_historico.tipo` → `'quest'` ou `'conversa'` (filtros)

---

## 3. Conversas (`reflexao_diaria`) — REGRAS ESPECÍFICAS

### Arquitetura de Dados

1. **Fonte de verdade:** `usr_chat` (todos os dados da conversa)
2. **XP/Progresso:** `conquistas_historico` (apenas cálculo, não fonte de dados)
3. **Compatibilidade:** `usuarios_quest` (unificação com outras quests)

### Regras Críticas

1. **Limite diário:** **Apenas 1 conversa por dia conta para XP**
   - Múltiplas conversas no mesmo dia → apenas 1 gera ocorrência
   - Todas registradas em `usr_chat`, mas só 1 em `conquistas_historico`

2. **Estágio inicial:** Sempre `quest_estagio = 'fazendo'` (não precisa aprovação)

3. **Recorrências:** Fixas, usuário **não pode alterar** (todos os dias da semana)

4. **Estrutura de ocorrências:**
   - `data_concluida`: Data da conversa (`usr_chat.data_conversa`)
   - `data_planejada`: Mesma que `data_concluida`
   - `xp_base`: De `quests_catalogo.xp` (padrão: 10)
   - `xp_bonus`: Sempre 0
   - `usr_chat_id`: **OBRIGATÓRIO** (auditoria)
   - `data_conversa`: **OBRIGATÓRIO** (facilita consultas)

5. **Histórico único:** 1 registro quando há ≥1 conversa concluída
   - `tipo = 'conversa'`
   - Todas ocorrências em `detalhes->ocorrencias[]`

---

## 4. Sistema de XP

### Regras

- **XP Base:** De `quests_catalogo.xp` via `catalogo_id`
- **Padrão:** 10 XP (configurável no catálogo)
- **Bônus:** 0 (desabilitado)
- **⚠️ CRÍTICO:** Quest **SEM** `catalogo_id` = **NÃO PERMITIDO** (sem fallback)

### Unificação

- **Tudo é quest:** Conversas = quests do catálogo (`reflexao_diaria`)
- **Mesma lógica:** Estrutura e XP idênticos
- **Tipo mantido:** `tipo` em `conquistas_historico` apenas para filtros

---

## 5. Fluxo de Estágios

1. **Criação:** `a_fazer` (exceto `reflexao_diaria` → `fazendo`)
2. **Aprovação:** `fazendo` (recorrências definidas)
3. **Conclusão:** `feito` (todas recorrências concluídas)

---

## 6. Status Implementado

### ✅ Funcionalidades Ativas

- Conversas, insights, geração de quests
- XP unificado (`quests_catalogo.xp`)
- Unificação conversas/quests
- Quest inicial automática (`reflexao_diaria`)
- Progresso semanal (card home)
- Painel de quests
- Estágios: `a_fazer`, `fazendo`, `feito`
- Separação planejamento/execução
- Verificação automática de conclusão

---

## 7. Estágios da Jornada (Resumo)

Sistema agrupa 10 níveis em 4 estágios para sugerir quests:

- **Fundação (1-3):** Autoconsciência, sabotadores básicos
- **Transformação (4-5):** Consolidação, TCC básica
- **Integração (6-7):** Múltiplas áreas, técnicas avançadas
- **Mestria (8-10):** Impacto social, autonomia total

---

*Documento focado em referência técnica para implementação. Para detalhes completos, ver `quests_1.3.5.md`.*

