import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Brain,
  Target,
  Sparkles,
  Compass,
  ChevronDown,
  Shield
} from 'lucide-react';
import { WHATSAPP_URL, WHATSAPP_PREMIUM_URL } from '@/constants/whatsapp';

const IDENTIFY_POINTS = [
  'Muitas ideias no papel, mas na hora da ação você trava.',
  'Começa vários projetos, mas raramente termina algo.',
  'Sente que merece mais da vida, mas os resultados não aparecem.',
  'Se cobra o tempo todo, mas quase nunca se sente satisfeito.',
  'Quer agradar todo mundo e acaba se esgotando.',
  'Pensa demais e age de menos.',
  'Conquista coisas, mas o vazio não passa.'
];

const STEPS = [
  {
    title: 'Diga o que está acontecendo',
    description: 'Envie uma mensagem no WhatsApp. Sem formulários: é só você e a IA.'
  },
  {
    title: 'Receba perguntas poderosas',
    description: 'A IA conduz uma reflexão leve e objetiva para entender seu momento.'
  },
  {
    title: 'Valide a conversa',
    description: 'Ao final, você aprova o resumo. Ajuste se achar necessário.'
  },
  {
    title: 'Veja o painel atualizar',
    description: 'Humor, energia, insights e recomendações aparecem automaticamente.'
  }
];

const BENEFITS = [
  {
    title: 'Autoconhecimento real',
    description: 'Descubra padrões, gatilhos e forças internas, sem abstrações.'
  },
  {
    title: 'Clareza emocional',
    description: 'Entenda o que sente em minutos, transformando emoção em decisão.'
  },
  {
    title: 'Evolução natural',
    description: 'Cresça no seu ritmo, com suporte contínuo e sem pressão.'
  },
  {
    title: 'Consistência leve',
    description: 'Um pequeno passo por dia — a IA garante que você mantenha o ritmo.'
  },
  {
    title: 'Conexão consigo mesmo',
    description: 'Volte a sentir prazer em estar com você, com foco e presença.'
  }
];

const TRANSFORM_POINTS = [
  {
    title: 'Conversa vira clareza',
    description: 'Você fala no WhatsApp e recebe sínteses objetivas que traduzem emoções em foco.'
  },
  {
    title: 'Indicadores ao vivo',
    description: 'Humor, energia e padrões evoluem a cada interação para mostrar exatamente onde agir.'
  },
  {
    title: 'Recomendações acionáveis',
    description: 'Micro passos personalizados mantêm seu ritmo sem burocracia ou cobrança excessiva.'
  },
  {
    title: 'Você no controle',
    description: 'Aprovação de cada resumo garante privacidade e autonomia para continuar quando quiser.'
  }
];

const TEAM_POINTS = [
  {
    title: 'Neurociência aplicada',
    description: 'Conversas objetivas, sem jargão.'
  },
  {
    title: 'Psicologia comportamental',
    description: 'Big Five, PANAS, TCC — convertidos em práticas simples.'
  },
  {
    title: 'Filosofias práticas',
    description: 'Roda da Vida, Sabotadores, estoicismo — adaptados ao seu dia a dia.'
  },
  {
    title: 'Posicionamento',
    description:
      'MindQuest não é terapia nem app de produtividade. É autoconhecimento ativo com IA.'
  }
];

const FAQ_ITEMS = [
  {
    question: 'O que é o MindQuest?',
    answer:
      'Um assistente de IA que conversa com você pelo WhatsApp e atualiza seu dashboard com métricas emocionais, insights e recomendações.'
  },
  {
    question: 'Como inicio meu cadastro?',
    answer: 'Clique em “Começar no WhatsApp”, diga seu nome e siga as instruções do assistente.'
  },
  {
    question: 'Por que acesso por token?',
    answer:
      'Tokens são únicos, expiram automaticamente e garantem segurança sem a fricção de login/senha.'
  },
  {
    question: 'Meus dados estão protegidos?',
    answer:
      'Sim. Conversas e dashboard usam tokens renovados e armazenamento seguro. Você decide quando interagir.'
  },
  {
    question: 'Funciona pelo celular?',
    answer:
      'Sim. O fluxo via WhatsApp e o dashboard responsivo funcionam perfeitamente no smartphone.'
  }
];

