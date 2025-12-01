# Release 1.3.13

**Data:** 2025-12-01 16:25

## Resumo

Foco em **UX do framework ENTENDER→AGIR→EVOLUIR** e **correção crítica na vinculação de objetivos** nas quests personalizadas.

---

## 🚀 Novas Funcionalidades

### Interface (UI)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Menus reestruturados** | Alinhamento ao framework: Conversar → Entender → Agir → Evoluir |
| **Página Conversar** | Nova página com conversas da semana, botão WhatsApp e insights |
| **Banner conquistas** | Exibe total de ações concluídas e XP ganho na semana (página Agir) |
| **Barra de progresso semanal** | Visualização do progresso na página Agir |
| **Pontuação (XP) nos cards** | Badge amarelo com estrela em todos os estágios de quest |
| **Menu mobile melhorado** | Ícones 24px, altura 56px (Material Design), safe area iPhone |
| **Destaque visual ativo** | Pill azul no item ativo do menu com escala 105% |

### Simplificações

| Item | Motivo |
|------|--------|
| Ocultar botão "Criar Quest" nos insights | sw_criar_quest já cria automaticamente |
| Ocultar recursos sugeridos nos insights | Separar ENTENDER de AGIR |
| Ocultar badges categoria/prioridade | Informação excessiva sem relevância imediata |

---

## 🐛 Correções

| Correção | Impacto |
|----------|---------|
| **Vinculação de objetivos em quests** | Quests personalizadas agora vinculam corretamente a objetivos específicos (Trabalho, Finanças, etc.) |
| **Mover cors.ts para fora de api/** | Limite Vercel Hobby (12 serverless functions) |
| **Label menu Evoluir** | Corrigir texto "Objetivo" |
| **Início da semana** | Segunda-feira (padrão BR) |

---

## 🔧 n8n / Backend

### sw_criar_quest - Correção Crítica

**Problema:** Quests personalizadas eram vinculadas apenas ao objetivo padrão ("Evolução Pessoal"), ignorando objetivos específicos do usuário.

**Solução:**
- Algoritmo de matching obrigatório no prompt do Agente Quests
- Mapeamento de palavras-chave → área de vida:
  - "app", "negócio", "projeto" → Trabalho
  - "dinheiro", "BTC", "renda" → Finanças
  - etc.
- Exemplo concreto com IDs para guiar o LLM
- Verificação final obrigatória antes de definir `objetivo_id`
- Uso de `objetivos_secundarios` para quests multi-objetivo

**Resultado:** Quests personalizadas agora refletem corretamente os objetivos específicos do usuário.

---

## 📋 Commits (15)

```
fd19bfd [n8n] Corrigir vinculação de objetivos específicos em quests personalizadas
4b77fec update n8n
bc6414d [fix] Mover cors.ts para fora de api/ (limite Vercel Hobby)
edb22c0 n8n - update workflows
f7a353d [ui] Ocultar badges de categoria e prioridade nos insights
f9293ba [ui] Ocultar seção de recursos sugeridos nos insights
9304426 [ui] Ocultar botão 'Criar Quest' nos insights
b52ebbe [ui] Adicionar banner de conquistas da semana na página Agir
26969c5 [ui] Adicionar pontuação (XP) nos cards de quest
26dcea0 [ui] Adicionar destaque visual (pill) no item ativo do menu
2775e80 [ui] Aumentar tamanho do menu para melhor usabilidade mobile
e4c1850 fix - label do menu Evoluir - Objetivo
7b665d0 [ui] Adicionar barra de progresso semanal na página Agir
6a6d5a6 [ui] Ajustar início da semana para segunda-feira (padrão BR)
9614841 [ui] Reestruturar menus alinhados ao framework ENTENDER→AGIR→EVOLUIR
```

---

## 📊 Estatísticas

- **Total de commits:** 15
- **Categorias:**
  - UI: 10
  - n8n: 3
  - Fix: 2
- **Arquivos alterados:** ~50+

---

## ✅ Checklist de Release

- [ ] Testar vinculação de objetivos em nova conversa
- [ ] Validar menus em dispositivo móvel
- [ ] Verificar banner de conquistas com/sem ações
- [ ] Confirmar barra de progresso semanal
- [ ] Deploy Vercel
- [ ] Criar tag `1.3.13`

---

## 🏷️ Criar Tag

```bash
git tag -a 1.3.13 -m "Release 1.3.13 - UX framework ENTENDER→AGIR→EVOLUIR + correção objetivos"
git push origin 1.3.13
```

