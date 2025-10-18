import React from 'react';

const STEPS = [
  {
    title: 'Compartilhe o contexto',
    description: 'Conte no WhatsApp o que está acontecendo. Texto ou áudio: tudo vira dado processável.',
  },
  {
    title: 'A IA investiga com você',
    description: 'Perguntas poderosas ajudam a mapear sabotadores, emoções e necessidades reais.',
  },
  {
    title: 'Receba o insight estruturado',
    description: 'O MindQuest entrega resumo, gatilhos identificados e impacto emocional.',
  },
  {
    title: 'Aja com confiança',
    description: 'Missões personalizadas e contramedidas para aplicar imediatamente.',
  },
];

const HowItWorks: React.FC = () => (
  <section className="bg-slate-950 py-24 text-white">
    <div className="mx-auto max-w-5xl px-6">
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-200">
          Como funciona
        </span>
        <h2 className="mt-6 text-3xl font-bold sm:text-4xl">Uma jornada guiada do caos à clareza</h2>
        <p className="mt-4 text-base text-indigo-100">
          Cada etapa foi desenhada para transformar emoções em ações práticas, sem perder o ritmo.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {STEPS.map((step, index) => (
          <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
            <div className="flex items-center justify-between text-sm font-semibold text-indigo-200">
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest">
                Passo {index + 1}
              </span>
              <span className="text-indigo-100/70">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm text-indigo-100">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
