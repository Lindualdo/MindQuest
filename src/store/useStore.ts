/**
 * ARQUIVO: src/store/useStore.ts
 * AÇÃO: SUBSTITUIR arquivo existente
 * 
 * Store corrigido com todas as importações e tipos
 */

import { create } from 'zustand';
import type {
  StoreState,
  DashboardData,
  ResumoConversasPayload,
  QuestSnapshot,
  MapaMentalData,
  QuestStatus,
} from '../types/emotions';

// Importações dos serviços (usando sintaxe compatível)
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { dataAdapter } from '../utils/dataAdapter';

interface ExtendedStoreState extends StoreState {
  // Estados adicionais para API
  error: string | null;
  isAuthenticated: boolean;
  lastUpdated: string;
  selectedSabotadorId: string | null;
  
  // Actions adicionais
  setError: (error: string | null) => void;
  setAuthenticated: (auth: boolean) => void;
  initializeAuth: () => Promise<boolean>;
  loadDashboardData: () => Promise<void>;
  openSabotadorDetail: (sabotadorId?: string) => void;
  // Full chat detail
  openFullChat: (chatId: string) => Promise<void>;
  closeFullChat: () => void;
  loadQuestSnapshot: (usuarioId?: string) => Promise<void>;
  concluirQuest: (questId?: string) => Promise<void>;
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
  view: 'dashboard',
  humorHistorico: null,
  humorHistoricoPeriodo: null,
  humorHistoricoLoading: false,
  humorHistoricoError: null,
  selectedInsightId: null,
  insightDetail: null,
  insightDetailLoading: false,
  insightDetailError: null,
  selectedSabotadorId: null,
  resumoConversas: null,
  resumoConversasLoading: false,
  resumoConversasError: null,
  conversaResumo: null,
  conversaResumoLoading: false,
  conversaResumoError: null,
  selectedConversationId: null,
  conversaResumoReturnView: null,
  panoramaCard: null,
  panoramaCardUserId: null,
  panoramaCardLoading: false,
  panoramaCardError: null,
  insightCard: null,
  insightCardUserId: null,
  insightCardLoading: false,
  insightCardError: null,
  questsCard: null,
  questsCardUserId: null,
  questsCardLoading: false,
  questsCardError: null,
  jornadaCard: null,
  jornadaCardUserId: null,
  jornadaCardLoading: false,
  jornadaCardError: null,
  conversasCard: null,
  conversasCardUserId: null,
  conversasCardLoading: false,
  conversasCardError: null,
  weeklyProgressCard: null,
  weeklyProgressCardUserId: null,
  weeklyProgressCardLoading: false,
  weeklyProgressCardError: null,
  mapaMental: null,
  mapaMentalUserId: null,
  mapaMentalLoading: false,
  mapaMentalError: null,
  // full chat
  selectedChatId: null,
  fullChatDetail: null,
  fullChatLoading: false,
  fullChatError: null,
  questSnapshot: null,
  questLoading: false,
  questError: null,

  // Actions básicas
  setError: (error) => {
    set({ error, isLoading: false });
  },

  openFullChat: async (chatId) => {
    set({ view: 'fullChatDetail', selectedChatId: chatId, fullChatLoading: true, fullChatError: null });
    try {
      const data = await apiService.getFullChat(chatId);
      set({ fullChatDetail: data, fullChatLoading: false });
    } catch (error) {
      set({ fullChatLoading: false, fullChatError: error instanceof Error ? error.message : 'Erro ao carregar conversa' });
    }
  },

  closeFullChat: () => {
    set({ view: 'resumoConversas', selectedChatId: null, fullChatDetail: null, fullChatError: null });
  },

