# Plano de Mudança - Mentor MindQuest v1.3.13

**Data:** 2025-12-01 21:00  
**Workflow:** `sw_chat_interations_v2` (ID: `aRonGjwfYoY1UUHH`)  
**Node Principal:** `Assistente de Reflexão` (ID: `9db8775a-5d86-44ee-9b71-5ef5a3533bde`)

---

## 📋 Análise do Estado Atual

### 1. Estrutura do Workflow

**Fluxo Principal:**
```
start → mindquest_config → dados_usr → perfil_bigfive → Build Keys → 
Redis GET Lock → LOCK ativo? → Transcrição → Chat Memory - Get → 
intertion_count → Chat Memory - Insert → Interações (Pré-Agente) → 
Assistente de Reflexão → organiza_json → É a ulltima? → 
[update_token + Call sw_send_message] OU [Call sw_send_message] → 
Chat Memory - Get1 → junta_dados_gravacao → Grava_chat → 
[experts + Resumo + Chat Memory Delete + Redis SET Lock]
```

**Nodes Críticos:**
- `dados_usr`: Busca dados básicos do usuário (nome, perfil, etc)
- `perfil_bigfive`: Busca perfil Big Five dos últimos 30 dias
- `intertion_count`: Calcula número da interação atual
- `Assistente de Reflexão`: Node principal do mentor (LLM Agent)
- `organiza_json`: Separa mensagem do JSON de contexto (se última interação)
- `junta_dados_gravacao`: Monta dados finais para gravação

### 2. Entrada Atual (Contexto Disponibilizado)

**Node `dados_usr` (Postgres):**
- `nome`, `id`, `nome_preferencia`, `nome_assistente`, `token_acesso`, `cronotipo_detectado`, `whatsapp_numero`, `faixa_etaria`, `perfil_primario`

**Node `perfil_bigfive` (Postgres):**
- `perfil_primario`, `perfil_secundario`, `confianca_media`, `insuficiente`, `detalhes_traits`, `resumo_perfil`

**Node `mindquest_config` (DataTable):**
- `limit_iteration`: Limite fixo de interações (atualmente 8)

**Node `intertion_count` (Code):**
- `interaction_count`: Número da interação atual

**Ferramentas (Tools):**
- `get_history`: Busca últimas 7 conversas
- `user_conversation_guide`: Guia para usuário
- `agent_conversation_guide`: Guia para agente

**❌ FALTANDO:**
- Objetivos específicos do usuário (Trabalho, Finanças, etc)
- Objetivo padrão (Evolução Pessoal)
- Sabotador mais ativo
- Quests ativas
- Estágio da jornada (ENTENDER/AGIR/EVOLUIR)
- Histórico de conversas (resumos, temas recorrentes, progressos)

### 3. Saída Atual (Dados Gerados)

**Node `organiza_json` (Code):**
- `user_message`: Mensagem do agente
- `context_json`: JSON de contexto (apenas na última interação)
- `has_context`: Boolean
- `interaction_count`: Número da interação
- `is_last_interaction`: Boolean
- `session_limit`: Limite da sessão

**Node `junta_dados_gravacao` (Code):**
- `whatsapp_numero`, `usuario_id`, `session_id`
- `total_interactions`, `status` ("completa")
- `mensagens`: JSON string com array de mensagens
- `contexto_final`: JSON string com contexto básico
- Campos de emoção: `humor_autoavaliado`, `emocao_primaria`, `intensidade_emocao`, `energia_detectada`, `qualidade_interacao`, `emoji_dia`

**❌ FALTANDO na saída:**
- `contextos_mencionados[]`: Array de contextos/temas
- `sentimentos_expressos[]`: Array de sentimentos
- `eventos_importantes[]`: Array de eventos
- `padroes_identificados[]`: Array de padrões mentais
- `bloqueios_mencionados[]`: Array de bloqueios
- `progressos_celebrados[]`: Array de progressos
- `objetivos_referenciados[]`: Array de objetivos mencionados
- `intensidade_geral`: "baixa"|"media"|"alta"
- `motivo_encerramento`: Razão do encerramento
- `tem_reflexao`: Boolean (já existe no resumo, mas não no contexto)

### 4. Prompt Atual do Mentor

**Problemas Identificados:**

1. **Não menciona objetivos específicos:**
   - Prompt não inclui objetivos do usuário
   - Não instrui agente a referenciar objetivos quando usuário menciona temas relacionados