const palette = {
  baseSurface: '#F7FAFC',
  cardSurface: '#FFFFFF',
  primaryTeal: '#2F6F7E',
  secondaryMint: '#8FD3C8',
  accentCoral: '#FF6B3D',
  textPrimary: '#1F2937',
  textMuted: '#4B5563',
  divider: '#E5E7EB'
};

const LpStartPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'MindQuest — Autoconhecimento com clareza ativa';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Converse com sua IA pelo WhatsApp, entenda suas emoções em minutos e acompanhe a evolução no dashboard. Clareza, serenidade e ação todos os dias.'
      );
    }
  }, []);

  return (
    <div style={{ backgroundColor: palette.baseSurface, color: palette.textPrimary }}>
      <header
        style={{ backgroundColor: palette.cardSurface, borderBottom: `1px solid ${palette.divider}` }}
        className="sticky top-0 z-40"
      >
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <span
              style={{ backgroundColor: palette.primaryTeal, color: palette.cardSurface }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold"
            >
              MQ
            </span>
            <div>
              <p className="text-base font-bold tracking-wide">MindQuest</p>
              <p style={{ color: palette.textMuted }} className="text-xs font-medium">
                mente clara, resultados reais
              </p>
            </div>
          </a>
          <nav className="hidden items-center gap-5 text-xs font-semibold uppercase tracking-[0.25em] md:flex">
            <a href="#identidade" className="hover:text-black">
              Por que dói
            </a>
            <a href="#transformacao" className="hover:text-black">
              Transformação
            </a>
            <a href="#como-funciona" className="hover:text-black">
              Como funciona
            </a>
            <a href="#beneficios" className="hover:text-black">
              Benefícios
            </a>
            <a href="#planos" className="hover:text-black">
              Planos
            </a>
            <a href="#faq" className="hover:text-black">
              FAQ
            </a>
          </nav>
          <a
            id="ctaHeader"
            href={WHATSAPP_URL}
            style={{ backgroundColor: palette.accentCoral, color: '#FFFFFF' }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm transition hover:opacity-90"
          >
            Começar no WhatsApp
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section style={{ backgroundColor: palette.cardSurface }} className="border-b border-slate-200">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-16 md:flex-row md:items-center">
            <div className="flex-1 space-y-6">
              <span
                style={{ backgroundColor: palette.secondaryMint, color: palette.primaryTeal }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
              >
                <Sparkles className="h-4 w-4" />
                Conversa diária · clareza contínua
              </span>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                Converse com sua IA e entenda o que sua mente quer te dizer.
              </h1>
              <p style={{ color: palette.textMuted }} className="text-lg">
                Uma conversa leve no WhatsApp. Você fala, a IA sintetiza e o painel mostra exatamente onde agir.
              </p>
              <ul className="space-y-3 text-sm" style={{ color: palette.textMuted }}>
                <li className="flex items-start gap-3">
                  <CheckCircle2 style={{ color: palette.primaryTeal }} className="mt-1 h-4 w-4 flex-shrink-0" />
                  Clareza emocional em minutos.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 style={{ color: palette.primaryTeal }} className="mt-1 h-4 w-4 flex-shrink-0" />
                  Diário inteligente que conversa com você.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 style={{ color: palette.primaryTeal }} className="mt-1 h-4 w-4 flex-shrink-0" />
                  Sem login, sem atrito — apenas o seu nome.
                </li>
              </ul>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  id="ctaHero"
                  href={WHATSAPP_URL}
                  style={{ backgroundColor: palette.accentCoral, color: '#FFFFFF' }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90"
                >
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </a>
                <span
                  style={{
                    borderColor: palette.divider,
                    color: palette.textMuted
                  }}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium"
                >
                  <Shield className="h-4 w-4" />
                  Acesso por token renovado
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div
                style={{
                  backgroundColor: palette.baseSurface,
                  borderColor: palette.divider
                }}
                className="rounded-3xl border p-6 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs" style={{ color: palette.textMuted }}>
                  <span>Resumo da sessão</span>
                  <span>MindQuest Beta</span>
                </div>
                <div className="mt-4 space-y-3 text-sm" style={{ color: palette.textMuted }}>
                  <div
                    style={{ backgroundColor: palette.cardSurface, borderColor: palette.divider }}
                    className="rounded-2xl border p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textMuted }}>
                      Conversa de hoje
                    </p>
                    <p className="mt-2">
                      “Estou disperso esta semana. Não consigo me concentrar no trabalho.”
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div
                      style={{ backgroundColor: palette.cardSurface, borderColor: palette.divider }}
                      className="rounded-2xl border p-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textMuted }}>
                        Humor
                      </p>
                      <p className="mt-2 text-2xl font-semibold" style={{ color: palette.primaryTeal }}>
                        7.8
                      </p>
                      <p className="text-xs" style={{ color: palette.textMuted }}>
                        Estável vs semana passada
                      </p>
                    </div>
                    <div
                      style={{ backgroundColor: palette.cardSurface, borderColor: palette.divider }}
                      className="rounded-2xl border p-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textMuted }}>
                        Emoção dominante
                      </p>
                      <p className="mt-2 font-semibold" style={{ color: palette.primaryTeal }}>
                        Antecipação
                      </p>
                      <p className="text-xs" style={{ color: palette.textMuted }}>
                        Contexto: foco e planejamento
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IDENTIFICAÇÃO */}
        <section id="identidade" className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-5xl px-5 py-16">
            <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold md:text-4xl">🧩 Você se identifica?</h2>
                <p style={{ color: palette.textMuted }} className="text-base leading-relaxed">
                  Às vezes, a mente parece uma montanha-russa. Muita ideia, pouca ação. Veja se algo disso soa familiar:
                </p>
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  {IDENTIFY_POINTS.map((point) => (
                    <div
                      key={point}
                      style={{ borderColor: palette.divider, backgroundColor: palette.cardSurface }}
                      className="flex items-start gap-2 rounded-xl border p-3"
                    >
                      <span
                        style={{ backgroundColor: palette.primaryTeal }}
                        className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      />
                      <span style={{ color: palette.textMuted }}>{point}</span>
                    </div>
                  ))}
                </div>
                <div
                  style={{ backgroundColor: palette.secondaryMint, color: palette.primaryTeal }}
                  className="rounded-2xl px-4 py-3 text-sm font-medium"
                >
                  Nada disso é fraqueza — é a mente tentando te proteger. O MindQuest traduz esses padrões em clareza e
                  direção.
                </div>
              </div>
              <div
                style={{ borderColor: palette.divider, backgroundColor: palette.cardSurface }}
                className="space-y-5 rounded-3xl border p-6 shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textMuted }}>
                    Score atual
                  </p>
                  <p className="mt-2 text-3xl font-semibold" style={{ color: palette.primaryTeal }}>
                    Clareza 62%
                  </p>
                  <p className="text-xs" style={{ color: palette.textMuted }}>
                    Meta: 85%
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textMuted }}>
                    Padrão detectado
                  </p>
                  <p className="mt-2 text-lg font-semibold" style={{ color: palette.primaryTeal }}>
                    Autocrítica constante
                  </p>
                  <p className="text-sm" style={{ color: palette.textMuted }}>
                    Seu diálogo interno ainda olha mais para o erro do que para o avanço incremental.
                  </p>
                </div>
                <div
                  style={{ backgroundColor: palette.baseSurface, borderColor: palette.divider }}
                  className="rounded-2xl border p-4 text-sm"
                >
                  Recomendações do dia:
                  <ul className="mt-2 space-y-1" style={{ color: palette.textMuted }}>
                    <li>• Registrar uma vitória ao final do dia.</li>
                    <li>• Revisar sabotadores às quartas.</li>
                    <li>• Reduzir compromissos paralelos neste ciclo.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSFORMAÇÃO */}
        <section id="transformacao" style={{ backgroundColor: palette.cardSurface }} className="border-b border-slate-200">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-16 md:flex-row">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-extrabold md:text-4xl">💫 O que muda com o MindQuest</h2>
              <p style={{ color: palette.textMuted }} className="text-base">
                O MindQuest não te ensina a ser outra pessoa. Ele te ajuda a descobrir quem você é por dentro — e usar isso a seu favor.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {TRANSFORM_POINTS.map((item) => (
                  <div
                    key={item.title}
                    style={{ borderColor: palette.divider, backgroundColor: palette.baseSurface }}
                    className="rounded-2xl border p-4 text-sm shadow-sm"
                  >
                    <p className="text-base font-semibold" style={{ color: palette.primaryTeal }}>
                      {item.title}
                    </p>
                    <p className="mt-2" style={{ color: palette.textMuted }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{ borderColor: palette.divider, backgroundColor: palette.baseSurface }}
              className="flex-1 space-y-4 rounded-3xl border p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: palette.textMuted }}>
                Indicadores-chave
              </p>
              {[
                { label: 'Clareza mental', value: 74 },
                { label: 'Consistência diária', value: 68 },
                { label: 'Autocompaixão', value: 62 },
                { label: 'Foco nas prioridades', value: 71 }
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between text-xs font-semibold" style={{ color: palette.textMuted }}>
                    <span>{metric.label}</span>
                    <span>{metric.value}%</span>
                  </div>
                  <div style={{ backgroundColor: palette.divider }} className="mt-2 h-2 rounded-full">
                    <div
                      style={{ width: `${metric.value}%`, backgroundColor: palette.primaryTeal }}
                      className="h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section id="beneficios" className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-5xl px-5 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold md:text-4xl">🌟 Benefícios que você vai sentir</h2>
              <p style={{ color: palette.textMuted }} className="mt-3 text-base">
                Clareza, serenidade e ação — na mesma experiência.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.title}
                  style={{ borderColor: palette.divider, backgroundColor: palette.cardSurface }}
                  className="rounded-2xl border p-5 text-sm shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-base font-semibold" style={{ color: palette.primaryTeal }}>
                    {benefit.title}
                  </p>
                  <p className="mt-2" style={{ color: palette.textMuted }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-5xl px-5 py-16">
            <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: palette.textMuted }}>
              <Compass className="h-4 w-4" />
              Por trás do MindQuest
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {TEAM_POINTS.map((item) => (
                <div
                  key={item.title}
                  style={{ borderColor: palette.divider, backgroundColor: palette.cardSurface }}
                  className="rounded-2xl border p-5 text-sm shadow-sm"
                >
                  <p className="text-base font-semibold" style={{ color: palette.primaryTeal }}>
                    {item.title}
                  </p>
                  <p className="mt-2" style={{ color: palette.textMuted }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-5xl px-5 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold md:text-4xl">Como funcionam as conversas</h2>
              <p style={{ color: palette.textMuted }} className="mt-3 text-base">
                Cada conversa gera dados, insights e recomendações — sempre com você no controle.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  style={{ borderColor: palette.divider, backgroundColor: palette.cardSurface }}
                  className="relative rounded-2xl border p-5 shadow-sm"
                >
                  <div
                    style={{ backgroundColor: palette.primaryTeal, color: '#FFFFFF' }}
                    className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{ backgroundColor: palette.secondaryMint, color: palette.primaryTeal }}
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  >
                    {index === 0 && <MessageSquare className="h-5 w-5" />}
                    {index === 1 && <Brain className="h-5 w-5" />}
                    {index === 2 && <CheckCircle2 className="h-5 w-5" />}
                    {index === 3 && <Target className="h-5 w-5" />}
                  </div>
                  <p className="text-base font-semibold" style={{ color: palette.primaryTeal }}>
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: palette.textMuted }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-5xl px-5 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold md:text-4xl">Planos</h2>
              <p style={{ color: palette.textMuted }} className="mt-3 text-base">
                Comece grátis e evolua para o Premium quando quiser mentoria ativa.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div
                style={{ borderColor: palette.divider, backgroundColor: palette.cardSurface }}
                className="space-y-4 rounded-2xl border p-6 shadow-sm"
              >
                <p className="text-lg font-semibold" style={{ color: palette.primaryTeal }}>
                  Free
                </p>
                <ul style={{ color: palette.textMuted }} className="space-y-2 text-sm">
                  <li>• 1 conversa por dia no WhatsApp</li>
                  <li>• Dashboard com humor, energia e insights</li>
                  <li>• Acesso imediato, sem login</li>
                </ul>
                <a
                  id="ctaFree"
                  href={WHATSAPP_URL}
                  style={{ backgroundColor: palette.accentCoral, color: '#FFFFFF' }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90"
                >
                  Começar grátis
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div
                style={{ borderColor: palette.divider, backgroundColor: palette.cardSurface }}
                className="space-y-4 rounded-2xl border p-6 shadow-sm"
              >
                <p className="text-lg font-semibold" style={{ color: palette.primaryTeal }}>
                  Premium (em breve)
                </p>
                <ul style={{ color: palette.textMuted }} className="space-y-2 text-sm">
                  <li>• Sessões ilimitadas</li>
                  <li>• Histórico completo com busca semântica</li>
                  <li>• Rotinas automatizadas e mentor 24h</li>
                </ul>
                <a
                  id="ctaWaitlist"
                  href={WHATSAPP_PREMIUM_URL}
                  style={{
                    borderColor: palette.primaryTeal,
                    color: palette.primaryTeal
                  }}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition hover:bg-slate-100"
                >
                  Quero ser avisado
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-5xl px-5 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold md:text-4xl">Perguntas frequentes</h2>
              <p style={{ color: palette.textMuted }} className="mt-3 text-base">
                Reunimos as perguntas mais comuns para você decidir com segurança.
              </p>
            </div>
            <div className="mx-auto max-w-3xl divide-y" style={{ borderColor: palette.divider }}>
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.question}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between py-4 text-left text-base font-semibold"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: palette.primaryTeal }}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all ${isOpen ? 'max-h-40' : 'max-h-0'}`}
                      style={{ color: palette.textMuted }}
                    >
                      <p className="pb-4 text-sm">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{ backgroundColor: palette.cardSurface }} className="border-b border-slate-200">
          <div className="mx-auto w-full max-w-4xl px-5 py-16 text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl">Tudo começa com uma conversa.</h2>
            <p style={{ color: palette.textMuted }} className="mt-4 text-base">
              Diga “oi” no WhatsApp e sinta a diferença na primeira semana. Clareza, serenidade e movimento.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                id="ctaFooter"
                href={WHATSAPP_URL}
                style={{ backgroundColor: palette.accentCoral, color: '#FFFFFF' }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP_PREMIUM_URL}
                style={{ borderColor: palette.primaryTeal, color: palette.primaryTeal }}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition hover:bg-slate-100"
              >
                Conhecer Premium
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p style={{ color: palette.textMuted }} className="mt-4 text-xs">
              Segurança: acesso por token renovado a cada sessão. Sem login e sem senha.
            </p>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: palette.cardSurface, borderTop: `1px solid ${palette.divider}` }}>
        <div className="mx-auto w-full max-w-5xl px-5 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  style={{ backgroundColor: palette.primaryTeal, color: palette.cardSurface }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold"
                >
                  MQ
                </span>
                <div>
                  <p className="text-sm font-semibold">MindQuest</p>
                  <p style={{ color: palette.textMuted }} className="text-xs">
                    mente clara, resultados reais
                  </p>
                </div>
              </div>
              <p style={{ color: palette.textMuted }} className="text-xs">
                Autoconhecimento guiado por IA — serenidade para decidir, ação para evoluir.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Navegação</p>
              <ul style={{ color: palette.textMuted }} className="mt-2 space-y-1 text-xs">
                <li>
                  <a href="#como-funciona" className="hover:text-black">
                    Como funciona
                  </a>
                </li>
                <li>
                  <a href="#beneficios" className="hover:text-black">
                    Benefícios
                  </a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-black">
                    Planos
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-black">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Contato</p>
              <p style={{ color: palette.textMuted }} className="mt-2 text-xs">
                suporte@mindquest.pt
              </p>
            </div>
          </div>
          <p style={{ color: palette.textMuted }} className="mt-6 text-xs">
            © {new Date().getFullYear()} MindQuest. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LpStartPage;
