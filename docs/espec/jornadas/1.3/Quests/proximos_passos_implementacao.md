# Próximos Passos - Implementação Sistema de Quests v1.3.5

**Data:** 2025-11-23 11:21  
**Versão:** 1.3.5  
**Status:** Planejamento - Aguardando aprovação para cada passo

---

## ⚠️ Metodologia

**Abordagem:** Implementação incremental, um passo por vez
- Discutir cada passo antes de implementar
- Aprovar antes de seguir
- Ajustar e aprimorar em cada etapa
- Sem pressa, com qualidade

---

## Passo 2: Sistema de Status de Execução (Planejada → Ativa → Concluída)

**Objetivo:** Implementar ciclo de vida das quests: `planejada` → `ativa` → `concluida`

**⚠️ IMPORTANTE:** Não confundir com "estágios da jornada" (4 estágios baseados em níveis). Este passo é sobre o **status/ciclo de vida individual de cada quest**.

### O que fazer:

1. **Adicionar campo `status_execucao` em `usuarios_quest`** (ou expandir `status` atual)
   - Tipo: `VARCHAR(20)`
   - Valores: `planejada`, `ativa`, `concluida`
   - Default: `planejada`
   - **Nota:** `status` atual pode ser mantido para compatibilidade ou migrado

2. **Lógica de status:**
   - Quests nascem como `planejada` (criadas pelo sistema/IA)
   - Usuário ativa → vira `ativa`
   - Ao concluir → vira `concluida`
   - Quest concluída não pode ser reativada (criar nova instância se necessário)

3. **Atualizar workflows:**
   - `sw_criar_quest`: criar quests como `planejada`
   - `sw_xp_quest`: manter status ao persistir
   - `webhook_concluir_quest`: mudar para `concluida` ao concluir
   - `webhook_quests`: filtrar por status
   - Novo: `webhook_ativar_quest`: mudar de `planejada` para `ativa`

4. **Validações:**
   - Quest só pode ser ativada se estiver `planejada`
   - Quest só pode ser concluída se estiver `ativa`
   - Quest concluída não pode ser reativada (criar nova instância)

### Dependências:
- Nenhuma (pode ser implementado isoladamente)

### Impacto:
- Mudança em estrutura de dados
- Atualização de workflows n8n
- Possível atualização de frontend (filtros por status)

### Status: ⏳ Aguardando aprovação

---

## Passo 3: Atualizar `sw_criar_quest` para Usar Catálogo e Estágios da Jornada

**Objetivo:** IA consulta catálogo baseado no **estágio da jornada** do usuário (4 estágios baseados em níveis)

**⚠️ IMPORTANTE:** Aqui usamos os **estágios da jornada** (Fundação, Transformação, Integração, Mestria) para filtrar quests do catálogo.

### O que fazer:

1. **Consultar nível do usuário:**
   - Buscar nível atual em `usuarios_conquistas` ou `quest_estado_usuario`
   - Consultar `jornada_niveis` para obter nível e XP

2. **Mapear nível → estágio da jornada:**
   - Níveis 1-3 → **Estágio 1: Fundação** (Despertar, Clareza, Coragem)
   - Níveis 4-5 → **Estágio 2: Transformação** (Consistência, Resiliência)
   - Níveis 6-7 → **Estágio 3: Integração** (Expansão, Maestria)
   - Níveis 8-10 → **Estágio 4: Mestria** (Impacto, Legado, Transcendência)

3. **Filtrar `quests_catalogo` por estágio da jornada:**
   - Criar função/query que retorna quests apropriadas ao estágio
   - Considerar também: sabotador ativo, áreas da vida, contexto
   - Quests do catálogo devem ter indicação de qual estágio são apropriadas

4. **IA personaliza quests do catálogo:**
   - Ao invés de criar do zero, IA adapta quests do catálogo
   - Mantém estrutura base, personaliza texto/contexto
   - Sempre preencher `catalogo_id` (ou `quest_custom` se totalmente personalizada)

5. **Atualizar prompt do agente:**
   - Incluir quests do catálogo filtradas por estágio como contexto
   - Orientar para adaptar, não criar do zero
   - Manter formato JSON esperado

### Dependências:
- Catálogo populado (✅ já feito)
- Estágios da jornada definidos (✅ já documentado)

