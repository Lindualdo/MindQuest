# Nodes Detalhados - mentor_mindquest

**Data:** 2025-12-01 22:00  
**Workflow ID:** `c1To6ho5riDs85Aj`

---

## Nodes Já Criados ✅

### 1. start (executeWorkflowTrigger)
- ✅ Criado
- Inputs: usr_id, body.instance, body.data.*

### 2. config (DataTable)
- ✅ Criado
- DataTable ID: fVrO1PaqFuA957u0

### 3. contexto_completo (Code)
- ✅ Criado (versão simplificada)
- **PRECISA:** Implementar queries SQL completas

### 4. transcricao (executeWorkflow)
- ✅ Criado
- Workflow: jUAvu7DUAzyqZhJd (sw_chat_transcription)

### 5. memory (Redis Chat Memory)
- ✅ Criado
- SessionKey: `{{instance}}{{usr_id}}{{whatsapp_numero}}`
- TTL: 43200

### 6. memory_get (memoryManager)
- ✅ Criado
- Group: true

### 7. interacao_controle (Code)
- ✅ Criado
- Detecta can_end_early

### 8. memory_insert (memoryManager)
- ✅ Criado

### 9. verifica_encerramento (Switch)
- ✅ Criado
- 4 saídas configuradas

---

## Nodes a Criar

### 10. openrouter_model
```json
{
  "id": "openrouter_model",
  "name": "openrouter_model",
  "type": "@n8n/n8n-nodes-langchain.lmChatOpenRouter",
  "typeVersion": 1,
  "position": [1200, 400],
  "parameters": {},
  "credentials": {
    "openRouterApi": {
      "id": "rSnkOnnAHyfayLJt",
      "name": "OpenRouter account"
    }
  }
}
```

### 11. get_history
```json
{
  "id": "get_history",
  "name": "get_history",
  "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
  "typeVersion": 2.2,
  "position": [1400, 400],
  "parameters": {
    "description": "Use this tool to search the history of users latest conversations.",
    "workflowId": {
      "__rl": true,
      "value": "HDTrSrJiBIv2FFks",
      "mode": "list"
    },
    "workflowInputs": {
      "mappingMode": "defineBelow",
      "value": {
        "usr_id": "={{ $('contexto_completo').first().json.usuario_id }}"
      }
    }
  }
}
```

### 12. user_conversation_guide
```json
{
  "id": "user_conversation_guide",
  "name": "user_conversation_guide",
  "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
  "typeVersion": 2.2,
  "position": [1600, 400],
  "parameters": {
    "description": "call this tool to guide the user on what to talk to the assistant about",
    "workflowId": {
      "__rl": true,
      "value": "aMJIDSGZkNbcPxjc",
      "mode": "list"
    },
    "workflowInputs": {
      "mappingMode": "defineBelow",
      "value": {}
    }
  }
}
```

### 13. agent_conversation_guide
```json
{
  "id": "agent_conversation_guide",
  "name": "agent_conversation_guide",
  "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
  "typeVersion": 2.2,
  "position": [1800, 400],
  "parameters": {
    "description": "call this tool to guide the agent on what to talk to the user about",
    "workflowId": {
      "__rl": true,
      "value": "QIlkK8StiAVCwY0U",
      "mode": "list"
    },
    "workflowInputs": {
      "mappingMode": "defineBelow",
      "value": {}
    }
  }
}
```

