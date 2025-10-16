import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Headset,
  HelpCircle
} from 'lucide-react';

const faqSections = [
  {
    title: 'Acesso e Segurança',
    icon: ShieldCheck,
    questions: [
      {
        question: 'Preciso fazer login para acessar esta página?',
        answer:
          'Não. A FAQ é aberta ao público para que você consiga tirar dúvidas rápidas sem precisar validar o token de acesso.'
      },
      {
        question: 'Como entro no dashboard completo?',
        answer:
          'Basta acessar o link enviado pela sua equipe LifeFlow. O token de acesso é validado automaticamente e mantém você logado por até 7 dias.'
      },
      {
        question: 'Perdi meu link de acesso. O que fazer?',
        answer:
          'Recomende solicitar um novo link ao seu consultor ou pelo canal oficial de suporte. Em minutos você recebe um token atualizado.'
      }
    ]
  },
  {
    title: 'Uso do MindQuest',
    icon: Sparkles,
    questions: [
      {
        question: 'Qual é o objetivo principal do MindQuest?',
        answer:
          'O MindQuest transforma dados de conversas e interações em insights acionáveis, ajudando você a entender padrões emocionais e avançar em suas metas.'
      },
      {
        question: 'Com que frequência os dados são atualizados?',
        answer:
          'As métricas são atualizadas sempre que novas interações são processadas. Você também pode usar o botão “Atualizar dados” no dashboard para garantir a versão mais recente.'
      },
      {
        question: 'Posso acessar o MindQuest pelo celular?',
        answer:
          'Sim. O MindQuest é responsivo e se adapta automaticamente a celulares, tablets e computadores.'
      }
    ]
  },
  {
    title: 'Privacidade e Dados',
    icon: BarChart3,
    questions: [
      {
        question: 'Quais dados o MindQuest armazena?',
        answer:
          'Somente informações necessárias para gerar relatórios e recomendações: evolução de humor, conquistas, sabotadores identificados e estatísticas de conversa.'
      },
      {
        question: 'Meus dados são compartilhados com terceiros?',
        answer:
          'Não. Os dados analisados permanecem restritos à sua equipe LifeFlow e não são comercializados ou repassados a terceiros.'
      },
      {
        question: 'Consigo solicitar a exclusão dos meus dados?',
        answer:
          'Claro. Entre em contato pelo canal de suporte informando seu e-mail ou identificador e a equipe realiza a exclusão em até 72 horas.'
      }
    ]
  },
  {
    title: 'Suporte e Contato',
    icon: Headset,
    questions: [
      {
        question: 'Como falo com o suporte?',
        answer:
          'Você pode abrir um chamado direto pelo WhatsApp oficial ou enviar um e-mail para suporte@lifeflow.com.br. O atendimento funciona de segunda a sexta, das 9h às 18h.'
      },
      {
        question: 'Existe algum material de treinamento?',
        answer:
          'Sim. A equipe disponibiliza vídeos curtos e guias rápidos. Solicite o kit de onboarding ao seu consultor LifeFlow.'
      },
      {
        question: 'Posso sugerir novas funcionalidades?',
        answer:
          'Com certeza! Nós adoramos feedbacks. Use o canal de suporte ou o formulário de sugestões enviado mensalmente para compartilhar suas ideias.'
      }
    ]
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
      (window as typeof window & { __mindquestFaqChatLoaded?: boolean }).__mindquestFaqChatLoaded = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="w-96 h-96 bg-blue-200/40 rounded-full blur-3xl absolute -top-32 -left-20" />
        <div className="w-80 h-80 bg-purple-200/40 rounded-full blur-3xl absolute top-20 right-0" />
      </div>

      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl shadow-xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="space-y-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  <HelpCircle size={16} />
                  FAQ MindQuest
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Tire suas dúvidas e descubra como aproveitar o MindQuest ao máximo
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Reunimos as perguntas mais frequentes sobre acesso, privacidade e funcionalidades para que
                  você encontre rapidamente o que precisa, mesmo sem estar logado na plataforma.
                </p>

                <p className="text-sm text-blue-700 flex items-center gap-2 bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3">
                  <HelpCircle size={18} />
                  Precisa de ajuda? Abra o balão roxo no canto da tela para conversar com o suporte.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative mx-auto"
              >
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500 flex items-center justify-center shadow-xl shadow-purple-300/40">
                  <Brain className="text-white" size={96} />
                </div>
                <div className="absolute -bottom-5 -right-4 bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl px-4 py-3">
                  <div className="text-sm font-medium text-gray-800">MindQuest 1.1</div>
                  <div className="text-xs text-gray-500">Insights inteligentes, decisões confiantes</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {faqSections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.section
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-6 border-b border-gray-100/60 flex items-center gap-3">
                    <span className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                      <Icon size={22} />
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  <div className="p-6 space-y-5">
                    {section.questions.map((item) => (
                      <div key={item.question} className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-800">{item.question}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-12 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-lg p-8 md:p-10"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Suporte quando você precisar
              </h2>
              <p className="text-gray-600 leading-relaxed">
                O agente virtual está disponível diretamente nesta página. Clique no balão roxo para pedir ajuda sobre acesso,
                onboarding ou uso das funcionalidades. Se necessário, ele encaminha você para o time humano.
              </p>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/50 bg-white/70 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} MindQuest • Uma solução LifeFlow</span>
        </div>
      </footer>
    </div>
  );
};

export default FaqPage;
