import React from 'react';

interface PremiumProps {
  ctaUrl: string;
}

const PREMIUM_FEATURES = [
  'Até 5 sessões diárias com 5 interações cada, em tempo real.',
  'Mentoria ativa com recomendações contextualizadas durante a conversa.',
  'Histórico completo com resumos, transcrições e contramedidas personalizadas.',
  'Acesso prioritário ao time MindQuest para apoio estratégico.',
];

const Premium: React.FC<PremiumProps> = ({ ctaUrl }) => (
  <section className="bg-white py-24">
    <div className="mx-auto max-w-5xl px-6">
      <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-10 shadow-lg shadow-indigo-100">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            MindQuest Premium
          </span>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Mentoria ativa 24/7 ao seu lado</h2>
          <p className="mt-4 text-base text-slate-600">
            Para quem quer ritmo, foco e aceleração. O Premium libera conversas guiadas, histórico completo e acompanhamento humano nas decisões estratégicas.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PREMIUM_FEATURES.map((feature) => (
            <div key={feature} className="flex items-start gap-3 rounded-2xl bg-white/60 p-5 shadow-sm shadow-indigo-100">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white">
                ✓
              </span>
              <p className="text-sm text-slate-600">{feature}</p>
            </div>
          ))}
        </div>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-400"
        >
          Falar com o time
        </a>
      </div>
    </div>
  </section>
);

export default Premium;
