import { motion } from 'framer-motion';
type Props = {
  descricaoNivel: string;
  nivelAtual: string;
  xpAtual: number;
  xpMeta: number;
  proximoNivel: string;
  xpRestante: number;
};

const CardJornada = ({
  descricaoNivel,
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
      className="mq-card-v1_2 p-5"
      style={{ backgroundColor: '#DCE8F8', borderColor: 'rgba(48,131,220,0.25)', boxShadow: '0 16px 28px rgba(48,131,220,0.12)' }}
    >
      <div className="space-y-1.5 leading-tight">
        <h2 className="mq-card-heading-v1_2 text-[0.85rem] sm:text-[1rem]">Minha jornada</h2>
        <p className="mq-subtitle-v1_2 text-[0.65rem] sm:text-[0.8rem]">{nivelAtual}</p>
        <p className="mq-card-meta-v1_2 text-[0.65rem] sm:text-[0.8rem]">
          {descricaoNivel}
        </p>
      </div>
      <div className="mt-4 rounded-2xl border bg-white px-4 py-3" style={{ borderColor: 'rgba(28,37,65,0.12)' }}>
        <div className="flex items-center justify-between text-[0.68rem] sm:text-xs font-semibold" style={{ color: '#1C2541' }}>
          <span>{xpAtual} XP</span>
          <span>{xpMeta} XP</span>
        </div>
        <div className="mq-bar-track-v1_2 mt-2" aria-label="Progresso de XP">
          <div className="mq-bar-fill-v1_2" style={{ width: `${progresso}%` }} />
        </div>
        <p className="mt-2 text-[0.7rem] sm:text-xs font-medium" style={{ color: '#1C2541' }}>
          Faltam <strong>{xpRestante} XP</strong> para
          <span className="sr-only">Meta {proximoNivel}</span>
        </p>
        <p className="mq-card-meta-v1_2 text-[0.68rem] sm:text-[0.75rem]" style={{ color: '#1C2541' }}>
          Meta {proximoNivel}
        </p>
      </div>
      <div className="mt-2 flex justify-end">
        <button type="button" className="mq-link-inline-v1_2">
          Explorar jornada <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};

export default CardJornada;
