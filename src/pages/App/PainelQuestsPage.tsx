import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import QuestPanel from '@/components/dashboard/QuestPanel';
import { useDashboard } from '@/store/useStore';
import type { QuestPersonalizadaResumo } from '@/types/emotions';

const PainelQuestsPage: React.FC = () => {
  const {
    dashboardData,
    setView,
    questSnapshot,
    questLoading,
    questError,
    loadQuestSnapshot,
    questsCard,
    markQuestAsCompletedLocal,
    concluirQuest,
  } = useDashboard();

  const usuarioId = dashboardData?.usuario?.id;
  const snapshot = questSnapshot ?? dashboardData?.questSnapshot ?? null;
  const quests = snapshot?.quests_personalizadas ?? [];

  const questAtiva = questsCard?.quest;

  const concluidas = useMemo(
    () =>
      quests.filter((quest) => quest.status === 'concluida' || quest.concluido_em !== null),
    [quests]
  );

  const handleBack = () => setView('dashboard');
  const handleRefresh = () => {
    if (usuarioId) {
      void loadQuestSnapshot(usuarioId);
    }
  };

  const handleMarcarConclusao = () => {
    if (questAtiva?.id) {
      void concluirQuest(questAtiva.id);
    }
  };

  return (
    <div className="mindquest-dashboard min-h-screen pb-10">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="rounded-xl bg-white p-2 shadow transition-all hover:shadow-md"
              aria-label="Voltar para o dashboard"
              type="button"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Painel de Quests</p>
              <h1 className="text-lg font-semibold text-slate-800">Missões personalizadas</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw size={14} className={questLoading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-6">
        <section className="rounded-3xl border border-[#D3F0E0] bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
                Próxima conclusão
              </p>
              <h2 className="text-xl font-semibold text-[#0F172A]">
                {questAtiva?.titulo ?? 'Ative uma nova quest personalizada'}
              </h2>
              <p className="text-sm text-[#475467]">
                {questAtiva?.descricao ?? 'Nenhuma quest ativa no momento. Abra o painel para criar uma nova.'}
              </p>
              {questAtiva?.recorrencia && (
                <p className="text-xs font-semibold text-[#0F766E]">
                  Recorrência: {questAtiva.recorrencia}
                </p>
              )}
              {questAtiva?.prioridade && (
                <p className="text-xs uppercase text-[#7C3AED]">Prioridade {questAtiva.prioridade}</p>
              )}
            </div>
            <div className="rounded-2xl border border-[#C4EBDD] bg-[#ECFDF3] px-4 py-3 text-sm text-[#0F766E]">
              <p className="font-semibold">Recompensas</p>
              <p>+{questAtiva?.xp_recompensa ?? questsCard?.recompensas?.xp_base ?? 150} XP</p>
              {questsCard?.recompensas?.xp_bonus_recorrencia ? (
                <p>+{questsCard.recompensas.xp_bonus_recorrencia} XP recorrência</p>
              ) : null}
              {questAtiva?.ultima_atualizacao_label && (
                <p className="mt-1 text-xs text-[#059669]">
                  Atualizado {questAtiva.ultima_atualizacao_label}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] px-5 py-4">
            <button
              type="button"
              onClick={handleMarcarConclusao}
              className="inline-flex items-center gap-2 rounded-full bg-[#0EA5E9] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#0284C7]"
              disabled={!questAtiva}
            >
              <CheckCircle2 size={16} />
              Marcar como concluída
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[#EDE9FE] bg-white shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7C3AED] font-semibold">
                Histórico recente
              </p>
              <h3 className="text-lg font-semibold text-[#1E1B4B]">Quests concluídas</h3>
            </div>
            <span className="text-sm text-[#7C3AED]">
              Total {concluidas.length}
            </span>
          </div>

          {concluidas.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {concluidas.slice(0, 6).map((quest: QuestPersonalizadaResumo, index: number) => (
                <li
                  key={`${quest.instancia_id}-${index}`}
                  className="rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-4 py-3 text-sm text-[#4C1D95]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{quest.titulo}</p>
                    {quest.concluido_em && (
                      <span className="text-xs text-[#6D28D9]">
                        {format(new Date(quest.concluido_em), 'dd/MM/yyyy')}
                      </span>
                    )}
                  </div>
                  {quest.descricao && (
                    <p className="mt-1 text-xs text-[#6B21A8] leading-snug">
                      {quest.descricao}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-[#DDD6FE] bg-[#FBF7FF] px-4 py-6 text-center text-sm text-[#6B21A8]">
              Ainda não há histórico de quests concluídas.
            </div>
          )}
        </section>

        <QuestPanel />

        {questError && (
          <p className="text-center text-xs font-medium text-rose-600">{questError}</p>
        )}
      </main>
    </div>
  );
};

export default PainelQuestsPage;
