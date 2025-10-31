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
import mindquestLogo from '@/img/mindquest_logo_vazado_small.png';
import { palette as landingPalette } from '@/components/landing_start/constants';

const supportPalette = {
  background: landingPalette.surface,
  headerBackground: 'rgba(232, 243, 245, 0.94)',
  headerBorder: 'rgba(28, 37, 65, 0.08)',
  textPrimary: landingPalette.secondary,
  textMuted: landingPalette.muted,
  accent: landingPalette.accent,
  accentText: landingPalette.accent,
  primary: landingPalette.primary,
  chipGradient: 'linear-gradient(90deg, rgba(48,131,220,0.12) 0%, rgba(126,189,194,0.14) 100%)',
  cardBg: '#E8F3F5',
  cardBorder: 'rgba(28, 37, 65, 0.08)',
  cardShadow: landingPalette.shadows.card,
  softSurface: landingPalette.surface,
  calloutBg: 'rgba(217, 3, 104, 0.08)',
  calloutText: landingPalette.primary,
  calloutBorder: 'rgba(217, 3, 104, 0.22)',
  darkSectionBg: landingPalette.secondary,
  darkSectionBorder: 'rgba(28, 37, 65, 0.65)',
  darkSectionText: '#E6EBFF',
  primaryButtonBg: landingPalette.primary,
  primaryButtonText: landingPalette.card,
  secondaryButtonBg: 'rgba(28, 37, 65, 0.85)',
  secondaryButtonBorder: 'rgba(255, 255, 255, 0.16)',
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
    title: 'App. MindQuest',
    description:
      'Painel vivo onde aparecem humor, roda das emoções, histórico de sentimentos (PANAS), histórico de conversas. sabotadores, insights e conquistas sempre que uma sessão é concluída.'
  },
  {
    icon: BrainCircuit,
    title: 'Especialistas em Análise',
    description:
      'Modelos de IA que interpretam a conversa nos bastidores (Sabotadores, Roda das Emoções, PANAS, Big Five) e alimentam o App.'
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
    <div
      className="min-h-screen"
      style={{ background: supportPalette.background }}
    >
      <header
        className="sticky top-0 z-40 backdrop-blur-xl shadow-sm"
        style={{
          borderBottom: `1px solid ${supportPalette.headerBorder}`,
          background: supportPalette.headerBackground,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center gap-3">
              <img
                src={mindquestLogo}
                alt="MindQuest"
                width={44}
                height={44}
                decoding="async"
                className="h-11 w-auto drop-shadow-sm"
              />
              <div>
                <p
                  className="text-xs uppercase tracking-[0.28em] font-semibold"
                  style={{ color: supportPalette.primary }}
                >
                  MindQuest
                </p>
                <p
                  className="text-[0.55rem] uppercase tracking-[0.35em]"
                  style={{ color: supportPalette.textMuted }}
                >
                  Mente clara, resultados reais
                </p>
              </div>
            </div>
            <span
              className="text-xs uppercase tracking-[0.28em] font-semibold"
              style={{ color: supportPalette.textMuted }}
            >
              Versão 1.1.3
            </span>
          </div>
        </div>
      </header>

      <main className="px-4 pb-16 pt-10">
        <section
          className="max-w-5xl mx-auto rounded-3xl shadow-xl border p-8 sm:p-10 mb-12"
          style={{
            background: supportPalette.cardBg,
            borderColor: supportPalette.cardBorder,
            boxShadow: supportPalette.cardShadow,
          }}
        >
          <div
            className="inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              background: supportPalette.chipGradient,
              color: supportPalette.accentText,
            }}
          >
            <Sparkles size={16} />
            Guia rápido · Assistente de Reflexão pessoal
          </div>
          <h2
            className="mt-6 text-3xl sm:text-4xl font-black leading-snug"
            style={{ color: supportPalette.textPrimary }}
          >
            Bem-vindo à sua primeira jornada MindQuest
          </h2>
          <p
            className="mt-4 text-base sm:text-lg leading-relaxed"
            style={{ color: supportPalette.textMuted }}
          >
            O MindQuest é uma plataforma integrada de automações de IA para o seu desenvolvimento pessoal. Aqui você começa pelo Assistente de Reflexão pessoal: cada conversa guiada transforma o que você sente em clareza e ações no dashboard do App. Use este guia para aproveitar ao máximo esse primeiro passo.
          </p>
        </section>

        <section className="max-w-5xl mx-auto space-y-6 mb-12">
          <article
            className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border"
            style={{
              background: supportPalette.cardBg,
              borderColor: supportPalette.cardBorder,
              boxShadow: supportPalette.cardShadow,
            }}
          >
            <header className="flex items-center gap-3 mb-4">
              <LayoutDashboard
                size={24}
                style={{ color: supportPalette.accent }}
              />
              <h3
                className="text-xl font-semibold"
                style={{ color: supportPalette.textPrimary }}
              >
                Como o ecossistema MindQuest se conecta
              </h3>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {ECO_ITEMS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border p-4 text-sm"
                  style={{
                    borderColor: supportPalette.cardBorder,
                    background: supportPalette.softSurface,
                    color: supportPalette.textMuted,
                  }}
                >
                  <div
                    className="flex items-center gap-2 mb-2 font-semibold"
                    style={{ color: '#1C2541' }}
                  >
                    <Icon size={18} />
                    <span>{title}</span>
                  </div>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: supportPalette.textMuted }}
            >
              Este guia foca no Assistente de Reflexão, pois é com ele que você conversa logo após o cadastro. Os outros componentes trabalham juntos em segundo plano — sem que você precise se preocupar com detalhes técnicos.
            </p>
          </article>

          <article
            className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border"
            style={{
              background: supportPalette.cardBg,
              borderColor: supportPalette.cardBorder,
              boxShadow: supportPalette.cardShadow,
            }}
          >
            <header className="flex items-center gap-3 mb-4">
              <MessageCircleHeart
                size={24}
                style={{ color: supportPalette.accent }}
              />
              <h3
                className="text-xl font-semibold"
                style={{ color: supportPalette.textPrimary }}
              >
                Como será a sua primeira conversa
              </h3>
            </header>
            <div
              className="space-y-4 leading-relaxed"
              style={{ color: supportPalette.textMuted }}
            >
              {CONVERSATION_FLOW.map(({ title, copy }) => (
                <div
                  key={title}
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: supportPalette.cardBorder,
                    background: supportPalette.softSurface,
                  }}
                >
                  <p
                    className="font-semibold mb-1"
                    style={{ color: '#1C2541' }}
                  >
                    {title}
                  </p>
                  <p className="text-sm">{copy}</p>
                </div>
              ))}
            </div>
            <div
              className="mt-4 rounded-2xl border p-4 text-sm leading-relaxed"
              style={{
                background: supportPalette.calloutBg,
                color: supportPalette.calloutText,
                borderColor: supportPalette.calloutBorder,
              }}
            >
              <strong>Dica:</strong> se pausou a sessão, você tem até 12 horas para retomar do ponto em que parou. Depois disso, abrimos uma nova rodada do zero.
            </div>
          </article>

          <article
            className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border"
            style={{
              background: supportPalette.cardBg,
              borderColor: supportPalette.cardBorder,
              boxShadow: supportPalette.cardShadow,
            }}
          >
            <header className="flex items-center gap-3 mb-4">
              <Clock3 size={24} style={{ color: supportPalette.accent }} />
              <h3
                className="text-xl font-semibold"
                style={{ color: supportPalette.textPrimary }}
              >
                Entenda o ritmo da sessão
              </h3>
            </header>
            <ul
              className="space-y-3 text-sm"
              style={{ color: supportPalette.textMuted }}
            >
              <li className="flex gap-3">
                <ArrowRightCircle
                  className="flex-shrink-0 mt-1"
                  size={18}
                  style={{ color: supportPalette.accent }}
                />
                <span>Cada sessão tem até 8 trocas: você fala 8 vezes e o Assistente de Reflexão pessoal responde 8 vezes.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle
                  className="flex-shrink-0 mt-1"
                  size={18}
                  style={{ color: supportPalette.accent }}
                />
                <span>O assistente vai te ouvir atentamente e fazer perguntas guiadas de forma leve e interativa.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle
                  className="flex-shrink-0 mt-1"
                  size={18}
                  style={{ color: supportPalette.accent }}
                />
                <span>Concluir o ciclo garante que o dashboard receba todo o contexto.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle
                  className="flex-shrink-0 mt-1"
                  size={18}
                  style={{ color: supportPalette.accent }}
                />
                <span>Se precisar pausar, você tem até 12 horas para voltar e continuar do ponto onde parou. Passado esse tempo, uma nova sessão começa do zero.</span>
              </li>
              <li className="flex gap-3">
                <ArrowRightCircle
                  className="flex-shrink-0 mt-1"
                  size={18}
                  style={{ color: supportPalette.accent }}
                />
                <span>Assim que as 8 trocas terminam, o sistema atualiza seu Dashboard e faz uma pausa automática de 12 horas antes de liberar a próxima conversa.</span>
              </li>
            </ul>
          </article>

          <article
            className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border"
            style={{
              background: supportPalette.cardBg,
              borderColor: supportPalette.cardBorder,
              boxShadow: supportPalette.cardShadow,
            }}
          >
            <header className="flex items-center gap-3 mb-4">
              <HeartPulse
                size={24}
                style={{ color: supportPalette.accent }}
              />
              <h3
                className="text-xl font-semibold"
                style={{ color: supportPalette.textPrimary }}
              >
                Explore sentimentos e padrões
              </h3>
            </header>
            <div
              className="grid sm:grid-cols-2 gap-4 text-sm"
              style={{ color: supportPalette.textMuted }}
            >
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: supportPalette.cardBorder,
                  background: supportPalette.softSurface,
                }}
              >
                <p
                  className="font-semibold mb-1"
                  style={{ color: '#1C2541' }}
                >
                  Emoções e corpo
                </p>
                <p>Conte como seu corpo reage em momentos de tensão ou alegria. Há sinais de cansaço, ansiedade ou entusiasmo?</p>
              </div>
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: supportPalette.cardBorder,
                  background: supportPalette.softSurface,
                }}
              >
                <p
                  className="font-semibold mb-1"
                  style={{ color: '#1C2541' }}
                >
                  Pensamentos repetitivos
                </p>
                <p>Cite narrativas internas que se repetem (“não vou dar conta”, “sempre deixo para depois”).</p>
              </div>
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: supportPalette.cardBorder,
                  background: supportPalette.softSurface,
                }}
              >
                <p
                  className="font-semibold mb-1"
                  style={{ color: '#1C2541' }}
                >
                  Rotina e energia
                </p>
                <p>Diga o que tem ajudado ou drenado sua energia. Pequenas ações que você quer manter ou mudar valem muito.</p>
              </div>
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: supportPalette.cardBorder,
                  background: supportPalette.softSurface,
                }}
              >
                <p
                  className="font-semibold mb-1"
                  style={{ color: '#1C2541' }}
                >
                  Relacionamentos e limites
                </p>
                <p>Compartilhe conversas difíceis, limites que precisa colocar ou vínculos que gostaria de fortalecer.</p>
              </div>
              <div
                className="rounded-2xl border p-4 sm:col-span-2"
                style={{
                  borderColor: supportPalette.cardBorder,
                  background: supportPalette.softSurface,
                }}
              >
                <p
                  className="font-semibold mb-1"
                  style={{ color: '#1C2541' }}
                >
                  Propósito, metas e decisões
                </p>
                <p>Fale sobre objetivos importantes, dúvidas estratégicas ou escolhas que pedem clareza emocional.</p>
              </div>
            </div>
          </article>

          <article
            className="rounded-3xl px-6 py-7 sm:px-8 sm:py-8 shadow-lg border"
            style={{
              background: supportPalette.cardBg,
              borderColor: supportPalette.cardBorder,
              boxShadow: supportPalette.cardShadow,
            }}
          >
            <header className="flex items-center gap-3 mb-4">
              <Compass size={24} style={{ color: supportPalette.accent }} />
              <h3
                className="text-xl font-semibold"
                style={{ color: supportPalette.textPrimary }}
              >
                O que acontece depois da conversa
              </h3>
            </header>
            <p
              className="leading-relaxed mb-4"
              style={{ color: supportPalette.textMuted }}
            >
              Assim que a última interação é concluída, os especialistas do MindQuest entram em ação e o dashboard ganha novas camadas de clareza:
            </p>
            <ul
              className="space-y-2 text-sm"
              style={{ color: supportPalette.textMuted }}
            >
              {AFTER_CONVERSATION.map((item) => (
                <li key={item} className="flex gap-3">
                  <ArrowRightCircle
                    className="flex-shrink-0 mt-1"
                    size={18}
                    style={{ color: supportPalette.accent }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div
              className="mt-4 rounded-2xl border p-4 text-sm leading-relaxed"
              style={{
                background: supportPalette.calloutBg,
                color: supportPalette.calloutText,
                borderColor: supportPalette.calloutBorder,
              }}
            >
              <strong>Exemplo:</strong> “Quero sair com uma ideia clara do próximo passo no trabalho sem sacrificar meu tempo com a família.”
            </div>
          </article>
        </section>

        <section
          className="max-w-5xl mx-auto rounded-3xl shadow-lg border p-7 sm:p-8 mb-12"
          style={{
            background: supportPalette.cardBg,
            borderColor: supportPalette.cardBorder,
            boxShadow: supportPalette.cardShadow,
          }}
        >
          <header className="flex items-center gap-3 mb-4">
            <NotebookPen size={24} style={{ color: supportPalette.accent }} />
            <h3
              className="text-xl font-semibold"
              style={{ color: supportPalette.textPrimary }}
            >
              Não sabe o que dizer? Pode começar com algo assim...
            </h3>
          </header>
          <ul
            className="space-y-3 text-sm"
            style={{ color: supportPalette.textMuted }}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <li key={prompt} className="flex gap-3">
                <ArrowRightCircle
                  className="flex-shrink-0 mt-1"
                  size={18}
                  style={{ color: supportPalette.accent }}
                />
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="max-w-5xl mx-auto rounded-3xl shadow-lg border p-7 sm:p-8 mb-12"
          style={{
            background: supportPalette.cardBg,
            borderColor: supportPalette.cardBorder,
            boxShadow: supportPalette.cardShadow,
          }}
        >
          <header className="flex items-center gap-3 mb-4">
            <MessageCircleHeart
              size={24}
              style={{ color: supportPalette.accent }}
            />
            <h3
              className="text-xl font-semibold"
              style={{ color: supportPalette.textPrimary }}
            >
              Temas que valem explorar
            </h3>
          </header>
          <div
            className="space-y-6 text-sm"
            style={{ color: supportPalette.textMuted }}
          >
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: supportPalette.accent }}
              >
                Emoções e estados internos
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Como o corpo reage em momentos de tensão ou alegria.</li>
                <li>Situações que dispararam ansiedade, frustração, euforia ou cansaço.</li>
                <li>Momentos de orgulho, gratidão ou coragem que merecem ser reforçados.</li>
              </ul>
            </div>
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: supportPalette.accent }}
              >
                Padrões de pensamento
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Narrativas que se repetem (“Nunca vou dar conta”, “Sempre deixo para depois”).</li>
                <li>Crenças sobre si, trabalho, relacionamentos, dinheiro, produtividade.</li>
                <li>Diálogos internos que funcionam como sabotadores (Crítico, Perfeccionista, Controlador, etc.).</li>
              </ul>
            </div>
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: supportPalette.accent }}
              >
                Hábitos e rotinas
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>O que está ajudando a manter equilíbrio (ex.: journaling, exercícios, pausas conscientes).</li>
                <li>O que está drenando energia (uso do celular, hiperfoco sem descanso, alimentação, sono).</li>
                <li>Pequenas ações que gostaria de incorporar na semana.</li>
              </ul>
            </div>
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: supportPalette.accent }}
              >
                Relações e comunicação
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Conversas difíceis que estão pendentes ou pesando.</li>
                <li>Limites que precisam ser colocados (familiares, trabalho, amigos).</li>
                <li>Pessoas que dão suporte emocional e como fortalecer esses vínculos.</li>
              </ul>
            </div>
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: supportPalette.accent }}
              >
                Propósito, metas e decisões
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Objetivos de médio/longo prazo e por que são importantes.</li>
                <li>Dúvidas estratégicas no trabalho ou projetos pessoais.</li>
                <li>Momentos de escolha (ficar, sair, investir, pausar) que pedem clareza emocional.</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="max-w-5xl mx-auto rounded-3xl text-white shadow-xl p-8 sm:p-9 border"
          style={{
            background: supportPalette.darkSectionBg,
            borderColor: supportPalette.darkSectionBorder,
          }}
        >
          <h3 className="text-2xl font-semibold mb-3 text-white">
            Precisa de ajuda extra?
          </h3>
          <p
            className="leading-relaxed"
            style={{ color: supportPalette.darkSectionText }}
          >
            Se algo não estiver claro ou sentir que travou, fale com o suporte MindQuest. Estamos prontos para te enviar um novo link,
            revisar suas permissões ou entender o que está acontecendo.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:suporte@mindquest.pt"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold px-5 py-3 shadow-sm transition"
              style={{
                background: supportPalette.primaryButtonBg,
                color: supportPalette.primaryButtonText,
                boxShadow: '0 14px 32px -18px rgba(217, 3, 104, 0.45)',
              }}
            >
              suporte@mindquest.pt
            </a>
            <a
              href="/?public=1#faq"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold px-5 py-3 transition"
              style={{
                background: supportPalette.secondaryButtonBg,
                border: `1px solid ${supportPalette.secondaryButtonBorder}`,
                color: supportPalette.darkSectionText,
              }}
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
