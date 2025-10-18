import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Brain,
  ClipboardCheck,
  LineChart,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
  ChevronRight
} from 'lucide-react';

const WHATSAPP_LINK = 'https://wa.me/351928413957';

const heroHighlights = [
  {
    title: 'Clareza emocional instantânea',
    description: 'Transforme sentimentos dispersos em métricas visuais que orientam suas próximas ações.',
    icon: Brain
  },
  {
    title: 'Diagnóstico profundo',
    description: 'Identifique sabotadores, padrões ocultos e gatilhos que travam sua evolução.',
    icon: Target
  },
  {
    title: 'Plano em movimento',
    description: 'Receba orientações diárias e missões personalizadas para manter seu progresso constante.',
    icon: Zap
  }
];

const dashboardHighlights = [
  {
    title: 'Evolução emocional',
    description: 'Humor, energia e tendências diárias organizadas em gráficos inteligentes.',
    icon: LineChart
  },
  {
    title: 'Gamificação motivadora',
    description: 'Pontos, streaks e conquistas que celebram cada avanço e mantêm o foco.',
    icon: Star
  },
  {
    title: 'Insights da IA',
    description: 'Resumos automáticos, identificador de sabotadores e recomendações acionáveis.',
    icon: Sparkles
  },
  {
    title: 'Conversas completas',
    description: 'Texto e transcrição de áudio disponíveis para revisitar aprendizados quando quiser.',
    icon: MessageSquare
  }
];

const premiumHighlights = [
  {
    title: 'Mentoria ativa 24/7',
    description: 'Converse livremente com o assistente e mantenha um “auto-gestor” emocional ao seu lado.',
    icon: Users
  },
  {
    title: 'Jornadas personalizadas',
    description: 'Playbooks inteligentes que se adaptam aos seus objetivos e estilo de vida.',
    icon: ClipboardCheck
  },
  {
    title: 'Suporte estratégico',
    description: 'Contato direto com especialistas para construir planos de ação e acelerar resultados.',
    icon: ShieldCheck
  }
];

const conversationSteps = [
  {
    title: 'Conte o que está acontecendo',
    description:
      'Envie texto ou áudio pelo WhatsApp. Quanto mais contexto, maior a precisão do MindQuest.',
    icon: MessageSquare
  },
  {
    title: 'Receba perguntas poderosas',
    description:
      'A IA conduz a reflexão com técnicas de TCC e coaching, aprofundando o entendimento real do momento.',
    icon: Activity
  },
  {
    title: 'Valide a conversa',
    description:
      'O assistente entrega um resumo estruturado. Ajuste o que for preciso para que tudo reflita fielmente sua visão.',
    icon: ClipboardCheck
  },
  {
    title: 'Finalize com um novo token',
    description:
      'Conversa encerrada, token renovado e dashboard atualizado automaticamente com métricas e recomendações.',
    icon: Rocket
  }
];

const comparisonRows = [
  {
    feature: 'Conversas com a IA',
    free: 'Registro das interações (sem diálogo ativo)',
    premium: 'Até 5 sessões diárias com 5 interações cada e respostas em tempo real'
  },
  {
    feature: 'Histórico de dados',
    free: 'Visualização dos últimos 7 dias',
    premium: 'Histórico completo com linha do tempo interativa'
  },
  {
    feature: 'Resumos e transcrições',
    free: 'Resumos automáticos e transcrição de áudio inclusos',
    premium: 'Resumos + mentoria ativa com direcionamentos focados'
  },
  {
    feature: 'Mentoria e suporte',
    free: 'Assistente virtual via FAQ',
    premium: 'Mentor dedicado, jornadas assistidas e suporte humano prioritário'
  },
  {
    feature: 'Notificações e lembretes',
    free: 'Configuração básica',
    premium: 'Automação avançada de lembretes e checkpoints estratégicos'
  }
];

type FaqItem = {
  question: string;
  answer: string;
  cta?: {
    label: string;
    href: string;
  };
};

