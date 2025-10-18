/**
 * ARQUIVO: src/services/apiService.ts
 * AÇÃO: CRIAR novo arquivo
 * 
 * Serviço de comunicação com API N8N
 * Centraliza todas as chamadas para o webhook de validação e outros endpoints
 */

import { authService } from './authService';
import type { HumorHistoricoPayload, InsightDetail, ResumoConversasPayload } from '../types/emotions';

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
    if (forceRemote) {
      return `${this.remoteBaseUrl}${endpoint}`;
    }

    if (this.useProxyPaths && typeof window !== 'undefined') {
      return `/api${endpoint}`;
    }

    return `${this.remoteBaseUrl}${endpoint}`;
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

      const response = await fetch(url, {
        ...options,
        method,
        headers,
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
