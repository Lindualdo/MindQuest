# Análise do Workflow `sw_criar_quest`

**Data:** 2025-01-22  
**Workflow ID:** `LKjU8NE9aNHw7kEh`  
**Status:** Inativo (active: false)  
**Última atualização:** 2025-11-24 13:51:46

---

## Objetivo do Workflow

Criar quests personalizadas para usuários com base em:
- Conversas recentes
- Insights gerados
- Sabotadores detectados
- Quests já ativas do usuário

O agente de IA analisa o contexto e sugere novas quests ou atualizações para quests existentes.

---

## Resumo dos Nodes

### 1. **start** (Execute Workflow Trigger)
- **Tipo:** `n8n-nodes-base.executeWorkflowTrigger`
- **Objetivo:** Recebe entrada do workflow pai
- **Entrada esperada:**
  - `usuario_id` (obrigatório)
  - `chat_id` (opcional)

---

### 2. **Normalizar Entrada**
- **Tipo:** `n8n-nodes-base.code` (JavaScript)
- **Objetivo:** Valida e normaliza os parâmetros de entrada
- **Validação:** Verifica se `usuario_id` existe, caso contrário lança erro
- **Saída:** Objeto normalizado com `usuario_id` e `chat_id`

---

### 3. **Buscar Quests Ativas**
- **Tipo:** `n8n-nodes-base.postgres`
- **Objetivo:** Busca quests ativas/pendentes do usuário
- **Query SQL:**
  - Busca em `public.usuarios_quest`
  - Filtra por `status IN ('pendente', 'ativa')`
  - Retorna: id, status, estagio, catalogo_id, contexto_origem, titulo, descricao, prioridade, recorrência, etc.
- **Observação:** Já busca `catalogo_id` da tabela `usuarios_quest`

---

### 4. **Buscar Conversas Recentes**
- **Tipo:** `n8n-nodes-base.postgres`
- **Objetivo:** Obtém últimas 10 conversas do usuário
- **Query SQL:**
  - Busca em `public.usr_chat`
  - Ordena por `data_conversa DESC, criado_em DESC`
  - Retorna: chat_id, session_id, data_conversa, resumo, tem_reflexao, total_palavras

---

### 5. **Buscar Insights Recentes**
- **Tipo:** `n8n-nodes-base.postgres`
- **Objetivo:** Obtém últimos 10 insights do usuário
- **Query SQL:**
  - Busca em `public.insights`
  - Ordena por `criado_em DESC`
  - Retorna: id, titulo, categoria, tipo, prioridade, resumo_situacao, criado_em
- **Importante:** O agente **DEVE** usar apenas IDs de insights desta lista (validação ocorre depois)

---

### 6. **Buscar Sabotadores Recentes**
- **Tipo:** `n8n-nodes-base.postgres`
- **Objetivo:** Obtém últimos 10 sabotadores detectados para o usuário
- **Query SQL:**
  - Busca em `public.usuarios_sabotadores`
  - Ordena por `data_ultima_atividade DESC`
  - Retorna: id, sabotador_id, apelido, contexto, insight, contramedida, intensidade, etc.

---

### 7. **Listar Áreas da Vida**
- **Tipo:** `n8n-nodes-base.postgres`
- **Objetivo:** Lista todas as áreas da vida disponíveis no catálogo
- **Query SQL:**
  - Busca em `public.areas_vida_catalogo`
  - Filtra por `ativo IS TRUE`
  - Retorna: id, codigo, nome, descricao
- **Uso:** O agente deve usar IDs desta lista para vincular quests a áreas da vida

---

### 8. **Listar Sabotadores Catálogo**
- **Tipo:** `n8n-nodes-base.postgres`
- **Objetivo:** Lista todos os sabotadores disponíveis no catálogo
- **Query SQL:**
  - Busca em `public.sabotadores_catalogo`
  - Retorna: id, nome, emoji, descricao
