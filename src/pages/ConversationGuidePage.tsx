import React, { useEffect } from 'react';
import {
  MessageCircleHeart,
  HeartPulse,
  Compass,
  NotebookPen,
  Sparkles,
  ArrowRightCircle,
  ArrowLeft,
  LayoutDashboard,
  Repeat,
  BrainCircuit,
  Clock3
} from 'lucide-react';

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
      'Painel vivo onde aparecem humor, roda das emoções, PANAS, sabotadores e conquistas sempre que uma sessão é concluída.'
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
      'O ecossistema também conta com automações de interação. Tudo integrado e dinamico para acelerar seu desenvolvimento.'
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
      'Na última mensagem, você receberá o link para acessaar seu painel que já estará atualizado com o resumo da conversa e todos os dados coletados para você explorar e evolir. Após a sessão, há um intervalo de 12h até a próxima rodada.'
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
            Bem-vindo à sua primeira jornada MindQuest
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            O MindQuest é uma plataforma integrada de automações de IA para o seu desenvolvimento pessoal. Aqui você começa pelo Assistente de Reflexão pessoal: cada conversa guiada transforma o que você sente em clareza e ações no dashboard. Use este guia para aproveitar ao máximo esse primeiro passo.
          </p>
        </section>

        <section className="max-w-3xl mx-auto space-y-6 mb-12">
          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-md border border-white/80 bg-white/90">
            <header className="flex items-center gap-3 mb-4">
              <LayoutDashboard className="text-rose-500" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Como o ecossistema MindQuest se conecta</h2>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {ECO_ITEMS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2 mb-2 text-rose-700 font-semibold">
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

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-md border border-white/80 bg-white/90">
            <header className="flex items-center gap-3 mb-4">
              <MessageCircleHeart className="text-rose-500" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Como será a sua primeira conversa</h2>
            </header>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              {CONVERSATION_FLOW.map(({ title, copy }) => (
                <div key={title} className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                  <p className="font-semibold text-rose-700 mb-1">{title}</p>
                  <p className="text-sm">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700 leading-relaxed">
              <strong>Dica:</strong> se pausou a sessão, você tem até 12 horas para retomar do ponto em que parou. Depois disso, abrimos uma nova rodada do zero.
            </div>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-md border border-white/80 bg-white/90">
            <header className="flex items-center gap-3 mb-4">
              <Clock3 className="text-rose-500" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Entenda o ritmo da sessão</h2>
            </header>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <ArrowRightCircle className="text-rose-400 flex-shrink-0 mt-1" size={18} />
                <span>Cada sessão tem até 8 trocas: Você fala 8 vezes o seu Assistente 8 vezes.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-rose-400 flex-shrink-0 mt-1" size={18} />
                <span>O seu Assitente vai te ouvir atentamente e fazer as perguntas guiadas de forma leve e interativa.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-rose-400 flex-shrink-0 mt-1" size={18} />
                <span>Concluir o ciclo garante que o dashboard receba todo o contexto.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-rose-400 flex-shrink-0 mt-1" size={18} />
                <span>Se precisar pausar, você tem até 12 horas para voltar e continuar do ponto onde parou. Passado esse tempo, uma nova sessão começa do zero.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle className="text-rose-400 flex-shrink-0 mt-1" size={18} />
                <span>Assim que as 8 trocas terminam, o sistema atualiza seu Dashboard e faz uma pausa automática de 12 horas antes de liberar a próxima conversa.</span>
              </li>
            </ul>
          </article>

          <article className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-md border border-white/80 bg-white/90">
            <header className="flex items-center gap-3 mb-4">
              <HeartPulse className="text-rose-500" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Explore sentimentos e padrões</h2>
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
              <h2 className="text-xl font-semibold text-slate-900">O que acontece depois da conversa</h2>
            </header>
            <p className="text-slate-600 leading-relaxed mb-4">
              Assim que a última interação é concluída, os especialistas do MindQuest entram em ação e o dashboard ganha novas camadas de clareza:
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {AFTER_CONVERSATION.map((item) => (
                <li key={item} className="flex gap-3">
                  <ArrowRightCircle className="text-rose-400 flex-shrink-0 mt-1" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 leading-relaxed">
              <strong>Exemplo:</strong> “Quero sair com uma ideia clara do próximo passo no trabalho sem sacrificar meu tempo com a família.”
            </div>
          </article>
        </section>

        <section className="max-w-3xl mx-auto rounded-3xl bg-white shadow-md border border-white/80 p-7 sm:p-8 mb-12">
          <header className="flex items-center gap-3 mb-4">
            <NotebookPen className="text-rose-500" size={24} />
            <h2 className="text-xl font-semibold text-slate-900">Não sabe o que dizer? Pode começar com algo assim...</h2>
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
