export type PeriodType = 'semana' | 'mes' | 'trimestre';

export interface EmotionData {
  frequencia: number;
  intensidade: number;
}

export interface PANASDistribution {
  positivas: number;
  negativas: number;
  neutras: number;
}

export interface Insight {
  tipo: 'padrao' | 'melhoria' | 'positivo' | 'alerta';
  titulo: string;
  descricao: string;
  icone: string;
}

export interface DailyMoodMetric {
  dia: string;
  humorMedio: number;
  emocaoPredominante: string;
  intensidade: number; // escala 0-10
}

export interface DashboardData {
  humor_medio: number;
  variacao_anterior: number;
  distribuicao_panas: PANASDistribution;
  emocoes_primarias: Record<string, EmotionData>;
  insights: Insight[];
  humor_diario: DailyMoodMetric[];
}

export interface StoreState {
  isLoading: boolean;
  currentPeriod: PeriodType;
  dashboardData: DashboardData;
  setPeriod: (period: PeriodType) => void;
  fetchData: (period: PeriodType) => Promise<void>;
}