- **Uso:** O agente deve usar apenas IDs desta lista para referenciar sabotadores

---

### 9. **Montar Contexto**
- **Tipo:** `n8n-nodes-base.code` (JavaScript)
- **Objetivo:** Consolida todos os dados coletados em um único objeto de contexto
- **Processamento:**
  - Calcula quests ativas válidas (status 'pendente' ou 'ativa')
  - Define limite de 3 quests ativas
  - Calcula `slots_disponiveis` = max(0, limite - quests_ativas.length)
  - Verifica se há contexto (conversas recentes > 0)
- **Saída:** Objeto completo com todos os dados necessários para o agente

---

### 10. **Tem Slots?** (IF)
- **Tipo:** `n8n-nodes-base.if`
- **Objetivo:** Verifica se há slots disponíveis para novas quests
- **Condição:** `slots_disponiveis > 0`
- **Fluxo:**
  - **True:** Chama o agente para gerar quests
  - **False:** Pula direto para "Sem Slots" (não chama o agente)

---

### 11. **Sem Slots**
- **Tipo:** `n8n-nodes-base.code` (JavaScript)
- **Objetivo:** Retorna resposta vazia quando não há slots disponíveis
- **Saída:** Array vazio para `novas_quests_sugeridas` e `atualizacoes_sugeridas`

---

### 12. **OpenRouter Chat Model**
- **Tipo:** `@n8n/n8n-nodes-langchain.lmChatOpenRouter`
- **Objetivo:** Modelo de linguagem para o agente
- **Configuração:**
  - `maxTokens: 900`
  - `temperature: 0.2` (baixa para respostas mais determinísticas)

---

### 13. **Agente Quests**
- **Tipo:** `@n8n/n8n-nodes-langchain.agent`
- **Objetivo:** Agente de IA que analisa contexto e gera sugestões de quests
- **Configuração:**
  - `maxIterations: 1`
  - `enableStreaming: false`
- **Prompt:** Ver seção "Resumo do Prompt do Agente" abaixo

---

### 14. **Parser JSON**
- **Tipo:** `@n8n/n8n-nodes-langchain.outputParserStructured`
- **Objetivo:** Valida e estrutura a resposta JSON do agente
- **Schema esperado:** Ver exemplo no node

---

### 15. **Interpretar Resultado**
- **Tipo:** `n8n-nodes-base.code` (JavaScript)
- **Objetivo:** Extrai e normaliza a resposta do agente
- **Processamento:**
  - Trata resposta como string ou objeto
  - Faz parse JSON se necessário
  - Normaliza arrays (sempre array mesmo se vazio)
- **Saída:** Objeto com `novas_quests_sugeridas` e `atualizacoes_sugeridas`

---

### 16. **Aplicar Limites & Dedupe**
- **Tipo:** `n8n-nodes-base.code` (JavaScript)
- **Objetivo:** Valida e filtra as quests sugeridas pelo agente
- **Validações:**
  1. **Deduplicação:** Evita quests duplicadas (comparação por contexto + título)
  2. **Limite:** Máximo de 3 quests ativas (considerando as já existentes)
  3. **Insight ID válido:** Deve existir na lista de insights recentes
  4. **UUID válido:** Valida formato UUID para area_vida_id e insight_id
  5. **Sabotador ID válido:** Deve existir no catálogo de sabotadores
- **Rejeita quest se:**
  - Não tiver `insight_id` válido
  - Título ou contexto vazios
  - Quest duplicada (já existe ativa)
  - Exceder limite de quests ativas
- **Saída:** Array filtrado de `novas_quests` válidas

---

### 17. **Calcula Xps quest** (Execute Workflow)
- **Tipo:** `n8n-nodes-base.executeWorkflow`
- **Objetivo:** Chama sub-workflow `sw_xp_quest` para calcular XP e persistir quests
- **Workflow alvo:** `bTeLj5qOKQo9PDMO` (sw_xp_quest)
- **Parâmetros passados:**
  - `usuario_id`
  - `quests_personalizadas` (JSON string)
  - `atualizacoes_status` (JSON string)
