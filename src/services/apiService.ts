/**
 * ARQUIVO: src/services/apiService.ts
 * AÇÃO: CRIAR novo arquivo
 * 
 * Serviço de comunicação com API N8N
 * Centraliza todas as chamadas para o webhook de validação e outros endpoints
 */

import { authService } from './authService';
import type {
  HumorHistoricoPayload,
  InsightDetail,
  ResumoConversasPayload,
  QuestSnapshot,
  QuestStatus,
  PanoramaCardResponse,
  InsightCardResponse,
  ConversasCardResponse,
  QuestCardResponse,
  JornadaCardResponse,
  WeeklyProgressCardResponse,
  MapaMentalData,
} from '../types/emotions';

interface ApiResponse {
  success: boolean;
  response?: any;
  error?: string;
}

interface DashboardApiResponse {
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
  proxima_jornada?: {
    xp_total?: number | string | null;
    nivel_atual?: number | string | null;
    titulo_atual?: string | null;
    proximo_nivel?: {
      nivel?: number | string | null;
      titulo?: string | null;
      xp_minimo?: number | string | null;
      xp_restante?: number | string | null;
      descricao?: string | null;
    } | null;
    proximos_niveis?: Array<Record<string, unknown>> | string | null;
    desafios?: Array<Record<string, unknown>> | string | null;
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
    xp_total: number | string | null;
    xp_proximo_nivel: number | string | null;
    nivel_atual: number | string | null;
    titulo_nivel?: string | null;
    streak_conversas_dias: number | string | null;
    streak_protecao_usada?: boolean | string | null;
    streak_protecao_resetada_em?: string | null;
    ultima_conversa_data?: string | null;
    melhor_streak?: number | string | null;
    quest_diaria_status: string | null;
    quest_diaria_progresso: number | string | null;
    quest_diaria_descricao?: string | null;
    quest_diaria_data?: string | null;
    quest_streak_dias?: number | string | null;
    conquistas_desbloqueadas?: Array<Record<string, unknown>> | string | null;
    conquistas_proximas?: Array<Record<string, unknown>> | string | null;
    total_conversas?: number | string | null;
    total_reflexoes?: number | string | null;
    total_xp_ganho_hoje?: number | string | null;
    ultima_conquista_id?: string | null;
    ultima_conquista_data?: string | null;
    ultima_atualizacao?: string | null;
    criado_em?: string | null;
  };
  sabotador: {
    id: string | null;
    nome: string | null;
    emoji: string | null;
    apelido_personalizado: string | null;
    total_deteccoes: string | null;
    contexto_principal?: string | null;
    insight_atual?: string | null;
    contramedida_ativa?: string | null;
    intensidade_media?: string | null;
    total_conversas?: string | null;
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
  panas: {
    positivas: number | string;
    negativas: number | string;
    neutras: number | string;
    total: number | string;
    percentual_positivas: number | string;
    percentual_negativas: number | string;
    percentual_neutras: number | string;
  };
  historico_diario: Array<{
    data: string;
    humor: number | string;
    emocao: string;
    emoji: string;
    energia: number | string;
    qualidade: number | string;
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

class ApiService {
  private static instance: ApiService;
  private remoteBaseUrl = 'https://mindquest-n8n.cloudfy.live/webhook';
  private useProxyPaths = false;

  private constructor() {
    let env: Record<string, unknown> | undefined;
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        env = import.meta.env as Record<string, unknown>;
      }
    } catch (_) {
      env = undefined;
    }

    const baseFromEnv = typeof env?.VITE_API_BASE_URL === 'string'
      ? (env.VITE_API_BASE_URL as string).trim()
      : undefined;

    if (baseFromEnv) {
      this.remoteBaseUrl = baseFromEnv.replace(/\/$/, '');
    }

    if (typeof env?.VITE_API_USE_PROXY === 'string') {
      this.useProxyPaths = String(env.VITE_API_USE_PROXY).toLowerCase() === 'true';
    } else {
      this.useProxyPaths = Boolean(env?.DEV) && !baseFromEnv;
    }
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Executa uma requisição HTTP genérica
   */
  private resolveUrl(endpoint: string, forceRemote = false): string {
    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }

    if (forceRemote) {
      const url = `${this.remoteBaseUrl}${endpoint}`;
      console.log('[ApiService.resolveUrl] forceRemote=true:', url);
      return url;
    }

    if (this.useProxyPaths && typeof window !== 'undefined') {
      const url = `/api${endpoint}`;
      console.log('[ApiService.resolveUrl] useProxy=true:', url);
      return url;
    }

    const url = `${this.remoteBaseUrl}${endpoint}`;
    console.log('[ApiService.resolveUrl] default:', url);
    return url;
  }

  private toNumber(value: unknown, fallback: number | null = null): number | null {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : fallback;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().replace(/%/g, '').replace(/,/g, '.');
      const match = normalized.match(/-?\d+(?:\.\d+)?/);
      if (match) {
        const parsed = Number(match[0]);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return fallback;
  }

  private toString(value: unknown): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
    return String(value);
  }

  private normalizeQuestEntry(entry: unknown): QuestSnapshot['quests_personalizadas'][number] | null {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const quest = entry as Record<string, unknown>;
    const configObj =
      quest.config && typeof quest.config === 'object' && !Array.isArray(quest.config)
        ? (quest.config as Record<string, unknown>)
        : null;

    return {
      instancia_id: this.toString(quest.instancia_id),
      meta_codigo: this.toString(quest.meta_codigo) ?? '',
      status: (this.toString(quest.status) ?? 'pendente') as QuestStatus,
      titulo: this.toString(quest.titulo) ?? 'Quest personalizada',
      descricao: this.toString(quest.descricao),
      contexto_origem: this.toString(quest.contexto_origem),
      progresso_meta: this.toNumber(quest.progresso_meta, 1) ?? 1,
      progresso_atual: this.toNumber(quest.progresso_atual, 0) ?? 0,
      concluido_em: this.toString(quest.concluido_em),
      config: configObj,
      xp_recompensa:
        this.toNumber(
          quest.xp_recompensa ??
            (configObj && typeof configObj.xp_recompensa !== 'undefined'
              ? configObj.xp_recompensa
              : null),
          null
        ),
      prioridade: this.toString(
        quest.prioridade ??
          (configObj && typeof configObj.prioridade !== 'undefined' ? configObj.prioridade : null)
      ),
      recorrencia: this.toString(
        quest.recorrencia ??
          (configObj && typeof configObj.recorrencia !== 'undefined' ? configObj.recorrencia : null)
      ),
    };
  }

  private normalizeQuestSnapshot(payload: unknown): QuestSnapshot | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const raw = payload as Record<string, unknown>;
    const questsRaw = Array.isArray(raw.quests_personalizadas)
      ? raw.quests_personalizadas
      : [];

    const quests = questsRaw
      .map((entry) => this.normalizeQuestEntry(entry))
      .filter((entry): entry is QuestSnapshot['quests_personalizadas'][number] => entry !== null);

    return {
      usuario_id: this.toString(raw.usuario_id) ?? '',
      xp_total: this.toNumber(raw.xp_total, 0) ?? 0,
      xp_proximo_nivel: this.toNumber(raw.xp_proximo_nivel, null),
      nivel_atual: this.toNumber(raw.nivel_atual, 1) ?? 1,
      titulo_nivel: this.toString(raw.titulo_nivel),
      sequencia_atual: this.toNumber(raw.sequencia_atual, 0) ?? 0,
      sequencia_recorde: this.toNumber(raw.sequencia_recorde, 0) ?? 0,
      meta_sequencia_codigo: this.toString(raw.meta_sequencia_codigo),
      proxima_meta_codigo: this.toString(raw.proxima_meta_codigo),
      sequencia_status:
        raw.sequencia_status && typeof raw.sequencia_status === 'object'
          ? (raw.sequencia_status as Record<string, unknown>)
          : null,
      quests_personalizadas: quests,
    };
  }

