import { motion } from 'framer-motion';
import { Flame, MessageCircle, Sparkles, Target } from 'lucide-react';

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

const CardQuestAtiva = ({
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
    className="rounded-3xl border p-5 sm:p-6"
    style={{
      backgroundColor: '#E8F3F5',
      borderColor: '#C9DEE5',
      boxShadow: '0 18px 32px rgba(28,37,65,0.08), 0 0 0 1px rgba(28,37,65,0.04)',
    }}
  >
    <div
      className="rounded-2xl px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: '#FFFFFF', color: '#7EBDC2' }}
    >
      <div className="flex items-center justify-between gap-3 text-[0.7rem] sm:text-[0.75rem]">
        <span className="inline-flex items-center gap-1">
          <Sparkles size={14} color="#D90368" />
          Hoje você desbloqueou
        </span>
      </div>
    </div>

    <div className="mt-5 flex flex-col items-center gap-3 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl border-2"
        style={{ borderColor: '#7EBDC2', backgroundColor: '#FFFFFF', color: '#7EBDC2', boxShadow: '0 8px 16px rgba(126,189,194,0.25)' }}
      >
        <Target size={26} />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold" style={{ color: '#1C2541' }}>
          {titulo}
        </h3>
        <p className="text-[0.9rem]" style={{ color: '#4F5779', lineHeight: 1.35 }}>
          {descricao}
        </p>
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-0.5 text-[0.85rem] font-semibold"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#7EBDC2',
            boxShadow: 'inset 0 0 0 1px rgba(126,189,194,0.4)',
          }}
        >
          +{xpRecompensa} XP ao completar
        </span>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2 text-[0.9rem] font-semibold">
      <button
        type="button"
        onClick={onConversar}
        className="rounded-full px-4 py-2.5 text-white shadow-md"
        style={{ backgroundColor: '#3083DC', boxShadow: '0 10px 18px rgba(48,131,220,0.28)' }}
      >
        Conversar
      </button>
      <button
        type="button"
        onClick={onVerQuest}
        className="rounded-full border px-4 py-2.5"
        style={{ borderColor: '#7EBDC2', color: '#7EBDC2' }}
      >
        Ver quest
      </button>
    </div>

    <div
      className="mt-5 rounded-2xl border px-4 py-3 text-xs sm:text-sm"
      style={{ backgroundColor: '#E8F3F5', borderColor: 'rgba(28,37,65,0.08)', color: '#1C2541' }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} color="#7EBDC2" />
          <span>Última conversa: {ultimaConversa}</span>
        </div>
        <div className="hidden h-5 w-px bg-white/60 sm:block" />
        <div className="flex items-center gap-2">
          <Flame size={16} color="#D90368" />
          <span>
            Streak: {streakAtual} dia{streakAtual > 1 ? 's' : ''} (meta {metaStreak})
          </span>
        </div>
      </div>
    </div>
  </motion.section>
);

export default CardQuestAtiva;