### 14. mentor_agent
```json
{
  "id": "mentor_agent",
  "name": "mentor_agent",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 2.2,
  "position": [1600, 0],
  "parameters": {
    "promptType": "define",
    "text": "=# 💬 MINDQUEST — MENTOR\n\nVocê é o Mentor do MindQuest.\n\n## 🎯 FRAMEWORK\nCONVERSAR → ENTENDER → AGIR → EVOLUIR\n\n**CONVERSAR (sua fase):**\n- Conduzir conversas guiadas\n- Explorar padrões mentais e bloqueios\n- Conectar com objetivos específicos\n- Preparar contexto rico para experts\n\n**Interação:** {{ $('interacao_controle').item.json.interaction_count }} / {{ $('interacao_controle').item.json.limit_max }}\n**Mensagem:** {{ $('transcricao').item.json.message }}\n\n## 🎯 DIRETRIZES\n{{ (() => {\n  const count = Number($('interacao_controle').item.json.interaction_count);\n  const max = Number($('interacao_controle').item.json.limit_max);\n  const canEnd = $('interacao_controle').item.json.can_end_early || false;\n  \n  if (count === 1) return '- Chame `get_history`. Abra com acolhimento. Use objetivos para personalizar.';\n  if (count >= 5 && canEnd) return '- Pode encerrar se usuário concordar. Pergunte: \"Quer continuar ou prefere encerrar?\"';\n  if (count === max - 1) return '- Resumo breve e empático. Confirme se faz sentido.';\n  if (count === max) return '- Reconheça avanços, conclua com leveza. Convide App.';\n  return '- Mantenha orgânica. Aprofunde temas. Conecte objetivos. Varie abordagem.';\n})() }}\n\n## 📝 COLETA DE CONTEXTO\nIdentifique: contextos, sentimentos, eventos, padrões, bloqueios, progressos, objetivos.\n**Na última interação:** Inclua JSON estruturado após sua mensagem.\n\n## 🎨 VARIAÇÃO\nVarie: profundidade, tom, estrutura, foco.\n\n**Regras:**\n- Acolhedor, construa rapport\n- Conduza objetiva (evite vagas/vazias)\n- Crie desejo de retorno\n- Facilite experts (colete informações ricas)\n- Torne dinâmica (varie, evite repetição)",
    "options": {
      "systemMessage": "=# 🧠 MENTOR MINDQUEST\n\n## 🎯 PROPÓSITO\nVocê é o **Mentor do MindQuest**, motor que impulsiona o sistema.\n\n**Objetivos:**\n1. Construir rapport\n2. Conduzir conversa objetiva\n3. Criar desejo de retorno\n4. Facilitar experts\n5. Tornar dinâmica\n\n## 🧩 CONTEXTO\n- WhatsApp\n- Limites: {{ $('interacao_controle').item.json.limit_min }}-{{ $('interacao_controle').item.json.limit_max }}\n- Interação: {{ $('interacao_controle').item.json.interaction_count }}\n\n## 🔢 COMO AGIR\n1. **Interação 1:** Chame `get_history`. Acolha.\n2. **Interações 2-N-1:** Explore emoções, histórias.\n3. **Interação N-1:** Resumo breve.\n4. **Interação N:** Reconheça, conclua, convide App.\n\n## 📐 FORMATO\n- Parágrafos curtos (3 frases) com linha em branco\n- Bullets `•` para sugestões\n- Linguagem coloquial\n- Finalize com pergunta\n\n## 🛠️ FERRAMENTAS\n- `get_history`: 1ª interação\n- `user_conversation_guide`: Quando usuário pedir ajuda\n- `agent_conversation_guide`: Para aprofundamento\n\n## 🚫 RESTRIÇÕES\n- Não mencione ser IA\n- Não aconselhamento médico\n- Não explique App (apenas convide)\n\n## 🧭 MISSÃO\nAbra espaço seguro, explore emoções, conecte percepções, encerre com leveza."
    }
  }
}
```