- **Espera:** `waitForSubWorkflow: true`

---

### 18. **Montar Saída**
- **Tipo:** `n8n-nodes-base.code` (JavaScript)
- **Objetivo:** Consolida resposta final do workflow
- **Saída:**
  - `usuario_id`
  - `quests_registradas` (quests criadas)
  - `atualizacoes_enviadas` (atualizações aplicadas)
  - `gamificacao_retorno` (retorno do sw_xp_quest)

---

## Resumo do Prompt do Agente de IA

### Papel do Agente
```
Você é o agente de quests personalizadas do MindQuest.
Considere o contexto abaixo para sugerir novas quests ou atualizar as existentes.
```

### Dados Fornecidos ao Agente

1. **Chat atual:** ID da conversa atual (ou 'N/A')
2. **Quests ativas:** Lista de quests pendentes/ativas do usuário
3. **Conversas recentes (máx. 10):** Histórico de conversas com resumos
4. **Insights recentes (máx. 10):** Insights gerados — **DEVE usar EXATAMENTE os IDs fornecidos**
5. **Sabotadores recentes (máx. 10):** Sabotadores detectados no usuário
6. **Áreas da vida disponíveis:** Catálogo completo — **usar IDs fornecidos**
7. **Sabotadores disponíveis:** Catálogo completo — **usar apenas IDs fornecidos**

### Regras do Agente

1. **Micro-hábitos concretos:** Duração máxima de 7 dias
2. **Limite de quests:** Máximo 4 quests ativas/pendentes (considerando as atuais)
3. **Evitar duplicatas:** Não criar quests com mesmo contexto/título já existente
4. **Atualizações:** Pode sugerir concluir/cancelar/reiniciar quests existentes
5. **Prioridade e recorrência:** Ajustar conforme relevância
6. **Insight obrigatório:** Toda nova quest **DEVE** estar vinculada a um insight da lista fornecida
7. **Sabotador opcional:** Usar apenas IDs do catálogo fornecido; deixar `null` se não aplicável
8. **Área da vida e complexidade:** 
   - Sempre informar `area_vida_id` (usar ID fornecido)
   - Informar `complexidade` entre 0-5 (0 = simples, 5 = altamente desafiador)

### Formato de Resposta

**JSON válido minificado em uma única linha:**

```json
{
  "novas_quests": [
    {
      "titulo": "Check-in matinal",
      "descricao": "Registrar uma vitória pequena toda manhã",
      "contexto_origem": "manter_foco",
      "prioridade": "media",
      "recorrencia": "diaria",
      "prazo_inicio": "2025-11-05",
      "prazo_fim": "2025-11-11",
      "progresso_meta": 5,
      "status_inicial": "pendente",
      "xp_recompensa": 40,
      "insight_id": "uuid-válido",
      "sabotador_id": "id-catálogo-ou-null",
      "area_vida_id": "uuid-válido",
      "complexidade": 2,
      "payload_extra": {"canal": "app"}
    }
  ],
  "atualizacoes": [
    {
      "meta_codigo": "quest_custom_001",
      "instancia_id": "uuid",
      "novo_status": "concluida",
      "progresso_atual": 3,
      "xp_extra": 20
    }
  ]
}
```

**Se nada necessário:** `{"novas_quests": [], "atualizacoes": []}`

---

## Pontos de Atenção para Refactor

### 1. **Uso da Tabela de Catálogo (`quests_catalogo`)**

**Situação Atual:**
- O agente cria quests **totalmente personalizadas** (sem referência ao catálogo)
- As quests são criadas diretamente em `usuarios_quest` com dados no `config` JSONB
- Não há vínculo com `quests_catalogo.catalogo_id` (exceto quests vindas do catálogo diretamente)

