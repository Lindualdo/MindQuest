const items = $input.all();


const rows = items.map(item => {
  const json = item.json || {};
  if (json.jsonb_build_object) return json.jsonb_build_object;
  if (json.json_build_object) return json.json_build_object;
  return json;
});



function findRow(predicate) {
  return rows.find(predicate) ?? {};
}

function parseJsonSafe(value, fallback) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('[Code Node] Erro ao parsear JSON:', error);
      return fallback;
    }
  }
  if (value && typeof value === 'object') return value;
  return fallback;
}

function parseNullableNumber(value) {
  if (value === undefined || value === null || value === '' || value === 'null') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeString(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string') return String(value);
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'null') return fallback;
  return trimmed;
}

// Perfil Big Five
const perfilRow = findRow(row => 'openness' in row && 'perfil_primario' in row);
const perfilBigFive = {
  openness: normalizeString(perfilRow.openness),
  conscientiousness: normalizeString(perfilRow.conscientiousness),
  extraversion: normalizeString(perfilRow.extraversion),
  agreeableness: normalizeString(perfilRow.agreeableness),
  neuroticism: normalizeString(perfilRow.neuroticism),
  confiabilidade: normalizeString(perfilRow.confiabilidade),
  perfil_primario: normalizeString(perfilRow.perfil_primario),
  perfil_secundario: normalizeString(perfilRow.perfil_secundario),
};

// Usuário
const userRow = findRow(row => 'nome' in row && ('user_id' in row || 'usuario_id' in row));
const user = {
  id: normalizeString(userRow.user_id ?? userRow.usuario_id ?? perfilRow.usuario_id, 'usuario_desconhecido'),
  nome: normalizeString(userRow.nome, 'Usuário MindQuest'),
  nome_preferencia: normalizeString(userRow.nome_preferencia, 'Usuário'),
  whatsapp_numero: normalizeString(userRow.whatsapp_numero, ''),
  cronotipo_detectado: normalizeString(userRow.cronotipo_detectado, 'matutino'),
  status_onboarding: normalizeString(userRow.status_onboarding, 'pendente'),
  criado_em: normalizeString(userRow.criado_em, new Date().toISOString()),
};

// Gamificação
const gamificacaoRow = findRow(row => 'xp_total' in row && 'nivel_atual' in row);
const gamificacao = {
  xp_total: normalizeString(gamificacaoRow?.xp_total),
  nivel_atual: normalizeString(gamificacaoRow?.nivel_atual),
  streak_conversas_dias: normalizeString(gamificacaoRow?.streak_conversas_dias),
  conquistas_desbloqueadas: normalizeString(gamificacaoRow?.conquistas_desbloqueadas),
  quest_diaria_status: normalizeString(gamificacaoRow?.quest_diaria_status),
  quest_diaria_progresso: normalizeString(gamificacaoRow?.quest_diaria_progresso),
  quest_diaria_descricao: normalizeString(gamificacaoRow?.quest_diaria_descricao),
};

// Sabotador
const sabotadorRow = findRow(row => 'sabotador_id' in row || 'total_deteccoes' in row);
const sabotador = {
  id: normalizeString(sabotadorRow.sabotador_id),
  nome: normalizeString(sabotadorRow.nome),
  emoji: normalizeString(sabotadorRow.emoji),
  apelido_personalizado: normalizeString(sabotadorRow.apelido_personalizado ?? sabotadorRow.apelido),
  total_deteccoes: normalizeString(sabotadorRow.total_deteccoes),
  contexto_principal: normalizeString(sabotadorRow.contexto_principal),
  insight_atual: normalizeString(sabotadorRow.insight_atual),
  contramedida_ativa: normalizeString(sabotadorRow.contramedida_ativa),
  intensidade_media: normalizeString(sabotadorRow.intensidade_media),
  total_conversas: normalizeString(sabotadorRow.total_conversas ?? sabotadorRow.totalConversas),
};

// Humor
const humorRow = findRow(row => Object.prototype.hasOwnProperty.call(row, 'humor_atual'));
const humor = {
  humor_atual: parseNullableNumber(humorRow.humor_atual),
  humor_medio: parseNullableNumber(humorRow.humor_medio_7d ?? humorRow.humor_medio),
  diferenca_percentual: parseNullableNumber(humorRow.diferenca_percentual),
  conversas_total: parseNullableNumber(humorRow.conversas_total) ?? 0,
  ultima_conversa: {
    data: normalizeString(humorRow.ultima_data),
    hora: normalizeString(humorRow.ultima_hora),
    emoji: normalizeString(humorRow.ultima_emoji),
    emocao: normalizeString(humorRow.ultima_emocao),
  }
};

