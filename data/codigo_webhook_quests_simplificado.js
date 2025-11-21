// Código JavaScript simplificado para o node "Montar Resposta"
// Este arquivo contém o código completo para ser aplicado no n8n

const getItem = (nodeName) => {
  const list = $items(nodeName, 0, 0) || [];
  return list[0]?.json || {};
};

const getItems = (nodeName) => {
  try {
    const list = $items(nodeName, 0, 0) || [];
    return list.map((entry) => entry?.json || {});
  } catch (err) {
    return [];
  }
};

const toNumber = (value, fallback = null) => {
  if (value === null || value === undefined || value === '') return fallback;
  const coerced = Number(value);
  return Number.isFinite(coerced) ? coerced : fallback;
};

const parseJson = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch (_err) {
    return null;
  }
};

function humanizeDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const days = Math.floor(diffMs / 86_400_000);
  const hours = Math.floor((diffMs % 86_400_000) / 3_600_000);
  const parts = [];
  if (days > 0) parts.push(`${days} dia${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} h`);
  if (parts.length === 0) return 'agora';
  return `há ${parts.join(' e ')}`;
}

function extractXpRecompensa(quest) {
  const config = parseJson(quest.config) || {};
  const recorrencias = parseJson(quest.recorrencias) || null;
  
  if (recorrencias && Array.isArray(recorrencias.dias) && recorrencias.dias.length > 0) {
    const xpPrevisto = toNumber(recorrencias.dias[0]?.xp_previsto, null);
    if (xpPrevisto !== null) return xpPrevisto;
  }
  
  const xpQuestField = toNumber(quest.xp_recompensa, null);
  if (xpQuestField !== null) return xpQuestField;
  
  const xpConfigField = toNumber(config?.xp_recompensa, null);
  if (xpConfigField !== null) return xpConfigField;
  
  return null;
}

function normalizarData(data) {
  if (!data) return null;
  const str = String(data);
  const normalized = str.split('T')[0].split(' ')[0];
  if (normalized.length >= 10) {
    return normalized.substring(0, 10);
  }
  return null;
}

// Função simplificada para enriquecer recorrencias com status de conclusão
function enriquecerRecorrencias(recorrencias, datasConcluidas) {
  if (!recorrencias || !Array.isArray(recorrencias.dias)) {
    return recorrencias;
  }
  
  // Garantir que datasConcluidas é array
  const datas = Array.isArray(datasConcluidas) ? datasConcluidas : [];
  
  // Enriquecer cada dia com status
  const diasEnriquecidos = recorrencias.dias.map((dia) => {
    const dataDia = normalizarData(dia.data);
    
    if (!dataDia) {
      return {
        ...dia,
        status: 'pendente'
      };
    }
    
    // Verificar se esta data está nas datas concluídas (comparação direta)
    const estaConcluida = datas.includes(dataDia);
    
    return {
      ...dia,
      status: estaConcluida ? 'concluida' : 'pendente'
    };
  });
  
  return {
    ...recorrencias,
    dias: diasEnriquecidos
  };
}

const estado = getItem('Ler Usuarios Conquistas');
const questsRaw = getItems('Listar Usuarios Quest');

// Encontrar a primeira quest ativa ou pendente
const questAtiva = questsRaw
  .filter((q) => q.status === 'ativa' || q.status === 'pendente')
  .sort((a, b) => {
    if (a.status === 'ativa' && b.status !== 'ativa') return -1;
    if (a.status !== 'ativa' && b.status === 'ativa') return 1;
    const dateA = a.atualizado_em ? new Date(a.atualizado_em).getTime() : 0;
    const dateB = b.atualizado_em ? new Date(b.atualizado_em).getTime() : 0;
    return dateB - dateA;
  })[0] || null;

