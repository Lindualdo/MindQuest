# Postgres - Referência Rápida

**Data:** 2025-12-04

## Conexão

**Arquivo:** `config/postgres.env`

```bash
# Carregar variáveis
source config/postgres.env

# Testar conexão
PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c 'SELECT 1'
```

## Query Rápida

```bash
# Com variáveis carregadas
psql -c "SELECT * FROM tabela LIMIT 5"

# Sem carregar env
PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "SQL AQUI"
```

## Tabelas Principais

- `usuarios` - Dados dos usuários
- `usr_chat` - Conversas com o mentor
- `usuarios_quest` - Quests (ativas/concluídas)
- `quests_recorrencias` - recorrencias de cada quests
- `usuarios_conquistas` - pontos consolidados de XPs
- `usuarios_objetivos` - Objetivos (um padrão e 2 configurados)
- `insights` - Insights gerados
- `usuarios_sabotadores` - Sabotadores detectados
- `notificacoes` - Configuração das notificações
- `notificacoes_log` - Log de notificações enviadas (controle reenvio)
- `log_experts` - Controle de processamento dos experts por conversa

## Regras

1. **NUNCA** colocar senha no chat
2. **SEMPRE** usar variáveis do `config/postgres.env`
3. **SEMPRE** validar acesso antes de queries
4. Citar apenas `config/postgres.env` ao referenciar credenciais

