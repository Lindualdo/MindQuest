# Análise: Workflows Experts

**Data:** 2025-11-30 12:00
**Tipo:** Documento Executivo

---

## Visão Geral

Especialistas que recebem a conversa bruta e extraem informações estruturadas usando IA.

| Expert | Função | Tabela |
|--------|--------|--------|
| `sw_experts_panas` | Emoções | `usuarios_emocoes` |
| `sw_expert_humor_energia` | Humor e energia | `usuarios_humor_energia` |
| `sw_expert_sabotadores` | Padrões mentais | `usuarios_sabotadores` |
| `sw_expert_insights_acionaveis` | Insights | `insights` |
| `sw_expert_bigfive_ocean` | Personalidade | `usuarios_perfis` |

---

## Padrão Comum

Todos seguem a mesma estrutura:

```
Entrada (conversa) → IA Analisa → Parser JSON → Grava no banco
```

---

## 1. Expert Emoções (PANAS)

**Entrada:** Conversa completa + chat_id
**Extrai:** Emoções detectadas na fala do usuário
**Saída:** Lista de emoções com intensidade

| Campo | Exemplo |
|-------|---------|
| emocao | "alegria", "ansiedade" |
| intensidade | 1-10 |
| contexto | "trabalho", "família" |

---

## 2. Expert Humor & Energia

**Entrada:** Conversa completa
**Extrai:** Estado geral do usuário
**Saída:** Níveis numéricos

| Campo | Faixa |
|-------|-------|
| humor | 1-10 |
| energia | 1-10 |
| observacao | texto livre |

---

## 3. Expert Sabotadores

**Entrada:** Conversa completa
**Extrai:** Padrões mentais limitantes ativos
**Saída:** Sabotador(es) identificados

| Campo | Exemplo |
|-------|---------|
| sabotador_id | "inquieto", "critico" |
| apelido | "Sr. Ansioso" |
| intensidade | 1-100 |
| contexto | "financeiro" |
| insight | "ansiedade antes de decisões" |
| contramedida | "respiração antes de agir" |

**Ponto forte:** Extrai contexto completo do sabotador.

---

## 4. Expert Insights

**Entrada:** Conversa + histórico de insights
**Extrai:** Percepções acionáveis
**Saída:** Insights novos ou atualizados

| Campo | Descrição |
|-------|-----------|
| titulo | Nome do insight |
| categoria | Tipo (comportamental, emocional...) |
| prioridade | alta/media/baixa |
| resumo | Situação identificada |
| sugestao | Ação recomendada |

**Diferencial:** Consulta insights anteriores para evitar duplicatas.

---

## 5. Expert Big Five (OCEAN)

**Entrada:** Conversa + histórico
**Extrai:** Traços de personalidade
**Saída:** Scores atualizados

| Traço | Descrição |
|-------|-----------|
| Abertura | Curiosidade, criatividade |
| Conscienciosidade | Organização, disciplina |
| Extroversão | Sociabilidade |
| Amabilidade | Cooperação |
| Neuroticismo | Estabilidade emocional |

**Diferencial:** Busca histórico antes de analisar (visão longitudinal).

---

## ❌ Gaps Identificados

| Expert | O que falta |
|--------|-------------|
| Todos | Não recebem objetivos do usuário |
| Todos | Não relacionam extração com metas |
| Insights | Não extrai pedidos explícitos de quests |
| Sabotadores | Não vincula com objetivo ativo |
| — | Não existe expert de "Objetivos/Metas" |

---

## Oportunidade: Criar Expert de Objetivos

**Proposta:** `sw_expert_objetivos`

| Campo | Descrição |
|-------|-----------|
| objetivo_mencionado | Meta citada na conversa |
| area_vida | Finanças, Trabalho, Saúde... |
| tipo_mencao | progresso, bloqueio, pedido |
| quest_solicitada | Se usuário pediu quest específica |
| relacao_objetivo_ativo | Link com objetivo configurado |

**Entrada:** Conversa + objetivos ativos
**Saída:** Menções estruturadas + pedidos de quests

---

## Oportunidade: Enriquecer Experts Existentes

Passar `objetivos_ativos` como contexto para:
- Sabotadores → identificar qual objetivo está sendo bloqueado
- Insights → relacionar insight com meta específica
- Humor/Energia → correlacionar com progresso nos objetivos

---

## Referências

| Workflow | ID |
|----------|-----|
| sw_experts_panas | `vJRfrbY4NhpNyfCD` |
| sw_expert_humor_energia | `GykxpS5vsg8NeoOh` |
| sw_expert_sabotadores | `Vbc4JHAR3388mLcv` |
| sw_expert_insights_acionaveis | `nEstxgiVE8GLXgUQ` |
| sw_expert_bigfive_ocean | `nOl6lnaGMpyg9S9J` |

