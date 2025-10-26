import React, { useEffect } from 'react';
import {
  MessageCircleHeart,
  HeartPulse,
  Compass,
  NotebookPen,
  Sparkles,
  ArrowRightCircle,
  LayoutDashboard,
  Repeat,
  BrainCircuit,
  Clock3
} from 'lucide-react';

const supportPalette = {
  background: 'bg-slate-200',
  card: 'bg-white',
  accent: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  textPrimary: 'text-slate-900',
  textMuted: 'text-slate-600',
};

const QUICK_PROMPTS = [
  'Como você se sentiu na última vez que realmente descansou?',
  'Teve algo nos últimos dias que te deixou orgulhoso ou incomodado?',
  'Se pudesse mudar apenas uma coisa hoje, qual seria?',
  'Existe algum pensamento repetitivo que está te travando?',
  'Qual foi o momento mais carregado de emoção nesta semana?',
];

const ECO_ITEMS = [
  {
    icon: MessageCircleHeart,
    title: 'Assistente de Reflexão pessoal',
    description:
      'Você está falando com ele agora. Conversa guiada que transforma emoções e pensamentos em dados estruturados para o seu progresso.'
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard MindQuest',
    description:
      'Painel vivo onde aparecem humor, roda das emoções, histórico de sentimentos (PANAS), histórico de conversas. sabotadores, insights e conquistas sempre que uma sessão é concluída.'
  },
  {
    icon: BrainCircuit,
    title: 'Especialistas em Análise',
    description:
      'Modelos de IA que interpretam a conversa nos bastidores (Sabotadores, Roda das Emoções, PANAS, Big Five) e alimentam o dashboard.'
  },
  {
    icon: Repeat,
    title: 'Outros Assistentes',
    description:
      'O ecossistema também conta com automações e interação. Tudo integrado e dinâmico para acelerar seus resultados.'
  }
];

const CONVERSATION_FLOW = [
  {
    title: 'Chegue como está',
    copy:
      'Compartilhe no seu ritmo o que está pulsando hoje: uma emoção forte, um desafio, um sonho ou algo que quer destravar.'
  },
  {
    title: 'Explore junto com a IA',
    copy:
      'O Assistente de Reflexão pessoal faz até 8 trocas com você. Fale sobre emoções, pensamentos, rotinas e contextos para que a conversa fique rica e pessoal. Reflita com calma sobre cada pergunta — elas ajudam a revelar o que sua mente quer te mostrar.'
  },
  {
    title: 'Valide e ajuste',
    copy:
      'Na penúltima interação você recebe um espelho do que foi ouvido. Corrija, complemente ou destaque o que for essencial.'
  },
  {
    title: 'Conversa concluída',
    copy:
      'Na última mensagem, você recebe o link para acessar o dashboard já atualizado com o resumo da conversa e todos os dados coletados. Após a sessão, há um intervalo de 12h até a próxima rodada.'
  }
];

const AFTER_CONVERSATION = [
  'Resumo estruturado da conversa com destaques dos pontos principais.',
  'Atualização do seu humor, roda das emoções, PANAS e sabotador ativo.',
  'Conquistas e XP ajustados conforme sua evolução.',
  'Insights práticos para transformar clareza em ação no dia a dia.'
];

const ConversationGuidePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Guia de Conversa • MindQuest';
  }, []);

  return (
    <div className={`min-h-screen ${supportPalette.background}`}>
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center gap-3">
              <svg
                width={44}
                height={44}
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="drop-shadow-sm"
              >
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6b5cff" />
                    <stop offset="1" stopColor="#0fc7d8" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" fill="url(#logo-gradient)" />
                <path d="M50 20 L74 50 L50 80 L26 50 Z" fill="#ffffff" />
              </svg>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-indigo-500 font-semibold">
                  MindQuest
                </p>
                <p className="text-[0.55rem] uppercase tracking-[0.35em] text-slate-400">
                  Mente clara, resultados reais
                </p>
              </div>
            </div>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-400 font-semibold">
              Versão 1.1.3
            </span>
          </div>
        </div>
      </header>

      <main className="px-4 pb-16 pt-10">
        <section className="max-w-5xl mx-auto rounded-3xl shadow-xl border border-slate-200 bg-white p-8 sm:p-10 mb-12">
          <div className="inline-flex items-center gap-3 rounded-full px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={16} />
            Guia rápido · Assistente de Reflexão pessoal
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-black leading-snug text-slate-900">
            Bem-vindo à sua primeira jornada MindQuest
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            O MindQuest é uma plataforma integrada de automações de IA para o seu desenvolvimento pessoal. Aqui você começa pelo Assistente de Reflexão pessoal: cada conversa guiada transforma o que você sente em clareza e ações no dashboard. Use este guia para aproveitar ao máximo esse primeiro passo.
          </p>
        </section>

        <section className="max-w-5xl mx-auto space-y-6 mb-12">
          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border border-slate-200 bg-white">
            <header className="flex items-center gap-3 mb-4">
              <LayoutDashboard className="text-indigo-500" size={24} />
              <h3 className="text-xl font-semibold text-slate-900">Como o ecossistema MindQuest se conecta</h3>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {ECO_ITEMS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold">
                    <Icon size={18} />
                    <span>{title}</span>
                  </div>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Este guia foca no Assistente de Reflexão, pois é com ele que você conversa logo após o cadastro. Os outros componentes trabalham juntos em segundo plano — sem que você precise se preocupar com detalhes técnicos.
            </p>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border border-slate-200 bg-white">
            <header className="flex items-center gap-3 mb-4">
              <MessageCircleHeart className="text-indigo-500" size={24} />
              <h3 className="text-xl font-semibold text-slate-900">Como será a sua primeira conversa</h3>
            </header>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              {CONVERSATION_FLOW.map(({ title, copy }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="font-semibold text-indigo-600 mb-1">{title}</p>
                  <p className="text-sm">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-sm text-indigo-700 leading-relaxed">
              <strong>Dica:</strong> se pausou a sessão, você tem até 12 horas para retomar do ponto em que parou. Depois disso, abrimos uma nova rodada do zero.
            </div>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border border-slate-200 bg-white">
            <header className="flex items-center gap-3 mb-4">
              <Clock3 className="text-indigo-500" size={24} />
              <h3 className="text-xl font-semibold text-slate-900">Entenda o ritmo da sessão</h3>
            </header>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <ArrowRightCircle className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                <span>Cada sessão tem até 8 trocas: você fala 8 vezes e o Assistente de Reflexão pessoal responde 8 vezes.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                <span>O assistente vai te ouvir atentamente e fazer perguntas guiadas de forma leve e interativa.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                <span>Concluir o ciclo garante que o dashboard receba todo o contexto.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                <span>Se precisar pausar, você tem até 12 horas para voltar e continuar do ponto onde parou. Passado esse tempo, uma nova sessão começa do zero.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                <span>Assim que as 8 trocas terminam, o sistema atualiza seu Dashboard e faz uma pausa automática de 12 horas antes de liberar a próxima conversa.</span>
              </li>
            </ul>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border border-slate-200 bg-white">
            <header className="flex items-center gap-3 mb-4">
              <HeartPulse className="text-indigo-500" size={24} />
              <h3 className="text-xl font-semibold text-slate-900">Explore sentimentos e padrões</h3>
            </header>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="font-semibold text-indigo-600 mb-1">Emoções e corpo</p>
                <p>Conte como seu corpo reage em momentos de tensão ou alegria. Há sinais de cansaço, ansiedade ou entusiasmo?</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="font-semibold text-indigo-600 mb-1">Pensamentos repetitivos</p>
                <p>Cite narrativas internas que se repetem (“não vou dar conta”, “sempre deixo para depois”).</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="font-semibold text-indigo-600 mb-1">Rotina e energia</p>
                <p>Diga o que tem ajudado ou drenado sua energia. Pequenas ações que você quer manter ou mudar valem muito.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="font-semibold text-indigo-600 mb-1">Relacionamentos e limites</p>
                <p>Compartilhe conversas difíceis, limites que precisa colocar ou vínculos que gostaria de fortalecer.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:col-span-2">
                <p className="font-semibold text-indigo-600 mb-1">Propósito, metas e decisões</p>
                <p>Fale sobre objetivos importantes, dúvidas estratégicas ou escolhas que pedem clareza emocional.</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border border-slate-200 bg-white">
            <header className="flex items-center gap-3 mb-4">
              <Compass className="text-indigo-500" size={24} />
              <h3 className="text-xl font-semibold text-slate-900">O que acontece depois da conversa</h3>
            </header>
            <p className="text-slate-600 leading-relaxed mb-4">
              Assim que a última interação é concluída, os especialistas do MindQuest entram em ação e o dashboard ganha novas camadas de clareza:
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {AFTER_CONVERSATION.map((item) => (
                <li key={item} className="flex gap-3">
                  <ArrowRightCircle className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700 leading-relaxed">
              <strong>Exemplo:</strong> “Quero sair com uma ideia clara do próximo passo no trabalho sem sacrificar meu tempo com a família.”
            </div>
          </article>
        </section>

        <section className="max-w-5xl mx-auto rounded-3xl bg-white shadow-lg border border-slate-200 p-7 sm:p-8 mb-12">
          <header className="flex items-center gap-3 mb-4">
            <NotebookPen className="text-indigo-500" size={24} />
            <h3 className="text-xl font-semibold text-slate-900">Não sabe o que dizer? Pode começar com algo assim...</h3>
          </header>
          <ul className="space-y-3 text-sm text-slate-600">
            {QUICK_PROMPTS.map((prompt) => (
              <li key={prompt} className="flex gap-3">
                <ArrowRightCircle className="text-indigo-400 flex-shrink-0 mt-1" size={18} />
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-5xl mx-auto rounded-3xl bg-white shadow-lg border border-slate-200 p-7 sm:p-8 mb-12">
          <header className="flex items-center gap-3 mb-4">
            <MessageCircleHeart className="text-indigo-500" size={24} />
            <h3 className="text-xl font-semibold text-slate-900">Temas que valem explorar</h3>
          </header>
          <div className="space-y-6 text-sm text-slate-600">
            <div>
              <h4 className="font-semibold text-indigo-600 mb-2">Emoções e estados internos</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Como o corpo reage em momentos de tensão ou alegria.</li>
                <li>Situações que dispararam ansiedade, frustração, euforia ou cansaço.</li>
                <li>Momentos de orgulho, gratidão ou coragem que merecem ser reforçados.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-600 mb-2">Padrões de pensamento</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Narrativas que se repetem (“Nunca vou dar conta”, “Sempre deixo para depois”).</li>
                <li>Crenças sobre si, trabalho, relacionamentos, dinheiro, produtividade.</li>
                <li>Diálogos internos que funcionam como sabotadores (Crítico, Perfeccionista, Controlador, etc.).</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-600 mb-2">Hábitos e rotinas</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>O que está ajudando a manter equilíbrio (ex.: journaling, exercícios, pausas conscientes).</li>
                <li>O que está drenando energia (uso do celular, hiperfoco sem descanso, alimentação, sono).</li>
                <li>Pequenas ações que gostaria de incorporar na semana.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-600 mb-2">Relações e comunicação</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Conversas difíceis que estão pendentes ou pesando.</li>
                <li>Limites que precisam ser colocados (familiares, trabalho, amigos).</li>
                <li>Pessoas que dão suporte emocional e como fortalecer esses vínculos.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-600 mb-2">Propósito, metas e decisões</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Objetivos de médio/longo prazo e por que são importantes.</li>
                <li>Dúvidas estratégicas no trabalho ou projetos pessoais.</li>
                <li>Momentos de escolha (ficar, sair, investir, pausar) que pedem clareza emocional.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white shadow-xl p-8 sm:p-9 border border-slate-800">
          <h3 className="text-2xl font-semibold mb-3 text-white">Precisa de ajuda extra?</h3>
          <p className="text-slate-200 leading-relaxed">
            Se algo não estiver claro ou sentir que travou, fale com o suporte MindQuest. Estamos prontos para te enviar um novo link,
            revisar suas permissões ou entender o que está acontecendo.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:suporte@mindquest.pt"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-900 font-semibold px-5 py-3 shadow-sm hover:bg-slate-100 transition"
            >
              suporte@mindquest.pt
            </a>
            <a
              href="/?public=1#faq"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-800 font-semibold px-5 py-3 hover:bg-slate-700 transition"
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
