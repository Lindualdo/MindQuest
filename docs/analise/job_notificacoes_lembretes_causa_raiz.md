# Análise de Causa Raiz - job_notificacoes_lembretes

**Data:** 2025-12-06 (Atualizada)  
**Workflow ID:** `i5VG5rHZ39ytueyu`  
**Problema:** Job não executa nos horários definidos

## Status Atual do Workflow

✅ **Workflow ativo:** `"active": true`  
✅ **Schedule Trigger conectado:** Conexão correta para "Query Contexto Completo"  
✅ **Node habilitado:** Não há campo `disabled`  
❌ **Cron Expression incorreta:** Formato inválido

## Problema Identificado

### Cron Expression com `=` no Início ⚠️ CAUSA RAIZ

- **Expressão atual:** `"=0 7,8,10,11,13,14,16,17,19,21 * * *"`
- **Problema:** O `=` no início faz o n8n tentar avaliar como expressão n8n (com `{{ }}`)
- **Impacto:** Como não há variáveis para substituir, a expressão falha silenciosamente
- **Resultado:** Schedule trigger não dispara automaticamente

### Evidências

1. **Todas as execuções são manuais:**
   - Últimas 10 execuções: todas com `"mode": "manual"`
   - Nenhuma execução automática pelo schedule trigger

2. **Formato correto:**
   - Deve ser: `"0 7,8,10,11,13,14,16,17,19,21 * * *"` (sem `=`)
   - O `=` é usado apenas em expressões n8n com variáveis: `"={{ $json.field }}"`

## Formato Correto da Cron Expression

### n8n Schedule Trigger
- **Formato:** 6 campos separados por espaço
- **Campos:** `segundo minuto hora dia-mês mês dia-semana`
- **Exemplo:** `"0 7,8,10,11,13,14,16,17,19,21 * * *"`
  - Segundo: `0` (no início do minuto)
  - Minuto: `0` (no início da hora)
  - Hora: `7,8,10,11,13,14,16,17,19,21` (horários configurados)
  - Dia do mês: `*` (todos os dias)
  - Mês: `*` (todos os meses)
  - Dia da semana: `*` (todos os dias)

### Horários Configurados
- 07:00, 08:00, 10:00, 11:00, 13:00, 14:00, 16:00, 17:00, 19:00, 21:00

## Causa Raiz

**Cron expression com `=` no início fazendo o n8n tentar avaliar como expressão e falhando silenciosamente.**

O n8n interpreta strings que começam com `=` como expressões a serem avaliadas. Como a cron expression não contém variáveis n8n (`{{ }}`), a avaliação falha e o schedule não é registrado corretamente.

## Correção Necessária

### Remover `=` da Cron Expression

```json
{
  "type": "updateNode",
  "nodeId": "schedule",
  "updates": {
    "parameters": {
      "rule": {
        "interval": [
          {
            "field": "cronExpression",
            "expression": "0 7,8,10,11,13,14,16,17,19,21 * * *"
          }
        ]
      }
    }
  }
}
```

**Mudança:** `"=0 7,8,10,11,13,14,16,17,19,21 * * *"` → `"0 7,8,10,11,13,14,16,17,19,21 * * *"`

## Próximos Passos

1. ✅ Análise completa (este documento)
2. ⏳ Aguardar aprovação para correção
3. ⏳ Remover `=` da cron expression via MCP
4. ⏳ Validar execução automática nos horários configurados
5. ⏳ Monitorar logs de execução para confirmar disparos automáticos

## Validação Pós-Correção

Após aplicar a correção, verificar:
- Execuções automáticas aparecendo nos logs
- Execuções com `"mode": "trigger"` (não manual)
- Disparos nos horários: 07:00, 08:00, 10:00, 11:00, 13:00, 14:00, 16:00, 17:00, 19:00, 21:00
