/**
 * ARQUIVO: src/utils/dataAdapter.ts
 * VERSÃO CORRIGIDA - Processa todos os dados da API corretamente
 */

import type { 
  DashboardData, 
  PerfilDetectado, 
  CheckinDiario, 
  PlutchikEmotion, 
  DistribuicaoPanas, 
  Gamificacao, 
  SabotadorPadrao, 
  Insight
} from '../types/emotions';

interface ApiData {
  success?: boolean;
  user: {
    id: string;
    nome: string;
    nome_preferencia: string;
    whatsapp_numero: string;
    cronotipo_detectado: string | null;
    status_onboarding: string;
    criado_em: string;
  };
  perfil_big_five: {
    openness: string | null;
    conscientiousness: string | null;
    extraversion: string | null;
    agreeableness: string | null;
    neuroticism: string | null;
    confiabilidade: string | null;
    perfil_primario: string | null;
    perfil_secundario: string | null;
  };
  gamificacao: {
    xp_total: string | null;
    nivel_atual: string | null;
    streak_conversas_dias: string | null;
    conquistas_desbloqueadas: string | null;
    quest_diaria_status: string | null;
    quest_diaria_progresso: string | null;
    quest_diaria_descricao: string | null;
  };
  sabotador: {
    id: string | null;
    nome: string | null;
    emoji: string | null;
    apelido_personalizado: string | null;
    total_deteccoes: string | null;
    contexto_principal: string | null;
    insight_atual: string | null;
    contramedida_ativa: string | null;
    intensidade_media: string | null;
    total_conversas: string | null;
  };
  metricas_semana: {
    conversas_total: string;
    conversas_completas: string;
    humor_medio: string | null;
    energia_media: string | null;
    qualidade_media_interacao: string | null;
    ultima_emocao: string | null;
    ultima_conversa_data: string | null;
    ultimo_conversa_emoji: string | null;
  };
  distribuicao_emocoes: {
    alegria: number;
    confianca: number;
    medo: number;
    surpresa: number;
    tristeza: number;
    nojo: number;
    raiva: number;
    expectativa: number;
  };
  panas: {
    positivas: number;
    negativas: number;
    neutras: number;
    total: number;
    percentual_positivas: number;
    percentual_negativas: number;
    percentual_neutras: number;
  };
  historico_diario: Array<{
    data: string;
    humor: number;
    emocao: string;
    emoji: string;
    energia: number;
    qualidade: number;
  }>;
  insights: Array<{
    id: string;
    tipo: string;
    categoria: string;
    titulo: string;
    descricao: string;
    icone: string;
    prioridade: string;
    data_criacao: string;
  }>;
  timestamp: string;
}

type ApiPayload = ApiData | { response?: unknown } | { data?: unknown } | Array<unknown> | Record<string, unknown> | null | undefined;

class DataAdapter {
  private parseNullString<T>(value: string | null | undefined): T | null {
    if (value === null || value === undefined || value === 'null' || value === '') {
      return null;
    }
    return value as unknown as T;
  }

  private parseNumber(value: string | number | null | undefined): number | null {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    const parsed = this.parseNullString<string>(value as string | null | undefined);
    if (parsed === null) return null;

    const normalized = parsed.replace(/%/g, '').replace(/,/g, '.');
    const match = normalized.match(/-?\d+(?:\.\d+)?/);
    if (!match) {
      return null;
    }

    const num = Number(match[0]);
    return Number.isFinite(num) ? num : null;
  }

  private parsePercentage(value: string | number | null | undefined, fallbackNumerator?: string | number | null | undefined, fallbackDenominator?: string | number | null | undefined): number {
    const parsed = this.parseNumber(value);
    if (parsed !== null) {
      return parsed;
    }

    if (fallbackNumerator !== undefined && fallbackDenominator !== undefined) {
      const numerator = this.parseNumber(fallbackNumerator);
      const denominator = this.parseNumber(fallbackDenominator);
      if (numerator !== null && denominator !== null && denominator > 0) {
        return (numerator / denominator) * 100;
      }
    }

    return 0;
  }

