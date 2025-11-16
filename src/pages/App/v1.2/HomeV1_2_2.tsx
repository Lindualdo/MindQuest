import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
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
    xpBase,
    xpBonus,
    miniDias,
    streakMetaDias,
    streakProgressoAtual,
    percentualStreak,
  } = useMemo(() => {
    const card = conversasCard;
    const streakAtualValue = card?.streak?.atual ?? 0;
    const recordeValue = card?.streak?.recorde ?? 0;
    const ultimaLabel = card?.ultima_conversa?.label ?? undefined;
    const xpBaseValue = card?.xp?.base ?? 75;
    const xpBonusValue = card?.xp?.bonus_proxima_meta ?? 40;

    const metaDias = card?.progresso?.meta ?? 3;
    const progressoDias = card?.progresso?.atual ?? streakAtualValue;
    const percentual =
      metaDias > 0
        ? Math.min(100, Math.round((progressoDias / metaDias) * 100))
        : 0;

    const historico = Array.isArray(card?.historico_diario)
      ? card?.historico_diario ?? []
      : [];

    const labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const parseDate = (value?: string | null) => {
      if (!value) return null;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        const [year, month, day] = value.split('-').map(Number);
        if ([year, month, day].some((part) => Number.isNaN(part))) return null;
        const parsed = new Date(year, (month ?? 1) - 1, day ?? 1);
        parsed.setHours(0, 0, 0, 0);
        return parsed;
      }
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const sorted = [...historico].sort((a, b) => {
      const da = parseDate(a?.data ?? null);
      const db = parseDate(b?.data ?? null);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da.getTime() - db.getTime();
    });

    const limited = sorted.slice(-7);

    const miniDiasLocal = limited.map((dia, index) => {
      const parsedDate = parseDate(dia?.data ?? null);
      const labelIndex = parsedDate ? parsedDate.getDay() : index % labels.length;
      const label = labels[labelIndex] ?? labels[0];
      const conversas =
        typeof dia?.conversas === 'number'
          ? dia.conversas
          : Number(dia?.conversas ?? 0) || 0;
      const temConversa = Boolean(dia?.tem_conversa || conversas > 0);
      return {
        label,
        filled: temConversa,
      };
    });

    return {
      streakAtual: streakAtualValue,
      recorde: recordeValue,
      ultimaConversaLabel: ultimaLabel,
      miniDias: miniDiasLocal,
      xpBase: xpBaseValue,
      xpBonus: xpBonusValue,
      streakMetaDias: metaDias,
      streakProgressoAtual: progressoDias,
      percentualStreak: percentual,
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

  const handleNavHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavConversas = () => {
    void openResumoConversas();
  };

  const handleNavQuests = () => setView('painelQuests');

  const handleNavConquistas = () => setView('conquistas');

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
              Diário de conversas
            </p>
            <p className="mt-0.5 text-[0.75rem] text-[#64748B]">
              Última conversa {ultimaConversaLabel ?? 'há pouco tempo'}
            </p>
          </header>

          <div className="mt-2">
            <div className="flex items-center justify-between text-[0.8rem] font-medium">
              <span className="inline-flex items-center gap-1 text-[#F97316]">
                <Flame size={14} />
                Streak realizado:
                {' '}
                {streakProgressoAtual}
                /
                {streakMetaDias}
                {' '}
                dia
                {streakMetaDias === 1 ? '' : 's'}
              </span>
              <span className="text-[#64748B]">
                Recorde
                {' '}
                {recorde}
                {' '}
                dia
                {recorde === 1 ? '' : 's'}
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-[#FFE7D6]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percentualStreak}%`,
                  backgroundColor: '#FB923C',
                }}
              />
            </div>
          </div>

          {miniDias.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              {miniDias.map((dia, index) => (
                <div
                  key={`${dia.label}-${index}`}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: dia.filled ? '#F97316' : 'transparent',
                      border: dia.filled
                        ? 'none'
                        : '1px solid rgba(148,163,184,0.6)',
                    }}
                  />
                  <span className="text-[0.6rem] font-semibold text-[#4B5563]">
                    {dia.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 rounded-2xl border border-[#FED7AA] bg-[#FFF3E7] px-3 py-2">
            <p className="text-[0.75rem] font-semibold text-[#C05621]">
              Próxima conversa desbloqueia:
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-1 text-[0.75rem] text-[#1C2541]">
              <span>
                {xpBase}
                {' '}
                XP base
              </span>
              <span className="mx-1 text-[#CBD5E1]">|</span>
              <span>
                {xpBonus}
                {' '}
                XP bônus
              </span>
              <span className="mx-1 text-[#CBD5E1]">|</span>
              <span>novo insight</span>
            </p>
          </div>

          <div className="mt-3 rounded-2xl bg-white/85 px-3 py-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[#6B21A8]">
              Insight do dia
            </p>
            <p className="mt-1 line-clamp-1 text-[0.8rem] text-[#1F2937]">
              {pontosInsightLinha1}
            </p>
            <p className="line-clamp-1 text-[0.75rem] text-[#4B5563]">
              {pontosInsightLinha2}
            </p>
          </div>

          <div className="mt-3 rounded-2xl bg-[#F2F6FF] px-3 py-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-[#1D3557]">
              Minhas emoções — visão rápida
            </p>
            <p className="mt-1 text-[0.8rem] text-[#1C2541]">
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
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleVerInsights}
              className="mq-link-inline-v1_2 text-[0.8rem]"
            >
              Explorar insights
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={handleVerHistorico}
              className="mq-link-inline-v1_2 text-[0.8rem]"
            >
              Histórico de conversas
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/40 bg-[#F5EBF3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-6 py-2 text-[0.78rem] font-medium">
          <button
            type="button"
            onClick={handleNavHome}
            className="text-[#D90368]"
          >
            Home
          </button>
          <button
            type="button"
            onClick={handleNavConversas}
            className="text-[#1C2541]"
          >
            Conversas
          </button>
          <button
            type="button"
            onClick={handleNavQuests}
            className="text-[#1C2541]"
          >
            Quests
          </button>
          <button
            type="button"
            onClick={handleNavConquistas}
            className="text-[#1C2541]"
          >
            Conquistas
          </button>
        </div>
      </nav>
    </div>
  );
};

export default HomeV1_2_2;
