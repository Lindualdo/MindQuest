<user_input>

<message>
{{ $('transcricao').item.json.message }}
</message>

<session_context>
<interaction_number>{{ $('contexto_completo').first().json.interacao_atual }}</interaction_number>
<is_new_session>{{ $('contexto_completo').first().json.is_nova_sessao ? 'SIM' : 'NÃO' }}</is_new_session>
<is_first_ever>{{ $('contexto_completo').first().json.is_primeira_conversa ? 'SIM' : 'NÃO' }}</is_first_ever>
</session_context>
</user_input>


<!-- ============================================ -->
<!-- CONTEXTO DO USUÁRIO -->
<!-- ============================================ -->

<user_context>
<profile>
<name>{{ $('contexto_completo').first().json.nome_preferencia || 'amigo' }}</name>
<preferred_tone>{{ $('contexto_completo').first().json.tom_conversa || 'empatico' }}</preferred_tone>
<about>{{ $('contexto_completo').first().json.sobre_voce ? 'Sobre: ' + $('contexto_completo').first().json.sobre_voce : '' }}</about>
</profile>

<goals>
<has_defined_goals>{{ $('contexto_completo').first().json.tem_objetivos ? 'SIM' : 'NÃO' }}</has_defined_goals>
<active_goals>{{ JSON.stringify($('contexto_completo').first().json.objetivos_especificos || []) }}</active_goals>
</goals>

<mental_profile>
<active_pattern>{{ $('contexto_completo').first().json.sabotador_mais_ativo || 'nenhum identificado' }}</active_pattern>
<behavioral_profile>{{ $('contexto_completo').first().json.perfil_bigfive_primario || 'não identificado' }}</behavioral_profile>
</mental_profile>

<quests>
<active_quest>{{ JSON.stringify($('contexto_completo').first().json.quests_ativas || []) }}</active_quest>
</quests>

<progress>
<level>{{ $('contexto_completo').first().json.nivel_atual }}</level>
<title>{{ $('contexto_completo').first().json.titulo_nivel }}</title>
<total_xp></total_xp>
</progress>

<conversation_history>{{ JSON.stringify($('contexto_completo').first().json.ultimas_conversas || []) }}</conversation_history>
</user_context>


<!-- ============================================ -->
<!-- DIRETRIZES PRIORITÁRIAS (pré-processadas) -->
<!-- ============================================ -->


<diretrizes>
{{ (() => {
  const ctx = $('contexto_completo').first().json;
  const diretrizes = [];
  
  // Prioridade 1: Objetivos
  if (!ctx.tem_objetivos) {
    diretrizes.push('PRIORIDADE: Usuário não tem objetivos definidos. Conduza a conversa para descobrir o que ele quer tirar do papel. Pergunte sobre projetos, metas ou mudanças que ele deseja fazer.');
  }
  
  // Nova sessão: abertura contextual
  if (ctx.is_nova_sessao && ctx.interacao_atual === 1) {
    if (ctx.is_primeira_conversa) {
      diretrizes.push('Primeira conversa: Acolha, apresente-se brevemente como mentor do MindQuest, e foque em conhecer o usuário.');
    } else {
      diretrizes.push('Abertura contextual: Escolha o que for mais relevante - quest pendente, última conversa, ou simplesmente perguntar como ele está.');
    }
  }
  
  // Quests
  const quests = ctx.quests_ativas || [];
  if (quests.length > 0) {
    diretrizes.push('Quests ativas: Pergunte sobre progresso quando fizer sentido. Motive nas concluídas, ajude a destravar nas paradas.');
  }
  
  return diretrizes.join('\n');
})() }}
</diretrizes>

<output_format>
Retorne APENAS este JSON, sem texto adicional, seguindo rigorosamente as intruções do system: {"mensagem_usuario":"sua resposta","tema_atual":{"titulo":"tema","resumo":["ponto 1","ponto 2"],"decisoes":[]},"checkpoint_encerramento":false,"tema_atual_fechado":false,"objetivo_sugerido":null}
</output_format>