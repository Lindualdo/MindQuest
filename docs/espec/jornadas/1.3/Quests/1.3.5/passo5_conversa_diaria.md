# Passo 5: Relacionamento Conversa Diária

**Data:** 2025-11-23 11:25  
**Versão:** 1.3.5  
**Status:** Planejamento - Aguardando aprovação

---

## Objetivo

Usar `quest_catalogo_id` em `conquistas_historico` para relacionar conversas diárias com quest do catálogo

---

## O que fazer (Macro)

1. **Criar instância de quest `reflexao_diaria` para usuário:**
   - Uma por usuário (sempre ativa)
   - `catalogo_id` = ID da quest `reflexao_diaria` do catálogo
   - `status_execucao` = `ativa` (sempre)
   - `recorrencias` = diária

2. **Atualizar `conquistas_historico`:**
   - `meta_codigo` = `usuarios_quest.id` (da quest de reflexão diária)
   - `tipo` = `'quest'` (não mais `'conversa'`)
   - Manter `detalhes->ocorrencias[]` com detalhes de cada conversa

3. **Atualizar `sw_xp_conversas`:**
   - Buscar `usuarios_quest.id` da quest `reflexao_diaria` do usuário
   - Usar esse ID em `meta_codigo`
   - Manter lógica de `detalhes` JSONB

4. **Migração de dados existentes:**
   - Criar quest `reflexao_diaria` para todos os usuários existentes
   - Migrar `conquistas_historico` com `tipo = 'conversa'` para usar novo `meta_codigo`
   - Validar integridade dos dados

---

## Dependências

- Catálogo com quest `reflexao_diaria` (✅ já feito)
- Passo 2 (status de execução) - para criar quest como `ativa`

---

## Impacto

- Mudança em estrutura de relacionamento
- Migração de dados históricos
- Compatibilidade com sistema atual

---

## Próximos Passos (Após Aprovação)

- Detalhar script de migração
- Definir lógica de criação automática
- Atualizar `sw_xp_conversas`
- Validar dados migrados

---

*Documento macro - detalhamento será feito na execução*