  private extractQuestSnapshot(payload: unknown): QuestSnapshot | null {
    if (!payload) {
      return null;
    }

    if (typeof payload === 'string') {
      const trimmed = payload.trim();
      if (trimmed) {
        try {
          const parsed = JSON.parse(trimmed);
          return this.extractQuestSnapshot(parsed);
        } catch (_) {
          return null;
        }
      }
    }

    if (Array.isArray(payload)) {
      const collectedQuests: QuestSnapshot['quests_personalizadas'] = [];
      let collectedSnapshot: QuestSnapshot | null = null;

      for (const item of payload) {
        if (!item) {
          continue;
        }

        if (typeof item === 'object' && !Array.isArray(item)) {
          const obj = item as Record<string, unknown>;
          const looksLikeQuest =
            obj.meta_codigo !== undefined ||
            obj.instancia_id !== undefined ||
            obj.status !== undefined ||
            obj.titulo !== undefined;
          const looksLikeSnapshot =
            obj.usuario_id !== undefined ||
            obj.xp_total !== undefined ||
            obj.sequencia_status !== undefined ||
            obj.nivel_atual !== undefined;

          if (looksLikeQuest && !looksLikeSnapshot) {
            const normalizedQuest = this.normalizeQuestEntry(obj);
            if (normalizedQuest) {
              collectedQuests.push(normalizedQuest);
              continue;
            }
          }

          if (looksLikeSnapshot) {
            const normalizedSnapshot = this.normalizeQuestSnapshot(obj);
            if (normalizedSnapshot) {
              collectedSnapshot = normalizedSnapshot;
            }
            continue;
          }
        }

        const nestedSnapshot = this.extractQuestSnapshot(item);
        if (nestedSnapshot) {
          return nestedSnapshot;
        }
      }

      if (collectedSnapshot) {
        const combinedQuests =
          collectedQuests.length > 0 ? collectedQuests : collectedSnapshot.quests_personalizadas;

        return {
          ...collectedSnapshot,
          quests_personalizadas: combinedQuests,
        };
      }

      for (const item of payload) {
        const snapshot = this.extractQuestSnapshot(item);
        if (snapshot) {
          return snapshot;
        }
      }
      return null;
    }

    if (typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;

      const looksLikeQuest =
        obj.meta_codigo !== undefined ||
        obj.instancia_id !== undefined ||
        obj.status !== undefined ||
        obj.titulo !== undefined;
      const looksLikeSnapshot =
        obj.usuario_id !== undefined ||
        obj.xp_total !== undefined ||
        obj.sequencia_status !== undefined ||
        obj.nivel_atual !== undefined;

      if (looksLikeQuest && !looksLikeSnapshot) {
        const quest = this.normalizeQuestEntry(obj);
        if (quest) {
          return {
            usuario_id: '',
            xp_total: 0,
            xp_proximo_nivel: null,
            nivel_atual: 1,
            titulo_nivel: null,
            sequencia_atual: 0,
            sequencia_recorde: 0,
            meta_sequencia_codigo: null,
            proxima_meta_codigo: null,
            sequencia_status: null,
            quests_personalizadas: [quest],
          };
        }
      }

      const stateCandidateKeys = [
        'estado',
        'state',
        'snapshot',
        'snapshot_final',
        'snapshot_atual',
        'buscar_estado',
        'Buscar Estado',
        'quest_estado',
        'dados_estado'
      ];
      const questsCandidateKeys = [
        'quests',
        'quests_personalizadas',
        'questsPersonalizadas',
        'buscar_quests',
        'Buscar Quests',
        'dados_quests'
      ];

      for (const key of stateCandidateKeys) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const state = this.extractQuestSnapshot(obj[key]);
          if (state) {
            return state;
          }
        }
      }

