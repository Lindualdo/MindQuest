import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RefreshCw, Sparkles, CheckCircle2, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import HeaderV1_2 from '@/components/app/v1.2/HeaderV1_2';
import BottomNavV1_3, { type TabId } from '@/components/app/v1.3/BottomNavV1_3';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import type { QuestPersonalizadaResumo } from '@/types/emotions';

type QuestDestaque = {
  id: string;
  titulo: string;
  descricao: string | null;
  prioridade?: string | null;
  recorrencia?: string | null;
  progressoAtual: number;
  progressoMeta: number;
  percentual: number;
  ultimaAtualizacao?: string | null;
  recompensaBase?: number | null;
  recompensaBonus?: number | null;
};

const PainelQuestsPageV13: React.FC = () => {
  const {
    dashboardData,
    questSnapshot,
    questLoading,
    questError,
    questsCard,
    questsCardLoading,
    questsCardError,
    loadQuestSnapshot,
    loadQuestsCard,
    markQuestAsCompletedLocal,
    setView,
  } = useDashboard();

  const usuarioId = dashboardData?.usuario?.id;
  const nomeUsuario =
    dashboardData?.usuario?.nome_preferencia ??
    dashboardData?.usuario?.nome ??
    'Aldo';

  const [activeTab, setActiveTab] = useState<TabId>('quests');

  useEffect(() => {
    if (!usuarioId) return;
    if (!questSnapshot && !questLoading) {
      void loadQuestSnapshot(usuarioId);
    }
    if (!questsCard && !questsCardLoading) {
      void loadQuestsCard(usuarioId);
    }
  }, [usuarioId, questSnapshot, questLoading, questsCard, questsCardLoading, loadQuestSnapshot, loadQuestsCard]);

  const questsPersonalizadas = questSnapshot?.quests_personalizadas ?? [];

  const pendentes = useMemo(
    () =>
      questsPersonalizadas.filter(
        (quest) => quest.status !== 'concluida' && !quest.concluido_em,
      ),
    [questsPersonalizadas],
  );

  const concluidas = useMemo(
    () =>
      questsPersonalizadas
        .filter((quest) => quest.status === 'concluida' || quest.concluido_em)
        .sort((a, b) => {
          const dataA = a.concluido_em ? new Date(a.concluido_em).getTime() : 0;
          const dataB = b.concluido_em ? new Date(b.concluido_em).getTime() : 0;
          return dataB - dataA;
        }),
    [questsPersonalizadas],
  );

  const destaque: QuestDestaque | null = useMemo(() => {
    if (questsCard?.quest) {
      return {
        id: questsCard.quest.id ?? 'quest-card',
        titulo: questsCard.quest.titulo,
        descricao: questsCard.quest.descricao ?? null,
        prioridade: questsCard.quest.prioridade,
        recorrencia: questsCard.quest.recorrencia,
        progressoAtual: questsCard.quest.progresso.atual ?? 0,
        progressoMeta: questsCard.quest.progresso.meta ?? 1,
        percentual: questsCard.quest.progresso.percentual ?? 0,
        ultimaAtualizacao: questsCard.quest.ultima_atualizacao_label,
        recompensaBase: questsCard.quest.xp_recompensa ?? questsCard.recompensas?.xp_base ?? null,
        recompensaBonus: questsCard.recompensas?.xp_bonus_recorrencia ?? null,
      };
    }

    const quest = pendentes[0];
    if (!quest) {
      return null;
    }

    const meta = Math.max(quest.progresso_meta ?? 1, 1);
    const atual = Math.min(quest.progresso_atual ?? 0, meta);
    return {
      id: quest.instancia_id ?? quest.meta_codigo,
      titulo: quest.titulo,
      descricao: quest.descricao,
      prioridade: quest.prioridade,
      recorrencia: quest.recorrencia,
      progressoAtual: atual,
      progressoMeta: meta,
      percentual: Math.round((atual / meta) * 100),
      ultimaAtualizacao: quest.concluido_em,
      recompensaBase: questsCard?.recompensas?.xp_base ?? null,
      recompensaBonus: questsCard?.recompensas?.xp_bonus_recorrencia ?? null,
    };
  }, [pendentes, questsCard]);

  const beneficios = questsCard?.beneficios ?? [];
  const snapshotResumo = questsCard?.snapshot;

  const handleBack = () => {
    setView('dashboard');
  };

  const handleRefresh = () => {
    if (!usuarioId) return;
    void loadQuestSnapshot(usuarioId);
    void loadQuestsCard(usuarioId);
  };

  const handleMarcarConclusao = () => {
    if (!destaque?.id) return;
    markQuestAsCompletedLocal(destaque.id);
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
    // já estamos no painel, então nenhuma ação extra é necessária
  };

  const handleNavConfig = () => {
    setActiveTab('ajustes');
  };

  const renderQuestItem = (quest: QuestPersonalizadaResumo) => {
    const meta = Math.max(quest.progresso_meta ?? 1, 1);
    const atual = Math.min(quest.progresso_atual ?? 0, meta);
    const percentual = Math.round((atual / meta) * 100);

    return (
      <li
        key={quest.instancia_id ?? quest.meta_codigo}
        className="rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#1C2541]">{quest.titulo}</p>
            {quest.descricao && (
              <p className="text-xs text-[#475467] leading-snug line-clamp-2">
                {quest.descricao}
              </p>
            )}
            {quest.contexto_origem && (
              <p className="text-[11px] uppercase tracking-wide text-[#94A3B8]">
                {quest.contexto_origem}
              </p>
            )}
          </div>
          <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
            {quest.status}
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#475569]">
            <span>
              {atual}/{meta}
            </span>
            <span>{percentual}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]"
              style={{ width: `${Math.min(100, Math.max(0, percentual))}%` }}
            />
          </div>
        </div>
      </li>
    );
  };

  const renderHistoricoItem = (quest: QuestPersonalizadaResumo) => (
    <li
      key={`hist-${quest.instancia_id ?? quest.meta_codigo}`}
      className="rounded-2xl border border-white/40 bg-white px-4 py-3 text-sm text-[#1F2937]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{quest.titulo}</p>
          {quest.descricao && (
            <p className="text-xs text-[#6B7280]">{quest.descricao}</p>
          )}
        </div>
        <span className="text-xs font-semibold text-[#16A34A]">
          {quest.concluido_em ? format(new Date(quest.concluido_em), 'dd/MM') : '--'}
        </span>
      </div>
    </li>
  );

  const loadingState = questLoading || questsCardLoading;

  return (
    <div className="mq-app-v1_2 flex min-h-screen flex-col bg-[#F5EBF3]">
      <HeaderV1_2 nomeUsuario={nomeUsuario} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541] shadow"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1 rounded-full border border-[#CBD5F5] bg-white px-3 py-1 text-[0.75rem] font-semibold text-[#1C2541]"
          >
            <RefreshCw size={14} className={loadingState ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        <Card className="!p-0 overflow-hidden" hover={false}>
          <div className="flex items-start gap-3 border-b border-white/40 bg-white/80 p-5">
            <div className="rounded-2xl bg-[#EDE9FE] p-3">
              <Sparkles className="text-[#7C3AED]" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                Missão personalizada
              </p>
              <h2 className="text-lg font-semibold text-[#1C2541]">Próxima conclusão</h2>
            </div>
          </div>

          <div className="space-y-4 p-5 text-sm">
            {loadingState && (
              <p className="text-center text-[#475569]">Carregando quests…</p>
            )}

            {!loadingState && !destaque && (
              <div className="rounded-2xl border border-dashed border-[#E0E7FF] bg-[#EEF2FF] px-4 py-6 text-center text-sm text-[#4338CA]">
                Nenhuma quest ativa no momento. Volte amanhã para novas missões.
              </div>
            )}

            {destaque && (
              <>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-[#111827]">{destaque.titulo}</h3>
                  {destaque.descricao && (
                    <p className="text-sm text-[#475467]">{destaque.descricao}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-[#64748B]">
                    {destaque.recorrencia && (
                      <span className="rounded-full bg-[#ECFCCB] px-2 py-0.5 text-[#4D7C0F]">
                        {destaque.recorrencia}
                      </span>
                    )}
                    {destaque.prioridade && (
                      <span className="rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[#B91C1C] uppercase">
                        Prioridade {destaque.prioridade}
                      </span>
                    )}
                    {destaque.ultimaAtualizacao && (
                      <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[#1D4ED8]">
                        Atualizado {destaque.ultimaAtualizacao}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
                    <span>
                      {destaque.progressoAtual}/{destaque.progressoMeta}
                    </span>
                    <span>{Math.min(100, Math.max(0, destaque.percentual))}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]"
                      style={{ width: `${Math.min(100, Math.max(0, destaque.percentual))}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#DCFCE7] bg-[#ECFDF3] px-4 py-3 text-xs text-[#065F46]">
                  <p className="text-sm font-semibold text-[#065F46]">Recompensas</p>
                  <p className="text-base font-semibold text-[#047857]">
                    +{destaque.recompensaBase ?? questsCard?.recompensas?.xp_base ?? 0} pontos
                  </p>
                  {destaque.recompensaBonus ? (
                    <p>+{destaque.recompensaBonus} pontos extras por recorrência</p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleMarcarConclusao}
                  disabled={!destaque}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0EA5E9] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow"
                >
                  <CheckCircle2 size={16} />
                  Marcar como concluída
                </button>
              </>
            )}
          </div>
        </Card>

        {snapshotResumo && (
          <Card hover={false} className="space-y-3 bg-white/80">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
              <ClipboardList size={14} />
              Visão geral
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-sm text-[#1F2937]">
              <div className="rounded-2xl border border-[#BFDBFE] bg-[#DBEAFE] px-3 py-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                  Quests ativas
                </p>
                <p className="text-xl font-bold text-[#1E3A8A]">{snapshotResumo.total_personalizadas}</p>
              </div>
              <div className="rounded-2xl border border-[#C7D2FE] bg-[#E0E7FF] px-3 py-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#4338CA]">
                  Concluídas
                </p>
                <p className="text-xl font-bold text-[#3730A3]">{snapshotResumo.total_concluidas}</p>
              </div>
              <div className="rounded-2xl border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#15803D]">
                  Pontos base
                </p>
                <p className="text-xl font-bold text-[#166534]">{snapshotResumo.xp_base_total}</p>
              </div>
              <div className="rounded-2xl border border-[#FDE68A] bg-[#FEF9C3] px-3 py-2">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#A16207]">
                  Bônus
                </p>
                <p className="text-xl font-bold text-[#92400E]">{snapshotResumo.xp_bonus_total}</p>
              </div>
            </div>
          </Card>
        )}

        {beneficios.length > 0 && (
          <Card hover={false} className="space-y-3 bg-white/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
              Benefícios das quests
            </p>
            <div className="flex flex-wrap gap-2">
              {beneficios.map((beneficio) => (
                <span
                  key={beneficio}
                  className="rounded-full bg-[#EDE9FE] px-3 py-1 text-[0.7rem] font-semibold text-[#5B21B6]"
                >
                  {beneficio}
                </span>
              ))}
            </div>
          </Card>
        )}

        <Card hover={false} className="space-y-4 bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Quests em andamento
              </p>
              <h3 className="text-base font-semibold text-[#111827]">Planejamento ativo</h3>
            </div>
            <span className="text-xs font-semibold text-[#1E3A8A]">{pendentes.length}</span>
          </div>

          {pendentes.length > 0 ? (
            <ul className="space-y-3">
              {pendentes.map((quest) => renderQuestItem(quest))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#BFDBFE] bg-[#E0F2FE] px-4 py-5 text-center text-sm text-[#1D4ED8]">
              Nenhuma quest pendente. Aproveite para focar nas concluídas!
            </div>
          )}
        </Card>

        <Card hover={false} className="space-y-4 bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#059669]">
                Histórico recente
              </p>
              <h3 className="text-base font-semibold text-[#065F46]">Conquistas da semana</h3>
            </div>
            <span className="text-xs font-semibold text-[#047857]">{concluidas.length}</span>
          </div>

          {concluidas.length > 0 ? (
            <ul className="space-y-3">
              {concluidas.slice(0, 6).map((quest) => renderHistoricoItem(quest))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#A7F3D0] bg-[#ECFDF5] px-4 py-5 text-center text-sm text-[#047857]">
              Ainda não há quests concluídas recentemente.
            </div>
          )}
        </Card>

        {questError && (
          <p className="text-center text-[0.72rem] font-semibold text-rose-600">{questError}</p>
        )}
        {questsCardError && (
          <p className="text-center text-[0.72rem] font-semibold text-rose-600">{questsCardError}</p>
        )}
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

export default PainelQuestsPageV13;

