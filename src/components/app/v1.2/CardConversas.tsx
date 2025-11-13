import { motion } from 'framer-motion';
import { Flame, MessageCircle } from 'lucide-react';

type DiaConversas = {
  dia: string;
  data: string;
  status: 'feito' | 'falhou';
};

type Props = {
  streakAtual: number;
  recorde: number;
  progressoAtual: number;
  progressoMeta: number;
  dias: DiaConversas[];
  beneficios: string[];
  onConversar?: () => void;
};

const CardConversas = ({
  streakAtual,
  recorde,
  progressoAtual,
  progressoMeta,
  dias,
  beneficios,
  onConversar,
}: Props) => {
  const progresso = Math.min(100, Math.round((progressoAtual / progressoMeta) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl border p-5 sm:p-6"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EF' }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
            💬 Conversas
          </p>
          <button type="button" className="text-xs font-semibold" style={{ color: '#3083DC' }}>
            Explorar histórico
          </button>
        </div>
        <p className="text-sm" style={{ color: '#1C2541' }}>
          <span className="inline-flex items-center gap-2" style={{ color: '#F97316' }}>
            <Flame size={14} /> {streakAtual} dia{streakAtual > 1 ? 's' : ''} seguido
          </span>
          {' · '}Recorde {recorde} dias
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold" style={{ color: '#1C2541' }}>
          <span>{progressoAtual}/{progressoMeta} conversas para +40 XP</span>
          <span>{progresso}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: '#E8F3F5' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${progresso}%`, backgroundColor: '#3083DC' }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px]">
        {dias.map((dia) => (
          <div
            key={dia.dia}
            className="rounded-2xl border px-2 py-2"
            style={{
              borderColor: dia.status === 'feito' ? '#B5E4C7' : '#E5E7EF',
              backgroundColor: dia.status === 'feito' ? '#E9F7EF' : '#F8FAFC',
              color: dia.status === 'feito' ? '#1C2541' : '#94A3B8',
            }}
          >
            <p className="font-semibold">{dia.dia}</p>
            <p>{dia.data}</p>
            <p className="text-base">{dia.status === 'feito' ? '✓' : '×'}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl p-4" style={{ backgroundColor: '#F5EBF3' }}>
        <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
          💡 Próxima conversa desbloqueia
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm" style={{ color: '#1C2541' }}>
          {beneficios.map((beneficio) => (
            <li key={beneficio}>{beneficio}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onConversar}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: '#D90368' }}
      >
        <MessageCircle size={16} /> Conversar no WhatsApp
      </button>
    </motion.section>
  );
};

export default CardConversas;
