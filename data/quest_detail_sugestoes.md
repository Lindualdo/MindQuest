# Sugestões para Tela de Detalhes da Quest

## Dados Disponíveis das Quests do Usuário

### 1. Informações da Quest (usuarios_quest.config)
- ✅ **Título**: Ex: "Criar rotina diária de respiração para ansiedade"
- ✅ **Descrição**: Ex: "Praticar respiração profunda por 5 minutos..."
- ✅ **XP Recompensa**: Pontos de experiência ao concluir
- ✅ **Prioridade**: alta, media, baixa
- ✅ **Complexidade**: 1-5 (nível de dificuldade)

### 2. Área de Vida Relacionada (areas_vida_catalogo)
- ✅ **Nome**: Ex: "Saúde"
- ✅ **Descrição**: Ex: "Bem-estar físico, mental e emocional"
- ✅ **Código**: Identificador único

### 3. Insight Relacionado (insights) - MUITO RICO
- ✅ **Título**: Ex: "Ajuste gradual da rotina para equilíbrio..."
- ✅ **Descrição**: Contexto completo
- ✅ **Resumo da Situação**: Situação atual do usuário
- ✅ **Feedback Positivo**: Ganhos e importância de executar
- ✅ **Feedback de Desenvolvimento**: Orientações práticas
- ✅ **Feedback Motivacional**: Frase de motivação
- ✅ **Recursos Sugeridos**: Array com:
  - nome (Ex: "Blocos de tempo")
  - tipo (tecnica, pratica, conceito)
  - descricao
  - aplicacao_pratica (COMO praticar)
- ✅ **Prioridade**: alta, media, baixa
- ✅ **Categoria**: comportamental, emocional, social, cognitivo
- ✅ **Tipo**: padrao, melhoria, positivo, alerta

### 4. Sabotador Relacionado (sabotadores_catalogo) - opcional
- Nome
- Descrição
- Contextos Típicos (array)
- Contramedidas Sugeridas (array)

## Estrutura Sugerida para a Tela (similar a InsightDetailPageV13)

### Header
- Botão voltar
- Badge de área de vida
- Badge de prioridade
- Badge de complexidade

### Seção Principal

#### 1. Cabeçalho da Quest
- Ícone/emoji da área de vida
- Título da quest
- Descrição da quest
- XP recompensa (badge)

#### 2. Por que é importante? (Feedback Positivo)
- Exibir `insight.feedback_positivo`
- Mostrar ganhos de executar a quest
- Ícone: 💡 ou 🎯

#### 3. Como praticar? (Recursos + Feedback Desenvolvimento)
- Seção com `insight.recursos_sugeridos` expandidos
- Cada recurso mostra:
  - Nome
  - Tipo (badge)
  - Descrição
  - **Aplicação Prática** (destaque)
- Complementar com `insight.feedback_desenvolvimento`

#### 4. Contexto Relacionado (opcional)
- Se houver insight relacionado:
  - Mostrar título do insight
  - Mostrar resumo da situação
  - Link para ver detalhes completos do insight

#### 5. Motivação (Feedback Motivacional)
- Exibir `insight.feedback_motivacional`
- Design destacado, tipo quote/citação

#### 6. Área de Vida
- Card mostrando área de vida relacionada
- Nome e descrição

#### 7. Sabotador (se houver)
- Se `sabotador_id` estiver preenchido:
  - Nome e descrição do sabotador
  - Contramedidas sugeridas

### Footer
- Botão para concluir quest (se pendente)
- Botão para ver insight completo (se houver)

## Dados de Exemplo (Quest 1)

**Quest:**
- Título: "Criar rotina diária de respiração para ansiedade"
- Descrição: "Praticar respiração profunda por 5 minutos..."
- Prioridade: alta
- Complexidade: 2

**Área de Vida:**
- Nome: "Saúde"
- Descrição: "Bem-estar físico, mental e emocional"

**Insight:**
- Feedback Positivo: "Sua capacidade de reconhecer os avanços e a satisfação com a jornada até aqui demonstram uma força importante para o desenvolvimento."
- Feedback Desenvolvimento: "É importante trabalhar na organização do tempo para evitar a sobrecarga..."
- Feedback Motivacional: "Com pequenas e graduais mudanças na agenda, você poderá encontrar um ritmo que respeite seus limites..."
- Recursos:
  1. "Blocos de tempo" - técnica - "Divida o dia em blocos focados..."
  2. "Pausa ativa" - pratica - "Momentos curtos de movimentação..."

## Decisões de Design

### O que destacar mais?
1. **Importância** (feedback_positivo) - por que fazer?
2. **Como praticar** (recursos_sugeridos) - passo a passo prático
3. **Motivação** (feedback_motivacional) - frase final de incentivo

### O que opcionalizar?
- Resumo da situação (pode ser link para insight)
- Informações completas do insight (link externo)
- Sabotador (só se houver relação)