2. **Limite fixo de interações:**
   - Usa `limit_iteration` fixo (8)
   - Não suporta limites dinâmicos (5-20)
   - Não detecta encerramento automático

3. **Estrutura rígida:**
   - Sempre segue mesmo roteiro por número de interação
   - Não varia abordagem dinamicamente
   - Não detecta quando conversa se esgotou

4. **Não coleta contexto estruturado:**
   - Prompt não instrui agente a coletar contexto estruturado durante conversa
   - Contexto só é gerado na última interação (se houver)

5. **Não menciona framework CONVERSAR→ENTENDER→AGIR→EVOLUIR:**
   - Prompt não contextualiza mentor no framework
   - Não diferencia ações por fase

---

## 🎯 Plano de Mudança

### FASE 1: Adicionar Entrada de Dados (Contexto)

#### 1.1 Criar Node `objetivos_usuario` (Postgres)

**Localização:** Após `dados_usr`, antes de `perfil_bigfive`

**Query:**
```sql
SELECT 
  o.id,
  o.area_vida,
  o.descricao,
  o.is_padrao,
  o.ativo
FROM usuarios_objetivos uo
JOIN objetivos o ON o.id = uo.objetivo_id
WHERE uo.usuario_id = $1 
  AND uo.ativo = true
  AND o.ativo = true
ORDER BY o.is_padrao ASC, o.area_vida ASC;
```

**Saída esperada:**
- Array de objetivos com `id`, `area_vida`, `descricao`, `is_padrao`, `ativo`
- Separar em `objetivo_padrao` (is_padrao=true) e `objetivos_especificos[]` (is_padrao=false)

#### 1.2 Criar Node `sabotador_ativo` (Postgres)

**Localização:** Após `perfil_bigfive`

**Query:**
```sql
SELECT 
  sabotador_mais_ativo,
  contagem_ativacoes
FROM (
  SELECT 
    sabotador_mais_ativo,
    COUNT(*) as contagem_ativacoes
  FROM usuarios_sabotadores
  WHERE usuario_id = $1
    AND data_deteccao >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY sabotador_mais_ativo
  ORDER BY contagem_ativacoes DESC
  LIMIT 1
) sub;
```

**Saída esperada:**
- `sabotador_mais_ativo`: Nome do sabotador (ou null)
- `contagem_ativacoes`: Número de ativações

#### 1.3 Criar Node `quests_ativas` (Postgres)

**Localização:** Após `sabotador_ativo`

**Query:**
```sql
SELECT 
  uq.id,
  uq.quest_id,
  q.titulo,
  q.tipo,
  uq.status,
  uq.data_inicio
FROM usuarios_quest uq
JOIN quests q ON q.id = uq.quest_id
WHERE uq.usuario_id = $1
  AND uq.status IN ('ativa', 'pausada')
ORDER BY uq.data_inicio DESC
LIMIT 10;
```

**Saída esperada:**
- Array de quests ativas com `id`, `quest_id`, `titulo`, `tipo`, `status`, `data_inicio`

#### 1.4 Criar Node `historico_conversas` (Postgres)

**Localização:** Após `quests_ativas`

**Query:**
```sql
SELECT 
  id,
  data_conversa,
  resumo_conversa,
  total_palavras_usuario,
  tem_reflexao,
  status
FROM usr_chat
WHERE usuario_id = $1
  AND status = 'completa'
ORDER BY data_conversa DESC, criado_em DESC
LIMIT 5;
```

**Saída esperada:**
- Array com últimas 5 conversas completas
- Extrair `temas_recorrentes[]` e `progresso_identificado[]` via análise (Code node)

#### 1.5 Criar Node `estagio_jornada` (Code)

**Localização:** Após `historico_conversas`

**Lógica:**
- Analisar quests ativas, últimas conversas e objetivos
- Determinar estágio: "ENTENDER" | "AGIR" | "EVOLUIR"
- Regras:
  - **ENTENDER:** Muitas conversas recentes, poucas quests concluídas
  - **AGIR:** Quests ativas, conversas mencionando ações
  - **EVOLUIR:** Quests concluídas recentemente, progresso nos objetivos

### FASE 2: Modificar Controle de Interações

#### 2.1 Modificar Node `mindquest_config`

**Mudança:**
- Adicionar campos: `limit_iteration_min` (5), `limit_iteration_max` (20)
- Manter `limit_iteration` como padrão inicial

