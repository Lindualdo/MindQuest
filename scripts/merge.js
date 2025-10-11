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

function parseNullableBoolean(value) {
  if (value === undefined || value === null || value === '' || value === 'null') return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return null;
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
const gamificacaoRow = findRow(row => {
  if (!row || typeof row !== 'object') return false;
  if ('gamificacao' in row && row.gamificacao) return true;
  return ('xp_total' in row && 'nivel_atual' in row);
});
const gamificacaoSource = gamificacaoRow?.gamificacao ?? gamificacaoRow ?? {};

const gamificacao = {
  xp_total: parseNullableNumber(gamificacaoSource?.xp_total) ?? 0,
  xp_proximo_nivel: parseNullableNumber(gamificacaoSource?.xp_proximo_nivel) ?? 400,
  nivel_atual: parseNullableNumber(gamificacaoSource?.nivel_atual) ?? 1,
  titulo_nivel: normalizeString(gamificacaoSource?.titulo_nivel, 'Nível 1'),
  streak_conversas_dias: parseNullableNumber(gamificacaoSource?.streak_conversas_dias) ?? 0,
  streak_protecao_usada: parseNullableBoolean(gamificacaoSource?.streak_protecao_usada) ?? false,
  streak_protecao_resetada_em: normalizeString(gamificacaoSource?.streak_protecao_resetada_em),
  ultima_conversa_data: normalizeString(gamificacaoSource?.ultima_conversa_data),
  melhor_streak: parseNullableNumber(gamificacaoSource?.melhor_streak) ?? 0,
  quest_diaria_status: normalizeString(gamificacaoSource?.quest_diaria_status, 'pendente'),
  quest_diaria_progresso: parseNullableNumber(gamificacaoSource?.quest_diaria_progresso) ?? 0,
  quest_diaria_descricao: normalizeString(gamificacaoSource?.quest_diaria_descricao, 'Complete sua conversa diária'),
  quest_diaria_data: normalizeString(gamificacaoSource?.quest_diaria_data),
  quest_streak_dias: parseNullableNumber(gamificacaoSource?.quest_streak_dias) ?? 0,
  conquistas_desbloqueadas: (() => {
    const conquistas = gamificacaoSource?.conquistas_desbloqueadas;
    if (Array.isArray(conquistas)) return conquistas;
    const parsed = parseJsonSafe(conquistas, null);
    if (Array.isArray(parsed)) return parsed;
    return [];
  })(),
  total_conversas: parseNullableNumber(gamificacaoSource?.total_conversas) ?? 0,
  total_reflexoes: parseNullableNumber(gamificacaoSource?.total_reflexoes) ?? 0,
  total_xp_ganho_hoje: parseNullableNumber(gamificacaoSource?.total_xp_ganho_hoje) ?? 0,
  ultima_conquista_id: normalizeString(gamificacaoSource?.ultima_conquista_id),
  ultima_conquista_data: normalizeString(gamificacaoSource?.ultima_conquista_data),
  ultima_atualizacao: normalizeString(gamificacaoSource?.ultima_atualizacao ?? gamificacaoSource?.atualizado_em),
  criado_em: normalizeString(gamificacaoSource?.criado_em),
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

// Histórico
const historicoAggregateRow = rows.find(
  (row) =>
    row &&
    typeof row === 'object' &&
    row.jsonb_build_object &&
    typeof row.jsonb_build_object === 'object' &&
    row.jsonb_build_object.historico_diario
);

const historicoRawRows = rows.filter(
  (row) =>
    row &&
    typeof row === 'object' &&
    'data' in row &&
    (
      'humor_medio' in row ||
      'energia_media' in row ||
      'justificativa_humor' in row ||
      'chat_id' in row
    )
);

const toDateKey = (value) => {
  const raw = normalizeString(value);
  if (!raw) return null;
  if (raw.includes('T')) return raw.slice(0, 10);
  return raw;
};

const toLabel = (dateKey) => {
  if (!dateKey) return null;
  const parts = dateKey.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}`;
  }
  try {
    const parsed = new Date(dateKey);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  } catch (_) {
    // ignore
  }
  return dateKey;
};

const parseHora = (value) => {
  const time = normalizeString(value);
  if (!time) return null;
  return time.length > 8 ? time.slice(0, 8) : time;
};

const createHistoricoEntry = (dateKey) => ({
  data: dateKey,
  label: toLabel(dateKey),
  tem_conversa: false,
  conversas: 0,
  emoji: null,
  humor: null,
  ultima_hora: null,
  _humorSum: 0,
  _humorWeight: 0,
});

const historicoDataMap = new Map();

const getOrCreateHistoricoEntry = (dateKey) => {
  if (!historicoDataMap.has(dateKey)) {
    historicoDataMap.set(dateKey, createHistoricoEntry(dateKey));
  }
  return historicoDataMap.get(dateKey);
};

const updateUltimaHora = (entry, hora) => {
  if (!hora) return;
  if (!entry.ultima_hora || entry.ultima_hora < hora) {
    entry.ultima_hora = hora;
  }
};

let historicoResumo = {
  total_conversas: 0,
  humor_medio: 0,
  sequencia_ativa: 0,
  ultima_conversa_data: null,
  ultima_conversa_hora: null,
  periodo_inicio: null,
  periodo_fim: null
};

if (historicoAggregateRow?.jsonb_build_object?.historico_diario) {
  for (const item of historicoAggregateRow.jsonb_build_object.historico_diario) {
    const dateKey = toDateKey(item.data);
    if (!dateKey) continue;
    const entry = getOrCreateHistoricoEntry(dateKey);
    entry.label = normalizeString(item.label) ?? entry.label;

    const conversasParsed = parseNullableNumber(item.conversas);
    if (Number.isFinite(conversasParsed) && conversasParsed > 0) {
      entry.conversas = conversasParsed;
      entry.tem_conversa = true;
    } else if (typeof item.tem_conversa === 'boolean') {
      entry.tem_conversa = item.tem_conversa;
    }

    const emoji = normalizeString(item.emoji);
    if (emoji) entry.emoji = emoji;

    const humorValue = parseNullableNumber(item.humor);
    if (Number.isFinite(humorValue)) {
      entry.humor = humorValue;
      entry._humorSum = humorValue;
      entry._humorWeight = 1;
    }

    updateUltimaHora(entry, parseHora(item.ultima_hora));
  }

  if (historicoAggregateRow.jsonb_build_object.resumo) {
    const resumoDb = historicoAggregateRow.jsonb_build_object.resumo;
    historicoResumo = {
      total_conversas: parseNullableNumber(resumoDb.total_conversas) ?? 0,
      humor_medio: parseNullableNumber(resumoDb.humor_medio) ?? 0,
      sequencia_ativa: parseNullableNumber(resumoDb.sequencia_ativa) ?? 0,
      ultima_conversa_data: normalizeString(resumoDb.ultima_conversa_data),
      ultima_conversa_hora: normalizeString(resumoDb.ultima_conversa_hora),
      periodo_inicio: normalizeString(resumoDb.periodo_inicio),
      periodo_fim: normalizeString(resumoDb.periodo_fim)
    };
  }
} else if (historicoRawRows.length > 0) {
  for (const row of historicoRawRows) {
    const dateKey = toDateKey(row.data);
    if (!dateKey) continue;

    const entry = getOrCreateHistoricoEntry(dateKey);

    const explicitConversas = parseNullableNumber(row.conversas ?? row.total_conversas ?? row.qtd_conversas);
    const statusNormalized = normalizeString(row.status)?.toLowerCase();
    const hasChat = Boolean(normalizeString(row.chat_id));
    let conversas = Number.isFinite(explicitConversas) && explicitConversas > 0 ? explicitConversas : 0;
    if (conversas === 0 && (hasChat || statusNormalized === 'completa')) {
      conversas = 1;
    }

    entry.conversas += conversas;
    if (entry.conversas > 0 || conversas > 0) {
      entry.tem_conversa = true;
    }

    const humorValue = parseNullableNumber(row.humor_medio);
    if (Number.isFinite(humorValue)) {
      const weight = conversas > 0 ? conversas : 1;
      entry._humorSum += humorValue * weight;
      entry._humorWeight += weight;
    }

    const emoji = normalizeString(row.emoji);
    if (emoji) entry.emoji = emoji;

    updateUltimaHora(entry, parseHora(row.horario_fim ?? row.horario_inicio ?? row.ultima_hora));
  }
}

for (const entry of historicoDataMap.values()) {
  if (entry._humorWeight > 0) {
    entry.humor = entry._humorSum / entry._humorWeight;
  }
  if (!Number.isFinite(entry.humor)) {
    entry.humor = null;
  }
  delete entry._humorSum;
  delete entry._humorWeight;
}

const shiftDate = (dateKey, offset) => {
  const key = toDateKey(dateKey);
  if (!key) return null;
  const base = new Date(`${key}T00:00:00Z`);
  if (Number.isNaN(base.getTime())) return null;
  base.setUTCDate(base.getUTCDate() + offset);
  return base.toISOString().slice(0, 10);
};

const sortedKeys = Array.from(historicoDataMap.keys()).sort((a, b) => {
  const timeA = a ? new Date(a).getTime() : 0;
  const timeB = b ? new Date(b).getTime() : 0;
  return timeA - timeB;
});

let lastDateKey = toDateKey(historicoResumo.periodo_fim) ?? sortedKeys[sortedKeys.length - 1];
if (!lastDateKey) {
  lastDateKey = new Date().toISOString().slice(0, 10);
}

const windowSize = 7;
const windowRawEntries = [];
for (let offset = windowSize - 1; offset >= 0; offset -= 1) {
  const dateKey = shiftDate(lastDateKey, -offset);
  if (!dateKey) continue;
  const sourceEntry = historicoDataMap.get(dateKey);
  const conversasCount = Number.isFinite(sourceEntry?.conversas)
    ? Number(sourceEntry.conversas)
    : (sourceEntry?.tem_conversa ? 1 : 0);
  const temConversa = Boolean(sourceEntry?.tem_conversa) || conversasCount > 0;

  windowRawEntries.push({
    data: dateKey,
    label: toLabel(dateKey),
    tem_conversa: temConversa,
    conversas: conversasCount,
    emoji: normalizeString(sourceEntry?.emoji),
    humor: Number.isFinite(sourceEntry?.humor) ? sourceEntry.humor : null,
    ultima_hora: normalizeString(sourceEntry?.ultima_hora)
  });
}

const diasComConversas = windowRawEntries.filter((entry) => entry.conversas > 0 || entry.tem_conversa).length;

let ultimaConversaData = historicoResumo.ultima_conversa_data;
let ultimaConversaHora = historicoResumo.ultima_conversa_hora;
for (let i = windowRawEntries.length - 1; i >= 0; i -= 1) {
  const entry = windowRawEntries[i];
  if (!entry.tem_conversa) continue;
  ultimaConversaData = entry.data;
  if (entry.ultima_hora) {
    ultimaConversaHora = entry.ultima_hora;
  }
  break;
}

let sequenciaAtiva = 0;
for (let i = windowRawEntries.length - 1; i >= 0; i -= 1) {
  const entry = windowRawEntries[i];
  if (!entry.tem_conversa) break;
  sequenciaAtiva += 1;
}

const periodoInicio = windowRawEntries[0]?.data ?? historicoResumo.periodo_inicio ?? null;
const periodoFim = windowRawEntries[windowRawEntries.length - 1]?.data ?? historicoResumo.periodo_fim ?? null;

const humorMedioGlobal = parseNullableNumber(humor.humor_medio);
historicoResumo = {
  total_conversas: diasComConversas,
  humor_medio: humorMedioGlobal ?? historicoResumo.humor_medio ?? 0,
  sequencia_ativa: sequenciaAtiva,
  ultima_conversa_data: ultimaConversaData ?? null,
  ultima_conversa_hora: ultimaConversaHora ?? null,
  periodo_inicio: periodoInicio,
  periodo_fim: periodoFim
};

const historicoDiario = windowRawEntries.map((entry) => ({
  data: entry.data,
  label: entry.label,
  tem_conversa: entry.tem_conversa,
  conversas: Number.isFinite(entry.conversas) ? entry.conversas : 0,
  emoji: entry.emoji ?? null,
  humor: entry.tem_conversa && Number.isFinite(entry.humor) ? entry.humor : null,
  ultima_hora: entry.ultima_hora ?? null
}));


// Insights - AJUSTE CORRETO
const insightsRows = rows.filter(row => 
  row && typeof row === 'object' && (
    'id' in row && 
    'tipo' in row && 
    'categoria' in row && 
    'titulo' in row
  )
);

const insights = insightsRows.length > 0 
? insightsRows.map(insight => ({
    id: normalizeString(insight.id) ?? undefined,
    tipo: normalizeString(insight.tipo) ?? undefined,
    categoria: normalizeString(insight.categoria) ?? undefined,
    titulo: normalizeString(insight.titulo) ?? undefined,
    descricao: normalizeString(insight.descricao) ?? undefined,
    icone: normalizeString(insight.icone) ?? undefined,
    prioridade: normalizeString(insight.prioridade) ?? undefined,
    data_criacao: normalizeString(insight.data_criacao) ?? undefined,
  }))
: [];

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
