# Resumo das Correções Aplicadas no `sw_xp_quest.json`

**Data:** 2025-01-22 18:45
**Última atualização:** 2025-01-22 18:45

---

## Correções Aplicadas

### ✅ 1. Removidos Nós Obsoletos
- **"Listar Config Quest"**: Removido (buscava de `metas_catalogo` que não existe mais)
- **"Esperar Config Quest"**: Removido (merge node desnecessário)
- **"Anexar Config Quest"**: Removido (anexava `xp_base_quest` e `xp_bonus_recorrencia` que não existem mais)

### ✅ 2. Conexões Corrigidas
- **"Normalizar Entrada"**: Removida conexão para "Listar Config Quest"
- **"Inserir Instancias"**: Agora conecta diretamente para "Aplicar Atualizacoes"
- **"Preparar Operacoes"**: Agora conecta para "Verificar e Criar Quest Inicial"

### ✅ 3. Adicionado Nó "Verificar e Criar Quest Inicial"
- Verifica se usuário tem quests
- Se não tiver, cria `reflexao_diaria` automaticamente
- Cria recorrências para dias restantes da semana (hoje até sábado)
- Define `quest_estagio = 'fazendo'` e `config->conversa = true`

### ✅ 4. Query "Inserir Instancias" - Correções Pendentes
**Ainda precisa ser corrigido:**
- Remover `status` e `concluido_em` de `recorrencias->dias[]` (manter apenas `data` e `xp_previsto`)
- Adicionar campo `quest_estagio` no INSERT (default `'a_fazer'`)

### ⚠️ 5. Query "Aplicar Atualizacoes" - Correções Pendentes
**Ainda precisa ser corrigido:**
- Remover parâmetros `$5` e `$6` (xp_base_quest, xp_bonus_recorrencia)
- Buscar XP de `quests_catalogo.xp` via `LEFT JOIN` com `usuarios_quest.catalogo_id`
- Adicionar campos `quest_estagio` e `catalogo_id` em `alvos`
- Adicionar lógica de `quest_estagio` no UPDATE (a_fazer → fazendo → feito)
- Corrigir `meta_codigo` para usar UUID ao invés de text (`upd.id::uuid`)

**Query corrigida disponível em:** `query_aplicar_atualizacoes_corrigida.sql`

---

## Próximos Passos

1. **Aplicar correções pendentes no nó "Inserir Instancias":**
   - Remover `status` e `concluido_em` de `recorrencias->dias[]`
   - Adicionar `quest_estagio` no INSERT

2. **Aplicar query corrigida no nó "Aplicar Atualizacoes":**
   - Substituir query completa pela versão corrigida em `query_aplicar_atualizacoes_corrigida.sql`

3. **Validar workflow no n8n:**
   - Verificar conexões
   - Testar execução
   - Validar criação automática de `reflexao_diaria`

---

## Arquivos de Referência

- `backups/n8n/sw_xp_quest.json` - Workflow corrigido (parcialmente)
- `query_aplicar_atualizacoes_corrigida.sql` - Query SQL corrigida para "Aplicar Atualizacoes"
- `correcoes_sw_xp_quest.md` - Documento original com problemas identificados