#### 2.2 Modificar Node `intertion_count`

**Mudança:**
- Adicionar lógica de detecção de esgotamento
- Retornar: `interaction_count`, `can_end_early` (boolean), `reason` (string)

**Lógica de detecção:**
- Analisar últimas 2-3 mensagens do usuário
- Se respostas muito breves ("Ok", "Sim", "Tudo bem") → `can_end_early = true`
- Se conversa circular/repetitiva → `can_end_early = true`
- Se conteúdo rico e reflexão profunda → `can_end_early = false`

#### 2.3 Modificar Node `Interações (Pré-Agente)`

**Mudança:**
- Adicionar saída para "conversa esgotada"
- Condição: `interaction_count >= limit_min` AND `can_end_early = true`

**Estrutura:**
```
Switch com 3 saídas:
1. Maior que max → Encerrar forçado
2. Entre min e max E can_end_early → Perguntar se quer encerrar
3. Menor que max E não can_end_early → Continuar
```

### FASE 3: Atualizar Prompt do Mentor

#### 3.1 Adicionar Seção de Framework

**Adicionar no início do systemMessage:**
```
### 🎯 FRAMEWORK MINDQUEST

Você faz parte do framework CONVERSAR → ENTENDER → AGIR → EVOLUIR:

**CONVERSAR (sua fase principal):**
- Conduzir conversas guiadas focadas em desenvolvimento pessoal
- Explorar padrões mentais, bloqueios e crenças limitantes
- Conectar presente com objetivos específicos do usuário
- Preparar contexto rico para experts trabalharem

**AGIR (apoio):**
- Validar se usuário está conseguindo agir
- Detectar dificuldades nas ações ou na mente
- Ajudar a destravar bloqueios

**EVOLUIR (apoio):**
- Usar conquistas para motivar e celebrar
- Falar sobre objetivos configurados
- Reconhecer progresso e construir narrativa de evolução
```

#### 3.2 Adicionar Objetivos no Contexto

**Adicionar na seção "DADOS DISPONÍVEIS":**
```
**Objetivos do Usuário:**
- Objetivo Padrão: {{ objetivo_padrao.descricao }} ({{ objetivo_padrao.area_vida }})
- Objetivos Específicos:
{{ objetivos_especificos.map(o => `  • ${o.descricao} (${o.area_vida})`).join('\n') }}

**Instrução:** Quando o usuário mencionar temas relacionados a objetivos específicos, 
referencie o objetivo correspondente. Exemplo: se mencionar "app", "trabalho", "negócio" 
→ referencie objetivo de Trabalho. Se mencionar "dinheiro", "criptos", "investimentos" 
→ referencie objetivo de Finanças.
```

#### 3.3 Adicionar Sabotador e Quests

**Adicionar:**
```
**Sabotador Mais Ativo:** {{ sabotador_mais_ativo || 'Nenhum detectado recentemente' }}

**Quests Ativas:** {{ quests_ativas.length }} quests
{{ quests_ativas.map(q => `  • ${q.titulo} (${q.tipo})`).join('\n') }}

**Instrução:** Use sabotador e quests como contexto para personalizar conversa. 
Quando usuário mencionar dificuldades, conecte com sabotador se relevante.
```

#### 3.4 Adicionar Histórico Estruturado

**Adicionar:**
```
**Últimas Conversas:**
{{ ultimas_conversas.map(c => `  • ${c.data_conversa}: ${c.resumo_conversa.substring(0, 100)}...`).join('\n') }}

**Temas Recorrentes:** {{ temas_recorrentes.join(', ') }}
**Progressos Identificados:** {{ progressos_identificados.join(', ') }}

**Instrução:** Use histórico para construir narrativa contínua. Referencie temas 
específicos de conversas anteriores quando fizer sentido natural.
```

#### 3.5 Modificar Diretrizes por Interação

