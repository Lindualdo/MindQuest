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
    <section
      className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-4 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[#1C2541]">Sabotador mais ativo</h3>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#2F76D1] mt-0.5">
            Meu padrão mental
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 rounded-full bg-white/60 text-[#2F76D1] hover:bg-white transition-colors"
        >
          <Info size={16} />
        </button>
      </div>

      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl bg-white/80 p-3 text-xs text-slate-600"
        >
          <p className="font-semibold mb-1">O que são Sabotadores?</p>
          <p>Sabotadores são padrões mentais automáticos. Surgem como mecanismos de proteção mas acabam interferindo em decisões e bem-estar emocional. São relacionados com suas crenças e sua percepção sobre o mundo ao seu redor.</p>
        </motion.div>
      )}

      <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-4 py-4">
        <h3 className="flex items-center gap-2 text-[0.95rem] font-semibold text-[#111827]">
          {iconeEmoji && <span>{iconeEmoji}</span>}
          <span>{titulo}</span>
        </h3>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-[#4B5563] line-clamp-2">
          {detalhes}
        </p>
      </div>
      {onSaberMais && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onSaberMais}
            className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
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

