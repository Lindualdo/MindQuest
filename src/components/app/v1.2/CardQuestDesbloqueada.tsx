import { motion } from 'framer-motion';
import { Flame, MessageCircle } from 'lucide-react';

type Props = {
  titulo: string;
  descricao: string;
  xpRecompensa: number;
  ultimaConversa: string;
  streakAtual: number;
  metaStreak: number;
  onVerQuest?: () => void;
  onConversar?: () => void;
};

const CardQuestDesbloqueada = ({
  titulo,
  descricao,
  xpRecompensa,
  ultimaConversa,
  streakAtual,
  metaStreak,
  onVerQuest,
  onConversar,
}: Props) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="rounded-3xl p-5 sm:p-6"
    style={{ backgroundColor: '#1C2541', color: '#F5EBF3' }}
  >
    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7EBDC2' }}>
      ✨ Hoje você desbloqueou
    </p>
    <div className="mt-4 space-y-3">
      <p className="text-xl font-semibold">{titulo}</p>
      <p className="text-sm" style={{ color: 'rgba(245, 235, 243, 0.8)' }}>
        {descricao}
      </p>
      <p className="text-sm font-semibold">+{xpRecompensa} XP ao completar</p>
      <div className="flex flex-col gap-2 text-xs" style={{ color: 'rgba(245, 235, 243, 0.8)' }}>
        <span className="inline-flex items-center gap-2">
          <MessageCircle size={14} /> Última conversa: {ultimaConversa}
        </span>
        <span className="inline-flex items-center gap-2">
          <Flame size={14} /> Streak: {streakAtual} dia{streakAtual > 1 ? 's' : ''} (meta {metaStreak})
        </span>
      </div>
    </div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onConversar}
        className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: '#D90368' }}
      >
        Conversar agora
      </button>
      <button
        type="button"
        onClick={onVerQuest}
        className="w-full rounded-full border px-5 py-3 text-sm font-semibold"
        style={{ borderColor: '#F5EBF3', color: '#F5EBF3' }}
      >
        Explorar quest
      </button>
    </div>
  </motion.section>
);

export default CardQuestDesbloqueada;
