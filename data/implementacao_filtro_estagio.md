# Implementação do Filtro de Quests por Estágio do Usuário

**Data:** 2025-01-22  
**Status:** ✅ Implementado

---

## Como Funciona

### 1. Busca do Estágio do Usuário
O node **"Buscar Estágio Usuário"** busca `usuarios.estagio_jornada`:
- **Estágio 1:** Iniciante (níveis 1-3)
- **Estágio 2:** Intermediário (níveis 4-6)  
- **Estágio 3:** Avançado (níveis 7-9)
- **Estágio 4:** Mestre (nível 10)

### 2. Filtro de Quests por Estágio

A query do node **"Buscar Quests Catálogo"** filtra as quests baseado no estágio:

```sql
WITH estagio_user AS (
  SELECT estagio_jornada FROM public.usuarios WHERE id = $1::uuid
)
SELECT ...
FROM public.quests_catalogo qc
CROSS JOIN estagio_user eu
WHERE qc.ativo IS TRUE
  AND (
    -- Quest reflexão diária sempre disponível
    qc.codigo = 'reflexao_diaria'
    OR qc.categoria IN ('tcc', 'estoicismo', 'essencial')
    OR qc.sabotador_id IS NOT NULL
  )
  AND (
    -- Estágio 1: dificuldade 1-2, prioridade >= 2
    (eu.estagio_jornada = 1 AND qc.dificuldade <= 2 AND qc.nivel_prioridade >= 2)
    OR
    -- Estágio 2: dificuldade 2-3
    (eu.estagio_jornada = 2 AND qc.dificuldade >= 2 AND qc.dificuldade <= 3)
    OR
    -- Estágio 3: dificuldade >= 2 (pode ser mais complexa)
    (eu.estagio_jornada = 3 AND qc.dificuldade >= 2)
    OR
    -- Estágio 4: todas as dificuldades
    (eu.estagio_jornada = 4)
    OR
    -- Quest reflexão diária sempre disponível
    (qc.codigo = 'reflexao_diaria')
  )
```

### 3. Mapeamento Estágio → Dificuldade

| Estágio | Nível | Dificuldade Quest | Prioridade | Explicação |
|---------|-------|-------------------|------------|------------|
| 1 | 1-3 | 1-2 | >= 2 | Iniciante: quests simples e de alta prioridade |
| 2 | 4-6 | 2-3 | Qualquer | Intermediário: quests de média complexidade |
| 3 | 7-9 | >= 2 | Qualquer | Avançado: pode receber quests mais complexas |
| 4 | 10 | Todas | Qualquer | Mestre: acesso a todas as quests |

### 4. Campos Utilizados da Tabela `quests_catalogo`

- **`dificuldade`** (1-3): Complexidade da quest
- **`nivel_prioridade`** (1-4): Prioridade da quest
- **`categoria`**: tcc, estoicismo, essencial
- **`sabotador_id`**: ID do sabotador relacionado
- **`codigo`**: Código único (ex: 'reflexao_diaria')

### 5. Ordenação

As quests são ordenadas por:
1. **Reflexão diária primeiro** (prioridade absoluta)
2. **Dificuldade crescente** (mais fáceis primeiro)
3. **Prioridade decrescente** (mais importantes primeiro)

---

## Integração com o Agente

O estágio também é passado para o agente no prompt:

```
Estágio da jornada: {{ $json.estagio_jornada || 1 }} (1=Iniciante, 2=Intermediário, 3=Avançado, 4=Mestre)
```

O agente usa o estágio para:
- Escolher quests adequadas ao nível do usuário
- Adaptar a complexidade das quests
- Sugerir quests mais desafiadoras conforme o estágio aumenta

---

## Exemplo Prático

**Usuário Estágio 1 (Iniciante):**
- Recebe quests de **dificuldade 1-2**
- Prioridade **>= 2** (alta/média prioridade)
- Quest reflexão diária sempre incluída

**Usuário Estágio 4 (Mestre):**
- Recebe **todas as quests** (dificuldade 1-3)
- Pode receber quests mais complexas e desafiadoras

---

**Implementação completa e funcional! ✅**

