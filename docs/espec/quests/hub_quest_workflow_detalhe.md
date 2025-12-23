# sw_quest_hub - Resumo dos Blocos

**Versão:** 1.0

---

## Visão Geral Executiva

O `sw_quest_hub` é o **roteador inteligente** que decide quais quests criar para o usuário.

### Como Funciona

1. **Busca contexto** do usuário (humor, energia, emoções, sabotadores, objetivos)
2. **Verifica bloqueios** (onboarding, limites diários/totais)
3. **Agente IA decide** quais tipos de quest criar
4. **Roteia** para especialistas que criam as quests

### Regras de Criação

**Bloqueios (não cria):**
- R1: Usuário em onboarding (≤3 conversas)
- R7b: Limite de 15 quests ativas/disponíveis

**Decisão do Agente (quais tipos criar):**
- R2: Pedido explícito → cria "personalizada" (ignora limite diário)
- R3: Humor/energia < 5 → cria "mentalidade"
- R4: Sabotador detectado (intensidade > 65) → cria "sabotador"
- R5: Objetivos + conversa menciona progresso → cria "objetivos"
- R6: Anti-duplicação → não cria se já existe similar

**Limite Final:**
- R7: Máximo 2 quests/dia (exceto pedido explícito)

### Especialistas

Cada tipo roteia para um workflow específico:
- **Mentalidade** → técnicas TCC/regulação emocional
- **Sabotador** → contramedidas baseadas em padrão detectado
- **Objetivos** → ações ligadas aos objetivos do usuário
- **Personalizada** → baseada em pedido explícito da conversa

---

## 1. start
Recebe `usuario_id` e `chat_id`

## 2. Buscar Contexto (Postgres)
Query CTE única que busca tudo: conversas, humor, energia, sabotadores, objetivos, quests existentes, mensagens

## 3. Excluir Quests Dia (Postgres)
Deleta quests do dia com status `disponivel` (NÃO deleta `ativa` nem reflexão diária)

## 4. Verificar Limites (Code)
Aplica R1 (onboarding ≤3), R7 (limite 2/dia), R7b (limite 15 total) SEM usar IA

## 5. Pode Processar? (IF)
Se bloqueado → vai para Saida Bloqueado
Se ok → vai para Agente Roteador

## 6. Saida Bloqueado (Code)
Retorna JSON: `{ sucesso: false, motivo: '...', quests_criadas: [] }`

## 7. OpenRouter (LLM)
Modelo de IA (Gemini 2.0 Flash)

## 8. Parser Roteador
Força agente a retornar JSON estruturado válido

## 9. Agente Roteador (IA)
DECIDE quais tipos de quest criar (não cria, só roteia)
Aplica R2 (pedido explícito), R3 (mentalidade), R4 (sabotador), R5 (objetivos), R6 (anti-duplicação)

## 10. Processar Roteamento (Code)
Processa output do agente, aplica limite diário final, ordena por prioridade

## 11. Tem Destinos? (IF)
Se tem destinos → Preparar Loop
Se vazio → Saida Sem Destinos

## 12. Preparar Loop (Code)
Transforma array de destinos em múltiplos items (1 por destino)

## 13. Saida Sem Destinos (Code)
Retorna: `{ sucesso: true, motivo: 'sem_destinos', quests_criadas: [] }`

## 14. Switch Tipo
Roteia cada destino para o especialista:
- mentalidade → sw_quest_mentalidade
- sabotador → sw_quest_sabotador
- objetivos → sw_quest_objetivos
- personalizada → sw_quest_personalizada

## 15-18. Sub-workflows Especialistas (Execute Workflow)
Chamam os workflows de criação de quests:
- sw_quest_mentalidade (wYvNVnfs7T16H3zv)
- sw_quest_sabotador (0fwtdzQoUdwqkJCc)
- sw_quest_objetivos (tnTuBpFMexq6lz7Z)
- sw_quest_personalizada (DaiEAB3m8Ey9Nuzy)

## 19. Sticky Note
Documentação visual no canvas (não executa nada)

---

## Fluxo Resumido

1. Recebe usuario_id + chat_id
2. Busca contexto (1 query)
3. Exclui quests do dia
4. Verifica limites básicos
5. Se bloqueado → SAI
6. Agente IA decide tipos
7. Processa decisão
8. Se tem destinos → loop
9. Switch roteia para especialista
10. Especialista cria quest e insere no banco

## Contexto Enviado aos Especialistas

Todos os sub-workflows especialistas recebem o **mesmo contexto estruturado**:

### Dados Comuns

```json
{
  "usuario_id": "uuid",
  "chat_id": "uuid",
  "contexto": {
    // Resumo da conversa
    "resumo_conversa": "texto processado pelo sistema",
    "pedido_quest": "NENHUM PEDIDO" ou "texto do pedido explícito",
    
    // Estado emocional
    "humor": 6,
    "energia": 6,
    "justificativa_humor": "texto da justificativa",
    "justificativa_energia": "texto da justificativa",
    
    // Emoções detectadas (top 3)
    "emocoes": [
      {
        "emocao": "alegria",
        "intensidade": 80,
        "contexto": "evidências da detecção"
      }
    ],
    "emocoes_texto": "alegria (80%): contexto; ansiedade (65%): contexto",
    
    // Sabotador
    "sabotador_id": "critico" ou null,
    "sabotador_nome": "Crítico Interior" ou null,
    "intensidade": 75,
    "insight_atual": "texto do insight gerado",
    "contramedida_ativa": "texto da contramedida",
    
    // Objetivos do usuário
    "objetivos_especificos": [
      {
        "id": "uuid",
        "titulo": "título do objetivo",
        "detalhamento": "detalhes",
        "area_vida_id": "uuid"
      }
    ],
    
    // Anti-duplicação
    "quests_existentes": [
      {
        "id": "uuid",
        "catalogo_id": "uuid",
        "status": "ativa",
        "categoria": "tcc",
        "codigo": "respiracao",
        "config": {}
      }
    ],
    
    // Metadados
    "usuario_id": "uuid",
    "chat_id": "uuid"
  }
}
```

### Foco por Especialista

- **sw_quest_mentalidade** → `humor`, `energia`, `emocoes`
- **sw_quest_sabotador** → `sabotador_id`, `intensidade`, `insight_atual`
- **sw_quest_objetivos** → `objetivos_especificos`, `resumo_conversa`
- **sw_quest_personalizada** → `pedido_quest`, `resumo_conversa`


