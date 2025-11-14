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

export interface HumorHistoricoSeriePoint {
  data: string;
  hora?: string | null;
  timestamp?: string | null;
  humor?: number | null;
  pico_dia?: number | null;
  humor_medio?: number | null;
  energia?: number | null;
  energia_media?: number | null;
  emoji?: string | null;
  emocao?: string | null;
  chat_id?: string | null;
  conversa?: {
    id: string | null;
    horario_inicio?: string | null;
    horario_fim?: string | null;
    emocao?: string | null;
    intensidade_emocao?: number | null;
    qualidade_interacao?: number | null;
    emoji?: string | null;
    observacoes?: string | null;
  } | null;
}

export interface HumorHistoricoDetalhe {
  data: string;
  hora: string | null;
  humor: number;
  energia: number;
  pico_dia?: number | null;
  humor_medio?: number | null;
  energia_media?: number | null;
  emoji?: string | null;
  emocao?: string | null;
  variacao_humor?: string | null;
  variacao_energia?: string | null;
  periodo_dia?: string | null;
  justificativa?: string | null;
  confianca?: number | null;
  insights?: string[];
  conversa?: {
    id: string | null;
    horario_inicio?: string | null;
    horario_fim?: string | null;
    emocao?: string | null;
    intensidade_emocao?: number | null;
    qualidade_interacao?: number | null;
    emoji?: string | null;
    observacoes?: string | null;
  } | null;
}

