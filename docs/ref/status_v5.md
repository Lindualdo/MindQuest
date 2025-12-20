# Resumo - Experts v5 (Controle Individual + Retry)

**Status:** ✅ Estrutura criada | ⏳ Implementação completa pendente

---

## Arquivos Criados

1. ✅ `sql/migration_experts_v5.sql` - Adiciona coluna `experts_processados`
2. ✅ `backups/n8n/job_experts_v5.json` - Job scheduler com busca inteligente
3. ⚠️ `backups/n8n/sw_expert_v5.json` - **INCOMPLETO** (só sabotadores)
4. ✅ `docs/ref/refactor_experts_v5.md` - Documentação completa

---

## O que Falta

### sw_expert_v5

Precisa adicionar **4 experts** (emocoes, humor, bigfive, insights) seguindo o padrão de sabotadores:

**Template por expert:**
```
Switch → DELETE (chat_id) → Agent LLM → Gravar
                                        ├─ Sucesso → Log Sucesso
                                        └─ Erro → Log Erro
```

**Copiar do `sw_expert.json` (v4):**
- Nodes dos agents LLM + parsers
- Queries de INSERT
- Adaptar para estrutura v5

---

## Como Completar

### Opção 1: Manualmente no n8n UI
1. Importar `sw_expert_v5.json` (tem sabotadores completo)
2. Abrir `sw_expert.json` (v4) em outra aba
3. Copiar/colar nodes de cada expert
4. Adicionar Switch + DELETE + Log para cada
5. Exportar versão final

### Opção 2: Programaticamente
```bash
# Ler sw_expert.json (v4)
# Extrair nodes de emocoes, humor, bigfive, insights
# Replicar estrutura de sabotadores
# Salvar sw_expert_v5.json completo
```

---

## Validação Final

Antes de ativar:

1. ✅ Migration rodou com sucesso
2. ✅ `job_experts_v5` importado no n8n
3. ⏳ `sw_expert_v5` completo com 5 experts
4. ⏳ Teste forçando erro em 1 expert
5. ⏳ Validar que só esse expert reprocessa
6. ⏳ Validar bloqueio após 5 tentativas
7. ⏳ Desativar v4, ativar v5

---

## Pronto para Uso?

**NÃO.** Falta completar `sw_expert_v5` com os 4 experts restantes.

**Próximo passo:** Completar nodes de emocoes, humor, bigfive, insights no `sw_expert_v5`.