const faqItems: FaqItem[] = [
  {
    question: 'O que é o MindQuest?',
    answer:
      'Um assistente inteligente que combina IAs especialistas em emoções, neurociência e comportamento para entregar clareza interna e ações práticas personalizadas.'
  },
  {
    question: 'Como inicio meu cadastro?',
    answer:
      'Fale com o Assietnte do MindQuest no WhatsApp +351 928 413 957. Enviamos um link seguro com token para ativar o dashboard em poucos minutos.',
    cta: {
      label: 'Iniciar cadastro pelo WhatsApp',
      href: WHATSAPP_LINK
    }
  },
  {
    question: 'Por que o acesso usa token e não login/senha?',
    answer:
      'Tokens garantem máxima segurança: são únicos, expiram automaticamente e renovados após cada sessão. Mesmo que um link vaze, ele perde a validade rapidamente.'
  },
  {
    question: 'Meus dados estão protegidos?',
    answer:
      'Sim. Criptografia forte, hospedagem segura e controle de acesso rígido garantem que apenas você (e quem autorizar) visualize seus dados.'
  },
  {
    question: 'O Premium vale a pena?',
    answer:
      'Se você quer ritmo, disciplina e mentor ativo, sim. O Premium libera conversas livres, histórico completo, contramedidas imediatas e acompanhamento humano.'
  },
  {
    question: 'Posso usar MindQuest apenas pelo celular?',
    answer:
      'Claro. O dashboard é responsivo e o fluxo via WhatsApp permite registrar e acompanhar tudo direto do smartphone.'
  },
  {
    question: 'A IA aprende comigo?',
    answer:
      'O MindQuest evolui conforme suas respostas. Ele identifica padrões, entende gatilhos e ajusta recomendações de forma contínua.'
  },
  {
    question: 'Como recupero o token se perder o link?',
    answer:
      'Abra uma nova conversa com o assistente. Ao final da sessão um novo token é gerado automaticamente.'
  }
];

const processSteps = [
  {
    label: 'Pensamentos',
    bgClass: 'bg-[#dbeafe]',
    textClass: 'text-slate-800 font-medium'
  },
  {
    label: 'Sentimentos',
    bgClass: 'bg-[#e0e7ff]',
    textClass: 'text-slate-800 font-medium'
  },
  {
    label: 'Ações',
    bgClass: 'bg-[#f3e8ff]',
    textClass: 'text-purple-600 font-semibold'
  },
  {
    label: 'Resultados',
    bgClass: 'bg-[#ede9fe]',
    textClass: 'text-slate-900 font-semibold'
  }
];

