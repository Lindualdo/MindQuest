# Release 1.3.16

**Data:** 2025-12-03 16:05
**Última atualização:** 2025-12-03 16:05

## Resumo

Foco em **padronização do card de perfil Big Five** com gráfico de colunas, **correção de lógica de conclusão de quests recorrentes** e **melhorias na experiência de visualização de padrões comportamentais**.

---

## 🚀 Novas Funcionalidades

### Card de Perfil Big Five Padronizado

| Funcionalidade | Descrição |
|----------------|-----------|
| **Gráfico de colunas** | Visualização dos top 3 traços de personalidade com percentuais |
| **Navegação para detalhes** | Ao tocar/clicar nas barras, navega para página de detalhe do traço |
| **Integração com catálogo** | Dados carregados do `bigFiveCatalogo.ts` |
| **Top 3 traços** | Exibição apenas dos 3 traços mais relevantes (maior score) |

**Regras de Negócio:**
- Ordenação por score (maior para menor)
- Exibição apenas dos top 3 traços
- Nomes padronizados: Disciplina, Curiosidade, Instabilidade, Gentileza, Sociabilidade
- Escala de 0-100% para percentuais

### Página de Detalhes do Perfil Big Five

| Funcionalidade | Descrição |
|----------------|-----------|
| **Página completa** | Visualização detalhada de cada traço de personalidade |
| **Seções organizadas** | Características, Pontos Fortes, Áreas de Melhoria, Preferências de Trabalho, Relacionamentos, Estratégias de Desenvolvimento |
| **Navegação contextual** | Botão voltar retorna para página de origem |
| **Nomes padronizados** | Mesmos nomes usados no gráfico |

---

## 🔧 Melhorias

### Interface (UI)

| Melhoria | Descrição |
|----------|-----------|
| **Remoção de ícones** | Títulos sem ícones para visualização mais limpa |
| **Título padronizado** | "Padrões de comportamento" em vez de "Perfil pessoal" |
| **Nomes simplificados** | Traços com nomes mais diretos e acessíveis |
| **Posicionamento** | Card posicionado logo após o card de sabotadores |

### Lógica de Quests Recorrentes

| Melhoria | Descrição |
|----------|-----------|
| **Verificação robusta** | Aceita `recorrencias` como array direto ou `recorrencias.dias` |
| **Suporte a múltiplos formatos** | Aceita `data` ou `data_planejada` como campo de data |
| **Normalização de status** | Verificação case-insensitive para status concluída/perdida |

---

## 🐛 Correções

| Correção | Impacto |
|----------|---------|
| **Botão concluir quest** | Ocultado corretamente quando recorrência do dia está concluída |
| **Verificação de recorrências** | Lógica corrigida para encontrar recorrência do dia selecionado |
| **Navegação para detalhes** | Página de detalhe do perfil Big Five agora abre corretamente |
| **Imports duplicados** | Removidos imports duplicados de `useState` e `useEffect` |
| **Tipos TypeScript** | Adicionados tipos faltantes para `perfilBigFiveDetail` no `ViewId` e `StoreState` |

---

## 📝 Arquivos Criados/Modificados

### Frontend
- `src/components/app/v1.3/CardPerfilBigFiveRanking.tsx` (novo)
- `src/pages/App/v1.3/PerfilBigFiveDetailPageV13.tsx` (novo)
- `src/pages/App/v1.3/QuestDetailPageV13.tsx` (modificado)
- `src/pages/App/v1.3/DashPerfilPage.tsx` (modificado)
- `src/App.tsx` (modificado)
- `src/store/useStore.ts` (modificado)
- `src/types/emotions.ts` (modificado)

---

## 🎯 Mapeamento de Nomes dos Traços

| Nome Original | Nome Padronizado |
|---------------|------------------|
| Conscienciosidade | Disciplina |
| Abertura à Experiência | Curiosidade |
| Neuroticismo | Instabilidade |
| Amabilidade | Gentileza |
| Extroversão | Sociabilidade |

---

## 📊 Estatísticas

- **Commits:** 22
- **Arquivos novos:** 2
- **Arquivos modificados:** 5
- **Funcionalidades principais:** 2 (Card padronizado + Página de detalhes)
- **Correções:** 5

---

**Última atualização:** 2025-12-03 16:05

