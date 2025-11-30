# Análise: sw_criar_quest (versão atual)

**Data:** 2025-11-30 11:30
**Status:** Documentação para análise

---

## Resumo

Workflow que gera **3 quests** para o usuário a partir de conversas, insights e sabotadores identificados. Chamado pelo job batch ou após conversa.


## O que ENTRA e SAI de cada etapa

### 1. Entrada
| Entra | Sai |
|-------|-----|
| `usuario_id` (obrigatório) | `usuario_id` validado |
| `chat_id` (opcional) | `chat_id` ou null |

### 2. Busca Quests Já Criadas
| Entra | Sai |
|-------|-----|
| `usuario_id` | Lista de quests com status "disponível" ou "ativa" |
| | Títulos já usados (para evitar duplicatas) |
| | IDs de catálogo já usados |

### 3. Busca Conversas Recentes
| Entra | Sai |
|-------|-----|
| `usuario_id` | Últimas 10 conversas: |
| | - data da conversa |
| | - resumo |
| | - se teve reflexão |
| | - total de palavras |

**⚠️ Ponto crítico:** Se não houver conversas, o fluxo PARA aqui.

### 4. Busca Insights Recentes
| Entra | Sai |
|-------|-----|
| `usuario_id` | Últimos 10 insights: |
| | - id, título |
| | - categoria, tipo |
| | - prioridade |
| | - resumo |

### 5. Busca Sabotador Mais Ativo
| Entra | Sai |
|-------|-----|
| `usuario_id` | **APENAS** o `sabotador_id` |

**⚠️ Ponto crítico:** Não traz contexto, apelido, insight ou contramedida do sabotador.

### 6. Lista Áreas da Vida
| Entra | Sai |
|-------|-----|
| (nenhum) | Catálogo completo: id, código, nome, descrição |

### 7. Busca Estágio do Usuário
| Entra | Sai |
|-------|-----|
| `usuario_id` | `estagio_jornada` (1, 2, 3 ou 4) |

### 8. Busca Quests do Catálogo
| Entra | Sai |
|-------|-----|
| `usuario_id` | Quests filtradas por estágio: |
| `estagio_jornada` | - Exclui "reflexao_diaria" e "personalizada" |
| | - Filtra por dificuldade apropriada ao estágio |
| | - Inclui quests de sabotador e TCC/Estoicismo |

### 9. Monta Contexto (Consolidação)
| Entra | Sai |
|-------|-----|
| Todas as buscas anteriores | Objeto unificado com: |
| | - quests ativas |
| | - quests já criadas |
| | - conversas recentes |
| | - insights recentes |
| | - sabotadores recentes |
| | - áreas da vida |
| | - catálogo filtrado |

### 10. Escolhe Quests do Catálogo
| Entra | Sai |
|-------|-----|
| Contexto completo | Quests pré-selecionadas: |
| | - 1 quest de sabotador (se houver sabotador ativo) |
| | - 1 quest TCC/Estoicismo/Outras |
| | - Apenas resumo para a IA |

### 11. Agente de IA
| Entra | Sai |
|-------|-----|
| - 3 últimas conversas (data + resumo) | **3 quests:** |
| - Insights disponíveis (id + título) | 1. Personalizada (criada do zero) |
| - Áreas disponíveis (id + nome) | 2. Sabotador (adaptada do catálogo) |
| - Sabotador mais ativo | 3. TCC/Estoicismo (adaptada do catálogo) |
| - Quests do catálogo escolhidas | |

**⚠️ Ponto crítico:** A IA recebe APENAS:
- Resumo das conversas (sem detalhes)
- Lista de insights (sem conteúdo completo)
- ID do sabotador (sem contexto)
- **NÃO recebe objetivos do usuário**

### 12. Remove Duplicatas e Limita
| Entra | Sai |
|-------|-----|
| Quests geradas pela IA | Até 3 quests válidas: |
| Quests já existentes | - Sem títulos duplicados |
| | - Sem catálogo_id repetido |
| | - Na ordem: personalizada, sabotador, TCC |

### 13. Registra e Calcula XP
| Entra | Sai |
|-------|-----|
| Quests validadas | Quests gravadas em `usuarios_quest` |
| `usuario_id` | XP calculado e atribuído |

---

## Regras de Negócio Atuais

### Tipos de Quest Geradas
| Tipo | Origem | Quem cria |
|------|--------|-----------|
| **Personalizada** | Conversas + Insights | IA cria do zero |
| **Sabotador** | Catálogo + Sabotador ativo | IA adapta título/descrição |
| **TCC/Estoicismo** | Catálogo | IA adapta título/descrição |

### Critérios de Seleção do Catálogo
- **Estágio 1:** dificuldade ≤ 2, prioridade ≥ 2
- **Estágio 2:** dificuldade 2-3
- **Estágio 3:** dificuldade ≥ 2
- **Estágio 4:** todas disponíveis

### Validações de Duplicata
- Títulos muito similares (80%+ palavras em comum)
- Mesmo `catalogo_id` já usado recentemente
- Mesma combinação `contexto_origem + titulo`

---

## ❌ O QUE NÃO É CONSIDERADO (Gaps)

| Item | Impacto |
|------|---------|
| **Objetivos do usuário** | Quests não direcionam para metas configuradas |
| **Detalhamento dos objetivos** | Sem personalização por prazo/área |
| **Contexto completo do sabotador** | IA recebe só ID, não sabe apelido/insight/contramedida |
| **Histórico de emoções** | Quests não consideram padrões emocionais |
| **Progresso nos objetivos** | Não prioriza áreas com menor avanço |
| **Prazo dos objetivos** | Não cria urgência para objetivos próximos do vencimento |

---

## Pontos Críticos para Melhoria

### 1. Falta de Contexto de Objetivos
A IA não sabe quais são os objetivos do usuário. As quests geradas são genéricas, não direcionadas.

**Exemplo atual:**
- Objetivo: "Ganhar 2k/mês com BTC"
- Quest gerada: "Organização diária para reduzir sobrecarga" (não relacionada)

### 2. Sabotador Subutilizado
A consulta retorna apenas o `sabotador_id`. A IA não tem:
- Apelido personalizado
- Contexto principal (financeiro, profissional, pessoal)
- Insight identificado
- Contramedida sugerida

### 3. Quest Personalizada Mal Direcionada
O prompt instrui:
> "NÃO incluir: Questões mentais, comportamentais ou emocionais"

Mas não instrui:
> "CONSIDERAR objetivos ativos e priorizar ações que avancem esses objetivos"

### 4. Conversas Sem Profundidade
A IA recebe apenas `data + resumo` das conversas. Perde:
- Temas recorrentes
- Preocupações específicas
- Menções a projetos/metas

---

## Próximos Passos (Sugestões)

1. **Adicionar busca de objetivos ativos** antes de montar contexto
2. **Enriquecer consulta de sabotador** com contexto completo
3. **Atualizar prompt da IA** para considerar objetivos
4. **Adicionar campo `objetivo_id`** na tabela `usuarios_quest` (se ainda não existe)
5. **Criar lógica de priorização** por prazo de objetivo

---

## Referências
- Workflow ID: `LKjU8NE9aNHw7kEh`
- Sub-workflow chamado: `sw_xp_quest` (ID: `bTeLj5qOKQo9PDMO`)

