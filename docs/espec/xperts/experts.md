# Experts - Regras de Negócio

> Documento executivo: regras de consistência para múltiplas execuções/dia

---

## 1. Job Experts (Agendador)

| Regra | Descrição |
|-------|-----------|
| **Execução** | A cada 30 minutos |
| **Filtro status** | `status != 'finalizado'` (qualquer data) |
| **Filtro palavras** | ≥ 30 palavras do usuário (calculado do JSON) |
| **Limite** | 50 chats por execução |
| **Finalização** | Só marca `finalizado` se `processado = true` |
| **Log** | `log_experts.expert_name = 'hub'` |

---

## 2. Resumo Conversa (Validador de Contexto)

| Regra | Descrição |
|-------|-----------|
| **Entrada** | Delta de mensagens (novas interações) |
| **Saída** | `tem_contexto`, `tem_reflexao`, `resumo_atualizado` |
| **tem_contexto = true** | Conteúdo suficiente para análise dos experts |
| **tem_contexto = false** | Apenas atualiza resumo, pula demais experts |
| **Resumo** | Incorpora ao existente (não substitui), agrupa por temas |

---

## 3. Sabotadores

| Regra | Valor |
|-------|-------|
| **Chave única** | `(usuario_id, sabotador_id, chat_id)` |
| **Constraint** | `usuarios_sabotadores_unique_por_chat` |
| **Intensidade mínima** | ≥ 30 |
| **Consolidação** | 1 registro por sabotador por chat |

### Comportamento UPSERT:
| Campo | INSERT | UPDATE |
|-------|--------|--------|
| `total_deteccoes_dia` | 1 | +1 |
| `total_deteccoes` | 1 | +1 |
| `intensidade_acumulada_dia` | valor | soma |
| `intensidade_media` | valor | **recalcula média** |
| `contexto/insight/contramedida` | valor | mantém se intensidade maior |

---

## 4. Emoções (PANAS)

| Regra | Valor |
|-------|-------|
| **Chave única** | `(chat_id, emocao_id)` |
| **Constraint** | `usuarios_emocoes_chat_emocao_unique` |
| **Intensidade mínima** | ≥ 45 |
| **Consolidação** | 1 registro por emoção por chat |

### Comportamento UPSERT:
| Campo | INSERT | UPDATE |
|-------|--------|--------|
| `ocorrencias_dia` | 1 | +1 |
| `intensidade_acumulada` | valor | soma |
| `intensidade` | valor | **recalcula média** |
| `evidencias` | array | concatena |

---

## 5. Humor e Energia

| Regra | Valor |
|-------|-------|
| **Chave única** | `(chat_id)` |
| **Constraint** | `usuarios_humor_energia_chat_id_unique` |
| **Escala** | 1-10 |
| **Consolidação** | 1 registro por chat |

### Comportamento UPSERT:
| Campo | INSERT | UPDATE |
|-------|--------|--------|
| `ocorrencias_dia` | 1 | +1 |
| `humor_acumulado` | valor | soma |
| `energia_acumulada` | valor | soma |
| `humor_dia` | valor | **recalcula média** |
| `energia_nivel` | valor | **recalcula média** |
| `evidencias_textuais` | array | concatena |

---

## 6. Big Five (Personalidade)

| Regra | Valor |
|-------|-------|
| **Chave única** | `(chat_id)` |
| **Constraint** | `uq_usuarios_perfis_chat` |
| **Consolidação** | **Sobrescreve** (não faz média) |
| **Justificativa** | Personalidade é estável; mais contexto = mais preciso |

### Comportamento UPSERT:
- Todos os scores e confiança são **sobrescritos** com valores mais recentes
- `atualizado_em` = NOW()

---

## 7. Insights

| Regra | Valor |
|-------|-------|
| **Chave única** | `(chat_id)` |
| **Constraint** | `insights_chat_id_unique` |
| **Consolidação** | **Sobrescreve** |
| **Quantidade** | 1 insight por execução |

