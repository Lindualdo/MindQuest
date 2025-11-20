import { motion } from 'framer-motion';
import { Flame, MessageCircle } from 'lucide-react';

type DiaConversa = {
  label: string;
  dataLabel: string;
  status: 'respondido' | 'perdido' | 'pendente' | 'default';
  isHoje?: boolean;
};

type Props = {
  streakAtual: number;
  recorde: number;
  progressoAtual: number;
  progressoMeta: number;
  beneficios: string[];
  xpBonus?: number;
  ultimaConversaLabel?: string;
  diasSemana?: DiaConversa[];
  onConversar?: () => void;
  onExplorarHistorico?: () => void;
  onVerInsights?: () => void;
};

const CardConversasV13 = ({
  streakAtual,
  recorde,
  progressoAtual,
  progressoMeta,
  beneficios,
  xpBonus = 40,
  ultimaConversaLabel,
  diasSemana = [],
  onConversar,
  onExplorarHistorico,
  onVerInsights,
}: Props) => {
  const progresso = Math.min(100, Math.round((progressoAtual / progressoMeta) * 100));
  const diaLabel = streakAtual === 1 ? 'dia' : 'dias';
  const seguidoLabel = streakAtual === 1 ? 'seguido' : 'seguidos';

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
      className="mq-card-v1_2 px-4 py-6 sm:px-6"
      style={{
        backgroundColor: '#FFF9F5',
        borderColor: 'rgba(255,153,110,0.25)',
        boxShadow: '0 10px 18px rgba(255,153,110,0.08)',
      }}
    >
      <header className="flex flex-col gap-2.5">
        <p className="mq-card-title-v1_2 text-lg sm:text-xl">🗓️ Diário de conversas</p>
        <div
          className="flex flex-wrap items-center justify-between gap-1 text-[0.85rem] font-semibold"
          style={{ color: '#1C2541' }}
        >
          <span className="inline-flex items-center gap-1.5" style={{ color: '#F97316' }}>
            <Flame size={14} /> {streakAtual} {diaLabel} {seguidoLabel}
          </span>
          <span className="mq-card-meta-v1_2 font-medium">Recorde {recorde} dias</span>
        </div>
      </header>

      <div className="mt-5">
        <div className="mq-bar-track-v1_2" style={{ backgroundColor: 'rgba(255,153,110,0.18)' }}>
          <div
            className="mq-bar-fill-v1_2"
            style={{ width: `${progresso}%`, backgroundColor: '#FF9072' }}
          />
        </div>
        <div
          className="mt-3 flex items-center justify-between text-[0.82rem] font-semibold"
          style={{ color: '#1C2541' }}
        >
          <span>
            {progressoAtual} conversa{progressoAtual > 1 ? 's' : ''}
          </span>
          <span>
            Meta {progressoMeta} conversa{progressoMeta > 1 ? 's' : ''}
          </span>
        </div>
        <p className="mq-card-meta-v1_2 mt-1 text-[0.72rem]">
          {ultimaConversaLabel ?? 'Última conversa há 1 dia e 4h'}
        </p>
      </div>

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

      <div
        className="mt-5 rounded-2xl px-4 py-3"
        style={{ border: '1px solid rgba(255,153,110,0.3)' }}
      >
        <p className="mq-card-heading-v1_2 text-[0.95rem] font-semibold text-[#C14E2B]">
          💡 Próxima conversa desbloqueia
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[0.75rem]" style={{ color: '#1C2541' }}>
          <li>+75 XP base</li>
          <li>+{xpBonus} XP bônus</li>
          {beneficios
            .filter((beneficio) => {
              const texto = beneficio.toLowerCase();
              return (
                !texto.includes('xp base') &&
                !texto.includes('xp bônus') &&
                !texto.includes('progresso na quest')
              );
            })
            .map((beneficio) => (
              <li key={beneficio}>{beneficio}</li>
            ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {onVerInsights && (
          <button
            type="button"
            onClick={onVerInsights}
            className="mq-link-inline-v1_2 text-[0.75rem] sm:text-[0.85rem]"
            style={{ color: '#3083DC' }}
          >
            Ver insights <span aria-hidden="true">→</span>
          </button>
        )}
        <button
          type="button"
          onClick={onExplorarHistorico}
          className="mq-link-inline-v1_2 text-[0.75rem] sm:text-[0.85rem]"
        >
          Explorar histórico <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};

export default CardConversasV13;

