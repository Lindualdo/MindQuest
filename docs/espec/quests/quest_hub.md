# Especificação: Motor de Criação de Quests (v1.0)

**Data:** 2025-12-22  
**Status:** Implementado (sw_quest_hub.json)

## 1. Visão Geral

Roteador de criação de quests por **Agentes Especialistas**. Recebe `usuario_id` e `chat_id`, busca contexto completo do banco, aplica regras de negócio e roteia para os especialistas correspondentes.

## 2. Entrada

- `usuario_id` (uuid, obrigatório)
- `chat_id` (uuid, obrigatório)

## 3. Dados Buscados (Query Postgres)

| # | Dado | Uso |
|---|------|-----|
| D1 | Conversas finalizadas | Onboarding (R1) |
| D2 | Humor (via chat_id) | Mentalidade (R3) |
| D3 | Energia (PANAS) | Mentalidade (R3) |
| D4 | Sabotador mais ativo (score) | Sabotador (R4) |
| D4b | Sabotador conversa (>65) | Sabotador (R4) |
| D5 | Objetivos específicos | Objetivos (R5) |
| D6 | Quests criadas hoje | Limite diário (R7) |
| D6b | Quests ativas/disponíveis | Limite total (R7b) |
| D6c | Quests existentes por tipo | Anti-duplicação (R6) |
| D6d | Quests dia a excluir | Recriar quests |
| D7 | Mensagens conversa | Contexto agentes |

## 4. Regras de Negócio

| # | Regra | Condição | Ação | Agente? |
|---|-------|----------|------|---------|
| **R1** | Onboarding | `conversas_finalizadas <= 3` | SAIR | ❌ |
| **R7b** | Limite total | `quests_ativas_disponiveis >= 15` | SAIR | ❌ |
| **R7** | Limite diário | `quests_hoje >= 2` | SAIR (exceto R8) | ❌ |
| **R2** | Pedido explícito | Usuário pede quest | Chamar `personalizada` | ✅ |
| **R3** | Mentalidade | `humor < 5` OU `energia < 5` | Chamar `mentalidade` | ✅ |
| **R4** | Sabotador | Score alto OU intensidade > 65 | Chamar `sabotador` | ✅ |
| **R5** | Objetivos | Objetivos específicos ativos | Chamar `objetivos` | ✅ |
| **R6** | Anti-duplicação | Quest similar existe | NÃO criar | ✅ |
| **R8** | Exceção limite | Pedido explícito | Ignora R7 | ✅ |

### Regra Especial: Recriar Quests do Dia

- Quests criadas no dia com status `disponivel` são excluídas e recriadas
- Quests com status `ativa` (fazendo) **NÃO** são excluídas
- Reflexão diária nunca é excluída (`catalogo_id != '775a9df0-...'`)

## 5. Agentes Especialistas

| Tipo | Sub-workflow | Foco |
|------|--------------|------|
| **mentalidade** | `sw_quest_mentalidade` | TCC, Estoicismo, regulação emocional |
| **sabotador** | `sw_quest_sabotador` | Neutralizar sabotador detectado |
| **objetivos** | `sw_quest_objetivos` | Micro-ações ligadas aos objetivos |
| **personalizada** | `sw_quest_personalizada` | Atender pedido direto do usuário |

## 6. Output do Agente Roteador

```json
{
  "pode_criar": true,
  "pedido_explicito": false,
  "destinos": [
    {
      "tipo": "mentalidade|sabotador|objetivos|personalizada",
      "prioridade": 1,
      "catalogo_sugerido": "codigo_catalogo",
      "contexto": { ... }
    }
  ],
  "excluidos": [
    { "tipo": "sabotador", "motivo": "quest_similar_existe" }
  ],
  "justificativa": "Breve explicação"
}
```

## 7. Fluxo do Workflow

```
start → Buscar Contexto → Excluir Quests Dia → Verificar Limites
      → IF Pode Processar?
          ├─ TRUE → Agente Roteador → Processar Roteamento
          │         → IF Tem Destinos?
          │             ├─ TRUE → Preparar Loop → Switch Tipo
          │             │         → sw_quest_{tipo}
          │             └─ FALSE → Saida Sem Destinos
          └─ FALSE → Saida Bloqueado
```

## 8. Próximos Passos

- [ ] Implementar `sw_quest_mentalidade`
- [ ] Implementar `sw_quest_sabotador`
- [ ] Implementar `sw_quest_objetivos`
- [ ] Implementar `sw_quest_personalizada`
- [ ] Conectar Execute Workflow nos placeholders