### Impacto:
- Mudança significativa em `sw_criar_quest`
- Quests mais consistentes e baseadas em ciência
- Quests apropriadas ao nível de evolução do usuário

### Status: ⏳ Aguardando aprovação

---

## Passo 4: Gestão de Slots (Máx. 5 Ativas)

**Objetivo:** Limitar número de quests ativas simultaneamente

### O que fazer:

1. **Validação de slots:**
   - Máximo 5 quests com `estagio_execucao = 'ativa'` por usuário
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

### Dependências:
- Passo 2 (status de execução) - necessário para identificar quests ativas

### Impacto:
- Mudança em lógica de ativação
- Interface precisa mostrar slots
- Usuário pode ficar limitado (pode ser positivo para foco)

### Status: ⏳ Aguardando aprovação

---

## Passo 5: Relacionamento Conversa Diária

**Objetivo:** Usar `quest_catalogo_id` em `conquistas_historico` para conversas

### O que fazer:

1. **Criar instância de quest `reflexao_diaria` para usuário:**
   - Uma por usuário (sempre ativa)
   - `catalogo_id` = ID da quest `reflexao_diaria` do catálogo
   - `estagio_execucao` = `ativa` (sempre)
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

### Dependências:
- Catálogo com quest `reflexao_diaria` (✅ já feito)
- Passo 2 (status de execução) - para criar quest como `ativa`

### Impacto:
- Mudança em estrutura de relacionamento
- Migração de dados históricos
- Compatibilidade com sistema atual

### Status: ⏳ Aguardando aprovação

---

## Passo 6: Interface de Escolha/Ativação

**Objetivo:** Permitir usuário escolher e ativar quests do catálogo

### O que fazer:

1. **Tela "Banco de Quests":**
   - Listar quests disponíveis do catálogo
   - Filtros: estágio, categoria, sabotador, área da vida
   - Busca por título/descrição
   - Mostrar detalhes: título, descrição, tempo estimado, dificuldade

2. **Botão "Ativar" em quests planejadas:**
   - Validar slots disponíveis antes de ativar
   - Confirmar ativação
   - Atualizar `estagio_execucao` para `ativa`

3. **Validação de slots:**
   - Verificar se há slot disponível
   - Se não houver, mostrar mensagem e sugerir concluir quests ativas
   - Exibir contador de slots

4. **Abas na interface:**
   - **Planejadas:** Quests criadas pelo sistema, aguardando ativação
   - **Ativas:** Quests em execução (máx. 5)
   - **Concluídas:** Histórico de quests concluídas

5. **Visual diferenciado:**
   - Quests essenciais: mostrar como "sempre ativas" (diferente visual)
   - Quests do sistema: indicar origem
   - Quests personalizadas: indicar que foram criadas pela IA

### Dependências:
- Passo 2 (status de execução) - para mostrar quests planejadas
- Passo 4 (slots) - para validação
- Frontend atualizado

### Impacto:
- Mudança significativa na interface
- Nova tela/painel
- Melhor UX para escolha de quests

### Status: ⏳ Aguardando aprovação

---

## Ordem de Implementação Sugerida

1. **Passo 2** (Status de Execução) - Base para tudo (planejada → ativa → concluida)
2. **Passo 3** (sw_criar_quest) - Usa estágios da jornada para filtrar catálogo
3. **Passo 4** (Slots) - Depende de status de execução
4. **Passo 5** (Conversa diária) - Pode ser paralelo ao 4
5. **Passo 6** (Interface) - Depende dos anteriores

---

## Glossário - Evitar Confusão

- **Estágios da Jornada:** 4 estágios de evolução (Fundação, Transformação, Integração, Mestria) baseados nos 10 níveis da jornada. Usados para filtrar quests do catálogo apropriadas ao nível do usuário.

- **Status de Execução:** Ciclo de vida individual de cada quest (planejada → ativa → concluida). Usado para gerenciar quais quests o usuário está executando.

---

## Notas Importantes

- **Sempre discutir antes de implementar**
- **Aprovar cada passo antes de seguir**
- **Ajustar e aprimorar em cada etapa**
- **Testar após cada implementação**
- **Documentar mudanças**

---

*Documento criado para guiar implementação incremental do sistema de Quests*

