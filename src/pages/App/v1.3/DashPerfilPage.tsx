import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import HeaderV1_3 from '@/components/app/v1.3/HeaderV1_3';
import '@/components/app/v1.3/styles/mq-v1_3-styles.css';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import EmotionWheel from '@/components/dashboard/EmotionWheel';
import CardPerfilBigFiveRanking from '@/components/app/v1.3/CardPerfilBigFiveRanking';
import CardHumor from '@/components/app/v1.3/CardHumor';
import CardEnergia from '@/components/app/v1.3/CardEnergia';
import CardSabotadoresRanking, { type SabotadorRankingItem, mockSabotadoresRanking } from '@/components/app/v1.3/CardSabotadoresRanking';
import { useDashboard } from '@/store/useStore';
import { mockMoodEnergySummary } from '@/data/mockHomeV1_3';
import { apiService } from '@/services/apiService';
import type { BigFivePerfilData } from '@/types/emotions';

const DashPerfilPage: React.FC = () => {
  const {
    dashboardData,
    setView,
    panoramaCard,
    panoramaCardLoading,
    loadPanoramaCard,
    openSabotadorDetail,
    openHumorHistorico,
    openPerfilBigFiveDetail,
  } = useDashboard();

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const userId = dashboardData?.usuario?.id;

  const [activeTab, setActiveTab] = useState<TabId>('entender');
  const [perfilBigFive, setPerfilBigFive] = useState<BigFivePerfilData | null>(null);
  const [perfilBigFiveLoading, setPerfilBigFiveLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!userId || panoramaCard || panoramaCardLoading) return;
    loadPanoramaCard(userId);
  }, [userId, panoramaCard, panoramaCardLoading, loadPanoramaCard]);

  useEffect(() => {
    if (!userId || perfilBigFive || perfilBigFiveLoading) return;
    
    const loadPerfil = async () => {
      try {
        setPerfilBigFiveLoading(true);
        const response = await apiService.getPerfilBigFive(userId);
        if (response.success && response.perfil) {
          setPerfilBigFive(response.perfil);
        }
      } catch (err) {
        console.error('Erro ao carregar perfil Big Five:', err);
      } finally {
        setPerfilBigFiveLoading(false);
      }
    };

    void loadPerfil();
  }, [userId, perfilBigFive, perfilBigFiveLoading]);

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
  // Usa dados da API se disponíveis, senão usa mock com todos os 9 sabotadores
  const sabotadoresRanking = useMemo((): SabotadorRankingItem[] => {
    const sabotadoresDaApi = panoramaCard?.sabotadores_todos;
    
    // Se a API retornou dados, usa eles
    if (Array.isArray(sabotadoresDaApi) && sabotadoresDaApi.length > 0) {
      return sabotadoresDaApi.map((s) => ({
        sabotador_id: s.sabotador_id,
        total_deteccoes: s.total_deteccoes,
        intensidade_media: s.intensidade_media,
        insight_atual: s.insight_atual,
        contramedida_ativa: s.contramedida_ativa,
        contexto_principal: s.contexto_principal,
      }));
    }
    
    // Fallback: mock com todos os 9 sabotadores para visualização
    return mockSabotadoresRanking;
  }, [panoramaCard]);

  const sabotadorAtualId = panoramaCard?.sabotador?.id ?? dashboardData?.sabotadores?.padrao_principal?.id ?? null;

  const handleSabotadorClick = (sabotadorId: string) => {
    openSabotadorDetail(sabotadorId);
  };

  const handlePerfilBigFiveClick = (tracoId: string) => {
    openPerfilBigFiveDetail(tracoId);
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

        {/* Card Ranking de Sabotadores - No topo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CardSabotadoresRanking
            sabotadores={sabotadoresRanking}
            sabotadorAtualId={sabotadorAtualId}
            onBarClick={handleSabotadorClick}
            loading={panoramaCardLoading}
          />
        </motion.div>

        {/* Card Humor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
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
          transition={{ delay: 0.13 }}
        >
          <CardEnergia energiaAtual={moodSummary.energiaHoje} />
        </motion.div>

        {/* Card da Roda das Emoções */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <EmotionWheel />
        </motion.div>

        {/* Card Perfil Big Five Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.21 }}
        >
          <CardPerfilBigFiveRanking
            tracos={perfilBigFive?.tracos_ordenados || []}
            tracoAtualId={null}
            onBarClick={handlePerfilBigFiveClick}
            loading={perfilBigFiveLoading}
          />
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
