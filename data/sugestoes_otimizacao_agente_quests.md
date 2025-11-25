# Sugestões de Otimização - Agente de Quests

**Data:** 2025-01-22 20:30  
**Objetivo:** Reduzir sobrecarga de dados e melhorar relevância das quests sugeridas

---

## Análise do Catálogo

- **Total:** 117 quests ativas
- **Categorias:** 7 (contramedida_sabotador, tcc, essencial, estoicismo, neurociencia, boa_pratica_geral, personalizada)
- **Recorrências:** diaria, semanal, contextual
- **Quest base:** `quest_custom` (categoria: personalizada)

---

## Problemas Atuais no Prompt

### 1. Dados Excessivos
- Envia 10 conversas completas (resumos longos)
- Envia 10 insights completos
- Envia 10 sabotadores completos
- Envia todos os catálogos (áreas, sabotadores)
- **Impacto:** Token limit (900) gasta com contexto, pouco espaço para resposta

### 2. Não Consulta Catálogo
- Agente cria quests do zero
- Não usa `quest_custom` como base
- Não filtra por estágio da jornada
- **Impacto:** Quests inconsistentes, não aproveita catálogo

### 3. Falta Priorização
- Não diferencia insights prioritários
- Não considera sabotador mais ativo
- Não considera área da vida mais relevante
- **Impacto:** Quests genéricas, pouco personalizadas

---

## Sugestões de Otimização

### 1. Reduzir Dados Enviados

**Conversas:**
- De: 10 conversas completas
- Para: 3 conversas mais recentes (apenas resumo curto, sem detalhes)
- Ou: Última conversa apenas (se houver)

**Insights:**
- De: 10 insights completos
- Para: 3 insights mais prioritários (alta/média) dos últimos 7 dias
- Campos: apenas `id`, `titulo`, `categoria`, `prioridade`

**Sabotadores:**
- De: 10 sabotadores completos
- Para: 1 sabotador mais ativo (maior intensidade, mais recente)
- Campos: apenas `sabotador_id`, `intensidade`, `contramedida_ativa`

**Catálogos:**
- Manter áreas da vida (pequeno, necessário)
- Manter sabotadores catálogo (pequeno, necessário)
- **Adicionar:** Quests do catálogo filtradas por estágio

### 2. Consultar Catálogo por Estágio

**Antes do agente:**
- Buscar `usuarios.estagio_jornada`
- Consultar `quests_catalogo` filtrado por:
  - Categoria relevante ao contexto (ex: contramedida_sabotador se houver sabotador ativo)
  - Priorizar `quest_custom` como base
- Enviar 5-10 quests do catálogo para o agente adaptar

**Estrutura sugerida:**
```json
{
  "quests_catalogo_sugeridas": [
    {
      "id": "uuid",
      "codigo": "quest_custom",
      "titulo": "Quest Personalizada",
      "categoria": "personalizada",
      "instrucoes": {...},
      "dificuldade": 2,
      "nivel_prioridade": 4
    }
  ]
}
```

### 3. Priorizar Contexto Relevante

**Resumo do perfil (novo campo):**
- Sabotador mais ativo (1 apenas)
- Área da vida mais mencionada (1 apenas)
- Insight mais prioritário (1 apenas)
- Estágio da jornada

**Estrutura:**
```json
{
  "perfil_usuario": {
    "estagio_jornada": 1,
    "sabotador_mais_ativo": {
      "id": "hipervigilante",
      "intensidade": 75,
      "contramedida": "..."
    },
    "area_vida_principal": {
      "id": "uuid",
      "codigo": "saude"
    },
    "insight_prioritario": {
      "id": "uuid",
      "titulo": "...",
      "categoria": "emocional"
    }
  }
}
```

### 4. Prompt Otimizado

**Estrutura sugerida:**
```
=== Perfil do Usuário ===
Estágio da Jornada: [1-4]
Sabotador mais ativo: [nome] - [contramedida]
Área da vida principal: [nome]
Insight prioritário: [titulo] - [categoria]

=== Contexto Recente ===
Última conversa: [resumo curto, 2-3 linhas]
Insights relevantes (máx. 3): [id, titulo, prioridade]

=== Catálogo de Quests ===
[5-10 quests do catálogo filtradas por estágio/categoria]

=== Regras ===
1. Use quest_custom como base para criar quests personalizadas
2. Adapte quests do catálogo ao contexto do usuário
3. Vincule sempre a um insight_id fornecido
4. Crie como quest_estagio = 'a_fazer' (usuário define recorrência)
5. Máximo 3-5 quests por sugestão
```

---

## Implementação Sugerida

### Passo 1: Adicionar Consulta ao Catálogo
- Node: "Buscar Quests do Catálogo"
- Query: Filtrar por `estagio_jornada` e categoria relevante
- Limitar: 10 quests mais relevantes

### Passo 2: Criar Resumo do Perfil
- Node: "Montar Perfil Usuário"
- Extrair: sabotador mais ativo, área principal, insight prioritário
- Reduzir: dados para apenas o essencial

### Passo 3: Reduzir Dados de Contexto
- Conversas: 3 mais recentes (resumo curto)
- Insights: 3 mais prioritários
- Sabotadores: 1 mais ativo

### Passo 4: Atualizar Prompt
- Incluir perfil resumido
- Incluir quests do catálogo
- Orientar para usar `quest_custom` como base
- Reduzir regras para o essencial

---

## Benefícios Esperados

1. **Menos tokens:** Redução de ~60% no contexto
2. **Mais relevância:** Quests baseadas em catálogo + contexto
3. **Mais consistência:** Usa `quest_custom` como padrão
4. **Melhor personalização:** Foca no que realmente importa

---

*Sugestões baseadas em análise do catálogo e fluxo atual*




