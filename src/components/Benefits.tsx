import React from 'react';
import { Brain, Target, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Clareza emocional instantânea',
    description: 'Transforme sentimentos dispersos em métricas visuais que orientam suas próximas ações.'
  },
  {
    icon: Target,
    title: 'Diagnóstico profundo',
    description: 'Identifique sabotadores, padrões ocultos e gatilhos que travam sua evolução.'
  },
  {
    icon: TrendingUp,
    title: 'Plano em movimento',
    description: 'Receba orientações diárias e missões personalizadas para manter seu progresso constante.'
  }
];

const Benefits: React.FC = () => (
  <section className="bg-background py-24">
    <div className="container mx-auto px-4">
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
