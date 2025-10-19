import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'O que é o MindQuest?',
    answer:
      'Um assistente de IA que conversa com você pelo WhatsApp e atualiza seu dashboard com métricas emocionais e recomendações.'
  },
  {
    question: 'Como inicio meu cadastro?',
    answer: 'Clique em “Começar no WhatsApp”, diga seu nome e siga as instruções do assistente.'
  },
  {
    question: 'Por que o acesso usa token e não login/senha?',
    answer:
      'Tokens são únicos, expiram automaticamente e são renovados a cada sessão, garantindo segurança com menos fricção.'
  },
  {
    question: 'Meus dados estão protegidos?',
    answer: 'Sim. As conversas e o acesso ao painel são protegidos.'
  },
  {
    question: 'Posso usar apenas pelo celular?',
    answer: 'Sim. O fluxo via WhatsApp e o dashboard responsivo funcionam no smartphone.'
  },
  {
    question: 'O que acontece depois que eu envio minha primeira mensagem no WhatsApp?',
    answer:
      'O assistente faz perguntas guiadas para entender seu momento, gera um resumo com seus principais pontos e atualiza automaticamente seu dashboard. Ao final, seu token é renovado.'
  },
  {
    question: 'Preciso pagar algo para começar?',
    answer:
      'Não. Você começa na versão Free, com cadastro pelo WhatsApp e acesso ao dashboard completo podendo ver seu histórico das ultimas 7 conversas'
  },
  {
    question: 'E se eu não souber o que dizer na conversa?',
    answer:
      'Tudo bem. diga isso ao assistente e deixe ele te conduzir . Você pode responder por texto ou áudio. Se preferir já pode falar sobre você na primeira interação'
  },
  {
    question: 'O MindQuest é um app, um site ou um assistente virtual?',
    answer:
      'É um assistente de IA que interage via WhatsApp e conta com um dashboard web/app para acompanhar seu progresso.'
  },
  {
    question: 'Como o dashboard é atualizado?',
    answer:
      'Automaticamente ao final de cada conversa. As métricas, insights e recomendações aparecem no painel sem você precisar fazer nada.'
  },
  {
    question: 'O que ganho ao usar o MindQuest diariamente?',
    answer:
      'Clareza emocional, foco em ações pequenas e consistentes, acompanhamento visual do humor/energia, insights sobre padrões e missões que mantêm o progresso.'
  },
  {
    question: 'Qual a diferença para apps de meditação ou produtividade?',
    answer:
      'Em vez de listas de tarefas ou meditações genéricas, o MindQuest converte sua conversa em dados estruturados e recomendações personalizadas. Não é terapia; é um sistema de desenvolvimento pessoal e produtividade que prioriza o conforto mental.'
  },
  {
    question: 'Posso pausar meu progresso e continuar depois?',
    answer:
      'Sim. Você pode retomar a qualquer momento. Seus registros anteriores permanecem disponíveis no dashboard.'
  },
  {
    question: 'Como o sistema garante uso ético das minhas respostas?',
    answer:
      'As respostas servem para personalizar sua experiência e gerar métricas no painel. O acesso é controlado por token e você decide quando interagir.'
  },
  {
    question: 'Posso usar o MindQuest para desempenho no trabalho ou em relacionamentos?',
    answer:
      'Sim. O assistente adapta as recomendações ao seu contexto — organizando tudo nas 5 principais áreas da vida; financeira, relacionamentos, saúde, carreira e espiritualidade te ajudando a equilibrar todas elas.'
  },
  {
    question: 'Posso exportar meus dados ou histórico?',
    answer:
      'Sim. Você poderá solicitar exportação direta do dashboard com segurança e controle total.'
  },
  {
    question: 'Posso cancelar meu cadastro a qualquer momento?',
    answer:
      'Sim. Você pode cancelar seu cadastro direto pelo dashboard ou solicitando pelo suporte'
  },
  {
    question: 'Posso falr com minha IA pessoal direto no dashboard?',
    answer:
      'Sim. na versão Premium Você pode falar pelo WhatsApp ou peo Dashboard'
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Dúvidas frequentes sobre o MindQuest
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Reunimos tudo o que você precisa saber para decidir com segurança.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-foreground transition-all hover:underline"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden text-sm transition-all duration-200 ${
                    isOpen ? 'max-h-48 animate-accordion-down' : 'max-h-0 animate-accordion-up'
                  }`}
                >
                  <div className="pb-4 pt-0 text-muted-foreground">{faq.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
