import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { getEnergiaDescriptor } from '@/data/humorEnergyCatalog';

type Props = {
  energiaAtual: number; // 1-10
};

const CardEnergia = ({ energiaAtual }: Props) => {
  const [showInfo, setShowInfo] = useState(false);

  const energiaMedia = Math.round(Math.max(1, Math.min(10, energiaAtual)));
  const energiaDescriptor = getEnergiaDescriptor(energiaMedia);

  const energiaSegments = 5;
  const energiaFill = Math.round((energiaMedia / 10) * energiaSegments);

  return (
    <section
      className="rounded-2xl border border-[#B6D6DF] bg-[#E8F3F5] px-4 py-3 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#1C2541]">Energia</h3>
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
          <p className="font-semibold mb-1">O que é a Energia?</p>
          <p>Seu nível de disposição e vitalidade detectado através das suas conversas. É calculado observando o equilíbrio entre emoções positivas e negativas que você expressa - quanto mais emoções positivas aparecem, maior sua energia. A escala vai de 1 a 10, onde valores menores indicam cansaço e valores maiores indicam alta disposição para ação.</p>
        </motion.div>
      )}

      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center gap-3">
          <div className="relative flex items-center">
            <div
              className="flex h-10 items-center gap-1 rounded-sm border-2 border-[#1C2541] bg-white"
              style={{ padding: '4px 8px' }}
            >
              {Array.from({ length: energiaSegments }).map((_, index) => {
                const filled = index < energiaFill;
                return (
                  <div
                    key={`energia-segment-${index}`}
                    className="h-6 w-4 rounded-[2px]"
                    style={{
                      backgroundColor: filled ? '#16A34A' : 'transparent',
                      border: filled ? 'none' : '1px solid #94A3B8',
                    }}
                  />
                );
              })}
            </div>
            <div
              className="ml-1 h-5 w-1.5 rounded-[2px] bg-[#1C2541]"
            />
          </div>
          <span className="text-base font-semibold leading-none text-[#1F2937]">
            {energiaMedia}
            /10
          </span>
        </div>
        <p className="mt-3 text-center text-[0.8rem] text-[#4B5563]">
          <span className="font-normal text-[0.7rem]">
            Média histórica:
          </span>
          {' '}
          <span className="font-semibold">{energiaDescriptor.titulo}</span>
        </p>
      </div>
    </section>
  );
};

export default CardEnergia;

