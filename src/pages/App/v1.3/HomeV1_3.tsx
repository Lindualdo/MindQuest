import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import CardWeeklyProgress from '@/components/app/v1.3/CardWeeklyProgress';
import CardMoodEnergy from '@/components/app/v1.3/CardMoodEnergy';
import CardInsightUltimaConversa from '@/components/app/v1.3/CardInsightUltimaConversa';
import CardSabotadorAtivo from '@/components/app/v1.3/CardSabotadorAtivo';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import { useDashboard } from '@/store/useStore';
import { mockWeeklyXpSummary, mockMoodEnergySummary, mockInsightCard } from '@/data/mockHomeV1_3';
import '@/components/app/v1.2/styles/mq-v1_2-styles.css';

const HomeV1_3 = () => {
  const {
    dashboardData,
    setView,
    openResumoConversas,
    openInsightDetail,
    panoramaCard,
    panoramaCardLoading,
    loadPanoramaCard,
    insightCard,
    insightCardLoading,
    insightCardError,
    loadInsightCard,
    weeklyProgressCard,
    weeklyProgressCardLoading,
    weeklyProgressCardError,
    loadWeeklyProgressCard,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<TabId>('home');

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId || panoramaCard || panoramaCardLoading) return;
    loadPanoramaCard(userId);
  }, [userId, panoramaCard, panoramaCardLoading, loadPanoramaCard]);

  useEffect(() => {
    if (!userId || insightCard || insightCardLoading) return;
    loadInsightCard(userId);
  }, [userId, insightCard, insightCardLoading, loadInsightCard]);

  useEffect(() => {
    if (!userId || weeklyProgressCard || weeklyProgressCardLoading) return;
    loadWeeklyProgressCard(userId);
  }, [userId, weeklyProgressCard, weeklyProgressCardLoading, loadWeeklyProgressCard]);

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

  const handleContinue = () => {
    void openResumoConversas();
  };

  const handleVerHumor = () => {
    setView('humorHistorico');
  };

  const insightCardData = insightCard ?? (!insightCardLoading ? mockInsightCard : null);

  const handleInsightDetail = (insightId?: string | null) => {
    const resolvedId = insightId ?? insightCard?.insight_id ?? insightCardData?.insight_id;
    setView('insightDetail');
    if (resolvedId) {
      void openInsightDetail(resolvedId);
    }
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
    setActiveTab('ajustes');
    // Tela de configurações será implementada na próxima etapa.
  };

  const weeklySummary = weeklyProgressCard ?? mockWeeklyXpSummary;
  const sabotadorAtivo = dashboardData?.sabotadores?.padrao_principal;
  const sabotadorNome = sabotadorAtivo?.nome ?? sabotadorAtivo?.apelido_personalizado ?? null;
  const sabotadorEmoji = sabotadorAtivo?.emoji ?? null;
  const sabotadorDescricao = sabotadorAtivo?.contexto_principal ?? sabotadorAtivo?.insight_atual ?? null;
  const handleVerSabotador = () => {
    setActiveTab('perfil');
    setView('dashSabotadores');
  };

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[0.9rem] font-medium text-[#1C2541]"
        >
          Descubra mais sobre você e destrave seu progresso
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CardWeeklyProgress summary={weeklySummary} onContinue={handleContinue} />
        </motion.div>
        {!weeklyProgressCardLoading && weeklyProgressCardError && (
          <p className="text-center text-[0.72rem] font-medium text-rose-600">
            Não conseguimos atualizar o progresso semanal agora.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
        >
          <CardMoodEnergy summary={moodSummary} onSaberMais={handleVerHumor} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <CardInsightUltimaConversa
            data={insightCardData}
            loading={insightCardLoading}
            onSaberMais={(insightId) => handleInsightDetail(insightId)}
          />
        </motion.div>
        {!insightCardLoading && insightCardError && (
          <p className="text-center text-[0.72rem] font-medium text-rose-600">
            Não conseguimos atualizar o insight agora.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <CardSabotadorAtivo
            sabotadorId={sabotadorAtivo?.id ?? null}
            nome={sabotadorNome}
            emoji={sabotadorEmoji}
            descricao={sabotadorDescricao}
            onVerPainel={sabotadorNome ? handleVerSabotador : undefined}
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
