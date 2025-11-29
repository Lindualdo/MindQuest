import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Target, Palette, BookOpen, ChevronRight, TrendingUp, Star } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

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
    setView('evoluir');
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
    <div className="mq-app-v1_3 flex min-h-screen flex-col bg-white">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-24 pt-4">
        {/* Botão voltar */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1C2541] shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {/* Título da página */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1C2541] mb-1">
            Evoluir
          </h1>
          <p className="text-sm text-[#64748B]">
            Personalize sua jornada
          </p>
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
              className="w-full rounded-2xl border p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
              className="w-full rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
              style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
            >
              <p className="text-sm font-semibold text-[#64748B] mb-2">Conversas</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-4xl font-bold text-[#1C2541] leading-none">
                  {totalConversas}
                </span>
                <TrendingUp size={16} className="text-[#0EA5E9]" />
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
              className="w-full rounded-2xl border p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
              className="w-full rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
              style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
            >
              <p className="text-sm font-semibold text-[#64748B] mb-2">Ações</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-4xl font-bold text-[#1C2541] leading-none">
                  {totalQuestsConcluidas}
                </span>
                <TrendingUp size={16} className="text-[#0EA5E9]" />
              </div>
            </button>
          </motion.div>

          {/* Card Pontos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
          >
            <div className="w-full rounded-2xl border p-5 shadow-md flex flex-col items-center justify-center text-center"
              className="w-full rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center"
              style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
            >
              <p className="text-sm font-semibold text-[#64748B] mb-2">Pontos</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-4xl font-bold text-[#1C2541] leading-none">
                  {totalXpFormatted}
                </span>
                <Star size={16}  />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Seções do Menu */}
        <div className="space-y-3">
          {/* Seção 1: Objetivos */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.09 }}
            className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] overflow-hidden shadow-md"
            style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
          >
            <button
              type="button"
              onClick={() => {
                setView('objetivos');
                setActiveTab('ajustes');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/60">
                  <Target size={20}  />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold" >Objetivos</h3>
                  <p className="text-xs" >Defina e acompanhe suas metas</p>
                </div>
              </div>
              <ChevronRight size={20}  />
            </button>
          </motion.section>

          {/* Seção 2: Perfil Pessoal */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] overflow-hidden shadow-md"
            style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
          >
            <button
              type="button"
              onClick={() => {
                setView('perfilPessoal');
                setActiveTab('ajustes');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/60">
                  <User size={20}  />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold" >Perfil Pessoal</h3>
                  <p className="text-xs" >Personalize sua experiência</p>
                </div>
              </div>
              <ChevronRight size={20}  />
            </button>
          </motion.section>

          {/* Seção 3: Aparência */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.17 }}
            className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] overflow-hidden shadow-md"
            style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
          >
            <button
              type="button"
              className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/60">
                  <Palette size={20}  />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold" >Aparência</h3>
                  <p className="text-xs" >Tema e personalização visual</p>
                </div>
              </div>
              <ChevronRight size={20}  />
            </button>
          </motion.section>

          {/* Seção 4: Recursos */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.21 }}
            className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] overflow-hidden shadow-md"
            style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
          >
            <button
              type="button"
              className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/60">
                  <BookOpen size={20} className="text-[#0EA5E9]" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold" >Recursos</h3>
                  <p className="text-xs" >Conquistas, ajuda e feedback</p>
                </div>
              </div>
              <ChevronRight size={20}  />
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

