/**
 * ARQUIVO: src/components/dashboard/Dashboard.tsx
 * AÇÃO: SUBSTITUIR o arquivo existente
 * 
 * Dashboard principal baseado na Especificação v1.1.6
 * Layout com todos os componentes atualizados
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Trophy,
  Heart,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import GamificacaoPanel from './GamificacaoPanel';
import { useDashboard } from '../../store/useStore';

type SectionVisual = {
  border: string;
  iconColor: string;
};

const SECTION_STYLES: Record<string, SectionVisual> = {
  conversations: {
    border: '#AFC9FF',
    iconColor: '#3083DC',
  },
  gamification: {
    border: '#CDB5FF',
    iconColor: '#8B5CF6',
  },
  emotions: {
    border: '#F8B7DA',
    iconColor: '#EC4899',
  },
  sabotadores: {
    border: '#F9D97E',
    iconColor: '#F59E0B',
  },
  insights: {
    border: '#9FDBB5',
    iconColor: '#10B981',
  },
};

const Dashboard: React.FC = () => {
  const {
    isLoading,
    dashboardData,
    setView,
    openResumoConversas,
  } = useDashboard();

  const { checkins_historico, gamificacao, mood_gauge, metricas_periodo, sabotadores, insights } =
    dashboardData;

  const parseDate = (value?: string | null) => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null;
    return new Date(year, month - 1, day);
  };

  const formatDisplayDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

  const referenceDate = (() => {
    if (checkins_historico.length === 0) return new Date();
    let ref = parseDate(checkins_historico[0].data_checkin) ?? new Date();
    checkins_historico.forEach((item) => {
      const parsed = parseDate(item.data_checkin);
      if (parsed && parsed > ref) ref = parsed;
    });
    return ref;
  })();

  const checkinMap = new Map<string, (typeof checkins_historico)[number]>();
  checkins_historico.forEach((item) => {
    if (item?.data_checkin) checkinMap.set(item.data_checkin, item);
  });

  const lastSevenDays = Array.from({ length: 7 }, (_, idx) => {
    const day = new Date(referenceDate);
    day.setDate(referenceDate.getDate() - (6 - idx));
    const key = day.toISOString().slice(0, 10);
    const checkin = checkinMap.get(key);
    return {
      label: day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      date: formatDisplayDate(day),
      status: checkin?.status_resposta ?? 'none',
    };
  });

  const daysWithConversations = lastSevenDays.filter((day) => day.status === 'respondido').length;
  const totalConversas = metricas_periodo?.total_checkins ?? checkins_historico.length;
  const melhorStreak = gamificacao.streak_conversas_dias ?? 0;

  const activeSabotador = sabotadores?.padrao_principal;
  const primaryInsight = insights[0];
  const alertInsightsCount = insights.filter((insight) => insight.tipo === 'alerta').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="h-16 bg-white/50 rounded-2xl animate-pulse" />
        
        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-white/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-6">
        {/* Histórico de conversas */}
        <section
          id="conversas"
          style={{
            border: `2px dashed ${SECTION_STYLES.conversations.border}`,
            backgroundColor: '#FFFFFF',
          }}
          className="rounded-[24px] p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${SECTION_STYLES.conversations.iconColor}1a` }}
              >
                <CalendarDays
                  className="h-5 w-5"
                  color={SECTION_STYLES.conversations.iconColor}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1C2541]">
                  Histórico de conversas
                </h3>
                <p className="text-xs text-[#1C2541]/60">
                  Últimos 7 dias de interação com o assistente
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openResumoConversas().catch(() => null)}
              className="inline-flex items-center gap-1 rounded-full border border-[#3083DC33] bg-white/80 px-4 py-2 text-xs font-semibold text-[#3083DC] shadow-sm transition hover:bg-[#3083DC0d]"
            >
              Ver resumo
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 place-items-center">
            {lastSevenDays.map((day, idx) => {
              const statusClasses = (() => {
                switch (day.status) {
                  case 'respondido':
                    return 'bg-[#E2F8ED] border-[#8AD9B5] text-[#166534]';
                  case 'perdido':
                    return 'bg-[#FCE2E5] border-[#F08DA0] text-[#9F1239]';
                  case 'pendente':
                    return 'bg-[#FDF1D8] border-[#F4C670] text-[#92400E]';
                  default:
                    return 'bg-white border-[#E2E8F0] text-[#94A3B8]';
                }
              })();

              const statusSymbol = (() => {
                switch (day.status) {
                  case 'respondido':
                    return '✓';
                  case 'perdido':
                    return '✗';
                  case 'pendente':
                    return '…';
                  default:
                    return '—';
                }
              })();

              return (
                <div
                  key={`${day.label}-${idx}`}
                  className={`w-full max-w-[120px] rounded-3xl border-2 px-3 py-4 text-center transition ${statusClasses}`}
                  style={{ borderStyle: 'dashed' }}
                >
                  <div className="text-xs font-semibold text-[#1C2541]/60 uppercase tracking-wide">
                    {day.label}
                  </div>
                  <div className="mt-1 text-base font-semibold">{statusSymbol}</div>
                  <div className="mt-1 text-[11px] text-[#1C2541]/50">{day.date}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 text-center sm:grid-cols-3">
            <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
              <div className="text-2xl font-semibold text-[#3083DC]">
                {daysWithConversations}
              </div>
              <div className="text-xs text-[#1C2541]/60">Dias com conversa</div>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
              <div className="text-2xl font-semibold text-[#3083DC]">
                {totalConversas}
              </div>
              <div className="text-xs text-[#1C2541]/60">Total de conversas</div>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
              <div className="text-2xl font-semibold text-[#3083DC]">
                {melhorStreak}
              </div>
              <div className="text-xs text-[#1C2541]/60">Dias seguidos</div>
            </div>
          </div>
        </section>

        {/* Gamificação */}
        <section
          id="gamificacao"
          style={{
            border: `2px dashed ${SECTION_STYLES.gamification.border}`,
            backgroundColor: '#FFFFFF',
          }}
          className="rounded-[24px] p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${SECTION_STYLES.gamification.iconColor}1a` }}
            >
              <Trophy color={SECTION_STYLES.gamification.iconColor} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1C2541]">Gamificação</h3>
              <p className="text-xs text-[#1C2541]/60">
                Missão do dia e progresso geral
              </p>
            </div>
          </div>
          <GamificacaoPanel />
        </section>

        {/* Emoções */}
        <section
          id="emocoes"
          style={{
            border: `2px dashed ${SECTION_STYLES.emotions.border}`,
            backgroundColor: '#FFFFFF',
          }}
          className="rounded-[24px] p-1"
        >
          <button
            type="button"
            onClick={() => setView('dashEmocoes')}
            className="flex w-full items-center justify-between gap-4 rounded-[22px] bg-white px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <Heart color={SECTION_STYLES.emotions.iconColor} />
              <div className="text-left">
                <h3 className="text-base font-semibold text-[#1C2541]">Emoções</h3>
                <p className="text-sm text-[#1C2541]/60">Humor · Roda das Emoções · PANAS</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#94A3B8]" />
          </button>
        </section>

        <section
          id="sabotadores"
          style={{
            border: `2px dashed ${SECTION_STYLES.sabotadores.border}`,
            backgroundColor: '#FFFFFF',
          }}
          className="rounded-[24px] p-1"
        >
          <button
            type="button"
            onClick={() => setView('dashSabotadores')}
            className="flex w-full items-center justify-between gap-4 rounded-[22px] bg-white px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <AlertTriangle color={SECTION_STYLES.sabotadores.iconColor} />
              <div className="text-left">
                <h3 className="text-base font-semibold text-[#1C2541]">Sabotadores</h3>
                <p className="text-sm text-[#1C2541]/60">Padrões mentais ativos</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#94A3B8]" />
          </button>
        </section>

        <section
          id="insights"
          style={{
            border: `2px dashed ${SECTION_STYLES.insights.border}`,
            backgroundColor: '#FFFFFF',
          }}
          className="rounded-[24px] p-1"
        >
          <button
            type="button"
            onClick={() => setView('dashInsights')}
            className="flex w-full items-center justify-between gap-4 rounded-[22px] bg-white px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <Lightbulb color={SECTION_STYLES.insights.iconColor} />
              <div className="text-left">
                <h3 className="text-base font-semibold text-[#1C2541]">Insights</h3>
                <p className="text-sm text-[#1C2541]/60">
                  {insights.length}/75 insights disponíveis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alertInsightsCount > 0 && (
                <span className="rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-semibold text-[#DC2626]">
                  {alertInsightsCount} alerta{alertInsightsCount > 1 ? 's' : ''}
                </span>
              )}
              <ChevronRight size={18} className="text-[#94A3B8]" />
            </div>
          </button>
        </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
