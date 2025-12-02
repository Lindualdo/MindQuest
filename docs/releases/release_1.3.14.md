# Release 1.3.14

**Data:** 2025-12-02 23:30

## Resumo

Foco em **quests sabotadores contextuais**, **melhorias de UX** (notificações, links de navegação, pontuação), **workflow mentor_mindquest** e **correções de cálculos e navegação**.

---

## 🚀 Novas Funcionalidades

### Quests Sabotadores Contextuais

| Funcionalidade | Descrição |
|----------------|-----------|
| **Criação automática de quests sabotadores** | Quests de sabotadores são criadas automaticamente quando um sabotador é identificado no contexto do usuário |
| **Quest contextual** | Quest vinculada ao sabotador mais ativo, com instruções e estratégias específicas |
| **Integração com sw_criar_quest** | Sistema detecta sabotador ativo e sugere quest do catálogo correspondente |

**Regras de Negócio:**
- Quest de sabotador vinculada ao objetivo padrão + objetivo específico relacionado
- Quest sugerida apenas quando há sabotador ativo detectado
- Baseada no catálogo `quests_catalogo` com `sabotador_id` não nulo

### Interface (UI)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Página de Notificações** | Nova página no menu "Evoluir" para notificações futuras |
| **Link "Fale com seu mentor"** | Link direto na home para iniciar conversa com mentor |
| **Pontuação (pts) nas conversas** | Badge com pontuação XP nas páginas de conversas |
| **Cards de progresso na home** | Cards informativos sobre progresso do usuário |
| **Link no card Ações** | Link direto do card Ações para página de objetivos |
| **Temas CSS na página de login** | Aplicação de variáveis CSS de tema (claro/escuro) |

### Mentor MindQuest

| Funcionalidade | Descrição |
|----------------|-----------|
| **Workflow mentor_mindquest** | Novo workflow completo para mentoria conversacional |
| **Contexto completo do usuário** | Busca objetivos, sabotador ativo, quests e histórico |
| **Framework CONVERSAR→ENTENDER→AGIR→EVOLUIR** | Integrado no prompt do mentor |
| **Gestão de memória Redis** | Histórico de conversas mantido entre sessões |

---

## 🐛 Correções

| Correção | Impacto |
|----------|---------|
| **Cálculos na página Ações por Objetivo** | Correção de fórmulas de progresso e totais |
| **Pontos de conversas no painel de quests** | XP de conversas excluído do total de quests (evita duplicação) |
| **Navegação botão Voltar** | Corrigido redirecionamento na página "Níveis da Jornada" |
| **Erros TypeScript** | Removidos warnings e erros de tipo |
| **Refresh do header** | Corrigido comportamento do botão refresh |
| **Círculos dos ícones do header** | Removidos círculos desnecessários dos ícones |

---

## 🔧 n8n / Backend

### sw_criar_quest - Quests Sabotadores

**Implementação:**
- Detecção automática de sabotador ativo do usuário
- Busca de quests do catálogo com `sabotador_id` correspondente
- Criação de quest contextual vinculada ao sabotador
- Vinculação: objetivo padrão + objetivo específico relacionado

**Regras:**
- Quest criada apenas se houver sabotador ativo
- Baseada em catálogo de sabotadores e estratégias antídoto
- Instruções personalizadas para o sabotador detectado

### mentor_mindquest - Workflow Completo

**Estrutura:**
- Busca contexto completo (objetivos, sabotador, quests, histórico)
- Memória Redis para continuidade conversacional
- Controle de interações (min/max)
- Detecção de encerramento natural
- Integração com framework MindQuest

**Features:**
- Sistema de memória persistente
- Controle de limites de interação
- Verificação de esgotamento da conversa
- Gravação automática em `usr_chat`
- Disparo paralelo de experts após conversa

### Backups n8n

**Otimizações:**
- Remoção de campos voláteis (`versionId`, `versionCounter`, `triggerCount`)
- Limpeza de backups antigos
- Estrutura simplificada para versionamento

---

## 📋 Commits (22)

```
01b1b3b [docs] Atualizar status implementação quests sabotadores para 'Implementado'
f4351ea [n8n] Implementar quests sabotadores contextuais no sw_criar_quest
a2460c5 docs: regras de sabotadores
dbd4963 [fix] Corrigir cálculos na página Ações por Objetivo
75fc418 [ui] Adicionar link 'Fale com seu mentor' na home
d4a0351 [ui] Atualizar subtítulo da home
6cfe9da [fix] Excluir pontos de conversas do total no painel de quests
3fdc27b [fix] Corrigir erros de tipo e warnings no TypeScript
524f332 [n8n] Atualizar backups removendo campos voláteis (versionId, versionCounter, triggerCount)
27bdb3e [docs] Atualizar status do mentor mindquest
3108e96 [fix] Corrigir navegação do botão Voltar na página Níveis da Jornada
4974ac3 [feat] Adicionar link no card Ações para página de objetivos
9f71be5 [feat] Criar página de Notificações e renomear menu
35168b0 [refactor] Mover campo 'fale mais sobre você' para Interações com IA
830e236 [ui] Aplicar temas CSS na página de login
0c7f583 [ui] Remover círculos dos ícones do header e corrigir refresh
950e98c [feat] Atualizar frase do botão Conversar e adicionar cards de progresso
28279d0 [feat] Adicionar pontuação (pts) nas páginas de conversas
2923267 n8n - limpesa de bkps antigos
e1e53ec [docs] Atualizar especificações do framework MindQuest e mentor
52f7773 [n8n] Adicionar workflow mentor_mindquest e remover campos de versão dos backups
7f758ba [docs] Criar release notes 1.3.13
```

---

## 📊 Estatísticas

- **Total de commits:** 22
- **Categorias:**
  - UI: 6
  - n8n: 4
  - Fix: 4
  - Feat: 5
  - Docs: 3
- **Arquivos alterados:** ~60+

---

## 📝 Documentação

### Documentos Criados/Atualizados

- `docs/n8n/mentor_mindquest_completo.md` - Estrutura completa do workflow mentor
- `docs/n8n/mentor_mindquest_status_final.md` - Status de implementação
- Regras de sabotadores documentadas
- Especificações do framework MindQuest atualizadas

---

## ✅ Checklist de Release

- [ ] Testar criação automática de quests sabotadores
- [ ] Validar workflow mentor_mindquest em produção
- [ ] Verificar cálculos na página Ações por Objetivo
- [ ] Testar navegação entre páginas (links novos)
- [ ] Validar pontuação XP nas conversas
- [ ] Confirmar temas CSS no login
- [ ] Deploy Vercel
- [ ] Criar tag `1.3.14`

---

## 🏷️ Criar Tag

```bash
git tag -a 1.3.14 -m "Release 1.3.14 - Quests sabotadores contextuais + mentor_mindquest + melhorias UX"
git push origin 1.3.14
```

---

## 🔄 Próximos Passos

1. **Testes em produção** - Validar quests sabotadores com usuários reais
2. **Melhorias no mentor** - Refinar prompts e lógica de encerramento
3. **Notificações** - Implementar sistema completo de notificações
4. **Dashboard de objetivos** - Exibir progresso consolidado por objetivo

---

**Última atualização:** 2025-12-02 23:30

