import React from 'react';
import { Crown, MessageCircle, Map, Users, BellRing } from 'lucide-react';
import { WHATSAPP_URL } from '@/constants/whatsapp';

const premiumFeatures = [
  {
    icon: MessageCircle,
    title: 'Conversas ativas com a IA',
    description: 'Converse em tempo real a qualquer hora do dia com a versão evoluida de sua mente.'
  },
  {
    icon: Map,
    title: 'Jornadas personalizadas',
    description: 'Seu assistente irá te guiar nas jornadas e juntos vocês celebrarão cada conquista.'
  },
  {
    icon: Users,
    title: 'Suporte estratégico',
    description: 'IAs guiadas pelos avanços da neurociência, para ajudar você a pensar melhor, agir com confiança e liberar todo o seu potencial.'
  },
  {
    icon: BellRing,
    title: 'Automação de lembretes',
    description: 'Checkpoints estratégicos, alertas e reforços para manter o ritmo diário.'
  }
];

const Premium: React.FC = () => {
  const handleOpenWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(WHATSAPP_URL, '_blank', 'noopener');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.1),transparent_50%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2">
            <Crown className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-accent">MindQuest Premium</span>
          </div>

          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Para quem quer disciplina, foco
            <br />e mentor sempre presente
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            No Premium, você desbloqueia interações ativas com a IA, histórico completo, informções mais detalhadas e um mentor 24 hs por dia. Uma versão evoluida de sua mente te guiando
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {premiumFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border bg-card text-card-foreground shadow-sm border-2 border-accent/20 bg-card/80 p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-accent to-primary px-10 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl"
          >
            <Crown className="mr-2 h-5 w-5" />
            Descobrir o Premium
          </button>
        </div>
      </div>
    </section>
  );
};

export default Premium;
