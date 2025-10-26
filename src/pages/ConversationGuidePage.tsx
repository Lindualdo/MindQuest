import React, { useEffect } from 'react';
import { MessageCircleHeart, HeartPulse, Compass, NotebookPen, Sparkles, ArrowRightCircle, ArrowLeft } from 'lucide-react';

const supportPalette = {
  background: 'bg-gradient-to-b from-rose-50 via-white to-rose-100',
  card: 'bg-white/90',
  accent: 'bg-gradient-to-r from-rose-500 to-orange-400',
  textPrimary: 'text-slate-900',
  textMuted: 'text-slate-600',
};

const QUICK_PROMPTS = [
  'Como você está se sentindo agora? O que provocou essa sensação?',
  'Qual foi o momento que mais mexeu com você nesta semana?',
  'Que pensamento repetitivo está te travando hoje?',
  'O que você quer sentir ao final desta conversa?',
  'Se pudesse mudar uma coisa nas próximas 24h, qual seria?',
];

const ConversationGuidePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Guia de Conversa • Suporte MindQuest';
  }, []);

  return (
    <div className={`min-h-screen ${supportPalette.background}`}>
      <section className="py-6 px-4 max-w-3xl mx-auto">
        <a
          href="/suporte"
          className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition"
        >
          <ArrowLeft size={16} />
          Voltar para o Suporte
        </a>
      </section>

      <main className="px-4 pb-16">
        <section className="max-w-3xl mx-auto rounded-3xl shadow-lg border border-white/60 backdrop-blur-lg p-8 sm:p-10 mb-12">
          <div className="inline-flex items-center gap-3 rounded-full px-4 py-2 bg-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={16} />
            Guia Início Rápido
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl font-black leading-snug text-slate-900">
            Como abrir sua conversa com o Mentor MindQuest
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Este guia mostra, em poucos passos, como aproveitar suas sessões de mentoria emocional.
            Siga as etapas para contar o que está acontecendo, explorar sentimentos e sair com clareza prática.
          </p>
        </section>

        <section className="max-w-3xl mx-auto space-y-6 mb-12">
          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-md border border-white/80 bg-white/90">
            <header className="flex items-center gap-3 mb-4">
              <MessageCircleHeart className="text-rose-500" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">1. Conte como você está chegando</h2>
            </header>
            <p className="text-slate-600 leading-relaxed">
              Explique em poucas linhas como está se sentindo e o que trouxe você para a conversa:
              algo que deu certo, algo que saiu do esperado ou uma dúvida que quer destravar.
            </p>
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700 leading-relaxed">
              <strong>Exemplo:</strong> “Hoje acordei travado para começar o dia. Acho que tem a ver com a pressão das metas.
              Pode me ajudar a entender o que está acontecendo?”
            </div>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-md border border-white/80 bg-white/90">
            <header className="flex items-center gap-3 mb-4">
              <HeartPulse className="text-rose-500" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">2. Explore sentimentos e padrões</h2>
            </header>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                <p className="font-semibold text-rose-700 mb-1">Emoções e corpo</p>
                <p>Conte como seu corpo reage em momentos de tensão ou alegria. Há sinais de cansaço, ansiedade ou entusiasmo?</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                <p className="font-semibold text-rose-700 mb-1">Pensamentos repetitivos</p>
                <p>Cite narrativas internas que se repetem (“não vou dar conta”, “sempre deixo para depois”).</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                <p className="font-semibold text-rose-700 mb-1">Rotina e energia</p>
                <p>Diga o que tem ajudado ou drenado sua energia. Pequenas ações que você quer manter ou mudar valem muito.</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                <p className="font-semibold text-rose-700 mb-1">Relacionamentos e limites</p>
                <p>Compartilhe conversas difíceis, limites que precisa colocar ou vínculos que gostaria de fortalecer.</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-md border border-white/80 bg-white/90">
            <header className="flex items-center gap-3 mb-4">
              <Compass className="text-rose-500" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">3. Defina o que quer levar da sessão</h2>
            </header>
            <p className="text-slate-600 leading-relaxed">
              Diga qual clareza, sensação ou ação espera ao final da conversa. Pode ser organizar a semana,
              tomar uma decisão ou renovar a energia para projetos importantes.
            </p>
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 leading-relaxed">
              “Quero sair com uma ideia clara do próximo passo no trabalho sem sacrificar meu tempo com a família.”
            </div>
          </article>
        </section>

        <section className="max-w-3xl mx-auto rounded-3xl bg-white shadow-md border border-white/80 p-7 sm:p-8 mb-12">
          <header className="flex items-center gap-3 mb-4">
            <NotebookPen className="text-rose-500" size={24} />
            <h2 className="text-xl font-semibold text-slate-900">Não sabe o que dizer? Experimente uma dessas perguntas</h2>
          </header>
          <ul className="space-y-3 text-sm text-slate-600">
            {QUICK_PROMPTS.map((prompt) => (
              <li key={prompt} className="flex gap-3">
                <ArrowRightCircle className="text-rose-400 flex-shrink-0 mt-1" size={18} />
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-3xl mx-auto rounded-3xl bg-rose-600 text-white shadow-lg p-8 sm:p-9">
          <h2 className="text-2xl font-semibold mb-3">Precisa de ajuda extra?</h2>
          <p className="text-rose-50 leading-relaxed">
            Se algo não estiver claro ou sentir que travou, fale com o suporte MindQuest. Estamos prontos para te enviar um novo link,
            revisar suas permissões ou entender o que está acontecendo.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:suporte@mindquest.pt"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-rose-600 font-semibold px-5 py-3 shadow-sm hover:bg-rose-50 transition"
            >
              suporte@mindquest.pt
            </a>
            <a
              href="/?public=1#faq"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-rose-500/30 border border-white/40 font-semibold px-5 py-3 hover:bg-rose-500/40 transition"
            >
              Ver outras dúvidas
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ConversationGuidePage;
