# Mentor MindQuest v2 — Especificação Funcional

**Data:** 2025-12-07  
**Status:** Aprovado para implementação

---

## Contexto

O Mentor é o motor do MindQuest. Através das conversas, alimenta todo o sistema: experts processam dados, geram quests e insights que impulsionam a evolução do usuário.

**Framework:** CONVERSAR → ENTENDER → AGIR → EVOLUIR

---

## Problemas da v1

| # | Problema | Impacto |
|---|----------|---------|
| 1 | **Limite rígido de interações** (5-20) | Corta conversa, UX ruim, inflexível |
| 2 | **Gravação apenas no final** | Perde dados se usuário abandona |
| 3 | **Experts acoplados ao workflow** | Processo pesado, sem saber quando rodar |
| 4 | **Mesmo canal para tudo** | Confusão entre notificações e conversas |
| 5 | **Temas fixos por dia** | Não adapta ao contexto real do usuário |

---

## Soluções v2

### 1. Sem Limite de Interações

- Usuário conversa o quanto precisar
- Mentor detecta **checkpoints naturais** (reflexão, insight, sinais de encerramento)
- Mentor sugere encerramento, **usuário confirma**
- Garante que conversa não fica "travada" por limite artificial

### 2. Sessão = Dia

- Uma sessão (`usr_chat`) por usuário por dia
- Usuário pode voltar várias vezes, mensagens acumulam na mesma sessão
- Gravação incremental: cada mensagem salva em `usr_chat.mensagens` (JSON)
- Não perde dados mesmo se usuário abandonar

### 3. Experts em Background

**Quando rodam:**
- Usuário encerra conversa (checkpoint + confirmação)
- Job noturno (segurança): processa sessões abertas com +4h de inatividade

**Regra crítica:** Experts sempre reprocessam dados completos do dia (não incremental)

### 4. Tudo é Conversa

- Qualquer mensagem do usuário = conversa
- Lembrete de quest no WhatsApp → usuário responde → Mentor interpreta:

| Resposta | Mentor faz |
|----------|------------|
| "fiz" / "ok" | "Boa! Marca no app 💪" |
| "não consegui" | "O que aconteceu?" (abre conversa) |
| "tô mal hoje" | Acolhe e conversa |

- Conclusão de quest continua sendo feita **no app**
- WhatsApp = canal de conversa, não de ações

### 5. Abertura Contextual

Mentor analisa contexto antes de iniciar:

| Situação | Abertura |
|----------|----------|
| Dias sem conversar | "Sumiu! Como foram esses dias?" |
| Quest atrasada | "Vi que a quest X ficou parada. O que rolou?" |
| Humor baixo recente | "Ontem você tava meio pra baixo. Melhorou?" |
| Objetivo parado | "Faz tempo que não falamos do [objetivo]..." |
| Tudo ok | "E aí, como tá hoje?" |

**Mentor sugere, usuário decide** o caminho da conversa.

---

## Fluxo Resumido

```
Usuário manda mensagem
        ↓
Sessão do dia existe?
  → Não: cria nova sessão, abertura contextual
  → Sim: continua sessão
        ↓
Grava mensagem (incremental)
        ↓
Mentor responde
        ↓
Detecta checkpoint?
  → Sim: "Quer encerrar por aqui?"
    → Usuário confirma: resumo + dispara experts
    → Usuário quer continuar: segue
  → Não: continua conversa
        ↓
Job noturno: processa sessões abertas +4h
```

---

## Mudanças Técnicas (Alto Nível)

| Componente | v1 | v2 |
|------------|----|----|
| Limite interações | 5-20 fixo | Sem limite |
| Gravação | Batch no final | Incremental (cada msg) |
| Sessão | Por conversa | Por dia |
| Experts | No mesmo workflow | Job separado |
| Encerramento | Automático | Checkpoint + confirmação |
| Abertura | Fixa | Contextual + escolha do usuário |

---

## Regras de Negócio

1. **1 sessão por dia por usuário**
2. **Experts rodam 1x por dia** (no encerramento ou job noturno)
3. **Experts reprocessam dados completos** do dia (não incremental)
4. **Toda mensagem é conversa** — mentor interpreta contexto
5. **Ações (concluir quest, etc) acontecem no app** — não no WhatsApp

---

## Próximos Passos

1. Ajustar workflow `mentor_mindquest` para gravação incremental
2. Implementar detecção de checkpoint no prompt do mentor
3. Criar job de processamento de experts
4. Ajustar abertura contextual no prompt

---

## Referências

- `docs/espec/produto/framework_mindquest.md`
- `docs/ref/quests.md`
- Workflow atual: `mentor_mindquest` (c1To6ho5riDs85Aj)
