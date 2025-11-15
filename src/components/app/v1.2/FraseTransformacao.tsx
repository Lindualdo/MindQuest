import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const AREAS_DE_VIDA = ['Carreira', 'Saúde', 'Pessoal', 'Finanças', 'Família'];

type Props = {
  floating?: boolean;
};

const FraseTransformacao = ({ floating = false }: Props) => {
  const areas = useMemo(() => AREAS_DE_VIDA, []);
  const [indiceAtual, setIndiceAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % areas.length);
    }, 2600);

    return () => clearInterval(intervalo);
  }, [areas.length]);

  const floatingWrapperStyle = floating
    ? {
        position: 'relative' as const,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: '0.4rem',
      }
    : undefined;

  return (
    <div className={floating ? 'w-full' : undefined} style={floatingWrapperStyle}>
      <motion.div
        initial={{ opacity: 0, y: floating ? -2 : -6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] sm:text-[0.82rem] ${
          floating ? 'shadow-lg shadow-rose-100/70 backdrop-blur pointer-events-auto' : ''
        }`}
        style={{
          color: '#1C2541',
          backgroundColor: floating ? 'rgba(255,255,255,0.92)' : 'rgba(28,37,65,0.06)',
          boxShadow: floating
            ? 'inset 0 0 0 1px rgba(217,3,104,0.2)'
            : 'inset 0 0 0 1px rgba(28,37,65,0.08)',
        }}
      >
        <span className="font-semibold tracking-tight">Conversas → Quests → Transformação →</span>
        <motion.span
          key={areas[indiceAtual]}
          initial={{ opacity: 0, y: floating ? 8 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          className="rounded-full px-2 py-0.5 text-[0.7rem] font-semibold sm:text-[0.8rem]"
          style={{
            backgroundColor: 'rgba(217,3,104,0.15)',
            color: '#D90368',
            boxShadow: 'inset 0 0 0 1px rgba(217,3,104,0.25)',
          }}
        >
          {areas[indiceAtual]}
        </motion.span>
      </motion.div>
    </div>
  );
};

export default FraseTransformacao;
