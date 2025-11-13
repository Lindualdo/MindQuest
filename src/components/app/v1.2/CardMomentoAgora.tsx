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

const CardMomentoAgora = ({
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
      className="rounded-3xl border p-4 sm:p-5"
      style={{ backgroundColor: '#E8F3F5', borderColor: '#D0E3E6' }}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase" style={{ color: '#7EBDC2' }}>
          Seu momento agora
        </p>
        <h1 className="text-xl font-semibold" style={{ color: '#1C2541' }}>
          👋 Boa tarde, {nome}
        </h1>
        <p className="text-sm" style={{ color: '#3083DC' }}>{nivelAtual}</p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm" style={{ color: '#1C2541' }}>
          <span>{xpAtual} XP</span>
          <span>{xpMeta} XP</span>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="h-full rounded-full" style={{ width: `${progresso}%`, backgroundColor: '#3083DC' }} />
        </div>
        <p className="text-sm" style={{ color: '#1C2541' }}>
          Faltam <strong>{xpRestante} XP</strong> para {proximoNivel}
        </p>
      </div>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: '#D90368' }}
        >
          Conversar
        </button>
        <button
          type="button"
          className="flex-1 rounded-full border px-4 py-2 text-sm font-semibold"
          style={{ borderColor: '#3083DC', color: '#3083DC' }}
        >
          Jornada
        </button>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-2xl px-3 py-1" style={{ backgroundColor: '#FFFFFF' }}>
        <Medal size={18} color="#3083DC" />
        <span className="text-xs font-semibold" style={{ color: '#1C2541' }}>Jornada ativa</span>
      </div>
    </motion.section>
  );
};

export default CardMomentoAgora;
