/**
 * ARQUIVO: src/services/apiService.ts
 * AÇÃO: CRIAR novo arquivo
 * 
 * Serviço de comunicação com API N8N
 * Centraliza todas as chamadas para o webhook de validação e outros endpoints
 */

import { authService } from './authService';

interface ApiResponse {
  success: boolean;
  response?: any;
  error?: string;
}

interface DashboardApiResponse {
  success: boolean;
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
    streak_checkins_dias: string | null;
    conquistas_desbloqueadas: string | null;
    quest_diaria_status: string | null;
    quest_diaria_progresso: string | null;
  };
  sabotador: {
    id: string | null;
    nome: string | null;
    emoji: string | null;
    apelido_personalizado: string | null;
    total_deteccoes: string | null;
  };
  metricas_semana: {
    checkins_total: string;
    checkins_respondidos: string;
    humor_medio: string | null;
    ultima_emocao: string | null;
    ultimo_checkin_data: string | null;
    ultimo_checkin_emoji: string | null;
  };
  timestamp: string;
}

class ApiService {
  private static instance: ApiService;
  private baseUrl = 'https://metodovoar-n8n.cloudfy.live/webhook-test';

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
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const method = (options.method || 'GET').toUpperCase();

      const defaultHeaders = method === 'GET'
        ? {}
        : { 'Content-Type': 'application/json' };

      const response = await fetch(url, {
        ...options,
        method,
        headers: {
          ...defaultHeaders,
          ...(options.headers || {}),
        },
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
    const result = await this.makeRequest(endpoint);
    
    if (result.success && result.response?.success) {
      return {
        success: true,
        response: result.response as DashboardApiResponse
      };
    }

    return {
      success: false,
      error: result.error || result.response?.error || 'Falha na validação do token'
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
    this.baseUrl = url;
  }

  /**
   * Obtém a base URL atual
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Exporta a instância singleton
export const apiService = ApiService.getInstance();
export default apiService;
