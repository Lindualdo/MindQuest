import React, { useMemo } from 'react';
import Hero from '../components/landing/Hero';
import Benefits from '../components/landing/Benefits';
import Dashboard from '../components/landing/Dashboard';
import Premium from '../components/landing/Premium';
import HowItWorks from '../components/landing/HowItWorks';
import Comparison from '../components/landing/Comparison';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import type { FaqItem } from '../components/landing/FAQ';

const WHATSAPP_LINK = 'https://wa.me/351928413957';

const HomePage: React.FC = () => {
  const faqItems: FaqItem[] = useMemo(
    () => [
      {
        question: 'O que é o MindQuest?',
        answer:
          'Um assistente inteligente que combina IAs especialistas em emoções, neurociência e comportamento para entregar clareza interna e ações práticas personalizadas.',
      },
      {
        question: 'Como inicio meu cadastro?',
        answer:
          'Fale com o assistente do MindQuest no WhatsApp +351 928 413 957. Enviamos um link seguro com token para ativar o dashboard em poucos minutos.',
        ctaHref: WHATSAPP_LINK,
        ctaLabel: 'Iniciar cadastro pelo WhatsApp',
      },
      {
        question: 'Por que o acesso usa token e não login/senha?',
        answer:
          'Tokens garantem máxima segurança: são únicos, expiram automaticamente e renovados após cada sessão. Mesmo que um link vaze, ele perde a validade rapidamente.',
      },
      {
        question: 'Meus dados estão protegidos?',
        answer:
          'Sim. Criptografia forte, hospedagem segura e controle de acesso rígido garantem que apenas você (e quem autorizar) visualize seus dados.',
      },
      {
        question: 'O Premium vale a pena?',
        answer:
          'Se você quer ritmo, disciplina e mentor ativo, sim. O Premium libera conversas livres, histórico completo, contramedidas imediatas e acompanhamento humano.',
      },
      {
        question: 'Posso usar o MindQuest apenas pelo celular?',
        answer:
          'Claro. O dashboard é responsivo e o fluxo via WhatsApp permite registrar e acompanhar tudo direto do smartphone.',
      },
      {
        question: 'A IA aprende comigo?',
        answer:
          'O MindQuest evolui conforme suas respostas. Ele identifica padrões, entende gatilhos e ajusta recomendações de forma contínua.',
      },
      {
        question: 'Como recupero o token se perder o link?',
        answer:
          'Abra uma nova conversa com o assistente. Ao final da sessão um novo token é gerado automaticamente.',
      },
    ],
    []
  );

  return (
    <main className="bg-slate-900 text-white">
      <Hero ctaUrl={WHATSAPP_LINK} />
      <Benefits />
      <Dashboard ctaUrl={WHATSAPP_LINK} />
      <Premium ctaUrl={WHATSAPP_LINK} />
      <HowItWorks />
      <Comparison />
      <FAQ items={faqItems} />
      <CTA ctaUrl={WHATSAPP_LINK} />
    </main>
  );
};

export default HomePage;
