import { motion } from 'framer-motion';
import { Brain, Heart } from 'lucide-react';

type Props = {
  humorAtual: number;
  humorMedio: number;
  energiaPositiva: number; // 0-100 PANAS positivos
  emocaoDominante: string;
  emocaoDominante2: string;
  sabotadorAtivo: string;
  sabotadorDescricao?: string | null;
  onExplorar?: () => void;
};

const CardPanoramaEmocional = ({
  humorAtual,
  humorMedio,
  energiaPositiva,
  emocaoDominante,
  emocaoDominante2,
  sabotadorAtivo,
  sabotadorDescricao,
  onExplorar,
}: Props) => {
  const safeHumorMedio = Number.isFinite(humorMedio) ? humorMedio : Number(humorMedio) || 0;
  const safeHumorAtual = Number.isFinite(humorAtual) ? humorAtual : Number(humorAtual) || safeHumorMedio;
  const safeEnergiaPositiva = Number.isFinite(energiaPositiva)
    ? energiaPositiva
    : Number(energiaPositiva) || 0;

  const energiaWidth = Math.min(100, Math.max(0, safeEnergiaPositiva));
  const energiaLabel = `${Math.round(energiaWidth)}%`;
  const sabotadorDescricaoTexto =
    sabotadorDescricao?.trim() && sabotadorDescricao.trim().length > 0
      ? sabotadorDescricao.trim()
      : 'Focado em metas e reconhecimento externo, usa sucesso como escudo emocional.';

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mq-card-v1_2 p-5"
      style={{
        backgroundColor: '#F2F6FF',
        borderColor: 'rgba(48,131,220,0.16)',
        boxShadow: '0 16px 28px rgba(48,131,220,0.08)',
      }}
    >
      <div>
        <p className="mq-eyebrow-v1_2 tracking-[0.18em]" style={{ color: '#2A314A' }}>
          Minhas emoções - Visão 360° - Semanal
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white px-4 py-4 flex items-center gap-4" style={{ border: '1px solid rgba(52,199,89,0.3)' }}>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="60" cy="60" r="48" stroke="#E2E8F0" strokeWidth="10" fill="none" strokeLinecap="round" />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="#22C55E"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - safeHumorAtual / 10)}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold text-slate-900">{safeHumorAtual.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Humor atual</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">Média semanal {safeHumorMedio.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3" style={{ border: '1px solid rgba(249,115,22,0.35)' }}>
          <p className="mq-card-meta-v1_2 text-[0.7rem]">Energia média</p>
          <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: '#FDE5D2' }}>
            <div
              className="h-full rounded-full"
              style={{ backgroundColor: '#F97316', width: `${energiaWidth}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-semibold" style={{ color: '#F97316' }}>
            {energiaLabel}
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3" style={{ border: '1px solid rgba(48,131,220,0.25)' }}>
          <p className="mq-card-meta-v1_2 text-[0.7rem]">Emoções dominante</p>
          <div className="mt-2 flex items-center gap-2">
            <Heart size={18} color="#D90368" />
            <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
              {emocaoDominante}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Heart size={18} color="#D90368" />
            <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
              {emocaoDominante2}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3" style={{ border: '1px solid rgba(217,3,104,0.25)' }}>
          <p className="mq-card-meta-v1_2 text-[0.7rem]">Sabotador mais ativo</p>
          <div className="mt-2 flex items-center gap-2">
            <Brain size={18} color="#D90368" />
            <p className="text-sm font-semibold" style={{ color: '#1C2541' }}>
              {sabotadorAtivo}
            </p>
          </div>
          <p className="mt-1 text-xs" style={{ color: '#7E8CA0' }}>
            {sabotadorDescricaoTexto}
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
