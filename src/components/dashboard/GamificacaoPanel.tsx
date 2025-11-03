import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Flame, Target } from 'lucide-react';

import Card from '@/components/ui/Card';
import { useDashboard } from '@/store/useStore';
import { gamificacaoLevels } from '@/data/gamificacaoLevels';

const GamificacaoPanel: React.FC = () => {
  const { dashboardData, setView } = useDashboard();
  const { gamificacao } = dashboardData;

  const currentLevel = gamificacaoLevels.find(
    (level) => level.nivel === gamificacao.nivel_atual
  );

  const nextLevel = gamificacao.proximo_nivel;
  const xpFaltante = nextLevel
    ? Math.max(
        nextLevel.xp_restante ??
          nextLevel.xp_minimo - (gamificacao.xp_total ?? 0),
        0
      )
    : 0;

  const progressoNivel = (() => {
    if (!currentLevel || !nextLevel) {
      const alvo = gamificacao.xp_proximo_nivel || 1;
      return Math.min((gamificacao.xp_total / alvo) * 100, 100);
    }
    const faixa =
      (nextLevel.xp_minimo ?? gamificacao.xp_proximo_nivel) -
      currentLevel.xp_minimo;
    if (!faixa || faixa <= 0) return 0;
    const ganho = gamificacao.xp_total - currentLevel.xp_minimo;
    return Math.min(Math.max((ganho / faixa) * 100, 0), 100);
  })();

  const formatDate = (value?: string | null) => {
    if (!value) return 'Data não disponível';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatXP = (value?: number | null) => {
    if (!value || Number.isNaN(value)) return '0';
    return value.toLocaleString('pt-BR');
  };

  return (
    <Card hover={false} className="bg-[#FFE4FA] shadow-lg">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-[#1C2541] p-2">
          <Trophy size={20} className="text-[#FFE4FA]" />
        </div>
        <h3 className="text-xl font-semibold text-[#1C2541]">Gamificação</h3>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#3083DC]/20 bg-gradient-to-br from-[#3083DC]/15 via-white to-[#7EBDC2]/20 p-5 text-[#1C2541] shadow-md">
            <p className="text-sm uppercase tracking-wide text-[#3083DC]">
              Nível atual
            </p>
            <h4 className="mt-2 text-2xl font-semibold">
              {currentLevel?.titulo || `Nível ${gamificacao.nivel_atual}`}
            </h4>
            <p className="mt-3 text-sm text-[#1C2541]/70">
              {currentLevel?.descricao ||
                'Avance completando reflexões, desafios e mantendo sua consistência.'}
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#3083DC] shadow-sm">
                  <Flame size={14} strokeWidth={2} />
                </span>
                <span>
                  Streak ativo:{' '}
                  <strong>{gamificacao.streak_conversas_dias}</strong> dia(s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#3083DC] shadow-sm">
                  <Target size={14} strokeWidth={2} />
                </span>
                <span>
                  XP total: <strong>{formatXP(gamificacao.xp_total)} XP</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#7EBDC2]/40 bg-[#E8F3F5] p-5 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1C2541] uppercase tracking-wide">
                  Barra de progresso
                </p>
                <p className="text-xs text-[#1C2541]/70">
                  Falta {formatXP(xpFaltante)} XP para o próximo nível
                </p>
              </div>
              <span className="rounded-full bg-[#3083DC]/10 px-3 py-1 text-xs font-semibold text-[#3083DC]">
                {Math.round(progressoNivel)}%
              </span>
            </div>

            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#7EBDC2]/30">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#3083DC] via-[#7EBDC2] to-[#7EBDC2]"
                initial={{ width: 0 }}
                animate={{ width: `${progressoNivel}%` }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            </div>

            {nextLevel && (
              <div className="mt-4 rounded-xl border border-[#3083DC]/20 bg-white/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1C2541]">
                      Próximo nível · {nextLevel.titulo}
                    </p>
                    <p className="text-xs text-[#1C2541]/70">
                      Desbloqueia aos {formatXP(nextLevel.xp_minimo)} XP
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#3083DC]">
                    Falta {formatXP(xpFaltante)} XP
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setView('conquistas')}
            className="inline-flex items-center gap-2 rounded-full border border-[#7EBDC2]/40 bg-white px-4 py-2 text-sm font-semibold text-[#1C2541] shadow-sm transition-colors hover:border-[#7EBDC2]"
          >
            Abrir histórico
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView('proximosNiveis')}
            className="inline-flex items-center gap-2 rounded-full bg-[#3083DC] px-5 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#2567B5]"
          >
            Ver próximos níveis
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GamificacaoPanel;
