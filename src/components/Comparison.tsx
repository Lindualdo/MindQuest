import React from 'react';

const comparisonData = [
  {
    feature: 'Conversas com a IA',
    free: 'Registro das interações (sem diálogo ativo)',
    premium: 'Até 5 sessões diárias com 5 interações cada e respostas em tempo real'
  },
  {
    feature: 'Histórico de dados',
    free: 'Visualização dos últimos 7 dias',
    premium: 'Histórico completo com linha do tempo interativa'
  },
  {
    feature: 'Resumos e transcrições',
    free: 'Resumos automáticos e transcrição de áudio inclusos',
    premium: 'Resumos + mentoria ativa com direcionamentos focados'
  },
  {
    feature: 'Mentoria e suporte',
    free: 'Assistente virtual via FAQ',
    premium: 'Mentor dedicado, jornadas assistidas e suporte humano prioritário'
  },
  {
    feature: 'Notificações e lembretes',
    free: 'Configuração básica',
    premium: 'Automação avançada de lembretes e checkpoints estratégicos'
  }
];

const Comparison: React.FC = () => (
  <section className="bg-muted/30 py-24">
    <div className="container mx-auto px-4">
      <div className="mb-16 text-center">
        <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
          Compare: <span className="text-primary">Free</span> x <span className="text-accent">Premium</span>
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Escolha o plano certo para o momento da sua jornada. É possível começar grátis e migrar quando sentir necessidade de mentoria ativa.
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-4 hidden grid-cols-3 gap-4 px-4 md:grid">
          <div className="font-semibold text-foreground">Recurso</div>
          <div className="text-center font-semibold text-primary">Free</div>
          <div className="text-center font-semibold text-accent">Premium</div>
        </div>

        {comparisonData.map((item) => (
          <div key={item.feature} className="mb-4 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="font-semibold text-foreground md:flex md:items-center">
                <span className="mb-2 block text-sm text-muted-foreground md:hidden">Recurso:</span>
                {item.feature}
              </div>
              <div className="text-muted-foreground md:flex md:items-center md:justify-center md:text-center">
                <span className="mb-1 block text-sm font-semibold text-primary md:hidden">Free:</span>
                <span className="text-sm">{item.free}</span>
              </div>
              <div className="text-muted-foreground md:flex md:items-center md:justify-center md:text-center">
                <span className="mb-1 block text-sm font-semibold text-accent md:hidden">Premium:</span>
                <span className="text-sm">{item.premium}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Comparison;
