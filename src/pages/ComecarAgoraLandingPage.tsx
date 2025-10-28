import React, { useEffect } from 'react';
import { Brain, MessageSquare, Target, Sparkles, Shield, Zap, ArrowRight, Quote } from 'lucide-react';
import { WHATSAPP_URL } from '@/constants/whatsapp';

const palette = {
  surface: '#E1D8CC',
  card: '#FFFFFF',
  primary: '#F7AB8A',
  secondary: '#A2846C',
  accent: '#FF9B71',
  footer: '#1A242F',
  muted: '#5B6475',
  stroke: 'rgba(47, 63, 80, 0.14)',
  soft: '#EBD3C0',
  warmSurface: '#EBD3C0'
};

const PAIN_POINTS = [
  {
    title: 'Muitas ideias no papel, mas trava na hora de agir',
    description: 'O perfeccionismo paralisa antes mesmo de começar.'
  },
  {
    title: 'Começa vários projetos empolgado, mas raramente termina algo',
    description: 'A energia inicial se perde no meio do caminho.'
  },
  {
    title: 'Sente que merece mais da vida, mas os resultados não aparecem',
    description: 'Mesmo trabalhando duro, algo parece estar faltando.'
  },
  {
    title: 'Se cobra o tempo todo, mas quase nunca se sente satisfeito',
    description: 'A autocrítica constante rouba o prazer das conquistas.'
  },
  {
    title: 'Quer agradar todo mundo e acaba se esgotando',
    description: 'Dizer não parece impossível, até você colapsar.'
  },
  {
    title: 'Pensa demais e age de menos',
    description: 'Sua mente vira uma prisão de análises infinitas sem saída prática.'
  }
];

const INSIGHT_POINTS = [
  'Sua mente não é o problema — ela só está tentando te proteger de formas que não funcionam mais.',
  'O MindQuest não te ensina a ser outra pessoa. Ele te ajuda a descobrir quem você é por dentro — e usar isso a seu favor para evoluir de verdade.'
];

const RESULT_POINTS = [
  {
    title: 'Conversa vira clareza',
    description:
      'Você fala no WhatsApp como se fosse um diário íntimo. A IA colhe emoções, fatos e traça seu estado mental atual — sem julgamentos, só compreensão.'
  },
  {
    title: 'Painel que revela padrões',
    description:
      'Humor, energia, sabotadores e emoções compilados em um app intuitivo que mostra exatamente onde você está travando e o que fazer.'
  },
  {
    title: 'Ações personalizadas que funcionam',
    description:
      'Micro passos alinhados aos seus objetivos reais. Nada de listas genéricas — apenas o que importa para o SEU momento, no SEU ritmo.'
  },
  {
    title: 'Você sempre no controle',
    description:
      'Cada resumo precisa da sua aprovação. Privacidade total, autonomia completa. Você escolhe quando e como continuar.'
  }
];

const HOW_IT_WORKS = [
  {
    icon: MessageSquare,
    title: 'Você conversa no WhatsApp',
    description:
      'Fale livremente sobre seu dia, seus desafios, suas conquistas. A IA faz perguntas poderosas que revelam o que está acontecendo por baixo da superfície.'
  },
  {
    icon: Brain,
    title: 'App traduz emoções em dados',
    description:
      'Humor, roda das emoções, sentimentos PANAS, sabotadores ativos — tudo atualizado em tempo real para você ver exatamente onde está.'
  },
  {
    icon: Target,
    title: 'Recebe ações personalizadas',
    description:
      'Metas e micro-ações práticas, alinhadas com seus objetivos. Não é motivação vazia — é direção clara sobre o próximo passo.'
  },
  {
    icon: Sparkles,
    title: 'IA mantém você engajado',
    description:
      'Lembretes inteligentes, resumos semanais e convites para reflexões guiadas. O sistema trabalha para você manter o ritmo, sem pressão.',
    extra:
      'Indicadores visuais mostram seu progresso. Cada pequena vitória é registrada e celebrada — porque evolução é soma de consistência.'
  }
];

const TESTIMONIALS = [
  {
    quote:
      'Descubra padrões, gatilhos e forças internas de forma objetiva. Sem teorias vazias — apenas dados reais sobre como sua mente funciona.',
    person: 'Ana Ribeiro',
    role: 'Empreendedora digital'
  },
  {
    quote:
      'Entenda o que você realmente sente e por quê. Transforme emoções confusas em decisões conscientes e direcionadas.',
    person: 'Lucas Fernandes',
    role: 'Produtor criativo'
  },
  {
    quote:
      'Volte a sentir prazer em estar com você. Presença, foco e uma relação mais saudável com sua própria mente.',
    person: 'Marina Duarte',
    role: 'Especialista em desenvolvimento humano'
  }
];

