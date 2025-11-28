import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowUpRight } from 'lucide-react';
import { getHumorDescriptor } from '@/data/humorEnergyCatalog';

type Props = {
  humorAtual: number; // 1-10
  humorMediaSemana: number; // 1-10
  onHistorico?: () => void;
};

const CardHumor = ({ humorAtual, humorMediaSemana, onHistorico }: Props) => {
  const [showInfo, setShowInfo] = useState(false);

  const humorHoje = Math.round(Math.max(1, Math.min(10, humorAtual)));
  const humorMedia = Math.round(Math.max(1, Math.min(10, humorMediaSemana)));

  const humorDescriptor = getHumorDescriptor(humorHoje);
  const humorMediaDescriptor = getHumorDescriptor(humorMedia);

  const gaugeAngle = (Math.PI * humorHoje) / 10;
  const pointerX = 60 - 30 * Math.cos(gaugeAngle);
  const pointerY = 70 - 30 * Math.sin(gaugeAngle);

  return (
    <section
      className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-3 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#1C2541]">Humor</h3>
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
          <p className="font-semibold mb-1">O que é o Humor?</p>
          <p>Seu estado emocional atual detectado através das conversas. A escala vai de 1 a 10, onde valores menores indicam humor mais baixo e valores maiores indicam humor mais elevado.</p>
        </motion.div>
      )}

      <div className="flex flex-col items-center">
        <div className="mt-1 w-full max-w-[220px]">
          <svg viewBox="0 0 120 80" className="w-full">
            <defs>
              <linearGradient id="humor-gauge-perfil" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <path
              d="M10 70 A50 50 0 0 1 110 70"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={10}
              strokeLinecap="round"
            />
            <path
              d="M10 70 A50 50 0 0 1 110 70"
              fill="none"
              stroke="url(#humor-gauge-perfil)"
              strokeWidth={10}
              strokeLinecap="round"
            />
            {[2, 5, 8].map((value) => {
              const angle = (Math.PI * value) / 10;
              const x1 = 60 - 35 * Math.cos(angle);
              const y1 = 70 - 35 * Math.sin(angle);
              const x2 = 60 - 42 * Math.cos(angle);
              const y2 = 70 - 42 * Math.sin(angle);
              return (
                <line
                  key={value}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                />
              );
            })}
            <line
              x1={60}
              y1={70}
              x2={pointerX}
              y2={pointerY}
              stroke="#111827"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={60} cy={70} r={4} fill="#111827" />
          </svg>
        </div>
        <p className="mt-3 text-[0.8rem] font-semibold text-[#DC2626]">
          Atual: <span className="capitalize">{humorDescriptor.titulo}</span>
        </p>
        <p className="mt-1 text-[0.7rem] text-[#4B5563]">
          Média histórica:
          {' '}
          <span className="font-semibold capitalize">
            {humorMediaDescriptor.titulo}
          </span>
        </p>
      </div>

      {onHistorico && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onHistorico}
            className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
          >
            Histórico
            <ArrowUpRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

export default CardHumor;

