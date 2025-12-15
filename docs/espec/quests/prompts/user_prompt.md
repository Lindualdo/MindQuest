# User Prompt - Criar Quests

<context>
<!-- CONVERSA ATUAL (gatilho desta execução) -->
<current_conversation>
{{ JSON.stringify($json.conversa_atual || null) }}
</current_conversation>

<!-- HISTÓRICO (últimas 2 conversas) -->
<history>
{{ JSON.stringify($json.conversas_historico || []) }}
</history>
</context>

<existing_quests>
<!-- TÍTULOS JÁ CRIADOS - NÃO DUPLICAR -->
{{ JSON.stringify($json.quests_ja_criadas_titulos || []) }}
</existing_quests>

<sabotadores>
<!-- TOP 3 HISTÓRICOS -->
{{ JSON.stringify($json.top3_historicos || []) }}

<!-- PRINCIPAL (usar para quest 2) -->
{{ JSON.stringify($json.sabotador_principal || null) }}

<!-- SECUNDÁRIO (usar se criar_quest_adicional = true) -->
{{ JSON.stringify($json.sabotador_secundario || null) }}

<!-- FLAG: CRIAR 4ª QUEST? -->
criar_quest_adicional: {{ $json.criar_quest_adicional || false }}
</sabotadores>

<objetivos>
<!-- PADRÃO (usar para sabotador e TCC) -->
{{ JSON.stringify($json.objetivos_usuario?.padrao || null) }}

<!-- ESPECÍFICOS (usar para personalizada se tema relacionado) -->
{{ JSON.stringify($json.objetivos_usuario?.especificos || []) }}
</objetivos>

<areas>
{{ JSON.stringify($json.areas_disponiveis || []) }}
</areas>

<catalogo>
<!-- QUEST TCC PRÉ-SELECIONADA -->
{{ JSON.stringify($json.quests_catalogo_escolhidas?.tcc_estoicismo_outras || null) }}
</catalogo>

<instructions>
GERE EXATAMENTE {{ $json.criar_quest_adicional ? '4' : '3' }} QUESTS:

1. **PERSONALIZADA** → baseada em <current_conversation>
   - tipo: "personalizada"
   - catalogo_id: null
   - sabotador_id: null
   - objetivo_id: ESPECÍFICO se tema trabalho/finanças/projeto

2. **SABOTADOR** → baseada em sabotador_principal
   - tipo: "sabotador"
   - catalogo_id: null
   - sabotador_id: COPIAR de sabotador_principal
   - objetivo_id: PADRÃO
   - USAR insight_atual e contramedida_ativa

3. **TCC/CATÁLOGO** → adaptar de <catalogo>
   - tipo: "tcc"
   - catalogo_id: COPIAR de quest pré-selecionada
   - objetivo_id: PADRÃO

{{ $json.criar_quest_adicional ? '4. **SABOTADOR SECUNDÁRIO** → baseada em sabotador_secundario\n   - tipo: "sabotador"\n   - sabotador_id: COPIAR de sabotador_secundario' : '' }}

⚠️ VERIFICAR <existing_quests> ANTES DE CRIAR - NÃO DUPLICAR TÍTULOS/TEMAS
</instructions>