      for (const key of questsCandidateKeys) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (Array.isArray(value)) {
            const quests = value
              .map((entry) => this.normalizeQuestEntry(entry))
              .filter((entry): entry is QuestSnapshot['quests_personalizadas'][number] => entry !== null);

            if (quests.length > 0) {
              const snapshotCandidate =
                this.extractQuestSnapshot(
                  stateCandidateKeys
                    .map((stateKey) => obj[stateKey])
                    .find((stateValue) => stateValue !== undefined)
                ) ?? this.normalizeQuestSnapshot(obj);

              if (snapshotCandidate) {
                return {
                  ...snapshotCandidate,
                  quests_personalizadas: quests,
                };
              }

              return {
                usuario_id: '',
                xp_total: 0,
                xp_proximo_nivel: null,
                nivel_atual: 1,
                titulo_nivel: null,
                sequencia_atual: 0,
                sequencia_recorde: 0,
                meta_sequencia_codigo: null,
                proxima_meta_codigo: null,
                sequencia_status: null,
                quests_personalizadas: quests,
              };
            }
          }
        }
      }

      if (obj.snapshot_final !== undefined) {
        const snapshot = this.normalizeQuestSnapshot(obj.snapshot_final);
        if (snapshot) {
          return snapshot;
        }
      }

      if (obj.snapshot !== undefined) {
        const snapshot = this.normalizeQuestSnapshot(obj.snapshot);
        if (snapshot) {
          return snapshot;
        }
      }

      const nestedKeys = [
        'response',
        'data',
        'json',
        'body',
        'payload',
        'result',
        'resultado',
        'value',
        'values',
        'item',
        'items'
      ];
      for (const nestedKey of nestedKeys) {
        if (Object.prototype.hasOwnProperty.call(obj, nestedKey)) {
          const nestedSnapshot = this.extractQuestSnapshot(obj[nestedKey]);
          if (nestedSnapshot) {
            return nestedSnapshot;
          }
        }
      }

      const maybeSnapshot = this.normalizeQuestSnapshot(obj);
      if (maybeSnapshot && maybeSnapshot.usuario_id) {
        return maybeSnapshot;
      }
    }

    return null;
  }

  private extractDashboardPayload(payload: unknown): DashboardApiResponse | null {
    if (!payload) {
      return null;
    }

    if (Array.isArray(payload)) {
      for (const item of payload) {
        const extracted = this.extractDashboardPayload(item);
        if (extracted) {
          return extracted;
        }
      }
      return null;
    }

    if (typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;

      if (obj.success === true && (obj.user || obj.roda_emocoes || obj.distribuicao_emocoes)) {
        return obj as DashboardApiResponse;
      }

      if (obj.response !== undefined) {
        const fromResponse = this.extractDashboardPayload(obj.response);
        if (fromResponse) {
          return fromResponse;
        }
      }

      if (obj.data !== undefined) {
        const fromData = this.extractDashboardPayload(obj.data);
        if (fromData) {
          return fromData;
        }
      }
    }

    return null;
  }

  private extractHumorHistoricoPayload(payload: unknown): HumorHistoricoPayload | null {
    if (!payload) {
      return null;
    }

    if (Array.isArray(payload)) {
      for (const item of payload) {
        const extracted = this.extractHumorHistoricoPayload(item);
        if (extracted) {
          return extracted;
        }
      }
      return null;
    }

    if (typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;
      if (obj.historico_humor) {
        return obj.historico_humor as HumorHistoricoPayload;
      }

      if (obj.response !== undefined) {
        const nested = this.extractHumorHistoricoPayload(obj.response);
        if (nested) return nested;
      }

      if (obj.data !== undefined) {
        const nestedData = this.extractHumorHistoricoPayload(obj.data);
        if (nestedData) return nestedData;
      }
    }

    return null;
  }

  private normalizeResumoConversa(entry: unknown): ResumoConversasPayload['conversas'][number] | null {
    if (!entry) {
      return null;
    }

    if (typeof entry === 'string') {
      return { resumo_conversa: entry };
    }

    if (typeof entry !== 'object') {
      return null;
    }

    const obj = entry as Record<string, unknown>;

    const textoFonte =
      obj.resumo_conversa ??
      obj.resumo ??
      obj.resumo_texto ??
      obj.texto ??
      obj.descricao ??
      obj.mensagem ??
      '';

    const resumoTexto = typeof textoFonte === 'string'
      ? textoFonte
      : textoFonte !== null && textoFonte !== undefined
        ? JSON.stringify(textoFonte)
        : '';

    if (!resumoTexto) {
      return null;
    }

    const dataPossiveis = [
      obj.data_conversa,
      obj.data,
      obj.data_inicio,
      obj.data_fim,
      obj.data_registro,
      obj.criado_em,
      obj.atualizado_em,
      obj.timestamp
    ];

    const dataConversa = dataPossiveis.find((valor) => typeof valor === 'string' && valor.trim()) as string | undefined;

    const normalized: ResumoConversasPayload['conversas'][number] = {
      resumo_conversa: resumoTexto,
      data_conversa: dataConversa ?? null
    };

    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && key !== 'resumo_conversa') {
        normalized[key] = value;
      }
    }

    return normalized;
  }

  private extractResumoConversasPayload(payload: unknown): ResumoConversasPayload | null {
    if (!payload) {
      return null;
    }

    const conversas: ResumoConversasPayload['conversas'] = [];
    let extras: Record<string, unknown> | undefined;

    const mergeExtras = (candidate?: Record<string, unknown>) => {
      if (!candidate) return;
      extras = { ...(extras ?? {}), ...candidate };
    };

    const processValue = (value: unknown) => {
      if (!value) {
        return;
      }

      const normalized = this.normalizeResumoConversa(value);
      if (normalized) {
        conversas.push(normalized);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(processValue);
        return;
      }

      if (typeof value === 'object') {
        processObject(value as Record<string, unknown>);
      }
    };

    const processObject = (obj: Record<string, unknown>) => {
      if (!obj) return;

      const keysWithArrays = ['resumo_conversas', 'conversas', 'resumos', 'historico', 'itens', 'items'];

      for (const key of keysWithArrays) {
        if (Array.isArray(obj[key])) {
          obj[key]?.forEach(processValue);
        }
      }

      const nestedKeys = ['response', 'data', 'payload', 'resultado', 'result'];
      for (const key of nestedKeys) {
        if (obj[key] !== undefined) {
          processValue(obj[key]);
        }
      }

      if ('extras' in obj && typeof obj.extras === 'object' && obj.extras !== null && !Array.isArray(obj.extras)) {
        mergeExtras(obj.extras as Record<string, unknown>);
      }

      const ignoredKeys = new Set([...keysWithArrays, ...nestedKeys, 'extras', 'success']);
      const leftovers: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (ignoredKeys.has(key)) {
          continue;
        }
        if (value === undefined) {
          continue;
        }
        if (Array.isArray(value)) {
          const beforeCount = conversas.length;
          processValue(value);
          if (conversas.length !== beforeCount) {
            continue;
          }
          leftovers[key] = value;
          continue;
        }

        if (value !== null && typeof value === 'object') {
          const beforeCount = conversas.length;
          processValue(value);
          if (conversas.length !== beforeCount) {
            continue;
          }
          leftovers[key] = value;
          continue;
        }

        leftovers[key] = value;
      }

      if (Object.keys(leftovers).length > 0) {
        mergeExtras(leftovers);
      }
    };

    processValue(payload);

    if (conversas.length === 0) {
      return null;
    }

    return {
      conversas,
      extras
    };
  }

  private normalizeMapaMentalPayload(raw: unknown): MapaMentalData | null {
    const unwrap = (value: unknown): unknown => {
      if (value === null || value === undefined) {
        return null;
      }

      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return unwrap(parsed);
        } catch {
          return null;
        }
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return null;
        }
        if (value.length === 1) {
          return unwrap(value[0]);
        }
        return unwrap(value[0]);
      }

      if (typeof value === 'object') {
        if ('data' in (value as Record<string, unknown>)) {
          return unwrap((value as Record<string, unknown>).data);
        }
        if ('output' in (value as Record<string, unknown>)) {
          return unwrap((value as Record<string, unknown>).output);
        }
        return value;
      }

      return null;
    };

    const payload = unwrap(raw);
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const candidate = payload as Record<string, unknown>;
    if (!Array.isArray(candidate.areas)) {
      return null;
    }

    const normalizeStringArray = (value: unknown): string[] => {
      if (Array.isArray(value)) {
        return value
          .map((entry) => (typeof entry === 'string' ? entry.trim() : null))
          .filter((entry): entry is string => Boolean(entry));
      }
      if (typeof value === 'string' && value.trim()) {
        return [value.trim()];
      }
      return [];
    };

    const areas = candidate.areas.map((areaEntry) => {
      if (!areaEntry || typeof areaEntry !== 'object') {
        return null;
      }
      const areaObj = areaEntry as Record<string, unknown>;
      const assuntosRaw = Array.isArray(areaObj.assuntos) ? areaObj.assuntos : [];
      const assuntos = assuntosRaw
        .map((assuntoEntry) => {
          if (!assuntoEntry || typeof assuntoEntry !== 'object') {
            return null;
          }
          const assuntoObj = assuntoEntry as Record<string, unknown>;
          return {
            assunto_central: typeof assuntoObj.assunto_central === 'string'
              ? assuntoObj.assunto_central
              : '',
            mudanca_desejada: typeof assuntoObj.mudanca_desejada === 'string'
              ? assuntoObj.mudanca_desejada
              : '',
            acoes_praticas: normalizeStringArray(assuntoObj.acoes_praticas),
            resultado_esperado: typeof assuntoObj.resultado_esperado === 'string'
              ? assuntoObj.resultado_esperado
              : '',
          };
        })
        .filter((assunto): assunto is MapaMentalData['areas'][number]['assuntos'][number] => Boolean(assunto));

      return {
        area: typeof areaObj.area === 'string' ? areaObj.area : 'Área sem nome',
        assuntos,
      };
    }).filter((area): area is MapaMentalData['areas'][number] => Boolean(area));

    return {
      usuarioId: typeof candidate.usuarioId === 'string' ? candidate.usuarioId : null,
      areas,
      geradoEm: typeof candidate.geradoEm === 'string' ? candidate.geradoEm : null,
    };
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    forceRemote = false
  ): Promise<ApiResponse> {
    try {
      const url = this.resolveUrl(endpoint, forceRemote);
      const method = (options.method || 'GET').toUpperCase();

      const defaultHeaders = method === 'GET'
        ? {}
        : { 'Content-Type': 'application/json' };

      const headers: HeadersInit | undefined = method === 'GET'
        ? options.headers as HeadersInit | undefined
        : {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {}),
          };

      // Serializar body se for objeto e não for string/FormData/Blob
      let body = options.body;
      if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
        body = JSON.stringify(body);
      }

      console.log(`[ApiService.makeRequest] ${method} ${url}`, { body, headers });

      const response = await fetch(url, {
        ...options,
        method,
        headers,
        body,
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      let payload: unknown = null;

      try {
        payload = isJson ? await response.json() : await response.text();
      } catch (parseError) {
        console.error(`Erro ao interpretar resposta de ${endpoint}:`, parseError);
      }

      if (!response.ok) {
        return {
          success: false,
          error:
            (typeof payload === 'string' && payload) ||
            (typeof payload === 'object' && payload && 'error' in (payload as Record<string, unknown>)
              ? String((payload as Record<string, unknown>).error)
              : `HTTP Error: ${response.status}`),
          response: payload
        };
      }

      return {
        success: true,
        response: payload
      };

    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Valida token e obtém dados do dashboard
   */
  public async validateTokenAndGetData(token: string): Promise<ApiResponse> {
    const endpoint = '/auth/validate';
    const result = await this.makeRequest(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json'
        }
      },
      true
    );
    
    const dashboardPayload = this.extractDashboardPayload(result.response);

    if (result.success && dashboardPayload) {
      return {
        success: true,
        response: dashboardPayload
      };
    }

    return {
      success: false,
      error: result.error || (dashboardPayload === null ? 'Formato de resposta desconhecido' : 'Falha na validação do token')
    };
  }

  /**
   * Obtém dados do dashboard para usuário autenticado
   */
  public async getDashboardData(): Promise<DashboardApiResponse | null> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const result = await this.validateTokenAndGetData(token);
    
    if (!result.success || !result.response) {
      throw new Error(result.error || 'Falha ao obter dados');
    }

    return result.response;
  }

  /**
   * Refresh dos dados do dashboard
   */
  public async refreshDashboardData(): Promise<DashboardApiResponse | null> {
    // Por enquanto, mesmo endpoint. Futuramente pode ter endpoint específico
    return this.getDashboardData();
  }

  public async getPanoramaCard(userId: string): Promise<PanoramaCardResponse> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `/card/emocoes?user_id=${encodeURIComponent(userId)}`;
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar panorama emocional');
    }

    let payload: unknown = result.response;
    if (Array.isArray(payload)) {
      payload = payload[0];
    } else if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
      payload = (payload as Record<string, unknown>).data;
    }

    if (!payload || typeof payload !== 'object' || !('card_panorama_emocional' in (payload as Record<string, unknown>))) {
      throw new Error('Formato inesperado no panorama emocional');
    }

    return payload as PanoramaCardResponse;
  }

  public async getInsightCard(userId: string): Promise<InsightCardResponse> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `/card/insight?user_id=${encodeURIComponent(userId)}`;
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar card de insights');
    }

    let payload: unknown = result.response;
    if (Array.isArray(payload)) {
      payload = payload[0];
    } else if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
      payload = (payload as Record<string, unknown>).data;
    }

    if (
      !payload ||
      typeof payload !== 'object' ||
      !('card_insight_ultima_conversa' in (payload as Record<string, unknown>))
    ) {
      throw new Error('Formato inesperado no card de insight');
    }

    return payload as InsightCardResponse;
  }

  public async getConversasCard(userId: string): Promise<ConversasCardResponse> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `/card/conversas?user_id=${encodeURIComponent(userId)}`;
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar card de conversas');
    }

    let payload: unknown = result.response;
    if (Array.isArray(payload)) {
      payload = payload[0];
    } else if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
      payload = (payload as Record<string, unknown>).data;
    }

    if (!payload || typeof payload !== 'object' || !('card_conversas' in (payload as Record<string, unknown>))) {
      throw new Error('Formato inesperado no card de conversas');
    }

    return payload as ConversasCardResponse;
  }

  public async getWeeklyProgressCard(userId: string): Promise<WeeklyProgressCardResponse> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `/card/weekly-progress?user_id=${encodeURIComponent(userId)}`;
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar card de progresso semanal');
    }

    let payload: unknown = result.response;
    if (Array.isArray(payload)) {
      payload = payload[0];
    } else if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
      payload = (payload as Record<string, unknown>).data;
    }

    if (!payload || typeof payload !== 'object' || !('card_weekly_progress' in (payload as Record<string, unknown>))) {
      throw new Error('Formato inesperado no card de progresso semanal');
    }

    return payload as WeeklyProgressCardResponse;
  }

  public async getMapaMental(userId: string): Promise<MapaMentalData> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `https://mindquest-n8n.cloudfy.live/webhook-test/mapa_mental?user_id=${encodeURIComponent(
      userId,
    )}`;
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar mapa mental');
    }

    const payload = this.normalizeMapaMentalPayload(result.response);
    if (!payload) {
      throw new Error('Formato inesperado no mapa mental');
    }

    return payload;
  }

  public async getQuestsCard(userId: string): Promise<QuestCardResponse> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `/quests?user_id=${encodeURIComponent(userId)}`;
    // Usa proxy em dev, remote em produção
    const useProxy = this.useProxyPaths && typeof window !== 'undefined';
    const result = await this.makeRequest(
      endpoint,
      undefined,
      !useProxy // forceRemote = true apenas se não usar proxy
    );

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar card de quests');
    }

    let payload: unknown = result.response;
    if (Array.isArray(payload)) {
      payload = payload[0];
    } else if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
      payload = (payload as Record<string, unknown>).data;
    }

    if (!payload || typeof payload !== 'object' || !('card_quests' in (payload as Record<string, unknown>))) {
      throw new Error('Formato inesperado no card de quests');
    }

    return payload as QuestCardResponse;
  }

  public async concluirQuest(payload: {
    usuarioId: string;
    questId: string;
    fonte?: string | null;
    comentario?: string | null;
  }): Promise<{
    success: boolean;
    quest_id: string;
    usuario_id: string;
    status: string;
    xp_adicionado: number;
    xp_base: number;
    xp_bonus: number;
    total_quests_concluidas?: number | null;
    total_quests_personalizadas?: number | null;
    historico_id?: string | null;
    quest?: Record<string, unknown>;
  }> {
    if (!payload.usuarioId) {
      throw new Error('Usuário inválido para concluir quest');
    }
    if (!payload.questId) {
      throw new Error('Quest inválida para conclusão');
    }

    const body = {
      usuario_id: payload.usuarioId,
      quest_id: payload.questId,
      fonte: payload.fonte ?? 'app_v1.3',
      comentario: payload.comentario ?? null,
    };

    const endpoint = `/concluir-quest`;
    // Em dev: usar proxy direto para n8n (handlers Vercel não funcionam localmente)
    // Em prod: usar handler Vercel /api/concluir-quest que então chama n8n
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const useProxy = isDev ? this.useProxyPaths : true; // Em dev usa proxy se configurado, em prod sempre usa /api
    
    console.log('[ApiService.concluirQuest] Chamando:', { 
      endpoint, 
      useProxy, 
      isDev,
      body, 
      forceRemote: !useProxy,
      url: useProxy ? `/api${endpoint}` : `${this.remoteBaseUrl}${endpoint}`
    });
    
    const result = await this.makeRequest(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(body), // Serializar explicitamente
      },
      !useProxy // forceRemote = true em dev (direto n8n), false em prod (via handler Vercel)
    );

    console.log('[ApiService.concluirQuest] Resultado:', result);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao concluir quest');
    }

    let data: unknown = result.response;
    if (Array.isArray(data)) {
      data = data[0];
    } else if (data && typeof data === 'object' && 'data' in (data as Record<string, unknown>)) {
      const nested = (data as Record<string, unknown>).data;
      data = Array.isArray(nested) ? nested[0] : nested;
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Resposta inesperada ao concluir quest');
    }

    return data as {
      success: boolean;
      quest_id: string;
      usuario_id: string;
      status: string;
      xp_adicionado: number;
      xp_base: number;
      xp_bonus: number;
      total_quests_concluidas?: number | null;
      total_quests_personalizadas?: number | null;
      historico_id?: string | null;
      quest?: Record<string, unknown>;
    };
  }

  public async getJornadaCard(userId: string): Promise<JornadaCardResponse> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `/card/jornada?user_id=${encodeURIComponent(userId)}`;
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar card da jornada');
    }

    let payload: unknown = result.response;
    if (Array.isArray(payload)) {
      payload = payload[0];
    } else if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
      payload = (payload as Record<string, unknown>).data;
    }

    if (!payload || typeof payload !== 'object' || !('card_jornada' in (payload as Record<string, unknown>))) {
      throw new Error('Formato inesperado no card de jornada');
    }

    return payload as JornadaCardResponse;
  }

  public async getQuestSnapshot(usuarioId: string): Promise<QuestSnapshot> {
    if (!usuarioId) {
      throw new Error('Usuário inválido');
    }

    const endpoint = `/quests?usuario_id=${encodeURIComponent(usuarioId)}`;

    const result = await this.makeRequest(
      endpoint,
      {
        method: 'GET',
      },
      true
    );

    if (!result.success) {
      throw new Error(result.error || 'Erro ao consultar quests');
    }

    const snapshot = this.extractQuestSnapshot(result.response);
    if (!snapshot) {
      console.warn('[ApiService] Resposta de quests fora do formato esperado', result.response);
      throw new Error('Resposta de quests fora do formato esperado');
    }

    return snapshot;
  }

  public async getHumorHistorico(
    userId: string,
    inicio?: string,
    fim?: string
  ): Promise<HumorHistoricoPayload> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const params = new URLSearchParams({ user_id: userId });
    if (inicio) {
      params.set('data_inicio', inicio);
    }
    if (fim) {
      params.set('data_fim', fim);
    }

    const endpoint = `/humor-historico?${params.toString()}`;
    console.info('[API] requisitando histórico de humor:', `${this.remoteBaseUrl}${endpoint}`);
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar histórico de humor');
    }

    const payload = this.extractHumorHistoricoPayload(result.response);
    if (!payload) {
      throw new Error('Formato inesperado no histórico de humor');
    }

    return payload;
  }

  public async getResumoConversas(
    userId: string
  ): Promise<ResumoConversasPayload> {
    if (!userId) {
      throw new Error('Usuário inválido');
    }

    const params = new URLSearchParams({ user_id: userId });
    const endpoint = `/resumo_conversas?${params.toString()}`;
    console.info('[API] requisitando resumo de conversas:', `${this.remoteBaseUrl}${endpoint}`);
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar resumo das conversas');
    }

    const payload = this.extractResumoConversasPayload(result.response);
    if (!payload) {
      throw new Error('Formato inesperado no resumo das conversas');
    }

    return payload;
  }

  public async getResumoConversaById(
    conversaId: string
  ): Promise<ResumoConversasPayload['conversas'][number]> {
    if (!conversaId) {
      throw new Error('Conversa inválida');
    }

    const params = new URLSearchParams({ conversa_id: conversaId });
    const endpoint = `/resumo_conversas?${params.toString()}`;
    console.info('[API] requisitando resumo individual de conversa:', `${this.remoteBaseUrl}${endpoint}`);
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar resumo da conversa');
    }

    const payload = this.extractResumoConversasPayload(result.response);
    const conversa = payload?.conversas?.[0];
    if (!conversa) {
      throw new Error('Resumo da conversa não encontrado');
    }

    return conversa;
  }

  // Conversa completa por chat_id
  public async getFullChat(chatId: string): Promise<any> {
    if (!chatId) throw new Error('chat_id inválido');
    const endpoint = `/full_chat?chat_id=${encodeURIComponent(chatId)}`;
    console.info('[API] requisitando conversa completa:', `${this.remoteBaseUrl}${endpoint}`);
    const result = await this.makeRequest(endpoint, undefined, true);
    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar conversa completa');
    }
    const data = Array.isArray(result.response) ? result.response[0] : result.response;
    if (!data) throw new Error('Conversa não encontrada');
    return data;
  }

  public async getInsightDetail(
    userId: string,
    insightId: string
  ): Promise<InsightDetail> {
    if (!userId || !insightId) {
      throw new Error('Parâmetros inválidos para carregar insight');
    }

    const params = new URLSearchParams({
      user_id: userId,
      insight_id: insightId
    });

    const endpoint = `/insights?${params.toString()}`;
    console.info('[API] requisitando insight detalhado:', `${this.remoteBaseUrl}${endpoint}`);
    const result = await this.makeRequest(endpoint, undefined, true);

    if (!result.success) {
      throw new Error(result.error || 'Falha ao carregar detalhe do insight');
    }

    let detail: unknown = result.response;

    if (Array.isArray(detail)) {
      detail = detail[0];
    } else if (detail && typeof detail === 'object' && 'data' in (detail as Record<string, unknown>)) {
      const nested = (detail as Record<string, unknown>).data;
      detail = Array.isArray(nested) ? nested[0] : nested;
    }

    if (!detail || typeof detail !== 'object') {
      throw new Error('Insight não encontrado ou formato inesperado');
    }

    return detail as InsightDetail;
  }

  /**
   * Health check da API
   */
  public async healthCheck(): Promise<boolean> {
    try {
      // Teste básico com token inválido para verificar se API responde
      const result = await this.makeRequest('/auth/validate?token=test');
      // Se chegou até aqui, API está respondendo (mesmo que com erro)
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Configura nova base URL (útil para testes/desenvolvimento)
   */
  public setBaseUrl(url: string): void {
    if (!url) {
      return;
    }
    this.remoteBaseUrl = url.replace(/\/$/, '');
    this.useProxyPaths = false;
  }

  /**
   * Obtém a base URL atual
   */
  public getBaseUrl(): string {
    return this.remoteBaseUrl;
  }
}

// Exporta a instância singleton
export const apiService = ApiService.getInstance();
export default apiService;