// Emoções
const emocoesRow = findRow(row => 'emocoes_contagem' in row || 'roda_emocoes' in row);
const distribuicaoEmocoes = (() => {
  const source = emocoesRow.emocoes_contagem ?? emocoesRow.roda_emocoes;
  const parsed = parseJsonSafe(source, emocoesRow.roda_emocoes || {});
  const defaults = {
    alegria: 0,
    confianca: 0,
    medo: 0,
    surpresa: 0,
    tristeza: 0,
    angustia: 0,
    raiva: 0,
    expectativa: 0,
  };
  for (const key of Object.keys(defaults)) {
    const valor = parsed?.[key];
    defaults[key] = parseNullableNumber(valor) ?? defaults[key];
  }
  return defaults;
})();

// PANAS
const panasRow = findRow(row => 'positivas' in row && 'negativas' in row);
const panas = {
  positivas: parseNullableNumber(panasRow.positivas) ?? 0,
  negativas: parseNullableNumber(panasRow.negativas) ?? 0,
  neutras: parseNullableNumber(panasRow.neutras) ?? 0,
  total: parseNullableNumber(panasRow.total) ?? 0,
  percentual_positivas: parseNullableNumber(panasRow.percentual_positivas) ?? 0,
  percentual_negativas: parseNullableNumber(panasRow.percentual_negativas) ?? 0,
  percentual_neutras: parseNullableNumber(panasRow.percentual_neutras) ?? 0,
};

// Histórico (novo JSON)
const historicoNodeRow = findRow(row => Object.prototype.hasOwnProperty.call(row, 'historico_diario'));
const historicoDiarioSource = historicoNodeRow.historico_diario ?? [];
const historicoDiario = Array.isArray(historicoDiarioSource)
  ? historicoDiarioSource.map(entry => ({
      data: normalizeString(entry.data),
      label: normalizeString(entry.label),
      tem_conversa: Boolean(entry.tem_conversa),
      conversas: parseNullableNumber(entry.conversas) ?? 0,
      emocao: normalizeString(entry.emocao),
      emocao_id: normalizeString(entry.emocao_id),
      emoji: normalizeString(entry.emoji),
      humor: parseNullableNumber(entry.humor),
      energia: parseNullableNumber(entry.energia),
      qualidade: parseNullableNumber(entry.qualidade),
      ultima_hora: normalizeString(entry.ultima_hora)
    }))
  : [];

const historicoResumo = historicoNodeRow.resumo || {
  total_conversas: 0,
  humor_medio: 0,
  sequencia_ativa: 0,
  ultima_conversa_data: null,
  ultima_conversa_hora: null,
  periodo_inicio: null,
  periodo_fim: null
};

// Insights
const insightsRow = findRow(row => 'insights_lista' in row || 'insights' in row);
const insightsSource = insightsRow.insights_lista ?? insightsRow.insights ?? [];
const insights = parseJsonSafe(insightsSource, []).map(insight => ({
  id: normalizeString(insight.id) ?? undefined,
  tipo: normalizeString(insight.tipo) ?? undefined,
  categoria: normalizeString(insight.categoria) ?? undefined,
  titulo: normalizeString(insight.titulo) ?? undefined,
  descricao: normalizeString(insight.descricao) ?? undefined,
  icone: normalizeString(insight.icone) ?? undefined,
  prioridade: normalizeString(insight.prioridade) ?? undefined,
  data_criacao: normalizeString(insight.data_criacao) ?? undefined,
}));

return [
  {
    json: {
      response: {
        success: true,
        humor,
        user,
        perfil_big_five: perfilBigFive,
        gamificacao,
        sabotador,
        roda_emocoes: distribuicaoEmocoes,
        panas,
        historico_diario: historicoDiario,
        historico_resumo: {
          total_conversas: parseNullableNumber(historicoResumo.total_conversas) ?? 0,
          humor_medio: parseNullableNumber(historicoResumo.humor_medio) ?? 0,
          sequencia_ativa: parseNullableNumber(historicoResumo.sequencia_ativa) ?? 0,
          ultima_conversa_data: normalizeString(historicoResumo.ultima_conversa_data),
          ultima_conversa_hora: normalizeString(historicoResumo.ultima_conversa_hora),
          periodo_inicio: normalizeString(historicoResumo.periodo_inicio),
          periodo_fim: normalizeString(historicoResumo.periodo_fim)
        },
        insights,
        timestamp: new Date().toISOString(),
      },
    },
  },
];
