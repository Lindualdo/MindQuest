/**
 * ARQUIVO: src/store/useStore.ts
 * AÇÃO: SUBSTITUIR arquivo existente
 * 
 * Store corrigido com todas as importações e tipos
 */

import { create } from 'zustand';
import type { StoreState, DashboardData, ResumoConversasPayload } from '../types/emotions';

// Importações dos serviços (usando sintaxe compatível)
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { dataAdapter } from '../utils/dataAdapter';

interface ExtendedStoreState extends StoreState {
  // Estados adicionais para API
  error: string | null;
  isAuthenticated: boolean;
  lastUpdated: string;
  selectedSabotadorId: string | null;
  
  // Actions adicionais
  setError: (error: string | null) => void;
  setAuthenticated: (auth: boolean) => void;
  initializeAuth: () => Promise<boolean>;
  loadDashboardData: () => Promise<void>;
  openSabotadorDetail: (sabotadorId?: string) => void;
  // Full chat detail
  openFullChat: (chatId: string) => Promise<void>;
  closeFullChat: () => void;
}

const useStore = create<ExtendedStoreState>((set, get) => ({
  // Estado inicial
  dashboardData: {} as DashboardData,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  periodo: 'semana',
  ultimaAtualizacao: '',
  lastUpdated: '',
  view: 'dashboard',
  humorHistorico: null,
  humorHistoricoPeriodo: null,
  humorHistoricoLoading: false,
  humorHistoricoError: null,
  selectedInsightId: null,
  insightDetail: null,
  insightDetailLoading: false,
  insightDetailError: null,
  selectedSabotadorId: null,
  resumoConversas: null,
  resumoConversasLoading: false,
  resumoConversasError: null,
  // full chat
  selectedChatId: null,
  fullChatDetail: null,
  fullChatLoading: false,
  fullChatError: null,

  // Actions básicas
  setError: (error) => {
    set({ error, isLoading: false });
  },

  openFullChat: async (chatId) => {
    set({ view: 'fullChatDetail', selectedChatId: chatId, fullChatLoading: true, fullChatError: null });
    try {
      const data = await apiService.getFullChat(chatId);
      set({ fullChatDetail: data, fullChatLoading: false });
    } catch (error) {
      set({ fullChatLoading: false, fullChatError: error instanceof Error ? error.message : 'Erro ao carregar conversa' });
    }
  },

  closeFullChat: () => {
    set({ view: 'resumoConversas', selectedChatId: null, fullChatDetail: null, fullChatError: null });
  },

  setAuthenticated: (auth) => {
    set({ isAuthenticated: auth });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setView: (view) => {
    set({ view });
  },

  /**
   * Inicializa autenticação
   */
  initializeAuth: async (): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const token = authService.extractTokenFromUrl() || authService.getToken();
      
      if (!token) {
        set({ 
          isLoading: false, 
          error: 'Token de acesso não encontrado',
          isAuthenticated: false
        });
        return false;
      }

      const validation = await authService.validateToken(token);
      
      if (!validation.success) {
        set({ 
          isLoading: false, 
          error: validation.error || 'Token inválido',
          isAuthenticated: false
        });
        return false;
      }

      set({ 
        isLoading: false, 
        error: null,
        isAuthenticated: true
      });
      
      await get().loadDashboardData();
      return true;

    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error);
      set({ 
        isLoading: false, 
        error: 'Erro ao conectar com o servidor',
        isAuthenticated: false
      });
      return false;
    }
  },

  /**
   * Carrega dados do dashboard da API
   */
  loadDashboardData: async (): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const apiData = await apiService.getDashboardData();
      
      if (!apiData) {
        throw new Error('Nenhum dado retornado pela API');
      }

     const dashboardData = dataAdapter.convertApiToDashboard(apiData);
      set({
        dashboardData,
        isLoading: false,
        error: null,
        ultimaAtualizacao: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar dados'
      });
    }
  },

  /**
   * Atualiza período selecionado
   */
  setPeriodo: (periodo) => {
    set({ isLoading: true, periodo });
    
    setTimeout(() => {
      const { dashboardData } = get();
      
      if (dashboardData && dashboardData.metricas_periodo) {
        const updatedData: DashboardData = {
          ...dashboardData,
          metricas_periodo: {
            ...dashboardData.metricas_periodo,
            periodo_selecionado: periodo,
            data_inicio: periodo === 'semana' ? 
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
              periodo === 'mes' ? 
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
              new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        };

        set({
          dashboardData: updatedData,
          isLoading: false,
          ultimaAtualizacao: new Date().toISOString()
        });
      } else {
        set({ isLoading: false });
      }
    }, 800);
  },

  /**
   * Atualiza dados do dashboard (merge parcial)
   */
  updateDashboardData: (data) => {
    const { dashboardData } = get();
    set({
      dashboardData: { ...dashboardData, ...data },
      ultimaAtualizacao: new Date().toISOString()
    });
  },

  /**
   * Refresh completo dos dados
   */
  refreshData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await get().loadDashboardData();
    } catch (error) {
      console.error('Erro no refresh:', error);
      set({
        isLoading: false,
        error: 'Erro ao atualizar dados'
      });
    }
  },

  loadHumorHistorico: async (options) => {
    const { dashboardData } = get();
    let userId = dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      console.warn('[HumorHistorico] usuário indisponível, abortando');
      return;
    }

    try {
      console.log('[HumorHistorico] carregando', { userId, options });
      set({ humorHistoricoLoading: true, humorHistoricoError: null });
      const payload = await apiService.getHumorHistorico(
        userId,
        options?.inicio,
        options?.fim
      );
      console.log('[HumorHistorico] sucesso', payload);

      set({
        humorHistorico: payload,
        humorHistoricoPeriodo: payload.periodo,
        humorHistoricoLoading: false,
        humorHistoricoError: null
      });
    } catch (error) {
      console.error('Erro ao carregar histórico de humor:', error);
      set({
        humorHistoricoLoading: false,
        humorHistoricoError: error instanceof Error ? error.message : 'Erro ao carregar histórico'
      });
    }
  }

  ,

  openInsightDetail: async (insightId) => {
    const { dashboardData } = get();
    const userId = dashboardData?.usuario?.id;

    if (!userId) {
      console.warn('[openInsightDetail] usuário indisponível');
      return;
    }

    set({
      view: 'insightDetail',
      selectedInsightId: insightId,
      insightDetailLoading: true,
      insightDetailError: null
    });

    try {
      const detail = await apiService.getInsightDetail(userId, insightId);
      set({
        insightDetail: detail,
        insightDetailLoading: false,
        insightDetailError: null
      });
    } catch (error) {
      console.error('Erro ao carregar insight detalhado:', error);
      set({
        insightDetailLoading: false,
        insightDetailError: error instanceof Error ? error.message : 'Erro ao carregar insight',
        insightDetail: null
      });
    }
  },

  closeInsightDetail: () => {
    set({
      view: 'dashboard',
      selectedInsightId: null,
      insightDetail: null,
      insightDetailError: null,
      insightDetailLoading: false
    });
  },

  openSabotadorDetail: (sabotadorId) => {
    const { dashboardData } = get();
    const fallbackId = dashboardData?.sabotadores?.padrao_principal?.id ?? null;

    if (!sabotadorId && !fallbackId) {
      console.warn('[openSabotadorDetail] sabotador indisponível');
      set({ view: 'dashboard' });
      return;
    }

    set({
      selectedSabotadorId: sabotadorId ?? fallbackId,
      view: 'sabotadorDetail'
    });
  },

  loadResumoConversas: async () => {
    const { dashboardData } = get();
    let userId = dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      console.warn('[ResumoConversas] usuário indisponível, abortando');
      set({
        resumoConversasLoading: false,
        resumoConversasError: 'Usuário não encontrado'
      });
      return;
    }

    try {
      console.log('[ResumoConversas] carregando', { userId });
      set({
        resumoConversasLoading: true,
        resumoConversasError: null
      });
      const resumo: ResumoConversasPayload = await apiService.getResumoConversas(userId);
      set({
        resumoConversas: resumo,
        resumoConversasLoading: false,
        resumoConversasError: null
      });
    } catch (error) {
      console.error('Erro ao carregar resumo das conversas:', error);
      set({
        resumoConversasLoading: false,
        resumoConversasError: error instanceof Error ? error.message : 'Erro ao carregar resumo das conversas'
      });
    }
  },

  openResumoConversas: async () => {
    set({
      view: 'resumoConversas',
      resumoConversasError: null
    });
    await get().loadResumoConversas();
  },

  closeResumoConversas: () => {
    set({
      view: 'dashboard'
    });
  }
}));