### 15. processa_resposta
```json
{
  "id": "processa_resposta",
  "name": "processa_resposta",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [1800, 0],
  "parameters": {
    "jsCode": "// PROCESSA RESPOSTA DO MENTOR\nconst aiResponse = $input.first()?.json?.output ?? '';\nconst interacao = $('interacao_controle').first().json;\nconst contexto = $('contexto_completo').first().json;\n\nconst isLastInteraction = interacao.interaction_count >= interacao.limit_max;\n\n// Tenta extrair JSON de contexto (se última interação)\nlet userMessage = aiResponse;\nlet contextJson = null;\n\nif (isLastInteraction) {\n  const jsonPattern = /\\{[\\s\\n]*\"contextos_mencionados\"/;\n  const match = aiResponse.match(jsonPattern);\n  \n  if (match) {\n    const jsonStart = match.index;\n    userMessage = aiResponse.substring(0, jsonStart).trim();\n    const jsonString = aiResponse.substring(jsonStart).trim();\n    \n    try {\n      contextJson = JSON.parse(jsonString);\n    } catch (err) {\n      console.error('Erro ao parsear JSON:', err);\n    }\n  }\n}\n\nreturn {\n  user_message: userMessage,\n  context_json: contextJson,\n  has_context: contextJson !== null,\n  interaction_count: interacao.interaction_count,\n  is_last_interaction: isLastInteraction,\n  limit_max: interacao.limit_max\n};"
  }
}
```

### 16. envia_mensagem
```json
{
  "id": "envia_mensagem",
  "name": "envia_mensagem",
  "type": "n8n-nodes-base.executeWorkflow",
  "typeVersion": 1.3,
  "position": [2000, 0],
  "parameters": {
    "workflowId": {
      "__rl": true,
      "value": "DJB5qWudX1Hqap1O",
      "mode": "list"
    },
    "workflowInputs": {
      "mappingMode": "defineBelow",
      "value": {
        "instanceName": "={{ $('start').first().json['body.instance'] }}",
        "remoteJidOrNumber": "={{ $('start').first().json['body.data.key.remoteJid'] }}",
        "messageText": "={{ $('processa_resposta').first().json.user_message }}",
        "linkPreview": "false",
        "minDelayMs": "3000"
      }
    },
    "options": {
      "waitForSubWorkflow": true
    }
  }
}
```

### 17. grava_conversa (Code)
```json
{
  "id": "grava_conversa",
  "name": "grava_conversa",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [2200, 0],
  "parameters": {
    "jsCode": "// GRAVA CONVERSA COMPLETA\nconst memoryData = $('memory_get').first().json;\nconst processa = $('processa_resposta').first().json;\nconst contexto = $('contexto_completo').first().json;\nconst startData = $('start').first().json;\nconst transcricao = $('transcricao').first().json;\n\n// Extrai mensagens do memory\nconst messages = Array.isArray(memoryData?.messages) ? memoryData.messages : [];\nconst mensagens = [];\nlet interactionNumber = 1;\n\nfor (const msg of messages) {\n  if (!msg || typeof msg !== 'object') continue;\n  \n  const humanTexto = (msg.human || (msg.role === 'user' && msg.content) || '').trim();\n  const aiTexto = (msg.ai || (msg.role === 'assistant' && msg.content) || '').trim();\n  \n  if (humanTexto && !humanTexto.toLowerCase().startsWith('sistema:')) {\n    mensagens.push({\n      interaction: interactionNumber,\n      autor: 'usuario',\n      texto: humanTexto,\n      timestamp: new Date().toISOString()\n    });\n  }\n  \n  if (aiTexto) {\n    mensagens.push({\n      interaction: interactionNumber,\n      autor: 'agente',\n      texto: aiTexto,\n      timestamp: new Date().toISOString()\n    });\n    interactionNumber++;\n  }\n}\n\n// Adiciona última mensagem do agente\nif (processa.user_message) {\n  mensagens.push({\n    interaction: interactionNumber,\n    autor: 'agente',\n    texto: processa.user_message,\n    timestamp: new Date().toISOString()\n  });\n}\n\nconst sessionId = `${startData['body.instance']}${startData.usr_id}${transcricao.WhstsApp_Number}`;\n\n// Contexto estruturado\nconst contextoFinal = processa.context_json || {\n  contextos_mencionados: [],\n  sentimentos_expressos: [],\n  eventos_importantes: [],\n  padroes_identificados: [],\n  bloqueios_mencionados: [],\n  progressos_celebrados: [],\n  objetivos_referenciados: [],\n  intensidade_geral: 'media',\n  qualidade_interacao: 'profunda'\n};\n\nreturn {\n  whatsapp_numero: transcricao.WhstsApp_Number,\n  usuario_id: contexto.usuario_id,\n  session_id: sessionId,\n  total_interactions: processa.interaction_count,\n  status: 'completa',\n  mensagens: JSON.stringify(mensagens),\n  contexto_final: JSON.stringify(contextoFinal),\n  motivo_encerramento: processa.is_last_interaction ? 'limite_maximo' : 'conversa_completa'\n};"
  }
}
```

