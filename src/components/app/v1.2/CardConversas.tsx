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
      className="rounded-3xl border p-4 sm:p-5"
      style={{ backgroundColor: '#FFF8F3', borderColor: '#F5C7A6', boxShadow: '0 12px 20px rgba(245, 199, 166, 0.35)' }}
    >
      <p className="text-[0.85rem] font-semibold" style={{ color: '#1C2541' }}>
        💬 Conversas
      </p>
      <div className="mt-2 flex items-center justify-between text-[0.8rem]" style={{ color: '#1C2541' }}>
        <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: '#F97316' }}>
          <Flame size={14} /> {streakAtual} dia{streakAtual > 1 ? 's' : ''} seguido
        </span>
        <span style={{ color: '#7E8CA0', fontSize: '0.7rem' }}>Recorde {recorde} dias</span>
      </div>

      <div className="mt-3 space-y-1 text-[0.75rem]" style={{ color: '#1C2541' }}>
        <div className="mq-bar-track-v1_2" style={{ backgroundColor: '#FDE5D2' }}>
          <div className="mq-bar-fill-v1_2" style={{ width: `${progresso}%`, backgroundColor: '#F97316' }} />
        </div>
      </div>

      <p className="mt-2 text-[0.72rem]" style={{ color: '#1C2541' }}>
        {progressoAtual}/{progressoMeta} conversas concluídas
      </p>
      <p className="text-[0.72rem]" style={{ color: '#7E8CA0' }}>
        {ultimaConversaLabel ?? 'Última conversa há 1 dia e 4h'}
      </p>

      <div className="mt-4 rounded-2xl px-4 py-3" style={{ backgroundColor: '#FFF3F5', border: '1px solid rgba(217,3,104,0.25)' }}>
        <p className="text-[0.8rem] font-semibold" style={{ color: '#1C2541' }}>
          💡 Próxima conversa desbloqueia
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[0.75rem]" style={{ color: '#1C2541' }}>
          <li>+75 XP base</li>
          <li>+40 XP bônus</li>
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
