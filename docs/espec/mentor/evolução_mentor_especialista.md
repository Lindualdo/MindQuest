# MindQuest — Sistema de Experts Especializados

**Data:** 2025-12-08  
**Versão:** 1.0  
**Status:** Proposta Arquitetural

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Por Que Experts Especializados](#por-que-experts-especializados)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Objetivos Pré-configurados](#objetivos-pré-configurados)
5. [Como Experts Funcionam](#como-experts-funcionam)
6. [Exemplo Completo](#exemplo-completo)
7. [Implementação por Fases](#implementação-por-fases)
8. [Ressalvas e Cuidados](#ressalvas-e-cuidados)
9. [Decisões Técnicas](#decisões-técnicas)

---

## Visão Geral

### Conceito

Sistema de **experts especializados** que são acionados pelo Mentor conforme o objetivo do usuário. Cada expert conhece frameworks, metodologias e padrões específicos da sua área de atuação.

### Diferencial Competitivo

| Chat Genérico de IA | MindQuest com Experts |
|---------------------|----------------------|
| Responde o que você pergunta | Sistema especializado por objetivo |
| Conselhos genéricos | Quests baseadas em metodologias comprovadas |
| Sem contexto de evolução | Framework específico com fases |
| Não detecta bloqueios típicos | Conhece armadilhas de cada objetivo |

### Promessa

> **"Não é mais um chat de IA. É um sistema especializado que conhece seu objetivo, detecta seus bloqueios e gera micro-ações baseadas em metodologias comprovadas."**

---

## Por Que Experts Especializados

### 1. Onboarding Mais Assertivo

**Sem experts:**
```
Usuário: "Quero lançar um negócio"
Sistema: "Que tipo de negócio? O que você já fez?"
→ Conversa genérica, quests vagas
```

**Com experts:**
```
Usuário: seleciona "Lançar negócio/projeto"
Sistema: ativa Expert_Negocio
→ Framework Lean Startup + Jobs to Be Done
→ Quests específicas desde o dia 1
```

### 2. Quests Contextualizadas

**Expert Genérico:**
> "Liste 3 ações para começar seu projeto"

**Expert_Negocio:**
> "Validação Rápida: Converse com 3 pessoas do seu público-alvo e pergunte se pagariam pelo que você quer oferecer. Não precisa ter nada pronto."

**Diferença:** Expert conhece metodologia específica (Lean Startup), sabe qual é o primeiro passo real.

### 3. Bloqueios Típicos por Objetivo

Padrões mentais agem diferente em cada área:

| Objetivo | Padrão: Inquieto | Quest Ideal |
|----------|------------------|-------------|
| Lançar negócio | Planejamento infinito, não valida | Ação de validação rápida (falar com 3 pessoas) |
| Criar hábitos | Começa várias rotinas, não sustenta | Micro-hábito único por 7 dias |
| Mudar carreira | Pesquisa infinita, não se expõe | Atualizar LinkedIn + conversar com 1 pessoa da área |

### 4. Fases de Evolução

Cada objetivo tem jornada estruturada:

```
Lançar Negócio:
Validação → MVP → Primeiros Clientes → Iteração

Mudar Carreira:
Autoconhecimento → Exploração → Transição → Adaptação

Criar Hábitos:
Ancoragem → Repetição → Automação → Expansão
```

Expert sabe em qual fase o usuário está e ajusta as quests.

---

## Arquitetura do Sistema

### Estrutura de Experts

```
┌─────────────────────────────────────────────┐
│           MENTOR (Gemini 2.5 Flash)         │
│  - Conversa com usuário                     │
│  - Coleta informações                       │
│  - Apresenta quests                         │
└──────────────┬──────────────────────────────┘
               │
               ├──────────────────┬────────────────┐
               ▼                  ▼                ▼
        ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
        │ Expert_Base  │   │Expert_Negocio│  │Expert_Carreira│
        │(sempre ativo)│   │(se objetivo  │  │(se objetivo   │
        │              │   │ corresponder)│  │  corresponder)│
        └──────────────┘   └──────────────┘  └──────────────┘
               │                  │                │
               └──────────────────┴────────────────┘
                              ▼
                    ┌──────────────────────┐
                    │  Sistema combina     │
                    │  análises + quests   │
                    └──────────────────────┘
```

### Expert_Base (Sempre Ativo)

**Responsabilidades:**
- Detecta emoções (frustração, ansiedade, empolgação)
- Identifica padrões mentais (Inquieto, Realizador, Vigilante)
- Extrai informações gerais da conversa
- Prepara contexto para experts especializados

**Modelo:** Gemini 2.5 Flash (rápido + barato)

**Saída:**
```json
{
  "emocoes": ["frustração", "ansiedade"],
  "padroes_mentais": ["Inquieto"],
  "bloqueios_gerais": ["procrastinação", "medo de começar"],
  "contexto_resumido": "Usuário quer lançar curso online mas está travado há 3 meses planejando"
}
```

### Expert_Especializado (Acionado por Objetivo)

**Responsabilidades:**
- Conhece framework específico da área
- Identifica fase atual do objetivo
- Detecta bloqueios típicos daquele objetivo
- Gera quests baseadas em metodologia comprovada
- Sugere filosofia/técnica aplicável

**Modelo:** Gemini 2.5 Flash (mesmo modelo, prompts especializados)

**Saída:**
```json
{
  "fase_atual": "Validação",
  "bloqueio_tipico": "Perfeccionismo pré-lançamento",
  "quest_sugerida": {
    "titulo": "Pré-venda Teste",
    "descricao": "Crie post oferecendo o curso por valor promocional. Meta: 3 pessoas interessadas.",
    "filosofia": "Venda a ideia antes de criar o produto. (Lean Startup)",
    "dificuldade": "média"
  },
  "proxima_fase": "MVP"
}
```

---

## Objetivos Pré-configurados

### MVP (Lançamento) - 5 Objetivos

| # | Objetivo | Expert | Framework Base |
|---|----------|--------|----------------|
| 1 | **Lançar negócio/projeto** | Expert_Negocio | Lean Startup, Jobs to Be Done |
| 2 | **Mudar de carreira** | Expert_Carreira | Ikigai, Transferable Skills |
| 3 | **Criar hábitos saudáveis** | Expert_Habitos | Atomic Habits (James Clear) |
| 4 | **Desenvolver habilidade** | Expert_Aprendizado | Deliberate Practice, Feynman |
| 5 | **Melhorar relacionamentos** | Expert_Relacionamentos | CNV, Attachment Theory |

### Objetivo Personalizado

Usuário pode definir objetivo próprio:
- Sistema usa apenas **Expert_Base**
- Quests genéricas baseadas em padrões mentais
- Pode sugerir objetivo pré-configurado se detectar match

---

## Como Experts Funcionam

### Exemplo: Expert_Negocio

#### Conhecimento Especializado

```markdown
## Framework
- Lean Startup (Build-Measure-Learn)
- Jobs to Be Done (problema real vs solução imaginada)
- Validação de demanda (testar antes de construir)
- MVP (Minimum Viable Product)
- Primeiros clientes (venda antes da perfeição)

## Fases do Objetivo

### Fase 1: Validação (0-30 dias)
Meta: Confirmar que existe demanda real
Quests típicas:
- Conversar com 5 pessoas do público-alvo
- Testar precificação (disposição a pagar)
- Pré-venda/lista de espera

### Fase 2: MVP (30-60 dias)
Meta: Criar versão mínima vendável
Quests típicas:
- Definir o que entra no MVP (e o que fica de fora)
- Construir landing page
- Primeira venda real

### Fase 3: Primeiros Clientes (60-90 dias)
Meta: Fechar 10 primeiras vendas
Quests típicas:
- Outreach ativo
- Refinar proposta baseado em feedback
- Coletar depoimentos

### Fase 4: Iteração (90+ dias)
Meta: Melhorar produto baseado em dados reais
Quests típicas:
- Analisar métricas de uso
- Entrevistar clientes ativos
- Implementar melhorias prioritárias
```

#### Bloqueios Típicos por Padrão Mental

| Padrão | Bloqueio Comum | Quest para Destravar |
|--------|----------------|---------------------|
| **Inquieto** | Planejamento infinito, não valida | "Hoje: envie mensagem para 3 potenciais clientes perguntando se pagariam" |
| **Realizador** | Quer fazer tudo sozinho, perfeito | "Delegue: contrate freelancer no Fiverr para criar logo básico" |
| **Vigilante** | Medo de fracasso público | "Teste privado: ofereça para 3 amigos primeiro, receba feedback honesto" |
| **Vítima** | "Mercado saturado, não vai dar certo" | "Pesquisa: encontre 3 concorrentes pequenos que ESTÃO vendendo" |
| **Racional** | Análise paralisia, comparação infinita | "Decisão: escolha 1 canal de venda e teste por 7 dias" |

#### Quests Especializadas (Exemplos)

```json
[
  {
    "fase": "Validação",
    "titulo": "Conversa de Validação",
    "descricao": "Converse com 3 pessoas que você acredita serem seu público-alvo. Pergunte qual problema real elas têm relacionado ao seu projeto. NÃO venda nada, apenas ouça.",
    "filosofia": "Não existe plano perfeito no papel. Só na rua você descobre a verdade. (Lean Startup)",
    "dificuldade": "média",
    "xp": 50
  },
  {
    "fase": "Validação",
    "titulo": "Pré-venda Teste",
    "descricao": "Crie post no Instagram/LinkedIn oferecendo seu produto/serviço por valor promocional. Meta: 3 pessoas demonstrarem interesse real (não precisa ter nada pronto).",
    "filosofia": "Venda a promessa antes de construir. Se ninguém comprar a ideia, não vão comprar o produto. (Jobs to Be Done)",
    "dificuldade": "alta",
    "xp": 100
  },
  {
    "fase": "MVP",
    "titulo": "Defina o Mínimo",
    "descricao": "Liste todas funcionalidades que você quer. Agora corte 80%. O que sobrar é seu MVP. Foque apenas nisso.",
    "filosofia": "Perfeito é inimigo do feito. Entregue rápido, aprenda, melhore. (Lean Startup)",
    "dificuldade": "média",
    "xp": 50
  }
]
```

---

## Exemplo Completo

### Contexto
- **Usuário:** João
- **Objetivo:** Lançar curso online
- **Padrão ativo:** Inquieto
- **Situação:** Travado há 3 meses planejando conteúdo

### Fluxo de Interação

```
┌─────────────────────────────────────────────┐
│ 1. CONVERSA                                 │
└─────────────────────────────────────────────┘

João: "Quero lançar meu curso online, mas tô travado faz 
3 meses planejando o conteúdo perfeito"

↓

┌─────────────────────────────────────────────┐
│ 2. EXPERT_BASE (análise emocional)          │
└─────────────────────────────────────────────┘

Detecta:
- Emoções: frustração, ansiedade
- Padrão: Inquieto (planejamento infinito)
- Bloqueio geral: procrastinação por perfeccionismo

↓

┌─────────────────────────────────────────────┐
│ 3. EXPERT_NEGOCIO (análise especializada)   │
└─────────────────────────────────────────────┘

Identifica:
- Fase atual: Validação (ainda não testou demanda)
- Bloqueio típico: Perfeccionismo pré-lançamento
- Armadilha: Criando produto sem validar se alguém quer comprar

Gera quest:
{
  "titulo": "Pré-venda Teste",
  "descricao": "Crie post no Instagram/LinkedIn oferecendo 
  o curso por valor promocional. Meta: 3 pessoas interessadas. 
  Você NÃO precisa ter nenhuma aula pronta ainda.",
  "filosofia": "Venda a ideia antes de criar o produto. 
  Se ninguém comprar a promessa, ninguém vai comprar o curso.",
  "dificuldade": "alta",
  "xp": 100
}

↓

┌─────────────────────────────────────────────┐
│ 4. MENTOR (síntese + conversa)              │
└─────────────────────────────────────────────┘

Mentor: "João, você tá há 3 meses planejando. 
Isso é o Inquieto te sabotando - ele ADORA planejar 
pra evitar a ação real.

A verdade? Você não sabe se alguém vai comprar seu curso. 
E não vai saber planejando.

Gerou uma quest pra você: testar se tem demanda ANTES 
de criar tudo. É desconfortável? Sim. Mas é o único jeito 
de saber se vale a pena continuar.

Bora tentar?"

↓

┌─────────────────────────────────────────────┐
│ 5. JOÃO ACEITA A QUEST                      │
└─────────────────────────────────────────────┘

3 dias depois...

João: "Cara, postei a pré-venda. 7 pessoas se interessaram! 
Não acredito"

Mentor: "Viu só? Agora você TEM dados reais. 
E olha que legal: você descobriu que tem demanda 
ANTES de criar 30 aulas.

Próxima quest: conversar com 3 dessas pessoas pra 
entender exatamente o que elas esperam do curso."

[Expert_Negocio identifica: transição para Fase 2 - MVP]
```

---

## Implementação por Fases

### Fase 1: MVP (Lançamento)

**Prazo:** 2-3 meses

**Entregas:**
- ✅ 3 objetivos pré-configurados (escolher os mais demandados)
- ✅ Expert_Base (sempre ativo)
- ✅ 1 Expert Especializado completo (testar viabilidade)
- ✅ Opção "objetivo personalizado" (usa só Expert_Base)
- ✅ Métricas básicas (quests geradas, taxa de conclusão)

**Objetivos Recomendados para MVP:**
1. Lançar negócio/projeto (mais demandado em empreendedorismo)
2. Criar hábitos saudáveis (apelo amplo)
3. Mudar de carreira (alta dor, momento econômico)

**Expert para Testar:**
- **Expert_Negocio** (maior complexidade, se funcionar bem aqui, funciona em todos)

**Validação:**
- Quests do expert especializado são melhores que quests genéricas?
- Usuários completam mais quests especializadas?
- NPS melhora com expert especializado?

---

### Fase 2: Expansão (Pós-validação)

**Prazo:** +2 meses

**Entregas:**
- ✅ +2 experts especializados
- ✅ Refinamento de quests baseado em feedback
- ✅ Sistema sugere objetivo pré-configurado baseado em conversa
- ✅ Métricas avançadas (qual expert tem melhor performance)

**Decisões Baseadas em Dados:**
- Quais objetivos usuários mais escolhem?
- Quais experts geram maior engajamento?
- Há padrões de abandono em algum objetivo específico?

---

### Fase 3: Escala (Maturidade)

**Prazo:** +3 meses

**Entregas:**
- ✅ Experts especializados para todos objetivos populares
- ✅ Sistema detecta mudança de objetivo (usuário pode trocar)
- ✅ Expert híbrido (usuário com 2 objetivos simultâneos)
- ✅ Biblioteca de quests especializadas (reutilização)
- ✅ API pública para criar novos experts (comunidade?)

**Diferenciação Total:**
- MindQuest não é chat genérico
- É plataforma especializada por objetivo
- Experts são marca registrada do produto

---

## Ressalvas e Cuidados

### ⚠️ 1. Não Force Objetivo Pré-configurado

**ERRADO:**
```
Onboarding obriga escolher um dos 5 objetivos
Usuário com objetivo fora da lista: frustração
```

**CERTO:**
```
Onboarding oferece:
- 5 objetivos pré-configurados (recomendados)
- Opção "Definir meu próprio objetivo"

Sistema funciona em ambos os casos:
- Pré-configurado: Expert_Base + Expert Especializado
- Personalizado: apenas Expert_Base (quests genéricas)
```

### ⚠️ 2. Expert NÃO Substitui Mentor

**ERRADO:**
```
Expert fala direto com usuário
"Olá, sou o Expert_Negocio e vou te ajudar"
```

**CERTO:**
```
Mentor é o rosto único do sistema
Expert trabalha nos bastidores
Usuário NEM SABE que existem experts

Mentor: "Gerou uma quest especializada pra você..."
(quem gerou foi o expert, mas quem apresenta é o mentor)
```

### ⚠️ 3. Não Crie Experts Demais no Início

**Armadilha:**
```
Criar 15 experts no lançamento
Maioria não é usada
Manutenção complexa
```

**Estratégia:**
```
MVP: 3 objetivos + 1 expert (teste)
Expansão: adiciona baseado em DEMANDA REAL
Prioridade: objetivos que usuários mais escolhem
```

### ⚠️ 4. Custo de API

**Problema:**
```
Cada expert = 1 chamada LLM adicional
10 mensagens/dia × 1000 usuários × 2 experts = 20.000 chamadas/dia
```

**Solução:**
```
Expert_Base: sempre ativo (necessário)
Expert Especializado: apenas quando necessário

Triggers para acionar expert:
- Usuário menciona bloqueio
- Quest anterior foi concluída (gerar próxima)
- Mudança de fase detectada
- Checkpoint semanal (análise macro)

NÃO acione expert a cada mensagem do usuário
```

### ⚠️ 5. Mantenha Quests Acionáveis

**ERRADO:**
```
Quest: "Reflita sobre seu propósito de vida"
(vago, não acionável, não mensurável)
```

**CERTO:**
```
Quest: "Converse com 3 pessoas do seu público-alvo 
e pergunte qual problema real elas têm"
(específico, acionável, mensurável)
```

**Regra de Ouro:**
> Toda quest deve ter ação clara que pode ser feita HOJE.

---

## Decisões Técnicas

### Modelo de LLM

**Recomendação:** Gemini 2.5 Flash para todos experts

**Por quê:**
- Contexto de 1M tokens (histórico completo do usuário)
- Custo 2x menor que GPT-4o Mini
- Inteligência suficiente para experts especializados
- Prompts bem estruturados compensam diferença de "empatia"

**Alternativa:**
- Mentor: GPT-4o Mini (se empatia for crítica)
- Experts: Gemini 2.5 Flash (análise + quests)

### Estrutura de Dados

```javascript
// Objetivo do usuário
{
  "objetivo_id": "negocio_001",
  "tipo": "pre_configurado", // ou "personalizado"
  "area_vida": "Carreira",
  "titulo": "Lançar curso online de Python",
  "fase_atual": "Validação",
  "expert_ativo": "Expert_Negocio",
  "frameworks_aplicados": ["Lean Startup", "Jobs to Be Done"],
  "progresso_fases": {
    "validacao": 30,
    "mvp": 0,
    "primeiros_clientes": 0,
    "iteracao": 0
  }
}

// Quest especializada
{
  "quest_id": "q_12345",
  "origem": "Expert_Negocio",
  "fase": "Validação",
  "titulo": "Pré-venda Teste",
  "descricao": "...",
  "filosofia": "Venda a ideia antes de criar o produto",
  "framework": "Lean Startup",
  "dificuldade": "alta",
  "xp": 100,
  "criterios_conclusao": ["Postou oferta", "Pelo menos 3 interessados"],
  "bloqueio_que_resolve": "Perfeccionismo pré-lançamento"
}
```

### Arquitetura de Chamadas

```javascript
// Fluxo simplificado

1. Usuário envia mensagem
   ↓
2. Mentor processa conversa (Gemini 2.5 Flash)
   ↓
3. Mentor aciona Expert_Base (sempre)
   - Análise emocional
   - Padrões mentais
   ↓
4. SE (mudança_contexto OR quest_concluida OR bloqueio_detectado):
   Mentor aciona Expert_Especializado (se objetivo corresponder)
   - Análise de fase
   - Geração de quest
   ↓
5. Mentor sintetiza análises + apresenta ao usuário
```

### Prompt Caching

```javascript
// System prompt dos experts não muda
// Ativar cache no Gemini para economizar

System Prompt (cache habilitado):
- Framework completo do expert
- Conhecimento especializado
- Quests típicas por fase
- Bloqueios comuns

User Prompt (não cacheable):
- Conversa atual
- Contexto do usuário
- Última quest
```

**Economia estimada:** 40-60% de redução de custo com caching.

---

## Métricas de Sucesso

### Para Experts Especializados

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Taxa de conclusão de quests** | +30% vs genéricas | Comparar quests expert vs base |
| **NPS por objetivo** | >50 | Survey após 30 dias |
| **Tempo até primeira ação** | <48h | Timestamp primeira quest aceita |
| **Retenção D7** | >60% | Usuários ativos após 7 dias |
| **Progressão de fase** | >40% chegam fase 2 | Tracking de fases |

### Sinais de Problema

- ❌ Quests especializadas têm taxa de conclusão MENOR que genéricas
- ❌ Usuários reclamam que quests são "genéricas demais"
- ❌ Expert sugere quests que não fazem sentido no contexto
- ❌ Custo de API estoura orçamento

**Ação:** Refinar prompts dos experts ou simplificar sistema.

---

## Próximos Passos

### Imediato (Pré-MVP)
1. ✅ Definir 3 objetivos para MVP
2. ✅ Criar prompt completo do Expert_Negocio (teste)
3. ✅ Implementar estrutura de dados (objetivos + quests)
4. ✅ Testar expert com 10 conversas reais

### MVP (Lançamento)
1. ✅ Expert_Base + 1 Expert Especializado funcionando
2. ✅ Onboarding com objetivos pré-configurados
3. ✅ Sistema de métricas básico
4. ✅ Validar com primeiros 100 usuários

### Pós-MVP
1. ✅ Analisar dados: expert está gerando valor?
2. ✅ Expandir para mais experts se validado
3. ✅ Refinar quests baseado em feedback
4. ✅ Escalar sistema

---

## Conclusão

Experts especializados transformam MindQuest de "mais um chat de IA" para **sistema especializado por objetivo**.

**Vantagens:**
- ✅ Quests contextualizadas e acionáveis
- ✅ Framework comprovado por objetivo
- ✅ Detecta bloqueios típicos da área
- ✅ Diferenciação competitiva clara

**Cuidados:**
- ⚠️ Não force objetivo pré-configurado
- ⚠️ Expert não substitui mentor
- ⚠️ Start small (3-5 objetivos no MVP)
- ⚠️ Controle custo de API

**Decisão Final:**
✅ **Implemente com estratégia faseada**  
✅ **Teste com 1 expert no MVP**  
✅ **Expanda baseado em dados reais**

---

**Documento mantido por:** Equipe MindQuest  
**Última revisão:** 2025-12-08  
**Próxima revisão:** Após validação do MVP