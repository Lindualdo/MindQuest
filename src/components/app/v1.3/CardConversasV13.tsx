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
      bg: 'rgba(255,159,122,0.18)',
      border: 'rgba(255,159,122,0.7)',
      icon: '✓',
      color: '#C14E2B',
    },
    perdido: {
      bg: 'rgba(232,235,244,0.8)',
      border: 'rgba(140,149,178,0.4)',
      icon: '✕',
      color: '#6D7692',
    },
    pendente: {
      bg: 'rgba(255,238,209,0.8)',
      border: 'rgba(224,177,103,0.8)',
      icon: '…',
      color: '#B07229',
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
      className="mq-card-v1_2 px-4 py-4 sm:px-6"
      style={{
        backgroundColor: '#FFF9F5',
        borderColor: 'rgba(255,153,110,0.25)',
        boxShadow: '0 10px 18px rgba(255,153,110,0.08)',
      }}
    >
      {/* Barra de Progresso */}
      <div>
        <div className="mq-bar-track-v1_2" style={{ backgroundColor: 'rgba(255,153,110,0.18)' }}>
          <div
            className="mq-bar-fill-v1_2"
            style={{ width: `${progresso}%`, backgroundColor: '#FF9072' }}
          />
        </div>
        <div
          className="mt-2 flex items-center justify-between text-[0.75rem] font-semibold"
          style={{ color: '#1C2541' }}
        >
          <span>{xpRealizado} pontos. {progresso}% da meta</span>
          <span>{xpPrevisto} pts</span>
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
                      boxShadow: dia.isHoje ? '0 0 0 2px rgba(255,144,114,0.35)' : 'none',
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

