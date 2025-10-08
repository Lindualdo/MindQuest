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
  humor?: {
    periodo?: {
      tipo?: string | null;
      inicio?: string | null;
      fim?: string | null;
    };
    humor_atual?: string | number | null;
    humor_medio?: string | number | null;
    energia_media?: string | number | null;
    qualidade_media?: string | number | null;
    conversas_total?: string | number | null;
    diferenca_percentual?: string | number | null;
    ultima_conversa?: {
      data?: string | null;
      hora?: string | null;
      emoji?: string | null;
      emocao?: string | null;
    } | null;
    tendencia_vs_periodo_anterior?: string | number | null;
  };
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
  distribuicao_emocoes: {
    alegria: number;
    confianca: number;
    medo: number;
    surpresa: number;
    tristeza: number;
    angustia: number;
    raiva: number;
    expectativa: number;
  };
  roda_emocoes?: {
    alegria: number;
    confianca: number;
    medo: number;
    surpresa: number;
    tristeza: number;
    angustia: number;
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
    label?: string | null;
    tem_conversa?: boolean | null;
    conversas?: number | null;
    humor: number;
    emocao: string | null;
    emocao_id?: string | null;
    emoji: string | null;
    energia: number;
    qualidade: number;
    ultima_hora?: string | null;
  }>;
  historico_resumo: {
    total_conversas?: string | number | null;
    humor_medio?: string | number | null;
    sequencia_ativa?: string | number | null;
    ultima_conversa_data?: string | null;
    ultima_conversa_hora?: string | null;
    periodo_inicio?: string | null;
    periodo_fim?: string | null;
  };
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
    const todayDate = today.split('T')[0];
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
      distribuicao_emocoes: {
        alegria: 0,
        confianca: 0,
        medo: 0,
        surpresa: 0,
        tristeza: 0,
        angustia: 0,
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
      historico_resumo: {
        total_conversas: 0,
        humor_medio: 0,
        sequencia_ativa: 0,
        ultima_conversa_data: null,
        ultima_conversa_hora: null,
        periodo_inicio: todayDate,
        periodo_fim: todayDate
      },
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

      const converted = this.convertAuthPayload(obj);
      if (converted) {
        return converted;
      }
    }

    return null;
  }

  private convertAuthPayload(payload: Record<string, unknown>): Partial<ApiData> | null {
    if (Array.isArray(payload.data)) {
      const entries = payload.data as Array<Record<string, unknown>>;
      let aggregated: Partial<ApiData> | null = null;

      const mergePartial = (
        base: Partial<ApiData> | null,
        addition: Partial<ApiData> | null
      ): Partial<ApiData> | null => {
        if (!addition) return base;
        if (!base) return addition;

        const mergeRecord = <T extends Record<string, unknown> | undefined>(
          target: T,
          source: T
        ): T => {
          if (!source) return target;
          if (!target) return source;
          return { ...target, ...source } as T;
        };

        return {
          success: addition.success ?? base.success,
          user: mergeRecord(base.user, addition.user),
          perfil_big_five: mergeRecord(base.perfil_big_five, addition.perfil_big_five),
          gamificacao: mergeRecord(base.gamificacao, addition.gamificacao),
          sabotador: mergeRecord(base.sabotador, addition.sabotador),
          distribuicao_emocoes: mergeRecord(base.distribuicao_emocoes, addition.distribuicao_emocoes),
          panas: mergeRecord(base.panas, addition.panas),
          historico_diario: addition.historico_diario ?? base.historico_diario,
          insights: addition.insights ?? base.insights,
          timestamp: addition.timestamp ?? base.timestamp
        };
      };

      for (const entry of entries) {
        if (!entry || typeof entry !== 'object') {
          continue;
        }
        const converted = this.convertAuthPayload(entry as Record<string, unknown>);
        aggregated = mergePartial(aggregated, converted);
      }

      return aggregated;
    }

    const hasKnownKeys = [
      'Perfil_BigFive',
      'Sabotador',
      'Gameficacao',
      'Gamificacao',
      'Distribuicao_Emocoes',
      'roda_emocoes',
      'Analise_PANAS',
      'Historico_Diario',
      'Insights'
    ].some((key) => Object.prototype.hasOwnProperty.call(payload, key));

    if (!hasKnownKeys) {
      return null;
    }

    const safeJsonParse = <T>(value: unknown): T | null => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) as T;
        } catch (error) {
          console.warn('[DataAdapter] Falha ao parsear JSON dinâmico:', error);
          return null;
        }
      }

      if (value && typeof value === 'object') {
        return value as T;
      }

      return null;
    };

    const perfil = safeJsonParse<Record<string, unknown>>(payload.Perfil_BigFive);
    const gamificacaoBlock = safeJsonParse<Record<string, unknown>>(payload.Gameficacao ?? payload.Gamificacao);
    const sabotadorBlock = safeJsonParse<Record<string, unknown>>(payload.Sabotador);
    const distribuicaoBlock = safeJsonParse<Record<string, unknown>>(payload.Distribuicao_Emocoes);
    const rodaEmocoesBlock = payload.roda_emocoes
      ? payload.roda_emocoes as Record<string, unknown>
      : payload.Roda_Emocoes
        ? payload.Roda_Emocoes as Record<string, unknown>
        : safeJsonParse<Record<string, unknown>>(payload.roda_emocoes);
    const panasBlock = safeJsonParse<Record<string, unknown>>(payload.Analise_PANAS);
    const historicoWrapper = safeJsonParse<Record<string, unknown>>(payload.Historico_Diario);
    const insightsWrapper = safeJsonParse<Record<string, unknown>>(payload.Insights);

    const historicoArray = safeJsonParse<Array<Record<string, unknown>>>(historicoWrapper?.historico ?? historicoWrapper);
    const insightsArray = safeJsonParse<Array<Record<string, unknown>>>(insightsWrapper?.insights_lista ?? insightsWrapper);

    const distribuicaoRaw = safeJsonParse<Record<string, number | string>>(distribuicaoBlock?.emocoes_contagem ?? distribuicaoBlock);

    const userId = (perfil?.usuario_id ?? gamificacaoBlock?.usuario_id) as string | undefined;

    const partialUser: Partial<ApiData['user']> = {};
    if (userId) {
      partialUser.id = this.parseNullString<string>(userId) ?? undefined;
    }

    const perfilBigFive: Partial<ApiData['perfil_big_five']> = {};
    if (perfil) {
      const setPerfilValue = (key: keyof ApiData['perfil_big_five'], value: unknown) => {
        const parsed = this.parseNullString<string>(value as string | null | undefined);
        if (parsed !== null && parsed !== undefined) {
          perfilBigFive[key] = parsed;
        }
      };

      setPerfilValue('openness', perfil.openness);
      setPerfilValue('conscientiousness', perfil.conscientiousness);
      setPerfilValue('extraversion', perfil.extraversion);
      setPerfilValue('agreeableness', perfil.agreeableness);
      setPerfilValue('neuroticism', perfil.neuroticism);
      setPerfilValue('confiabilidade', perfil.confiabilidade);
      setPerfilValue('perfil_primario', perfil.perfil_primario);
      setPerfilValue('perfil_secundario', perfil.perfil_secundario);
    }

    const gamificacao: Partial<ApiData['gamificacao']> = {};
    if (gamificacaoBlock) {
      const setGamificacaoValue = (key: keyof ApiData['gamificacao'], value: unknown) => {
        const parsed = this.parseNullString<string>(value as string | null | undefined);
        if (parsed !== null && parsed !== undefined) {
          gamificacao[key] = parsed;
        }
      };

      setGamificacaoValue('xp_total', gamificacaoBlock.xp_total);
      setGamificacaoValue('nivel_atual', gamificacaoBlock.nivel_atual);
      setGamificacaoValue('streak_conversas_dias', gamificacaoBlock.streak_conversas_dias);
      setGamificacaoValue('conquistas_desbloqueadas', gamificacaoBlock.conquistas_desbloqueadas);
      setGamificacaoValue('quest_diaria_status', gamificacaoBlock.quest_diaria_status);
      setGamificacaoValue('quest_diaria_progresso', gamificacaoBlock.quest_diaria_progresso);
      setGamificacaoValue('quest_diaria_descricao', gamificacaoBlock.quest_diaria_descricao);
    }

    const sabotador: Partial<ApiData['sabotador']> = {};
    if (sabotadorBlock) {
      const setSabotadorValue = (key: keyof ApiData['sabotador'], value: unknown) => {
        const parsed = this.parseNullString<string>(value as string | null | undefined);
        if (parsed !== null && parsed !== undefined) {
          sabotador[key] = parsed;
        }
      };

      setSabotadorValue('id', sabotadorBlock.sabotador_id ?? sabotadorBlock.id);
      setSabotadorValue('nome', sabotadorBlock.nome);
      setSabotadorValue('emoji', sabotadorBlock.emoji);
      setSabotadorValue('apelido_personalizado', sabotadorBlock.apelido_personalizado ?? sabotadorBlock.apelido);
      setSabotadorValue('total_deteccoes', sabotadorBlock.total_deteccoes);
      setSabotadorValue('contexto_principal', sabotadorBlock.contexto_principal);
      setSabotadorValue('insight_atual', sabotadorBlock.insight_atual);
      setSabotadorValue('contramedida_ativa', sabotadorBlock.contramedida_ativa);
      setSabotadorValue('intensidade_media', sabotadorBlock.intensidade_media);
      setSabotadorValue('total_conversas', sabotadorBlock.total_conversas ?? sabotadorBlock.totalConversas);
    }

    const distribuicaoRawFinal = rodaEmocoesBlock || distribuicaoRaw;

    const distribuicao: Partial<ApiData['distribuicao_emocoes']> = {};
    if (distribuicaoRawFinal) {
      for (const key of Object.keys(distribuicaoRawFinal)) {
        const normalizedKey = key.toLowerCase();
        if (normalizedKey in this.getDefaultApiData().distribuicao_emocoes) {
          const targetKey = normalizedKey as keyof ApiData['distribuicao_emocoes'];
          const value = distribuicaoRawFinal[key];
          const parsedValue = typeof value === 'number' ? value : Number(value);
          distribuicao[targetKey] = Number.isFinite(parsedValue) ? parsedValue : 0;
        }
      }
    }

    const panas: Partial<ApiData['panas']> = {};
    if (panasBlock) {
      for (const key of Object.keys(panasBlock)) {
        const value = panasBlock[key];
        const parsedValue = typeof value === 'number' ? value : Number(value);
        if (Number.isFinite(parsedValue)) {
          (panas as Record<string, number>)[key] = parsedValue;
        }
      }
    }

    const parseNullableNumber = (value: unknown): number | null => {
      if (
        typeof value === 'number' ||
        typeof value === 'string' ||
        value === null ||
        value === undefined
      ) {
        return this.parseNumber(value as string | number | null | undefined);
      }
      return null;
    };

    const parseOptionalBoolean = (value: unknown): boolean | null => {
      if (typeof value === 'boolean') {
        return value;
      }
      if (typeof value === 'number') {
        if (value === 1) return true;
        if (value === 0) return false;
      }
      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['true', '1', 'sim', 'yes'].includes(normalized)) return true;
        if (['false', '0', 'nao', 'não', 'no'].includes(normalized)) return false;
      }
      return null;
    };

    const hojeIso = new Date().toISOString().split('T')[0];
    const historicoDiario = Array.isArray(historicoArray)
      ? historicoArray.map((entry) => ({
          data: this.parseNullString<string>(entry.data as string | null | undefined) || hojeIso,
          label: this.parseNullString<string>(entry.label as string | null | undefined) || null,
          tem_conversa: (() => {
            const parsed = parseOptionalBoolean(entry.tem_conversa ?? entry.temConversa ?? entry.checkin_realizado);
            return parsed === null ? undefined : parsed;
          })(),
          conversas: parseNullableNumber(entry.conversas),
          humor: parseNullableNumber(entry.humor),
          emocao: this.parseNullString<string>(entry.emocao as string | null | undefined) || null,
          emocao_id: this.parseNullString<string>(entry.emocao_id as string | null | undefined) || null,
          emoji: this.parseNullString<string>(entry.emoji as string | null | undefined) || null,
          energia: parseNullableNumber(entry.energia),
          qualidade: parseNullableNumber(entry.qualidade),
          ultima_hora: this.parseNullString<string>(entry.ultima_hora as string | null | undefined) || null
        }))
      : undefined;

    const nowIso = new Date().toISOString();
    const insights = Array.isArray(insightsArray)
      ? insightsArray.map((insight, index) => ({
          id: this.parseNullString<string>(insight.id as string | null | undefined) ?? `insight_${index}`,
          tipo: this.parseNullString<string>(insight.tipo as string | null | undefined) ?? 'padrao',
          categoria: this.parseNullString<string>(insight.categoria as string | null | undefined) ?? 'emocional',
          titulo: this.parseNullString<string>(insight.titulo as string | null | undefined) ?? 'Insight em processamento',
          descricao: this.parseNullString<string>(insight.descricao as string | null | undefined) ?? 'Estamos analisando seus dados para gerar um insight personalizado.',
          icone: this.parseNullString<string>(insight.icone as string | null | undefined) ?? '💡',
          prioridade: this.parseNullString<string>(insight.prioridade as string | null | undefined) ?? 'media',
          data_criacao: this.parseNullString<string>(insight.data_criacao as string | null | undefined) ?? nowIso
        }))
      : undefined;

    const historicoResumoBlock = safeJsonParse<Record<string, unknown>>(payload.Historico_Resumo ?? payload.historico_resumo);
    const historicoResumo = historicoResumoBlock
      ? {
          total_conversas: this.parseNumber(historicoResumoBlock.total_conversas as string | number | null | undefined) ?? 0,
          humor_medio: this.parseNumber(historicoResumoBlock.humor_medio as string | number | null | undefined) ?? 0,
          sequencia_ativa: this.parseNumber(historicoResumoBlock.sequencia_ativa as string | number | null | undefined) ?? 0,
          ultima_conversa_data: this.parseNullString<string>(historicoResumoBlock.ultima_conversa_data as string | null | undefined),
          ultima_conversa_hora: this.parseNullString<string>(historicoResumoBlock.ultima_conversa_hora as string | null | undefined),
          periodo_inicio: this.parseNullString<string>(historicoResumoBlock.periodo_inicio as string | null | undefined),
          periodo_fim: this.parseNullString<string>(historicoResumoBlock.periodo_fim as string | null | undefined)
        }
      : undefined;

    const partialUserData = partialUser.id
      ? { ...this.getDefaultApiData().user, ...partialUser }
      : undefined;

    const partialData: Partial<ApiData> = {
      success: true,
      user: partialUserData,
      perfil_big_five: Object.keys(perfilBigFive).length > 0 ? (perfilBigFive as ApiData['perfil_big_five']) : undefined,
      gamificacao: Object.keys(gamificacao).length > 0 ? (gamificacao as ApiData['gamificacao']) : undefined,
      sabotador: Object.keys(sabotador).length > 0 ? (sabotador as ApiData['sabotador']) : undefined,
      distribuicao_emocoes: Object.keys(distribuicao).length > 0 ? (distribuicao as ApiData['distribuicao_emocoes']) : undefined,
      panas: Object.keys(panas).length > 0 ? (panas as ApiData['panas']) : undefined,
      historico_resumo: historicoResumo,
      insights: insights,
      timestamp: new Date().toISOString()
    };

    return partialData;
  }

  private mergeWithDefaults(data: Partial<ApiData> | null): ApiData {
    const defaults = this.getDefaultApiData();
    const safeData = data ?? {};

    if (!safeData.distribuicao_emocoes && safeData.roda_emocoes) {
      safeData.distribuicao_emocoes = safeData.roda_emocoes as ApiData['distribuicao_emocoes'];
    }

    const historico = Array.isArray(safeData.historico_diario) ? safeData.historico_diario : [];
    const historicoDefaults = {
      data: defaults.timestamp.split('T')[0],
      label: null as string | null,
      tem_conversa: false,
      conversas: 0,
      humor: 5,
      emocao: 'neutro',
      emocao_id: null as string | null,
      emoji: '😐',
      energia: 5,
      qualidade: 5,
      ultima_hora: null as string | null
    };

    const insights = Array.isArray(safeData.insights) ? safeData.insights : [];

    return {
      success: 'success' in safeData ? safeData.success : defaults.success,
      humor: safeData.humor,
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
        label: (item as any)?.label ?? historicoDefaults.label,
        tem_conversa: (() => {
          const raw = (item as any)?.tem_conversa;
          if (typeof raw === 'boolean') return raw;
          if (typeof raw === 'number') return raw > 0;
          if (typeof raw === 'string') {
            const normalized = raw.trim().toLowerCase();
            if (['true', '1', 'sim', 'yes'].includes(normalized)) return true;
            if (['false', '0', 'nao', 'não', 'no'].includes(normalized)) return false;
          }
          return historicoDefaults.tem_conversa;
        })(),
        conversas: (() => {
          const value = (item as any)?.conversas;
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : historicoDefaults.conversas;
          }
          return historicoDefaults.conversas;
        })(),
        humor: typeof item?.humor === 'number' ? item.humor : Number(item?.humor) || historicoDefaults.humor,
        emocao: item?.emocao || historicoDefaults.emocao,
        emocao_id: (item as any)?.emocao_id ?? historicoDefaults.emocao_id,
        emoji: item?.emoji || historicoDefaults.emoji,
        energia: typeof item?.energia === 'number' ? item.energia : Number(item?.energia) || historicoDefaults.energia,
        qualidade: typeof item?.qualidade === 'number' ? item.qualidade : Number(item?.qualidade) || historicoDefaults.qualidade,
        ultima_hora: (item as any)?.ultima_hora ?? historicoDefaults.ultima_hora
      })),
      historico_resumo: (() => {
        const resumo = safeData.historico_resumo || {};
        const ensureNumber = (value: unknown, fallback: number) => {
          const parsed = this.parseNumber(value as string | number | null | undefined);
          return parsed !== null ? parsed : fallback;
        };
        return {
          total_conversas: ensureNumber((resumo as any).total_conversas, Number(defaults.historico_resumo.total_conversas) || 0),
          humor_medio: ensureNumber((resumo as any).humor_medio, Number(defaults.historico_resumo.humor_medio) || 0),
          sequencia_ativa: ensureNumber((resumo as any).sequencia_ativa, Number(defaults.historico_resumo.sequencia_ativa) || 0),
          ultima_conversa_data: this.parseNullString<string>((resumo as any).ultima_conversa_data) || defaults.historico_resumo.ultima_conversa_data,
          ultima_conversa_hora: this.parseNullString<string>((resumo as any).ultima_conversa_hora) || defaults.historico_resumo.ultima_conversa_hora,
          periodo_inicio: this.parseNullString<string>((resumo as any).periodo_inicio) || defaults.historico_resumo.periodo_inicio,
          periodo_fim: this.parseNullString<string>((resumo as any).periodo_fim) || defaults.historico_resumo.periodo_fim
        };
      })(),
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
        { id: 'anguish', nome: 'Angústia', intensidade: 0, cor: '#8B4513', emoji: '😣', categoria: 'primaria' },
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
      { id: 'anguish', nome: 'Angústia', intensidade: Math.round((emocoes.angustia / total) * 100), cor: '#8B4513', emoji: '😣', categoria: 'primaria' },
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
      const humorRaw = typeof item.humor === 'number' ? item.humor : Number(item.humor);
      const humor = Number.isFinite(humorRaw) ? humorRaw : 0;
      const energiaRaw = typeof item.energia === 'number' ? item.energia : Number(item.energia);
      const energia = Number.isFinite(energiaRaw) ? energiaRaw : 0;
      const qualidadeRaw = typeof item.qualidade === 'number' ? item.qualidade : Number(item.qualidade);
      const qualidade = Number.isFinite(qualidadeRaw) ? qualidadeRaw : 0;

      const conversas = typeof item.conversas === 'number' ? item.conversas : Number(item.conversas) || 0;
      const temConversaFlag = typeof item.tem_conversa === 'boolean'
        ? item.tem_conversa
        : conversas > 0;

      const hasConversa = temConversaFlag && conversas > 0;

      let status: 'respondido' | 'perdido' | 'pendente';
      if (temConversaFlag && conversas > 0) {
        status = 'respondido';
      } else if (temConversaFlag) {
        status = 'pendente';
      } else {
        status = 'perdido';
      }

      const ultimaHora = typeof item.ultima_hora === 'string' && item.ultima_hora.trim() !== ''
        ? item.ultima_hora
        : null;

      const emojiFallback = (() => {
        if (status === 'respondido') return '😊';
        if (status === 'pendente') return '⏳';
        return '😴';
      })();
      const emojiDia = hasConversa ? (item.emoji || emojiFallback) : '';

      return {
        id_checkin: `checkin_${item.data || fallbackDate}`,
        data_checkin: item.data || fallbackDate,
        horario_envio: '09:00',
        horario_resposta: status === 'respondido' ? (ultimaHora || '09:15') : (ultimaHora || '--:--'),
        humor_autoavaliado: status === 'respondido' ? humor : 0,
        emocao_primaria_detectada: item.emocao || item.emocao_id || 'neutro',
        intensidade_emocao: 7,
        energia_detectada: energia,
        qualidade_interacao: qualidade,
        status_resposta: status,
        emoji_dia: emojiDia
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

  private resolveHumorMetrics(apiData: ApiData) {
    const defaults = this.getDefaultApiData();
    const humorBlock = apiData.humor;
    const resumo = apiData.historico_resumo ?? defaults.historico_resumo;

    const parsedHumorAtual = humorBlock
      ? this.parseNumber(humorBlock.humor_atual ?? humorBlock.humor_medio)
      : null;
    const metricasHumor = null;
    const humorResumoRaw = resumo?.humor_medio;
    const resumoHumor = typeof humorResumoRaw === 'number'
      ? humorResumoRaw
      : this.parseNumber(humorResumoRaw as string | number | null | undefined);
    const preferedHumorMedio = resumoHumor ?? metricasHumor ?? parsedHumorAtual;
    const nivelAtual = parsedHumorAtual ?? preferedHumorMedio ?? 0;

    const humorMedio = preferedHumorMedio ?? nivelAtual;

    const energiaMedia = humorBlock
      ? this.parseNumber(humorBlock.energia_media)
      : null;
    const qualidadeMedia = humorBlock
      ? this.parseNumber(humorBlock.qualidade_media)
      : null;

    const conversasTotal = humorBlock
      ? this.parseNumber(humorBlock.conversas_total)
      : null;
    const resumoTotalConversas = typeof resumo?.total_conversas === 'number'
      ? resumo.total_conversas
      : this.parseNumber((resumo as any)?.total_conversas);

    const ultimaConversaEmoji = this.parseNullString<string>(
      humorBlock?.ultima_conversa?.emoji
    ) || '😐';

    const ultimaConversaEmocao = this.parseNullString<string>(
      humorBlock?.ultima_conversa?.emocao
    ) || 'neutral';

    const ultimaConversaData = this.parseNullString<string>(
      humorBlock?.ultima_conversa?.data
    ) || resumo?.ultima_conversa_data || null;

    let tendencia = this.parseNumber(humorBlock?.diferenca_percentual ?? humorBlock?.tendencia_vs_periodo_anterior);
    if (tendencia === null) {
      if (humorMedio && humorMedio !== 0) {
        tendencia = Number((((nivelAtual - humorMedio) / humorMedio) * 100).toFixed(1));
      } else {
        tendencia = 0;
      }
    }

    const periodoTipoRaw = this.parseNullString<string>(humorBlock?.periodo?.tipo);
    const periodoTipo: 'semana' | 'mes' | 'trimestre' = periodoTipoRaw === 'mes' || periodoTipoRaw === 'trimestre' ? periodoTipoRaw : 'semana';
    const defaultRangeStart = (() => {
      const days = periodoTipo === 'mes' ? 30 : periodoTipo === 'trimestre' ? 90 : 7;
      return new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    })();
    const periodoInicio = this.parseNullString<string>(humorBlock?.periodo?.inicio) || resumo?.periodo_inicio || defaultRangeStart;
    const periodoFim = this.parseNullString<string>(humorBlock?.periodo?.fim) || resumo?.periodo_fim || new Date().toISOString().split('T')[0];

    return {
      nivelAtual,
      humorMedio,
      energiaMedia: energiaMedia ?? null,
      qualidadeMedia: qualidadeMedia ?? null,
      conversasTotal: conversasTotal ?? (typeof resumoTotalConversas === 'number' ? resumoTotalConversas : 0),
      conversasCompletas: typeof resumoTotalConversas === 'number' ? resumoTotalConversas : 0,
      ultimaConversaEmoji,
      ultimaConversaEmocao,
      ultimaConversaData,
      tendencia,
      periodoTipo,
      periodoInicio,
      periodoFim,
    };
  }

  public convertApiToDashboard(rawApiPayload: ApiPayload): DashboardData {
    const apiData = this.normalizeApiPayload(rawApiPayload);
    const perfilDetectado = this.generatePerfilDetectado(apiData);
    const humorMetrics = this.resolveHumorMetrics(apiData);
    const cronotipoRaw = this.parseNullString<string>(apiData.user.cronotipo_detectado);

    let cronotipo: 'matutino' | 'vespertino' | 'noturno' = 'matutino';
    if (cronotipoRaw === 'vespertino') cronotipo = 'vespertino';
    else if (cronotipoRaw === 'noturno') cronotipo = 'noturno';

    const dashboardData: DashboardData = {
      usuario: {
        id: apiData.user.id,
        nome: apiData.user.nome,
        nome_preferencia: apiData.user.nome_preferencia,
        cronotipo_detectado: cronotipo,
        perfil_detectado: perfilDetectado
      },
      
      mood_gauge: {
        nivel_atual: humorMetrics.nivelAtual,
        emoji_atual: humorMetrics.ultimaConversaEmoji,
        tendencia_semanal: humorMetrics.tendencia,
        cor_indicador: (() => {
          if (humorMetrics.nivelAtual === null || humorMetrics.nivelAtual === undefined) {
            return '#6B7280';
          }
          if (humorMetrics.nivelAtual >= 8) return '#10B981';
          if (humorMetrics.nivelAtual >= 6) return '#F59E0B';
          if (humorMetrics.nivelAtual >= 4) return '#F97316';
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
        periodo_selecionado: humorMetrics.periodoTipo,
        data_inicio: humorMetrics.periodoInicio,
        data_fim: humorMetrics.periodoFim,
        total_checkins: humorMetrics.conversasTotal,
        taxa_resposta: (() => {
          const total = humorMetrics.conversasTotal;
          const completas = humorMetrics.conversasCompletas;
          if (!total || total === 0) return 0;
          return (completas / total) * 100;
        })(),
        humor_medio: humorMetrics.humorMedio || 5,
        emocao_dominante: humorMetrics.ultimaConversaEmocao
      }
    };

    return dashboardData;
  }
}

export const dataAdapter = new DataAdapter();
export default dataAdapter;