  private getDefaultApiData(): ApiData {
    const today = new Date().toISOString();
    return {
      success: false,
      user: {
        id: 'usuario_desconhecido',
        nome: 'Usuário MindQuest',
        nome_preferencia: 'Usuário',
        whatsapp_numero: '',
        cronotipo_detectado: 'matutino',
        status_onboarding: 'pendente',
        criado_em: today
      },
      perfil_big_five: {
        openness: null,
        conscientiousness: null,
        extraversion: null,
        agreeableness: null,
        neuroticism: null,
        confiabilidade: null,
        perfil_primario: null,
        perfil_secundario: null
      },
      gamificacao: {
        xp_total: null,
        nivel_atual: null,
        streak_conversas_dias: null,
        conquistas_desbloqueadas: null,
        quest_diaria_status: null,
        quest_diaria_progresso: null,
        quest_diaria_descricao: null
      },
      sabotador: {
        id: null,
        nome: null,
        emoji: null,
        apelido_personalizado: null,
        total_deteccoes: null,
        contexto_principal: null,
        insight_atual: null,
        contramedida_ativa: null,
        intensidade_media: null,
        total_conversas: null
      },
      metricas_semana: {
        conversas_total: '0',
        conversas_completas: '0',
        humor_medio: null,
        energia_media: null,
        qualidade_media_interacao: null,
        ultima_emocao: null,
        ultima_conversa_data: null,
        ultimo_conversa_emoji: null
      },
      distribuicao_emocoes: {
        alegria: 0,
        confianca: 0,
        medo: 0,
        surpresa: 0,
        tristeza: 0,
        nojo: 0,
        raiva: 0,
        expectativa: 0
      },
      panas: {
        positivas: 0,
        negativas: 0,
        neutras: 0,
        total: 0,
        percentual_positivas: 0,
        percentual_negativas: 0,
        percentual_neutras: 0
      },
      historico_diario: [],
      insights: [],
      timestamp: today
    };
  }

  private looksLikeApiData(payload: unknown): payload is ApiData {
    if (!payload || typeof payload !== 'object') return false;
    const obj = payload as Record<string, unknown>;
    if (!obj.user || typeof obj.user !== 'object') return false;
    const user = obj.user as Record<string, unknown>;
    return typeof user.id === 'string';
  }

  private unwrapApiPayload(payload: ApiPayload): Partial<ApiData> | null {
    if (payload === null || payload === undefined) {
      return null;
    }

    if (Array.isArray(payload)) {
      for (const item of payload) {
        const unwrapped = this.unwrapApiPayload(item as ApiPayload);
        if (unwrapped) {
          return unwrapped;
        }
      }
      return null;
    }

    if (this.looksLikeApiData(payload)) {
      return payload;
    }

    if (typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;

      if (obj.response !== undefined) {
        const response = this.unwrapApiPayload(obj.response as ApiPayload);
        if (response) return response;
      }

      if (obj.data !== undefined) {
        const data = this.unwrapApiPayload(obj.data as ApiPayload);
        if (data) return data;
      }

      // Alguns endpoints podem retornar dentro de "payload" ou "result"
      if (obj.payload !== undefined) {
        const nested = this.unwrapApiPayload(obj.payload as ApiPayload);
        if (nested) return nested;
      }

      if (obj.result !== undefined) {
        const nestedResult = this.unwrapApiPayload(obj.result as ApiPayload);
        if (nestedResult) return nestedResult;
      }
    }

    return null;
  }

