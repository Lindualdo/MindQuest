import { motion } from 'framer-motion';
import { Flame, MessageCircle, Sparkles, Target } from 'lucide-react';

type Props = {
  titulo: string;
  descricao: string;
  xpRecompensa: number;
  ultimaConversa: string;
  streakAtual: number;
  metaStreak: number;
  recordeConversas?: number;
  onVerQuest?: () => void;
  onConversar?: () => void;
  onExplorarHistorico?: () => void;
};

const CardQuestAtiva = ({
  titulo,
  descricao,
  xpRecompensa,
  ultimaConversa,
  streakAtual,
  metaStreak,
  recordeConversas,
  onVerQuest,
  onConversar,
  onExplorarHistorico,
}: Props) => {
  const progressoConversas = metaStreak > 0 ? Math.min(100, Math.round((streakAtual / metaStreak) * 100)) : 0;
  const xpBonusConversas = Math.min(40, xpRecompensa);
  const recordeAtual = recordeConversas ?? metaStreak;

  return (
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

    <div className="mt-5 flex flex-col items-center gap-2 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl border-2"
        style={{ borderColor: '#7EBDC2', backgroundColor: '#FFFFFF', color: '#7EBDC2', boxShadow: '0 8px 16px rgba(126,189,194,0.25)' }}
      >
        <Target size={20} />
      </div>
      <div className="space-y-1">
        <h3 className="text-[0.9rem] sm:text-[0.95rem] font-semibold" style={{ color: '#1C2541' }}>
          {titulo}
        </h3>
        <p className="text-[0.78rem] sm:text-[0.85rem]" style={{ color: '#4F5779', lineHeight: 1.28 }}>
          {descricao}
        </p>
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-0.5 text-[0.75rem] font-semibold"
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

    <div className="mt-4 grid grid-cols-2 gap-2 text-[0.7rem] sm:text-[0.8rem] font-semibold">
      <button
        type="button"
        onClick={onConversar}
        className="rounded-full px-3 py-1.5 text-white shadow-md"
        style={{ backgroundColor: '#3083DC', boxShadow: '0 8px 14px rgba(48,131,220,0.25)' }}
      >
        Conversar
      </button>
      <button
        type="button"
        onClick={onVerQuest}
        className="rounded-full border px-3 py-1.5"
        style={{ borderColor: '#7EBDC2', color: '#7EBDC2' }}
      >
        Ver quest
      </button>
    </div>

    <div
      className="mt-5 rounded-2xl bg-white px-4 py-3 shadow-sm"
      style={{ border: '1px solid #F5C7A6' }}
    >
      <div className="flex items-center justify-between text-[0.65rem] font-semibold" style={{ color: '#1C2541' }}>
        <span className="inline-flex items-center gap-1.5 uppercase tracking-wide">
          <MessageCircle size={14} color="#1C2541" />
          Conversas
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-[0.7rem]" style={{ color: '#1C2541' }}>
        <span className="inline-flex items-center gap-1 font-semibold">
          <Flame size={14} color="#F97316" />
          {streakAtual} dia{streakAtual > 1 ? 's' : ''} seguido
        </span>
        <span style={{ color: '#7E8CA0', fontSize: '0.65rem' }}>
          Recorde: {recordeAtual} dia{recordeAtual > 1 ? 's' : ''}
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[#D7E3F0]">
        <div
          className="h-full rounded-full"
          style={{ width: `${progressoConversas}%`, backgroundColor: '#F97316' }}
        />
      </div>
      <p className="mt-2 text-[0.6rem]" style={{ color: '#1C2541' }}>
        {streakAtual}/{metaStreak} conversas para +{xpBonusConversas} XP
      </p>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onExplorarHistorico}
          className="mq-link-inline-v1_2"
        >
          Explorar histórico <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
    </motion.section>
  );
};

export default CardQuestAtiva;
