import React from 'react';

const BENEFITS = [
  {
    title: 'Clareza emocional imediata',
    description:
      'Transforme sentimentos dispersos em métricas visuais que guiam suas decisões com segurança.',
  },
  {
    title: 'Inteligência aplicada',
    description:
      'Detecte sabotadores, gatilhos e padrões ocultos com diagnósticos apoiados por IA e TCC.',
  },
  {
    title: 'Plano evolutivo contínuo',
    description:
      'Receba orientações diárias e missões personalizadas para manter ritmo e energia de execução.',
  },
];

const Benefits: React.FC = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-5xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Resultados que você sente no dia a dia</h2>
        <p className="mt-4 text-base text-slate-500 sm:text-lg">
          Cada conversa com o MindQuest gera dados concretos para orientar foco, energia e ações de alto impacto.
        </p>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8 shadow-sm shadow-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
            <p className="mt-3 text-sm text-slate-500">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