  private mergeWithDefaults(data: Partial<ApiData> | null): ApiData {
    const defaults = this.getDefaultApiData();
    const safeData = data ?? {};

    const historico = Array.isArray(safeData.historico_diario) ? safeData.historico_diario : [];
    const historicoDefaults = {
      data: defaults.timestamp.split('T')[0],
      humor: 5,
      emocao: 'neutro',
      emoji: '😐',
      energia: 5,
      qualidade: 5
    };

    const insights = Array.isArray(safeData.insights) ? safeData.insights : [];

    return {
      success: 'success' in safeData ? safeData.success : defaults.success,
      user: {
        ...defaults.user,
        ...(safeData.user || {})
      },
      perfil_big_five: {
        ...defaults.perfil_big_five,
        ...(safeData.perfil_big_five || {})
      },
      gamificacao: {
        ...defaults.gamificacao,
        ...(safeData.gamificacao || {})
      },
      sabotador: {
        ...defaults.sabotador,
        ...(safeData.sabotador || {})
      },
      metricas_semana: {
        ...defaults.metricas_semana,
        ...(safeData.metricas_semana || {})
      },
      distribuicao_emocoes: {
        ...defaults.distribuicao_emocoes,
        ...(safeData.distribuicao_emocoes || {})
      },
      panas: {
        ...defaults.panas,
        ...(safeData.panas || {})
      },
      historico_diario: historico.map((item) => ({
        data: item?.data || historicoDefaults.data,
        humor: typeof item?.humor === 'number' ? item.humor : Number(item?.humor) || historicoDefaults.humor,
        emocao: item?.emocao || historicoDefaults.emocao,
        emoji: item?.emoji || historicoDefaults.emoji,
        energia: typeof item?.energia === 'number' ? item.energia : Number(item?.energia) || historicoDefaults.energia,
        qualidade: typeof item?.qualidade === 'number' ? item.qualidade : Number(item?.qualidade) || historicoDefaults.qualidade
      })),
      insights: insights.map((insight) => ({
        id: insight?.id || `insight_${Math.random().toString(36).slice(2, 8)}`,
        tipo: (insight?.tipo as Insight['tipo']) || 'padrao',
        categoria: (insight?.categoria as Insight['categoria']) || 'emocional',
        titulo: insight?.titulo || 'Insight em processamento',
        descricao: insight?.descricao || 'Estamos analisando seus dados para gerar um insight personalizado.',
        icone: insight?.icone || '💡',
        prioridade: (insight?.prioridade as Insight['prioridade']) || 'media',
        data_criacao: insight?.data_criacao || defaults.timestamp
      })),
      timestamp: safeData.timestamp || defaults.timestamp
    };
  }

  private normalizeApiPayload(payload: ApiPayload): ApiData {
    const unwrapped = this.unwrapApiPayload(payload);
    if (!unwrapped) {
      console.warn('[DataAdapter] Payload inesperado recebido, usando dados padrão.');
    }
    return this.mergeWithDefaults(unwrapped);
  }

  private generatePerfilDetectado(apiData: ApiData): PerfilDetectado {
    const bigFive = apiData.perfil_big_five;
    const perfilPrimario = this.parseNullString<string>(bigFive.perfil_primario);
    const perfilSecundario = this.parseNullString<string>(bigFive.perfil_secundario);
    const confiabilidade = this.parseNumber(bigFive.confiabilidade);
    
    const mapearPerfilPrimario = (perfil: string | null) => {
      if (!perfil) return 'descobrindo';
      switch (perfil.toLowerCase()) {
        case 'perfeccionista': return 'perfeccionista';
        case 'disciplinado': return 'disciplinado';
        case 'desorganizado': return 'desorganizado';
        case 'depressivo': return 'depressivo';
        default: return 'descobrindo';
      }
    };

    const mapearPerfilSecundario = (perfil: string | null) => {
      if (!perfil) return undefined;
      switch (perfil.toLowerCase()) {
        case 'perfeccionista': return 'perfeccionista';
        case 'disciplinado': return 'disciplinado';
        case 'desorganizado': return 'desorganizado';
        case 'depressivo': return 'depressivo';
        default: return undefined;
      }
    };

    return {
      perfil_primario: mapearPerfilPrimario(perfilPrimario),
      perfil_secundario: mapearPerfilSecundario(perfilSecundario),
      confiabilidade_geral: confiabilidade ?? 0,
      metodo_deteccao: perfilPrimario ? 'onboarding' : 'checkin',
      big_five_scores: {
        openness: this.parseNumber(bigFive.openness) || 0,
        conscientiousness: this.parseNumber(bigFive.conscientiousness) || 0,
        extraversion: this.parseNumber(bigFive.extraversion) || 0,
        agreeableness: this.parseNumber(bigFive.agreeableness) || 0,
        neuroticism: this.parseNumber(bigFive.neuroticism) || 0,
        confiabilidade: confiabilidade ?? 0
      }
    };
  }

