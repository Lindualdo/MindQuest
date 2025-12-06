# Notificações Inteligentes - Regras de Negócio
## Versão Executiva/Gerencial

**Data:** 2025-12-05  
**Versão:** 2.1  
**Status:** Especificação

---

## 1. Visão Geral

Sistema de notificações personalizadas com IA que analisa o contexto do usuário e gera mensagens relevantes, acolhedoras e engajadoras.

### Filosofia MindQuest
```
Conversar → Entender → Agir → Evoluir
```

---

## 2. Tipos de Notificação

| Tipo | Objetivo | Frequência Máx |
|------|----------|----------------|
| **Conversa** | Engajar usuário em reflexão diária | 1x/período |
| **Ação** | Lembrar quests pendentes/atrasadas | 1x/período |

**Total máximo:** 2 notificações por período (manhã/tarde/noite)

---

## 3. Regras de Priorização

### 3.1 Notificação de Conversa

| Prioridade | Contexto | Exemplo |
|------------|----------|---------|
| 1️⃣ | Celebração (streak, nível, conquista) | "Parabéns! 5 dias seguidos..." |
| 2️⃣ | Continuidade (tema da última conversa) | "Lembrei que você mencionou..." |
| 3️⃣ | Engajamento geral | "Como está seu dia hoje?" |

### 3.2 Notificação de Ação

| Prioridade | Tipo de Quest | Critério |
|------------|---------------|----------|
| 1️⃣ | Quest atrasada | `data_planejada < hoje` |
| 2️⃣ | Quest do dia pendente | `data_planejada = hoje AND status = 'pendente'` |
| 3️⃣ | Quest não planejada | Ativa sem recorrência configurada |

### 3.3 Seleção de Quests (máx 2)

| Regra | Descrição |
|-------|-----------|
| Diversificar origem | 1 quest de sabotador + 1 quest de objetivo |
| Evitar duplicidade | Se muito semelhantes, enviar apenas 1 |
| Contexto completo | IA analisa título, descrição e origem |

---

## 4. Controle Anti-Spam

| Regra | Valor | Implementação |
|-------|-------|---------------|
| Máx notificações/período | 2 | 1 conversa + 1 ação |
| Máx notificações/dia | 6 | 2 por período × 3 períodos |
| Cooldown mesmo tipo | 4h | Não repetir tipo no mesmo período |
| Horários diferentes | Sim | Conversa e Ação em janelas distintas |

---

## 5. Janelas de Envio

### 5.1 Por Período

| Período | Conversa | Ação |
|---------|----------|------|
| Manhã (6h-12h) | 7h ou 8h | 10h ou 11h |
| Tarde (12h-18h) | 13h ou 14h | 16h ou 17h |
| Noite (18h-23h) | 19h | 21h |

### 5.2 Lógica de Envio

```
Se hora_atual está na janela de Conversa:
  → Verifica pendência de conversa
  → Se pendente E não notificou hoje → Envia

Se hora_atual está na janela de Ação:
  → Verifica quests pendentes/atrasadas
  → Se existem E não notificou hoje → Envia
```

---

## 6. Canais de Comunicação

| Canal | Status | Particularidade |
|-------|--------|-----------------|
| **Push** | ✅ Ativo | Mensagem curta, CTA para app |
| **WhatsApp** | ✅ Ativo | Mesmo canal do Mentor, respostas integradas |
| **Email** | 🔲 TODO | Digest semanal (futuro) |
| **SMS** | ❌ Removido | Não implementar |

### 6.1 Integração WhatsApp + Mentor

- Notificações via WhatsApp são **início de conversa**
- Usuário pode responder diretamente
- Mentor recebe contexto: "Usuário respondeu notificação de {tipo}"
- Fluxo continua naturalmente

---

## 7. Estrutura das Mensagens

### 7.1 Notificação de Conversa

```
📌 TÍTULO: Personalizado com nome + contexto emocional
   
💬 CORPO:
   - Reconhecimento (conquistas, esforço)
   - Conexão (tema da última conversa)
   - Convite aberto

🔘 RESPOSTA SUGERIDA:
   WhatsApp: "Sim, vamos conversar" / "Agora não"
   Push: [Abrir conversa]
```

### 7.2 Notificação de Ação

```
📌 TÍTULO: Gancho emocional + sabotador/objetivo
   Ex: "Hora de desafiar o Hiper-Realizador 💪"
   
💬 CORPO:
   - Quest principal (mais urgente)
   - Quest secundária (se diferente contexto)
   - Micro-compromisso (ação pequena)

🔘 RESPOSTA SUGERIDA:
   WhatsApp: "Vou fazer agora" / "Lembrar mais tarde"
   Push: [Ver quests]
```

---

## 8. Métricas de Sucesso

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Taxa de abertura | >40% | Push: cliques / enviados |
| Taxa de resposta | >25% | WhatsApp: respostas / enviados |
| Conversão em ação | >15% | Quest concluída em 2h após notificação |
| Opt-out | <5% | Usuários que desativam |

---

## 9. Configurações do Usuário

| Configuração | Opções | Default |
|--------------|--------|---------|
| `lembretes_ativo` | true/false | true |
| `lembretes_periodo` | manhã/tarde/noite | manhã |
| `lembretes_conversas_diarias` | true/false | true |
| `lembretes_quests` | true/false | true |
| `lembretes_canais` | [push, whatsapp] | [push] |

---

## 10. Casos Especiais

| Situação | Comportamento |
|----------|---------------|
| Usuário completou tudo | Enviar apenas celebração |
| Sem quests ativas | Não enviar notificação de ação |
| Primeira semana | Mensagens mais acolhedoras |
| Streak em risco | Priorizar na notificação |
| Muitas quests atrasadas (>5) | Focar em 2 mais importantes |

---

## 11. Roadmap

| Fase | Escopo | Status |
|------|--------|--------|
| v2.0 | Notificações básicas multicanal | ✅ Feito |
| v2.1 | IA personalizada + priorização | 🔄 Em spec |
| v2.2 | A/B testing de mensagens | 📋 Planejado |
| v2.3 | Digest semanal por email | 📋 Planejado |
