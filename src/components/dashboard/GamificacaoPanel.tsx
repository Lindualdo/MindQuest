/**
 * ARQUIVO: src/components/dashboard/GamificacaoPanel.tsx
 * AÇÃO: REESTILIZAR componente
 *
 * Card de gamificação inspirado no mockup (painel v1.1.6)
 * Layout com cards internos, resumo e CTA para conquistas
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Sparkles, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../store/useStore';

const LIGHT_PURPLE_BORDER = '#D4C5FF';
const STREAK_DEFAULT_GOALS = [3, 7, 30, 60, 90, 120, 180, 365];

const clampToPercent = (value: number) => Math.min(Math.max(value, 0), 100);
const parseStreakGoalFromId = (id?: string | null) => {
  if (!id) {
    return null;
  }
  const match = id.match(/streak_(\d+)_dias/i);
  if (!match) {
    return null;
  }
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const GamificacaoPanel: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const gamificacao = dashboardData.gamificacao;

  if (!gamificacao) {
    return null;
  }

  const questDescricao = gamificacao.quest_diaria_descricao ?? 'Nenhuma missão ativa';
  const questProgresso = clampToPercent(gamificacao.quest_diaria_progresso ?? 0);
  const questDiasAtivos = gamificacao.quest_streak_dias ?? 0;

  const nivelAtual = gamificacao.nivel_atual ?? 0;
  const tituloNivel = gamificacao.titulo_nivel ?? '—';

  const xpTotal = gamificacao.xp_total ?? 0;
  const proximoNivelMin = gamificacao.xp_proximo_nivel ?? xpTotal;
  const xpRestante = Math.max(proximoNivelMin - xpTotal, 0);

  const streakDias = gamificacao.streak_conversas_dias ?? 0;
  const melhorStreak = Math.max(gamificacao.melhor_streak ?? 0, streakDias);
  const unlockedStreakGoals = (gamificacao.conquistas_desbloqueadas ?? [])
    .map((conquista) => parseStreakGoalFromId(conquista.id))
    .filter((goal): goal is number => goal !== null);

  const upcomingStreakGoals = (gamificacao.conquistas_proximas ?? [])
    .map((conquista) => {
      const isStreak =
        conquista.categoria === 'consistencia' || /streak_/i.test(conquista.id);
      if (!isStreak) {
        return null;
      }
      if (Number.isFinite(conquista.progresso_meta)) {
        return conquista.progresso_meta;
      }
      return parseStreakGoalFromId(conquista.id);
    })
    .filter((goal): goal is number => goal !== null);

  const questStreakTarget =
    gamificacao.quest_streak_dias && gamificacao.quest_streak_dias > 0
      ? gamificacao.quest_streak_dias
      : null;

  const streakProgressBaseline = Math.max(
    streakDias,
    melhorStreak,
    unlockedStreakGoals.length > 0 ? Math.max(...unlockedStreakGoals) : 0
  );

  const nextStreakGoal =
    upcomingStreakGoals
      .filter((goal) => goal > streakProgressBaseline)
      .sort((a, b) => a - b)[0] ??
    (questStreakTarget && questStreakTarget > streakProgressBaseline
      ? questStreakTarget
      : null) ??
    STREAK_DEFAULT_GOALS.find((goal) => goal > streakProgressBaseline) ??
    (streakProgressBaseline > 0 ? streakProgressBaseline + 1 : 1);

  const streakProgress =
    nextStreakGoal > 0
      ? clampToPercent((streakDias / nextStreakGoal) * 100)
      : 0;
  const reflexoesMeta = 10;
  const totalReflexoes = gamificacao.total_reflexoes ?? 0;
  const reflexoesCiclo =
    totalReflexoes === 0
      ? 0
      : totalReflexoes % reflexoesMeta === 0
        ? reflexoesMeta
        : totalReflexoes % reflexoesMeta;
  const reflexoesProgresso =
    reflexoesMeta > 0 ? clampToPercent((reflexoesCiclo / reflexoesMeta) * 100) : 0;
  const questDiasAtivosLabel =
    questDiasAtivos > 0 ? `${questDiasAtivos} dia${questDiasAtivos === 1 ? '' : 's'}` : 'Hoje';

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
            <h3 className="text-xl font-semibold text-[#1C2541]">Conquistas</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border px-4 py-4 sm:px-5 sm:py-5" style={{ borderColor: '#F2D2B3', backgroundColor: '#E8F3F5' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#475467]">
              <Flame size={18} className="text-[#E86114]" />
              Dias seguidos
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#98A2B3]">Max</p>
              <p className="text-sm font-semibold text-[#E86114]">
                {melhorStreak > 0 ? `${melhorStreak} dias` : 'Novo recorde'}
              </p>
            </div>
          </div>

          <p className="mt-4 text-4xl font-bold text-[#1C2541] leading-none">{streakDias}</p>

          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-[#D9E0E8]">
              <motion.div
                className="h-1.5 rounded-full bg-[#E86114]"
                initial={{ width: 0 }}
                animate={{ width: `${streakProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#475467]">
              <span>
                {streakDias} dia{streakDias === 1 ? '' : 's'}
              </span>
              <span>
                Meta {nextStreakGoal} dia{nextStreakGoal === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border px-4 py-4 sm:px-5 sm:py-5" style={{ borderColor: '#C3D8FF', backgroundColor: '#E8F3F5' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#3083DC]">
              <Target size={16} className="text-[#3083DC]" />
              Desenvolvimento
            </div>
            <p className="text-xs font-semibold text-[#3083DC]">
              {reflexoesCiclo}/{reflexoesMeta}
            </p>
          </div>

          <p className="mt-3 text-xl font-semibold text-[#1C2541]">
            {reflexoesCiclo} Reflexões
          </p>

          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-[#D9E0E8]">
              <motion.div
                className="h-1.5 rounded-full bg-[#3083DC]"
                initial={{ width: 0 }}
                animate={{ width: `${reflexoesProgresso}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border px-4 py-4 sm:px-5 sm:py-5" style={{ borderColor: '#D8C5FF', backgroundColor: '#E8F3F5' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8B5CF6]">
              <Sparkles size={16} className="text-[#8B5CF6]" />
              Quest do dia
            </div>
            <p className="text-xs font-semibold text-[#8B5CF6]">{questDiasAtivosLabel}</p>
          </div>

          <p className="mt-3 text-base font-semibold text-[#1C2541] leading-snug">
            {questDescricao}
          </p>

          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-[#D9E0E8]">
              <motion.div
                className="h-1.5 rounded-full bg-[#8B5CF6]"
                initial={{ width: 0 }}
                animate={{ width: `${questProgresso}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[#3083DC] px-5 py-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/80">
              Nível {nivelAtual} · {tituloNivel}
            </p>
            <p className="text-3xl font-bold leading-tight">
              {xpTotal.toLocaleString('pt-BR')} XP
            </p>
            <p className="text-xs font-medium text-white/80">
              Falta {xpRestante.toLocaleString('pt-BR')} XP para o próximo nível
            </p>
          </div>

          <button
            type="button"
            onClick={() => setView('conquistas')}
            className="inline-flex items-center justify-center rounded-xl bg-[#7EBDC2] px-5 py-3 text-sm font-semibold text-[#0A2F35] transition-colors hover:bg-[#74B4B9]"
          >
            Conquistas
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamificacaoPanel;
