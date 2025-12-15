# Refatoração Experts v3

> **Objetivo:** Simplificar processamento de conversas eliminando controle de delta e logs complexos.

---

## Visão Geral

### Modelo Atual (v2)
- Job verifica delta de mensagens (novas desde último processamento)
- Valida mínimo de 30 palavras no delta
- Controla processamento via `log_experts`
- Experts processam apenas mensagens novas

### Modelo Novo (v3)
- Job verifica apenas se houve atualização no chat
- Experts recebem conversa completa
- Controle via campo `processado_em` em `usr_chat`
- DELETE + INSERT para dados derivados (sem acúmulo)

---

## 1. Job Experts

### Responsabilidade
Identificar chats que precisam ser processados e disparar o workflow de experts.

### Regra de Seleção
| Critério | Descrição |
|----------|-----------|
| **Novidade** | `atualizado_em > processado_em` |
| **Período** | Apenas chats do dia atual |
| **Status** | Qualquer status (não depende de "finalizado") |

### Fluxo
1. Buscar chats com novidades
2. Para cada chat: chamar `sw_experts`
3. Após sucesso: atualizar `processado_em = NOW()`

### Frequência
- Execução a cada **30 minutos**

---

## 2. SW Experts - Resumo da Conversa

### Responsabilidade
Gerar resumo executivo da conversa e identificar se há contexto suficiente para análises profundas.

### Entrada
- Conversa completa (todas as mensagens do chat)

### Saída
| Campo | Descrição |
|-------|-----------|
| `resumo` | Síntese da conversa |
| `tem_contexto` | Se há profundidade para análises |
| `tem_reflexao` | Se usuário demonstrou reflexão |

### Regra de Contexto
Se `tem_contexto = false`, os experts de análise profunda **não são executados**.

---

## 3. SW Experts - Sabotadores

### Responsabilidade
Identificar padrões de autossabotagem baseados no modelo de Shirzad Chamine.

### Comportamento
1. **DELETE** registros existentes do chat
2. Analisar conversa completa
3. **INSERT** sabotadores detectados (intensidade ≥ 30)

### Dados Gerados
- Sabotador identificado (do catálogo)
- Intensidade (0-100)
- Contexto da detecção
- Contramedida sugerida

---

## 4. SW Experts - Emoções (PANAS)

### Responsabilidade
Classificar emoções usando modelo PANAS (Positive and Negative Affect Schedule) e Plutchik.

### Comportamento
1. **DELETE** registros existentes do chat
2. Analisar conversa completa
3. **INSERT** emoções detectadas

### Dados Gerados
- Emoções primárias (Plutchik)
- Classificação PANAS (positivo/negativo/neutro)
- Intensidade por emoção

---

## 5. SW Experts - Humor e Energia

### Responsabilidade
Avaliar estado de humor e nível de energia do usuário.

### Comportamento
1. **DELETE** registro existente do chat
2. Analisar conversa completa
3. **INSERT** avaliação

### Dados Gerados
- Nível de humor (-5 a +5)
- Nível de energia (0-100)
- Contexto/justificativa

---

## 6. SW Experts - Big Five (Personalidade)

### Responsabilidade
Inferir traços de personalidade baseados no modelo OCEAN.

### Comportamento
1. **DELETE** registro existente do chat
2. Analisar conversa completa
3. **INSERT** perfil

### Dados Gerados
| Traço | Escala |
|-------|--------|
| Openness | 0-100 |
| Conscientiousness | 0-100 |
| Extraversion | 0-100 |
| Agreeableness | 0-100 |
| Neuroticism | 0-100 |

---

## 7. SW Experts - Insights

### Responsabilidade
Gerar insights acionáveis baseados na conversa.

### Comportamento
1. **DELETE** registro existente do chat
2. Analisar conversa completa
3. **INSERT** insight principal

### Dados Gerados
- Insight principal
- Área de vida relacionada
- Sugestão de ação
- Prioridade

---

## 8. Criar Quests

### Responsabilidade
Gerar quests personalizadas baseadas nos insights e contexto da conversa.

### Dependência
- Executado após geração de insights
- Usa insight como base para personalização

### Sem Alteração
Este módulo **não muda** na v3 - continua recebendo contexto e gerando quests.

---

## Mudanças Críticas

### Tabela `log_experts`
| Ação | Motivo |
|------|--------|
| **DESCONTINUAR** | Controle migra para `processado_em` em `usr_chat` |

### Campo Novo em `usr_chat`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `processado_em` | timestamp | Última execução dos experts |

### Validações Removidas
| Validação | Motivo |
|-----------|--------|
| Delta de mensagens | Processa conversa completa |
| Mínimo 30 palavras no delta | Expert decide se tem contexto |
| Controle `ultima_interaction` | Substituído por `processado_em` |
| Status "finalizado" | Não mais necessário para controle |

### Constraints de UPSERT → DELETE + INSERT
| Tabela | Constraint Atual | Nova Abordagem |
|--------|------------------|----------------|
| `usuarios_sabotadores` | `(usuario_id, sabotador_id, chat_id)` | DELETE by chat_id |
| `usuarios_emocoes` | `(chat_id, emocao_id)` | DELETE by chat_id |
| `usuarios_humor_energia` | `(chat_id)` | DELETE by chat_id |
| `usuarios_perfis` | `(chat_id)` | DELETE by chat_id |
| `insights` | `(chat_id)` | DELETE by chat_id |

---

## Benefícios

1. **Simplicidade** - Sem lógica de delta complexa
2. **Consistência** - Dados sempre refletem conversa completa
3. **Manutenção** - Menos código, menos bugs
4. **Debugging** - Estado previsível (DELETE + INSERT)

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Custo de API (reprocessar tudo) | Expert valida contexto antes de chamar LLMs |
| Perda de histórico intra-dia | Aceitável - objetivo é snapshot atual |
| Chats muito longos | Limitar a últimas N mensagens se necessário |

---

## Workflows Criados

| Workflow | ID | Status |
|----------|-----|--------|
| `job_experts_v3` | `BdfMcFNxLd0CbwZN` | ✅ Criado (inativo) |
| `sw_experts_v3` | `DztMpxVJw7Mvfke8` | ✅ Criado (inativo) |

### Pendências para Ativar

1. **Adicionar campo `processado_em`** em `usr_chat` (migration SQL)
2. **Testar** com chat de exemplo
3. **Ativar** `job_experts_v3` e desativar `job_experts_v2`

