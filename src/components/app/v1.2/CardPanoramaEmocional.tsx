import { motion } from 'framer-motion';
import { Brain, Heart } from 'lucide-react';

type Props = {
  humorAtual: number;
  humorMedio: number;
  energiaPositiva: number; // 0-100 PANAS positivos
  emocaoDominante: string;
  sabotadorAtivo: string;
  onExplorar?: () => void;
};

const CardPanoramaEmocional = ({
  humorAtual,
  humorMedio,
  energiaPositiva,
  emocaoDominante,
  sabotadorAtivo,
  onExplorar,
}: Props) => {
  const energiaWidth = Math.min(100, Math.max(0, energiaPositiva));
  const humorPercent = Math.min(100, Math.max(0, (humorAtual / 10) * 100));
  const gaugeDegrees = (humorPercent / 100) * 360;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl border p-5"
      style={{
        background: 'linear-gradient(135deg, #F5EBF3 0%, #E8F3F5 45%, #FFFFFF 100%)',
        borderColor: 'rgba(28,37,65,0.08)',
        boxShadow: '0 20px 40px rgba(28,37,65,0.12)',
      }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: '#7E8CA0' }}>
          visão 360° emocional
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4" style={{ border: '1px solid rgba(52,199,89,0.25)' }}>
          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(#34C759 0deg ${gaugeDegrees}deg, #E2E8F0 ${gaugeDegrees}deg 360deg)` }}
          >
            <div className="h-16 w-16 rounded-full bg-white" />
            <span className="absolute text-lg font-semibold" style={{ color: '#1C2541' }}>
              {humorAtual.toFixed(1)}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#7E8CA0' }}>
              Humor atual
            </p>
            <p className="text-sm" style={{ color: '#1C2541' }}>
              Média semanal {humorMedio.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3" style={{ border: '1px solid rgba(249,115,22,0.25)' }}>
          <p className="text-xs font-medium" style={{ color: '#7E8CA0' }}>
            Energia
          </p>
          <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: '#FDE5D2' }}>
            <div
              className="h-full rounded-full"
              style={{ backgroundColor: '#F97316', width: `${energiaWidth}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-semibold" style={{ color: '#F97316' }}>
            {energiaWidth}%
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3" style={{ border: '1px solid rgba(48,131,220,0.2)' }}>
          <p className="text-xs font-medium" style={{ color: '#7E8CA0' }}>
            Emoção dominante
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Heart size={18} color="#D90368" />
            <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
              {emocaoDominante}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3" style={{ border: '1px solid rgba(217,3,104,0.2)' }}>
          <p className="text-xs font-medium" style={{ color: '#7E8CA0' }}>
            Sabotador ativo
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Brain size={18} color="#D90368" />
            <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
              {sabotadorAtivo}
            </p>
          </div>
          <p className="mt-1 text-xs" style={{ color: '#7E8CA0' }}>
            Focado em metas e reconhecimento externo, usa sucesso como escudo emocional.
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onExplorar} className="mq-link-inline-v1_2 text-[0.8rem]">
          Explorar emoções <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.section>
  );
};

export default CardPanoramaEmocional;