**Substituir lógica atual por:**
```
## 🎯 DIRETRIZES DA RODADA

{{ (() => {
  const count = Number($('intertion_count').item.json.interaction_count);
  const min = Number($('mindquest_config').first().json.limit_iteration_min || 5);
  const max = Number($('mindquest_config').first().json.limit_iteration_max || 20);
  const canEnd = $('intertion_count').item.json.can_end_early || false;
  
  if (count === 1) {
    return '- Antes de responder, chame `get_history`. Abra com acolhimento caloroso. Use objetivos específicos do usuário para personalizar. Conecte com histórico se relevante.';
  }
  
  if (count >= min && canEnd) {
    return '- Você pode encerrar a conversa se o usuário concordar. Pergunte de forma alinhada ao tom: "Parece que conseguimos explorar bastante hoje. Quer continuar ou prefere encerrar por aqui?"';
  }
  
  if (count === max - 1) {
    return '- Ofereça resumo breve e empático. Confirme se faz sentido.';
  }
  
  if (count === max) {
    return '- Reconheça avanços, conclua com leveza. Convide a acessar App MindQuest.';
  }
  
  return '- Mantenha conversa orgânica. Aprofunde temas que usuário traz. Conecte com objetivos quando relevante. Varie abordagem para manter dinâmica.';
})() }}
```

#### 3.6 Adicionar Instruções de Coleta de Contexto

**Adicionar nova seção:**
```
## 📝 COLETA DE CONTEXTO (Durante Conversa)

Durante a conversa, identifique e anote mentalmente (não mencione ao usuário):

**Contextos Mencionados:** Trabalho, Finanças, Saúde, Relacionamentos, etc.
**Sentimentos Expressos:** Alegria, ansiedade, frustração, esperança, etc.
**Eventos Importantes:** Conquistas, perdas, mudanças, decisões, etc.
**Padrões Identificados:** Comportamentos recorrentes, crenças limitantes, etc.
**Bloqueios Mencionados:** Dificuldades, medos, obstáculos, etc.
**Progressos Celebrados:** Conquistas, aprendizados, mudanças positivas, etc.
**Objetivos Referenciados:** Quais objetivos específicos foram mencionados

**Na última interação:** Inclua JSON estruturado com este contexto após sua mensagem.
```

#### 3.7 Adicionar Instruções de Variação

**Adicionar:**
```
## 🎨 VARIAÇÃO DE ABORDAGEM

Varie sua abordagem para manter conversa dinâmica:

**Profundidade:** Alternar entre exploração superficial e profunda
**Tom:** Acolhedor, reflexivo, celebrativo, exploratório
**Estrutura:** Não seguir sempre mesmo roteiro
**Foco:** Alternar entre objetivos, padrões, progressos, bloqueios

**Evite:** Sempre mesma estrutura (saudação → pergunta → validação → encerramento)
```

### FASE 4: Modificar Saída (Coleta de Contexto)

#### 4.1 Modificar Node `organiza_json`

**Mudança:**
- Coletar contexto estruturado em TODAS as interações (não só última)
- Armazenar em memória/estado para acumular ao longo da conversa
- Na última interação, consolidar todo o contexto acumulado

**Estrutura do contexto:**
```javascript
{
  contextos_mencionados: [],
  sentimentos_expressos: [],
  eventos_importantes: [],
  padroes_identificados: [],
  bloqueios_mencionados: [],
  progressos_celebrados: [],
  objetivos_referenciados: [],
  intensidade_geral: "baixa" | "media" | "alta",
  qualidade_interacao: "vazia" | "superficial" | "profunda" | "muito_profunda"
}
```

#### 4.2 Modificar Node `junta_dados_gravacao`

**Mudança:**
- Incluir todos os campos de contexto estruturado
- Adicionar `motivo_encerramento`: "limite_maximo" | "conversa_esgotada" | "usuario_solicitou" | "conversa_completa"
- Adicionar `tem_reflexao`: Boolean (já existe no resumo, trazer para contexto também)

### FASE 5: Implementar Detecção de Encerramento

#### 5.1 Criar Node `detecta_esgotamento` (Code)

**Localização:** Após `Chat Memory - Get`, antes de `intertion_count`

**Lógica:**
```javascript
// Analisa últimas 2-3 mensagens do usuário
const messages = $input.first().json.messages || [];
const userMessages = messages
  .filter(m => m.role === 'user' || m.human)
  .slice(-3)
  .map(m => (m.content || m.human || '').toLowerCase().trim());

// Detecção
const briefResponses = ['ok', 'sim', 'tudo bem', 'tá', 'beleza', 'certo'];
const isBrief = userMessages.every(msg => 
  briefResponses.some(brief => msg.includes(brief)) || msg.length < 20
);

const isRepetitive = userMessages.length >= 2 && 
  userMessages[0] === userMessages[1];

const hasRichContent = userMessages.some(msg => msg.length > 100);

return {
  can_end_early: (isBrief || isRepetitive) && !hasRichContent,
  reason: isBrief ? 'respostas_breves' : isRepetitive ? 'repetitivo' : null,
  interaction_count: $('intertion_count').first().json.interaction_count
};
```

