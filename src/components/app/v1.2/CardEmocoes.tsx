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
  const clampedHumorAtual = Math.max(0, Math.min(10, safeHumorAtual));
  const pointerAngle = (Math.PI * clampedHumorAtual) / 10;
  const pointerX = 60 - 30 * Math.cos(pointerAngle);
  const pointerY = 70 - 30 * Math.sin(pointerAngle);
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
            <div className="relative" style={{ width: '102px' }}>
              <svg viewBox="0 0 120 80" className="w-full">
                <defs>
                  <linearGradient id="humor-gauge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F87171" />
                    <stop offset="35%" stopColor="#F97316" />
                    <stop offset="70%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
                <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke="#E2E8F0" strokeWidth={10} strokeLinecap="round" />
                <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke="url(#humor-gauge)" strokeWidth={10} strokeLinecap="round" />
                {[0, 5, 10].map((value) => {
                  const angle = (Math.PI * value) / 10;
                  const x1 = 60 - 35 * Math.cos(angle);
                  const y1 = 70 - 35 * Math.sin(angle);
                  const x2 = 60 - 42 * Math.cos(angle);
                  const y2 = 70 - 42 * Math.sin(angle);
                  return <line key={value} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth={1.5} />;
                })}
                {Number.isFinite(safeHumorAtual) && (
                  <>
                    <line x1={60} y1={70} x2={pointerX} y2={pointerY} stroke="#16A34A" strokeWidth={3} strokeLinecap="round" />
                    <circle cx={60} cy={70} r={4} fill="#16A34A" />
                  </>
                )}
              </svg>
            </div>
            <div>
              <p className="mq-card-meta-v1_2 text-[0.7rem] text-slate-500">
                Humor atual <span className="font-semibold text-slate-900">{safeHumorAtual.toFixed(1)}</span>
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1">Média semanal {safeHumorMedio.toFixed(1)}</p>
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
