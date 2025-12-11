# Plano de Melhorias: sw_criar_quest

**Data:** 2025-12-10  
**Problema:** Quests muito similares sendo criadas (8 de controle emocional, 4 de foco, 3 de respiração)

---

## 1. ANÁLISE DE CAUSA RAIZ

### Problema Identificado: Falta de Diversidade Temática

| Causa | Evidência | Impacto |
|-------|-----------|---------|
| **Prompt muito específico** | System prompt força padrão "Desafie o Sr. X com [técnica]" | Gera variações do mesmo conceito |
| **Ausência de chain-of-thought** | Agente não reflete sobre diversidade antes de gerar | Não avalia se quest é abrangente |
| **Dedupe só valida título** | Node "Aplicar Limites & Dedupe" compara apenas strings | Não detecta similaridade temática |
| **Contexto limitado** | Passa apenas títulos, não TEMAS das quests existentes | Agente não vê padrões de repetição |
| **Sabotadores geram temas fixos** | Sr. Inquieto → sempre respiração/pausas | Falta variedade de contramedidas |
| **Falta de exemplos negativos** | Prompt não mostra o que EVITAR | Agente não aprende com erros |

---

## 2. MELHORIAS NO SYSTEM PROMPT

### A) Adicionar Seção de Diversidade (CRÍTICA)

**Inserir ANTES da seção "GERAR QUESTS":**

```xml
=== REGRAS DE DIVERSIDADE (OBRIGATÓRIO) ===

**ANTES de gerar cada quest:**
<thinking>
1. Qual o TEMA CENTRAL desta quest? (Ex: controle emocional, produtividade, autoconhecimento)
2. Este tema JÁ EXISTE nas quests atuais?
3. Posso AMPLIAR o escopo para torná-la mais abrangente?
4. Há outra abordagem COMPLEMENTAR que não repete o tema?
</thinking>

**EVITAR:**
- Criar múltiplas quests com o MESMO tema (ex: 3 quests de "respiração")
- Focar em técnicas isoladas (ex: "pausas conscientes") ao invés de objetivos maiores
- Gerar variações superficiais (ex: "Sr. Inquieto com pausas" vs "Sr. Inquieto com respiração")

**PRIORIZAR:**
- Quests ABRANGENTES que cobrem múltiplas técnicas
- Diferentes ÁREAS de impacto (emocional, produtividade, relacionamento, financeiro)
- Abordagens COMPLEMENTARES (ex: se já tem quest de controle emocional, criar de planejamento)
```

### B) Melhorar Contexto de Anti-Duplicação

**Alterar no User Prompt (linha 205):**

```diff
- **QUESTS JÁ EXISTENTES (EVITAR TÍTULOS SIMILARES):**
+ **QUESTS JÁ EXISTENTES (EVITAR TÍTULOS E TEMAS SIMILARES):**
{{ JSON.stringify($json.quests_ja_criadas_titulos || []) }}

+ **TEMAS JÁ COBERTOS (NÃO REPETIR):**
+ {{ JSON.stringify($json.temas_quests_existentes || []) }}
```

### C) Adicionar Exemplos Negativos

**Inserir após seção "FORMATO DE SAÍDA":**

```xml
=== ANTI-PADRÕES (O QUE NÃO FAZER) ===

❌ **Ruim - Muito Similar:**
```json
[
  {
    "titulo": "Desafie o Sr. Inquieto com pausas conscientes",
    "descricao": "Pratique pausas antes de decisões..."
  },
  {
    "titulo": "Desafie o Sr. Inquieto com respiração focada",
    "descricao": "Técnica de respiração para controle..."
  },
  {
    "titulo": "Controle Emocional com técnicas de calma",
    "descricao": "Aplique estratégias de regulação emocional..."
  }
]
```
**Problema:** 3 quests com tema "controle emocional via técnicas de calma"

✅ **Bom - Diverso e Abrangente:**
```json
[
  {
    "titulo": "Domine Suas Emoções em Trading de BTC",
    "descricao": "Quest abrangente: respiração pré-trade + journaling pós-trade + análise de gatilhos emocionais. Integra múltiplas técnicas de autorregulação.",
    "base_cientifica": {
      "fundamentos": "Combina TCC (regulação emocional), mindfulness (atenção plena) e journaling (autoconhecimento)"
    }
  },
  {
    "tipo": "sabotador",
    "titulo": "Neutralize o Sr. Inquieto com Estrutura e Ritual",
    "descricao": "Baseado no insight: impulsividade em trades. Contramedida: checklist pré-trade + timer de espera + journaling de decisões.",
    "base_cientifica": {
      "fundamentos": "Neurociência da impulsividade: adicionar fricção reduz decisões automáticas"
    }
  },
  {
    "titulo": "Finalize o Módulo de Autenticação do MindQuest",
    "descricao": "Complete implementação OAuth + testes + deploy. Foco: produtividade e entrega concreta.",
    "area_vida_id": "[id-trabalho]"
  }
]
```
**Por quê funciona:** Temas distintos (emocional + sabotador + produtividade), abordagens diferentes (técnicas integradas vs estrutura vs entrega)
```

