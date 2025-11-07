import React, { useEffect, useMemo, useRef } from 'react';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { useDashboard } from '../../store/useStore';
import type { QuestStatus, QuestPersonalizadaResumo } from '../../types/emotions';

const LIGHT_PURPLE_BORDER = '#D4C5FF';

const QUEST_STATUS_STYLES: Record<QuestStatus | 'default', {
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  bg: string;
  label: string;
}> = {
  pendente: { icon: Circle, color: '#3083DC', bg: '#E0F2FE', label: 'Pendente' },
  ativa: { icon: Circle, color: '#2563EB', bg: '#DBEAFE', label: 'Em andamento' },
  concluida: { icon: CheckCircle2, color: '#16A34A', bg: '#DCFCE7', label: 'Concluída' },
  reiniciada: { icon: RotateCw, color: '#7C3AED', bg: '#EDE9FE', label: 'Reiniciada' },
  cancelada: { icon: AlertTriangle, color: '#CA8A04', bg: '#FEF3C7', label: 'Cancelada' },
  vencida: { icon: AlertTriangle, color: '#DC2626', bg: '#FEE2E2', label: 'Vencida' },
  default: { icon: Circle, color: '#6B7280', bg: '#E5E7EB', label: 'Em análise' },
};

const QuestPanel: React.FC = () => {
  const {
    dashboardData,
    setView,
    questSnapshot,
    questLoading,
    questError,
    loadQuestSnapshot,
    isAuthenticated,
  } = useDashboard();

  const usuarioId = dashboardData?.usuario?.id;
  const hasRequestedSnapshot = useRef(false);
  const snapshot = questSnapshot ?? dashboardData?.questSnapshot ?? null;
  const computedSnapshot = useMemo(() => {
    if (snapshot) {
      return snapshot;
    }

    return null;
  }, [snapshot]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!usuarioId) return;
    if (snapshot) {
      hasRequestedSnapshot.current = true;
      return;
    }
    if (questLoading) return;
    if (hasRequestedSnapshot.current) return;

    hasRequestedSnapshot.current = true;
    void loadQuestSnapshot(usuarioId);
  }, [isAuthenticated, usuarioId, questLoading, snapshot, loadQuestSnapshot]);

  useEffect(() => {
    hasRequestedSnapshot.current = false;
  }, [usuarioId]);

  if (questLoading && !computedSnapshot) {
    return (
      <div
        className="rounded-[28px] bg-[#E8F3F5] p-5 sm:p-6 shadow-sm space-y-5 border"
        style={{ borderColor: LIGHT_PURPLE_BORDER }}
      >
        <div className="h-6 w-40 animate-pulse rounded-full bg-white/50" />
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-2xl bg-white/50" />
          <div className="h-32 animate-pulse rounded-2xl bg-white/50" />
        </div>
      </div>
    );
  }

  if (questError && !computedSnapshot) {
    return (
      <div
        className="rounded-[28px] border bg-[#FEE2E2] p-5 text-sm text-[#B91C1C]"
        style={{ borderColor: '#FECACA' }}
      >
        Não foi possível carregar as quests. Tente novamente mais tarde.
      </div>
    );
  }

  if (!computedSnapshot) {
    return null;
  }

  const {
    quests_personalizadas: questsPersonalizadas = [],
    xp_total = 0,
    xp_proximo_nivel,
  } = computedSnapshot;

  return (
    <div
      className="rounded-[28px] bg-[#E8F3F5] p-5 sm:p-6 lg:p-7 shadow-sm space-y-5 border"
      style={{ borderColor: LIGHT_PURPLE_BORDER }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9C9FF]">
            <Trophy size={24} className="text-[#7C3AED]" />
          </span>
          <div className="space-y-0.5">
            <h3 className="text-xl font-semibold text-[#1C2541]">Quests</h3>
            {xp_proximo_nivel != null && xp_total != null && xp_proximo_nivel > xp_total ? (
              <p className="text-sm text-[#475467]">
                Faltam {Math.max(xp_proximo_nivel - xp_total, 0)} XP para o próximo nível
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="rounded-2xl border px-4 py-4 sm:px-5 sm:py-5"
          style={{ borderColor: '#D8C5FF', backgroundColor: '#E8F3F5' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8B5CF6]">
              <Sparkles size={16} className="text-[#8B5CF6]" />
              Quest do dia
            </div>
            <p className="text-xs font-semibold text-[#8B5CF6]">
              {questsPersonalizadas.length > 0
                ? `${questsPersonalizadas.filter((quest) => quest.status === 'concluida').length}/${questsPersonalizadas.length}`
                : '—'}
            </p>
          </div>

          {questsPersonalizadas.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {questsPersonalizadas.slice(0, 4).map((quest: QuestPersonalizadaResumo, index: number) => {
                const statusKey = (quest.status ?? 'pendente') as QuestStatus;
                const style = QUEST_STATUS_STYLES[statusKey] ?? QUEST_STATUS_STYLES.default;
                const StatusIcon = style.icon;
                const meta = Math.max(quest.progresso_meta ?? 1, 1);
                const progressoAtual = Math.min(quest.progresso_atual ?? 0, meta);
                const progressoLabel = meta > 1 ? `${progressoAtual}/${meta}` : null;
                const itemKey = `${quest.meta_codigo}-${quest.instancia_id ?? index}`;

                return (
                  <li
                    key={itemKey}
                    className="rounded-xl border border-[#D1D5DB] bg-white/60 px-3 py-3 shadow-sm"
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
                          <p className="text-[11px] uppercase tracking-wide text-[#64748B]">
                            {quest.contexto_origem}
                          </p>
                        )}
                      </div>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold"
                        style={{ color: style.color, backgroundColor: style.bg }}
                      >
                        <StatusIcon size={12} />
                        {style.label}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-[#475467]">
                      <span>{progressoLabel ?? '—'}</span>
                      {quest.prioridade && (
                        <span className="text-[11px] uppercase tracking-wide text-[#8B5CF6]">
                          {quest.prioridade}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-[#C4B5FD] bg-white/40 px-4 py-6 text-center text-sm text-[#6B21A8]">
              Nenhuma quest personalizada ativa no momento.
            </div>
          )}
        </div>
      </div>

      {questError && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEE2E2] px-3 py-2 text-xs text-[#991B1B]">
          {questError}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setView('conquistas')}
          className="text-sm font-semibold text-[#7C3AED] transition-colors hover:text-[#5B21B6]"
        >
          Ver todas as conquistas
        </button>
      </div>
    </div>
  );
};

export default QuestPanel;
