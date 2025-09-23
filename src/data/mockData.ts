/**
 * ARQUIVO: src/data/mockData.ts
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Dados mockados baseados na Especificação v1.1
 * Inclui perfis Big Five, conversas personalizadas e sistema de gamificação
 */

import type {
  DashboardData,
  PlutchikEmotion,
  CheckinDiario,
  DistribuicaoPanas,
  Gamificacao,
  Insight,
  AlertaPreventivo,
  PerfilDetectado,
  SabotadorPadrao
} from '../types/emotions';

// Emoções de Plutchik - 8 primárias
const rodaEmocoesPadrao: PlutchikEmotion[] = [
  {
    id: 'joy',
    nome: 'Alegria',
    cor: '#FFD700',
    emoji: '😊',
    intensidade: 75,
    categoria: 'primaria'
  },
  {
    id: 'trust',
    nome: 'Confiança',
    cor: '#90EE90',
    emoji: '🤗',
    intensidade: 65,
    categoria: 'primaria'
  },
  {
    id: 'fear',
    nome: 'Medo',
    cor: '#FF6347',
    emoji: '😨',
    intensidade: 25,
    categoria: 'primaria'
  },
  {
    id: 'surprise',
    nome: 'Surpresa',
    cor: '#FF69B4',
    emoji: '😲',
    intensidade: 40,
    categoria: 'primaria'
  },
  {
    id: 'sadness',
    nome: 'Tristeza',
    cor: '#4169E1',
    emoji: '😢',
    intensidade: 20,
    categoria: 'primaria'
  },
  {
    id: 'disgust',
    nome: 'Nojo',
    cor: '#8B4513',
    emoji: '🤢',
    intensidade: 15,
    categoria: 'primaria'
  },
  {
    id: 'anger',
    nome: 'Raiva',
    cor: '#DC143C',
    emoji: '😠',
    intensidade: 30,
    categoria: 'primaria'
  },
  {
    id: 'anticipation',
    nome: 'Expectativa',
    cor: '#FFA500',
    emoji: '🤔',
    intensidade: 55,
    categoria: 'primaria'
  }
];

// Perfil detectado baseado no Big Five
const perfilDetectado: PerfilDetectado = {
  perfil_primario: 'disciplinado',
  perfil_secundario: 'perfeccionista',
  confiabilidade_geral: 87,
  metodo_deteccao: 'onboarding',
  big_five_scores: {
    openness: 75,           // Alto - criativo, aberto a experiências
    conscientiousness: 85,  // Muito alto - organizado, disciplinado
    extraversion: 60,       // Moderado - social mas também introvertido
    agreeableness: 80,      // Alto - empático, colaborativo
    neuroticism: 35,        // Baixo - estável emocionalmente
    confiabilidade: 87
  }
};