  loadQuestSnapshot: async (usuarioIdParam) => {
    const { dashboardData: stateDashboard } = get();
    const usuarioId = usuarioIdParam ?? stateDashboard?.usuario?.id;

    if (!usuarioId) {
      console.warn('[QuestSnapshot] abortando: usuário não informado');
      set({
        questError: 'Usuário não informado para carregar quests',
        questLoading: false,
      });
      return;
    }

    console.debug('[QuestSnapshot] carregando snapshot', { usuario_id: usuarioId });
    set({ questLoading: true, questError: null });

    try {
      const questData = await apiService.getQuestSnapshot(usuarioId);
      const currentDashboard = get().dashboardData;

      console.debug('[QuestSnapshot] snapshot recebido', questData);
      set({
        questSnapshot: questData,
        questLoading: false,
        questError: null,
        dashboardData: currentDashboard
          ? {
              ...currentDashboard,
              questSnapshot: questData,
            }
          : currentDashboard,
      });
    } catch (error) {
      console.error('[QuestSnapshot] erro ao carregar snapshot', error);
      set({
        questLoading: false,
        questError: error instanceof Error ? error.message : 'Erro ao carregar quests',
      });
    }
  },

  loadPanoramaCard: async (usuarioIdParam) => {
    const { dashboardData, panoramaCardUserId, panoramaCardLoading } = get();
    let userId = usuarioIdParam ?? dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      set({
        panoramaCardError: 'Usuário não informado para carregar panorama emocional',
        panoramaCardLoading: false,
      });
      return;
    }

    if (panoramaCardUserId === userId && !usuarioIdParam) {
      return;
    }

    if (panoramaCardLoading) {
      return;
    }

    set({ panoramaCardLoading: true, panoramaCardError: null });

