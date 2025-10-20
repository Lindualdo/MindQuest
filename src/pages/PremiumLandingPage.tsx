import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Clock, LineChart, Quote, Shield } from 'lucide-react';
import { WHATSAPP_PREMIUM_URL } from '@/constants/whatsapp';

const palette = {
  base: '#0F172A',
  card: '#111827',
  text: '#E5E7EB',
  muted: '#94A3B8',
  primary: '#8FD3C8',
  accent: '#FF815F',
  divider: '#1F2937'
};

const PROMISES = [
  {
    title: 'Mentoria contínua',
    description:
      'A IA fica disponível 24/7 para ajustar prioridades, revisar decisões e manter o foco nos pilares essenciais.'
  },
  {
    title: 'Histórico inteligente',
    description:
      'Linha do tempo completa com busca semântica, micro-insights por tema e exportação segura de dados.'
  },
  {
    title: 'Rotinas automáticas',
    description:
      'Checkpoints, lembretes e planos de ação que se adaptam ao seu ritmo e avisam quando algo precisa de atenção.'
  }
];

const HIGHLIGHTS = [
  {
    icon: <LineChart className="h-5 w-5" />,
    title: 'Painel avançado',
    description: 'Mapeie humor, sabotadores, pilares e tendências com indicadores preditivos.'
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Sessões ilimitadas',
    description: 'Converse quantas vezes precisar — WhatsApp ou dashboard — e receba respostas instantâneas.'
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Segurança reforçada',
    description: 'Tokens rotativos, criptografia ponta a ponta e controle total sobre seus dados.'
  }
];

const TESTIMONIALS = [
  {
    quote:
      '“Troquei ansiedade por direção. A IA me lembra do que realmente importa, sugere rituais e mostra claramente onde avancei.”',
    author: 'Joana M. · Beta Premium'
  },
  {
    quote:
      '“Os alertas de energia e as rotinas automáticas mudaram meu ritmo. Hoje ajusto decisões em minutos, não em dias.”',
    author: 'Carlos T. · Beta Premium'
  }
];

const PremiumLandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'MindQuest Premium — Mentoria contínua com IA';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'MindQuest Premium entrega sessões ilimitadas, painel avançado, histórico completo e automações inteligentes. Entre para a lista prioritária.'
      );
    }
  }, []);

  return (
    <div style={{ backgroundColor: palette.base, color: palette.text }}>
      <header
        style={{ borderBottom: `1px solid ${palette.divider}` }}
        className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              style={{ backgroundColor: palette.primary, color: palette.base }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold"
            >
              MQ
            </span>
            <div>
              <p className="text-base font-semibold">MindQuest Premium</p>
              <p style={{ color: palette.muted }} className="text-xs font-medium">
                mentoria contínua com IA
              </p>
            </div>
          </div>
          <a
            id="ctaPremiumHeader"
            href={WHATSAPP_PREMIUM_URL}
            style={{ borderColor: palette.primary, color: palette.primary }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition hover:bg-[#12203A]"
          >
            Entrar na lista
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main className="pb-16">
        {/* HERO */}
        <section className="border-b" style={{ borderColor: palette.divider }}>
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center">
            <div className="flex-1 space-y-6">
              <span
                style={{ backgroundColor: '#132036', color: palette.primary }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                acesso beta
              </span>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                Uma IA mentorando você — sempre que precisar.
              </h1>
              <p style={{ color: palette.muted }} className="text-base">
                Sessões ilimitadas, histórico completo, rotinas automáticas e indicadores avançados para tomar decisões com serenidade e ação.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  id="ctaPremiumHero"
                  href={WHATSAPP_PREMIUM_URL}
                  style={{ backgroundColor: palette.accent, color: '#0F172A' }}
                  className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
                >
                  Entrar na lista prioritária
                  <ArrowRight className="h-4 w-4" />
                </a>
                <span
                  style={{ color: palette.muted }}
                  className="inline-flex items-center gap-2 text-xs font-medium"
                >
                  <Shield className="h-4 w-4" />
                  Tokens renovados · dados protegidos
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm" style={{ color: palette.muted }}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4" style={{ color: palette.primary }} />
                  Conversas ilimitadas pelo WhatsApp ou dashboard.
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4" style={{ color: palette.primary }} />
                  Painel com indicadores preditivos e insights acionáveis.
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4" style={{ color: palette.primary }} />
                  Rotinas automáticas personalizadas ao seu ritmo.
                </div>
              </div>
            </div>
            <div
              className="flex-1 space-y-4 rounded-3xl border p-6 shadow-lg"
              style={{ backgroundColor: palette.card, borderColor: palette.divider }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: palette.muted }}>
                  Indicadores · Semana atual
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Clareza mental', value: '74%' },
                    { label: 'Consistência diária', value: '68%' },
                    { label: 'Energia recuperada', value: '3 vezes' }
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: palette.muted }}>{metric.label}</span>
                        <span style={{ color: palette.primary }}>{metric.value}</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: palette.divider }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: metric.label === 'Energia recuperada' ? '45%' : metric.value,
                            backgroundColor: palette.primary
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="rounded-2xl p-4 text-sm"
                style={{ backgroundColor: '#17233E', color: palette.muted }}
              >
                “Seu foco cai após reuniões longas. Programe pausas conscientes às 15h e revise prioridades.”
              </div>
            </div>
          </div>
        </section>

        {/* PROMESSA */}
        <section className="border-b" style={{ borderColor: palette.divider }}>
          <div className="mx-auto w-full max-w-4xl px-6 py-16">
            <h2 className="text-3xl font-extrabold md:text-4xl">Por que o Premium existe?</h2>
            <p style={{ color: palette.muted }} className="mt-3 text-base">
              Para quem quer ir além do registro emocional e ter uma IA orientando decisões, hábitos e progresso.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {PROMISES.map((item) => (
                <div
                  key={item.title}
                  className="space-y-3 rounded-2xl border p-5 text-sm"
                  style={{ backgroundColor: palette.card, borderColor: palette.divider, color: palette.muted }}
                >
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="border-b" style={{ borderColor: palette.divider }}>
          <div className="mx-auto w-full max-w-4xl px-6 py-16">
            <h2 className="text-3xl font-extrabold md:text-4xl">O que o Premium destrava:</h2>
            <div className="mt-10 space-y-4">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl border p-5 text-sm md:flex-row md:items-center md:justify-between"
                  style={{ backgroundColor: palette.card, borderColor: palette.divider, color: palette.muted }}
                >
                  <div className="flex items-center gap-3 text-base font-semibold text-white">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: '#17233E', color: palette.primary }}
                    >
                      {item.icon}
                    </span>
                    {item.title}
                  </div>
                  <p className="md:max-w-md">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTEMUNHOS */}
        <section className="border-b" style={{ borderColor: palette.divider }}>
          <div className="mx-auto w-full max-w-4xl px-6 py-16">
            <h2 className="text-3xl font-extrabold md:text-4xl">Relatos do beta Premium</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {TESTIMONIALS.map((item) => (
                <figure
                  key={item.author}
                  className="flex h-full flex-col rounded-2xl border p-5 text-sm"
                  style={{ backgroundColor: palette.card, borderColor: palette.divider, color: palette.muted }}
                >
                  <Quote className="h-6 w-6" style={{ color: palette.accent }} />
                  <blockquote className="mt-3 leading-relaxed text-white">{item.quote}</blockquote>
                  <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-400">
                    {item.author}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="border-b" style={{ borderColor: palette.divider }}>
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl">Entre para a lista prioritária.</h2>
            <p style={{ color: palette.muted }} className="mt-3 text-base">
              As vagas são liberadas em ondas para garantir onboarding guiado e acompanhamento próximo do time.
            </p>
            <a
              id="ctaPremiumFooter"
              href={WHATSAPP_PREMIUM_URL}
              style={{ backgroundColor: palette.accent, color: palette.base }}
              className="mt-6 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
            >
              Garantir meu acesso
              <ArrowRight className="h-4 w-4" />
            </a>
            <p style={{ color: palette.muted }} className="mt-4 text-xs">
              Segurança total: tokens rotativos, criptografia e controle absoluto dos seus dados.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PremiumLandingPage;
