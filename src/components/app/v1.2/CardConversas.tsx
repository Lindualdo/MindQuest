import { motion } from 'framer-motion';
import { Flame, MessageCircle } from 'lucide-react';

type Props = {
  streakAtual: number;
  recorde: number;
  progressoAtual: number;
  progressoMeta: number;
  beneficios: string[];
  xpBonus?: number;
  ultimaConversaLabel?: string;
  onConversar?: () => void;
  onExplorarHistorico?: () => void;
};

const CardConversas = ({
  streakAtual,
  recorde,
  progressoAtual,
  progressoMeta,
  beneficios,
  xpBonus = 40,
  ultimaConversaLabel,
  onConversar,
  onExplorarHistorico,
}: Props) => {
  const progresso = Math.min(100, Math.round((progressoAtual / progressoMeta) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="mq-card-v1_2 p-5"
      style={{ backgroundColor: 'rgba(255,228,208,0.4)', borderColor: 'rgba(249,115,22,0.12)', boxShadow: '0 8px 16px rgba(249,115,22,0.08)' }}
    >
      <header className="flex flex-col gap-1">
        <p className="mq-card-heading-v1_2 text-[0.95rem]">💬 Conversas</p>
        <div className="flex flex-wrap items-center justify-between gap-1 text-[0.78rem] font-semibold" style={{ color: '#1C2541' }}>
          <span className="inline-flex items-center gap-1.5" style={{ color: '#F97316' }}>
            <Flame size={14} /> {streakAtual} dia{streakAtual > 1 ? 's' : ''} seguido
          </span>
          <span className="mq-card-meta-v1_2 font-medium">Recorde {recorde} dias</span>
        </div>
      </header>

      <div className="mt-3">
        <div className="mq-bar-track-v1_2" style={{ backgroundColor: 'rgba(249, 115, 22, 0.18)' }}>
          <div
            className="mq-bar-fill-v1_2"
            style={{ width: `${progresso}%`, backgroundColor: '#FB8A2A' }}
          />
        </div>
        <div className="mt-2 flex items-center text-[0.75rem] font-medium" style={{ color: '#1C2541' }}>
          <span>{progressoAtual}/{progressoMeta} conversas concluídas</span>
        </div>
        <p className="mq-card-meta-v1_2 mt-0.5">
          {ultimaConversaLabel ?? 'Última conversa há 1 dia e 4h'}
        </p>
      </div>

      <div className="mt-4 rounded-2xl px-4 py-3" style={{ backgroundColor: '#FFF1F6', border: '1px solid rgba(217,3,104,0.25)' }}>
        <p className="mq-card-heading-v1_2 text-[0.85rem]">💡 Próxima conversa desbloqueia</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[0.75rem]" style={{ color: '#1C2541' }}>
          <li>+75 XP base</li>
          <li>+{xpBonus} XP bônus</li>
          {beneficios
            .filter((beneficio) => {
              const texto = beneficio.toLowerCase();
              return !texto.includes('xp base') && !texto.includes('xp bônus');
            })
            .map((beneficio) => (
              <li key={beneficio}>{beneficio}</li>
            ))}
        </ul>
      </div>

      <div className="mt-3 flex justify-end">
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
