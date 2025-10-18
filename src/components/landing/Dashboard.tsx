import React from 'react';

interface DashboardProps {
  ctaUrl: string;
}

const Dashboard: React.FC<DashboardProps> = ({ ctaUrl }) => (
  <section id="dashboard" className="bg-slate-950 py-24 text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row">
      <div className="lg:w-1/2">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest">
          Dashboard MindQuest
        </span>
        <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
          Tudo o que você sente em uma visão tática
        </h2>
        <p className="mt-4 text-base text-indigo-100">
          Acompanhe humor, energia, sabotadores e ações recomendadas em tempo real. Cada insight é gerado a partir das suas conversas e traduzido em próximos passos.
        </p>
        <ul className="mt-8 space-y-4 text-sm text-indigo-100">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
            Histórico completo das conversas com indicadores emocionais e testes PANAS.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
            Identificação automática do sabotador ativo e contramedidas sugeridas.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
            Missões diárias e streak de conversas para manter disciplina e consistência.
          </li>
        </ul>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-400"
        >
          Acessar agora
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="space-y-5 text-sm text-indigo-100/90">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-xs uppercase tracking-widest text-indigo-200">Resumo inteligente</p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                “Você concluiu 4 conversas esta semana. Seu sabotador Vigilante esteve ativo em 2 delas.”
              </h3>
            </div>
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-indigo-200">Humor & energia</p>
              <p>
                Humor atual: <span className="font-semibold text-white">7.0</span> — Energia média: <span className="font-semibold text-white">6.6</span>
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-indigo-200">Próxima ação</p>
              <p>
                Reforce o ritual matinal de clareza e responda ao insight “Estruture a revisão semanal em 3 blocos”.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Dashboard;
