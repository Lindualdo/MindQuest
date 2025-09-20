import { DashboardData } from '../types/emotions';

export const mockData: Record<string, DashboardData> = {
  semana: {
    humor_medio: 2.3,
    variacao_anterior: 0.8,
    distribuicao_panas: {
      positivas: 65,
      negativas: 25,
      neutras: 10
    },
    emocoes_primarias: {
      alegria: { frequencia: 8, intensidade: 7.5 },
      confianca: { frequencia: 6, intensidade: 6.8 },
      medo: { frequencia: 3, intensidade: 4.2 },
      surpresa: { frequencia: 4, intensidade: 5.5 },
      tristeza: { frequencia: 2, intensidade: 3.8 },
      nojo: { frequencia: 1, intensidade: 2.5 },
      raiva: { frequencia: 2, intensidade: 4.0 },
      antecipacao: { frequencia: 7, intensidade: 7.2 }
    },
    insights: [
      {
        tipo: 'positivo',
        titulo: 'Semana Excelente!',
        descricao: 'Você manteve um humor positivo durante 85% da semana. Continue assim!',
        icone: '🏆'
      },
      {
        tipo: 'padrao',
        titulo: 'Pico de Alegria',
        descricao: 'Suas emoções de alegria atingiram o pico nas terças e quintas-feiras.',
        icone: '📈'
      },
      {
        tipo: 'melhoria',
        titulo: 'Oportunidade de Crescimento',
        descricao: 'Momentos de medo podem ser trabalhados com técnicas de respiração.',
        icone: '🎯'
      }
    ]
  },
  mes: {
    humor_medio: 1.8,
    variacao_anterior: -0.3,
    distribuicao_panas: {
      positivas: 58,
      negativas: 32,
      neutras: 10
    },
    emocoes_primarias: {
      alegria: { frequencia: 12, intensidade: 6.8 },
      confianca: { frequencia: 10, intensidade: 6.2 },
      medo: { frequencia: 8, intensidade: 5.5 },
      surpresa: { frequencia: 6, intensidade: 5.0 },
      tristeza: { frequencia: 7, intensidade: 4.8 },
      nojo: { frequencia: 3, intensidade: 3.2 },
      raiva: { frequencia: 5, intensidade: 4.5 },
      antecipacao: { frequencia: 11, intensidade: 6.5 }
    },
    insights: [
      {
        tipo: 'padrao',
        titulo: 'Estabilidade Emocional',
        descricao: 'Seu humor tem se mantido estável ao longo do mês.',
        icone: '⚖️'
      },
      {
        tipo: 'alerta',
        titulo: 'Atenção ao Stress',
        descricao: 'Detectamos alguns picos de ansiedade. Considere técnicas de relaxamento.',
        icone: '⚠️'
      },
      {
        tipo: 'melhoria',
        titulo: 'Foco na Positividade',
        descricao: 'Tente incluir mais atividades que geram alegria no seu dia.',
        icone: '🌟'
      }
    ]
  },
  trimestre: {
    humor_medio: 1.5,
    variacao_anterior: 0.2,
    distribuicao_panas: {
      positivas: 52,
      negativas: 38,
      neutras: 10
    },
    emocoes_primarias: {
      alegria: { frequencia: 25, intensidade: 6.2 },
      confianca: { frequencia: 22, intensidade: 5.8 },
      medo: { frequencia: 18, intensidade: 5.8 },
      surpresa: { frequencia: 15, intensidade: 4.8 },
      tristeza: { frequencia: 16, intensidade: 5.2 },
      nojo: { frequencia: 8, intensidade: 3.8 },
      raiva: { frequencia: 12, intensidade: 4.8 },
      antecipacao: { frequencia: 24, intensidade: 6.0 }
    },
    insights: [
      {
        tipo: 'padrao',
        titulo: 'Evolução Gradual',
        descricao: 'Você mostrou melhoria constante no bem-estar ao longo do trimestre.',
        icone: '📊'
      },
      {
        tipo: 'positivo',
        titulo: 'Meta Alcançada',
        descricao: 'Parabéns! Você completou 90 dias de registro emocional consecutivos.',
        icone: '🎉'
      },
      {
        tipo: 'melhoria',
        titulo: 'Próximo Nível',
        descricao: 'Que tal definir uma nova meta para o próximo trimestre?',
        icone: '🚀'
      }
    ]
  }
};

export const emotionColors = {
  alegria: '#10b981',
  tristeza: '#6366f1',
  raiva: '#ef4444',
  medo: '#f59e0b',
  nojo: '#84cc16',
  surpresa: '#ec4899',
  antecipacao: '#06b6d4',
  confianca: '#8b5cf6'
};

export const emotionLabels = {
  alegria: 'Alegria',
  tristeza: 'Tristeza',
  raiva: 'Raiva',
  medo: 'Medo',
  nojo: 'Nojo',
  surpresa: 'Surpresa',
  antecipacao: 'Antecipação',
  confianca: 'Confiança'
};