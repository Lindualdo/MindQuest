import { ArrowUpRight } from 'lucide-react';
import { getEnergiaDescriptor, getHumorDescriptor } from '@/data/humorEnergyCatalog';
import { useDashboard } from '@/store/useStore';

export type MoodEnergySummary = {
  humorHoje: number; // 1-10
  humorMediaSemana: number; // 1-10
  energiaHoje: number; // 1-10
  energiaMediaSemana: number; // 1-10
};

type Props = {
  summary: MoodEnergySummary;
  onSaberMais?: () => void;
};

const CardMoodEnergy = ({ summary, onSaberMais }: Props) => {
  const { setView } = useDashboard();

  const humorHoje = Math.round(Math.max(1, Math.min(10, summary.humorHoje)));
  const humorMediaSemana = Math.round(
    Math.max(1, Math.min(10, summary.humorMediaSemana)),
  );
  const energiaMediaSemana = Math.round(
    Math.max(1, Math.min(10, summary.energiaMediaSemana)),
  );

  const humorDescriptor = getHumorDescriptor(humorHoje);
  const humorMediaDescriptor = getHumorDescriptor(humorMediaSemana);
  const energiaDescriptor = getEnergiaDescriptor(energiaMediaSemana);

  const gaugeAngle = (Math.PI * humorHoje) / 10;
  const pointerX = 60 - 30 * Math.cos(gaugeAngle);
  const pointerY = 70 - 30 * Math.sin(gaugeAngle);

  const energiaSegments = 5;
  const energiaFillMedia = Math.round((energiaMediaSemana / 10) * energiaSegments);

  const handleViewHistory = () => {
    if (onSaberMais) {
      onSaberMais();
      return;
    }
    setView('humorHistorico');
  };

  return (
    <section className="mq-card rounded-2xl px-4 py-3" style={{ borderRadius: 24 }}>
      <div className="grid items-start gap-4 grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center">
          <p className="text-[0.8rem] font-semibold text-[var(--mq-text)]">
            Meu humor
          </p>
          <div className="mt-2 w-full max-w-[120px]">
            <svg viewBox="0 0 120 80" className="w-full">
              <defs>
                <linearGradient id="humor-gauge-v13" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--mq-success)" />
                  <stop offset="50%" stopColor="var(--mq-warning)" />
                  <stop offset="100%" stopColor="var(--mq-error)" />
                </linearGradient>
              </defs>
              <path
                d="M10 70 A50 50 0 0 1 110 70"
                fill="none"
                stroke="var(--mq-bar)"
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
                    stroke="var(--mq-text-subtle)"
                    strokeWidth={1.5}
                  />
                );
              })}
              <line
                x1={60}
                y1={70}
                x2={pointerX}
                y2={pointerY}
                stroke="var(--mq-text)"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={60} cy={70} r={4} fill="var(--mq-text)" />
            </svg>
          </div>
          <p className="mt-1 text-[0.8rem] font-semibold text-[var(--mq-accent)]">
            Atual: <span className="capitalize">{humorDescriptor.titulo}</span>
          </p>
          <p className="mt-0.5 text-[0.7rem] text-[var(--mq-text-muted)]">
            Humor médio:
            {' '}
            <span className="font-semibold capitalize">
              {humorMediaDescriptor.titulo}
            </span>
          </p>
        </div>

        <div className="flex h-full items-center gap-3">
          <div className="flex h-full flex-col items-center">
            <p className="text-[0.8rem] font-semibold text-[var(--mq-text)]">
              Minha energia
            </p>
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="mt-2 flex flex-col items-center">
                <div className="relative flex items-center">
                  <div
                    className="flex h-7 items-center gap-0.5 rounded-sm border-2 border-[var(--mq-text)] bg-[var(--mq-card)]"
                    style={{ padding: '2px 6px' }}
                  >
                    {Array.from({ length: energiaSegments }).map((_, index) => {
                      const filled = index < energiaFillMedia;
                      return (
                        <div
                          key={`energia-segment-${index}`}
                          className="h-4 w-3 rounded-[2px]"
                          style={{
                            backgroundColor: filled ? 'var(--mq-success)' : 'transparent',
                            border: filled ? 'none' : '1px solid var(--mq-text-subtle)',
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="ml-0.5 h-3 w-1 rounded-[2px] bg-[var(--mq-text)]" />
                </div>
                <p className="mt-1 text-center text-[0.8rem] font-semibold text-[var(--mq-text-muted)]">
                  {energiaDescriptor.titulo}
                </p>
              </div>
            </div>
          </div>
          <span className="text-[0.75rem] font-medium leading-none text-[var(--mq-text)]">
            {energiaMediaSemana}
            /10
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleViewHistory}
          className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[var(--mq-primary)] underline-offset-2 hover:underline"
        >
          Saber mais
          <ArrowUpRight size={12} />
        </button>
      </div>
    </section>
  );
};

export default CardMoodEnergy;
