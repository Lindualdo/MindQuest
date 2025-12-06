# Análise de Causa Raiz - job_notificacoes_lembretes

**Data:** 2025-12-05  
**Workflow ID:** `i5VG5rHZ39ytueyu`  
**Problema:** Job não executa nos horários definidos

## Problemas Identificados

### 1. Workflow Inativo ⚠️ CRÍTICO
- **Status:** `"active": false` (linha 6)
- **Impacto:** Workflow não executa mesmo com trigger configurado
- **Localização:** Propriedade raiz do workflow

### 2. Schedule Trigger Desabilitado ⚠️ CRÍTICO
- **Status:** `"disabled": true` (linha 28)
- **Impacto:** Node não dispara execuções
- **Localização:** Node "Schedule Trigger" (id: `schedule`)

### 3. Schedule Trigger Desconectado ⚠️ CRÍTICO
- **Status:** Conexão vazia `[]` (linha 548)
- **Impacto:** Mesmo se disparar, não passa dados para o próximo node
- **Localização:** `connections["Schedule Trigger"]["main"][0]` está vazio
- **Esperado:** Deveria conectar ao node "Query Contexto Completo" (id: `query_contexto`)

### 4. Configuração do Cron Expression ⚠️ VERIFICAR
- **Expressão atual:** `"0 7,8,10,11,13,14,16,17,19,21 * * *"`
- **Formato:** Parece correto (minuto hora dia mês dia-semana)
- **Horários configurados:** 07:00, 08:00, 10:00, 11:00, 13:00, 14:00, 16:00, 17:00, 19:00, 21:00
- **Observação:** Formato pode precisar de validação no n8n

## Comparação com Workflows Funcionais

### job_batch_xp_conversas (funcional)
```json
{
  "active": true,  // ✅ Ativo
  "disabled": false,  // ✅ Habilitado (não tem campo disabled)
  "connections": {
    "Schedule Trigger": {
      "main": [[{ "node": "Listar Usuários", ... }]]  // ✅ Conectado
    }
  }
}
```

## Causa Raiz

**Tripla falha de configuração:**
1. Workflow inativo impede execução
2. Node desabilitado impede trigger
3. Conexão ausente impede fluxo de dados

## Correções Necessárias

### 1. Ativar Workflow
```json
{
  "type": "updateSettings",
  "updates": {
    "active": true
  }
}
```

### 2. Habilitar Schedule Trigger
```json
{
  "type": "enableNode",
  "nodeId": "schedule"
}
```

### 3. Conectar Schedule Trigger
```json
{
  "type": "addConnection",
  "sourceNodeId": "schedule",
  "targetNodeId": "query_contexto",
  "sourceOutput": "main",
  "targetInput": "main"
}
```

### 4. Validar Cron Expression
- Verificar formato no n8n UI
- Testar execução manual primeiro
- Confirmar timezone do servidor n8n

## Próximos Passos

1. ✅ Análise completa (este documento)
2. ⏳ Aguardar aprovação para correção
3. ⏳ Aplicar correções via MCP
4. ⏳ Validar execução nos horários configurados
5. ⏳ Monitorar logs de execução
