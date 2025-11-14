import { motion } from 'framer-motion';
import { Sparkles, Target } from 'lucide-react';

type Props = {
  titulo: string;
  descricao: string;
  xpRecompensa: number;
  onExplorarQuests?: () => void;
};

const CardQuestAtiva = ({
  titulo,
  descricao,
  xpRecompensa,
  onExplorarQuests,
}: Props) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mq-card-v1_2 p-5"
      style={{
        backgroundColor: '#E8F3F5',
        borderColor: '#C9DEE5',
        boxShadow: '0 18px 32px rgba(28,37,65,0.08), 0 0 0 1px rgba(28,37,65,0.04)',
      }}
    >
      <div className="flex justify-center">
        <div
          className="mq-eyebrow-v1_2 inline-flex items-center gap-1 rounded-full px-5 py-1 uppercase"
          style={{ backgroundColor: '#FFFFFF', color: '#7EBDC2', boxShadow: '0 6px 18px rgba(126,189,194,0.25)' }}
        >
          <Sparkles size={14} color="#D90368" />
          Hoje você desbloqueou
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3 text-center">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border-2"
          style={{ borderColor: '#7EBDC2', backgroundColor: '#FFFFFF', color: '#7EBDC2', boxShadow: '0 8px 16px rgba(126,189,194,0.25)' }}
        >
          <Target size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="mq-card-heading-v1_2 text-center text-[0.95rem]">{titulo}</h3>
          <p className="mq-card-meta-v1_2 text-center text-[0.8rem]" style={{ color: '#4F5779' }}>
            {descricao}
          </p>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-0.5 text-[0.78rem] font-semibold"
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

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onExplorarQuests}
          className="mq-link-inline-v1_2 text-[0.75rem] sm:text-[0.85rem]"
        >
          Explorar quests <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};

export default CardQuestAtiva;
