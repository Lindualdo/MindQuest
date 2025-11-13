import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';

type Props = {
  nome: string;
  nivelAtual: string;
  xpAtual: number;
  xpMeta: number;
  proximoNivel: string;
  xpRestante: number;
};

const CardSaudacaoHero = ({
  nome,
  nivelAtual,
  xpAtual,
  xpMeta,
  proximoNivel,
  xpRestante,
}: Props) => {
  const progresso = Math.min(100, Math.round((xpAtual / xpMeta) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="mq-card-v1_2 p-4"
      style={{ backgroundColor: 'var(--mq-v1_2-muted)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 leading-tight">
          <h1 className="mq-card-title-v1_2 text-[0.64rem] sm:text-[0.85rem]">
            👋 Boa tarde, {nome}
          </h1>
          <p className="mq-subtitle-v1_2 text-[0.4rem] sm:text-[0.6rem]">{nivelAtual}</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-white/70 p-1 text-xs" style={{ color: '#3083DC' }}>
          <Medal size={16} />
        </span>
      </div>
      <div className="mt-2 rounded-2xl border bg-white px-3 py-2" style={{ borderColor: 'rgba(28,37,65,0.15)' }}>
        <div className="flex items-center justify-between text-[0.65rem] sm:text-xs font-medium" style={{ color: '#1C2541' }}>
          <span>{xpAtual} XP</span>
          <span>{xpMeta} XP</span>
        </div>
        <div className="relative mt-2 h-[6px]" style={{ backgroundColor: 'var(--mq-v1_2-bar)' }}>
          <div className="mq-bar-fill-v1_2" style={{ width: `${progresso}%` }} />
        </div>
        <p className="mt-1.5 text-[8px] sm:text-[11px] font-medium" style={{ color: '#1C2541' }}>
          Faltam <strong>{xpRestante} XP</strong> para {proximoNivel}
        </p>
      </div>
      <div className="mt-1.5 flex justify-end">
        <button type="button" className="mq-link-inline-v1_2">
          Explorar jornada <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};

export default CardSaudacaoHero;