// Formatar quest
let quest = null;
if (questAtiva) {
  const config = parseJson(questAtiva.config) || {};
  const meta = Math.max(toNumber(questAtiva.progresso_meta, 1) || 1, 1);
  const atual = Math.min(toNumber(questAtiva.progresso_atual, 0) || 0, meta);
  const percentual = meta > 0 ? Math.round((atual / meta) * 100) : 0;
  
  const xpRecompensa = extractXpRecompensa(questAtiva);
  
  quest = {
    id: questAtiva.instancia_id || questAtiva.meta_codigo || null,
    titulo: questAtiva.titulo || config?.titulo || 'Quest personalizada',
    descricao: questAtiva.descricao || config?.descricao || null,
    status: questAtiva.status || 'pendente',
    prioridade: questAtiva.prioridade || config?.prioridade || null,
    recorrencia: questAtiva.recorrencia || config?.recorrencia || null,
    progresso: {
      atual,
      meta,
      percentual,
      label: `${atual}/${meta}`,
    },
    xp_recompensa: xpRecompensa,
    ultima_atualizacao: questAtiva.atualizado_em || null,
    ultima_atualizacao_label: humanizeDate(questAtiva.atualizado_em),
  };
}

// Calcular snapshot
const totalPersonalizadas = questsRaw.length;
const totalConcluidas = questsRaw.filter((q) => q.status === 'concluida' || q.concluido_em).length;

let xpBaseTotal = 0;
let xpBonusTotal = 0;
questsRaw.forEach((q) => {
  if (q.status === 'concluida' || q.concluido_em) {
    const xpConcedido = toNumber(q.xp_concedido, 0) || 0;
    xpBaseTotal += xpConcedido;
  }
});

const xpBase = 30;
const xpBonusRecorrencia = 0;

const beneficios = [];
beneficios.push(`+${xpBase} XP base`);
if (xpBonusRecorrencia > 0) beneficios.push(`+${xpBonusRecorrencia} XP bônus (recorrência)`);
beneficios.push('Novo insight aplicado na prática');
beneficios.push('Progresso em hábitos chaves');

// Formatar todas as quests para o formato QuestSnapshot
const questsPersonalizadas = questsRaw.map((q) => {
  const xpRecompensa = extractXpRecompensa(q);
  const config = parseJson(q.config) || {};
  const recorrencias = parseJson(q.recorrencias) || null;
  
  // Enriquecer recorrencias com status de conclusão (datas_concluidas vem junto com a quest)
  const datasConcluidas = q.datas_concluidas || [];
  const recorrenciasEnriquecidas = enriquecerRecorrencias(recorrencias, datasConcluidas);
  
  return {
    instancia_id: q.instancia_id || q.meta_codigo || null,
    meta_codigo: q.meta_codigo || q.instancia_id || null,
    titulo: q.titulo || config?.titulo || 'Quest personalizada',
    descricao: q.descricao || config?.descricao || null,
    status: q.status || 'pendente',
    concluido_em: q.concluido_em || null,
    progresso_meta: toNumber(q.progresso_meta, 1) || 1,
    progresso_atual: toNumber(q.progresso_atual, 0) || 0,
    xp_recompensa: xpRecompensa,
    prioridade: q.prioridade || config?.prioridade || null,
    recorrencia: q.recorrencia || config?.recorrencia || null,
    recorrencias: recorrenciasEnriquecidas,
    atualizado_em: q.atualizado_em || null,
  };
});

const usuarioId = estado.usuario_id || $json.usuario_id || null;

const response = {
  success: true,
  usuario_id: usuarioId,
  xp_total: toNumber(estado.xp_total, 0) || 0,
  xp_proximo_nivel: toNumber(estado.xp_proximo_nivel, null),
  nivel_atual: toNumber(estado.nivel_atual, 1) || 1,
  titulo_nivel: estado.titulo_nivel || null,
  sequencia_atual: toNumber(estado.sequencia_atual, 0) || 0,
  sequencia_recorde: toNumber(estado.sequencia_recorde, 0) || 0,
  meta_sequencia_codigo: estado.meta_sequencia_codigo || null,
  proxima_meta_codigo: estado.proxima_meta_codigo || null,
  sequencia_status: estado.sequencia_status || null,
  quests_personalizadas: questsPersonalizadas,
  card_quests: {
    quest,
    snapshot: {
      total_concluidas: totalConcluidas,
      total_personalizadas: totalPersonalizadas,
      xp_base_total: xpBaseTotal,
      xp_bonus_total: xpBonusTotal,
    },
    beneficios,
    recompensas: {
      xp_base: xpBase,
      xp_bonus_recorrencia: xpBonusRecorrencia,
    },
  },
};

return [{ json: response }];

