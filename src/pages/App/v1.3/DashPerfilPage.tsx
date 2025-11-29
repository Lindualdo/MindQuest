import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import EmotionWheel from '@/components/dashboard/EmotionWheel';
import CardPerfilBigFive from '@/components/dashboard/CardPerfilBigFive';
import CardHumor from '@/components/app/v1.3/CardHumor';
import CardEnergia from '@/components/app/v1.3/CardEnergia';
import CardSabotadorMente from '@/components/app/v1.3/CardSabotadorMente';
import { useDashboard } from '@/store/useStore';
import { mockMoodEnergySummary } from '@/data/mockHomeV1_3';

const DashPerfilPage: React.FC = () => {
  const {
    dashboardData,
    view,
    setView,
    panoramaCard,
    panoramaCardLoading,
    loadPanoramaCard,
    openSabotadorDetail,
    openHumorHistorico,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const userId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('perfil');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!userId || panoramaCard || panoramaCardLoading) return;
    loadPanoramaCard(userId);
  }, [userId, panoramaCard, panoramaCardLoading, loadPanoramaCard]);

  const moodSummary = useMemo(() => {
    if (!panoramaCard) {
      return mockMoodEnergySummary;
    }

    const humor = panoramaCard.humor;
    const energia = panoramaCard.energia;

    const humorAtual = Number(humor?.atual ?? mockMoodEnergySummary.humorHoje) || 1;
    const humorMediaSemana = Number(humor?.media_7d ?? humorAtual) || humorAtual;

    const energiaPercentSource =
      typeof energia?.percentual_positiva !== 'undefined'
        ? energia.percentual_positiva
        : energia?.percentual_positivas;

    const energiaPercentPositiva =
      typeof energiaPercentSource === 'number'
        ? energiaPercentSource
        : Number(energiaPercentSource ?? 0) || 0;

    const energiaMediaEscala10 = energiaPercentPositiva / 10;
    const energiaNivelMedia = Math.max(
      1,
      Math.min(10, energiaMediaEscala10 || 1),
    );
    const energiaNivelHoje = energiaNivelMedia;

    return {
      humorHoje: humorAtual,
      humorMediaSemana,
      energiaHoje: energiaNivelHoje,
      energiaMediaSemana: energiaNivelMedia,
    };
  }, [panoramaCard]);

  const sabotadorAtivo = panoramaCard?.sabotador ?? dashboardData?.sabotadores?.padrao_principal ?? null;
  const sabotadorNome =
    sabotadorAtivo?.nome ??
    (sabotadorAtivo && 'apelido' in sabotadorAtivo ? sabotadorAtivo.apelido : null) ??
    dashboardData?.sabotadores?.padrao_principal?.apelido ??
    dashboardData?.sabotadores?.padrao_principal?.nome ??
    null;
  const sabotadorEmoji =
    sabotadorAtivo?.emoji ?? dashboardData?.sabotadores?.padrao_principal?.emoji ?? null;
  const sabotadorDescricao =
    (sabotadorAtivo && 'contexto' in sabotadorAtivo ? sabotadorAtivo.contexto : null) ??
    (sabotadorAtivo && 'insight' in sabotadorAtivo ? sabotadorAtivo.insight : null) ??
    (sabotadorAtivo && 'contexto_principal' in sabotadorAtivo ? sabotadorAtivo.contexto_principal : null) ??
    (sabotadorAtivo && 'insight_contexto' in sabotadorAtivo ? sabotadorAtivo.insight_contexto : null) ??
    dashboardData?.sabotadores?.padrao_principal?.contexto_principal ??
    dashboardData?.sabotadores?.padrao_principal?.insight_contexto ??
    null;

  const handleVerSabotador = () => {
    const id = sabotadorAtivo?.id ?? null;
    if (id) {
      openSabotadorDetail(id);
    } else {
      openSabotadorDetail();
    }
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

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        {/* Título da página */}
        <div className="mb-2 text-center">
          <h1 className="text-3xl font-bold text-[#1C2541] mb-1">
            Mente
          </h1>
          <p className="text-sm text-[#64748B]">
            Entenda seus padrões e evolução
          </p>
        </div>

        {/* Card Humor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CardHumor
            humorAtual={moodSummary.humorHoje}
            humorMediaSemana={moodSummary.humorMediaSemana}
            onHistorico={async () => {
              await openHumorHistorico();
            }}
          />
        </motion.div>

        {/* Card Energia */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
        >
          <CardEnergia energiaAtual={moodSummary.energiaHoje} />
        </motion.div>

        {/* Card da Roda das Emoções */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
        >
          <EmotionWheel />
        </motion.div>

        {/* Card Sabotador */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <CardSabotadorMente
            sabotadorId={sabotadorAtivo?.id ?? null}
            nome={sabotadorNome}
            emoji={sabotadorEmoji}
            descricao={sabotadorDescricao}
            onSaberMais={sabotadorNome ? handleVerSabotador : undefined}
          />
        </motion.div>

        {/* Card Perfil Big Five */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.21 }}
        >
          <CardPerfilBigFive />
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

export default DashPerfilPage;
