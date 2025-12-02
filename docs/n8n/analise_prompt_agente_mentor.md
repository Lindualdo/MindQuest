# Análise do Prompt do Agente Mentor (sw_chat_interations_v2)

**Data:** 2025-12-01 18:00
**Workflow:** `sw_chat_interations_v2` (ID: `aRonGjwfYoY1UUHH`)
**Nó:** `Assistente de Reflexão` (ID: `9db8775a-5d86-44ee-9b71-5ef5a3533bde`)

---

## 📊 Resumo Executivo

O prompt atual é **bem estruturado** mas tem oportunidades de melhoria em:
1. **Clareza e concisão** — reduzir redundâncias
2. **Contexto de objetivos** — integrar objetivos específicos do usuário
3. **Framework ENTENDER→AGIR→EVOLUIR** — alinhar melhor com a jornada
4. **Uso de histórico** — melhorar estratégia de referência
5. **Personalização** — aproveitar mais dados disponíveis

---

## 🔍 Análise Detalhada

### 1. **Redundâncias e Repetições**

**Problema:**
- Conceito "consciência digital/parte sábia da mente" repetido 3x
- Estrutura de resposta explicada em múltiplos lugares
- Regras sobre não mencionar IA/sistema repetidas

**Impacto:** Prompt mais longo que necessário, pode confundir o LLM

**Solução:**
- Consolidar em uma única seção clara
- Remover duplicações entre `text` e `systemMessage`

---

### 2. **Falta de Contexto de Objetivos**

**Problema:**
- Prompt não menciona **objetivos específicos** do usuário
- Não há integração com `objetivos_ativos` (Trabalho, Finanças, etc.)
- Agente não pode conectar conversa aos objetivos do usuário

**Impacto:** Perde oportunidade de personalização e relevância

**Solução:**
- Adicionar seção sobre objetivos ativos
- Instruir agente a conectar temas da conversa aos objetivos
- Similar ao que foi feito em `sw_criar_quest`

---

### 3. **Framework ENTENDER→AGIR→EVOLUIR**

**Problema:**
- Prompt não menciona explicitamente o framework
- Não há orientação sobre qual etapa focar em cada interação
- Falta conexão com o App (onde usuário vê resultados)

**Impacto:** Conversa pode não alinhar com a jornada do produto

**Solução:**
- Adicionar seção sobre o framework
- Orientar agente sobre foco por interação:
  - Interações 1-2: **ENTENDER** (explorar sentimentos, contextos)
  - Interações 3-4: **AGIR** (conectar com ações, quests)
  - Interação 5: **EVOLUIR** (resumir progresso, celebrar)

---

### 4. **Uso de Histórico (get_history)**

**Problema:**
- Instrução vaga: "use quando fizer sentido natural"
- Não há critérios claros de quando usar
- Risco de não usar ou usar demais

**Impacto:** Perde contexto valioso ou sobrecarrega com informações antigas

**Solução:**
- Definir critérios explícitos:
  - **Sempre usar na 1ª interação** (já está)
  - **Usar em interações 2-4** se:
    - Usuário mencionar algo relacionado a conversa anterior
    - Agente precisar de contexto para validar progresso
    - Usuário pedir ajuda sobre algo já discutido
  - **Nunca usar na última interação** (foco em fechamento)

---

### 5. **Personalização Limitada**

**Problema:**
- Usa apenas Big Five e faixa etária
- Não usa:
  - **Sabotadores ativos** (poderia mencionar contramedidas)
  - **Quests ativas** (poderia conectar com ações em andamento)
  - **Objetivos específicos** (já mencionado acima)
  - **Estágio da jornada** (nível/XP)

**Impacto:** Respostas menos relevantes e personalizadas

**Solução:**
- Adicionar dados contextuais opcionais:
  - Sabotador mais ativo → mencionar contramedida se relevante
  - Quest ativa relacionada → conectar com ação prática
  - Objetivo específico → alinhar conversa com meta

---

### 6. **Estrutura do Prompt**

**Problema:**
- `text` (user prompt) muito longo e misturado
- `systemMessage` também extenso
- Informações importantes podem se perder

**Impacto:** LLM pode não priorizar instruções críticas

