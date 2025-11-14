import { useEffect, useMemo } from 'react';
import CardPanoramaEmocional from '@/components/app/v1.2/CardEmocoes';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import HumorHistoryPage from '@/pages/App/HumorHistoryPage';
import SabotadoresDashboardPage from '@/pages/App/SabotadoresDashboardPage';
import '@/components/app/v1.2/styles/mq-v1_2-styles.css';
import { useDashboard } from '@/store/useStore';
import { getSabotadorById } from '@/data/sabotadoresCatalogo';

const formatEmotion = (nome?: string | null, percentual?: number | null) => {
  if (!nome) {
    return 'Sem dados disponíveis';
  }
  const value = percentual === undefined || percentual === null ? '--' : `${Math.round(percentual)}%`;
  return `${nome} · ${value}`;
};

const HomeV1_2 = () => {
  const {
    dashboardData,
    panoramaCard,
    panoramaCardLoading,
    panoramaCardError,
    loadPanoramaCard,
    isLoading,
    setView,
    view,
  } = useDashboard();

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }
    loadPanoramaCard(userId);
  }, [userId, loadPanoramaCard]);

  const cardData = panoramaCard;

  const {
    humorAtual,
    humorMedio,
    energiaPositiva,
    emocaoDominante,
    emocaoDominante2,
    sabotadorAtivo,
    sabotadorDescricao,
  } = useMemo(() => {
    const humor = cardData?.humor;
    const energia = cardData?.energia;
    const emo1 = cardData?.emocoes_dominantes?.[0];
    const emo2 = cardData?.emocoes_dominantes?.[1];
    const sabotador = cardData?.sabotador;
    const catalogEntry = sabotador?.id ? getSabotadorById(String(sabotador.id)) : undefined;
    const descricaoCatalogo = catalogEntry?.descricao ?? catalogEntry?.resumo ?? '';
    const primeiraFraseDescricao =
      descricaoCatalogo
        .split('.')
        .map((frase) => frase.trim())
        .find((frase) => frase.length > 0) ?? '';
    const descricaoFormatada = primeiraFraseDescricao
      ? `${primeiraFraseDescricao}${primeiraFraseDescricao.endsWith('.') ? '' : '.'}`
      : null;

    return {
      humorAtual: humor?.atual ?? humor?.media_7d ?? 0,
      humorMedio: humor?.media_7d ?? humor?.atual ?? 0,
      energiaPositiva: energia?.percentual_positiva ?? 0,
      emocaoDominante: formatEmotion(emo1?.nome ?? null, emo1?.percentual ?? null),
      emocaoDominante2: formatEmotion(emo2?.nome ?? null, emo2?.percentual ?? null),
      sabotadorAtivo: sabotador?.nome
        ? `${sabotador.emoji ?? '🧠'} ${sabotador.nome}`.trim()
        : 'Nenhum sabotador dominante detectado',
      sabotadorDescricao: descricaoFormatada,
    };
  }, [cardData]);

  const nomeUsuario = dashboardData?.usuario?.nome_preferencia
    ?? dashboardData?.usuario?.nome
    ?? 'MindQuest';
  const handleExplore = () => setView('humorHistorico');
  const handleVerSabotadores = () => setView('dashSabotadores');

  const showLoadingBanner = (isLoading && !cardData) || panoramaCardLoading;

  if (view === 'humorHistorico') {
    return <HumorHistoryPage />;
  }

  if (view === 'dashSabotadores') {
    return <SabotadoresDashboardPage />;
  }

  return (
    <div className="mq-app-v1_2 min-h-screen">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-24 pt-6 sm:gap-6">
        {showLoadingBanner && (
          <p className="rounded-2xl bg-white/70 px-4 py-2 text-center text-xs font-medium text-slate-600 shadow-sm">
            Atualizando panorama emocional...
          </p>
        )}

        <CardPanoramaEmocional
          humorAtual={humorAtual}
          humorMedio={humorMedio}
          energiaPositiva={energiaPositiva}
          emocaoDominante={emocaoDominante}
        emocaoDominante2={emocaoDominante2}
        sabotadorAtivo={sabotadorAtivo}
        sabotadorDescricao={sabotadorDescricao}
        onExplorar={handleExplore}
        onVerSabotadores={handleVerSabotadores}
      />

        {panoramaCardError && (
          <p className="text-xs font-medium text-rose-600">
            Não foi possível carregar o panorama emocional: {panoramaCardError}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeV1_2;