  private processDistribuicaoEmocoes(data: ApiData): PlutchikEmotion[] {
    const emocoes = data.distribuicao_emocoes || this.getDefaultApiData().distribuicao_emocoes;
    const total = Object.values(emocoes).reduce((sum, val) => sum + (val || 0), 0);
    
    if (total === 0) {
      return [
        { id: 'joy', nome: 'Alegria', intensidade: 0, cor: '#FFD700', emoji: '😊', categoria: 'primaria' },
        { id: 'trust', nome: 'Confiança', intensidade: 0, cor: '#90EE90', emoji: '🤗', categoria: 'primaria' },
        { id: 'fear', nome: 'Medo', intensidade: 0, cor: '#FF6347', emoji: '😨', categoria: 'primaria' },
        { id: 'surprise', nome: 'Surpresa', intensidade: 0, cor: '#FF69B4', emoji: '😲', categoria: 'primaria' },
        { id: 'sadness', nome: 'Tristeza', intensidade: 0, cor: '#4169E1', emoji: '😢', categoria: 'primaria' },
        { id: 'disgust', nome: 'Nojo', intensidade: 0, cor: '#8B4513', emoji: '🤢', categoria: 'primaria' },
        { id: 'anger', nome: 'Raiva', intensidade: 0, cor: '#DC143C', emoji: '😠', categoria: 'primaria' },
        { id: 'anticipation', nome: 'Expectativa', intensidade: 0, cor: '#FFA500', emoji: '🤔', categoria: 'primaria' }
      ];
    }
    
    return [
      { id: 'joy', nome: 'Alegria', intensidade: Math.round((emocoes.alegria / total) * 100), cor: '#FFD700', emoji: '😊', categoria: 'primaria' },
      { id: 'trust', nome: 'Confiança', intensidade: Math.round((emocoes.confianca / total) * 100), cor: '#90EE90', emoji: '🤗', categoria: 'primaria' },
      { id: 'fear', nome: 'Medo', intensidade: Math.round((emocoes.medo / total) * 100), cor: '#FF6347', emoji: '😨', categoria: 'primaria' },
      { id: 'surprise', nome: 'Surpresa', intensidade: Math.round((emocoes.surpresa / total) * 100), cor: '#FF69B4', emoji: '😲', categoria: 'primaria' },
      { id: 'sadness', nome: 'Tristeza', intensidade: Math.round((emocoes.tristeza / total) * 100), cor: '#4169E1', emoji: '😢', categoria: 'primaria' },
      { id: 'disgust', nome: 'Nojo', intensidade: Math.round((emocoes.nojo / total) * 100), cor: '#8B4513', emoji: '🤢', categoria: 'primaria' },
      { id: 'anger', nome: 'Raiva', intensidade: Math.round((emocoes.raiva / total) * 100), cor: '#DC143C', emoji: '😠', categoria: 'primaria' },
      { id: 'anticipation', nome: 'Expectativa', intensidade: Math.round((emocoes.expectativa / total) * 100), cor: '#FFA500', emoji: '🤔', categoria: 'primaria' }
    ];
  }

  private processPanas(data: ApiData): DistribuicaoPanas {
    const panas = data.panas || this.getDefaultApiData().panas;

    const positivasPerc = this.parsePercentage(
      panas.percentual_positivas,
      panas.positivas,
      panas.total
    );

    const negativasPerc = this.parsePercentage(
      panas.percentual_negativas,
      panas.negativas,
      panas.total
    );

    const neutrasPerc = this.parsePercentage(
      panas.percentual_neutras,
      panas.neutras,
      panas.total
    );

    const metaPositividade = 70;
    const toSafePercent = (value: number) => {
      if (!Number.isFinite(value)) {
        return 0;
      }
      const rounded = Math.round(value);
      return Math.max(0, Math.min(100, rounded));
    };

    const positivas = toSafePercent(positivasPerc);
    const negativas = toSafePercent(negativasPerc);
    const neutras = toSafePercent(neutrasPerc);

    let statusMeta: DistribuicaoPanas['status_meta'] = 'progresso';
    if (positivas >= metaPositividade) {
      statusMeta = 'atingida';
    } else if (positivas < metaPositividade * 0.5) {
      statusMeta = 'atencao';
    }

    return {
      positivas,
      negativas,
      neutras,
      meta_positividade: metaPositividade,
      status_meta: statusMeta
    };
  }

