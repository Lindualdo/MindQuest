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
<mentor_name>{{ $('busca_dados_usr').item.json.nome_assistente }}</mentor_name>
<url_app>https://mindquest.pt/app/auth?token={{ $('busca_dados_usr').item.json.token_acesso }}</>
</profile>

<goals>
<has_defined_goals>{{ $('contexto_completo').first().json.tem_objetivos ? 'SIM' : 'NÃO' }}</has_defined_goals>
<active_goals>{{ JSON.stringify($('contexto_completo').first().json.objetivos_especificos || []) }}</active_goals>
</goals>



<!-- ============================================ -->
<!-- NOTIFICAÇÃO PENDENTE (se houver) -->
<!-- ============================================ -->

{{ $('contexto_completo').first().json.tem_notificacao_recente ? `
<notification_context>
<has_pending_notification>SIM</has_pending_notification>
<notification_type>${$('contexto_completo').first().json.notificacao_recente.tipo || ''}</notification_type>
<notification_title>${$('contexto_completo').first().json.notificacao_recente.titulo || ''}</notification_title>
<notification_message>
${$('contexto_completo').first().json.notificacao_recente.mensagem || ''}
</notification_message>
<mentor_context>${$('contexto_completo').first().json.notificacao_recente.contexto_mentor || ''}</mentor_context>

<instruction>
ANALISE A MENSAGEM DO USUÁRIO:

1. Se for um NÚMERO (1, 2, 3, 4...):
   - O usuário está respondendo à alternativa correspondente na notificação
   - Use o contexto_mentor para conduzir a conversa sobre esse tema
   - NÃO pergunte "sobre o que quer falar", você já sabe!

2. Se for TEXTO relacionado ao tema:
   - O usuário está respondendo sobre a notificação
   - Conduza a conversa naturalmente

3. Se for TEXTO não relacionado:
   - O usuário quer falar de outro assunto
   - Siga o novo tema, não force a notificação
</instruction>
</notification_context>
` : '' }}

<mental_profile>
<active_pattern>{{ $('contexto_completo').first().json.sabotador_mais_ativo || 'nenhum identificado' }}</active_pattern>
<behavioral_profile>{{ $('contexto_completo').first().json.perfil_bigfive_primario || 'não identificado' }}</behavioral_profile>
</mental_profile>

<quests>
<has_quests>{{ $('contexto_completo').first().json.tem_quests ? 'SIM' : 'NÃO' }}</has_quests>
<total_ativas>{{ $('contexto_completo').first().json.quests_ativas_total || 0 }}</total_ativas>
<total_a_planejar>{{ $('contexto_completo').first().json.quests_disponiveis_total || 0 }}</total_a_planejar>
<note>Use quest_tool para detalhes das quests quando necessário</note>
</quests>

<progress>
<level>{{ $('contexto_completo').first().json.nivel_atual }}</level>
<title>{{ $('contexto_completo').first().json.titulo_nivel }}</title>
</progress>

<conversation_history>{{ JSON.stringify($('contexto_completo').first().json.ultimas_conversas || []) }}</conversation_history>
</user_context>


<!-- ============================================ -->
<!-- DIRETRIZES PRIORITÁRIAS -->
<!-- ============================================ -->

<diretrizes>
{{ (() => {
  const ctx = $('contexto_completo').first().json;
  const diretrizes = [];
  
  // Prioridade 1: Objetivos
  if (!ctx.tem_objetivos) {
    diretrizes.push('PRIORIDADE: Usuário não tem objetivos definidos. Conduza a conversa para descobrir o que ele quer tirar do papel.');
  }
  
  // Nova sessão: abertura contextual (só se NÃO tiver notificação)
  if (ctx.is_nova_sessao && ctx.interacao_atual === 1 && !ctx.tem_notificacao_recente) {
    if (ctx.is_primeira_conversa) {
      diretrizes.push('Primeira conversa: Acolha, apresente-se brevemente como mentor do MindQuest, e foque em conhecer o usuário.');
    } else {
      diretrizes.push('Abertura contextual: Escolha o que for mais relevante - quest pendente, última conversa, ou simplesmente perguntar como ele está.');
    }
  }
  
  return diretrizes.join('\n');
})() }}
</diretrizes>

<output_format>
{"mensagem_usuario": "Oi! Como você está hoje?"}
</output_format>