**Para Refactor:**
- O agente deve **sugerir quests do catálogo** quando possível
- Se não houver quest do catálogo adequada, pode criar quest personalizada
- Adicionar lógica para buscar quests do catálogo relevantes baseadas em:
  - Categoria do insight
  - Sabotador detectado
  - Área da vida
  - Complexidade necessária

### 2. **Campos que Precisam Ser Ajustados**

**Campos atuais gerados pelo agente:**
- `titulo`, `descricao`, `contexto_origem`, `prioridade`, `recorrencia`
- `prazo_inicio`, `prazo_fim`, `progresso_meta`, `status_inicial`
- `xp_recompensa`, `insight_id`, `sabotador_id`, `area_vida_id`, `complexidade`

**Campos que devem ser considerados no refactor:**
- `catalogo_id` (UUID) — referência à quest no catálogo
- Se `catalogo_id` presente, usar dados do catálogo (`base_cientifica`, `instrucoes`)
- Se `catalogo_id` null, criar quest personalizada (como está hoje)

### 3. **Estrutura de Dados**

**Atualmente as quests são armazenadas assim:**
```javascript
{
  titulo: "...",
  descricao: "...",
  // ... outros campos no config JSONB
}
```

**Deve passar a considerar:**
```javascript
{
  catalogo_id: "uuid-do-catalogo" | null,
  // Se catalogo_id presente, usar:
  // - titulo, descricao, base_cientifica, instrucoes do catálogo
  // - Personalizar apenas: prazo, prioridade, etc.
  // Se catalogo_id null, criar quest custom como antes
}
```

### 4. **Node "Buscar Quests Ativas"**

**Já busca `catalogo_id`**, então está preparado. Mas precisa garantir que o agente e a validação considerem esse campo.

### 5. **Validação em "Aplicar Limites & Dedupe"**

**Atualmente valida:**
- Insight ID válido
- Sabotador ID válido
- Área da vida ID válido
- Deduplicação por contexto+título

**No refactor deve também:**
- Validar `catalogo_id` se fornecido (deve existir na tabela)
- Se `catalogo_id` presente, não duplicar quest do mesmo catálogo já ativa
- Se `catalogo_id` null, manter lógica atual de deduplicação

### 6. **Prompt do Agente**

**Precisará ser atualizado para:**
- Buscar e sugerir quests do catálogo quando adequado
- Informar `catalogo_id` quando usar quest do catálogo
- Manter opção de criar quest personalizada quando não houver do catálogo adequada
- Considerar `base_cientifica` e `instrucoes` do catálogo se usar `catalogo_id`

---

## Fluxo de Execução

```
start
  ↓
Normalizar Entrada
  ↓
Buscar Quests Ativas
  ↓
Buscar Conversas Recentes
  ↓
Buscar Insights Recentes
  ↓
Buscar Sabotadores Recentes
  ↓
Listar Áreas da Vida
  ↓
Listar Sabotadores Catálogo
  ↓
Montar Contexto
  ↓
Tem Slots?
  ├─ SIM → Agente Quests → Interpretar Resultado → Aplicar Limites & Dedupe
  └─ NÃO → Sem Slots ────────────────────────────→ Aplicar Limites & Dedupe
                                                        ↓
                                                  Calcula Xps quest (sw_xp_quest)
                                                        ↓
                                                  Montar Saída
```

---

## Observações Importantes

1. **Workflow inativo:** Status `active: false`, então não está sendo executado automaticamente
2. **Sub-workflow:** Depende de `sw_xp_quest` para persistir as quests
3. **Limite de 3 quests:** Hardcoded no código JavaScript
4. **Dependência de Insights:** Quest sem `insight_id` válido é rejeitada
5. **Validação rígida:** Várias validações no node "Aplicar Limites & Dedupe" garantem qualidade das quests geradas

---

*Documento criado para análise pré-refactor do workflow `sw_criar_quest`*

