# Correção: Conversas Diárias Não Aparecendo na Home

## Problema

As conversas diárias não apareciam no card "Conversas da Semana" na home, mesmo existindo conversas no banco de dados.

## Causa Raiz

**Inconsistência no cálculo de início de semana:**

- **Backend (SQL)**: Calculava semana iniciando em **domingo** (07/12)
- **Frontend (React)**: Esperava semana iniciando em **segunda-feira** (01/12)

A query SQL do webhook `progresso-semanal` usava:
```sql
(date_trunc('week', CURRENT_DATE + 1)::date - 1) AS semana_inicio
```

Isso resultava em domingo como início, enquanto o frontend usa:
```typescript
startOfWeek(hoje, { weekStartsOn: 1 }) // 1 = segunda-feira
```

## Solução

**Atualizar a query SQL no n8n workflow `webhook_progresso_semanal`:**

### Antes:
```sql
(date_trunc('week', CURRENT_DATE + 1)::date - 1) AS semana_inicio
```

### Depois:
```sql
date_trunc('week', CURRENT_DATE)::date AS semana_inicio
```

O `date_trunc('week', date)` no PostgreSQL já retorna segunda-feira (ISO week), então não precisa do ajuste `+ 1` e `- 1`.

## Como Aplicar no n8n

1. Acessar workflow `webhook_progresso_semanal`
2. Abrir o node "Calcular Semana" (Postgres)
3. Na query SQL, localizar a linha:
   ```sql
   (date_trunc('week', CURRENT_DATE + 1)::date - 1) AS semana_inicio
   ```
4. Substituir por:
   ```sql
   date_trunc('week', CURRENT_DATE)::date AS semana_inicio
   ```
5. Salvar e ativar o workflow

## Validação

Após a correção, a query deve retornar:
- Semana início: Segunda-feira (ex: 2025-12-01)
- Semana fim: Domingo (ex: 2025-12-07)
- Conversas devem aparecer nos dias corretos

## Arquivo Atualizado

O backup do workflow foi atualizado em:
- `backups/n8n/webhook_progresso_semanal.json`

## Referência

- Frontend: `src/components/app/v1.3/CardWeeklyProgress.tsx` (linha 14)
- Backend: `backups/n8n/webhook_progresso_semanal.json` (linha 41)
