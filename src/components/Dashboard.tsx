import React from 'react';
import { BarChart3, Zap, Lightbulb, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Evolução emocional',
    description: 'Humor, energia e tendências diárias organizadas em gráficos inteligentes.'
  },
  {
    icon: Zap,
    title: 'Gamificação motivadora',
    description: 'Pontos, streaks e conquistas que celebram cada avanço e mantêm o foco.'
  },
  {
    icon: Lightbulb,
    title: 'Insights da IA',
    description: 'Resumos automáticos, identificador de sabotadores e recomendações acionáveis.'
  },
  {
    icon: MessageSquare,
    title: 'Conversas completas',
    description: 'Texto e transcrição de áudio disponíveis para revisitar aprendizados quando quiser.'
  }
];

const Dashboard: React.FC = () => (
  <section className="bg-muted/30 py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Seu painel de progresso</h2>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Humor, energia, roda emocional, sabotador ativo, gamificação, histórico e insights — tudo organizado para
          decisões mais claras.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-lg border bg-card text-card-foreground shadow-sm border-2 bg-card p-6 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-10 grid h-56 max-w-5xl place-items-center rounded-3xl border border-dashed border-slate-300 text-sm text-muted-foreground">
        Prévia do Dashboard
      </div>
    </div>
  </section>
);

export default Dashboard;
