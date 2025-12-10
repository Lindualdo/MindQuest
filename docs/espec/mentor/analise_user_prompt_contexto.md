# Análise: User Prompt com Dados Recebidos

**Arquivo analisado:** `user_prompt_dados.md`  
**Data:** 10/12/2024

---

## 1. Estrutura Geral do User Prompt

### Seções Principais
```xml
<user_input>
  <message>          → Mensagem atual do usuário
  <session_context>  → Contexto da sessão
</user_input>

<user_context>       → Dados completos do usuário
  <profile>
  <goals>
  <mental_profile>
  <quests>
  <progress>
  <conversation_history>
</user_context>

<diretrizes>         → Diretrizes dinâmicas (se necessário)
<output_format>      → Lembrete do formato esperado
```

---

## 2. Detalhamento por Seção

### A) `<user_input>` - Entrada Atual

#### `<message>`
```xml
<message>
legal funcionou valeu!
vou acessar aqui e depois continuamos
</message>
```

**Análise:**
- Mensagem raw do usuário
- Neste caso: despedida implícita ("depois continuamos")
- **Ação esperada do system:** 
  - Detectar encerramento via workflow (step_1_analyze)
  - Perguntar confirmação antes de marcar checkpoint_encerramento
  - Se confirmado → chamar token_tool

#### `<session_context>`
```xml
<interaction_number>3</interaction_number>
<is_new_session>NÃO</is_new_session>
<is_first_ever>NÃO</is_first_ever>
```

**Análise:**
- `interaction_number: 3` → terceira troca na conversa atual
- `is_new_session: NÃO` → conversa em andamento (não é nova sessão)
- `is_first_ever: NÃO` → usuário já conversou antes

**Uso no system_producao_v2.md:**
- Relacionado com `<principle name="prioridades_contextuais">`
- **Decisão:** Não é primeira conversa → não precisa acolhimento inicial
- **Decisão:** Não é nova sessão → continuar contexto anterior (tema_atual)

---

### B) `<user_context>` - Contexto Completo do Usuário

#### `<profile>`
```xml
<name>Aldo</name>
<preferred_tone>direto</preferred_tone>
<about>Sobre: Tenho dois filhos, estou divorciado a dois anos...</about>
```

**Análise:**

1. **`<name>`** 
   - Personalização da conversa
   - Uso: Pode usar o nome quando apropriado (tom empático/acolhedor)

2. **`<preferred_tone>direto</preferred_tone>`** ⭐ **CRÍTICO**
   - **Uso direto em:** `<tone_adaptation>`
   - **Decisão:** Usar tom "direto" como padrão
   - **Características aplicar:**
     - Perguntas diretas
     - Sem floreios
     - Foco em próximos passos
     - Linguagem concisa

3. **`<about>`**
   - Contexto pessoal rico
   - **Temas identificados:**
     - Recomeço de vida (divorciado há 2 anos, Portugal há 1 ano)
     - Perdas financeiras (cripto)
     - Objetivo principal: Lançar MindQuest até dez/2024
     - Profissão: TI (PJ)
   - **Uso:** Informar decisões de tema_atual e insights personalizados

#### `<goals>`
```xml
<has_defined_goals>SIM</has_defined_goals>
<active_goals>[
  {"titulo":"Ganhar 2k por mês com operações em BTC","area_vida":"Finanças"},
  {"titulo":"Iniciar meu próprio negócio","area_vida":"Trabalho"},
  {"titulo":"Evolução Pessoal","area_vida":"Evolução","is_padrao":true}
]</active_goals>
```

**Análise:**
- `has_defined_goals: SIM` → **Não precisa priorizar descoberta de objetivos**
- 3 objetivos ativos:
  1. Finanças: Trading BTC (2k/mês consistente)
  2. Trabalho: Negócio próprio (MindQuest)
  3. Evolução: Crescimento pessoal

**Uso no system_producao_v2.md:**
- Relacionado com `<principle name="prioridades_contextuais">`
- **Decisão:** Não precisa focar em descobrir objetivos (já existem)
- **Uso:** Conectar conversas aos objetivos ativos quando relevante

#### `<mental_profile>`
```xml
<active_pattern>hiper_realizador</active_pattern>
<behavioral_profile>conscientiousness</behavioral_profile>
```

**Análise:**

1. **`active_pattern: hiper_realizador`**
   - Padrão sabotador mais ativo
   - **Características:** Nunca é suficiente, exigência excessiva, risco de burnout
   - **Uso:** Identificar quando padrão está ativo na conversa

