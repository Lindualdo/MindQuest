/**
 * ARQUIVO: src/services/apiService.ts
 * AÇÃO: CRIAR novo arquivo
 * 
 * Serviço de comunicação com API N8N
 * Centraliza todas as chamadas para o webhook de validação e outros endpoints
 */

import { authService } from './authService';
import type { HumorHistoricoPayload } from '../types/emotions';

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
    xp_total: string | null;
    nivel_atual: string | null;
    streak_conversas_dias: string | null;
    conquistas_desbloqueadas: string | null;
    quest_diaria_status: string | null;
    quest_diaria_progresso: string | null;
    quest_diaria_descricao?: string | null;
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

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Executa uma requisição HTTP genérica
   */
  private resolveUrl(endpoint: string): string {
    if (typeof window !== 'undefined') {
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

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    forceRemote = false
  ): Promise<ApiResponse> {
    try {
      const url = forceRemote ? `${this.remoteBaseUrl}${endpoint}` : this.resolveUrl(endpoint);
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

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        response: data
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
    const endpoint = `/auth/validate?token=${encodeURIComponent(token)}`;
    const result = await this.makeRequest(endpoint, undefined, true);
    
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
    this.remoteBaseUrl = url;
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
