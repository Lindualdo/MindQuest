# Quests - Referência Core

**Data:** 2025-12-04

## Conceito

Micro-ações personalizadas geradas automaticamente a partir de conversas, insights e sabotadores. Transformam conversas em ações práticas.

## Tipos

| Tipo | Descrição |
|------|-----------|
| **Reflexão Diária** | Quest permanente (conversas com mentor) |
| **Personalizada** | IA contextual (baseada em conversas) |
| **Sabotador** | Superar padrões limitantes |
| **TCC/Estoicismo** | Técnicas comportamentais |


## Status

- **Disponível** → Criada, aguardando ativação
- **Ativa** → Em execução com recorrências planejadas
- **Inativa** → Todas ocorrências concluídas/vencidas (pode reativar)

## Ciclo de Vida

```
Criada (disponível) → Ativa (recorrências) → Concluída → Inativa
```

**Flexibilidade:** Quest "disponível" pode ser concluída diretamente sem planejamento. Sistema cria registro em `quests_recorrencias` automaticamente.

## Recorrências

- Usuário define dias da semana
- Cada dia gera ocorrência (pendente/concluída/perdida)
- Conversas: recorrência diária automática (sempre ativa)

## Objetivos

### Estrutura

| Tipo | Quantidade | Descrição |
|------|-----------|-----------|
| **Padrão** | 1 (obrigatório) | "Evolução Pessoal" - Autoconhecimento |
| **Específicos** | 0-2 (opcional) | Finanças, Trabalho, Saúde, etc. |

**Total máximo:** 3 objetivos (1 padrão + 2 específicos)

### Relação Quest × Objetivos (N:N)

- Catálogo → objetivo padrão
- Sabotador → padrão + específico relacionado
- Personalizada → específico ou padrão
- Reflexão Diária → padrão

## Tabelas

| Tabela | Conteúdo |
|--------|----------|
| `usuarios_quest` | Quest pai (ID, status, tipo, contexto) |
| `quests_recorrencias` | Ocorrências (data, status: pendente/concluída/perdida) |
| `usuarios_objetivos` | Objetivos (área, prazo, progresso) |
| `quest_objetivos` | Relação N:N (quest ↔ objetivos) |
| `usuarios_conquistas` | XP total, nível, estágio, streak |

## XP e Jornada

### Cálculo de XP
- **Conversas:** Calculado automaticamente pelo mentor
- **Quests:** 10 XP por quest concluída
- **Níveis:** Baseado em XP total

### Estágios da Jornada (1-4)
- **Estágio 1** (Níveis 1-3): Explorador → Aprendiz → Observador
- **Estágio 2** (Níveis 4-6): Focado → Praticante → Consciente
- **Estágio 3** (Níveis 7-9): Iluminado → Sábio → Ascendente
- **Estágio 4** (Nível 10+): Mestre → Mentor

## Workflows n8n (Core)

### Criação e XP
- `sw_criar_quest` → Gera 3 quests (personalizada, sabotador, TCC)
- `sw_xp_quest` → Persiste e calcula XP ao concluir
- `sw_xp_conversas` → XP de conversas + reflexão diária
- `sw_calcula_jornada` → Nível e estágio

### Jobs Batch
- `job_batch_generate_quests` → Geração em lote
- `job_batch_xp_quest` → Processamento XP em lote
- `job_batch_xp_conversas` → Processamento conversas em lote

### Webhooks Interface
- `webhook_quests` → Listagem (GET/POST)
- `webhook_concluir_quest` → Conclusão
- `webhook_ativar_quest` → Ativação
- `webhook_quest_detail` → Detalhes
- `webhook_criar-quest` → Criação manual
- `webhook_progresso_semanal` → Progresso semanal
- `webhook_evoluir_stats` → Estatísticas

## Regras Críticas

1. **Workflows `sw_*`** → Exclusivos do agente IA (NUNCA alterar)
2. **Workflows `webhook_*`** → Para interface/APIs
3. **Quest disponível** → Pode ser concluída sem planejamento
4. **Reflexão Diária** → Sempre ativa, nunca expira
5. **Objetivo Padrão** → Não pode ser excluído

## Documentação Completa

Ver `docs/espec/quests/` para detalhes completos.

