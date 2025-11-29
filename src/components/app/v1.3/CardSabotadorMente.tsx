import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { getSabotadorById } from '@/data/sabotadoresCatalogo';

type Props = {
  sabotadorId?: string | null;
  nome?: string | null;
  emoji?: string | null;
  descricao?: string | null;
  onSaberMais?: () => void;
};

const CardSabotadorMente = ({ sabotadorId, nome, emoji, descricao, onSaberMais }: Props) => {
  const [showInfo, setShowInfo] = useState(false);
  const catalogEntry = sabotadorId ? getSabotadorById(sabotadorId) : undefined;

  const titulo = nome?.trim() || catalogEntry?.nome || 'Nenhum sabotador em destaque';
  const iconeEmoji = emoji ?? catalogEntry?.emoji ?? null;
  const descricaoProp = descricao?.trim();
  const detalhes =
    catalogEntry?.resumo ||
    catalogEntry?.descricao ||
    descricaoProp ||
    'Continue conversando para detectar padrões e sabotadores ativos.';

  return (
    <section className="mq-card rounded-2xl px-4 py-4" style={{ borderRadius: 24 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[var(--mq-text)]">Sabotador mais ativo</h3>
          <p className="mq-eyebrow mt-0.5">
            Meu padrão mental
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 rounded-full bg-[var(--mq-card)] text-[var(--mq-primary)] hover:bg-[var(--mq-card)] transition-colors"
        >
          <Info size={16} />
        </button>
      </div>

      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl bg-[var(--mq-card)] p-3 text-xs text-[var(--mq-text-muted)]"
        >
          <p className="font-semibold mb-1">O que são Sabotadores?</p>
          <p>Sabotadores são padrões mentais automáticos. Surgem como mecanismos de proteção mas acabam interferindo em decisões e bem-estar emocional. São relacionados com suas crenças e sua percepção sobre o mundo ao seu redor.</p>
        </motion.div>
      )}

      <div className="mt-3 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-card)] px-4 py-4">
        <h3 className="flex items-center gap-2 text-[0.95rem] font-semibold text-[var(--mq-text)]">
          {iconeEmoji && <span>{iconeEmoji}</span>}
          <span>{titulo}</span>
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--mq-text-muted)] line-clamp-2">
          {detalhes}
        </p>
      </div>
      {onSaberMais && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onSaberMais}
            className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[var(--mq-primary)] underline-offset-2 hover:underline"
          >
            Saber mais
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 2, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </button>
        </div>
      )}
    </section>
  );
};

export default CardSabotadorMente;
