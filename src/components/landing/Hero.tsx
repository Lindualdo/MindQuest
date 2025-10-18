import React from 'react';

interface HeroProps {
  ctaUrl: string;
}

const Hero: React.FC<HeroProps> = ({ ctaUrl }) => (
  <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
    <div className="absolute inset-0">
      <div className="absolute -top-32 -left-10 h-64 w-64 rounded-full bg-indigo-500/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
    </div>

    <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-24 pt-32 text-center lg:flex-row lg:text-left">
      <div className="space-y-6 lg:w-3/5">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-200 backdrop-blur">
          Inteligência Emocional Assistida por IA
        </span>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          Transforme dispersão em clareza estratégica
        </h1>
        <p className="text-base text-indigo-100 sm:text-lg">
          Acompanhe humor, energia e sabotadores em tempo real, com orientações práticas que
          convertem emoções em resultados concretos.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-400"
          >
            Começar agora
          </a>
          <a
            href="#dashboard"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-wide transition hover:border-white/40 hover:text-white"
          >
            Ver o dashboard
          </a>
        </div>
      </div>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-100">
            Relatórios que conversam com suas decisões
          </h2>
          <p className="text-sm text-indigo-200">
            Sínteses automáticas mostram emoções, energia, sabotadores e próximos passos em uma
            linha do tempo fácil de entender.
          </p>
          <ul className="space-y-3 text-left text-sm text-indigo-100">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
              Conversas resumidas com contexto emocional e recomendações imediatas.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400" />
              Streak de conversas, missões dinâmicas e regulação emocional diária.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
              Painel atualizado automaticamente a cada interação com a IA.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
