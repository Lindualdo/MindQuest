# Release 1.3.8 — Sistema de Objetivos

**Data:** 2025-11-30  
**Status:** Em andamento

---

## Resumo

Implementação do sistema de vinculação entre quests e objetivos do usuário, permitindo que cada quest contribua para um ou mais objetivos de forma rastreável.

---

## Implementado ✅

### Banco de Dados
- [x] Campo `objetivo_id` em `usuarios_quest` (objetivo principal)
- [x] Tabela `quest_objetivos` (relação N:N com tipo de impacto)
- [x] Objetivo padrão "Evolução Pessoal" no catálogo
- [x] Trigger para criar objetivo padrão no cadastro do usuário

### Workflows n8n
- [x] `sw_criar_quest`: Buscar objetivos ativos e vincular às quests
- [x] `sw_criar_quest`: Validação de `area_vida_id` e `objetivo_id` contra IDs válidos
- [x] `sw_xp_quest`: Persistir `objetivo_id` e relações N:N em `quest_objetivos`
- [x] `sw_xp_conversas`: Quest "Reflexão Diária" sempre vinculada ao objetivo padrão

### Regras de Negócio
| Tipo Quest | objetivo_id (principal) | objetivos_secundarios |
|------------|------------------------|----------------------|
| Catálogo (TCC, Estoicismo, Boa Prática) | Padrão | — (vazio) |
| Sabotador | Padrão | Específico relacionado |
| Personalizada com objetivo específico | Específico | Padrão |
| Personalizada sem objetivo específico | Padrão | — (vazio) |
| Reflexão Diária | Padrão | — (vazio) |

### Documentação
- [x] `docs/espec/quests/1.3.8/espec_funcional_executiva.md` atualizada

---

## Pendente ⏳

### Workflows n8n
- [ ] `sw_chat_interations_v2`: Passar objetivos ativos para o agente de conversa
  - Objetivo: agente saber quais objetivos o usuário tem para direcionar a conversa

### Frontend
- [ ] Quest detail: Exibir objetivo(s) vinculado(s) à quest
- [ ] Painel de quests: Filtrar quests por objetivo
- [ ] Dashboard de objetivos: Progresso consolidado por objetivo

---

## Próximos Passos

1. **sw_chat_interations_v2** — Adicionar contexto de objetivos ao agente
   - Buscar objetivos ativos do usuário
   - Passar para o prompt do agente de conversa
   - Permitir que o agente direcione conversas baseado nos objetivos

2. **Frontend v1.3** — Integração visual
   - Mostrar badge/tag de objetivo na card de quest
   - Tela de detalhe da quest com objetivos vinculados
   - Filtro por objetivo no painel de quests

3. **Dashboard de Objetivos** — Nova tela
   - Progresso de cada objetivo (quests vinculadas × concluídas)
   - XP acumulado por objetivo
   - Visualização de impacto direto vs indireto

---

## Validação Realizada

**Usuário de teste:** `d949d81c-9235-41ce-8b3b-6b5d593c5e24`

| Métrica | Valor |
|---------|-------|
| Conversas | 44 |
| Quests | 4 |
| Concluídas | 31 |
| XP Total | 310 |

| Quest | Categoria | Objetivo Principal | Secundários |
|-------|-----------|-------------------|-------------|
| Conexão Social | boa_pratica | Evolução Pessoal ✓ | — |
| Gratidão por Foco | sabotador | Evolução Pessoal ✓ | — |
| Reflexão Diária | essencial | Evolução Pessoal ✓ | — |
| Checklist Semanal | personalizada | Meu próprio negócio ✓ | Evolução Pessoal |

---

## Commits

- `[docs] Atualizar regras de vinculação quest × objetivo`

---

**Última atualização:** 2025-11-30 16:30

