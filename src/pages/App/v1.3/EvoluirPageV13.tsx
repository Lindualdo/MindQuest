import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, ChevronRight, TrendingUp, Star, BarChart3, Trophy, Link2 } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import { gamificacaoLevels } from '@/data/gamificacaoLevels';

interface EvoluirStats {
  total_conversas: number;
  total_quests_concluidas: number;
  xp_total: number;
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

  const [activeTab, setActiveTab] = useState<TabId>('ajustes');
  const [stats, setStats] = useState<EvoluirStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Dados de progresso - usar stats da API se disponível, senão fallback para dados existentes
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
  const totalXp = useMemo(() => {
    const xp = stats?.xp_total ?? dashboardData?.gamificacao?.xp_total ?? 0;
    return typeof xp === 'number' ? xp : Number(xp) || 0;
  }, [stats, dashboardData]);
  
  const totalXpFormatted = useMemo(() => {
    return totalXp.toLocaleString('pt-BR');
  }, [totalXp]);

  // Calcular nível e estágio (mockado por enquanto)
  const nivelInfo = useMemo(() => {
    const level = gamificacaoLevels.find(l => totalXp >= l.xp_minimo && (l.xp_proximo_nivel === null || totalXp < l.xp_proximo_nivel)) 
      || gamificacaoLevels[gamificacaoLevels.length - 1];
    
    const xpAtual = totalXp - level.xp_minimo;
    const xpNecessario = level.xp_proximo_nivel ? level.xp_proximo_nivel - level.xp_minimo : 0;
    const percentual = level.xp_proximo_nivel ? Math.min(100, Math.round((xpAtual / xpNecessario) * 100)) : 100;
    
    // Calcular estágio: 1-3=estágio1, 4-6=estágio2, 7-9=estágio3, 10+=estágio4
    const calcularEstagio = (nivel: number) => {
      if (nivel <= 3) return 1;
      if (nivel <= 6) return 2;
      if (nivel <= 9) return 3;
      return 4;
    };
    
    const estagio = calcularEstagio(level.nivel);
    const estagioLabel = estagio === 1 ? 'Início da jornada' : 
                         estagio === 2 ? 'Crescimento' : 
                         estagio === 3 ? 'Consolidação' : 
                         'Mestria';
    
    return {
      nivel: level.nivel,
      titulo: level.titulo,
      xpAtual,
      xpNecessario,
      xpProximoNivel: level.xp_proximo_nivel,
      percentual,
      estagio,
      estagioLabel,
    };
  }, [totalXp]);

  // Dados mockados para contadores
  const objetivosAtivos = 2; // Mock
  const checkinPendente = true; // Mock - badge [!]
  const conquistasVida = 1; // Mock


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
        const url = `/api/evoluir-stats?user_id=${encodeURIComponent(usuarioId)}`;
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
    setView('dashboard');
    setActiveTab('home');
  };

  const handleNavHome = () => {
    setActiveTab('home');
    setView('dashboard');
  };

  const handleNavPerfil = () => {
    setActiveTab('perfil');
    setView('dashEmocoes');
  };

  const handleNavQuests = () => {
    setActiveTab('quests');
    setView('painelQuests');
  };

  const handleNavConfig = () => {
    setActiveTab('ajustes');
    setView('jornada');
  };

  const handleVerHistoricoConversas = async () => {
    await openResumoConversas();
  };

  const handleVerAcoesConcluidas = () => {
    setView('painelQuests');
    setActiveTab('quests');
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
              onClick={handleVerAcoesConcluidas}
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
            <div className="mq-card w-full p-5 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-[var(--mq-text-muted)] mb-2">Pontos</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-4xl font-bold text-[var(--mq-text)] leading-none">
                  {totalXpFormatted}
                </span>
                <Star size={16} className="text-[var(--mq-warning)]" />
              </div>
            </div>
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
              <h3 className="text-base font-bold text-[var(--mq-text)] mb-1">
                Nível {nivelInfo.nivel} · {nivelInfo.titulo}
              </h3>
              <p className="text-xs text-[var(--mq-text-muted)]">
                Estágio {nivelInfo.estagio} de 4 · {nivelInfo.estagioLabel}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[var(--mq-text-muted)]">
                <span>{nivelInfo.xpAtual} XP</span>
                {nivelInfo.xpProximoNivel && (
                  <span>{nivelInfo.xpProximoNivel} XP</span>
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
                    {objetivosAtivos > 0 && (
                      <span className="text-xs font-semibold text-[var(--mq-primary)] bg-[var(--mq-primary-light)] px-2 py-0.5 rounded-full">
                        ({objetivosAtivos})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--mq-text-muted)]">Definir e acompanhar metas</p>
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--mq-text)]">Check-in Semanal</h3>
                    {checkinPendente && (
                      <span className="text-xs font-semibold text-[var(--mq-warning)] bg-[var(--mq-warning-light)] px-2 py-0.5 rounded-full">
                        !
                      </span>
                    )}
                  </div>
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

          {/* Conexão Ações × Objetivos */}
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
                  <h3 className="text-base font-bold text-[var(--mq-text)]">Conexão Ações × Objetivos</h3>
                  <p className="text-xs text-[var(--mq-text-muted)]">Quais ações impactaram cada objetivo</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[var(--mq-text-subtle)]" />
            </button>
          </motion.section>
        </div>
      </main>

      <BottomNavV1_3
        active={activeTab}
        onHome={handleNavHome}
        onPerfil={handleNavPerfil}
        onQuests={handleNavQuests}
        onConfig={handleNavConfig}
      />
    </div>
  );
};

export default EvoluirPageV13;

