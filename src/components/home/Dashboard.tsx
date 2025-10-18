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

const dashboardImages = [
  { src: new URL('../../img/humor.jpeg', import.meta.url).href, label: 'Visão geral de humor e energia' },
  { src: new URL('../../img/gameficacao.jpeg', import.meta.url).href, label: 'Gamificação e conquistas' },
  { src: new URL('../../img/historico-conversas.png', import.meta.url).href, label: 'Histórico de conversas' },
  { src: new URL('../../img/insight.png', import.meta.url).href, label: 'Lista de insights' },
  { src: new URL('../../img/insight-detalhes.png', import.meta.url).href, label: 'Detalhe do insight' },
  { src: new URL('../../img/roda-emocoes.png', import.meta.url).href, label: 'Roda das emoções' },
  { src: new URL('../../img/sabotadores.png', import.meta.url).href, label: 'Sabotadores ativos' },
  { src: new URL('../../img/humor-historico.jpeg', import.meta.url).href, label: 'Histórico de humor' }
];

const Dashboard: React.FC = () => (
  <section className="bg-muted/30 py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Seu painel de progresso</h2>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Humor, energia, roda das emoções, sabotador ativo, conquistas, gamificação, histórico de conversas, arquétipos (perfil), insights, tecnicas e reflexões — tudo organizado para
          decisões mais claras e acelerar seu desenvolvimento pessoal.
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

      <div className="mx-auto mt-12 max-w-6xl overflow-x-auto">
        <div className="flex gap-6">
          {dashboardImages.map(({ src, label }, index) => (
            <figure
              key={src}
              className="relative w-[260px] flex-shrink-0 sm:w-[320px] md:w-[360px]"
            >
              <div className="rounded-[32px] border border-white/40 bg-white/90 p-3 shadow-xl">
                <img
                  src={src}
                  alt={label || `Prévia do dashboard ${index + 1}`}
                  className="h-auto w-full rounded-[24px] border border-slate-200 object-cover"
                  loading="lazy"
                />
              </div>
              {label && (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                  {label}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Dashboard;