2. **`behavioral_profile: conscientiousness`** (Big Five: Conscienciosidade)
   - Alta disciplina, organização, responsabilidade
   - **Combinação com hiper_realizador:** Pessoa muito produtiva mas com risco de exaustão

**Uso no system_producao_v2.md:**
- Relacionado com `<principle name="linguagem">` (usar "padrão de pensamento", não "sabotador")
- **Exemplo de uso:** 
  - "Esse padrão Realizador tá te levando a cobrar demais de você mesmo?"
  - Nomear padrão ajuda usuário ganhar consciência

#### `<quests>`
```xml
<has_quests>SIM</has_quests>
<total_ativas>12</total_ativas>
<total_a_planejar>31</total_a_planejar>
<note>Use quest_tool para detalhes das quests quando necessário</note>
```

**Análise:**
- `has_quests: SIM` → Usuário tem quests ativas
- `total_ativas: 12` → Indicador suficiente para saber que existem
- **Nota importante:** "Use quest_tool para detalhes quando necessário"

**Uso no system_producao_v2.md:**
- Relacionado com `<tool name="quest_tool">`
- **Decisão:**
  - ✅ **NÃO chamar quest_tool** apenas para verificar se existem (já sabemos: 12 ativas)
  - ✅ **CHAMAR quest_tool** se usuário perguntar sobre quests específicas
  - ✅ **CHAMAR quest_tool** se conversa for sobre progresso/ações

**Exemplo correto:**
- Usuário: "O que eu tenho pra fazer hoje?"
- System: **CHAMAR quest_tool** → depois apresentar com formatação WhatsApp

**Exemplo errado (desperdício):**
- System vê `total_ativas: 12` e chama quest_tool apenas para confirmar

#### `<progress>`
```xml
<level>1</level>
<title>Despertar</title>
```

**Análise:**
- Gamificação: Usuário está no nível 1 ("Despertar")
- **Uso:** Contexto motivacional se relevante para conversa

#### `<conversation_history>`
Array JSON com últimas 5 conversas resumidas.

**Análise detalhada das conversas:**

1. **09/12 (mais recente):**
   - Estado emocional forte, aceitando situação
   - Sucessos recentes em trading
   - Progresso no MindQuest
   - Temas: solidão, perdas financeiras, reconstrução

2. **08/12:**
   - Frustração/ansiedade com atraso do app
   - Insegurança com exposição em redes sociais
   - Solicitou quests alinhadas ao estoicismo

3. **04/12:**
   - Trading controlado (5 semanas de lucro consistente)
   - Desafio: controle emocional no trading
   - Busca métodos práticos e inovadores

4. **03/12:**
   - Estável emocionalmente
   - Meta: concluir app até 08/12
   - Reflexão emocional com maturidade

5. **02/12:**
   - Foco no desenvolvimento do app
   - Disciplina em pausas, exercícios, sono
   - Dificuldade em comemorar pequenas conquistas

**Uso no system_producao_v2.md:**
- Relacionado com `<memory>`
- **Decisão:** Manter contexto das últimas conversas
- **Uso prático neste caso:**
  - Última conversa (09/12): Estado emocional forte, sucessos em trading
  - Se usuário voltar hoje → pode referenciar conversa anterior
  - Exemplo: "Você mencionou ontem que tava celebrando sucessos no trading. Como seguiu?"

---

### C) `<diretrizes>` - Diretrizes Dinâmicas

```xml
<diretrizes>

</diretrizes>
```

**Análise:**
- Seção vazia neste exemplo
- **Propósito:** Adicionar instruções dinâmicas/temporárias quando necessário
- **Exemplos de uso:**
  - "Foque em aprofundar técnicas de estoicismo"
  - "Evite mencionar finanças nesta conversa"
  - "Priorize descoberta de gatilhos emocionais no trading"

**Uso no system_producao_v2.md:**
- Não há referência direta, mas deveria ter
- **Recomendação:** Adicionar seção no system sobre como processar diretrizes dinâmicas

---

### D) `<output_format>` - Lembrete de Formato

```xml
<output_format>
Retorne APENAS este JSON, sem texto adicional, seguindo rigorosamente as intruções do system:
{"mensagem_usuario":"sua resposta","tema_atual":{...},...}
</output_format>
```

**Análise:**
- Reforça instrução do system prompt
- **Propósito:** Garantir que IA não esqueça formato JSON
- Duplicação intencional (system + user) = maior aderência

