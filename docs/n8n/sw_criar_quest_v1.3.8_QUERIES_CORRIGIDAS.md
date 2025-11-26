# Queries Corrigidas - sw_criar_quest v1.3.8

**Data:** 2025-01-22

Use estas queries diretamente no n8n, copiando e colando no campo "Query" de cada nó.

---

## Nó: "Buscar Quests Ativas" (id: `04e00a0e-d1a6-44c7-9bf9-bc257d44ca27`)

**Remover:** `quest_estagio`, `concluido_em`, `recorrencias`  
**Ajustar:** Status para `'disponivel'`, `'ativa'`, `'inativa'`

```sql
WITH quests AS (
  SELECT
    uq.id,
    uq.status,
    uq.catalogo_id,
    COALESCE(uq.config->>'contexto_origem', '') AS contexto_origem,
    COALESCE(uq.config->>'titulo', '') AS titulo,
    uq.ativado_em,
    uq.config
  FROM public.usuarios_quest uq
  WHERE uq.usuario_id = $1::uuid
    AND uq.status IN ('disponivel', 'ativa')
)
SELECT json_build_object(
  'quests_ativas',
  COALESCE(json_agg(
    json_build_object(
      'id', quests.id,
      'status', quests.status,
      'catalogo_id', quests.catalogo_id,
      'contexto_origem', quests.contexto_origem,
      'titulo', quests.titulo,
      'criado_em', quests.ativado_em,
      'config', quests.config
    )
    ORDER BY quests.ativado_em DESC
  ), '[]'::json)
) AS contexto
FROM quests;
```

---

## Ajuste no Código: "Aplicar Limites & Dedupe" (id: `2aef8150-f7e0-4435-9671-d0cee2eea227`)

**Alterar:** `status_inicial` de `'pendente'` para `'disponivel'`

**Localização:** No código JavaScript, linha onde define `status_inicial`:

**ANTES:**
```javascript
status_inicial: quest.status_inicial || 'pendente',
```

**DEPOIS:**
```javascript
status_inicial: quest.status_inicial || 'disponivel',
```

**Também ajustar na segunda ocorrência (quests adicionais):**
```javascript
status_inicial: quest.status_inicial || 'disponivel',
```

---

## Resumo das Alterações

1. ✅ **"Buscar Quests Ativas":**
   - Removido `quest_estagio`, `concluido_em`, `recorrencias`
   - Ajustado WHERE para `status IN ('disponivel', 'ativa')`
   - Removido filtro por `concluido_em`

2. ✅ **"Aplicar Limites & Dedupe":**
   - Alterado `status_inicial` padrão de `'pendente'` para `'disponivel'`

---

**Última atualização:** 2025-01-22