### Comportamento UPSERT:
- Todos os campos são **sobrescritos** com valores mais recentes
- `criado_em` = NOW()

---

## 8. XP Conversas

| Regra | Valor |
|-------|-------|
| **Quest base** | `775a9df0-6f08-492f-8172-0be057002177` (Reflexão Diária) |
| **XP por conversa válida** | 10 XP (da `quests_catalogo`) |
| **Frequência** | 1x por dia por usuário |
| **Condição** | `tem_contexto = true` E `tem_reflexao = true` |

### Regras de persistência:
| Tabela | Regra |
|--------|-------|
| `usuarios_quest` | 1 registro único por usuário (status = 'ativa') |
| `quests_recorrencias` | 1 registro por dia de conversa válida |
| `usuarios_conquistas` | Incrementa `xp_total` e `total_xp_hoje` |

---

## 9. Criar Quests

| Regra | Valor |
|-------|-------|
| **Trigger** | Após gravar sabotadores |
| **Limite** | Máximo **15 quests** ativas por usuário |
| **Delta mínimo** | ≥ 50 palavras (1ª vez) ou ≥ 30 palavras (reprocessamento) |

### Validações prévias:
| Status | Ação |
|--------|------|
| `delta_insuficiente` | Não processa |
| `limite_atingido` | Não cria novas quests |
| `pode_processar` | Executa lógica de criação |

### Lógica de Sabotadores:
| Cenário | Resultado |
|---------|-----------|
| Sabotador **atual** existe | Usa o atual (prioridade absoluta) |
| Sem atual, existe top 3 | Usa o top 1 histórico |
| Atual **fora** do top 3 + intensidade ≥ 60 | Cria quest adicional para top 1 |

### Tipos de Quest:
| Tipo | Origem |
|------|--------|
| `sabotador` | Gerada do zero (contramedida_ativa + insight_atual) |
| `tcc/estoicismo` | Selecionada do catálogo |
| `personalizada` | Gerada por IA baseada na conversa |

### Reprocessamento (mesmo dia):
- Identifica `quests_substituiveis` (criadas hoje, status=disponível)
- Pode substituir quest anterior por nova com melhor contexto
- Usa `usuarios_quest.config` para rastrear origem

---

## Fluxo de Execução

```
job_experts (30 min)
    │
    ├─ busca_validas (≥30 palavras, não finalizado)
    │
    └─ Para cada chat:
        │
        ├─ sw_experts_v2
        │   │
        │   ├─ 1. Resumo Conversa → tem_contexto?
        │   │
        │   ├─ Se TRUE:
        │   │   ├─ Sabotadores (UPSERT média)
        │   │   ├─ Emoções (UPSERT média)
        │   │   ├─ Humor/Energia (UPSERT média)
        │   │   ├─ Big Five (UPSERT sobrescreve)
        │   │   ├─ Insights (UPSERT sobrescreve)
        │   │   ├─ XP Conversas
        │   │   └─ Criar Quests
        │   │
        │   └─ Se FALSE:
        │       └─ Apenas atualiza resumo
        │
        └─ Se processado = true:
            └─ Marca chat como 'finalizado'
```

---

## Resumo de Constraints

| Tabela | Constraint | Campos |
|--------|------------|--------|
| `usuarios_sabotadores` | `usuarios_sabotadores_unique_por_chat` | `(usuario_id, sabotador_id, chat_id)` |
| `usuarios_emocoes` | `usuarios_emocoes_chat_emocao_unique` | `(chat_id, emocao_id)` |
| `usuarios_humor_energia` | `usuarios_humor_energia_chat_id_unique` | `(chat_id)` |
| `usuarios_perfis` | `uq_usuarios_perfis_chat` | `(chat_id)` |
| `insights` | `insights_chat_id_unique` | `(chat_id)` |
| `log_experts` | `log_experts_chat_expert_unique` | `(chat_id, expert_name)` |

---

*Última atualização: 2025-12-14*
