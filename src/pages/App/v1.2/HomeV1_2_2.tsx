import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import FraseTransformacao from '@/components/app/v1.2/FraseTransformacao';
import '@/components/app/v1.2/styles/mq-v1_2-styles.css';
import { useDashboard } from '@/store/useStore';
import { getSabotadorById } from '@/data/sabotadoresCatalogo';

const HomeV1_2_2 = () => {
  const {
    dashboardData,
    panoramaCard,
    panoramaCardLoading,
    panoramaCardError,
    loadPanoramaCard,
    conversasCard,
    conversasCardLoading,
    conversasCardError,
    loadConversasCard,
    jornadaCard,
    jornadaCardLoading,
    jornadaCardError,
    loadJornadaCard,
    setView,
    openResumoConversas,
  } = useDashboard();

  const userId = dashboardData?.usuario?.id;

  useEffect(() => {
    if (!userId) return;
    loadPanoramaCard(userId);
    loadConversasCard(userId);
    loadJornadaCard(userId);
  }, [userId, loadPanoramaCard, loadConversasCard, loadJornadaCard]);

  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'MindQuest';

  const {
    nivelLabel,
    xpAtual,
    xpMeta,
    xpRestante,
    progressoNivel,
  } = useMemo(() => {
    const card = jornadaCard;
    const xpMetaValue = card?.xp?.meta ?? 1;
    const xpAtualValue = card?.xp?.atual ?? 0;
    const restante =
      card?.xp?.restante ?? Math.max(xpMetaValue - xpAtualValue, 0);

    return {
      nivelLabel: card?.nivel?.atual ?? 'Nível 1 — Despertar',
      xpAtual: xpAtualValue,
      xpMeta: xpMetaValue,
      xpRestante: Math.max(restante, 0),
      progressoNivel:
        xpMetaValue > 0
          ? Math.min(100, Math.round((xpAtualValue / xpMetaValue) * 100))
          : 0,
    };
  }, [jornadaCard]);

  const {
    streakAtual,
    recorde,
    ultimaConversaLabel,
    miniLinhaDias,
    xpBase,
    xpBonus,
  } = useMemo(() => {
    const card = conversasCard;
    const streakAtualValue = card?.streak?.atual ?? 0;
    const recordeValue = card?.streak?.recorde ?? 0;
    const ultimaLabel = card?.ultima_conversa?.label ?? undefined;
    const xpBaseValue = card?.xp?.base ?? 75;
    const xpBonusValue = card?.xp?.bonus_proxima_meta ?? 40;

    const historico = Array.isArray(card?.historico_diario)
      ? card?.historico_diario ?? []
      : [];

    const miniLinha =
      historico
        .slice(-7)
        .map((dia) => (dia?.tem_conversa ? '●' : '○'))
        .join(' ') || '○ ○ ○ ○ ○ ○ ○';

    return {
      streakAtual: streakAtualValue,
      recorde: recordeValue,
      ultimaConversaLabel: ultimaLabel,
      miniLinhaDias: miniLinha,
      xpBase: xpBaseValue,
      xpBonus: xpBonusValue,
    };
  }, [conversasCard]);

  const {
    humorAtual,
    energiaPositiva,
    emocaoDominante,
    sabotadorAtivo,
  } = useMemo(() => {
    const card = panoramaCard;
    const humor = card?.humor;
    const energia = card?.energia;
    const emo1 = card?.emocoes_dominantes?.[0];
    const sabotador = card?.sabotador;
    const catalogEntry = sabotador?.id
      ? getSabotadorById(String(sabotador.id))
      : undefined;

    return {
      humorAtual: humor?.atual ?? humor?.media_7d ?? 0,
      energiaPositiva: energia?.percentual_positiva ?? 0,
      emocaoDominante:
        emo1?.nome && emo1?.percentual != null
          ? `${emo1.nome} (${Math.round(emo1.percentual)}%)`
          : 'Sem dados disponíveis',
      sabotadorAtivo: sabotador?.nome
        ? `${sabotador.emoji ?? '🧠'} ${sabotador.nome}`.trim()
        : catalogEntry?.nome
          ? `${catalogEntry.emoji ?? '🧠'} ${catalogEntry.nome}`.trim()
          : 'Nenhum sabotador dominante detectado',
    };
  }, [panoramaCard]);

  const insights = dashboardData?.insights ?? [];
  const insightPrincipal = insights[0];

  const pontosInsightLinha1 =
    insightPrincipal?.titulo ??
    'Seu insight mais recente está pronto para você revisar.';
  const pontosInsightLinha2 =
    insightPrincipal?.descricao ??
    'Veja os pontos focais da conversa de hoje e próximos passos sugeridos.';

  const handleVerInsights = () => setView('dashInsights');

  const handleVerHistorico = () => {
    void openResumoConversas();
  };

  const handleVerPainelEmocional = () => setView('dashEmocoes');

  const showLoading =
    panoramaCardLoading || conversasCardLoading || jornadaCardLoading;

  return (
    <div className="mq-app-v1_2 min-h-screen">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />
      <FraseTransformacao floating />

      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pb-20 pt-4">
        {showLoading && (
          <p className="rounded-2xl bg-white/70 px-4 py-2 text-center text-xs font-medium text-slate-600 shadow-sm">
            Atualizando seus dados da jornada...
          </p>
        )}

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mq-card-v1_2 px-4 py-3"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,228,250,0.95), rgba(232,243,245,0.96))',
          }}
        >
          <p className="mq-eyebrow-v1_2 mb-1">Sua jornada hoje</p>
          <p className="text-sm font-semibold text-[#1C2541]">
            {nivelLabel}
          </p>
          <div className="mt-2">
            <div className="mq-bar-track-v1_2 h-2">
              <div
                className="mq-bar-fill-v1_2"
                style={{ width: `${progressoNivel}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[0.7rem] font-medium text-[#1C2541]">
              <span>{xpAtual} XP</span>
              <span>{xpMeta} XP</span>
            </div>
            <p className="mt-1 text-[0.7rem] text-[#4B5563]">
              Faltam <strong>{xpRestante} XP</strong> para o próximo nível.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mq-card-v1_2 px-4 py-4"
          style={{
            backgroundColor: '#FFF9F5',
            borderColor: 'rgba(255,153,110,0.25)',
            boxShadow: '0 10px 18px rgba(255,153,110,0.08)',
          }}
        >
          <header className="mb-2">
            <p className="mq-eyebrow-v1_2 mb-1" style={{ color: '#C14E2B' }}>
              Conversas de hoje
            </p>
            <p className="text-sm font-semibold text-[#1C2541]">
              Última conversa {ultimaConversaLabel ?? 'há pouco tempo'}
            </p>
          </header>

          <p className="text-[0.8rem] font-medium text-[#1C2541]">
            Streak: {streakAtual} dia{streakAtual === 1 ? '' : 's'} seguidos ·
            {' '}
            recorde {recorde} dia{recorde === 1 ? '' : 's'}
          </p>
          <p className="mt-1 text-[0.8rem] text-[#4B5563]">
            Mini linha 7 dias: {miniLinhaDias}
          </p>

          <div className="mt-3 rounded-2xl border border-[#FED7AA] bg-[#FFF3E7] px-3 py-2">
            <p className="text-[0.75rem] font-semibold text-[#C05621]">
              Próxima conversa desbloqueia:
            </p>
            <p className="mt-1 text-[0.75rem] text-[#1C2541]">
              +{xpBase} XP base · +{xpBonus} XP bônus · novo insight
            </p>
          </div>

          <div className="mt-3 rounded-2xl bg-white/85 px-3 py-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[#6B21A8]">
              Pontos focais + insight do dia
            </p>
            <p className="mt-1 line-clamp-1 text-[0.8rem] text-[#1F2937]">
              {pontosInsightLinha1}
            </p>
            <p className="line-clamp-1 text-[0.75rem] text-[#4B5563]">
              {pontosInsightLinha2}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleVerInsights}
              className="mq-cta-primary-v1_2 px-4 py-1.5 text-[0.8rem]"
            >
              Ver insights de hoje
            </button>
            <button
              type="button"
              onClick={handleVerHistorico}
              className="mq-cta-secondary-v1_2 px-4 py-1.5 text-[0.8rem]"
            >
              Histórico
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mq-card-v1_2 px-4 py-3"
          style={{
            backgroundColor: '#F2F6FF',
            borderColor: 'rgba(48,131,220,0.2)',
            boxShadow: '0 10px 18px rgba(48,131,220,0.08)',
          }}
        >
          <p className="mq-eyebrow-v1_2 mb-1" style={{ color: '#1D3557' }}>
            Minhas emoções — visão rápida
          </p>
          <p className="text-[0.8rem] text-[#1C2541]">
            Humor:
            {' '}
            <span className="font-semibold">{humorAtual.toFixed(1)}</span>
            {' '}
            · Energia:
            {' '}
            <span className="font-semibold">
              {Math.round(energiaPositiva)}
              %
            </span>
          </p>
          <p className="mt-1 text-[0.8rem] text-[#1C2541]">
            Emoção dominante:
            {' '}
            <span className="font-semibold">{emocaoDominante}</span>
          </p>
          <p className="mt-1 text-[0.75rem] text-[#4B5563]">
            Sabotador ativo:
            {' '}
            <span className="font-semibold">{sabotadorAtivo}</span>
          </p>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleVerPainelEmocional}
              className="mq-link-inline-v1_2 text-[0.78rem]"
            >
              Ver painel emocional
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </motion.section>

        {(panoramaCardError || conversasCardError || jornadaCardError) && (
          <div className="space-y-1 text-[0.72rem] font-medium text-rose-600">
            {panoramaCardError && (
              <p>Erro ao carregar panorama emocional: {panoramaCardError}</p>
            )}
            {conversasCardError && (
              <p>Erro ao carregar conversas: {conversasCardError}</p>
            )}
            {jornadaCardError && (
              <p>Erro ao carregar jornada: {jornadaCardError}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeV1_2_2;

