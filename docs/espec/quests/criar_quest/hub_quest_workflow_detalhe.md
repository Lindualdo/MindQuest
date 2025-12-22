# sw_quest_hub - Resumo dos Blocos

**Versão:** 1.0

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

## 15-18. Placeholders (NoOp)
Marcadores onde vão conectar os sub-workflows dos especialistas

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
10. (Futuro) Especialista cria quest
