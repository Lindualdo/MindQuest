# Notificações de Quests - Visão Executiva

**Versão:** 2.0.0  
**Atualizado em:** 17 Dezembro 2025  
**Objetivo:** Maximizar engajamento do usuário através de lembretes personalizados e contextualizados

---

## Propósito

Notificar o usuário **diariamente às 15h** sobre a quest mais relevante para seu momento atual, aumentando taxa de conclusão e retenção.

---

## Regras de Priorização

### 1. Bem-Estar em Primeiro Lugar

**Condição:** Humor OU Energia abaixo de 5 (escala 1-10)

→ **Ação:** Priorizar quests de **TCC ou Estoicismo** (bem-estar mental)  
→ **Motivo:** Usuário precisa de suporte emocional antes de progresso em objetivos

| Indicador | Ação |
|-----------|------|
| Humor < 5 | Quest de bem-estar |
| Energia < 5 | Quest de bem-estar |
| Ambos OK | Rotação normal |

---

### 2. Rotação de Categorias (quando bem-estar OK)

**Sistema:** Rotação sequencial de 5 categorias para variedade

| Dia | Categoria | Foco |
|-----|-----------|------|
| 1 | **TCC** | Técnicas cognitivo-comportamentais |
| 2 | **Estoicismo** | Práticas filosóficas |
| 3 | **Sabotador** | Trabalhar padrões limitantes |
| 4 | **Personalizada** | Ação específica da conversa do usuário |
| 5 | **Objetivo** | Progresso em metas definidas |
| 6+ | Reinicia | Volta para TCC |

**Regra de Disponibilidade:**
- Sem quest da categoria do dia? → Pula para próxima disponível
- Sempre notifica pelo menos 1 quest (nunca pula o dia)

---

## Frequência

| Horário | Tipo | Condição |
|---------|------|----------|
| **09h** | Conversa | Usuário não conversou hoje |
| **15h** | Quest | Usuário não recebeu notificação de quest hoje |

**Controle de Duplicação:**
- Máximo 1 notificação de quest por dia
- Nunca repete a mesma quest notificada ontem

---

## Estrutura da Mensagem

### Elementos Obrigatórios

1. **Nome do usuário** - personalização
2. **Ação específica** - título da quest resumido
3. **Benefício/Conexão** - por que é importante agora
4. **Convite leve** - sem pressão ("Topa?", "Bora?")

### Adaptação ao Tom

| Tom do Usuário | Estilo da Mensagem |
|----------------|-------------------|
| Empático | Acolhedor, validação emocional |
| Direto | Objetivo, sem floreios |
| Interativo | Leve, curioso |
| Equilibrado | Mix de validação + direcionamento |

---

## Benefícios Esperados

| Métrica | Meta | Impacto |
|---------|------|---------|
| Taxa de conclusão de quests | +30% | Maior progresso do usuário |
| Engajamento diário | +25% | Mais interações com app |
| Retenção D7 | +15% | Usuários voltam mais vezes |
| NPS | +10 pontos | Maior satisfação |

---

## Exemplo de Fluxo

### Cenário 1: Usuário com Humor Baixo

**Contexto:**
- Humor: 3/10
- Energia: 7/10
- Quests disponíveis: TCC, Sabotador, Objetivo

**Decisão:** Quest TCC (bem-estar prioritário)

**Mensagem:**
> "Aldo, percebi que talvez seu dia esteja mais pesado. Tenho um desafio rápido de 2 minutos - a técnica 4-7-8 ajuda a acalmar a mente. Quer tentar?"

---

### Cenário 2: Usuário OK, Dia de Sabotador

**Contexto:**
- Humor: 7/10
- Energia: 6/10
- Última categoria: Estoicismo
- Quests disponíveis: Sabotador, Personalizada

**Decisão:** Quest Sabotador (rotação normal)

**Mensagem:**
> "Aldo, lembrete do seu desafio: fazer pausas intencionais para celebrar pequenas conquistas. A ciência mostra que isso mantém a motivação alta. Bora?"

---

### Cenário 3: Não Tem Quest da Categoria

**Contexto:**
- Humor: 8/10
- Energia: 7/10
- Dia de Sabotador
- Quests disponíveis: **Nenhuma** de sabotador, **2** personalizadas

**Decisão:** Pula para Personalizada (próxima disponível)

**Mensagem:**
> "Aldo, lembrete do desafio: organizar o cronograma do projeto X. Isso vai direto no seu objetivo. 10 minutinhos focados fazem diferença!"

---

## Canais de Envio

| Canal | Quando Usa |
|-------|-----------|
| **WhatsApp** | Preferencial (se usuário habilitou) |
| **Push** | Complementar (se token disponível) |

**Controle de Spam:** 1 notificação de quest por canal por dia

---

## Monitoramento

### Indicadores de Sucesso

1. **Taxa de abertura** - % que clicam na notificação
2. **Taxa de conclusão** - % que completam quest após notificação
3. **Taxa de opt-out** - % que desativam notificações

### Gatilhos de Alerta

| Situação | Ação |
|----------|------|
| Taxa abertura < 20% | Revisar copy das mensagens |
| Taxa opt-out > 5% | Revisar frequência/relevância |
| Quest nunca notificada | Revisar lógica de rotação |

---

## Evolução Futura

### Próximas Melhorias (Roadmap)

1. **Horário personalizado** - cada usuário define seu melhor horário
2. **Frequência variável** - mais notificações para engajados, menos para novos
3. **Streak bonus** - mensagens especiais para sequências de conclusão
4. **Prazo urgente** - priorizar quest com deadline próximo

---

## Resumo Executivo - 30 segundos

**O que é:** Sistema de notificações diárias (15h) que lembra usuário de fazer sua quest mais relevante

**Como funciona:** Rotação de 5 categorias (TCC, Estoicismo, Sabotador, Personalizada, Objetivo) com prioridade para bem-estar se humor/energia baixo

**Por que importa:** Aumenta engajamento (+25%), conclusão de quests (+30%) e retenção (+15%)

**Diferencial:** Contextualiza ao momento emocional do usuário (não é genérico)