### 18. grava_chat (Postgres)
```json
{
  "id": "grava_chat",
  "name": "grava_chat",
  "type": "n8n-nodes-base.postgres",
  "typeVersion": 2.6,
  "position": [2400, 0],
  "parameters": {
    "operation": "executeQuery",
    "query": "INSERT INTO usr_chat (\n    usuario_id, session_id, total_interactions, status,\n    mensagens, data_conversa, horario_inicio, horario_fim\n) VALUES (\n    $1, $2, $3, $4,\n    $5::jsonb, CURRENT_DATE, CURRENT_TIME, CURRENT_TIME\n)\nRETURNING id, usuario_id, data_conversa, status;",
    "options": {
      "queryReplacement": "={{[ $json.usuario_id, $json.session_id, $json.total_interactions, $json.status, $json.mensagens ]}}"
    }
  },
  "credentials": {
    "postgres": {
      "id": "8ySWxtSO7gYK5uue",
      "name": "Postgres account"
    }
  }
}
```

---

## Conexões Necessárias

### Main Flow
- `verifica_encerramento` (case 1: "> max") → `encerra_forcado` (criar)
- `verifica_encerramento` (case 2: ">= min AND can_end_early") → `mentor_agent`
- `verifica_encerramento` (case 3: "=== max") → `mentor_agent`
- `verifica_encerramento` (case 4: "< max AND !can_end_early") → `mentor_agent`
- `mentor_agent` → `processa_resposta`
- `processa_resposta` → `envia_mensagem` (se não última) OU `grava_conversa` (se última)
- `envia_mensagem` → `memory_get` (loop)
- `grava_conversa` → `grava_chat`
- `grava_chat` → `experts` (paralelo)

### AI Connections
- `openrouter_model` → `mentor_agent` (ai_languageModel)
- `get_history` → `mentor_agent` (ai_tool)
- `user_conversation_guide` → `mentor_agent` (ai_tool)
- `agent_conversation_guide` → `mentor_agent` (ai_tool)
- `memory` → `mentor_agent` (ai_memory)

---

## Implementação do contexto_completo

**Query SQL consolidada:**
```sql
-- Buscar tudo em uma query ou múltiplas queries no Code node
-- Dados usuário, objetivos, sabotador, quests, histórico, perfil bigfive
```

**Estrutura de retorno:**
```javascript
{
  usuario_id: "...",
  nome_preferencia: "...",
  objetivos_especificos: [{id, area_vida, descricao}],
  objetivo_padrao: {id, area_vida, descricao},
  sabotador_mais_ativo: "...",
  quests_ativas: [{id, titulo, tipo}],
  ultimas_conversas: [{id, data_conversa, resumo_conversa}],
  perfil_bigfive: {perfil_primario, perfil_secundario, resumo_perfil},
  limit_min: 5,
  limit_max: 20
}
```

---

## Checklist de Implementação

- [ ] Adicionar openrouter_model
- [ ] Adicionar get_history tool
- [ ] Adicionar user_conversation_guide tool
- [ ] Adicionar agent_conversation_guide tool
- [ ] Adicionar mentor_agent com prompt completo
- [ ] Conectar AI connections (languageModel, tools, memory)
- [ ] Adicionar processa_resposta
- [ ] Adicionar envia_mensagem
- [ ] Adicionar grava_conversa
- [ ] Adicionar grava_chat
- [ ] Implementar queries SQL em contexto_completo
- [ ] Adicionar experts (paralelo)
- [ ] Adicionar encerra_forcado
- [ ] Testar fluxo completo