    try {
      const payload = await apiService.getPanoramaCard(userId);
      set({
        panoramaCard: payload.card_panorama_emocional,
        panoramaCardUserId: userId,
        panoramaCardLoading: false,
        panoramaCardError: null,
      });
    } catch (error) {
      console.error('[PanoramaCard] erro ao carregar card emocional', error);
      set({
        panoramaCardLoading: false,
        panoramaCardError: error instanceof Error ? error.message : 'Erro ao carregar panorama emocional',
      });
    }
  },

  loadInsightCard: async (usuarioIdParam) => {
    const { dashboardData, insightCardUserId, insightCardLoading } = get();
    let userId = usuarioIdParam ?? dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      set({
        insightCardError: 'Usuário não informado para carregar insight',
        insightCardLoading: false,
      });
      return;
    }

    if (insightCardUserId === userId && !usuarioIdParam) {
      return;
    }

    if (insightCardLoading) {
      return;
    }

    set({ insightCardLoading: true, insightCardError: null });

    try {
      const payload = await apiService.getInsightCard(userId);
      set({
        insightCard: payload.card_insight_ultima_conversa,
        insightCardUserId: userId,
        insightCardLoading: false,
        insightCardError: null,
      });
    } catch (error) {
      console.error('[InsightCard] erro ao carregar card de insight', error);
      set({
        insightCardLoading: false,
        insightCardError: error instanceof Error ? error.message : 'Erro ao carregar insight',
      });
    }
  },

  loadQuestsCard: async (usuarioIdParam) => {
    const { dashboardData, questsCardUserId, questsCardLoading } = get();
    let userId = usuarioIdParam ?? dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      set({
        questsCardError: 'Usuário não informado para carregar card de quests',
        questsCardLoading: false,
      });
      return;
    }

    if (questsCardUserId === userId && !usuarioIdParam) {
      return;
    }

    if (questsCardLoading) {
      return;
    }

    set({ questsCardLoading: true, questsCardError: null });

    try {
      const payload = await apiService.getQuestsCard(userId);
      set({
        questsCard: payload.card_quests,
        questsCardUserId: userId,
        questsCardLoading: false,
        questsCardError: null,
      });
    } catch (error) {
      console.error('[QuestsCard] erro ao carregar card de quests', error);
      set({
        questsCardLoading: false,
        questsCardError: error instanceof Error ? error.message : 'Erro ao carregar card de quests',
      });
    }
  },

  loadJornadaCard: async (usuarioIdParam) => {
    const { dashboardData, jornadaCardUserId, jornadaCardLoading } = get();
    let userId = usuarioIdParam ?? dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      set({
        jornadaCardError: 'Usuário não informado para carregar card de jornada',
        jornadaCardLoading: false,
      });
      return;
    }

    if (jornadaCardUserId === userId && !usuarioIdParam) {
      return;
    }

    if (jornadaCardLoading) {
      return;
    }

    set({ jornadaCardLoading: true, jornadaCardError: null });

    try {
      const payload = await apiService.getJornadaCard(userId);
      set({
        jornadaCard: payload.card_jornada,
        jornadaCardUserId: userId,
        jornadaCardLoading: false,
        jornadaCardError: null,
      });
    } catch (error) {
      console.error('[JornadaCard] erro ao carregar card de jornada', error);
      set({
        jornadaCardLoading: false,
        jornadaCardError: error instanceof Error ? error.message : 'Erro ao carregar card de jornada',
      });
    }
  },

  markQuestAsCompletedLocal: (questId) => {
    if (!questId) return;
    const snapshot = get().questSnapshot;
    const questsCard = get().questsCard;
    const nowIso = new Date().toISOString();

    if (snapshot?.quests_personalizadas) {
      const updatedSnapshot = {
        ...snapshot,
        quests_personalizadas: snapshot.quests_personalizadas.map((quest) => {
          if (quest.instancia_id !== questId) return quest;
          const meta = quest.progresso_meta ?? 1;
          return {
            ...quest,
            status: 'concluida',
            progresso_atual: meta,
            concluido_em: nowIso,
          };
        }),
      };
      set({ questSnapshot: updatedSnapshot });
    }

    if (questsCard?.quest && questsCard.quest.id === questId) {
      set({
        questsCard: {
          ...questsCard,
          quest: {
            ...questsCard.quest,
            status: 'concluida',
            progresso: {
              ...questsCard.quest.progresso,
              atual: questsCard.quest.progresso.meta,
              percentual: 100,
            },
            ultima_atualizacao: nowIso,
            ultima_atualizacao_label: 'agora',
          },
        },
      });
    }
  },

  concluirQuest: async (questIdParam) => {
    const { dashboardData, questSnapshot, loadQuestSnapshot, loadQuestsCard } = get();
    const usuarioId = dashboardData?.usuario?.id;
    const questId = questIdParam ?? questSnapshot?.quests_personalizadas?.[0]?.instancia_id ?? null;

    console.log('[ConcluirQuest] Iniciando:', { questIdParam, questId, usuarioId });

    if (!usuarioId || !questId) {
      console.error('[ConcluirQuest] Validação falhou:', { usuarioId, questId });
      set({
        questError: 'Usuário ou quest inválidos para conclusão',
        questLoading: false,
      });
      return;
    }

    set({ questLoading: true, questError: null });

    try {
      const resultado = await apiService.concluirQuest({
        usuarioId,
        questId,
        fonte: 'app_v1.3',
      });

      set((state) => {
        const snapshotAtual = state.questSnapshot;
        let novoSnapshot = snapshotAtual;
        if (snapshotAtual?.quests_personalizadas) {
          novoSnapshot = {
            ...snapshotAtual,
            quests_personalizadas: snapshotAtual.quests_personalizadas.map((quest) => {
              if (quest.instancia_id !== questId) return quest;
              const meta = quest.progresso_meta ?? 1;
              return {
                ...quest,
                status: (resultado.status as QuestStatus) ?? 'concluida',
                progresso_atual: meta,
                concluido_em:
                  (resultado.quest?.concluido_em as string | null | undefined) ?? new Date().toISOString(),
              };
            }),
          };
        }

        let novoDashboard = state.dashboardData;
        if (novoDashboard?.questSnapshot && novoSnapshot) {
          novoDashboard = {
            ...novoDashboard,
            questSnapshot: novoSnapshot,
          };
        }

        let novoQuestsCard = state.questsCard;
        if (state.questsCard?.quest && state.questsCard.quest.id === questId) {
          novoQuestsCard = {
            ...state.questsCard,
            quest: {
              ...state.questsCard.quest,
              status: resultado.status ?? 'concluida',
              progresso: {
                ...state.questsCard.quest.progresso,
                atual: state.questsCard.quest.progresso.meta,
                percentual: 100,
              },
              ultima_atualizacao: new Date().toISOString(),
              ultima_atualizacao_label: 'agora',
            },
            snapshot: state.questsCard.snapshot
              ? {
                  ...state.questsCard.snapshot,
                  total_concluidas:
                    (resultado.total_quests_concluidas as number | null | undefined) ??
                    state.questsCard.snapshot.total_concluidas,
                  total_personalizadas:
                    (resultado.total_quests_personalizadas as number | null | undefined) ??
                    state.questsCard.snapshot.total_personalizadas,
                }
              : state.questsCard.snapshot,
          };
        }

        return {
          questSnapshot: novoSnapshot ?? state.questSnapshot,
          dashboardData: novoDashboard ?? state.dashboardData,
          questsCard: novoQuestsCard ?? state.questsCard,
        };
      });

      set({ questLoading: false, questError: null });

      void loadQuestSnapshot(usuarioId);
      void loadQuestsCard(usuarioId);
    } catch (error) {
      console.error('[ConcluirQuest] erro ao concluir', error);
      set({
        questLoading: false,
        questError: error instanceof Error ? error.message : 'Erro ao concluir quest',
      });
    }
  },

  loadConversasCard: async (usuarioIdParam) => {
    const { dashboardData, conversasCardUserId, conversasCardLoading } = get();
    let userId = usuarioIdParam ?? dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      set({
        conversasCardError: 'Usuário não informado para carregar card de conversas',
        conversasCardLoading: false,
      });
      return;
    }

    if (conversasCardUserId === userId && !usuarioIdParam) {
      return;
    }

    if (conversasCardLoading) {
      return;
    }

    set({ conversasCardLoading: true, conversasCardError: null });

    try {
      const payload = await apiService.getConversasCard(userId);
      set({
        conversasCard: payload.card_conversas,
        conversasCardUserId: userId,
        conversasCardLoading: false,
        conversasCardError: null,
      });
    } catch (error) {
      console.error('[ConversasCard] erro ao carregar card de conversas', error);
      set({
        conversasCardLoading: false,
        conversasCardError: error instanceof Error ? error.message : 'Erro ao carregar card de conversas',
      });
    }
  },

  loadWeeklyProgressCard: async (usuarioIdParam) => {
    const { dashboardData, weeklyProgressCardUserId, weeklyProgressCardLoading } = get();
    let userId = usuarioIdParam ?? dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      set({
        weeklyProgressCardError: 'Usuário não informado para carregar card semanal',
        weeklyProgressCardLoading: false,
      });
      return;
    }

    if (weeklyProgressCardUserId === userId && !usuarioIdParam) {
      return;
    }

    if (weeklyProgressCardLoading) {
      return;
    }

    set({
      weeklyProgressCardLoading: true,
      weeklyProgressCardError: null,
    });

    try {
      const payload = await apiService.getWeeklyProgressCard(userId);
      set({
        weeklyProgressCard: payload.card_weekly_progress,
        weeklyProgressCardUserId: userId,
        weeklyProgressCardLoading: false,
        weeklyProgressCardError: null,
      });
    } catch (error) {
      console.error('[WeeklyProgressCard] erro ao carregar card semanal', error);
      set({
        weeklyProgressCardLoading: false,
        weeklyProgressCardError: error instanceof Error ? error.message : 'Erro ao carregar card semanal',
      });
    }
  },

  loadMapaMental: async (usuarioIdParam) => {
    const { dashboardData, mapaMentalUserId, mapaMentalLoading } = get();
    let userId = usuarioIdParam ?? dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      set({
        mapaMentalError: 'Usuário não informado para carregar mapa mental',
        mapaMentalLoading: false,
      });
      return;
    }

    if (mapaMentalUserId === userId && !usuarioIdParam) {
      return;
    }

    if (mapaMentalLoading) {
      return;
    }

    set({
      mapaMentalLoading: true,
      mapaMentalError: null,
    });

    try {
      const payload = await apiService.getMapaMental(userId);
      set({
        mapaMental: payload,
        mapaMentalUserId: userId,
        mapaMentalLoading: false,
        mapaMentalError: null,
      });
    } catch (error) {
      console.error('[MapaMental] erro ao carregar dados', error);
      set({
        mapaMentalLoading: false,
        mapaMentalError: error instanceof Error ? error.message : 'Erro ao carregar mapa mental',
      });
    }
  },

  setAuthenticated: (auth) => {
    set({ isAuthenticated: auth });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setView: (view) => {
    set({ view });
  },

  /**
   * Inicializa autenticação
   */
  initializeAuth: async (): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const token = authService.extractTokenFromUrl() || authService.getToken();
      
      if (!token) {
        authService.clearStoredToken();
        set({ 
          isLoading: false, 
          error: 'Token de acesso não encontrado',
          isAuthenticated: false
        });
        return false;
      }

      const validation = await authService.validateToken(token);
      
      if (!validation.success) {
        authService.clearStoredToken();
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

      if (dashboardData?.usuario?.id) {
        await Promise.all([
          get().loadQuestSnapshot(dashboardData.usuario.id),
          get().loadPanoramaCard(dashboardData.usuario.id),
          get().loadConversasCard(dashboardData.usuario.id),
          get().loadQuestsCard(dashboardData.usuario.id),
          get().loadJornadaCard(dashboardData.usuario.id),
        ]);
      } else {
        set({
          questSnapshot: null,
          questLoading: false,
          questError: 'Usuário inválido para quests',
          panoramaCard: null,
          panoramaCardUserId: null,
          panoramaCardLoading: false,
          panoramaCardError: 'Usuário inválido para panorama emocional',
          conversasCard: null,
          conversasCardUserId: null,
          conversasCardLoading: false,
          conversasCardError: 'Usuário inválido para card de conversas',
          questsCard: null,
          questsCardUserId: null,
          questsCardLoading: false,
          questsCardError: 'Usuário inválido para card de quests',
          jornadaCard: null,
          jornadaCardUserId: null,
          jornadaCardLoading: false,
          jornadaCardError: 'Usuário inválido para card de jornada',
        });
      }

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
  },

  loadHumorHistorico: async (options) => {
    const { dashboardData } = get();
    let userId = dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      console.warn('[HumorHistorico] usuário indisponível, abortando');
      return;
    }

    try {
      console.log('[HumorHistorico] carregando', { userId, options });
      set({ humorHistoricoLoading: true, humorHistoricoError: null });
      const payload = await apiService.getHumorHistorico(
        userId,
        options?.inicio,
        options?.fim
      );
      console.log('[HumorHistorico] sucesso', payload);

      set({
        humorHistorico: payload,
        humorHistoricoPeriodo: payload.periodo,
        humorHistoricoLoading: false,
        humorHistoricoError: null
      });
    } catch (error) {
      console.error('Erro ao carregar histórico de humor:', error);
      set({
        humorHistoricoLoading: false,
        humorHistoricoError: error instanceof Error ? error.message : 'Erro ao carregar histórico'
      });
    }
  }

  ,

  openInsightDetail: async (insightId) => {
    const { dashboardData } = get();
    const userId = dashboardData?.usuario?.id;

    if (!userId) {
      console.warn('[openInsightDetail] usuário indisponível');
      return;
    }

    set({
      view: 'insightDetail',
      selectedInsightId: insightId,
      insightDetailLoading: true,
      insightDetailError: null
    });

    try {
      const detail = await apiService.getInsightDetail(userId, insightId);
      set({
        insightDetail: detail,
        insightDetailLoading: false,
        insightDetailError: null
      });
    } catch (error) {
      console.error('Erro ao carregar insight detalhado:', error);
      set({
        insightDetailLoading: false,
        insightDetailError: error instanceof Error ? error.message : 'Erro ao carregar insight',
        insightDetail: null
      });
    }
  },

  closeInsightDetail: () => {
    set({
      view: 'dashInsights',
      selectedInsightId: null,
      insightDetail: null,
      insightDetailError: null,
      insightDetailLoading: false
    });
  },

  openSabotadorDetail: (sabotadorId) => {
    const { dashboardData } = get();
    const fallbackId = dashboardData?.sabotadores?.padrao_principal?.id ?? null;

    if (!sabotadorId && !fallbackId) {
      console.warn('[openSabotadorDetail] sabotador indisponível');
      set({ view: 'dashboard' });
      return;
    }

    set({
      selectedSabotadorId: sabotadorId ?? fallbackId,
      view: 'sabotadorDetail'
    });
  },

  loadResumoConversas: async () => {
    const { dashboardData } = get();
    let userId = dashboardData?.usuario?.id;

    if (!userId) {
      const authUser = authService.getUserData();
      if (authUser?.user?.id) {
        userId = authUser.user.id;
      }
    }

    if (!userId) {
      console.warn('[ResumoConversas] usuário indisponível, abortando');
      set({
        resumoConversasLoading: false,
        resumoConversasError: 'Usuário não encontrado'
      });
      return;
    }

    try {
      console.log('[ResumoConversas] carregando', { userId });
      set({
        resumoConversasLoading: true,
        resumoConversasError: null
      });
      const resumo: ResumoConversasPayload = await apiService.getResumoConversas(userId);
      set({
        resumoConversas: resumo,
        resumoConversasLoading: false,
        resumoConversasError: null
      });
    } catch (error) {
      console.error('Erro ao carregar resumo das conversas:', error);
      set({
        resumoConversasLoading: false,
        resumoConversasError: error instanceof Error ? error.message : 'Erro ao carregar resumo das conversas'
      });
    }
  },

  openResumoConversas: async () => {
    set({
      view: 'resumoConversas',
      resumoConversasError: null
    });
    await get().loadResumoConversas();
  },

  closeResumoConversas: () => {
    set({
      view: 'dashboard'
    });
  },

  loadConversaResumo: async (conversaId) => {
    if (!conversaId) {
      set({ conversaResumoLoading: false, conversaResumoError: 'Conversa inválida' });
      return;
    }

    try {
      set({ conversaResumoLoading: true, conversaResumoError: null });
      const resumo = await apiService.getResumoConversaById(conversaId);
      set({ conversaResumo: resumo, conversaResumoLoading: false, conversaResumoError: null });
    } catch (error) {
      console.error('[ConversaResumo] erro ao carregar', error);
      set({
        conversaResumoLoading: false,
        conversaResumoError: error instanceof Error ? error.message : 'Erro ao carregar resumo da conversa'
      });
    }
  },

  openConversaResumo: async (conversaId) => {
    if (!conversaId) {
      console.warn('[ConversaResumo] conversaId inválido');
      return;
    }
    const { view, conversaResumoReturnView } = get();
    const originView = view === 'conversaResumo' ? conversaResumoReturnView ?? 'humorHistorico' : view;
    set({
      view: 'conversaResumo',
      selectedConversationId: conversaId,
      conversaResumo: null,
      conversaResumoError: null,
      conversaResumoReturnView: originView
    });
    await get().loadConversaResumo(conversaId);
  },

  closeConversaResumo: () => {
    const { conversaResumoReturnView } = get();
    const fallbackView = conversaResumoReturnView ?? 'humorHistorico';
    set({
      view: fallbackView,
      conversaResumo: null,
      conversaResumoError: null,
      conversaResumoLoading: false,
      selectedConversationId: null,
      conversaResumoReturnView: null
    });
  }
}));

