import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import EmotionWheel from '@/components/dashboard/EmotionWheel';
import CardPerfilBigFive from '@/components/dashboard/CardPerfilBigFive';
import CardHumor from '@/components/app/v1.3/CardHumor';
import CardEnergia from '@/components/app/v1.3/CardEnergia';
import CardSabotadoresRanking, { type SabotadorRankingItem } from '@/components/app/v1.3/CardSabotadoresRanking';
import { useDashboard } from '@/store/useStore';
import { mockMoodEnergySummary } from '@/data/mockHomeV1_3';

const DashPerfilPage: React.FC = () => {
  const {
    dashboardData,
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

  const [activeTab, setActiveTab] = useState<TabId>('entender');

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

  // Dados de sabotadores para o ranking
  // TODO: Integrar com API real quando disponível
  const sabotadoresRanking = useMemo((): SabotadorRankingItem[] => {
    const sabotadorPanorama = panoramaCard?.sabotador;
    const sabotadorDash = dashboardData?.sabotadores?.padrao_principal;
    
    const sabotadorId = sabotadorPanorama?.id ?? sabotadorDash?.id ?? null;
    if (!sabotadorId) {
      return [];
    }

    // Extrair valores com verificação de tipo
    const totalDeteccoes = 
      (sabotadorPanorama && 'total_deteccoes' in sabotadorPanorama ? Number(sabotadorPanorama.total_deteccoes) : null) ??
      (sabotadorDash && 'total_deteccoes' in sabotadorDash ? Number(sabotadorDash.total_deteccoes) : null) ??
      15;
    
    const intensidadeMedia = 
      (sabotadorPanorama && 'intensidade_media' in sabotadorPanorama ? Number(sabotadorPanorama.intensidade_media) : null) ??
      (sabotadorDash && 'intensidade_media' in sabotadorDash ? Number(sabotadorDash.intensidade_media) : null) ??
      68;

    const insightAtual = 
      (sabotadorPanorama && 'insight' in sabotadorPanorama ? String(sabotadorPanorama.insight ?? '') : null) ??
      (sabotadorDash && 'insight_atual' in sabotadorDash ? String(sabotadorDash.insight_atual ?? '') : null) ??
      null;

    const contramedida = 
      (sabotadorPanorama && 'contramedida' in sabotadorPanorama ? String(sabotadorPanorama.contramedida ?? '') : null) ??
      (sabotadorDash && 'contramedida_ativa' in sabotadorDash ? String(sabotadorDash.contramedida_ativa ?? '') : null) ??
      null;

    const contexto = 
      (sabotadorPanorama && 'contexto' in sabotadorPanorama ? String(sabotadorPanorama.contexto ?? '') : null) ??
      (sabotadorDash && 'contexto_principal' in sabotadorDash ? String(sabotadorDash.contexto_principal ?? '') : null) ??
      null;

    // Construir lista com sabotador principal + mock de outros detectados
    // Quando a API estiver disponível, substituir por dados reais
    const principal: SabotadorRankingItem = {
      sabotador_id: sabotadorId,
      total_deteccoes: totalDeteccoes || 15,
      intensidade_media: intensidadeMedia || 68,
      insight_atual: insightAtual || null,
      contramedida_ativa: contramedida || null,
      contexto_principal: contexto || null,
    };

    // Mock de sabotadores secundários para visualização
    // Remover quando integrar com API real
    const mockSecundarios: SabotadorRankingItem[] = [
      {
        sabotador_id: 'inquieto',
        total_deteccoes: 12,
        intensidade_media: 55,
      },
      {
        sabotador_id: 'hipervigilante',
        total_deteccoes: 8,
        intensidade_media: 62,
      },
    ].filter(s => s.sabotador_id !== sabotadorId);

    return [principal, ...mockSecundarios];
  }, [panoramaCard, dashboardData]);

  const sabotadorAtualId = panoramaCard?.sabotador?.id ?? dashboardData?.sabotadores?.padrao_principal?.id ?? null;

  const handleSabotadorClick = (sabotadorId: string) => {
    openSabotadorDetail(sabotadorId);
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

  return (
    <div className="mq-app-v1_3 flex min-h-screen flex-col">
      <HeaderV1_3 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        {/* Título da página */}
        <div className="mb-2 text-center">
          <h1 className="mq-page-title">
            Entender
          </h1>
          <p className="mq-page-subtitle">
            Seus padrões e emoções
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

        {/* Card Ranking de Sabotadores */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <CardSabotadoresRanking
            sabotadores={sabotadoresRanking}
            sabotadorAtualId={sabotadorAtualId}
            onBarClick={handleSabotadorClick}
            loading={panoramaCardLoading}
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
        onConversar={handleNavConversar}
        onEntender={handleNavEntender}
        onAgir={handleNavAgir}
        onEvoluir={handleNavEvoluir}
      />
    </div>
  );
};

export default DashPerfilPage;
