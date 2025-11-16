import { ArrowUpRight } from 'lucide-react';

export type MoodEnergySummary = {
  humorHoje: number; // 1-10
  humorMediaSemana: number; // 1-10
  energiaHoje: number; // 1-10
  energiaMediaSemana: number; // 1-10
};

type Props = {
  summary: MoodEnergySummary;
  onVerInsights?: () => void;
};

const getHumorLabel = (valor: number) => {
  if (valor <= 2) return `${valor} - Muito baixo`;
  if (valor <= 4) return `${valor} - Baixo`;
  if (valor <= 7) return `${valor} - Equilibrado`;
  if (valor <= 9) return `${valor} - Alto`;
  return `${valor} - Muito alto`;
};

const CardMoodEnergy = ({ summary, onVerInsights }: Props) => {
  const humorHoje = Math.max(1, Math.min(10, summary.humorHoje));
  const humorMediaSemana = Math.max(1, Math.min(10, summary.humorMediaSemana));
  const energiaHoje = Math.max(1, Math.min(10, summary.energiaHoje));
  const energiaMediaSemana = Math.max(1, Math.min(10, summary.energiaMediaSemana));

  const humorLabelHoje = getHumorLabel(humorHoje);

  const gaugeAngle = (Math.PI * humorHoje) / 10;
  const pointerX = 60 - 30 * Math.cos(gaugeAngle);
  const pointerY = 70 - 30 * Math.sin(gaugeAngle);

  const energiaSegments = 4;
  const energiaFillHoje = Math.round((energiaHoje / 10) * energiaSegments);

  return (
    <section
      className="rounded-2xl bg-white px-4 py-3 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <p className="text-sm font-semibold text-[#111827]">
        Seu humor hoje/semana
      </p>

      <div className="mt-3 grid gap-4 grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[140px]">
            <svg viewBox="0 0 120 80" className="w-full">
              <defs>
                <linearGradient id="humor-gauge-v13" x1="0%" y1="0%" x2="100%" y2="0%">
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
                stroke="url(#humor-gauge-v13)"
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
          <p className="mt-1 text-[0.8rem] font-semibold text-[#DC2626]">
            {humorLabelHoje}
          </p>
          <p className="mt-0.5 text-[0.7rem] text-[#4B5563]">
            Média da semana:
            {' '}
            <span className="font-semibold">
              {humorMediaSemana.toFixed(1)}
            </span>
          </p>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[0.8rem] font-semibold text-[#111827]">
              Energia
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="flex h-6 items-center gap-0.5 rounded-sm border border-[#1C2541]"
                style={{ padding: '2px 4px' }}
              >
                {Array.from({ length: energiaSegments }).map((_, index) => {
                  const filled = index < energiaFillHoje;
                  return (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className="h-4 w-2 rounded-[2px]"
                      style={{
                        backgroundColor: filled ? '#16A34A' : 'transparent',
                        border: filled ? 'none' : '1px solid #94A3B8',
                      }}
                    />
                  );
                })}
              </div>
              <span className="text-[0.75rem] font-medium text-[#1F2937]">
                {energiaHoje}
                /10 hoje
              </span>
            </div>
            <p className="mt-1 text-[0.7rem] text-[#4B5563]">
              Média da semana:
              {' '}
              <span className="font-semibold">
                {energiaMediaSemana.toFixed(1)}
              </span>
            </p>
          </div>

          {onVerInsights && (
            <button
              type="button"
              onClick={onVerInsights}
              className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[#1C2541] underline underline-offset-2"
            >
              Ver insights
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CardMoodEnergy;

