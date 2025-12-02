import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CardInsightUltimaConversa from '@/components/app/v1.3/CardInsightUltimaConversa';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import { useDashboard } from '@/store/useStore';
import { mockWeeklyXpSummary, mockInsightCard } from '@/data/mockHomeV1_3';
import { WHATSAPP_URL_HOME } from '@/constants/whatsapp';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';

interface EvoluirStats {
  total_conversas: number;
  total_quests_concluidas: number;
  xp_total: number;
}

interface NivelInfo {
  nivel: number;
  titulo: string;
  estagio: number;
  estagioLabel: string;
  xpAtual: number;
  xpProximoNivel: number | null;
  percentual: number;
}

const ConversarPageV13 = () => {
  const {
    dashboardData,
    setView,
    openInsightDetail,
    insightCard,
    insightCardLoading,
    insightCardError,
    loadInsightCard,
    weeklyProgressCard,
    weeklyProgressCardLoading,
    loadWeeklyProgressCard,
    openResumoConversas,
    openConversaResumo,
    resumoConversas,
    loadResumoConversas,
    questSnapshot,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<TabId>('conversar');
  const [stats, setStats] = useState<EvoluirStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [nivelInfo, setNivelInfo] = useState<NivelInfo>({
    nivel: 1,
    titulo: 'Despertar',
    estagio: 1,
    estagioLabel: 'Início da jornada',
    xpAtual: 0,
    xpProximoNivel: 100,
    percentual: 0
  });

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId || insightCard || insightCardLoading) return;
    loadInsightCard(userId);
  }, [userId, insightCard, insightCardLoading, loadInsightCard]);

  useEffect(() => {
    if (!userId || weeklyProgressCard || weeklyProgressCardLoading) return;
    loadWeeklyProgressCard(userId);
  }, [userId, weeklyProgressCard, weeklyProgressCardLoading, loadWeeklyProgressCard]);


  // Buscar dados de nível da API (jornada_niveis + usuarios_conquistas)
  useEffect(() => {
    const loadNivelInfo = async () => {
      if (!userId) return;
      
      try {
        const res = await fetch(`/api/jornada?user_id=${userId}`);
        const data = await res.json();
        
        if (data.success && data.usuario && data.niveis) {
          const { xp_total, nivel_atual, titulo_nivel, estagio_atual } = data.usuario;
          
          // Encontrar dados do nível atual
          const nivelData = data.niveis.find((n: { nivel: number }) => n.nivel === nivel_atual);
          const xpMinimo = nivelData?.xp_minimo ?? 0;
          const xpProximoNivel = nivelData?.xp_proximo_nivel ?? null;
          
          // Calcular percentual de progresso
          const xpNoNivel = xp_total - xpMinimo;
          const xpNecessario = xpProximoNivel ? xpProximoNivel - xpMinimo : 0;
          const percentual = xpProximoNivel ? Math.min(100, Math.round((xpNoNivel / xpNecessario) * 100)) : 100;
          
          // Label do estágio
          const estagioLabels: Record<number, string> = {
            1: 'Início da jornada',
            2: 'Crescimento',
            3: 'Consolidação',
            4: 'Mestria'
          };
          
          setNivelInfo({
            nivel: nivel_atual,
            titulo: titulo_nivel,
            estagio: estagio_atual,
            estagioLabel: estagioLabels[estagio_atual] || 'Jornada',
            xpAtual: xp_total,
            xpProximoNivel: xpProximoNivel,
            percentual
          });
        }
      } catch (err) {
        console.error('[ConversarPage] Erro ao carregar nível:', err);
      }
    };
    loadNivelInfo();
  }, [userId]);

  // Carregar stats do webhook
  useEffect(() => {
    const loadStats = async () => {
      const usuarioId = dashboardData?.usuario?.id;
      if (!usuarioId) {
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);
        const url = `/api/jornada?action=stats&user_id=${encodeURIComponent(usuarioId)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar stats: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('[ConversarPage] Erro ao carregar stats:', error);
        // Em caso de erro, mantém os dados existentes (fallback)
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [dashboardData?.usuario?.id]);

  const insightCardData = insightCard ?? (!insightCardLoading ? mockInsightCard : null);
  const weeklyData = weeklyProgressCard ?? mockWeeklyXpSummary;

  const handleInsightDetail = (insightId?: string | null) => {
    const resolvedId = insightId ?? insightCard?.insight_id ?? insightCardData?.insight_id;
    if (resolvedId) {
      void openInsightDetail(resolvedId);
    }
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavEntender = () => {
    setActiveTab('entender');
    setView('dashEmocoes');
  };

  const handleNavAgir = () => {
    setActiveTab('agir');
    setView('painelQuests');
  };

  const handleNavEvoluir = () => {
    setActiveTab('evoluir');
    setView('evoluir');
  };

  const handleConversar = () => {
    window.open(WHATSAPP_URL_HOME, '_blank');
  };

  // Dados para o card de conversas da semana
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
  const dias = weeklyData.dias ?? [];

  // Status config para checkboxes de conversas
  const statusConfig: Record<string, { bg: string; border: string; icon: string; color: string }> = {
    respondido: {
      bg: 'var(--mq-primary-light)',
      border: 'var(--mq-primary)',
      icon: '✓',
      color: 'var(--mq-primary)',
    },
    perdido: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'var(--mq-border)',
      icon: '✕',
      color: 'var(--mq-text-muted)',
    },
    pendente: {
      bg: 'var(--mq-warning-light)',
      border: 'var(--mq-warning)',
      icon: '…',
      color: 'var(--mq-warning)',
    },
    default: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'var(--mq-border)',
      icon: '—',
      color: 'var(--mq-text-muted)',
    },
  };

  const getStatusConversa = (dia: typeof dias[0]) => {
    if ((dia.xpConversa ?? 0) > 0) return 'respondido';
    const dataDia = dia.data ? new Date(dia.data + 'T00:00:00') : null;
    if (dataDia && isSameDay(dataDia, hoje)) return 'pendente';
    if (dataDia && isFuture(dataDia)) return 'default';
    return 'perdido';
  };

  // Carregar resumo de conversas se necessário para obter IDs
  useEffect(() => {
    if (!userId || resumoConversas) return;
    void loadResumoConversas();
  }, [userId, resumoConversas, loadResumoConversas]);

  // Função para obter ID da conversa pela data
  const getConversaIdByData = (dataStr: string | null): string | null => {
    if (!dataStr || !resumoConversas?.conversas) return null;
    
    const conversa = resumoConversas.conversas.find((c: any) => {
      const conversaData = c.data_conversa || c.data;
      if (!conversaData) return false;
      const conversaDataStr = conversaData.split('T')[0];
      return conversaDataStr === dataStr;
    });
    
    if (!conversa) return null;
    
    const rawId = conversa.conversa_id ?? conversa.id ?? conversa.chat_id;
    if (typeof rawId === 'number') return String(rawId);
    if (typeof rawId === 'string') return rawId;
    return null;
  };

  // Handler para clicar no dia
  const handleDiaClick = async (dia: typeof dias[0], dataStr: string) => {
    if ((dia.xpConversa ?? 0) > 0) {
      const conversaId = getConversaIdByData(dataStr);
      if (conversaId) {
        await openConversaResumo(String(conversaId));
      } else {
        // Se não encontrou ID, abrir histórico completo
        await openResumoConversas();
      }
    }
  };

  // Dados de progresso - usar stats da API se disponível (igual ao EvoluirPageV13)
  const totalConversas = stats?.total_conversas ?? dashboardData?.gamificacao?.total_conversas ?? 0;
  const totalQuestsConcluidas = useMemo(() => {
    if (stats?.total_quests_concluidas !== undefined) {
      return stats.total_quests_concluidas;
    }
    
    if (!questSnapshot) {
      return 0;
    }
    
    const quests = questSnapshot.quests_personalizadas;
    if (!Array.isArray(quests)) {
      return 0;
    }
    
    return quests.filter(q => q && (q.status === 'concluida' || q.status === 'inativa')).length;
  }, [stats, questSnapshot]);
  
  const totalXp = nivelInfo.xpAtual;
  
  const totalXpFormatted = useMemo(() => {
    return totalXp.toLocaleString('pt-BR');
  }, [totalXp]);

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        {/* Título da página */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center"
        >
          <h1 className="mq-page-title">Conversar</h1>
          <p className="mq-page-subtitle">Conversas revelam padrões. Ações mudam tudo.</p>
          <a
            href={WHATSAPP_URL_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--mq-primary)] hover:underline"
          >
            Fale com seu mentor
            <ExternalLink size={14} />
          </a>
        </motion.div>

        {/* Card de Progresso: Seu progresso no MindQuest */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className="mq-card rounded-2xl px-4 py-4 mb-4"
          style={{ borderRadius: 24 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="mq-eyebrow">Seu progresso no MindQuest</p>
            <button
              type="button"
              onClick={() => {
                setView('evoluir');
                setActiveTab('evoluir' as TabId);
              }}
              className="text-[0.65rem] font-medium text-[var(--mq-primary)] hover:underline flex items-center gap-1"
            >
              Saber mais
              <ChevronRight size={14} />
            </button>
          </div>
          
          {/* Cards de Progresso: Conversas, Ações e Pontos */}
          <div className="grid grid-cols-3 gap-4">
            {/* Card Conversas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <button
                type="button"
                onClick={() => void openResumoConversas()}
                className="w-full p-4 hover:opacity-80 transition-all flex flex-col items-center justify-center text-center"
              >
                <p className="text-sm font-semibold text-[var(--mq-text-muted)] mb-2">Conversas</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-4xl font-bold text-[var(--mq-text)] leading-none">
                    {totalConversas}
                  </span>
                  <TrendingUp size={16} className="text-[var(--mq-primary)]" />
                </div>
              </button>
            </motion.div>

            {/* Card Ações */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.09 }}
            >
              <button
                type="button"
                onClick={() => {
                  setView('painelQuests');
                  setActiveTab('agir');
                }}
                className="w-full p-4 hover:opacity-80 transition-all flex flex-col items-center justify-center text-center"
              >
                <p className="text-sm font-semibold text-[var(--mq-text-muted)] mb-2">Ações</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-4xl font-bold text-[var(--mq-text)] leading-none">
                    {totalQuestsConcluidas}
                  </span>
                  <TrendingUp size={16} className="text-[var(--mq-primary)]" />
                </div>
              </button>
            </motion.div>

            {/* Card Pontos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13 }}
            >
              <button
                type="button"
                onClick={() => setView('niveisJornada', 'conversar')}
                className="w-full p-4 hover:opacity-80 transition-all flex flex-col items-center justify-center text-center"
              >
                <p className="text-sm font-semibold text-[var(--mq-text-muted)] mb-2">Pontos</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-4xl font-bold text-[var(--mq-text)] leading-none">
                    {totalXpFormatted}
                  </span>
                  <Star size={16} className="text-[var(--mq-warning)]" />
                </div>
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Card Conversas da Semana */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mq-card rounded-2xl px-4 py-4"
          style={{ borderRadius: 24 }}
        >
          <p className="mq-eyebrow">Conversas da Semana</p>

          {/* Checkboxes dos dias */}
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const data = addDays(inicioSemana, i);
              const dataStr = format(data, 'yyyy-MM-dd');
              const dia = dias.find(d => d.data === dataStr);
              const status = dia ? getStatusConversa(dia) : 'default';
              const config = statusConfig[status] ?? statusConfig.default;
              const dataFormatada = format(data, 'dd/MM');
              const labelDia = format(data, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase();
              const isHoje = isSameDay(data, hoje);
              const temConversa = dia && (dia.xpConversa ?? 0) > 0;

              return (
                <button
                  key={dataStr}
                  type="button"
                  onClick={() => dia && handleDiaClick(dia, dataStr)}
                  disabled={!temConversa}
                  className={`flex flex-col items-center text-center transition-all ${
                    temConversa ? 'cursor-pointer hover:opacity-80 active:scale-95' : 'cursor-default'
                  }`}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 text-[0.8rem] font-semibold leading-none"
                    style={{
                      backgroundColor: config.bg,
                      borderColor: config.border,
                      color: config.color,
                      boxShadow: isHoje ? '0 0 0 2px var(--mq-primary-light)' : 'none',
                    }}
                  >
                    {config.icon}
                  </div>
                  <span className="mt-1 text-[0.56rem] font-semibold uppercase tracking-wide text-[var(--mq-text)]">
                    {labelDia}
                  </span>
                  <span className="text-[0.56rem] font-medium text-[var(--mq-text-muted)]">
                    {dataFormatada}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Link histórico e instrução */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[0.65rem] text-[var(--mq-text-muted)]">
              Toque no dia para ver resumo
            </p>
            <button
              type="button"
              onClick={() => void openResumoConversas()}
              className="text-[0.65rem] font-medium text-[var(--mq-primary)] hover:underline"
            >
              Histórico completo →
            </button>
          </div>
        </motion.section>

        {/* 
          TODO: Reativar botão "Conversar agora" futuramente
          Este botão abre o WhatsApp para conversar com o mentor.
          Ocultado temporariamente em 2025-12-02.
        */}
        {/* <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <button
            type="button"
            onClick={handleConversar}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[var(--mq-primary)] px-6 py-4 text-white font-bold shadow-lg hover:opacity-90 active:scale-98 transition-all"
            style={{ borderRadius: 24 }}
          >
            <MessageCircle size={22} />
            <span className="text-base">Conversar agora</span>
            <ExternalLink size={16} className="opacity-70" />
          </button>
          <p className="mt-2 text-center text-[0.65rem] text-[var(--mq-text-subtle)]">
            Abre o WhatsApp para conversar com seu mentor
          </p>
        </motion.div> */}

        {/* Card Insight */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardInsightUltimaConversa
            data={insightCardData}
            loading={insightCardLoading}
            onSaberMais={(insightId) => handleInsightDetail(insightId)}
            onHistorico={() => {
              setView('insightsHistorico');
            }}
          />
        </motion.div>
        {!insightCardLoading && insightCardError && (
          <p className="text-center text-[0.72rem] font-medium text-rose-600">
            Não conseguimos atualizar o insight agora.
          </p>
        )}
      </main>

      <BottomNavV1_3
        active={activeTab}
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default ConversarPageV13;

