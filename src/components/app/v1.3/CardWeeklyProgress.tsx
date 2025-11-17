import { Flame } from 'lucide-react';
import type { WeeklyProgressCardData } from '@/types/emotions';

type Props = {
  summary: WeeklyProgressCardData;
  onContinue: () => void;
};

const CardWeeklyProgress = ({ summary, onContinue }: Props) => {
  const dias = summary.dias ?? [];
  const { streakAtualDias, xpSemanaTotal, xpMetaSemana, percentualMeta } = summary;

  const progressoMeta = typeof percentualMeta === 'number'
    ? percentualMeta
    : xpMetaSemana && xpMetaSemana > 0
        ? Math.min(100, Math.round((xpSemanaTotal / xpMetaSemana) * 100))
        : undefined;

  const progressoTexto = progressoMeta !== undefined
    ? `${xpSemanaTotal} pontos. ${progressoMeta}% da meta`
    : `${xpSemanaTotal} pontos`;

  return (
    <section
      className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-3 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <p className="text-sm font-semibold text-[#1C2541]">
        Meu progresso semanal
      </p>

      <div className="mt-2">
        <div className="relative h-2 w-full rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#22C55E] to-[#14B8A6]"
            style={{
              width: `${Math.min(
                100,
                (xpMetaSemana && xpMetaSemana > 0
                  ? (xpSemanaTotal / xpMetaSemana) * 100
                  : 100),
              ).toFixed(0)}%`,
            }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[0.7rem] font-semibold text-[#475569]">
          <span className="text-[#1C2541]">
            {progressoTexto}
          </span>
          <span>
            {xpMetaSemana ? `${xpMetaSemana} pts` : 'Meta'}
          </span>
        </div>
      </div>

      <div className="mt-5 h-16 w-full">
        <div className="flex h-full items-end justify-between gap-1">
          {dias.map((dia) => {
            const metaDia = dia.metaDia ?? 0;
            const ratio = metaDia > 0 ? Math.min(dia.totalXp / metaDia, 1) : 0;
            const barColor = (() => {
              switch (dia.status) {
                case 'concluido':
                  return '#22C55E';
                case 'parcial':
                  return '#86EFAC';
                default:
                  return '#CBD5E1';
              }
            })();
            const trackHeight = 56;
            const fillHeight = ratio > 0 ? Math.max(4, ratio * trackHeight) : 0;

            return (
              <div
                key={dia.data}
                className="flex flex-1 flex-col items-center justify-end gap-1"
              >
                <div
                  className="relative overflow-hidden rounded-full bg-slate-200"
                  style={{ height: `${trackHeight}px`, width: '10px' }}
                >
                  {fillHeight > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full"
                      style={{
                        height: `${fillHeight}px`,
                        backgroundColor: barColor,
                      }}
                    />
                  )}
                </div>
                <span className="text-[0.6rem] font-semibold text-[#1C2541]">
                  {dia.label ?? '--'}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 h-px w-full bg-slate-200" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C14E2B]">
          <Flame size={16} />
          <span>
            {streakAtualDias}
            {' '}
            dia
            {streakAtualDias === 1 ? '' : 's'}
          </span>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="ml-2 rounded-full px-3 py-1.5 text-[0.75rem] font-semibold uppercase tracking-wide text-white"
          style={{
            background: 'linear-gradient(135deg, #3083DC, #6EC3FF)',
            boxShadow: '0 6px 12px rgba(48,131,220,0.35)',
          }}
        >
          Continuar
        </button>
      </div>
    </section>
  );
};

export default CardWeeklyProgress;