#### 5.2 Modificar Node `Interações (Pré-Agente)`

**Adicionar lógica:**
```
Switch com 4 saídas:
1. interaction_count > max → Encerrar forçado
2. interaction_count >= min AND can_end_early → Perguntar encerramento
3. interaction_count < max AND !can_end_early → Continuar normal
4. interaction_count === max → Última interação
```

#### 5.3 Criar Node `pergunta_encerramento` (Code)

**Localização:** Nova branch após detecção de esgotamento

**Lógica:**
- Gerar pergunta personalizada baseada no tom atual
- Incluir no prompt do mentor como mensagem do sistema
- Aguardar resposta do usuário
- Se confirmar → encerrar
- Se negar → continuar

### FASE 6: Atualizar Configuração

#### 6.1 Atualizar DataTable `mindquest_config`

**Adicionar campos:**
- `limit_iteration_min`: 5
- `limit_iteration_max`: 20
- `limit_iteration`: 8 (padrão, mantido para compatibilidade)

---

## 📊 Resumo das Mudanças

### Nodes a Criar:
1. `objetivos_usuario` (Postgres)
2. `sabotador_ativo` (Postgres)
3. `quests_ativas` (Postgres)
4. `historico_conversas` (Postgres)
5. `estagio_jornada` (Code)
6. `detecta_esgotamento` (Code)
7. `pergunta_encerramento` (Code)

### Nodes a Modificar:
1. `mindquest_config` (DataTable) - adicionar campos min/max
2. `intertion_count` (Code) - adicionar detecção
3. `Interações (Pré-Agente)` (Switch) - adicionar lógica de encerramento
4. `Assistente de Reflexão` (Agent) - atualizar prompt
5. `organiza_json` (Code) - coletar contexto em todas interações
6. `junta_dados_gravacao` (Code) - incluir contexto estruturado

### Conexões a Adicionar:
- `dados_usr` → `objetivos_usuario` → `sabotador_ativo` → `quests_ativas` → `historico_conversas` → `estagio_jornada` → `perfil_bigfive`
- `Chat Memory - Get` → `detecta_esgotamento` → `intertion_count`
- `detecta_esgotamento` → `Interações (Pré-Agente)` (nova branch)

---

## ✅ Checklist de Implementação

### Preparação
- [ ] Backup do workflow atual
- [ ] Documentar estado atual completo
- [ ] Validar queries SQL com dados reais

### Fase 1: Entrada
- [ ] Criar node `objetivos_usuario`
- [ ] Criar node `sabotador_ativo`
- [ ] Criar node `quests_ativas`
- [ ] Criar node `historico_conversas`
- [ ] Criar node `estagio_jornada`
- [ ] Testar queries e conexões

### Fase 2: Controle
- [ ] Atualizar `mindquest_config` (DataTable)
- [ ] Modificar `intertion_count`
- [ ] Criar `detecta_esgotamento`
- [ ] Modificar `Interações (Pré-Agente)`
- [ ] Criar `pergunta_encerramento`
- [ ] Testar lógica de encerramento

### Fase 3: Prompt
- [ ] Atualizar systemMessage com framework
- [ ] Adicionar objetivos no contexto
- [ ] Adicionar sabotador e quests
- [ ] Adicionar histórico estruturado
- [ ] Modificar diretrizes por interação
- [ ] Adicionar instruções de coleta
- [ ] Adicionar instruções de variação
- [ ] Testar prompt com exemplos

### Fase 4: Saída
- [ ] Modificar `organiza_json` para coletar contexto
- [ ] Modificar `junta_dados_gravacao` para incluir contexto
- [ ] Testar geração de contexto estruturado

### Fase 5: Testes
- [ ] Testar conversa completa (5-20 interações)
- [ ] Testar encerramento automático (esgotamento)
- [ ] Testar encerramento por limite máximo
- [ ] Testar encerramento por pergunta
- [ ] Validar contexto gerado
- [ ] Validar integração com experts

### Fase 6: Validação
- [ ] Revisar com usuário de teste
- [ ] Ajustar prompt baseado em feedback
- [ ] Documentar mudanças finais

---

**Última atualização:** 2025-12-01 21:00

