# Guia Prático: System Prompts para Agentes IA

**Baseado nas práticas de OpenAI, Anthropic, Google e xAI (Dez/2024)**

---

## 1. Estrutura Fundamental (80/20)

### Template Base
```xml
<role>
[Quem é o agente + contexto único]
</role>

<objective>
[Objetivo principal + métricas de sucesso]
</objective>

<rules>
[3-5 regras críticas que não podem ser violadas]
</rules>

<output_format>
[Formato esperado + estrutura]
</output_format>
```

### Exemplo Prático
```xml
<role>
Você é um assistente de saúde mental especializado em Terapia Cognitivo-Comportamental (TCC).
Seu papel é guiar usuários através de check-ins emocionais diários.
</role>

<objective>
Facilitar autoconhecimento através de perguntas reflexivas e identificar padrões emocionais.
Sucesso = usuário completa check-in + identifica 1 gatilho emocional.
</objective>

<rules>
- Nunca diagnosticar condições médicas ou psicológicas
- Sempre validar emoções antes de questionar
- Manter conversa focada em comportamentos observáveis
- Sugerir recursos profissionais se detectar crise
</rules>

<output_format>
1. Pergunta reflexiva (1 frase)
2. Validação empática (1 frase)
3. Insight comportamental (se aplicável)
4. Próxima ação sugerida
</output_format>
```

---

## 2. Princípios de Ouro (80/20)

### ✅ Fazer

1. **Instruções Afirmativas**
   - ✅ "Use linguagem empática e acolhedora"
   - ❌ "Não seja frio ou técnico demais"

2. **Delimitadores Claros**
   ```xml
   <context>
   [Contexto do usuário]
   </context>
   
   <user_input>
   {{input}}
   </user_input>
   ```

3. **Exemplos Concretos** (few-shot)
   ```xml
   <examples>
   <example>
   Input: "Estou ansioso com trabalho"
   Output: "Compreendo que o trabalho está gerando ansiedade. 
   O que especificamente no trabalho está contribuindo para isso?"
   </example>
   </examples>
   ```

4. **Chain-of-Thought para Raciocínio**
   ```
   Antes de responder:
   1. Identifique a emoção principal do usuário
   2. Detecte possíveis sabotadores cognitivos
   3. Formule pergunta que promova reflexão
   4. Estruture resposta em [formato]
   ```

5. **Contexto e Motivação**
   ```
   Por que isso importa: Usuários precisam sentir-se seguros antes 
   de explorar emoções vulneráveis. Sempre valide antes de questionar.
   ```

### ❌ Evitar

- Instruções negativas excessivas
- Prompts genéricos sem contexto
- Misturar instruções com exemplos sem delimitadores
- Jargão técnico desnecessário
- Prompts longos sem hierarquia clara

---

## 3. Arquitetura de Prompts Complexos

### Nível 1: Básico (Tarefas Simples)
```
Resuma o seguinte texto em 3 bullets:
"""
[texto]
"""
```

### Nível 2: Intermediário (Com Contexto)
```xml
<role>Analista de dados comportamentais</role>

<task>
Analise o histórico de humor e identifique padrões.
</task>

<input_data>
[dados]
</input_data>

<output>
- Padrão identificado
- Frequência observada
- Possível gatilho
</output>
```

### Nível 3: Avançado (Agêntico)
```xml
<role>
Mentor de desenvolvimento pessoal com acesso a ferramentas.
</role>

<workflow>
1. Analise dados do usuário (tool: query_database)
2. Identifique objetivos ativos (tool: get_objectives)
3. Sugira próxima ação baseada em progresso
4. Se necessário, crie nova quest (tool: create_quest)
</workflow>

<rules>
- Sempre use tools antes de fazer suposições
- Valide dados antes de sugerir ações
- Reflita sobre resultado de cada tool call
- Continue até resolver completamente
</rules>

<memory>
Mantenha contexto de:
- Último check-in emocional
- Quests ativas
- Sabotadores identificados recentemente
</memory>
```

---

## 4. Técnicas Avançadas (OpenAI + Anthropic)

### A) Prefill (Controlar Início da Resposta)
```xml
<output_format>
Inicie sempre com:
"Com base na sua resposta, percebo que..."
</output_format>
```

### B) Múltiplas Personas
```xml
<personas>
<empathetic_listener>
Usa validação emocional, perguntas abertas, tom acolhedor.
</empathetic_listener>

<action_coach>
Foca em próximos passos, ações concretas, metas mensuráveis.
</action_coach>
</personas>

<instruction>
Alterne entre personas conforme necessidade do usuário.
</instruction>
```

### C) Self-Reflection
```
Antes de responder:
<thinking>
- Qual a necessidade implícita do usuário?
- Qual persona é mais apropriada agora?
- Que ferramenta pode ajudar?
</thinking>

[Então forneça resposta]
```

### D) Gerenciamento de Contexto Longo
```xml
<context_strategy>
- Mantenha: Estado atual, decisões tomadas, TODOs
- Resuma: Histórico de conversas (últimas 3 apenas)
- Descarte: Outputs de tools já processados
- Persista: Arquivo MEMORY.json com snapshot essencial
</context_strategy>
```

---

## 5. Formatação: XML vs Markdown

