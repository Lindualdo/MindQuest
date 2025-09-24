/**
 * ARQUIVO: src/store/useStore.ts
 * AÇÃO: SUBSTITUIR arquivo existente
 * 
 * Store corrigido com todas as importações e tipos
 */

import { create } from 'zustand';
import type { StoreState, DashboardData } from '../types/emotions';

// Importações dos serviços (usando sintaxe compatível)
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { dataAdapter } from '../utils/dataAdapter';

interface ExtendedStoreState extends StoreState {
  // Estados adicionais para API
  error: string | null;
  isAuthenticated: boolean;
  lastUpdated: string;
  
  // Actions adicionais
  setError: (error: string | null) => void;
  setAuthenticated: (auth: boolean) => void;
  initializeAuth: () => Promise<boolean>;
  loadDashboardData: () => Promise<void>;
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

  // Actions básicas
  setError: (error) => {
    set({ error, isLoading: false });
  },

  setAuthenticated: (auth) => {
    set({ isAuthenticated: auth });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
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
    ultimaAtualizacao 
  } = useStore();
  
  return {
    dashboardData,
    isLoading,
    error,
    refreshData,
    setPeriodo,
    periodo,
    ultimaAtualizacao
  };
};

export { useStore };
export default useStore;