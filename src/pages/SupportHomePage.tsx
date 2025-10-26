import React, { useEffect } from 'react';
import { LayoutGrid, Sparkles, ArrowRight } from 'lucide-react';

const SupportHomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Suporte MindQuest • Dicas e Orientações';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <header className="px-4 py-8 sm:py-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 rounded-full bg-amber-100 px-4 py-2 text-amber-600 text-xs font-semibold uppercase tracking-[0.3em]">
          <Sparkles size={16} />
          Suporte MindQuest
        </div>
        <h1 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          Guia de apoio para suas jornadas com o MindQuest
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Aqui você encontra orientações rápidas, dicas práticas e materiais que ajudam a tirar o máximo
          das conversas guiadas por IA. Novos conteúdos serão adicionados continuamente.
        </p>
      </header>

      <main className="px-4 pb-16">
        <section className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <LayoutGrid className="text-rose-500" size={22} />
            <h2 className="text-xl font-semibold text-slate-900">Destaques recentes</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <a
              href="/suporte/conversation-guide"
              className="group flex flex-col rounded-3xl border border-white bg-white/90 shadow-lg overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-40 sm:h-48 w-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-300 uppercase text-xs font-semibold tracking-[0.3em]">
                  Espaço para imagem
                </span>
              </div>
              <div className="flex flex-col flex-1 px-6 py-5 sm:px-7 sm:py-6">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                  Guia rápido para aproveitar melhor a sua reflexão guiada por IA
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                  Passo a passo para iniciar a conversa, explorar emoções e sair com clareza prática.
                  Ideal para quem está começando ou quer tornar as sessões mais profundas.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-rose-500 group-hover:text-rose-600 transition">
                  Acessar conteúdo
                  <ArrowRight size={16} />
                </span>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupportHomePage;
