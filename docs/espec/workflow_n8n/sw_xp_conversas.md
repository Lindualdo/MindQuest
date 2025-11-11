# sw_xp_conversas

## Objetivo
- Recalcular XP diário (75 XP/dia distinto) e bônus de streak `streak_003…streak_030` com base nas conversas em `usr_chat`.
- Atualizar `usuarios_conquistas` (XP total/base/bônus, metas, streak atual/recorde, status) e registrar eventos em `conquistas_historico`.
- Disparar `sw_calcula_jornada` para reavaliar nível/título e retornar o snapshot consolidado ao chamador.

## Fluxo resumido
1. Recebe `usuario_id` e flags.
2. Lê snapshot atual de `usuarios_conquistas`.
3. Decide se há dias novos; se sim, lê `usr_chat` (45 dias), calcula XP/streaks e registra conquistas.
4. Atualiza o snapshot, grava histórico e executa `sw_calcula_jornada` antes de responder.

## Nós e regras

### start
- Trigger manual/subworkflow; recebe `usuario_id`, `calcular_apenas_novos`.

### Validar Entrada
- Normaliza parâmetros.
- Converte flags (`recalcular_completo`, `calcular_apenas_novos`) em boolean.

### Ler Usuarios Conquistas (nó crítico)
- Busca `usuarios_conquistas` por `usuario_id`.
- Dependência atual: sem registro o fluxo encerra (limitação a corrigir em futuros ajustes).

### Checar Necessidade
- Calcula `dias_desde_ultima_conversa` usando `ultima_conversa_em`.
- Define `precisa_recalcular = force || diffDias >= 1`.

### Precisa Recalcular? (IF)
- True → segue para `Ler Usr Chat`.
- False → sai direto via `Retornar Resultado` reaproveitando snapshot.

### Ler Usr Chat
- SELECT em `usr_chat` (45 dias). Retorna data, timestamps, indicadores de reflexão, palavras etc.

### Calcular XP Conversas
- Aplica regras:
  - 75 XP por dia distinto novo.
  - +75 XP primeira conversa.
  - Bônus por metas `streak_003…streak_030` quando streak >= alvo.
- Atualiza streak atual/recorde, determina próxima meta, gera eventos e payload com detalhes dos dias.

### Zerar Sequência se Gap
- Se houve gap >1 dia, zera sequência e incrementa contagem de resets.

### Atualizar Usuarios Conquistas
- UPDATE somando `xp_ganho`, setando streaks/ metas/status e `atualizado_em`.

### Preparar XP Diário → Atualizar Historico Diario
- Monta payload da meta `conversa_diaria` e grava/atualiza `conquistas_historico` com XP base diário.

### Preparar Conquistas → Registrar Historico Bonus
- Insere eventos de primeira conversa/streaks em `conquistas_historico` com XP bônus.

### Atualizar Jornada
- Executa `sw_calcula_jornada` para recalcular nível/título com o novo XP total.

### Retornar Resultado
- Retorna o snapshot atualizado ou o estado original quando não houve recálculo.

## Limitações/observações
- Ausência de registro em `usuarios_conquistas` impede execuções (precisa seed inicial).
- Reprocessamentos em lote devem recriar snapshots antes de rodar o workflow.

## Fluxo proposto (revisão)

### Objetivos da revisão
- Manter `usr_chat` como fonte primária (docs/espec/jornadas/jornada_mindquest_1.2.md:44-99); `usuarios_conquistas` vira apenas cache derivado.
- Permitir criar o snapshot on-the-fly para usuários novos.
- Permitir reprocessar intervalos completos sem depender de dados pré-existentes.

### Sequência sugerida
1. **start / Validar Entrada**
   - Recebe `usuario_id`, `recalcular_completo`, `data_inicio_custom` (opcional).
   - Normaliza data de corte (default = última conversa já registrada; fallback = 45 dias).
2. **Definir Janela / Garantir Snapshot**
   - Lê `usuarios_conquistas`; se não existir, insere registro padrão (`nivel=1`, `streak=0`, `meta=streak_003`).
   - Expõe `ultima_conversa_em` e `sequencia_status` para cálculos, mas não interrompe o fluxo.
3. **Buscar Conversas**
   - Consulta `usr_chat` com base no intervalo definido (última conversa processada + 45 dias ou `recalcular_completo`).
   - Se não houver novas conversas, retorna estado atual imediatamente.
4. **Calcular XP Conversas**
   - Reprocessa os dias retornados aplicando regras:
     - 75 XP por dia distinto (primeira conversa do dia).
     - +75 XP primeira conversa geral.
     - Bônus de metas `streak_003…streak_030`.
     - Reset de streak quando existir gap de 1 dia inteiro.
   - Emite payload com XP base/bônus, streak atual/recorde, meta ativa/próxima, eventos para histórico.
5. **Persistir / Registrar**
   - `Sincronizar Usuarios Conquistas`: UPSERT com novos valores (criando se ainda inexistente).
   - `Registrar XP Diário`: grava/atualiza meta `conversa_diaria` em `conquistas_historico`.
   - `Registrar Bônus de Streak`: adiciona eventos de primeira conversa + metas completas.
6. **Atualizar Jornada + Retornar Resultado**
   - Chama `sw_calcula_jornada`.
   - Retorna o snapshot recalculado, incluindo indicadores de quantos dias foram processados.

### Benefícios
- Usuários novos passam pelo mesmo fluxo (snapshot criado automaticamente).
- Reprocessamentos em lote podem ser feitos apenas truncando dados e executando o workflow, sem seed manual.
- A fonte única (`usr_chat`) garante aderência às regras e reduz inconsistências entre histórico e snapshot.
