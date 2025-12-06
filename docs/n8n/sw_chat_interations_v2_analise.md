# Análise: sw_chat_interations_v2

**Data:** 2025-11-30 12:00
**Tipo:** Documento Executivo

---

## Objetivo

Orquestrador central das conversas do MindQuest. Recebe mensagens do usuário, processa com IA, grava e dispara os experts para extração.

---

## Fluxo Principal

```
Mensagem → Transcrição → Lock? → Agente Reflexão → Resposta → Última? → Grava → Experts
```

### Etapas

| # | Etapa | O que faz |
|---|-------|-----------|
| 1 | Entrada | Recebe mensagem + dados do usuário |
| 2 | Config | Carrega configurações do sistema |
| 3 | Dados usuário | Busca perfil, Big Five, histórico |
| 4 | Lock | Verifica se usuário já finalizou hoje (12h) |
| 5 | Transcrição | Converte áudio em texto (se necessário) |
| 6 | Memória | Recupera contexto da sessão |
| 7 | Agente Reflexão | IA conversa com o usuário |
| 8 | Resposta | Envia resposta via WhatsApp |
| 9 | Última? | Verifica se é a última interação |
| 10 | Grava | Salva conversa em `usr_chat` |
| 11 | Experts | Dispara todos em paralelo |
| 12 | Resumo | Gera resumo da conversa |
| 13 | XP + Quests | Calcula XP e cria quests |

---

## Experts Disparados (em paralelo)

| Expert | O que extrai | Grava em |
|--------|--------------|----------|
| `experts_panas` | Emoções detectadas | `usuarios_emocoes` |
| `experts_humor_energia` | Nível de humor/energia | `usuarios_humor_energia` |
| `experts_sabotadores` | Padrões mentais | `usuarios_sabotadores` |
| `Expert_Insights` | Insights acionáveis | `insights` |
| `experts_bigfive` | Traços de personalidade | `usuarios_perfis` |

---

## O que FAZ BEM

- Conversa guiada com IA adaptativa
- Extração paralela por especialistas
- Memória de sessão (Redis)
- Lock para evitar múltiplas finalizações
- Gravação completa das mensagens

---

## ❌ O que NÃO FAZ (Gaps)

| Gap | Impacto |
|-----|---------|
| Não consulta objetivos do usuário | Conversa não direciona para metas |
| Não extrai pedidos explícitos | "Crie uma quest para X" se perde |
| Não identifica temas recorrentes | Falta visão de padrões entre conversas |
| Não passa objetivos para experts | Insights não relacionam com metas |
| Não tem expert de "objetivos" | Menções a metas ficam no texto bruto |

---

## Oportunidades de Melhoria

### 1. Contexto de Objetivos
Antes do agente conversar, buscar objetivos ativos e passar no prompt.

### 2. Expert de Objetivos
Criar `experts_objetivos` para extrair:
- Menções a projetos/metas
- Pedidos explícitos de quests
- Progresso relatado pelo usuário

### 3. Extração de Pedidos
Identificar quando usuário pede algo específico:
- "Crie uma quest para..."
- "Me lembre de..."
- "Quero focar em..."

### 4. Passar Contexto aos Experts
Incluir `objetivos_ativos` no payload dos experts para relacionar extrações.

---

## Referências
- Workflow ID: `aRonGjwfYoY1UUHH`
- Nodes: 57 | Conexões: 50

