import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Target, Palette, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';

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

  // Dados de progresso
  const totalConversas = dashboardData?.gamificacao?.total_conversas ?? 0;
  const totalQuestsConcluidas = useMemo(() => {
    const quests = questSnapshot?.quests_personalizadas ?? [];
    return quests.filter(q => q.status === 'concluida' || q.status === 'inativa').length;
  }, [questSnapshot]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

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

        {/* Cards de Progresso: Conversas e Ações */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Card Conversas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <button
              type="button"
              onClick={handleVerHistoricoConversas}
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
              className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/60">
                  <Target size={20} className="text-[#0EA5E9]" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[#1C2541]">Objetivos</h3>
                  <p className="text-xs text-[#64748B]">Defina e acompanhe suas metas</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
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
              className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/60">
                  <User size={20} className="text-[#0EA5E9]" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[#1C2541]">Perfil Pessoal</h3>
                  <p className="text-xs text-[#64748B]">Personalize sua experiência</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
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
                  <Palette size={20} className="text-[#0EA5E9]" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-[#1C2541]">Aparência</h3>
                  <p className="text-xs text-[#64748B]">Tema e personalização visual</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
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
                  <h3 className="text-base font-bold text-[#1C2541]">Recursos</h3>
                  <p className="text-xs text-[#64748B]">Conquistas, ajuda e feedback</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#94A3B8]" />
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