---

## 3. Mapeamento: User Prompt → System Prompt v2

| Campo User Prompt | Seção System Prompt v2 | Como Usar |
|-------------------|------------------------|-----------|
| `preferred_tone` | `<tone_adaptation>` | Tom padrão da conversa |
| `has_defined_goals` | `<prioridades_contextuais>` | Se SIM → não focar em descobrir objetivos |
| `is_new_session` | `<prioridades_contextuais>` | Determinar tipo de abertura |
| `is_first_ever` | `<prioridades_contextuais>` | Primeiras 10 conversas = acolhimento |
| `total_ativas` (quests) | `<tool name="quest_tool">` | Saber se existem (não chamar tool só pra verificar) |
| `active_pattern` | `<principle name="linguagem">` | Nomear padrão durante conversa |
| `conversation_history` | `<memory>` | Contexto de conversas anteriores |
| `interaction_number` | `<workflow>` (step_1_analyze) | Entender momento da conversa |
| `about` | `<workflow>` (step_1_analyze) | Contexto pessoal para personalização |

---

## 4. Análise da Mensagem Específica Recebida

**Mensagem:** "legal funcionou valeu! vou acessar aqui e depois continuamos"

### Passo a passo esperado (conforme system_producao_v2.md):

#### **STEP 1: ANALYZE**
```
- Intenção: despedida implícita ("depois continuamos")
- Emoção: positiva, satisfeito ("legal funcionou")
- Precisa de dados externos? NÃO
- É resposta a notificação? NÃO
```

#### **STEP 2: DECIDE**
```
- Tom apropriado: direto (preferred_tone do contexto)
- Precisa usar tool? SIM - token_tool (encerramento)
- É momento de encerrar tema? TALVEZ (perguntar)
- É momento de encerrar conversa? TALVEZ (perguntar)
```

#### **STEP 3: COMPOSE**
```
- Resposta: Confirmar encerramento antes de marcar checkpoint
- Formato: Conciso, direto ao ponto
- Exemplo sugerido:
  "Ótimo! Quer encerrar por hoje ou tem mais alguma coisa pra falar?"
  
- Se confirmar encerramento:
  - Chamar token_tool
  - checkpoint_encerramento = true
  - tema_atual_fechado = true
```

---

## 5. Gaps Identificados

### 5.1. Falta no System Prompt v2

1. **`<diretrizes>` não é mencionado**
   - System não tem instrução para processar diretrizes dinâmicas do user prompt
   - **Solução:** Adicionar seção explicando como processar diretrizes temporárias

2. **`interaction_number` não é usado explicitamente**
   - Útil para detectar conversas muito longas (gerenciar contexto)
   - **Solução:** Mencionar em `<memory>` quando usar resuma

3. **`about` (perfil do usuário) não tem orientação de uso**
   - Dados ricos mas sem instrução clara de quando/como usar
   - **Solução:** Adicionar em `<workflow>` (step_1_analyze) verificação de contexto pessoal

### 5.2. Oportunidades de Melhoria

1. **Seção de notificação vazia**
   - `<!-- NOTIFICAÇÃO PENDENTE (se houver) -->` está vazio
   - **Quando preenchido:** System deve processar conforme `<notifications_handling>`

2. **Conversation_history é muito longo**
   - 5 conversas resumidas = muito contexto
   - **Sugestão:** System poderia ter instrução para priorizar última conversa, resumir anteriores

---

## 6. Exemplo de Resposta Esperada

Dado o contexto analisado, resposta ideal seria:

```json
{
  "mensagem_usuario": "Ótimo! Quer encerrar por hoje ou tem mais alguma coisa pra falar?",
  "tema_atual": {
    "titulo": "Confirmação de Funcionalidade",
    "resumo": ["Usuário confirmou que funcionalidade funcionou", "Indica possível encerramento"],
    "decisoes": []
  },
  "checkpoint_encerramento": false,
  "tema_atual_fechado": false,
  "objetivo_sugerido": null
}
```

**Se usuário confirmar encerramento na próxima mensagem:**

```json
{
  "mensagem_usuario": "Foi ótimo conversar com você! 🚀\n\nSeus dados estão atualizados no app.\n\nAcesse aqui: [URL_DO_TOKEN]\n\nAté a próxima!",
  "tema_atual": {
    "titulo": "Encerramento",
    "resumo": ["Conversa finalizada"],
    "decisoes": []
  },
  "checkpoint_encerramento": true,
  "tema_atual_fechado": true,
  "objetivo_sugerido": null
}
```