// Conversas dos últimos 7 dias
const checkinsHistorico: CheckinDiario[] = [
  {
    id_checkin: 'ci_001',
    data_checkin: '2025-09-22',
    horario_envio: '09:00',
    horario_resposta: '09:15',
    humor_autoavaliado: 8,
    emocao_primaria_detectada: 'joy',
    intensidade_emocao: 8,
    energia_detectada: 7,
    qualidade_interacao: 9,
    status_resposta: 'respondido',
    emoji_dia: '😊',
    resposta_texto: 'Me sentindo bem hoje! Pronto para mais um dia produtivo.'
  },
  {
    id_checkin: 'ci_002',
    data_checkin: '2025-09-21',
    horario_envio: '09:00',
    horario_resposta: '09:45',
    humor_autoavaliado: 6,
    emocao_primaria_detectada: 'trust',
    intensidade_emocao: 6,
    energia_detectada: 6,
    qualidade_interacao: 7,
    status_resposta: 'respondido',
    emoji_dia: '😐',
    resposta_texto: 'Dia neutro, mas estou seguindo minha rotina.'
  },
  {
    id_checkin: 'ci_003',
    data_checkin: '2025-09-20',
    horario_envio: '09:00',
    horario_resposta: '08:50',
    humor_autoavaliado: 9,
    emocao_primaria_detectada: 'joy',
    intensidade_emocao: 9,
    energia_detectada: 8,
    qualidade_interacao: 10,
    status_resposta: 'respondido',
    emoji_dia: '😊',
    resposta_texto: 'Excelente! Consegui completar todas as metas de ontem.'
  },
  {
    id_checkin: 'ci_004',
    data_checkin: '2025-09-19',
    horario_envio: '09:00',
    horario_resposta: '12:30',
    humor_autoavaliado: 7,
    emocao_primaria_detectada: 'anticipation',
    intensidade_emocao: 7,
    energia_detectada: 7,
    qualidade_interacao: 8,
    status_resposta: 'respondido',
    emoji_dia: '😊',
    resposta_texto: 'Animado com os projetos da semana!'
  },
  {
    id_checkin: 'ci_005',
    data_checkin: '2025-09-18',
    horario_envio: '09:00',
    status_resposta: 'perdido',
    humor_autoavaliado: 0,
    emocao_primaria_detectada: '',
    intensidade_emocao: 0,
    energia_detectada: 0,
    qualidade_interacao: 0,
    emoji_dia: '❌'
  },
  {
    id_checkin: 'ci_006',
    data_checkin: '2025-09-17',
    horario_envio: '09:00',
    horario_resposta: '09:10',
    humor_autoavaliado: 8,
    emocao_primaria_detectada: 'joy',
    intensidade_emocao: 8,
    energia_detectada: 8,
    qualidade_interacao: 9,
    status_resposta: 'respondido',
    emoji_dia: '😊',
    resposta_texto: 'Começando bem a semana!'
  },
  {
    id_checkin: 'ci_007',
    data_checkin: '2025-09-16',
    horario_envio: '09:00',
    horario_resposta: '09:25',
    humor_autoavaliado: 7,
    emocao_primaria_detectada: 'trust',
    intensidade_emocao: 7,
    energia_detectada: 6,
    qualidade_interacao: 8,
    status_resposta: 'respondido',
    emoji_dia: '😊',
    resposta_texto: 'Domingo tranquilo, me preparando para a semana.'
  }
];

// Distribuição PANAS atualizada
const distribuicaoPanas: DistribuicaoPanas = {
  positivas: 72,
  negativas: 18,
  neutras: 10,
  meta_positividade: 70,
  status_meta: 'atingida'
};

// Sistema de gamificação
const gamificacao: Gamificacao = {
  xp_total: 1240,
  nivel_atual: 8,
  streak_checkins_dias: 12,
  conquistas_desbloqueadas: [
    'primeira_semana',
    'streak_7_dias',
    'explorador_emocoes',
    'consistencia_bronze',
    'reflexao_profunda'
  ],
  quest_diaria_status: 'parcial',
  quest_diaria_progresso: 67,
  quest_diaria_descricao: 'Complete sua conversa diária e faça uma reflexão sobre sua energia hoje',
  proximo_nivel_xp: 1500
};

// Sabotador principal
const sabotadorPrincipal: SabotadorPadrao = {
  id: 'critico',
  nome: 'Crítico',
  emoji: '🎭',
  apelido: 'Sr. Exigente',
  detectado_em: 4,
  total_conversas: 7,
  insight_contexto: 'Seu Sr. Exigente apareceu principalmente em contextos de trabalho esta semana.',
  contramedida: 'Relembrar conquistas, mesmo que pequenas, e praticar autocompaixão por 3 minutos.'
};

// Insights inteligentes baseados no perfil
const insights: Insight[] = [
  {
    id: 'insight_001',
    tipo: 'positivo',
    titulo: 'Consistência Incrível!',
    descricao: 'Você manteve conversas diárias por 12 dias seguidos. Seu perfil disciplinado está se destacando!',
    icone: '🏆',
    data_criacao: '2025-09-22',
    prioridade: 'alta',
    categoria: 'comportamental'
  },
  {
    id: 'insight_002',
    tipo: 'padrao',
    titulo: 'Pico de Energia Matinal',
    descricao: 'Detectamos que você responde às conversas mais rapidamente pela manhã. Seu cronotipo matutino está bem definido.',
    icone: '🌅',
    data_criacao: '2025-09-21',
    prioridade: 'media',
    categoria: 'comportamental'
  },
  {
    id: 'insight_003',
    titulo: 'Meta de Positividade',
    tipo: 'positivo',
    descricao: 'Parabéns! Você atingiu 72% de emoções positivas esta semana, superando sua meta de 70%.',
    icone: '✨',
    data_criacao: '2025-09-20',
    prioridade: 'alta',
    categoria: 'emocional'
  },
  {
    id: 'insight_004',
    tipo: 'melhoria',
    titulo: 'Oportunidade de Reflexão',
    descricao: 'Que tal adicionar mais detalhes em suas conversas? Suas respostas detalhadas vão ajudar você se conhecer melhor.',
    icone: '💭',
    data_criacao: '2025-09-19',
    prioridade: 'baixa',
    categoria: 'cognitivo'
  }
];

