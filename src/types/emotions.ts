/**
 * ARQUIVO: src/types/emotions.ts
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Tipos baseados na Especificação Funcional v1.1
 * Sistema híbrido de detecção emocional e comportamental
 */
// Roda de Emoções de Plutchik - 8 emoções primárias
export interface PlutchikEmotion {
  id: string;
  nome: string;
  cor: string;
  emoji: string;
  intensidade: number; // 0-100
  categoria: 'primaria' | 'secundaria';
}

// Big Five (OCEAN) - Scores 0-100 para cada traço
export interface BigFiveScores {
  openness: number;        // Abertura (O)
  conscientiousness: number; // Conscienciosidade (C)
  extraversion: number;    // Extroversão (E)
  agreeableness: number;   // Amabilidade (A)
  neuroticism: number;     // Neuroticismo (N)
  confiabilidade: number;  // 0-100
}

// Perfis específicos detectados
export type PerfilEspecifico = 'descobrindo' | 'perfeccionista' | 'disciplinado' | 'desorganizado' | 'depressivo';

export interface PerfilDetectado {
  perfil_primario: PerfilEspecifico;
  perfil_secundario?: PerfilEspecifico;
  confiabilidade_geral: number; // 0-100
  metodo_deteccao: 'onboarding' | 'checkin' | 'conversa';
  big_five_scores: BigFiveScores;
}

// Check-in diário personalizado
export interface CheckinDiario {
  id_checkin: string;
  data_checkin: string;
  horario_envio: string;
  horario_resposta?: string;
  resposta_texto?: string;
  resposta_audio_url?: string;
  humor_autoavaliado: number; // 1-10
  emocao_primaria_detectada: string;
  intensidade_emocao: number; // 1-10
  energia_detectada: number; // 1-10
  qualidade_interacao: number; // 1-10
  status_resposta: 'respondido' | 'perdido' | 'pendente';
  observacoes_usuario?: string;
  emoji_dia: string;
}

// Distribuição PANAS
export interface DistribuicaoPanas {
  positivas: number;
  negativas: number;
  neutras: number;
  meta_positividade: number; // objetivo de positividade
  status_meta: 'atingida' | 'progresso' | 'atencao';
}

// Sistema de Gamificação
export interface Gamificacao {
  xp_total: number;
  nivel_atual: number;
  streak_checkins_dias: number;
  conquistas_desbloqueadas: string[];
  quest_diaria_status: 'pendente' | 'parcial' | 'completa';
  quest_diaria_progresso: number; // 0-100
  quest_diaria_descricao: string;
  proximo_nivel_xp: number;
}

// Sabotadores internos
export interface SabotadorPadrao {
  id: string;
  nome: string;
  emoji: string;
  apelido: string;
  detectado_em: number;
  total_conversas: number;
  insight_contexto: string;
  contramedida: string;
  contexto_principal?: string;
  intensidade_media?: number;
}

// Tipos de insights
export type TipoInsight = 'padrao' | 'melhoria' | 'positivo' | 'alerta';

export interface Insight {
  id: string;
  tipo: TipoInsight;
  titulo: string;
  descricao: string;
  icone: string;
  data_criacao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  categoria: 'comportamental' | 'emocional' | 'social' | 'cognitivo';
  cta?: {
    label: string;
    url: string;
  };
}

// Alertas preventivos (background system)
export interface AlertaPreventivo {
  id: string;
  tipo_alerta: 'deterioracao_humor' | 'padrao_negativo' | 'isolamento_social' | 'risco_depressivo';
  nivel_severidade: 'baixo' | 'medio' | 'alto';
  confiabilidade: number; // 0-100
  indicadores: string[];
  data_detectado: string;
  status: 'ativo' | 'resolvido' | 'falso_positivo';
  visivel_usuario: boolean; // na v1.1 = false
}

// Dashboard Data - estrutura principal
export interface DashboardData {
  usuario: {
    nome: string;
    nome_preferencia: string;
    cronotipo_detectado: 'matutino' | 'vespertino' | 'noturno';
    perfil_detectado: PerfilDetectado;
  };
  
  mood_gauge: {
    nivel_atual: number; // escala 0-10 representando o humor atual
    emoji_atual: string;
    tendencia_semanal: number; // diferença da semana anterior
    cor_indicador: string;
  };
  
  checkins_historico: CheckinDiario[];
  
  roda_emocoes: PlutchikEmotion[];
  
  distribuicao_panas: DistribuicaoPanas;
  
  gamificacao: Gamificacao;
  
  sabotadores: {
    padrao_principal: SabotadorPadrao;
  };
  
  insights: Insight[];
  
  alertas_background: AlertaPreventivo[]; // não visíveis na v1.1
  
  metricas_periodo: {
    periodo_selecionado: 'semana' | 'mes' | 'trimestre';
    data_inicio: string;
    data_fim: string;
    total_checkins: number;
    taxa_resposta: number; // %
    humor_medio: number;
    emocao_dominante: string;
  };
}

// Store state interface
export interface StoreState {
  dashboardData: DashboardData;
  isLoading: boolean;
  periodo: 'semana' | 'mes' | 'trimestre';
  ultimaAtualizacao: string;
  
  // Actions
  setPeriodo: (periodo: 'semana' | 'mes' | 'trimestre') => void;
  updateDashboardData: (data: Partial<DashboardData>) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => Promise<void>;
}

// Configurações personalizadas por perfil
export interface ConfiguracoesPerfil {
  perfil: PerfilEspecifico;
  horario_checkin_otimizado: string;
  frequencia_adaptativa: 'baixa' | 'normal' | 'alta';
  tom_mensagens: 'suporte' | 'motivacional' | 'estruturado' | 'empático';
  tipos_insights_priorizados: TipoInsight[];
}

// Dados de análise prosódica e NLP (para futuras versões)
export interface AnaliseNLP {
  complexidade_vocabular: 'simples' | 'tecnica';
  estrutura_frases: 'organizada' | 'fragmentada';
  tom_emocional: 'positivo' | 'neutro' | 'negativo';
  assertividade: 'firme' | 'hesitante' | 'equilibrada';
  referencias_temporais: 'passado' | 'presente' | 'futuro';
  foco_social: 'eu' | 'nos' | 'eles';
}

export interface AnaliseProsodia {
  tom_voz: number; // frequência fundamental
  energia_vocal: number; // intensidade
  velocidade_fala: 'rapida' | 'normal' | 'lenta';
  pausas_frequencia: number;
  variacao_expressiva: number; // 0-100
}
