/**
 * ARQUIVO: src/store/useStore.ts
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Store global baseado na Especificação v1.1
 * Gerenciamento de estado com Zustand
 */

import { create } from 'zustand';
import { StoreState, DashboardData } from '../types/emotions';
import { mockDashboardData } from '../data/mockData';

const useStore = create<StoreState>((set, get) => ({
  // Estado inicial
  dashboardData: mockDashboardData,
  isLoading: false,
  periodo: 'semana',
  ultimaAtualizacao: new Date().toISOString(),

  // Actions
  setPeriodo: (periodo) => {
    set({ isLoading: true });
    
    // Simula chamada à API com delay
    setTimeout(() => {
      const { dashboardData } = get();
      
      // Atualiza dados baseados no período selecionado
      const updatedData: DashboardData = {
        ...dashboardData,
        metricas_periodo: {
          ...dashboardData.metricas_periodo,
          periodo_selecionado: periodo,
          // Simula dados diferentes por período
          data_inicio: periodo === 'semana' ? '2025-09-16' : 
                      periodo === 'mes' ? '2025-08-22' : '2025-06-22',
          data_fim: '2025-09-22',
          total_checkins: periodo === 'semana' ? 7 : 
                         periodo === 'mes' ? 30 : 90,
          taxa_resposta: periodo === 'semana' ? 85.7 : 
                        periodo === 'mes' ? 78.3 : 82.1,
          humor_medio: periodo === 'semana' ? 7.5 : 
                      periodo === 'mes' ? 6.8 : 7.2
        }
      };

      set({
        periodo,
        dashboardData: updatedData,
        isLoading: false,
        ultimaAtualizacao: new Date().toISOString()
      });
    }, 800);
  },

  updateDashboardData: (data) => {
    const { dashboardData } = get();
    set({
      dashboardData: { ...dashboardData, ...data },
      ultimaAtualizacao: new Date().toISOString()
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  refreshData: async () => {
    set({ isLoading: true });
    
    // Simula refresh dos dados
    return new Promise((resolve) => {
      setTimeout(() => {
        const { dashboardData } = get();
        
        // Simula pequenas mudanças nos dados
        const updatedData: DashboardData = {
          ...dashboardData,
          mood_gauge: {
            ...dashboardData.mood_gauge,
            nivel_atual: Math.max(-5, Math.min(5, 
              dashboardData.mood_gauge.nivel_atual + (Math.random() - 0.5) * 0.5
            )),
            tendencia_semanal: Math.random() * 2 - 1
          },
          gamificacao: {
            ...dashboardData.gamificacao,
            xp_total: dashboardData.gamificacao.xp_total + Math.floor(Math.random() * 50),
            quest_diaria_progresso: Math.min(100, 
              dashboardData.gamificacao.quest_diaria_progresso + Math.floor(Math.random() * 20)
            )
          }
        };

        set({
          dashboardData: updatedData,
          isLoading: false,
          ultimaAtualizacao: new Date().toISOString()
        });
        
        resolve(undefined);
      }, 1200);
    });
  }
}));

export { useStore };