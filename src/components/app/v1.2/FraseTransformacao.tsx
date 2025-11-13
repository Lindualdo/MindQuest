import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const AREAS_DE_VIDA = ['Carreira', 'Saúde', 'Pessoal', 'Finanças', 'Família'];

const FraseTransformacao = () => {
  const areas = useMemo(() => AREAS_DE_VIDA, []);
  const [indiceAtual, setIndiceAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % areas.length);
    }, 2600);

    return () => clearInterval(intervalo);
  }, [areas.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 text-[0.75rem] sm:text-[0.95rem]"
      style={{ color: '#1C2541' }}
    >
      <p className="font-semibold tracking-tight text-[0.8rem] sm:text-[1rem]">
        Conversas &gt; quests &gt; transformação →
      </p>
      <motion.span
        key={areas[indiceAtual]}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="rounded-full px-3 py-0.5 text-[0.72rem] font-semibold sm:text-[0.9rem]"
        style={{
          backgroundColor: 'rgba(217,3,104,0.08)',
          color: '#D90368',
          boxShadow: 'inset 0 0 0 1px rgba(217,3,104,0.2)',
        }}
      >
        {areas[indiceAtual]}
      </motion.span>
    </motion.div>
  );
};

export default FraseTransformacao;
