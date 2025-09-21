import { create } from 'zustand';
import type { StoreState, PeriodType, DashboardData } from '../types/emotions';
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
  insights: [],
  humor_diario: []
};

const getDashboardData = (period: PeriodType): DashboardData => {
  return mockData?.[period] ?? initialDashboardData;
};

export const useStore = create<StoreState>((set) => ({
  isLoading: false,
  currentPeriod: 'semana',
  dashboardData: getDashboardData('semana'),

  setPeriod: (period: PeriodType) => {
    set({ currentPeriod: period });
  },

  fetchData: async (period: PeriodType) => {
    set({ isLoading: true });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const data = getDashboardData(period);
    set({
      dashboardData: data,
      isLoading: false
    });
  }
}));