// Alertas preventivos (background - não visíveis na v1.1)
const alertasBackground: AlertaPreventivo[] = [
  {
    id: 'alert_001',
    tipo_alerta: 'padrao_negativo',
    nivel_severidade: 'baixo',
    confiabilidade: 23,
    indicadores: ['check-in perdido ontem'],
    data_detectado: '2025-09-19',
    status: 'ativo',
    visivel_usuario: false
  }
];

// Dashboard Data completo para v1.1
export const mockDashboardData: DashboardData = {
  usuario: {
    nome: 'Lindualdo',
    nome_preferencia: 'Aldo',
    cronotipo_detectado: 'matutino',
    perfil_detectado: perfilDetectado
  },
  
  mood_gauge: {
    nivel_atual: 2.3,
    emoji_atual: '😊',
    tendencia_semanal: 0.8,
    cor_indicador: '#10B981' // verde positivo
  },
  
  checkins_historico: checkinsHistorico,
  
  roda_emocoes: rodaEmocoesPadrao,
  
  distribuicao_panas: distribuicaoPanas,
  
  gamificacao: gamificacao,
  
  sabotadores: {
    padrao_principal: sabotadorPrincipal
  },
  
  insights: insights,
  
  alertas_background: alertasBackground,
  
  metricas_periodo: {
    periodo_selecionado: 'semana',
    data_inicio: '2025-09-16',
    data_fim: '2025-09-22',
    total_checkins: 7,
    taxa_resposta: 85.7, // 6 de 7 respondidos
    humor_medio: 7.5,
    emocao_dominante: 'joy'
  }
};

// Funções auxiliares para simulação de dados dinâmicos
export const generateCheckinForDay = (date: string, dayIndex: number): CheckinDiario => {
  const responses = [
    'Me sentindo bem hoje!',
    'Dia produtivo pela frente.',
    'Energia alta para novos desafios.',
    'Focado nos objetivos.',
    'Gratidão pelo progresso.',
    'Mantendo a rotina em dia.',
    'Pronto para mais um dia de crescimento.'
  ];
  
  const emotions = ['joy', 'trust', 'anticipation', 'surprise'];
  const emojis = ['😊', '😐', '🤗', '😲'];
  
  return {
    id_checkin: `ci_${dayIndex}`,
    data_checkin: date,
    horario_envio: '09:00',
    horario_resposta: `09:${String(Math.floor(Math.random() * 30) + 5).padStart(2, '0')}`,
    humor_autoavaliado: Math.floor(Math.random() * 4) + 6, // 6-10
    emocao_primaria_detectada: emotions[Math.floor(Math.random() * emotions.length)],
    intensidade_emocao: Math.floor(Math.random() * 3) + 7, // 7-10
    energia_detectada: Math.floor(Math.random() * 3) + 6, // 6-9
    qualidade_interacao: Math.floor(Math.random() * 3) + 7, // 7-10
    status_resposta: 'respondido',
    emoji_dia: emojis[Math.floor(Math.random() * emojis.length)],
    resposta_texto: responses[Math.floor(Math.random() * responses.length)]
  };
};

export const updateEmotionIntensities = (emotions: PlutchikEmotion[]): PlutchikEmotion[] => {
  return emotions.map(emotion => ({
    ...emotion,
    intensidade: Math.max(10, Math.min(90, emotion.intensidade + (Math.random() - 0.5) * 20))
  }));
};

export default mockDashboardData;