### D) Forçar Variedade por Tipo de Quest

**Adicionar após "REGRAS POR TIPO DE QUEST":**

```xml
=== MATRIZ DE VARIEDADE OBRIGATÓRIA ===

| Tipo Quest | Tema Principal | Tema Secundário Permitido |
|------------|----------------|---------------------------|
| **Personalizada** | Ação prática (trabalho, projeto, finanças) | Relacionamento, saúde |
| **Sabotador** | Contramedida específica do sabotador | **NUNCA repetir** técnica já usada |
| **TCC/Outras** | Técnica TCC ou filosófica | Estoicismo, neurociência |

**REGRA:** Se quest de Sabotador já usa "respiração", próxima DEVE usar outra contramedida (ex: estrutura, reframing, exposição gradual, journaling, autoafirmações).
```

---

## 3. MELHORIAS NO WORKFLOW (Nodes)

### A) Node "Preparar Quest do Catálogo" - Extrair Temas

**Adicionar extração de temas após linha 160:**

```javascript
// === EXTRAIR TEMAS DAS QUESTS EXISTENTES ===
const extrairTema = (titulo, descricao) => {
  const texto = `${titulo} ${descricao}`.toLowerCase();
  
  // Palavras-chave por tema
  const temas = {
    'controle_emocional': ['emocion', 'respiraç', 'calma', 'regulaç', 'ansied', 'stress'],
    'foco_produtividade': ['foco', 'produtiv', 'concentra', 'distração', 'blocos', 'timer'],
    'planejamento': ['planej', 'organiz', 'estrutur', 'rotina', 'agenda', 'prioriz'],
    'autoconhecimento': ['autoconhec', 'reflita', 'identifiq', 'padrão', 'sabotador', 'insight'],
    'gratidao': ['gratid', 'agradec', 'reconhec'],
    'relacionamento': ['relacion', 'comunica', 'social', 'conexão'],
    'financeiro': ['financ', 'dinheiro', 'btc', 'trade', 'investimento', 'renda'],
    'saude': ['saúde', 'exercício', 'alimenta', 'sono', 'corpo']
  };
  
  for (const [tema, palavras] of Object.entries(temas)) {
    if (palavras.some(p => texto.includes(p))) {
      return tema;
    }
  }
  
  return 'geral';
};

const temasExistentes = questsJaCriadas
  .map(q => ({
    titulo: q.titulo,
    tema: extrairTema(q.titulo, q.descricao || '')
  }))
  .reduce((acc, q) => {
    acc[q.tema] = (acc[q.tema] || 0) + 1;
    return acc;
  }, {});

// Adicionar ao contexto
return [{
  json: {
    // ... campos existentes
    temas_quests_existentes: temasExistentes
  }
}];
```

### B) Node "Aplicar Limites & Dedupe" - Validar Tema

**Adicionar validação temática após linha 236:**

```javascript
// === VALIDAÇÃO DE TEMA (não só título) ===
const temasUsados = new Set();

// Preencher com temas das quests já criadas
for (const questJaCriada of questsJaCriadas) {
  const titulo = String(questJaCriada?.titulo || '');
  const descricao = String(questJaCriada?.descricao || '');
  const tema = extrairTema(titulo, descricao);
  temasUsados.add(tema);
}

// Durante processamento de candidatas
for (const quest of candidatas) {
  // ... código existente
  
  const tema = extrairTema(quest.titulo, quest.descricao);
  
  // REGRA: Máximo 2 quests do mesmo tema
  const countTema = Array.from(temasUsados).filter(t => t === tema).length;
  if (countTema >= 2) {
    continue; // Pular quest se tema já tem 2 ocorrências
  }
  
  // ... resto do código
  temasUsados.add(tema);
}
```

---

## 4. ALTERAÇÕES NO USER PROMPT (Contexto)

### Arquivo: `sw_criar_quest.json` - Node "Agente Quests" (linha 204)

**Inserir após "QUESTS JÁ EXISTENTES":**

```
**TEMAS JÁ COBERTOS (EVITAR REPETIÇÃO):**
{{ JSON.stringify($json.temas_quests_existentes || {}) }}

**REGRA DE VARIEDADE:** 
- Se um tema tem 2+ quests → escolher tema DIFERENTE
- Priorizar temas com 0 quests existentes
```

---

## 5. PROMPT DO AGENTE - System Message (Linha 209)

### Inserir APÓS "=== SUA MISSÃO ===" e ANTES de "=== REGRAS OBRIGATÓRIAS ===":

