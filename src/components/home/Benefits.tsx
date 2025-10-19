import React from 'react';
import { Brain, Target, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Clareza emocional instantânea',
    description: 'Visualize como está se sentindo em segundos com métricas visuais que orientam suas próximas ações.'
  },
  {
    icon: Target,
    title: 'Descoberta de padrões',
    description: 'Identifique gatilhos, tendências e pontos cegos que limitam sua evolução.'
  },
  {
    icon: TrendingUp,
    title: 'Plano em movimento',
    description: 'Transforme cada insight em pequenas ações diárias guiadas pelo seu assistente.'
  }
];

const Benefits: React.FC = () => (
  <section className="bg-background py-24">
    <div className="container mx-auto px-4">
      <div className="mb-10 max-w-3xl">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Um painel que transforma emoção em estratégia
        </h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Você conversa com sua{' '}
          <span className="font-semibold text-primary">IA pessoal pelo WhatsApp</span> e o MindQuest alimenta seu {' '}
          <span className="font-semibold text-primary">dashboard com evolução</span>, conquistas e próximos passos —
          tudo em um só lugar.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="rounded-lg border bg-card text-card-foreground shadow-sm border-2 bg-gradient-to-br from-card to-muted/20 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">{benefit.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Benefits;
