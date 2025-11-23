# Passo 2: Sub-etapas de Implementação

**Data:** 2025-11-23 12:00  
**Versão:** 1.3.5  
**Status:** Em execução

---

## Sub-etapas

### ✅ Sub-etapa 2.1: Atualização na Base de Dados
**Status:** ✅ Concluída (2025-11-23 12:04)

- Adicionar campo `quest_estagio` em `usuarios_quest`
- Adicionar campo `estagio_jornada` em `usuarios`
- Criar função para calcular estágio da jornada
- Atualizar `estagio_jornada` para usuários existentes

---

### ✅ Sub-etapa 2.2: Atualizar Workflow `sw_xp_quest` (Inserir Instancias)
**Status:** ✅ Concluída (2025-11-23 12:08)

- Nó "Inserir Instancias" atualizado
- Campo `quest_estagio` adicionado no INSERT
- Valor padrão: `'a_fazer'` (todas quests nascem como `a_fazer`)

---

### ⏳ Sub-etapa 2.3: Atualizar Workflow (Planejamento/Aprovação)
**Status:** ⏳ Aguardando interface

- Quando usuário aprova/ajusta recorrências, mudar para `quest_estagio = 'fazendo'`
- **Nota:** Interface de aprovação ainda não existe (será criada depois)
- Por enquanto, sistema trata apenas `fazendo` e `feito`

---

### ✅ Sub-etapa 2.4: Atualizar Workflow (Conclusão)
**Status:** ✅ Concluída (2025-11-23 12:23)

**Correções aplicadas:**
- `usuarios_quest.recorrencias` → apenas planejamento (sem status)
- `quest_estagio` → estágio da quest inteira (`a_fazer`, `fazendo`, `feito`)
- Execução sempre em `conquistas_historico.detalhes->ocorrencias[]`
- Verificação de "todas concluídas" compara `recorrencias->dias[]` (planejado) vs `conquistas_historico.detalhes->total_concluidas` (executado)
- Removido `status` e `concluido_em` de `recorrencias->dias[]` (apenas planejamento)

---

### ⏳ Sub-etapa 2.5: Atualizar Workflow `webhook_quests`
**Status:** Aguardando aprovação da sub-etapa 2.4

- Filtrar por `quest_estagio`

---

### ⏳ Sub-etapa 2.6: Atualizar Consolidação (XP)
**Status:** Aguardando aprovação da sub-etapa 2.5

- Atualizar `usuarios_conquistas` → calcular `usuarios.estagio_jornada`

---

*Documento de controle das sub-etapas do Passo 2*