```xml
=== PRINCÍPIO DA ABRANGÊNCIA (CRITICAL) ===

**SEMPRE prefira quests ABRANGENTES a micro-técnicas:**

❌ Evitar: "Pratique respiração 4-7-8 antes de trades"
✅ Preferir: "Domine Controle Emocional em Trading" (inclui: respiração + journaling + análise de gatilhos)

❌ Evitar: "Faça pausas conscientes antes de decisões"
✅ Preferir: "Estruture Rituais Pré-Decisão" (inclui: pausa + checklist + reflexão)

**REGRA:** Cada quest deve cobrir um OBJETIVO MAIOR, usando múltiplas técnicas/ferramentas.

=== DIVERSIDADE FORÇADA ===

**Ao gerar 3-4 quests, OBRIGATORIAMENTE garantir:**
- ✅ Temas DIFERENTES (ex: 1 emocional + 1 prático + 1 sabotador)
- ✅ Áreas da vida VARIADAS (trabalho, finanças, autoconhecimento)
- ✅ Abordagens COMPLEMENTARES (ação concreta + reflexão + técnica)

**ANTES de gerar cada quest:**
<thinking>
1. Tema da quest anterior? → Escolher tema DIFERENTE
2. Quests existentes do usuário têm 2+ sobre [tema]? → EVITAR esse tema
3. Posso EXPANDIR o escopo ao invés de criar micro-quest?
</thinking>
```

---

## 6. VALIDAÇÃO DE DIVERSIDADE (Novo Node)

### Node: "Validar Diversidade" (Inserir após "Aplicar Limites & Dedupe")

```javascript
// Validar se quests finais têm diversidade temática
const questsFinais = $json.novas_quests || [];

const temas = questsFinais.map(q => extrairTema(q.titulo, q.descricao));
const temasUnicos = new Set(temas);

// REGRA: Mínimo 2 temas diferentes para 3 quests
if (questsFinais.length >= 3 && temasUnicos.size < 2) {
  throw new Error(`❌ DIVERSIDADE INSUFICIENTE: ${questsFinais.length} quests com apenas ${temasUnicos.size} tema(s). Mínimo: 2 temas.`);
}

// Log de debug
console.log('✅ Diversidade validada:', {
  total_quests: questsFinais.length,
  temas_unicos: Array.from(temasUnicos),
  distribuicao: temas.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {})
});

return [$json];
```

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Prompt (Alta Prioridade)
- [ ] Adicionar seção "REGRAS DE DIVERSIDADE" no system prompt
- [ ] Inserir "ANTI-PADRÕES" com exemplos negativos
- [ ] Adicionar "PRINCÍPIO DA ABRANGÊNCIA"
- [ ] Incluir "MATRIZ DE VARIEDADE OBRIGATÓRIA"
- [ ] Forçar `<thinking>` antes de cada quest

### Fase 2: Contexto (Média Prioridade)
- [ ] Extrair temas de quests existentes (node "Preparar Quest")
- [ ] Passar `temas_quests_existentes` para agente
- [ ] Adicionar contagem de temas no user prompt

### Fase 3: Validação (Baixa Prioridade)
- [ ] Implementar função `extrairTema()` reutilizável
- [ ] Adicionar validação temática no dedupe
- [ ] Criar node "Validar Diversidade" (opcional)

---

## 8. EXEMPLOS DE OUTPUT ESPERADO

### Antes (Repetitivo)
```
1. "Estratégia Prática para Controle Emocional em Trades de BTC"
2. "Desafie o Sr. Inquieto com prática diária de respiração focada"
3. "Controle Emocional Prático para Traders de BTC com Foco em Paciente"
```
**Problema:** 3 quests sobre controle emocional

### Depois (Diverso)
```
1. "Domine Suas Emoções e Finanças em Trading de BTC"
   → Tema: controle emocional + financeiro
   → Abrangente: respiração + journaling + análise de perdas + gestão de risco

2. "Neutralize o Sr. Inquieto com Estrutura e Checklist"
   → Tema: sabotador
   → Abrangente: ritual pré-decisão + checklist + timer de pausa + revisão

3. "Finalize Módulo de Autenticação do MindQuest em 3 Sprints"
   → Tema: produtividade/trabalho
   → Abrangente: planejamento + execução + testes + deploy
```

---

## 9. MÉTRICAS DE SUCESSO

| Métrica | Antes | Meta Após Implementação |
|---------|-------|------------------------|
| Quests com tema repetido (mesmo grupo) | 8/15 (53%) | 0/15 (0%) |
| Temas únicos por batch de 3 quests | 1-2 | 2-3 |
| Quests "micro-técnica" vs "abrangente" | 80% micro | 80% abrangente |
| Necessidade de excluir quests similares | Alta (manual) | Baixa (automático) |

---

## 10. PRÓXIMOS PASSOS

1. **Revisar plano** com usuário → Aprovar mudanças
2. **Implementar Fase 1** (prompt) → Testar com 3 execuções
3. **Analisar outputs** → Validar diversidade
4. **Implementar Fase 2** (contexto) → Se necessário
5. **Monitorar produção** → Ajustar thresholds de tema

---

## REFERÊNCIAS

- `@docs/ref/guia_system_prompts.md` - Seção 2 (Princípios de Ouro), Seção 4C (Self-Reflection)
- `@docs/ref/quests.md` - Regras de criação
- Workflow `sw_criar_quest.json` - Nodes 204-236

---

**Status:** Aguardando aprovação para implementação  
**Prioridade:** Alta (impacta UX - quests repetitivas frustram usuário)

