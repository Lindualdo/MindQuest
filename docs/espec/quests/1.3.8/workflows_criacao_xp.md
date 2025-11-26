# Workflows - Criação e Cálculo de XP v1.3.8

**Data:** 2025-01-22  
**Versão:** 1.3.8

---

## Workflows de Criação e Cálculo de XP

### 1. `sw_criar_quest`
**Objetivo:** Criar 3 quests automaticamente via IA baseadas em conversas, insights e sabotadores.

**Entrada:**
- `usuario_id`
- `chat_id` (opcional)

**Processo:**
- Busca contexto (conversas, insights, sabotadores, áreas da vida)
- Seleciona quests do catálogo (sabotador, TCC/estoicismo)
- Gera quest personalizada via IA
- Chama `sw_xp_quest` para persistir

**Saída:**
- 3 quests criadas (personalizada, sabotador, TCC/outras)

---

### 2. `sw_xp_quest`
**Objetivo:** Persistir quests e calcular XP quando concluídas.

**Entrada:**
- `usuario_id`
- `quests_personalizadas` (array)
- `atualizacoes_status` (array)

**Processo:**
- Cria quest inicial (reflexão diária) se não existir
- Insere novas quests com `status='disponivel'`
- Atualiza status de quests existentes
- Calcula e distribui XP ao concluir
- Atualiza `usuarios_conquistas`
- Chama `sw_calcula_jornada` para atualizar nível

**Saída:**
- Quests criadas/atualizadas
- XP calculado e distribuído
- Estado do usuário atualizado

---

### 3. `sw_xp_conversas`
**Objetivo:** Calcular XP de conversas diárias e manter sequência.

**Entrada:**
- `usuario_id`
- `calcular_apenas_novos` (boolean)

**Processo:**
- Busca ou cria quest de reflexão diária (`status='ativa'`)
- Processa conversas dos últimos 45 dias
- Calcula XP por dia conversado
- Atualiza sequência (streak)
- Registra ocorrências em `conquistas_historico`
- Atualiza `usuarios_conquistas`
- Chama `sw_calcula_jornada` para atualizar nível

**Saída:**
- XP de conversas calculado
- Sequência atualizada
- Ocorrências registradas

---

### 4. `sw_calcula_jornada`
**Objetivo:** Calcular nível e estágio da jornada baseado em métricas.

**Entrada:**
- `usuario_id`

**Processo:**
- Busca métricas (XP, quests concluídas, sabotadores, etc.)
- Calcula nível elegível por XP
- Valida requisitos de cada nível
- Determina nível final e estágio (1-4)
- Atualiza `usuarios_conquistas` e `usuarios.estagio_jornada`

**Saída:**
- Nível e estágio atualizados

---

## Fluxo de Execução

```
1. Nova conversa → sw_xp_conversas
   └─> sw_calcula_jornada

2. Criar quests → sw_criar_quest
   └─> sw_xp_quest
       └─> sw_calcula_jornada

3. Concluir quest → webhook_concluir_quest
   └─> sw_xp_quest
       └─> sw_calcula_jornada
```

---

## Status das Quests

- **`disponivel`**: Criada, aguardando usuário ativar
- **`ativa`**: Usuário ativou, em andamento
- **`inativa`**: Todas instâncias concluídas ou vencidas

**Conversas:** Sempre `ativa` (nunca muda)

---

**Última atualização:** 2025-01-22

