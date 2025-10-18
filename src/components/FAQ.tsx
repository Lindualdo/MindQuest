import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'O que é o MindQuest?',
    answer:
      'Um assistente inteligente que combina IAs especialistas em emoções, neurociência e comportamento para entregar clareza interna e ações práticas personalizadas.'
  },
  {
    question: 'Como inicio meu cadastro?',
    answer:
      'Fale com o assistente do MindQuest no WhatsApp +351 928 413 957. Enviamos um link seguro com token para ativar o dashboard em poucos minutos.'
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