const FaqPage: React.FC = () => {
  useEffect(() => {
    const head = document.head;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    head.appendChild(link);

    const themeStyle = document.createElement('style');
    themeStyle.setAttribute('data-origin', 'mindquest-chat-theme');
    themeStyle.textContent = `
      :root {
        --chat--color--primary: #4f46e5;
        --chat--color--primary-shade-50: #4338ca;
        --chat--color--primary--shade-100: #3730a3;
        --chat--color--secondary: #38bdf8;
        --chat--color-secondary-shade-50: #0ea5e9;
        --chat--toggle--background: #4f46e5;
        --chat--toggle--hover--background: #4338ca;
        --chat--toggle--active--background: #3730a3;
        --chat--header--background: linear-gradient(135deg, #4f46e5, #8b5cf6);
        --chat--header--color: #f8fafc;
        --chat--button--background: #4f46e5;
        --chat--button--hover--background: #4338ca;
        --chat--message--user--background: #4f46e5;
        --chat--message--user--color: #ffffff;
        --chat--input--send--button--color: #4f46e5;
        --chat--input--send--button--color-hover: #4338ca;
      }
    `;
    head.appendChild(themeStyle);

    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      if (!window.__mindquestFaqChatLoaded) {
        window.__mindquestFaqChatLoaded = true;
        createChat({
          webhookUrl: 'https://mindquest-n8n.cloudfy.live/webhook/283c840c-33e8-4d81-a331-81dc1a8cec7c/chat',
          defaultLanguage: 'pt-BR',
          initialMessages: [
            'Olá! 👋',
            'Eu sou a Ária, assistente virtual do MindQuest. Como posso ajudar você hoje?'
          ],
          i18n: {
            'pt-BR': {
              title: 'Olá! 👋',
              subtitle: 'Converse com o suporte MindQuest e tire suas dúvidas em poucos minutos.',
              footer: '',
              getStarted: 'Iniciar conversa',
              inputPlaceholder: 'Digite sua pergunta...',
              closeButtonTooltip: 'Fechar chat'
            },
            'en': {
              title: 'MindQuest Support',
              subtitle: 'Let us know how we can help.',
              footer: '',
              getStarted: 'Start conversation',
              inputPlaceholder: 'Type your question...',
              closeButtonTooltip: 'Close chat'
            }
          }
        });
      }
    `;
    document.body.appendChild(script);

    return () => {
      if (link.parentNode === head) {
        head.removeChild(link);
      }
      if (themeStyle.parentNode === head) {
        head.removeChild(themeStyle);
      }
      if (script.parentNode === document.body) {
        document.body.removeChild(script);
      }
      (window as typeof window & { __mindquestFaqChatLoaded?: boolean }).__mindquestFaqChatLoaded =
        false;
    };
  }, []);

  const openChatWidget = () => {
    const toggle = document.querySelector<HTMLButtonElement>('.chat-button');
    if (toggle) {
      toggle.click();
      return true;
    }
    return false;
  };

  const handleOpenChat = () => {
    if (openChatWidget()) {
      return;
    }

    // tenta novamente após pequeno atraso para garantir que o widget carregou
    setTimeout(() => {
      if (openChatWidget()) {
        return;
      }
      // fallback: direciona para o WhatsApp se o widget não estiver disponível
      window.open(WHATSAPP_LINK, '_blank');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl absolute -top-32 -left-20" />
        <div className="w-80 h-80 bg-blue-200/40 rounded-full blur-3xl absolute top-20 right-0" />
      </div>

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/85 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                    <Brain className="text-white" size={28} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      MindQuest
                    </span>
                    <span className="text-sm text-gray-500">Mente clara, resultados reais</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                  Produtividade com bem estar mental
                </span>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-xl font-bold text-gray-900">Tudo começa na mente.</p>
                    <div className="relative">
                      <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                        {processSteps.map((step, index) => (
                          <div key={step.label} className="flex items-center gap-3">
                            <div
                              className={`px-4 py-2 rounded-full ${step.bgClass} shadow-sm border border-white/70 ${step.textClass}`}
                            >
                              {step.label}
                            </div>
                            {index !== processSteps.length - 1 && (
                              <ChevronRight className="text-gray-300" size={18} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-base text-gray-600">
                      Pensamentos moldam sentimentos. Sentimentos impulsionam ações. Ações constroem resultados.
                    </p>
                    <p className="text-base text-gray-700">
                      Com MindQuest, você otimiza esse ciclo despetando seu potencial e realizando mais
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-3 px-9 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-lg font-semibold shadow-xl shadow-purple-400/50 hover:shadow-purple-500/70 transition"
                    >
                      <Users size={18} />
                      Iniciar experiência agora
                    </a>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative mx-auto lg:mx-0 lg:self-start"
              >
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500 flex items-center justify-center shadow-xl shadow-purple-300/40">
                  <Brain className="text-white" size={96} />
                </div>
                <div className="absolute -bottom-5 -right-4 bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl px-4 py-3">
                  <div className="text-sm font-semibold text-gray-800">MindQuest • Dashboard Vivo</div>
                  <div className="text-xs text-gray-500">
                    Clareza emocional, mentor digital e resultados mensuráveis
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-40 space-y-28">
          <section className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {heroHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white shadow-lg rounded-3xl border border-blue-50 p-6 space-y-3 hover:-translate-y-1 transition-transform duration-200"
                  >
                    <span className="p-3 inline-flex rounded-xl bg-blue-100 text-blue-600">
                      <Icon size={22} />
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </motion.div>
          </section>

          <section className="bg-white/85 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 md:p-12 space-y-10">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Um painel vivo que traduz emoções em estratégia
              </h2>
              <p className="text-gray-600 leading-relaxed">
                O dashboard MindQuest organiza tudo o que você precisa para tomar decisões
                com confiança. Ele mostra evolução, conquistas, pontos de atenção e próximos passos — tudo em
                um só lugar.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {dashboardHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 p-6 bg-gradient-to-br from-white to-blue-50/70 border border-blue-100 rounded-3xl shadow-md"
                  >
                    <span className="p-3 rounded-xl bg-blue-100 text-blue-600 h-min">
                      <Icon size={20} />
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-3"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                MindQuest Premium
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Upgrade para quem quer disciplina, foco e mentor sempre presente
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                No Premium, você desbloqueia interações ativas com a IA, histórico completo e acompanhamento
                humano dedicado. É como ter um painel estratégico monitorando cada passo da sua evolução.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {premiumHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl p-6 space-y-3 border border-purple-100"
                  >
                    <span className="p-3 inline-flex rounded-xl bg-purple-100 text-purple-600">
                      <Icon size={22} />
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section className="bg-white/85 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 md:p-12 space-y-10">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Como funcionam as conversas que alimentam o MindQuest
              </h2>
              <p className="text-gray-600">
                Cada diálogo gera dados, insights e recomendações. O processo foi desenhado para ser leve,
                acolhedor e altamente efetivo.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {conversationSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="bg-gradient-to-br from-white to-indigo-50/80 border border-indigo-100 rounded-3xl shadow-md p-6 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                        {index + 1}
                      </span>
                      <Icon size={20} className="text-indigo-500" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Compare: Free x Premium
              </h2>
              <p className="text-gray-600">
                Escolha o plano certo para o momento da sua jornada. É possível começar grátis e migrar
                quando sentir necessidade de mentoria ativa.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/50 shadow-xl bg-white/85 backdrop-blur-xl">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Recurso</th>
                    <th className="px-6 py-4 text-center font-semibold">Free</th>
                    <th className="px-6 py-4 text-center font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="bg-white/70">
                      <td className="px-6 py-4 font-semibold text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-gray-600 text-center">{row.free}</td>
                      <td className="px-6 py-4 text-gray-700 text-center font-medium">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 md:p-12 text-white space-y-6 border border-white/20">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Pronto para sentir a diferença na primeira semana?</h2>
              <p className="text-indigo-100 leading-relaxed max-w-3xl">
                Entre agora em uma experiência guiada, com um assistente de IA treinado para desenvolver sua inteligência emocional de forma personalizada.
Ative seu MindQuest e comece a ver os resultados em poucos minutos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:bg-indigo-50 transition"
              >
                <Users size={18} />
                Iniciar cadastro pelo WhatsApp
              </a>
              <button
                type="button"
                onClick={handleOpenChat}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/40 text-white font-semibold bg-white/10 hover:bg-white/20 transition"
              >
                <MessageSquare size={18} />
                Conversar com a Ária agora
              </button>
            </div>
            <p className="text-sm text-indigo-100 flex items-center gap-2">
              <ShieldCheck size={16} />
              Segurança garantida: tokens renovados a cada sessão, conversas criptografadas e gestão de
              acesso centralizada.
            </p>
          </section>

          <section className="space-y-8">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                FAQ oficial
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dúvidas frequentes sobre o MindQuest
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Reunimos tudo o que você precisa saber para decidir com segurança. Ainda com perguntas?
                O chat no canto inferior abre na hora.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {faqItems.map((item) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-3xl shadow-lg border border-blue-50 p-6 space-y-3"
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">
                      <Sparkles size={18} />
                    </span>
                    {item.question}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                  {item.cta ? (
                    <a
                      href={item.cta.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition"
                    >
                      <MessageSquare size={14} />
                      {item.cta.label}
                    </a>
                  ) : null}
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleOpenChat}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 transition"
              >
                <Sparkles size={16} />
                Abrir chat e falar com a Ária agora
              </button>
            </div>
          </section>
        </main>

        <footer className="relative border-t border-white/50 bg-white/80 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-gray-500">
            <span>
              © {new Date().getFullYear()} MindQuest • Powered by{' '}
              <a
                href="https://automateai.pt"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                automateai.pt
              </a>
            </span>
            <span className="text-gray-400">
              Balão roxo no canto: suporte instantâneo
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FaqPage;
