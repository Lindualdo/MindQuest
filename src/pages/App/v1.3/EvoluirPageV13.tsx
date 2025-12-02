import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, ChevronRight, TrendingUp, Star, BarChart3, Trophy, Link2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

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

const EvoluirPageV13: React.FC = () => {
  const {
    dashboardData,
    questSnapshot,
    setView,
    openResumoConversas,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<TabId>('evoluir');
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

  const userId = dashboardData?.usuario?.id;

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
        console.error('[Evoluir] Erro ao carregar nível:', err);
      }
    };
    loadNivelInfo();
  }, [userId]);

  // Dados de progresso - usar stats da API se disponível
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

  // Dados para contadores
  const [objetivosInfo, setObjetivosInfo] = useState<{ total: number; limite: number }>({ total: 0, limite: 3 });
  const [conquistasVida, setConquistasVida] = useState(0);

  // Buscar contagem de objetivos e conquistas
  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const userId = dashboardData?.usuario?.id;
        if (!userId) return;
        
        const res = await fetch(`/api/objetivos?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setObjetivosInfo({
            total: data.total_ativos ?? 0,
            limite: data.limite_ativos ?? 3
          });
        }
      } catch (err) {
        console.error('Erro ao buscar objetivos:', err);
      }
    };
    
    const fetchConquistas = async () => {
      try {
        const userId = dashboardData?.usuario?.id;
        if (!userId) return;
        
        const res = await fetch(`/api/conquista-objetivo?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setConquistasVida(data.total_alcancados ?? 0);
        }
      } catch (err) {
        console.error('Erro ao buscar conquistas:', err);
      }
    };
    
    fetchObjetivos();
    fetchConquistas();
  }, [dashboardData?.usuario?.id]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

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
        console.error('[EvoluirPage] Erro ao carregar stats:', error);
        // Em caso de erro, mantém os dados existentes (fallback)
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [dashboardData?.usuario?.id]);

  const handleBack = () => {
    setView('conversar');
    setActiveTab('conversar');
  };

  const handleNavConversar = () => {
    setActiveTab('conversar');
    setView('conversar');
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

  const handleVerHistoricoConversas = async () => {
    await openResumoConversas();
  };

  const handleVerAcoesConcluidas = () => {
    setView('painelQuests');
    setActiveTab('agir');
    // TODO: Implementar filtro para mostrar apenas concluídas
  };

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="mq-btn-back"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="mq-page-title">Jornada</h1>
          <p className="mq-page-subtitle">Sua evolução no MindQuest</p>
        </div>

        {/* Seção: Progresso no App */}
        <div className="mb-4">
          <p className="mq-eyebrow text-center mb-3">NO APP</p>
        </div>

        {/* Cards de Progresso: Conversas, Ações e Pontos */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {/* Card Conversas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <button
              type="button"
              onClick={handleVerHistoricoConversas}
              className="mq-card w-full p-5 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
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
              onClick={() => setView('conexaoAcoesObjetivos')}
              className="mq-card w-full p-5 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
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
              onClick={() => setView('niveisJornada')}
              className="mq-card w-full p-5 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
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

        {/* Card Nível e Estágio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
          className="mb-6"
        >
          <div className="mq-card p-5">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-[var(--mq-text)]">
                  Nível: {nivelInfo.titulo}
                </h3>
                <button
                  type="button"
                  onClick={() => setView('niveisJornada')}
                  className="text-xs text-[var(--mq-primary)] hover:underline flex items-center gap-1"
                >
                  saber mais
                  <ChevronRight size={14} />
                </button>
              </div>
              <p className="text-xs text-[var(--mq-text-muted)]">
                Estágio: {nivelInfo.estagioLabel}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[var(--mq-text-muted)]">
                <span>{totalXp.toLocaleString('pt-BR')} pts</span>
                {nivelInfo.xpProximoNivel && (
                  <span>{nivelInfo.xpProximoNivel.toLocaleString('pt-BR')} pts</span>
                )}
              </div>
              <div className="w-full h-2 bg-[var(--mq-bar)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${nivelInfo.percentual}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-[var(--mq-primary)] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seção: Progresso na Vida */}
        <div className="mb-4">
          <p className="mq-eyebrow text-center mb-3">NA VIDA</p>
        </div>

        <div className="space-y-3">
          {/* Meus Objetivos */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.21 }}
            className="mq-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                setView('objetivos');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--mq-card)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--mq-card)]">
                  <Target size={20} className="text-[var(--mq-primary)]" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--mq-text)]">Meus Objetivos</h3>
                    <span className="text-xs font-semibold text-[var(--mq-primary)] bg-[var(--mq-primary-light)] px-2 py-0.5 rounded-full">
                      {objetivosInfo.total}/{objetivosInfo.limite}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--mq-text-muted)]">Defina seus objetivos</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[var(--mq-text-subtle)]" />
            </button>
          </motion.section>

          {/* Check-in Semanal */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mq-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                setView('checkinSemanal');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--mq-card)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--mq-card)]">
                  <BarChart3 size={20} className="text-[var(--mq-primary)]" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-base font-bold text-[var(--mq-text)]">Check-in Semanal</h3>
                  <p className="text-xs text-[var(--mq-text-muted)]">Como está seu progresso real?</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[var(--mq-text-subtle)]" />
            </button>
          </motion.section>

          {/* Conquistas na Vida */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.29 }}
            className="mq-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                setView('conquistasVida');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--mq-card)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--mq-card)]">
                  <Trophy size={20} className="text-[var(--mq-warning)]" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--mq-text)]">Conquistas na Vida</h3>
                    {conquistasVida > 0 && (
                      <span className="text-xs font-semibold text-[var(--mq-warning)] bg-[var(--mq-warning-light)] px-2 py-0.5 rounded-full">
                        ({conquistasVida})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--mq-text-muted)]">Objetivos que você alcançou</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[var(--mq-text-subtle)]" />
            </button>
          </motion.section>

          {/* Ações por Objetivo */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33 }}
            className="mq-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                setView('conexaoAcoesObjetivos');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--mq-card)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--mq-card)]">
                  <Link2 size={20} className="text-[var(--mq-primary)]" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[var(--mq-text)]">Ações por Objetivo</h3>
                  <p className="text-xs text-[var(--mq-text-muted)]">Acompanhe o progresso de cada meta</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[var(--mq-text-subtle)]" />
            </button>
          </motion.section>
        </div>
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

export default EvoluirPageV13;

