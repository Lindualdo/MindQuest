import React from 'react';
import { MessageSquareText, Brain, CheckCircle, RefreshCw } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: MessageSquareText,
    title: 'Conte o que está acontecendo',
    description: 'Envie texto ou áudio pelo WhatsApp. Quanto mais contexto, maior a precisão do MindQuest.'
  },
  {
    number: '2',
    icon: Brain,
    title: 'Receba perguntas poderosas',
    description: 'A IA conduz a reflexão com técnicas de TCC e coaching, aprofundando o entendimento real do momento.'
  },
  {
    number: '3',
    icon: CheckCircle,
    title: 'Valide o insight gerado',
    description: 'O assistente entrega um resumo estruturado. Ajuste o que for preciso para que tudo reflita fielmente sua visão.'
  },
  {
    number: '4',
    icon: RefreshCw,
    title: 'Finalize com um novo token',
    description: 'Conversa encerrada, token renovado e dashboard atualizado automaticamente com métricas e recomendações.'
  }
];

const HowItWorks: React.FC = () => (
  <section id="como-funciona" className="bg-background py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 text-center">
        <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
          Como funcionam as conversas
          <br />que alimentam o MindQuest
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Cada diálogo gera dados, insights e recomendações. O processo foi desenhado para ser leve, acolhedor e altamente efetivo.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative rounded-lg border bg-card text-card-foreground shadow-sm border-2 bg-card p-6 transition-all duration-300 hover:border-primary/50"
            >
              <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                {step.number}
              </div>
              <div className="mt-2 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorks;
