import { motion } from 'framer-motion';

type DiaConversa = {
  label: string;
  dataLabel: string;
  status: 'respondido' | 'perdido' | 'pendente' | 'default';
  isHoje?: boolean;
};

type Props = {
  xpPrevisto: number;
  xpRealizado: number;
  diasSemana?: DiaConversa[];
};

const CardConversasV13 = ({
  xpPrevisto,
  xpRealizado,
  diasSemana = [],
}: Props) => {
  const progresso = xpPrevisto > 0 ? Math.min(100, Math.round((xpRealizado / xpPrevisto) * 100)) : 0;

  const statusConfig: Record<
    DiaConversa['status'],
    { bg: string; border: string; icon: string; color: string }
  > = {
    respondido: {
      bg: '#DCEEF6',
      border: '#0EA5E9',
      icon: '✓',
      color: '#0EA5E9',
    },
    perdido: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'rgba(140,149,178,0.4)',
      icon: '✕',
      color: '#6D7692',
    },
    pendente: {
      bg: '#FEF3C7',
      border: '#FCD34D',
      icon: '…',
      color: '#D97706',
    },
    default: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'rgba(140,149,178,0.35)',
      icon: '—',
      color: '#6D7692',
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="mb-6 rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-3 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      {/* Título */}
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1]">
        Conversas da semana
      </p>

      {/* Barra de Progresso */}
      <div className="mt-4">
        <div className="relative h-2 w-full rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#22C55E] to-[#14B8A6]"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[0.7rem] font-semibold text-[#475569]">
          <span className="text-[#1C2541]">
            {xpRealizado} pontos. {progresso}% da meta
          </span>
          <span>
            {xpPrevisto} pts
          </span>
        </div>
      </div>

      {/* Dias da Semana */}
      {diasSemana.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {diasSemana.map((dia) => {
              const config = statusConfig[dia.status] ?? statusConfig.default;
              return (
                <div
                  key={`${dia.label}-${dia.dataLabel}`}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 text-[0.8rem] font-semibold leading-none sm:h-10 sm:w-10 sm:text-sm"
                    style={{
                      backgroundColor: config.bg,
                      borderColor: config.border,
                      color: config.color,
                      boxShadow: dia.isHoje ? '0 0 0 2px rgba(14,165,233,0.35)' : 'none',
                    }}
                  >
                    {config.icon}
                  </div>
                  <span className="mt-1 text-[0.56rem] font-semibold uppercase tracking-wide text-[#1C2541] sm:text-[0.63rem]">
                    {dia.label}
                  </span>
                  <span className="text-[0.56rem] font-medium text-[#7E8CA0] sm:text-[0.63rem]">
                    {dia.dataLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default CardConversasV13;