if (typeof window !== 'undefined') {
  (window as Window & { __MINDQUEST_STORE__?: typeof useStore }).__MINDQUEST_STORE__ = useStore;
}

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
    ultimaAtualizacao,
    view,
    setView,
    humorHistorico,
    humorHistoricoLoading,
    humorHistoricoError,
    loadHumorHistorico,
    openInsightDetail,
    closeInsightDetail,
    selectedInsightId,
    insightDetail,
    insightDetailLoading,
    insightDetailError
  ,
    selectedSabotadorId,
    openSabotadorDetail,
    resumoConversas,
    resumoConversasLoading,
    resumoConversasError,
    openResumoConversas,
  closeResumoConversas,
  loadResumoConversas,
  conversaResumo,
  conversaResumoLoading,
  conversaResumoError,
  selectedConversationId,
  openConversaResumo,
  closeConversaResumo,
  loadConversaResumo,
  // full chat
  openFullChat,
  closeFullChat,
  selectedChatId,
  fullChatDetail,
  fullChatLoading,
  fullChatError,
    questSnapshot,
    questLoading,
    questError,
    loadQuestSnapshot,
    concluirQuest,
    panoramaCard,
    panoramaCardLoading,
    panoramaCardError,
    loadPanoramaCard,
    insightCard,
    insightCardLoading,
    insightCardError,
    loadInsightCard,
    conversasCard,
    conversasCardLoading,
    conversasCardError,
    loadConversasCard,
    weeklyProgressCard,
    weeklyProgressCardLoading,
    weeklyProgressCardError,
    loadWeeklyProgressCard,
    mapaMental,
    mapaMentalLoading,
    mapaMentalError,
    loadMapaMental,
    questsCard,
    questsCardLoading,
    questsCardError,
    loadQuestsCard,
    jornadaCard,
    jornadaCardLoading,
    jornadaCardError,
    loadJornadaCard,
    markQuestAsCompletedLocal,
    isAuthenticated
  } = useStore();
  
  return {
    dashboardData,
    isLoading,
    error,
    refreshData,
    setPeriodo,
    periodo,
    ultimaAtualizacao,
    view,
    setView,
    humorHistorico,
    humorHistoricoLoading,
    humorHistoricoError,
    loadHumorHistorico,
    openInsightDetail,
    closeInsightDetail,
    selectedInsightId,
    insightDetail,
    insightDetailLoading,
    insightDetailError,
    selectedSabotadorId,
    openSabotadorDetail,
    resumoConversas,
    resumoConversasLoading,
    resumoConversasError,
    openResumoConversas,
    closeResumoConversas,
    loadResumoConversas,
    conversaResumo,
    conversaResumoLoading,
    conversaResumoError,
    selectedConversationId,
    openConversaResumo,
    closeConversaResumo,
    loadConversaResumo,
    openFullChat,
    closeFullChat,
    selectedChatId,
    fullChatDetail,
    fullChatLoading,
    fullChatError,
    questSnapshot,
    questLoading,
    questError,
    loadQuestSnapshot,
    concluirQuest,
    panoramaCard,
    panoramaCardLoading,
    panoramaCardError,
    loadPanoramaCard,
    insightCard,
    insightCardLoading,
    insightCardError,
    loadInsightCard,
    conversasCard,
    conversasCardLoading,
    conversasCardError,
    loadConversasCard,
    weeklyProgressCard,
    weeklyProgressCardLoading,
    weeklyProgressCardError,
    loadWeeklyProgressCard,
    mapaMental,
    mapaMentalLoading,
    mapaMentalError,
    loadMapaMental,
    questsCard,
    questsCardLoading,
    questsCardError,
    loadQuestsCard,
    jornadaCard,
    jornadaCardLoading,
    jornadaCardError,
    loadJornadaCard,
    markQuestAsCompletedLocal,
    isAuthenticated
  };
};

export { useStore };
export default useStore;
