/**
 * ARQUIVO: src/components/dashboard/GamificacaoPanel.tsx
 * AÇÃO: CRIAR novo componente
 *
 * Gamificação simplificada (painel v1.1.6)
 * Destaques: quest diária, nível atual, XP e streak
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../store/useStore';

const GamificacaoPanel: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { gamificacao } = dashboardData;

  const questDescricao = gamificacao.quest_diaria_descricao ?? 'Nenhuma missão ativa';
  const questProgresso = Math.min(Math.max(gamificacao.quest_diaria_progresso ?? 0, 0), 100);

  const nivelAtual = gamificacao.nivel_atual ?? 0;
  const tituloNivel = gamificacao.titulo_nivel ?? '—';

  const xpTotal = gamificacao.xp_total ?? 0;
  const proximoNivelMin = gamificacao.xp_proximo_nivel ?? xpTotal;
  const xpRestante = Math.max(proximoNivelMin - xpTotal, 0);

  const streakDias = gamificacao.streak_conversas_dias ?? 0;

  return (
    <div className="rounded-3xl border border-[#E4E1FF] bg-white/95 p-4 shadow-sm sm:p-5 space-y-4">
      {/* Quest do dia */}
      <div className="rounded-2xl border border-[#ECE7FF] bg-[#F9F7FF] p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E86114]">
          <Target size={15} className="text-[#E86114]" />
          Quest do dia
        </div>

        <p className="mt-2 text-base font-semibold text-[#1C2541] leading-snug">
          {questDescricao}
        </p>

        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-[#E4E7EC]">
            <motion.div
              className="h-1.5 rounded-full bg-[#E86114]"
              initial={{ width: 0 }}
              animate={{ width: `${questProgresso}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1 text-xs font-medium text-[#475467]">
            {questProgresso}% completo
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#ECE7FF] bg-[#F9F7FF] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8B5CF6]">
            Nível atual
          </p>
          <div className="mt-2 text-2xl font-bold text-[#7C3AED]">
            {nivelAtual}
          </div>
          <p className="text-sm text-[#475467]">{tituloNivel}</p>
        </div>

        <div className="rounded-2xl border border-[#ECE7FF] bg-[#F9F7FF] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8B5CF6]">
            XP total
          </p>
          <div className="mt-2 text-2xl font-bold text-[#2563EB]">
            {xpTotal.toLocaleString('pt-BR')}
          </div>
          <p className="text-sm text-[#475467]">
            Falta {xpRestante.toLocaleString('pt-BR')} XP
          </p>
        </div>
      </div>

      {/* Streak e ação */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#ECE7FF] bg-[#F9F7FF] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDEBCC] text-[#E86114]">
            <Flame size={15} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase text-[#E86114]">Streak ativo</p>
            <p className="text-base font-bold text-[#1C2541]">
              {streakDias} dia(s)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setView('proximosNiveis')}
          className="inline-flex items-center justify-center gap-1 rounded-full border border-[#8B5CF6] px-4 py-2 text-sm font-semibold text-[#8B5CF6] transition-colors hover:bg-[#F4EBFF]"
        >
          Ver próximos níveis
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default GamificacaoPanel;