  private processHistoricoDiario(data: ApiData): CheckinDiario[] {
    const historico = data.historico_diario || [];
    
    return historico.map((item, index) => {
      const fallbackDate = new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const humor = typeof item.humor === 'number' ? item.humor : Number(item.humor) || 5;
      const energia = typeof item.energia === 'number' ? item.energia : Number(item.energia) || 5;
      const qualidade = typeof item.qualidade === 'number' ? item.qualidade : Number(item.qualidade) || 5;

      return {
        id_checkin: `checkin_${item.data || fallbackDate}`,
        data_checkin: item.data || fallbackDate,
        horario_envio: '09:00',
        horario_resposta: '09:15',
        humor_autoavaliado: humor,
        emocao_primaria_detectada: item.emocao || 'neutro',
        intensidade_emocao: 7,
        energia_detectada: energia,
        qualidade_interacao: qualidade,
        status_resposta: 'respondido',
        emoji_dia: item.emoji || '😐'
      };
    });
  }

  private processInsights(data: ApiData): Insight[] {
    const insightsApi = data.insights || [];
    
    if (insightsApi.length === 0) {
      return [{
        id: 'insight_welcome',
        tipo: 'positivo',
        titulo: '💬 Bem-vindo ao MindQuest! 👋',
        descricao: 'Sua jornada começa aqui. Quanto mais compartilhar sobre você, melhor serão seus resultados.\n\nMente clara, resultados reais.',
        icone: '👋',
        data_criacao: new Date().toISOString(),
        prioridade: 'alta',
        categoria: 'cognitivo'
      }];
    }
    
    return insightsApi.map(insight => ({
      id: insight.id,
      tipo: insight.tipo as any,
      titulo: insight.titulo,
      descricao: insight.descricao,
      icone: insight.icone,
      data_criacao: insight.data_criacao,
      prioridade: insight.prioridade as any,
      categoria: insight.categoria as any
    }));
  }

  private convertGamificacao(gamificacao: ApiData['gamificacao']): Gamificacao {
    const xpTotal = this.parseNumber(gamificacao.xp_total) || 0;
    const nivelAtual = this.parseNumber(gamificacao.nivel_atual) || 1;
    const streakDias = this.parseNumber(gamificacao.streak_conversas_dias) || 0;
    const questStatusRaw = this.parseNullString<string>(gamificacao.quest_diaria_status);
    
    let questStatus: 'pendente' | 'parcial' | 'completa' = 'pendente';
    if (questStatusRaw === 'parcial') questStatus = 'parcial';
    else if (questStatusRaw === 'completa') questStatus = 'completa';
    
    let conquistas: string[] = [];
    try {
      const conquistasStr = this.parseNullString<string>(gamificacao.conquistas_desbloqueadas);
      if (conquistasStr) {
        conquistas = JSON.parse(conquistasStr);
      }
    } catch (e) {
      console.error('Erro ao parsear conquistas:', e);
      conquistas = [];
    }
    
    return {
      xp_total: xpTotal,
      nivel_atual: nivelAtual,
      streak_checkins_dias: streakDias,
      conquistas_desbloqueadas: conquistas,
      quest_diaria_status: questStatus,
      quest_diaria_progresso: this.parseNumber(gamificacao.quest_diaria_progresso) || 0,
      quest_diaria_descricao: gamificacao.quest_diaria_descricao || 'Complete sua conversa diária',
      proximo_nivel_xp: (nivelAtual + 1) * 200
    };
  }