// Hook customizado para verificar autenticação
export const useAuth = () => {
  const { isAuthenticated, isLoading, error, initializeAuth } = useStore();
  
  return {
    isAuthenticated,
    isLoading,
    error,
    initializeAuth
  };
};

// Hook customizado para dados do dashboard
export const useDashboard = () => {
  const { 
    dashboardData, 
    isLoading, 
    error, 
    refreshData, 
    setPeriodo, 
    periodo,
    ultimaAtualizacao,
    view,
    setView,
    humorHistorico,
    humorHistoricoLoading,
    humorHistoricoError,
    loadHumorHistorico,
    openInsightDetail,
    closeInsightDetail,
    selectedInsightId,
    insightDetail,
    insightDetailLoading,
    insightDetailError
  ,
    selectedSabotadorId,
    openSabotadorDetail,
    resumoConversas,
    resumoConversasLoading,
    resumoConversasError,
    openResumoConversas,
    closeResumoConversas,
    loadResumoConversas,
    // full chat
    openFullChat,
    closeFullChat,
    selectedChatId,
    fullChatDetail,
    fullChatLoading,
    fullChatError
  } = useStore();
  
  return {
    dashboardData,
    isLoading,
    error,
    refreshData,
    setPeriodo,
    periodo,
    ultimaAtualizacao,
    view,
    setView,
    humorHistorico,
    humorHistoricoLoading,
    humorHistoricoError,
    loadHumorHistorico,
    openInsightDetail,
    closeInsightDetail,
    selectedInsightId,
    insightDetail,
    insightDetailLoading,
    insightDetailError,
    selectedSabotadorId,
    openSabotadorDetail,
    resumoConversas,
    resumoConversasLoading,
    resumoConversasError,
    openResumoConversas,
    closeResumoConversas,
    loadResumoConversas,
    openFullChat,
    closeFullChat,
    selectedChatId,
    fullChatDetail,
    fullChatLoading,
    fullChatError
  };
};

export { useStore };
export default useStore;
