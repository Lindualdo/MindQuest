# Plano de Correção - sw_criar_quest

**Data:** 2025-01-22 20:45  
**Workflow:** sw_criar_quest (LKjU8NE9aNHw7kEh)

---

## Regras do Sistema

1. **Quests e conversas unificadas** - tudo são quests
2. **Sem slots** - banco de quests (sempre cria novas, não duplica)
3. **Quest `reflexao_diaria` única** - sempre existe uma para referência
4. **Recorrências** - ficam em `conquistas_historico.detalhes`
5. **Novas quests** - criadas como `a_fazer` (usuário define recorrência)
6. **Catálogo** - consulta `quests_catalogo` e adapta para usuário
7. **Múltiplas instâncias** - mesmo `catalogo_id` pode ter várias instâncias (IA adapta)

---

## Quests Obrigatórias por Execução

**Sempre criar 5 tipos de quests:**

1. **Quest Custom**
   - Base: `quest_custom` do catálogo
   - Contexto: mais recente + insights
   - Foco: específica do dia a dia do usuário
   - **NÃO relacionada** com comportamento ou mente

2. **Quest Sabotador Ativo**
   - Buscar no catálogo: `categoria = 'contramedida_sabotador'`
   - Filtrar por sabotador mais ativo do usuário
   - Adaptar ao contexto

3. **Quest Reflexão Diária**
   - Base: `reflexao_diaria` do catálogo
   - Criar apenas se não existir
   - `quest_estagio = 'fazendo'` (não precisa aprovação)

4. **Quest TCC**
   - Buscar no catálogo: `categoria = 'tcc'`
   - Priorizar não usadas
   - Adaptar ao contexto

5. **Quest Estoicismo**
   - Buscar no catálogo: `categoria = 'estoicismo'`
   - Priorizar não usadas
   - Adaptar ao contexto

---

## Fluxo Esperado

1. Buscar contexto do usuário (reduzido)
2. Buscar `estagio_jornada` do usuário
3. Consultar `quests_catalogo` por categoria
4. Filtrar quests já usadas (verificar `usuarios_quest.catalogo_id`)
5. Agente adapta 5 quests do catálogo ao contexto
6. Criar todas como `quest_estagio = 'a_fazer'` (exceto `reflexao_diaria`)

---

## Problemas Encontrados

### 1. Lógica de Slots (Remover)
- **Node:** `Montar Contexto`, `Tem Slots?`, `Sem Slots`
- **Problema:** Sistema ainda usa slots
- **Correção:** Remover validação de slots

### 2. Não Cria 5 Quests Obrigatórias
- **Node:** `Agente Quests`
- **Problema:** Agente cria quests aleatórias, não segue regra de 5 tipos
- **Correção:** Prompt deve orientar criar exatamente 5 tipos

### 3. Não Consulta Catálogo por Categoria
- **Node:** Falta node para buscar catálogo
- **Problema:** Não busca quests por categoria (TCC, Estoicismo, etc)
- **Correção:** Adicionar consulta ao catálogo antes do agente

### 4. Não Filtra Quests Já Usadas
- **Node:** Falta validação
- **Problema:** Pode sugerir quests já criadas
- **Correção:** Verificar `usuarios_quest.catalogo_id` antes de sugerir

### 5. Quest Custom Não Segue Regra
- **Node:** `Agente Quests`
- **Problema:** Quest custom pode ser sobre comportamento/mente
- **Correção:** Prompt deve especificar "dia a dia, não comportamento/mente"

---

## Plano de Correção

### Passo 1: Remover Lógica de Slots
- Remover node `Tem Slots?`
- Remover node `Sem Slots`
- Remover cálculo de `slots_disponiveis`
- Sempre executar agente

### Passo 2: Buscar Estágio da Jornada
- Adicionar node: "Buscar Estágio Jornada"
- Query: `SELECT estagio_jornada FROM usuarios WHERE id = $1`

### Passo 3: Consultar Catálogo por Categoria
- Adicionar node: "Buscar Quests do Catálogo"
- Queries separadas:
  - `quest_custom` (categoria: personalizada)
  - `contramedida_sabotador` (filtrar por sabotador ativo)
  - `reflexao_diaria` (categoria: essencial)
  - `tcc` (categoria: tcc)
  - `estoicismo` (categoria: estoicismo)
- Filtrar: excluir `catalogo_id` já usados em `usuarios_quest`

### Passo 4: Reduzir Contexto
- Conversas: 1 mais recente (usar apenas campo `resumo_conversa`)
- Insights: 3 mais prioritários (apenas `id`, `titulo`, `categoria`, `prioridade`)
- Sabotadores: 1 mais ativo apenas (apenas `sabotador_id`, `intensidade`, `contramedida_ativa`)

### Passo 5: Atualizar Prompt do Agente
- Orientar criar exatamente 5 quests (1 de cada tipo)
- Especificar regra da quest custom (dia a dia, não comportamento/mente)
- Usar quests do catálogo como base
- Adaptar ao contexto do usuário
- Criar como `quest_estagio = 'a_fazer'`

### Passo 6: Criar `reflexao_diaria` Separadamente
- Se não existir, criar antes do agente
- `quest_estagio = 'fazendo'`
- `catalogo_id` da quest `reflexao_diaria`

---

## Estrutura de Dados Esperada

**Input para agente:**
```json
{
  "usuario_id": "uuid",
  "estagio_jornada": 1,
  "perfil": {
    "sabotador_mais_ativo": {...},
    "insight_prioritario": {...}
  },
  "contexto": {
    "ultima_conversa_resumo": "...",
    "insights_recentes": [...]
  },
  "quests_catalogo": {
    "quest_custom": {...},
    "contramedida_sabotador": [...],
    "tcc": [...],
    "estoicismo": [...]
  },
  "quests_ja_usadas": ["catalogo_id1", "catalogo_id2"]
}
```

**Output do agente:**
```json
{
  "novas_quests": [
    {
      "catalogo_id": "uuid",
      "tipo": "custom",
      "titulo": "...",
      "descricao": "...",
      "insight_id": "uuid"
    },
    {
      "catalogo_id": "uuid",
      "tipo": "sabotador",
      "titulo": "...",
      "sabotador_id": "..."
    },
    {
      "catalogo_id": "uuid",
      "tipo": "tcc",
      "titulo": "..."
    },
    {
      "catalogo_id": "uuid",
      "tipo": "estoicismo",
      "titulo": "..."
    }
  ]
}
```

---

*Plano atualizado com regras específicas de criação*