const IMPACT_STATS = [
  {
    headline: '1 conversa por dia no WhatsApp',
    detail: 'Acesso imediato, sem cadastro'
  },
  {
    headline: 'Humor atual e tendências',
    detail: 'App completo de evolução'
  },
  {
    headline: 'Resumo semanal inteligente',
    detail: 'Micro ações orientadas pelo seu momento'
  }
];

const FAQ_ITEMS = [
  {
    question: 'O que é o MindQuest?',
    answer:
      'Uma plataforma de evolução pessoal guiada por IA. Você conversa pelo WhatsApp e acompanha sua evolução em um app intuitivo com métricas emocionais, insights comportamentais e recomendações práticas para crescer de forma consistente.'
  },
  {
    question: 'Como faço para começar?',
    answer:
      'Clique em "Começar no WhatsApp", diga seu nome e comece sua primeira conversa. Sem login, sem senha, sem atrito. A IA te guia por todo o processo.'
  },
  {
    question: 'Por que acesso por token e não login tradicional?',
    answer:
      'Para eliminar barreiras e proteger sua privacidade. Cada sessão gera um token renovado — você não precisa lembrar senhas e seus dados ficam isolados por sessão.'
  },
  {
    question: 'Meus dados estão seguros?',
    answer:
      'Sim. Suas conversas são privadas, criptografadas e você sempre aprova o que é armazenado. Nada é compartilhado ou usado para outros fins além da sua evolução pessoal.'
  },
  {
    question: 'MindQuest substitui terapia?',
    answer:
      'Não. MindQuest é uma ferramenta de autoconhecimento e crescimento pessoal. Se você está lidando com questões clínicas (depressão, ansiedade grave, traumas), busque um psicólogo ou psiquiatra.'
  },
  {
    question: 'Funciona só no celular?',
    answer:
      'Você conversa pelo WhatsApp (celular ou web) e acessa seu app em qualquer dispositivo — celular, tablet ou computador.'
  },
  {
    question: 'Quanto tempo por dia preciso dedicar?',
    answer:
      'Entre 5 e 15 minutos por conversa. Você escolhe quando e com qual frequência usa. A consistência importa mais que o tempo investido.'
  }
];

const SectionTitle: React.FC<{ kicker?: string; title: string; description?: string }> = ({
  kicker,
  title,
  description
}) => (
  <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
    {kicker ? (
      <span
        className="mb-4 text-xs font-semibold uppercase tracking-[0.28em]"
        style={{ color: palette.primary, letterSpacing: '0.28em' }}
      >
        {kicker}
      </span>
    ) : null}
    <h2
      className="text-2xl font-semibold md:text-3xl"
      style={{ color: palette.secondary, fontFamily: 'Poppins, sans-serif' }}
    >
      {title}
    </h2>
    {description ? (
      <p className="mt-4 text-base leading-7" style={{ color: palette.muted }}>
        {description}
      </p>
    ) : null}
  </div>
);

const ComecarAgoraLandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'MindQuest — Sua mente fala com você todos os dias';
    const description =
      'MidQuest: Uma plataforma de evolução pessoal guiada por IA que transforma ruídos em clareza e ações em resultados.';
    const existingMeta = document.querySelector("meta[name='description']");
    if (existingMeta) {
      existingMeta.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    if (!document.querySelector('link[data-landing-font="comecar-agora"]')) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Poppins:wght@600;700&display=swap';
      fontLink.setAttribute('data-landing-font', 'comecar-agora');
      document.head.appendChild(fontLink);
    }
  }, []);

  const handleCtaClick = (origin: string) => {
    if (typeof window !== 'undefined') {
      window.open(WHATSAPP_URL, '_blank', 'noopener');
      window.dispatchEvent(new CustomEvent('mindquest:cta', { detail: { origin } }));
    }
  };

  return (
    <div
      style={{
        backgroundColor: palette.surface,
        fontFamily: 'Inter, "Open Sans", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        color: palette.secondary
      }}
    >
      <header className="sticky top-0 z-40 backdrop-blur">
        <div
          className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderBottom: `1px solid ${palette.stroke}`
          }}
        >
          <a href="/" className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold"
              style={{ backgroundColor: palette.primary, color: palette.card, fontFamily: 'Poppins, sans-serif' }}
            >
              MQ
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold" style={{ color: palette.secondary }}>
                MindQuest
              </p>
              <p className="text-xs font-medium" style={{ color: palette.muted }}>
                mente clara, resultados reais
              </p>
            </div>
          </a>
          <button
            type="button"
            onClick={() => handleCtaClick('header')}
            className="hidden items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition duration-200 md:inline-flex"
            style={{ backgroundColor: palette.primary, color: palette.card, letterSpacing: '0.22em' }}
          >
            <span>Começar agora</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-5 pb-24 pt-16 md:pt-24 lg:pt-28">
        <section
          className="grid items-start gap-10 rounded-[32px] p-10 md:grid-cols-[1.1fr_0.9fr] md:p-14"
          style={{
            backgroundColor: palette.secondary,
            boxShadow: '0 28px 80px -40px rgba(22, 29, 39, 0.55)'
          }}
        >
          <div className="flex flex-col gap-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: palette.card, letterSpacing: '0.28em' }}
              >
                Clareza • Serenidade • Movimento
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Sua mente fala com você todos os dias. O MindQuest te ajuda a ouvir, entender e evoluir.
            </h1>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => handleCtaClick('hero')}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition duration-200"
                style={{
                  backgroundColor: palette.card,
                  color: palette.secondary,
                  letterSpacing: '0.2em',
                  boxShadow: '0 16px 32px -18px rgba(255, 255, 255, 0.4)'
                }}
              >
                Começar agora no WhatsApp - É grátis
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80 sm:ml-4">
                Sem login, sem senha. Apenas uma conversa.
              </span>
            </div>
          </div>
          <div className="hidden md:block" />
        </section>

        <section
          className="rounded-[32px] px-6 py-14 md:px-12"
          style={{ backgroundColor: palette.card, boxShadow: '0 32px 60px -48px rgba(59, 59, 88, 0.35)' }}
        >
          <SectionTitle
            title="Reconhece alguma dessas situações?"
            description="Sua mente não é o problema — ela só está tentando te proteger de formas que não funcionam mais."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PAIN_POINTS.map((pain) => (
              <article
                key={pain.title}
                className="flex h-full flex-col gap-2 rounded-[24px] p-5 transition-transform duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: palette.warmSurface,
                  borderLeft: `4px solid ${palette.accent}`,
                  borderTopRightRadius: '28px',
                  borderBottomRightRadius: '28px',
                  boxShadow: '0 22px 48px -40px rgba(255, 155, 113, 0.65)'
                }}
              >
                <h3
                  className="text-base font-semibold leading-6"
                  style={{ color: palette.secondary, fontFamily: 'Poppins, sans-serif' }}
                >
                  {pain.title}
                </h3>
                <p className="text-sm leading-6" style={{ color: palette.muted }}>
                  {pain.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="rounded-[32px] px-6 py-12 md:px-12"
          style={{ backgroundColor: palette.surface, border: `1px solid ${palette.stroke}` }}
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <div
              className="rounded-[24px] p-6 text-center"
              style={{ backgroundColor: palette.warmSurface, border: `1px solid ${palette.accent}` }}
            >
              <p className="text-base leading-7" style={{ color: palette.secondary }}>
                Nada disso é fraqueza. São padrões mentais que sua mente criou para te proteger — mas que hoje te impedem
                de avançar.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {INSIGHT_POINTS.map((text) => (
                <article
                  key={text}
                  className="rounded-[24px] border p-6"
                  style={{ borderColor: palette.stroke, backgroundColor: palette.card }}
                >
                  <p className="text-sm leading-6" style={{ color: palette.muted }}>
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="rounded-[32px] px-6 py-14 md:px-12"
          style={{ backgroundColor: palette.card, boxShadow: '0 24px 60px -48px rgba(59, 77, 89, 0.35)' }}
        >
          <SectionTitle title="Como o MindQuest transforma sua relação com você mesmo" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {RESULT_POINTS.map((result) => (
              <article
                key={result.title}
                className="group flex h-full flex-col gap-4 rounded-[24px] border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: palette.stroke, backgroundColor: palette.surface }}
              >
                <h3 className="text-lg font-semibold" style={{ color: palette.secondary }}>
                  {result.title}
                </h3>
                <p className="text-sm leading-6" style={{ color: palette.muted }}>
                  {result.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-12 rounded-[32px] bg-white px-6 py-14 md:px-12">
          <SectionTitle
            kicker="Prova social"
            title="Benefícios que você vai sentir na prática"
            description="Cresça de forma natural, com suporte contínuo e sem pressão externa. Nada de metas irreais — apenas progresso consistente."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.person}
                className="flex h-full flex-col justify-between gap-6 rounded-[24px] border p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: palette.stroke, backgroundColor: palette.surface }}
              >
                <Quote size={32} style={{ color: palette.primary }} />
                <blockquote className="text-sm leading-6" style={{ color: palette.secondary }}>
                  {testimonial.quote}
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold uppercase"
                    style={{ backgroundColor: palette.primary, color: palette.card }}
                  >
                    {testimonial.person
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div className="text-sm leading-5">
                    <p className="font-semibold" style={{ color: palette.secondary, fontFamily: 'Poppins, sans-serif' }}>
                      {testimonial.person}
                    </p>
                    <p style={{ color: palette.muted }}>{testimonial.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div
            className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] px-6 py-5"
            style={{ backgroundColor: palette.soft }}
          >
            {IMPACT_STATS.map((stat) => (
              <div key={stat.headline} className="flex flex-col gap-1">
                <p className="text-sm font-semibold" style={{ color: palette.secondary }}>
                  {stat.headline}
                </p>
                <p className="text-xs uppercase tracking-[0.24em]" style={{ color: palette.muted }}>
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-[32px] px-6 py-14 md:px-12"
          style={{ backgroundColor: palette.card, boxShadow: '0 24px 80px -48px rgba(59, 59, 88, 0.28)' }}
        >
          <SectionTitle
            kicker="O que é MindQuest"
            title="Plataforma de evolução pessoal guiada por IA que transforma ruídos em clareza e ações em resultados."
            description="Conversa → Insight → Ação → Progresso"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {HOW_IT_WORKS.map(({ icon: Icon, title, description, extra }) => (
              <article
                key={title}
                className="group flex h-full flex-col gap-4 rounded-[24px] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: palette.surface, border: `1px solid ${palette.stroke}` }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: 'rgba(247, 171, 138, 0.12)' }}
                >
                  <Icon size={24} style={{ color: palette.primary }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: palette.secondary }}>
                  {title}
                </h3>
                <p className="text-sm leading-6" style={{ color: palette.muted }}>
                  {description}
                </p>
                {extra ? (
                  <p className="text-sm leading-6" style={{ color: palette.muted }}>
                    {extra}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => handleCtaClick('como-funciona')}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition duration-200"
              style={{
                backgroundColor: palette.primary,
                color: palette.card,
                letterSpacing: '0.2em',
                boxShadow: '0 16px 40px -26px rgba(247, 171, 138, 0.45)'
              }}
            >
              Ver como funciona
            </button>
            <p className="text-xs uppercase tracking-[0.24em]" style={{ color: palette.muted }}>
              Começar agora no WhatsApp - É grátis
            </p>
          </div>
        </section>

        <section
          className="rounded-[32px] px-6 py-14 text-center md:px-12"
          style={{
            backgroundColor: palette.soft,
            boxShadow: '0 24px 60px -48px rgba(59, 77, 89, 0.35)'
          }}
        >
          <SectionTitle
            kicker="Chegou sua hora de organizar a mente"
            title="Tudo começa com uma conversa"
            description='Diga "oi" no WhatsApp e sinta a diferença na primeira semana.'
          />
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => handleCtaClick('cta-final')}
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] transition duration-200"
              style={{
                backgroundColor: palette.primary,
                color: palette.card,
                letterSpacing: '0.24em',
                boxShadow: '0 24px 50px -26px rgba(247, 171, 138, 0.5)'
              }}
            >
              Começar agora - É grátis
              <Zap size={18} />
            </button>
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: palette.muted }}>
              Acesso imediato. Sem login. Sem senha. Apenas você e sua evolução.
            </p>
          </div>
        </section>

        <section
          className="rounded-[32px] px-6 py-14 md:px-12"
          style={{ backgroundColor: palette.card, boxShadow: '0 24px 50px -42px rgba(59, 59, 88, 0.28)' }}
        >
          <SectionTitle kicker="FAQ" title="Perguntas frequentes" />
          <div className="mt-10 space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[24px] border px-6 py-4 transition-all duration-200"
                style={{ borderColor: palette.stroke, backgroundColor: palette.surface }}
              >
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-sm font-semibold"
                  style={{ color: palette.secondary, fontFamily: 'Poppins, sans-serif' }}
                >
                  <span>{faq.question}</span>
                  <Shield size={18} style={{ color: palette.primary }} />
                </summary>
                <p className="mt-3 text-sm leading-6" style={{ color: palette.muted }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: palette.footer }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-10 text-center text-sm text-white/80">
          <p>
            <strong>MindQuest</strong> | mente clara, resultados reais
          </p>
          <p>
            Dúvidas? <strong>suporte@mindquest.pt</strong>
          </p>
          <p>© 2025 MindQuest. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ComecarAgoraLandingPage;
