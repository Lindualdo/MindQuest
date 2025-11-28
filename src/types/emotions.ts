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
  | 'disponivel'
  | 'pendente'
  | 'ativa'
  | 'inativa'
  | 'concluida'
  | 'vencida'
  | 'cancelada'
  | 'reiniciada';

export type QuestEstagio = 'a_fazer' | 'fazendo' | 'feito';

export type QuestTipo = 'sabotador' | 'tcc' | 'reflexao_diaria' | 'personalizada' | string;

export type QuestAreaVida = 
  | 'Saúde Emocional'
  | 'Trabalho e Finanças'
  | 'Relacionamentos e Vida Pessoal'
  | 'Saúde Física';

export interface QuestPersonalizadaResumo {
  instancia_id: string | null;
  meta_codigo: string;
  status: QuestStatus;
  quest_estagio?: QuestEstagio | null;
  titulo: string;
  descricao: string | null;
  contexto_origem: string | null;
  insight_id?: string | null;
  progresso_meta: number;
  progresso_atual: number;
  concluido_em: string | null;
  ativado_em?: string | null;
  atualizado_em?: string | null;
  config?: Record<string, unknown> | null;
  xp_recompensa?: number | null;
  prioridade?: string | null;
  recorrencia?: string | null;
  tipo?: QuestTipo | null;
  catalogo_codigo?: string | null;
  area_vida?: QuestAreaVida | null;
  recorrencias?: {
    tipo: string;
    janela: { inicio: string; fim: string };
    dias: Array<{
      data: string;
      status: string;
      xp_previsto?: number;
      concluido_em?: string | null;
    }>;
  } | null;
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

export interface AreaVida {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
}

export interface QuestDetailSabotador {
  id: string;
  nome: string;
  descricao?: string;
  contextos_tipicos?: string[];
  contramedidas_sugeridas?: string[];
}

export interface QuestDetailCatalogoBaseCientifica {
  tipo?: string;
  objetivo?: string;
  fundamentos?: string;
  como_aplicar?: string;
  links_referencias?: string[];
}

export interface QuestDetailCatalogo {
  codigo?: string | null;
  base_cientifica?: QuestDetailCatalogoBaseCientifica | null;
  instrucoes?: Record<string, unknown> | null;
  tempo_estimado_min?: number | null;
  dificuldade?: number | null;
  categoria?: string | null;
}

export interface QuestDetail {
  id: string;
  usuario_id: string;
  status: QuestStatus;
  titulo: string;
  descricao?: string;
  xp_recompensa?: number | null;
  prioridade?: string;
  tipo?: string | null;
  complexidade: number;
  progresso_meta?: number | null;
  progresso_atual: number;
  xp_concedido: number;
  recorrencias?: any | null;
  area_vida?: AreaVida | null;
  sabotador?: QuestDetailSabotador | null;
  catalogo?: QuestDetailCatalogo | null;
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
    percentual_positivas?: number;
    percentual_negativas?: number;
    percentual_neutras?: number;
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

export interface RodaEmocoesResponse {
  success: boolean;
  roda_emocoes: {
    alegria: number;
    confianca: number;
    medo: number;
    surpresa: number;
    tristeza: number;
    angustia: number;
    raiva: number;
    expectativa: number;
  };
  timestamp: string;
}

export interface InsightCardData {
  insight_id: string | null;
  titulo: string;
  descricao: string;
  prioridade: string | null;
  categoria: string | null;
  tipo: TipoInsight | null;
  chat_id: string | null;
  data_conversa: string | null;
  data_label: string | null;
}

export interface InsightCardResponse {
  success: boolean;
  usuario_id: string | null;
  card_insight_ultima_conversa: InsightCardData;
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

export interface JornadaCardData {
  nivel: {
    atual: string | null;
    descricao: string | null;
    proximo: string | null;
    proximo_descricao: string | null;
  };
  xp: {
    atual: number;
    meta: number;
    restante: number;
    percentual: number;
  };
  snapshot: {
    xp_base_total: number;
    xp_bonus_total: number;
    atualizado_em: string | null;
  };
  beneficios: string[];
}

export interface JornadaCardResponse {
  success: boolean;
  usuario_id: string | null;
  card_jornada: JornadaCardData;
}

export interface ConversaHistoricoDiarioEntry {
  data: string | null;
  humor: number;
  energia: number;
  conversas: number;
  tem_conversa: boolean;
  emoji: string | null;
  emocao: string | null;
  ultima_hora: string | null;
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
  historico_diario?: ConversaHistoricoDiarioEntry[];
  beneficios: string[];
}

export interface ConversasCardResponse {
  success: boolean;
  usuario_id: string | null;
  card_conversas: ConversasCardData;
}

export type WeeklyProgressStatus = 'concluido' | 'parcial' | 'pendente';

export interface WeeklyProgressDay {
  data: string | null;
  label: string | null;
  totalXp: number;
  xpBase: number;
  xpBonus: number;
  xpConversa: number;
  xpQuests: number;
  metaDia: number;
  metaConversa: number;
  metaQuests: number;
  qtdQuestsPrevistas?: number; // Quantidade de quests planejadas para o dia
  qtdQuestsConcluidas?: number; // Quantidade de quests concluídas no dia
  status: WeeklyProgressStatus;
}

export interface WeeklyProgressCardData {
  usuarioId: string | null;
  semanaInicio: string | null;
  semanaFim: string | null;
  streakAtualDias: number;
  xpSemanaTotal: number;
  xpMetaSemana?: number;
  percentualMeta?: number;
  diasConcluidos?: number;
  qtdQuestsPrevistasSemana?: number;
  qtdQuestsConcluidasSemana?: number;
  dias: WeeklyProgressDay[];
}

export interface WeeklyProgressCardResponse {
  success: boolean;
  usuario_id: string | null;
  card_weekly_progress: WeeklyProgressCardData;
}

export interface MapaMentalAssunto {
  assunto_central: string;
  mudanca_desejada: string;
  acoes_praticas: string[];
  resultado_esperado: string;
}

export interface MapaMentalArea {
  area: string;
  assuntos: MapaMentalAssunto[];
}

export interface MapaMentalData {
  usuarioId: string | null;
  areas: MapaMentalArea[];
  geradoEm?: string | null;
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
export type ViewId =
  | 'dashboard'
  | 'humorHistorico'
  | 'insightDetail'
  | 'questDetail'
  | 'conquistas'
  | 'proximosNiveis'
  | 'sabotadorDetail'
  | 'resumoConversas'
  | 'conversaResumo'
  | 'panasDetail'
  | 'fullChatDetail'
  | 'dashEmocoes'
  | 'dashSabotadores'
  | 'dashInsights'
  | 'insightsHistorico'
  | 'painelQuests'
  | 'mapaMental'
  | 'mapaMentalVisual'
  | 'evoluir';

export interface StoreState {
  dashboardData: DashboardData;
  isLoading: boolean;
  periodo: 'semana' | 'mes' | 'trimestre';
  ultimaAtualizacao: string;
  view: ViewId;
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
  conversaResumo: ResumoConversasPayload['conversas'][number] | null;
  conversaResumoLoading: boolean;
  conversaResumoError: string | null;
  selectedConversationId: string | null;
  conversaResumoReturnView: ViewId | null;
  insightDetailReturnView: ViewId | null;
  humorHistoricoReturnView: ViewId | null;
  sabotadorDetailReturnView: ViewId | null;
  panoramaCard: PanoramaCardData | null;
  panoramaCardUserId: string | null;
  panoramaCardLoading: boolean;
  panoramaCardError: string | null;
  insightCard: InsightCardData | null;
  insightCardUserId: string | null;
  insightCardLoading: boolean;
  insightCardError: string | null;
  questsCard: QuestCardData | null;
  questsCardUserId: string | null;
  questsCardLoading: boolean;
  questsCardError: string | null;
  jornadaCard: JornadaCardData | null;
  jornadaCardUserId: string | null;
  jornadaCardLoading: boolean;
  jornadaCardError: string | null;
  conversasCard: ConversasCardData | null;
  conversasCardUserId: string | null;
  conversasCardLoading: boolean;
  conversasCardError: string | null;
  weeklyProgressCard: WeeklyProgressCardData | null;
  weeklyProgressCardUserId: string | null;
  weeklyProgressCardLoading: boolean;
  weeklyProgressCardError: string | null;
  mapaMental: MapaMentalData | null;
  mapaMentalUserId: string | null;
  mapaMentalLoading: boolean;
  mapaMentalError: string | null;
  // full chat detail
  selectedChatId: string | null;
  fullChatDetail: any | null; // ajustar tipagem quando payload final estiver definido
  fullChatLoading: boolean;
  fullChatError: string | null;
  questSnapshot: QuestSnapshot | null;
  questLoading: boolean;
  questError: string | null;
  questDetail: QuestDetail | null;
  questDetailLoading: boolean;
  questDetailError: string | null;
  questDetailSelectedDate: string | null; // Data selecionada no painel quando abriu o detalhe
  
