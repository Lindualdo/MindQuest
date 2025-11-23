# Passo 4: Gestão de Slots (Máx. 5 Ativas)

**Data:** 2025-11-23 11:25  
**Versão:** 1.3.5  
**Status:** Planejamento - Aguardando aprovação

---

## Objetivo

Limitar número de quests ativas simultaneamente para manter foco do usuário

---

## O que fazer (Macro)

1. **Validação de slots:**
   - Máximo 5 quests com `status_execucao = 'ativa'` por usuário
   - Query para contar quests ativas antes de ativar nova

2. **Lógica de liberação:**
   - Quando quest concluída (`concluida`), slot é liberado
   - Usuário pode desativar quest ativa (volta para `planejada`)

3. **Exceções:**
   - Quests essenciais (ex: `reflexao_diaria`) não ocupam slot
   - Campo `essencial` em `quests_catalogo` ou lógica especial

4. **Interface:**
   - Avisar quando slot está cheio
   - Sugerir concluir quests ativas antes de ativar nova
   - Mostrar contador: "3/5 slots utilizados"

5. **Atualizar workflows:**
   - `webhook_ativar_quest`: validar slots antes de ativar
   - `webhook_concluir_quest`: liberar slot ao concluir
   - `webhook_quests`: incluir informação de slots

---

## Dependências

- Passo 2 (status de execução) - necessário para identificar quests ativas

---

## Impacto

- Mudança em lógica de ativação
- Interface precisa mostrar slots
- Usuário pode ficar limitado (pode ser positivo para foco)

---

## Próximos Passos (Após Aprovação)

- Detalhar query de validação
- Definir lógica de exceções (essenciais)
- Atualizar workflows específicos
- Definir interface de slots

---

*Documento macro - detalhamento será feito na execução*

