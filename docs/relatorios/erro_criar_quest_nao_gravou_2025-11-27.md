# Relatório de Erro - Quest Não Foi Gravada

**Data:** 2025-11-27 16:44  
**Versão:** 1.3.8  
**Foco:** Quest não foi gravada após tentativa de criação

---

## Problema Identificado

**Sintoma:** Tentativa de criar quest retornou `success: false` e a quest não foi gravada no banco.

**Evidências dos Logs (Execução 133536):**
- ✅ **Dados recebidos corretamente:**
  - `titulo`: "Validações Incrementais"
  - `descricao`: "Método para criar testes..."
  - `instrucoes`: "Organize sessões rápidas..."
  - `insight_id`: "e47edca9-88cb-4b71-8859-1fde6d08bf3b"
  - `resource_index`: 0
- ❌ **Resultado:** `success: false`, `total_existente: 2`

**Verificação no Banco:**
- Existem **2 quests** com `insight_id = 'e47edca9-88cb-4b71-8859-1fde6d08bf3b'`:
  1. `e087b13f-9375-41ae-9b2c-5403279e1065` (ativa) - contexto_origem: "conversa_2025-11-26"
  2. `82cd1c96-28b9-478b-98fb-6cbb97066261` (ativa) - contexto_origem: "sabotador_ativo"

---

## Causa Raiz

**Limite de 2 quests por insight já atingido:**
- A query SQL está verificando corretamente o limite (`total_existente < 2`)
- Como já existem 2 quests, a inserção não acontece
- O Response node retorna `success: false` mas não está retornando o campo `error` corretamente

**Problema Adicional:**
- As 2 quests existentes **não foram criadas pelo webhook manual** (têm `contexto_origem` diferente de `insight_manual`)
- Elas foram criadas por outros processos (conversa e sabotador)
- O limite está contando **todas** as quests do insight, não apenas as criadas manualmente

---

## Análise da Query SQL

A query atual verifica:
```sql
WHERE usuario_id = entrada.usuario_id
  AND insight_id = entrada.insight_id
  AND status IN ('disponivel', 'ativa', 'inativa')
```

Isso conta **todas** as quests do insight, independente de como foram criadas.

**Decisão necessária:**
- Opção A: Contar apenas quests com `contexto_origem = 'insight_manual'`
- Opção B: Contar todas as quests do insight (comportamento atual)

---

## Correções Necessárias

### 1. Ajustar verificação de limite (se necessário)

Se quisermos contar apenas quests criadas manualmente:
```sql
WHERE usuario_id = entrada.usuario_id
  AND insight_id = entrada.insight_id
  AND status IN ('disponivel', 'ativa', 'inativa')
  AND (config->>'contexto_origem') = 'insight_manual'
```

### 2. Corrigir Response node

O Response node precisa retornar o campo `error` corretamente quando o limite é atingido.

### 3. Apagar quests antigas (se necessário)

Se as quests existentes não devem contar para o limite, apagá-las ou ajustar a lógica.

---

## Próximos Passos

1. **Decisão:** Contar todas as quests ou apenas as criadas manualmente?
2. **Ajustar query** conforme decisão
3. **Corrigir Response node** para retornar erro corretamente
4. **Testar** criação de quest após correções

