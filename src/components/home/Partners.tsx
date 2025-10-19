import React from 'react';

const partners = [
  {
    name: 'OpenAI · ChatGPT',
    logo: new URL('../../img/logos-ia/ChatGPT-Logo.png', import.meta.url).href
  },
  {
    name: 'Anthropic · Claude',
    logo: new URL('../../img/logos-ia/claude-ai-logo-rounded-hd-free-png.webp', import.meta.url).href
  },
  {
    name: 'Google · Gemini',
    logo: new URL('../../img/logos-ia/gemini.png', import.meta.url).href
  },
  {
    name: 'Meta · Meta AI',
    logo: new URL('../../img/logos-ia/Meta_AI.webp', import.meta.url).href
  }
];

const Partners: React.FC = () => (
  <section className="bg-muted/40 py-20" aria-labelledby="partners-title">
    <div className="container mx-auto px-4">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Parcerias Estratégicas
        </p>
        <h2 id="partners-title" className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
          Potencializado pelas melhores tecnologias de IA
        </h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Combinamos diferentes modelos para entregar a melhor experiência conversacional, analítica e de apoio.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/40 bg-white/80 p-6 text-center shadow-lg backdrop-blur"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              title={partner.name}
              className="h-16 w-auto object-contain"
              loading="lazy"
            />
            <span className="text-sm font-semibold text-muted-foreground">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Partners;
