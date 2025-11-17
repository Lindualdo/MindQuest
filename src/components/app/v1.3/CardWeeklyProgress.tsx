import { Flame } from 'lucide-react';

export type WeeklyXpDay = {
  data: string; // ISO date (YYYY-MM-DD)
  label: string; // Dia da semana curto, ex.: Seg, Ter
  totalXp: number;
  xpBase: number;
  xpBonus: number;
};

export type WeeklyXpSummary = {
  usuarioId: string;
  semanaInicio: string; // ISO date
  semanaFim: string; // ISO date
  streakAtualDias: number;
  xpSemanaTotal: number;
  xpMetaSemana?: number;
  dias: WeeklyXpDay[];
};

type Props = {
  summary: WeeklyXpSummary;
  onContinue: () => void;
};

const CardWeeklyProgress = ({ summary, onContinue }: Props) => {
  const { dias, streakAtualDias, xpSemanaTotal, xpMetaSemana } = summary;

  const maxXp = Math.max(
    ...dias.map((dia) => dia.totalXp || 0),
    xpMetaSemana ?? 0,
    1,
  );

  const progressoMeta =
    xpMetaSemana && xpMetaSemana > 0
      ? Math.min(100, Math.round((xpSemanaTotal / xpMetaSemana) * 100))
      : undefined;

  return (
    <section
      className="rounded-2xl bg-white px-4 py-3 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <p className="text-sm font-semibold text-[#1C2541]">
        Meu progresso semanal
      </p>

      <div className="mt-3 h-24 w-full">
        <div className="flex h-full items-end justify-between gap-1.5">
          {dias.map((dia) => {
            const hasXp = dia.totalXp > 0;
            const heightPercent = (dia.totalXp / maxXp) * 100;
            const barHeight = Math.max(16, (heightPercent / 100) * 80);
            const isUltimoComXp = hasXp && dia === [...dias].reverse().find((d) => d.totalXp > 0);

            const barColor = hasXp
              ? isUltimoComXp
                ? '#22C55E'
                : '#7EBDC2'
              : '#CBD5E1';

            return (
              <div
                key={dia.data}
                className="flex flex-1 flex-col items-center justify-end gap-1"
              >
                <div
                  className="w-3 rounded-full"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: barColor,
                  }}
                />
                <span className="text-[0.6rem] font-semibold text-[#1C2541]">
                  {dia.label}
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
        {progressoMeta !== undefined && (
          <p className="text-[0.7rem] font-medium text-[#475569]">
            {xpSemanaTotal}
            {' '}
            XP nesta semana
            {' · '}
            {progressoMeta}
            %
            {' '}
            da meta
          </p>
        )}
        <button
          type="button"
          onClick={onContinue}
          className="ml-2 rounded-full px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-wide text-white"
          style={{
            background: 'linear-gradient(135deg, #3083DC, #D90368)',
            boxShadow: '0 8px 16px rgba(217,3,104,0.4)',
          }}
        >
          Continuar
        </button>
      </div>
    </section>
  );
};

export default CardWeeklyProgress;