  // Actions
  setPeriodo: (periodo: 'semana' | 'mes' | 'trimestre') => void;
  updateDashboardData: (data: Partial<DashboardData>) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => Promise<void>;
  setView: (view: ViewId) => void;
  loadHumorHistorico: (options?: { inicio?: string; fim?: string }) => Promise<void>;
  openHumorHistorico: () => Promise<void>;
  openInsightDetail: (insightId: string) => Promise<void>;
  closeInsightDetail: () => void;
  openSabotadorDetail: (sabotadorId?: string) => void;
  openResumoConversas: () => Promise<void>;
  closeResumoConversas: () => void;
  loadResumoConversas: () => Promise<void>;
  openConversaResumo: (conversaId: string) => Promise<void>;
  closeConversaResumo: () => void;
  loadConversaResumo: (conversaId: string) => Promise<void>;
  loadQuestSnapshot: (usuarioId?: string) => Promise<void>;
  loadPanoramaCard: (usuarioId?: string) => Promise<void>;
  loadInsightCard: (usuarioId?: string) => Promise<void>;
  loadQuestsCard: (usuarioId?: string) => Promise<void>;
  markQuestAsCompletedLocal: (questId: string) => void;
  concluirQuest: (questId?: string) => Promise<void>;
  criarQuestFromInsight: (insightId: string, titulo: string, descricao?: string, instrucoes?: string, resourceIndex?: number) => Promise<{ success: boolean; quest_id?: string }>;
  loadJornadaCard: (usuarioId?: string) => Promise<void>;
  loadConversasCard: (usuarioId?: string) => Promise<void>;
  loadWeeklyProgressCard: (usuarioId?: string) => Promise<void>;
  loadMapaMental: (usuarioId?: string) => Promise<void>;
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

// Perfil Big Five (calculado da tabela usuarios_perfis)
export interface BigFivePerfilScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface TracoOrdenado {
  nome: string;
  nome_pt: string;
  score: number;
}

export interface BigFivePerfilData {
  usuario_id: string;
  perfil_primario: string | null;
  perfil_secundario: string | null;
  scores: BigFivePerfilScores;
  tracos_ordenados: TracoOrdenado[];
  resumo_perfil: string | null;
  confianca_media: number;
  ultima_atualizacao: string | null;
  total_registros: number;
}

export interface BigFivePerfilResponse {
  success: boolean;
  perfil?: BigFivePerfilData;
  error?: string;
}