---

## 7. Checklist de Validação

Ao receber user_context, system deve:

- [ ] Verificar `preferred_tone` → usar como padrão em `<tone_adaptation>`
- [ ] Verificar `has_defined_goals` → se NÃO, priorizar descoberta
- [ ] Verificar `is_first_ever` → se SIM (primeiras 10), acolhimento breve
- [ ] Verificar `is_new_session` → se SIM, escolher abertura apropriada
- [ ] Verificar `total_ativas` (quests) → saber se existem (não chamar tool desnecessariamente)
- [ ] Ler `active_pattern` → usar nomenclatura correta ("padrão X", não "sabotador")
- [ ] Considerar `conversation_history` → última conversa mais relevante
- [ ] Processar `<diretrizes>` se presente (atualmente não há instrução sobre isso)

---

## 8. Recomendações para Melhorar System Prompt v2

### 8.1. Adicionar Seção sobre Diretrizes Dinâmicas

```xml
<dynamic_guidelines>
PROPÓSITO: User prompt pode incluir <diretrizes> temporárias.

QUANDO PRESENTES:
- Leia e aplique com PRIORIDADE MÁXIMA
- Sobrepõem instruções gerais do system
- Geralmente são contextuais/temporárias

EXEMPLO:
<diretrizes>
Foque exclusivamente em técnicas de estoicismo aplicadas ao trading.
Não mencione outros temas.
</diretrizes>

AÇÃO: Durante essa conversa, priorize estoicismo aplicado ao trading.
</dynamic_guidelines>
```

### 8.2. Melhorar Uso de `conversation_history`

```xml
<memory>
Entre interações na MESMA conversa, MANTENHA:
- tema_atual completo (título + resumo + decisões)
- Quests mencionadas e seu contexto
- Padrões de pensamento identificados nesta sessão
- Tom de conversa preferido (detectado dinamicamente)

CONVERSATION_HISTORY (últimas conversas resumidas):
- PRIORIZE: Última conversa (mais recente)
- USE: Para continuidade de temas em nova sessão
- RESUMA: Conversas antigas (só mencionar se relevante)
- EXEMPLO: "Você mencionou na última conversa que [contexto]..."

RESUMA após 5+ trocas consecutivas:
- Histórico de temas anteriores (apenas títulos)
- Manter apenas último tema detalhado

DESCARTE para otimizar contexto:
- Outputs brutos de tools já processados (manter apenas insights)
- Repetições de formatação WhatsApp já enviadas
- Mensagens redundantes
</memory>
```

### 8.3. Adicionar Checklist em Workflow

```xml
<step_1_analyze>
ANALISE:
- Qual a intenção principal do usuário nesta mensagem?
- Qual emoção/tom predominante? (frustração, empolgação, confusão, pressa)
- Preciso de dados externos? (verificar PRIMEIRO se já está no contexto)
- É resposta a notificação? Se sim, qual opção foi escolhida?

VERIFIQUE CONTEXTO:
- preferred_tone → usar como tom padrão
- has_defined_goals → se NÃO, priorizar descoberta de objetivos
- total_ativas (quests) → saber se existem antes de considerar quest_tool
- active_pattern → nomear corretamente se identificar na conversa
- conversation_history → última conversa (contexto recente)
- <diretrizes> → se presente, aplicar com prioridade máxima
</step_1_analyze>
```

---

## 9. Resumo Executivo

**Estrutura do User Prompt:**
- ✅ Bem organizada, XML estruturado
- ✅ Separa claramente: entrada atual vs contexto do usuário
- ✅ Campos essenciais presentes

**Pontos Fortes:**
- `preferred_tone` → conexão direta com tone_adaptation
- `has_defined_goals` → decisão clara sobre prioridades
- `total_ativas` → evita calls desnecessários de tools
- `conversation_history` → continuidade entre sessões

**Gaps Principais:**
1. System v2 não menciona `<diretrizes>` (diretrizes dinâmicas)
2. System v2 não dá orientação clara sobre usar `about` (perfil pessoal)
3. System v2 poderia ter checklist em workflow para validar campos do contexto

**Próximos Passos:**
1. Adicionar seção `<dynamic_guidelines>` no system_producao_v2.md
2. Melhorar seção `<memory>` com instruções sobre conversation_history
3. Adicionar checklist de contexto em `<step_1_analyze>`

---

**Gerado em:** 10/12/2024  
**Versão:** 1.0
