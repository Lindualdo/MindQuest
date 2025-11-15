import { motion } from 'framer-motion';
import { Flame, MessageCircle } from 'lucide-react';

type DiaConversa = {
  label: string;
  dataLabel: string;
  status: 'respondido' | 'perdido' | 'pendente' | 'default';
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

const CardConversas = ({
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

  const statusConfig: Record<DiaConversa['status'], { bg: string; border: string; icon: string; color: string }> = {
    respondido: { bg: 'rgba(62,187,137,0.15)', border: 'rgba(62,187,137,0.6)', icon: '✓', color: '#2E7A5F' },
    perdido: { bg: 'rgba(214,221,236,0.6)', border: 'rgba(109,125,163,0.4)', icon: '✕', color: '#58617A' },
    pendente: { bg: 'rgba(240,232,205,0.8)', border: 'rgba(213,182,95,0.6)', icon: '…', color: '#9A6D18' },
    default: { bg: 'rgba(214,221,236,0.6)', border: 'rgba(109,125,163,0.3)', icon: '—', color: '#6D7DA3' },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="mq-card-v1_2 p-5"
      style={{ backgroundColor: '#FFF4ED', borderColor: 'rgba(255,153,110,0.35)', boxShadow: '0 10px 20px rgba(255,153,110,0.12)' }}
    >
      <header className="flex flex-col gap-1">
        <p className="mq-card-title-v1_2">🗓️ Diário de conversas</p>
        <div className="flex flex-wrap items-center justify-between gap-1 text-[0.78rem] font-semibold" style={{ color: '#1C2541' }}>
          <span className="inline-flex items-center gap-1.5" style={{ color: '#F97316' }}>
            <Flame size={14} /> {streakAtual} {diaLabel} {seguidoLabel}
          </span>
          <span className="mq-card-meta-v1_2 font-medium">Recorde {recorde} dias</span>
        </div>
      </header>

      <div className="mt-3">
        <div className="mq-bar-track-v1_2" style={{ backgroundColor: 'rgba(255,153,110,0.22)' }}>
          <div
            className="mq-bar-fill-v1_2"
            style={{ width: `${progresso}%`, backgroundColor: '#FF996E' }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[0.75rem] font-medium" style={{ color: '#1C2541' }}>
          <span>
            {progressoAtual} conversa{progressoAtual > 1 ? 's' : ''}
          </span>
          <span>
            Meta {progressoMeta} conversa{progressoMeta > 1 ? 's' : ''}
          </span>
        </div>
        <p className="mq-card-meta-v1_2 mt-0.5">
          {ultimaConversaLabel ?? 'Última conversa há 1 dia e 4h'}
        </p>
      </div>

      {diasSemana.length > 0 && (
        <div className="mt-4">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            {diasSemana.map((dia) => {
              const config = statusConfig[dia.status] ?? statusConfig.default;
              return (
                <div
                  key={`${dia.label}-${dia.dataLabel}`}
                  className="flex flex-1 flex-col items-center text-center min-w-0"
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-2 text-sm font-semibold sm:h-12 sm:w-12"
                    style={{ backgroundColor: config.bg, borderColor: config.border, color: config.color }}
                  >
                    {config.icon}
                  </div>
                  <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wide text-[#1C2541] sm:text-[0.65rem]">
                    {dia.label}
                  </span>
                  <span className="text-[0.6rem] font-medium text-[#7E8CA0] sm:text-[0.65rem]">
                    {dia.dataLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl px-4 py-3" style={{ backgroundColor: '#FFF1F6', border: '1px solid rgba(217,3,104,0.25)' }}>
        <p className="mq-card-heading-v1_2">💡 Próxima conversa desbloqueia</p>
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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
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

export default CardConversas;