  private convertSabotador(sabotador: ApiData['sabotador']): SabotadorPadrao {
    const id = this.parseNullString<string>(sabotador.id);
    const nome = this.parseNullString<string>(sabotador.nome);
    const emoji = this.parseNullString<string>(sabotador.emoji);
    const apelidoPersonalizado = this.parseNullString<string>(sabotador.apelido_personalizado);
    const totalDeteccoes = this.parseNumber(sabotador.total_deteccoes);
    const contextoPrincipal = this.parseNullString<string>(sabotador.contexto_principal);
    const insightAtual = this.parseNullString<string>(sabotador.insight_atual);
    const contramedidaAtiva = this.parseNullString<string>(sabotador.contramedida_ativa);
    const intensidadeMedia = this.parseNumber(sabotador.intensidade_media);
    const totalConversas = this.parseNumber(sabotador.total_conversas);
    
    if (!id || !nome) {
      return {
        id: 'none',
        nome: 'Nenhum detectado',
        emoji: '😌',
        apelido: 'Ainda descobrindo',
        detectado_em: 0,
        total_conversas: 1,
        insight_contexto: 'Continue conversando para identificarmos seus padrões internos.',
        contramedida: 'Mantenha a consistência em suas reflexões diárias.'
      };
    }

    return {
      id,
      nome,
      emoji: emoji || '🤔',
      apelido: apelidoPersonalizado || 'Sem nome',
      detectado_em: totalDeteccoes || 0,
      total_conversas: totalConversas || 1,
      insight_contexto: insightAtual || 'Continue conversando para identificarmos seus padrões.',
      contramedida: contramedidaAtiva || 'Aplicar técnica de auto-observação e focar em soluções.',
      contexto_principal: contextoPrincipal || 'contexto não identificado',
      intensidade_media: intensidadeMedia || undefined
    };
  }

  public convertApiToDashboard(rawApiPayload: ApiPayload): DashboardData {
    const apiData = this.normalizeApiPayload(rawApiPayload);
    const perfilDetectado = this.generatePerfilDetectado(apiData);
    const metricas = apiData.metricas_semana;
    const humorMedio = this.parseNumber(metricas.humor_medio);
    const cronotipoRaw = this.parseNullString<string>(apiData.user.cronotipo_detectado);

    let cronotipo: 'matutino' | 'vespertino' | 'noturno' = 'matutino';
    if (cronotipoRaw === 'vespertino') cronotipo = 'vespertino';
    else if (cronotipoRaw === 'noturno') cronotipo = 'noturno';

    const dashboardData: DashboardData = {
      usuario: {
        nome: apiData.user.nome,
        nome_preferencia: apiData.user.nome_preferencia,
        cronotipo_detectado: cronotipo,
        perfil_detectado: perfilDetectado
      },
      
      mood_gauge: {
        nivel_atual: humorMedio ? (humorMedio - 5) : 0,
        emoji_atual: this.parseNullString<string>(metricas.ultimo_conversa_emoji) || '😐',
        tendencia_semanal: humorMedio ? (humorMedio > 6 ? 1 : humorMedio < 4 ? -1 : 0) : 0,
        cor_indicador: (() => {
          if (humorMedio === null || humorMedio === undefined) {
            return '#6B7280';
          }
          if (humorMedio >= 7) return '#10B981'; // Verde para humor alto
          if (humorMedio >= 5) return '#F59E0B'; // Amarelo para neutro/regular
          if (humorMedio >= 3) return '#F97316'; // Laranja para baixo
          return '#EF4444'; // Vermelho para muito baixo
        })()
      },
      
      checkins_historico: this.processHistoricoDiario(apiData),
      roda_emocoes: this.processDistribuicaoEmocoes(apiData),
      distribuicao_panas: this.processPanas(apiData),
      gamificacao: this.convertGamificacao(apiData.gamificacao),
      
      sabotadores: {
        padrao_principal: this.convertSabotador(apiData.sabotador)
      },
      
      insights: this.processInsights(apiData),
      alertas_background: [],
      
      metricas_periodo: {
        periodo_selecionado: 'semana',
        data_inicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        data_fim: new Date().toISOString().split('T')[0],
        total_checkins: this.parseNumber(metricas.conversas_total) || 0,
        taxa_resposta: (() => {
          const total = this.parseNumber(metricas.conversas_total);
          const completas = this.parseNumber(metricas.conversas_completas);
          if (!total || total === 0) return 0;
          return (completas! / total) * 100;
        })(),
        humor_medio: humorMedio || 5,
        emocao_dominante: this.parseNullString<string>(metricas.ultima_emocao) || 'neutral'
      }
    };

    return dashboardData;
  }
}

export const dataAdapter = new DataAdapter();
export default dataAdapter;
