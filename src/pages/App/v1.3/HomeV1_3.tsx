import { useState } from 'react';
import { motion } from 'framer-motion';
import CardWeeklyProgress from '@/components/app/v1.3/CardWeeklyProgress';
import CardMoodEnergy from '@/components/app/v1.3/CardMoodEnergy';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import { useDashboard } from '@/store/useStore';
import { mockWeeklyXpSummary, mockMoodEnergySummary } from '@/data/mockHomeV1_3';
import '@/components/app/v1.2/styles/mq-v1_2-styles.css';

const HomeV1_3 = () => {
  const {
    dashboardData,
    setView,
    openResumoConversas,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<TabId>('home');

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const primeiroNome = nomeUsuario.split(' ')[0] ?? nomeUsuario;

  const handleContinue = () => {
    void openResumoConversas();
  };

  const handleVerInsights = () => {
    setView('dashInsights');
  };

  const handleNavHome = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setActiveTab('config');
    // Tela de configurações será implementada na próxima etapa.
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <header
        className="border-b text-center"
        style={{
          backgroundColor: '#FAD0F0',
          borderColor: 'rgba(28,37,65,0.06)',
        }}
      >
        <div className="mx-auto flex w-full max-w-md items-center justify-center px-4 py-3">
          <p className="text-sm font-semibold tracking-wide text-[#1C2541]">
            OLÁ,
            {' '}
            {primeiroNome.toUpperCase()}
            !
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[0.9rem] font-medium text-[#1C2541]"
        >
          Comece agora a evoluir
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CardWeeklyProgress summary={mockWeeklyXpSummary} onContinue={handleContinue} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <CardMoodEnergy
            summary={mockMoodEnergySummary}
            onVerInsights={handleVerInsights}
          />
        </motion.div>
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

export default HomeV1_3;

