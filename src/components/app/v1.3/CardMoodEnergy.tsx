

import { getEnergiaDescriptor, getHumorDescriptor } from '@/data/humorEnergyCatalog';

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

const CardMoodEnergy = ({ summary, onVerInsights }: Props) => {
  const humorHoje = Math.round(Math.max(1, Math.min(10, summary.humorHoje)));
  const humorMediaSemana = Math.round(
    Math.max(1, Math.min(10, summary.humorMediaSemana)),
  );
  const energiaMediaSemana = Math.round(
    Math.max(1, Math.min(10, summary.energiaMediaSemana)),
  );

  const humorDescriptor = getHumorDescriptor(humorHoje);
  const energiaDescriptor = getEnergiaDescriptor(energiaMediaSemana);

  const humorLabelHoje = `${humorHoje} - ${humorDescriptor.titulo}`;

  const gaugeAngle = (Math.PI * humorHoje) / 10;
  const pointerX = 60 - 30 * Math.cos(gaugeAngle);
  const pointerY = 70 - 30 * Math.sin(gaugeAngle);

  const energiaSegments = 5;
  const energiaFillMedia = Math.round((energiaMediaSemana / 10) * energiaSegments);

  return (
    <section
      className="rounded-2xl bg-white px-4 py-3 shadow-md"
      style={{ borderRadius: 24, boxShadow: '0 10px 24px rgba(15,23,42,0.08)' }}
    >
      <div className="grid items-start gap-4 grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center">
          <p className="text-[0.8rem] font-semibold text-[#111827]">
            Meu humor
          </p>
          <div className="mt-2 w-full max-w-[140px]">
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
              {humorMediaSemana}
            </span>
          </p>
        </div>

        <div className="flex h-full items-center gap-3">
          <div className="flex h-full flex-col items-center">
            <p className="text-[0.8rem] font-semibold text-[#111827]">
              Minha energia
            </p>
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="mt-2 flex flex-col items-center">
                <div className="relative flex items-center">
                  <div
                    className="flex h-7 items-center gap-0.5 rounded-sm border-2 border-[#1C2541] bg-white"
                    style={{ padding: '2px 6px' }}
                  >
                    {Array.from({ length: energiaSegments }).map((_, index) => {
                      const filled = index < energiaFillMedia;
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <div
                          key={index}
                          className="h-4 w-3 rounded-[2px]"
                          style={{
                            backgroundColor: filled ? '#16A34A' : 'transparent',
                            border: filled ? 'none' : '1px solid #94A3B8',
                          }}
                        />
                      );
                    })}
                  </div>
                  <div
                    className="ml-0.5 h-3 w-1 rounded-[2px] bg-[#1C2541]"
                  />
                </div>
                <p className="mt-1 text-center text-[0.8rem] font-semibold text-[#4B5563]">
                  {energiaDescriptor.titulo}
                </p>
              </div>
            </div>
          </div>
          <span className="text-[0.75rem] font-medium leading-none text-[#1F2937]">
            {energiaMediaSemana}
            /10
          </span>
        </div>
      </div>
    </section>
  );
};

export default CardMoodEnergy;