export interface HumorHistoricoPayload {
  periodo: {
    inicio: string;
    fim: string;
  };
  serie: HumorHistoricoSeriePoint[];
  detalhes: HumorHistoricoDetalhe[];
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
export interface GamificacaoConquista {
  id: string;
  nome: string;
  emoji: string;
  xp_bonus: number;
  categoria: string;
  desbloqueada_em: string;
}

export interface GamificacaoConquistaProxima {
  id: string;
  nome: string;
  emoji: string;
  status: 'pendente' | 'parcial' | 'completa' | 'bloqueada' | 'em_andamento' | 'disponivel' | string;
  xp_bonus: number;
  categoria: string;
  categoria_codigo?: string | null;
  progresso_meta: number;
  progresso_atual: number;
  progresso_percentual: number;
  ultima_atualizacao?: string | null;
}

export interface GamificacaoNivelPreview {
  nivel: number;
  titulo: string;
  xp_minimo: number;
  xp_maximo?: number | null;
  xp_restante?: number;
  descricao?: string | null;
}

export interface GamificacaoHabitSnapshot {
  quest_id: string | null;
  codigo: string | null;
  titulo: string;
  status: 'pendente' | 'ativa' | 'completa' | 'expirada' | string;
  vence_em: string | null;
  progresso_atual: number;
  progresso_meta: number;
  atualizado_em: string | null;
}

export interface Gamificacao {
  xp_total: number;
  xp_proximo_nivel: number;
  nivel_atual: number;
  titulo_nivel: string;
  streak_conversas_dias: number;
  streak_protecao_usada: boolean;
  streak_protecao_resetada_em: string | null;
  ultima_conversa_data: string | null;
  melhor_streak: number;
  quest_diaria_status: 'pendente' | 'parcial' | 'completa';
  quest_diaria_progresso: number; // 0-100
  quest_diaria_descricao: string;
  quest_diaria_data: string | null;
  quest_streak_dias: number;
  conquistas_desbloqueadas: GamificacaoConquista[];
  total_conversas: number;
  total_reflexoes: number;
  total_xp_ganho_hoje: number;
  ultima_conquista_id: string | null;
  ultima_conquista_data: string | null;
  ultima_atualizacao: string | null;
  criado_em: string | null;
  conquistas_proximas: GamificacaoConquistaProxima[];
  proximo_nivel: GamificacaoNivelPreview | null;
  proximos_niveis: GamificacaoNivelPreview[];
  habitos_ativos?: GamificacaoHabitSnapshot[] | null;
}

export type QuestStatus =
  | 'pendente'
  | 'ativa'
  | 'concluida'
  | 'vencida'
  | 'cancelada'
  | 'reiniciada';

export interface QuestPersonalizadaResumo {
  instancia_id: string | null;
  meta_codigo: string;
  status: QuestStatus;
  titulo: string;
  descricao: string | null;
  contexto_origem: string | null;
  progresso_meta: number;
  progresso_atual: number;
  concluido_em: string | null;
  config?: Record<string, unknown> | null;
  xp_recompensa?: number | null;
  prioridade?: string | null;
  recorrencia?: string | null;
}

export interface QuestSnapshot {
  usuario_id: string;
  xp_total: number;
  xp_proximo_nivel: number | null;
  nivel_atual: number;
  titulo_nivel: string | null;
  sequencia_atual: number;
  sequencia_recorde: number;
  meta_sequencia_codigo: string | null;
  proxima_meta_codigo: string | null;
  sequencia_status: Record<string, unknown> | null;
  quests_personalizadas: QuestPersonalizadaResumo[];
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

export interface SabotadorCatalogoEntry {
  id: string;
  nome: string;
  emoji: string;
  resumo: string;
  descricao: string;
  caracteristicas: string[];
  pensamentosTipicos: string[];
  sentimentosComuns: string[];
  mentirasParaJustificar: string[];
  impacto: {
    emSi: string[];
    nosOutros: string[];
  };
  funcaoOriginal: string;
  estrategiasAntidoto: string[];
  contextosTipicos?: string[];
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

export interface InsightResource {
  nome: string;
  tipo: string;
  descricao: string;
  aplicacao_pratica: string;
}

export interface InsightDetail extends Insight {
  usuario_id: string;
  ativo: boolean;
  chat_id?: string | null;
  criado_em?: string | null;
  resumo_situacao?: string;
  feedback_positivo?: string;
  feedback_desenvolvimento?: string;
  feedback_motivacional?: string;
  recursos_sugeridos?: InsightResource[];
  baseado_em?: string[];
}

export interface ResumoConversa {
  resumo_conversa: string;
  data_conversa?: string | null;
  [key: string]: unknown;
}

export interface ResumoConversasPayload {
  conversas: ResumoConversa[];
  extras?: Record<string, unknown>;
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

export interface PanoramaCardEmotion {
  nome: string | null;
  emoji?: string | null;
  percentual?: number | null;
}

export interface PanoramaCardSabotador {
  id: string | null;
  nome: string | null;
  emoji?: string | null;
  apelido?: string | null;
  contexto?: string | null;
  insight?: string | null;
  contramedida?: string | null;
  intensidade_media?: number | string | null;
  total_deteccoes?: number | string | null;
  conversas_afetadas?: number | string | null;
}

export interface PanoramaCardData {
  humor: {
    media_7d: number | null;
    atual: number | null;
    amostras: number;
    ultima_data: string | null;
    ultima_hora: string | null;
  };
  energia: {
    percentual_positiva: number;
    percentual_negativa: number;
    percentual_neutra: number;
    categoria: string | null;
  };
  emocoes_dominantes: PanoramaCardEmotion[];
  sabotador: PanoramaCardSabotador | null;
}

export interface PanoramaCardResponse {
  success: boolean;
  usuario_id: string | null;
  card_panorama_emocional: PanoramaCardData;
}

export interface QuestCardQuest {
  id: string | null;
  titulo: string;
  descricao: string | null;
  status: string;
  prioridade?: string | null;
  recorrencia?: string | null;
  progresso: {
    atual: number;
    meta: number;
    percentual: number;
    label?: string | null;
  };
  xp_recompensa: number;
  ultima_atualizacao: string | null;
  ultima_atualizacao_label: string | null;
}

export interface QuestCardData {
  quest: QuestCardQuest | null;
  snapshot: {
    total_concluidas: number;
    total_personalizadas: number;
    xp_base_total: number;
    xp_bonus_total: number;
  };
  beneficios: string[];
  recompensas: {
    xp_base: number;
    xp_bonus_recorrencia: number;
  };
}

export interface QuestCardResponse {
  success: boolean;
  usuario_id: string | null;
  card_quests: QuestCardData;
}

export interface ConversasCardData {
  streak: {
    atual: number;
    recorde: number;
    meta_codigo: string | null;
    proxima_meta_codigo: string | null;
  };
  progresso: {
    atual: number;
    meta: number;
    percentual: number;
    label?: string | null;
  };
  ultima_conversa: {
    timestamp: string | null;
    label: string | null;
  };
  xp: {
    base: number;
    bonus_proxima_meta: number;
    proxima_meta_dias: number;
    proxima_meta_titulo: string | null;
  };
  beneficios: string[];
}

export interface ConversasCardResponse {
  success: boolean;
  usuario_id: string | null;
  card_conversas: ConversasCardData;
}

// Dashboard Data - estrutura principal
export interface DashboardData {
  usuario: {
    id: string;
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
  questSnapshot?: QuestSnapshot | null;
  
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
  view: 'dashboard' | 'humorHistorico' | 'insightDetail' | 'conquistas' | 'proximosNiveis' | 'sabotadorDetail' | 'resumoConversas' | 'panasDetail' | 'fullChatDetail' | 'dashEmocoes' | 'dashSabotadores' | 'dashInsights';
  humorHistorico: HumorHistoricoPayload | null;
  humorHistoricoPeriodo?: { inicio: string; fim: string } | null;
  humorHistoricoLoading: boolean;
  humorHistoricoError: string | null;
  selectedInsightId: string | null;
  insightDetail: InsightDetail | null;
  insightDetailLoading: boolean;
  insightDetailError: string | null;
  selectedSabotadorId: string | null;
  resumoConversas: ResumoConversasPayload | null;
  resumoConversasLoading: boolean;
  resumoConversasError: string | null;
  panoramaCard: PanoramaCardData | null;
  panoramaCardUserId: string | null;
  panoramaCardLoading: boolean;
  panoramaCardError: string | null;
  questsCard: QuestCardData | null;
  questsCardUserId: string | null;
  questsCardLoading: boolean;
  questsCardError: string | null;
  conversasCard: ConversasCardData | null;
  conversasCardUserId: string | null;
  conversasCardLoading: boolean;
  conversasCardError: string | null;
  // full chat detail
  selectedChatId: string | null;
  fullChatDetail: any | null; // ajustar tipagem quando payload final estiver definido
  fullChatLoading: boolean;
  fullChatError: string | null;
  questSnapshot: QuestSnapshot | null;
  questLoading: boolean;
  questError: string | null;
  
  // Actions
  setPeriodo: (periodo: 'semana' | 'mes' | 'trimestre') => void;
  updateDashboardData: (data: Partial<DashboardData>) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => Promise<void>;
  setView: (view: 'dashboard' | 'humorHistorico' | 'insightDetail' | 'conquistas' | 'proximosNiveis' | 'sabotadorDetail' | 'resumoConversas' | 'panasDetail' | 'fullChatDetail' | 'dashEmocoes' | 'dashSabotadores' | 'dashInsights') => void;
  loadHumorHistorico: (options?: { inicio?: string; fim?: string }) => Promise<void>;
  openInsightDetail: (insightId: string) => Promise<void>;
  closeInsightDetail: () => void;
  openSabotadorDetail: (sabotadorId?: string) => void;
  openResumoConversas: () => Promise<void>;
  closeResumoConversas: () => void;
  loadResumoConversas: () => Promise<void>;
  loadQuestSnapshot: (usuarioId?: string) => Promise<void>;
  loadPanoramaCard: (usuarioId?: string) => Promise<void>;
  loadQuestsCard: (usuarioId?: string) => Promise<void>;
  markQuestAsCompletedLocal: (questId: string) => void;
  loadConversasCard: (usuarioId?: string) => Promise<void>;
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