**Solução:**
- Reorganizar em seções mais claras:
  1. **Identidade e propósito** (systemMessage)
  2. **Contexto dinâmico** (text - dados do usuário)
  3. **Diretrizes por interação** (text - regras específicas)
  4. **Estilo e formato** (systemMessage - consistência)

---

### 7. **Falta de Exemplos Concretos**

**Problema:**
- Instruções abstratas ("seja empático", "valide sentimentos")
- Sem exemplos de respostas boas vs ruins
- Sem exemplos de como usar histórico

**Impacto:** LLM pode interpretar de forma inconsistente

**Solução:**
- Adicionar exemplos curtos:
  - ❌ "Como você está se sentindo hoje?" (genérico)
  - ✅ "Vi que na última conversa você estava preocupado com o projeto. Como está isso hoje?" (contextualizado)

---

### 8. **Integração com Quests**

**Problema:**
- Agente não sabe sobre quests criadas após a conversa
- Não pode mencionar ações sugeridas
- Perde oportunidade de conectar conversa → ação

**Impacto:** Conversa fica desconectada do App

**Solução:**
- Na última interação, mencionar que o App terá ações sugeridas
- Orientar agente a conectar temas da conversa com possíveis ações

---

### 9. **Tratamento de Emoções Negativas**

**Problema:**
- Instruções genéricas sobre validar sentimentos
- Não há orientação específica para:
  - Ansiedade intensa
  - Frustração/raiva
  - Tristeza profunda
  - Overwhelm

**Impacto:** Pode não responder adequadamente em momentos críticos

**Solução:**
- Adicionar seção sobre **níveis de intensidade emocional**
- Orientar quando aprofundar vs quando acalmar
- Quando sugerir técnicas (respiração, grounding)

---

### 10. **Encerramento da Sessão**

**Problema:**
- Instrução vaga: "reconheça avanços, conclua com leveza"
- Não há template ou estrutura clara
- Pode ser inconsistente entre sessões

**Impacto:** Usuário pode não sentir fechamento adequado

**Solução:**
- Criar estrutura de encerramento:
  1. **Reconhecimento** (1 frase sobre o que foi explorado)
  2. **Insight principal** (1 frase sobre aprendizado)
  3. **Próximo passo** (1 frase sobre continuidade)
  4. **Convite ao App** (1 frase sobre ver resultados)

---

## 🎯 Priorização de Melhorias

### 🔴 **Alta Prioridade** (Impacto imediato)

1. **Adicionar contexto de objetivos** — Conectar conversa com objetivos específicos
2. **Melhorar uso de histórico** — Critérios claros de quando usar
3. **Integrar framework ENTENDER→AGIR→EVOLUIR** — Alinhar com jornada do produto
4. **Reduzir redundâncias** — Consolidar instruções duplicadas

### 🟡 **Média Prioridade** (Melhoria incremental)

5. **Adicionar dados contextuais** — Sabotadores, quests, estágio
6. **Estruturar encerramento** — Template consistente
7. **Adicionar exemplos** — Guiar interpretação do LLM
8. **Reorganizar seções** — Melhor hierarquia de informações

### 🟢 **Baixa Prioridade** (Refinamento)

9. **Tratamento de emoções intensas** — Casos específicos
10. **Integração com quests** — Mencionar ações sugeridas

---

## 📝 Recomendações de Implementação

### Fase 1: Correções Críticas
- Consolidar redundâncias
- Adicionar contexto de objetivos
- Melhorar critérios de uso de histórico

### Fase 2: Alinhamento Estratégico
- Integrar framework ENTENDER→AGIR→EVOLUIR
- Adicionar dados contextuais (sabotadores, quests)
- Estruturar encerramento

### Fase 3: Refinamento
- Adicionar exemplos concretos
- Tratamento de emoções intensas
- Reorganizar estrutura do prompt

---

## 🔗 Referências

- **Workflow:** `sw_chat_interations_v2` (ID: `aRonGjwfYoY1UUHH`)
- **Nó agente:** `Assistente de Reflexão` (ID: `9db8775a-5d86-44ee-9b71-5ef5a3533bde`)
- **Documentação produto:** `docs/espec/produto/definicao_produto.md`
- **Framework:** ENTENDER → AGIR → EVOLUIR (v1.3)

---

**Próximo passo:** Implementar melhorias priorizadas no prompt do agente mentor.

