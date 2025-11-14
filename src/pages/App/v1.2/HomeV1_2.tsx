import { useEffect, useMemo } from 'react';
import CardPanoramaEmocional from '@/components/app/v1.2/CardEmocoes';
import CardConversas from '@/components/app/v1.2/CardConversas';
import CardQuestAtiva from '@/components/app/v1.2/CardQuest';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import HumorHistoryPage from '@/pages/App/HumorHistoryPage';
import SabotadoresDashboardPage from '@/pages/App/SabotadoresDashboardPage';
import EmocoesDashboardPageV12 from '@/pages/App/v1.2/dash_emocoes/EmocoesDashboardPageV12';
import PanasDetailPage from '@/pages/App/PanasDetailPage';
import ResumoConversasPage from '@/pages/App/ResumoConversasPage';
import '@/components/app/v1.2/styles/mq-v1_2-styles.css';
import InsightsDashboardPage from '@/pages/App/InsightsDashboardPage';
import InsightDetailPage from '@/pages/App/InsightDetailPage';
import PainelQuestsPage from '@/pages/App/PainelQuestsPage';
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
    conversasCard,
    conversasCardLoading,
    conversasCardError,
    loadConversasCard,
    openResumoConversas,
    questsCard,
    questsCardLoading,
    questsCardError,
    loadQuestsCard,
  } = useDashboard();

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }
    loadPanoramaCard(userId);
    loadConversasCard(userId);
    loadQuestsCard(userId);
  }, [userId, loadPanoramaCard, loadConversasCard, loadQuestsCard]);

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
  const handleVerEmocoes = () => setView('dashEmocoes');
  const handleVerInsights = () => setView('dashInsights');
  const handleVerPainelQuests = () => setView('painelQuests');
  const handleExplorarConversas = () => {
    void openResumoConversas();
  };

  const showLoadingBanner = (isLoading && !cardData) || panoramaCardLoading;

  const {
    streakAtual,
    recorde,
    progressoAtual,
    progressoMeta,
    beneficios,
    xpBonus,
    ultimaConversaLabel,
  } = useMemo(() => {
    const card = conversasCard;
    return {
      streakAtual: card?.streak?.atual ?? 0,
      recorde: card?.streak?.recorde ?? 0,
      progressoAtual: card?.progresso?.atual ?? 0,
      progressoMeta: card?.progresso?.meta ?? 1,
      beneficios: card?.beneficios ?? [
        '+75 XP base',
        '+40 XP bônus',
        'Novo insight personalizado',
        'Progresso na Quest ativa',
      ],
      xpBonus: card?.xp?.bonus_proxima_meta ?? 40,
      ultimaConversaLabel: card?.ultima_conversa?.label ?? undefined,
    };
  }, [conversasCard]);

  const {
    questTitulo,
    questDescricao,
    questProgressoAtual,
    questProgressoMeta,
    questXpRecompensa,
    questBeneficios,
    questPrioridade,
    questRecorrencia,
    questStatus,
    questAtualizacaoLabel,
  } = useMemo(() => {
    const quest = questsCard?.quest;
    return {
      questTitulo: quest?.titulo ?? 'Nenhuma quest ativa',
      questDescricao: quest?.descricao ?? 'Ative novas micro ações para manter seu ritmo.',
      questProgressoAtual: quest?.progresso?.atual ?? 0,
      questProgressoMeta: quest?.progresso?.meta ?? 1,
      questXpRecompensa: quest?.xp_recompensa ?? questsCard?.recompensas?.xp_base ?? 150,
      questBeneficios: questsCard?.beneficios ?? ['+150 XP base', '+30 XP bônus recorrência'],
      questPrioridade: quest?.prioridade ?? null,
      questRecorrencia: quest?.recorrencia ?? null,
      questStatus: quest?.status ?? null,
      questAtualizacaoLabel: quest?.ultima_atualizacao_label ?? null,
    };
  }, [questsCard]);

  if (view === 'humorHistorico') {
    return <HumorHistoryPage />;
  }

  if (view === 'dashSabotadores') {
    return <SabotadoresDashboardPage />;
  }

  if (view === 'dashEmocoes') {
    return <EmocoesDashboardPageV12 />;
  }

  if (view === 'panasDetail') {
    return <PanasDetailPage />;
  }

  if (view === 'resumoConversas') {
    return <ResumoConversasPage />;
  }

  if (view === 'dashInsights') {
    return <InsightsDashboardPage />;
  }

  if (view === 'insightDetail') {
    return <InsightDetailPage />;
  }

  if (view === 'painelQuests') {
    return <PainelQuestsPage />;
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
          onVerEmocoes={handleVerEmocoes}
          onVerInsights={handleVerInsights}
        />

        <CardConversas
          streakAtual={streakAtual}
          recorde={recorde}
          progressoAtual={progressoAtual}
          progressoMeta={Math.max(progressoMeta, 1)}
          beneficios={beneficios}
          xpBonus={xpBonus}
          ultimaConversaLabel={ultimaConversaLabel}
          onVerInsights={handleVerInsights}
          onExplorarHistorico={handleExplorarConversas}
        />

        <CardQuestAtiva
          titulo={questTitulo}
          descricao={questDescricao}
          progressoAtual={questProgressoAtual}
          progressoMeta={questProgressoMeta}
          xpRecompensa={questXpRecompensa}
          beneficios={questBeneficios}
          prioridade={questPrioridade}
          recorrencia={questRecorrencia}
          status={questStatus}
          ultimaAtualizacaoLabel={questAtualizacaoLabel}
          onAbrirPainel={handleVerPainelQuests}
        />

        {panoramaCardError && (
          <p className="text-xs font-medium text-rose-600">
            Não foi possível carregar o panorama emocional: {panoramaCardError}
          </p>
        )}
        {conversasCardError && (
          <p className="text-xs font-medium text-rose-600">
            Não foi possível carregar o card de conversas: {conversasCardError}
          </p>
        )}
        {conversasCardLoading && (
          <p className="text-xs font-medium text-slate-500">Carregando dados das conversas...</p>
        )}
        {questsCardError && (
          <p className="text-xs font-medium text-rose-600">
            Não foi possível carregar o card de quests: {questsCardError}
          </p>
        )}
        {questsCardLoading && (
          <p className="text-xs font-medium text-slate-500">Carregando progresso das quests...</p>
        )}
      </div>
    </div>
  );
};

export default HomeV1_2;