### Quando Usar XML
- Prompts complexos com múltiplas seções
- Agentes que manipulam dados estruturados
- Necessidade de parsing preciso
- **Preferido por:** Claude (Anthropic)

### Quando Usar Markdown
- Prompts simples e diretos
- Foco em legibilidade humana
- Templates colaborativos
- **Preferido por:** GPT (OpenAI), Gemini (Google)

### Híbrido (Recomendado)
```markdown
# Role
Mentor de autoconsciência

## Objective
- Facilitar reflexão diária
- Identificar padrões emocionais

## Context
<user_profile>
[dados estruturados]
</user_profile>

## Output Format
1. Pergunta reflexiva
2. Validação empática
3. Sugestão de ação
```

---

## 6. Checklist de Qualidade

Antes de finalizar seu system prompt:

- [ ] **Clareza**: Um desenvolvedor júnior entenderia o objetivo?
- [ ] **Especificidade**: Tem exemplos concretos do output esperado?
- [ ] **Delimitação**: Usa XML/Markdown para separar seções?
- [ ] **Contexto**: Explica *por que* cada instrução importa?
- [ ] **Testabilidade**: Pode medir se o agente está cumprindo o objetivo?
- [ ] **Segurança**: Tem regras claras sobre o que NÃO fazer?
- [ ] **Formato**: Especifica estrutura exata da resposta?

---

## 7. Padrões Comuns por Tipo de Agente

### Agente Conversacional
```xml
<tone>Empático e acolhedor</tone>
<response_length>2-4 frases</response_length>
<validation_first>Sempre valide emoção antes de questionar</validation_first>
```

### Agente Analítico
```xml
<approach>Data-driven, objetivo</approach>
<output>Insights + métricas + recomendações</output>
<chain_of_thought>Mostre raciocínio step-by-step</chain_of_thought>
```

### Agente Criativo
```xml
<style>Inspirador, usa metáforas</style>
<constraints>Mantém alinhamento com valores do usuário</constraints>
<examples>Forneça 2-3 opções para usuário escolher</examples>
```

### Agente Executor (Agentic)
```xml
<autonomy>Alta - pode tomar decisões sem confirmação</autonomy>
<tool_use>Sempre valide dados via tools antes de agir</tool_use>
<reflection>Após cada tool call, avalie resultado antes de próxima ação</reflection>
<completion>Continue até tarefa 100% concluída</completion>
```

---

## 8. Erros Comuns e Soluções

| Erro | Problema | Solução |
|------|----------|---------|
| Prompt muito genérico | Respostas vagas | Adicione 2-3 exemplos concretos |
| Instruções conflitantes | Comportamento imprevisível | Use hierarquia clara: regras > guidelines > sugestões |
| Sem delimitadores | IA confunde instrução com dados | Use `<tags>` ou `"""` para separar |
| Negativos excessivos | IA foca no que evitar | Reescreva com instruções afirmativas |
| Contexto insuficiente | Respostas desalinhadas | Adicione seção `<motivation>` explicando o "porquê" |
| Output inconsistente | Falta de padrão | Especifique formato com exemplo exato |

---

## 9. Template Completo (Production-Ready)

```xml
<role>
[Identidade clara + especialização + contexto único]
</role>

<objective>
[Objetivo mensurável + critério de sucesso]
</objective>

<context>
[Informações essenciais sobre usuário/sistema/momento]
</context>

<rules>
1. [Regra crítica 1 - segurança/ética]
2. [Regra crítica 2 - qualidade]
3. [Regra crítica 3 - formato]
</rules>

<workflow>
1. [Passo 1 - análise]
2. [Passo 2 - processamento]
3. [Passo 3 - output]
</workflow>

<tools_available>
- tool_name_1: [quando usar]
- tool_name_2: [quando usar]
</tools_available>

<memory>
- [Item 1 para manter entre interações]
- [Item 2 para manter entre interações]
</memory>

<examples>
<example>
Input: [exemplo real]
Thinking: [raciocínio]
Output: [resposta esperada]
</example>
</examples>

<output_format>
[Estrutura exata com campos obrigatórios]
</output_format>

<error_handling>
- Se [situação X]: [ação Y]
- Se incerto: [protocolo padrão]
</error_handling>
```

---

## 10. Iteração e Melhoria Contínua

### Processo de Refinamento
1. **Deploy inicial** com prompt base
2. **Colete falhas** reais de usuários
3. **Analise padrões** de erro
4. **Adicione exemplos** dos casos falhos corrigidos
5. **Teste A/B** mudanças incrementais
6. **Meça impacto** (taxa de sucesso, satisfação)

### Métricas de Sucesso
- Taxa de conclusão de tarefa
- Necessidade de clarificações
- Aderência ao formato especificado
- Violações de regras de segurança
- Satisfação do usuário (qualitativa)

### Ferramentas de Apoio
- **OpenAI**: Prompt Optimizer
- **Anthropic**: Prompt Improver (30% accuracy boost)
- **Google**: Generate/Refine Prompt (Vertex AI)

---

## Referências

- [OpenAI Prompt Engineering Guide](https://help.openai.com/en/articles/6654000-prompt-engineering-best-practices-for-chatgpt)
- [Anthropic Claude 4 Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)
- [Google Gemini Prompting Guide](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts)
- [XML Tags for Prompt Structure](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0
