import React from 'react';
import { WHATSAPP_URL } from '@/constants/whatsapp';

const comparisonData = [
  {
    feature: 'Investimento',
    free: '€0 — versão gratuita',
    premium: 'Em breve'
  },
  {
    feature: 'Cadastro',
    free: 'Pelo WhatsApp, informando apenas o nome',
    premium: 'O mesmo fluxo, com ativação do plano Premium'
  },
  {
    feature: 'Conversas com a IA',
    free: 'Registro diário. Uma conversa por dia',
    premium: 'Até 5 sessões diárias'
  },
  {
    feature: 'Histórico das conversas',
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
    premium: 'Mentor dedicado, jornadas assistidas e suporte prioritário'
  },
  {
    feature: 'Notificações e lembretes',
    free: 'Configuração básica',
    premium: 'Automação avançada de lembretes e checkpoints estratégicos'
  },
  {
    feature: 'Disponibilidade',
    free: 'Acesso imediato pelo WhatsApp',
    premium: 'Cadastre-se para ser avisado no lançamento'
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/20 bg-card p-6 text-center shadow-sm">
            <div className="text-lg font-bold text-primary">Free</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Converse com sua mente pelo WhatsApp e veja seu progresso em um painel interativo. Cadastre-se grátis - apenas seu nome e começe já 
            </p>
            <a
              href={WHATSAPP_URL}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Começar grátis
            </a>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-card p-6 text-center shadow-sm">
            <div className="text-lg font-bold text-accent">Premium</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Conversas ativas, histórico completo, jornadas personalizadas e automações inteligentes. Em breve.
            </p>
            <a
              href={WHATSAPP_URL}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent/10"
            >
              Quero ser avisado
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Comparison;
