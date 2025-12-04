# Postgres - Referência Rápida

**Data:** 2025-01-22 15:30

## Conexão

**Arquivo:** `config/postgres.env`

```bash
# Carregar variáveis
source config/postgres.env

# Testar conexão
PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c 'SELECT 1'
```

## Variáveis

```bash
PGHOST="host"
PGPORT="5432"
PGUSER="usuario"
PGPASSWORD="senha"
PGDATABASE="mindquest"
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
- `conversas` - Conversas com o mentor
- `quests` - Quests (ativas/concluídas)
- `insights` - Insights gerados
- `sabotadores` - Sabotadores detectados

## Regras

1. **NUNCA** colocar senha no chat
2. **SEMPRE** usar variáveis do `config/postgres.env`
3. **SEMPRE** validar acesso antes de queries
4. Citar apenas `config/postgres.env` ao referenciar credenciais

---

**Economia de tokens:** Este documento tem ~200 tokens vs ~800 tokens da documentação completa.

