import { motion } from 'framer-motion';

interface Props {
  descricaoNivel: string;
  nivelAtual: string;
  xpAtual: number;
  xpMeta: number;
  proximoNivel: string;
  xpRestante: number;
  beneficios: string[];
  onExplorarJornada?: () => void;
}

const CardJornada = ({
  descricaoNivel,
  nivelAtual,
  xpAtual,
  xpMeta,
  proximoNivel,
  xpRestante,
  beneficios,
  onExplorarJornada,
}: Props) => {
  const progresso = xpMeta > 0 ? Math.min(100, Math.round((xpAtual / xpMeta) * 100)) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="mq-card-v1_2 p-5"
      style={{ backgroundColor: '#F7EEF9', borderColor: 'rgba(217,3,104,0.12)', boxShadow: '0 10px 18px rgba(217,3,104,0.08)' }}
    >
      <div className="space-y-1.5 leading-tight">
        <h2 className="mq-card-heading-v1_2 text-[0.85rem] sm:text-[1rem]">Minha jornada</h2>
        <p className="mq-subtitle-v1_2 text-[0.65rem] sm:text-[0.8rem]">{nivelAtual}</p>
        <p className="mq-card-meta-v1_2 text-[0.65rem] sm:text-[0.8rem]">{descricaoNivel}</p>
      </div>

      <div className="mt-4 rounded-2xl border bg-white px-4 py-3" style={{ borderColor: 'rgba(28,37,65,0.12)' }}>
        <div className="mt-1 flex items-center justify-between text-[0.68rem] sm:text-xs font-semibold" style={{ color: '#1C2541' }}>
          <span>{xpAtual} XP</span>
          <span>{xpMeta} XP</span>
        </div>
        <div className="mq-bar-track-v1_2 mt-2" aria-label="Progresso de XP">
          <div className="mq-bar-fill-v1_2" style={{ width: `${progresso}%` }} />
        </div>
        <p className="mt-2 text-[0.7rem] sm:text-xs font-medium" style={{ color: '#1C2541' }}>
          Faltam <strong>{xpRestante} XP</strong> para Meta {proximoNivel}
        </p>
      </div>

      <div className="mt-3 rounded-2xl border border-[#FEC6D0] bg-[#FFF2F5] px-4 py-3">
        <p className="text-[0.75rem] font-semibold text-[#D61F69]">Quando você avança</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-[0.72rem] text-[#1C2541]">
          {beneficios.map((beneficio) => (
            <li key={beneficio}>{beneficio}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onExplorarJornada}
          className="mq-link-inline-v1_2 text-[0.75rem] sm:text-[0.85rem]"
        >
          Explorar jornada <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};

export default CardJornada;
