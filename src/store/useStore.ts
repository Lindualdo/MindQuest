import { create } from 'zustand';
import { StoreState, PeriodType, DashboardData } from '../types/emotions';
import { mockData } from '../data/mockData';

const initialDashboardData: DashboardData = {
  humor_medio: 0,
  variacao_anterior: 0,
  distribuicao_panas: {
    positivas: 0,
    negativas: 0,
    neutras: 0
  },
  emocoes_primarias: {},
  insights: []
};

export const useStore = create<StoreState>((set) => ({
  isLoading: false,
  currentPeriod: 'semana',
  dashboardData: mockData.semana,

  setPeriod: (period: PeriodType) => {
    set({ currentPeriod: period });
  },

  fetchData: async (period: PeriodType) => {
    set({ isLoading: true });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const data = mockData[period] || initialDashboardData;
    set({
      dashboardData: data,
      isLoading: false
    });
  }
}));