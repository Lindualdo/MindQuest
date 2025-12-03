# Release 1.3.15

**Data:** 2025-12-03 14:10

## Resumo

Foco em **visualização e gestão de sabotadores**, incluindo **ranking visual**, **páginas de detalhes**, **ações por sabotadores** e **integração completa** entre frontend e backend.

---

## 🚀 Novas Funcionalidades

### Ranking de Sabotadores

| Funcionalidade | Descrição |
|----------------|-----------|
| **Gráfico de barras vertical** | Visualização dos top 5 sabotadores mais ativos |
| **Métrica score_impacto** | Cálculo: frequência × intensidade média |
| **Card no menu Entender** | Card destacado com ranking e navegação para detalhes |
| **Tooltip informativo** | Exibe detecções, intensidade e score ao passar o mouse |

**Regras de Negócio:**
- Ordenação por `score_impacto` (frequência × intensidade)
- Exibição apenas dos top 5 sabotadores
- Formatação de nomes (remover prefixo "hiper-" quando aplicável)
- Destaque visual para o sabotador mais ativo

### Página de Detalhes do Sabotador

| Funcionalidade | Descrição |
|----------------|-----------|
| **Dois cards separados** | Informações básicas + última ocorrência |
| **Card de última ocorrência** | Data formatada, resumo da conversa e link para histórico |
| **Links de navegação** | Ações relacionadas e Ocorrências |
| **Navegação contextual** | Botão voltar retorna para página de origem |

### Ações por Sabotadores

| Funcionalidade | Descrição |
|----------------|-----------|
| **Página completa** | Visualização de ações relacionadas a cada sabotador |
| **Cards expansíveis** | Expandir/colapsar para ver ações de cada sabotador |
| **Barras de progresso** | Visualização do progresso de cada ação |
| **Ordenação inteligente** | Sabotadores ordenados por número de ações (maior para menor) |
| **Link "Saber mais"** | Navegação direta para página de detalhes do sabotador |

### Páginas de Ações e Ocorrências

| Funcionalidade | Descrição |
|----------------|-----------|
| **Página de Ações** | Lista todas as quests relacionadas ao sabotador |
| **Página de Ocorrências** | Lista todas as ocorrências com insights e contramedidas |
| **Link para resumo** | Navegação para resumo da conversa relacionada |
| **Navegação contextual** | Retorno correto para página de origem |

---

## 🔧 Melhorias

### Interface (UI)

| Melhoria | Descrição |
|----------|-----------|
| **Header simplificado** | Reorganização do header do card de ranking |
| **Texto explicativo** | "Pensamentos geram emoções que movem as ações" |
| **Tooltip otimizado** | Remoção de texto redundante, foco nas métricas |
| **Nomes completos** | Exibição do nome completo dos sabotadores no eixo X |
| **Tamanho de fonte** | Aumento do tamanho dos nomes no gráfico |

### Backend (n8n)

| Melhoria | Descrição |
|----------|-----------|
| **webhook_card_emocoes** | Adicionado node `Sabotadores_Todos` com cálculo de score |
| **Ordenação no webhook** | Sabotadores ordenados por score_impacto |
| **Tipos numéricos** | Conversão explícita de strings para números |
| **Configuração de resposta** | Node Responder configurado corretamente com JSON |

---

## 🐛 Correções

| Correção | Impacto |
|----------|---------|
| **Conversão de tipos** | `intensidade_media.toFixed()` agora funciona corretamente |
| **Navegação de retorno** | Botão voltar funciona corretamente de todas as páginas |
| **Filtro de sabotadores** | Apenas sabotadores com quests são exibidos quando apropriado |
| **Query SQL** | Correção na query para buscar todos os sabotadores únicos |

---

## 📦 Novos Workflows n8n

### webhook_conexao_sabotadores
- **Path:** `/webhook/conexao-sabotadores`
- **Função:** Buscar ações relacionadas aos sabotadores
- **Ordenação:** Por número de ações (maior para menor)
- **Retorno:** Lista de sabotadores com suas quests e progresso

### webhook_acoes_sabotador
- **Path:** `/webhook/acoes/sabotador`
- **Função:** Buscar quests relacionadas a um sabotador específico
- **Filtros:** Status (disponivel, ativa, inativa)
- **Ordenação:** Por status e data de atualização

### webhook_ocorrencias_sabotador
- **Path:** `/webhook/ocorrencias/sabotador`
- **Função:** Buscar ocorrências de um sabotador específico
- **Dados:** Insight, contramedida, intensidade, contexto e resumo da conversa
- **Ordenação:** Por data de ocorrência (mais recente primeiro)

---

## 📝 Arquivos Criados/Modificados

### Frontend
- `src/pages/App/v1.3/ConexaoAcoesSabotadoresPageV13.tsx` (novo)
- `src/pages/App/v1.3/SabotadorAcoesPage.tsx` (novo)
- `src/pages/App/v1.3/SabotadorOcorrenciasPage.tsx` (novo)
- `src/components/app/v1.3/CardSabotadoresRanking.tsx` (modificado)
- `src/pages/App/v1.3/SabotadorDetailPageV13.tsx` (modificado)
- `src/pages/App/v1.3/DashPerfilPage.tsx` (modificado)
- `src/pages/App/v1.3/EvoluirPageV13.tsx` (modificado)
- `src/App.tsx` (modificado)
- `src/types/emotions.ts` (modificado)
- `src/services/apiService.ts` (modificado)

### Backend
- `api/conexao-sabotadores.ts` (novo)
- `backups/n8n/webhook_conexao_sabotadores.json` (novo)
- `backups/n8n/webhook_acoes_sabotador.json` (novo)
- `backups/n8n/webhook_ocorrencias_sabotador.json` (novo)
- `backups/n8n/webhook_card_emocoes.json` (modificado)

---

## 🎯 Próximos Passos

- [ ] Testes de integração completos
- [ ] Validação de performance com grande volume de dados
- [ ] Melhorias de UX baseadas em feedback dos usuários
- [ ] Otimização de queries SQL se necessário

---

## 📊 Estatísticas

- **Commits:** 22
- **Arquivos novos:** 7
- **Arquivos modificados:** 8
- **Workflows n8n criados:** 3
- **Workflows n8n modificados:** 1

---

**Última atualização:** 2025-12-03 14:10

