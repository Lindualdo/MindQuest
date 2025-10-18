import React from 'react';
import { Brain, ChevronRight, Users } from 'lucide-react';

const WHATSAPP_LINK = 'https://wa.me/351928413957';

const Hero: React.FC = () => {
  const handleOpenWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(WHATSAPP_LINK, '_blank', 'noopener');
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg md:h-16 md:w-16">
              <Brain className="h-8 w-8 text-white md:h-9 md:w-9" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-primary md:text-2xl">MINDQUEST</h2>
              <p className="text-sm text-muted-foreground md:text-base">Mente clara, resultados reais</p>
            </div>
          </div>
        </div>

        <div className="mb-6 text-center md:mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary md:text-base">
            Produtividade com bem estar mental
          </p>
        </div>

        <h1 className="mb-12 text-center text-3xl font-bold text-foreground md:mb-16 md:text-5xl lg:text-6xl">
          Tudo começa na mente.
        </h1>

        <div className="mx-auto mb-12 hidden max-w-6xl items-center justify-center gap-4 lg:flex">
          {[
            { number: '01', title: 'Pensamentos', description: 'Pensamentos moldam sentimentos.', accent: 'primary' },
            { number: '02', title: 'Sentimentos', description: 'Sentimentos impulsionam ações.', accent: 'primary' },
            { number: '03', title: 'Ações', description: 'Ações constroem resultados.', accent: 'accent' },
            { number: '04', title: 'Resultados', description: 'Resultados fazem você feliz e mudam crenças, reprogramando sua mente.', accent: 'accent' },
          ].map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="relative flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                      step.accent === 'accent' ? 'bg-accent/30 text-accent' : 'bg-primary/20 text-primary'
                    } font-bold text-lg`}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`min-h-[140px] rounded-2xl border px-6 py-4 backdrop-blur-sm ${
                      step.accent === 'accent'
                        ? 'border-accent/20 bg-accent/10'
                        : 'border-primary/20 bg-primary/10'
                    }`}
                  >
                    <h3 className="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
              {index !== 3 && (
                <ChevronRight className="mt-8 h-8 w-8 flex-shrink-0 text-primary/40" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mx-auto mb-12 grid max-w-2xl gap-6 lg:hidden md:grid-cols-2">
          {[
            { number: '01', title: 'Pensamentos', description: 'Pensamentos moldam sentimentos.', accent: 'primary' },
            { number: '02', title: 'Sentimentos', description: 'Sentimentos impulsionam ações.', accent: 'primary' },
            { number: '03', title: 'Ações', description: 'Ações constroem resultados.', accent: 'accent' },
            { number: '04', title: 'Resultados', description: 'Resultados fazem você feliz e mudam crenças, reprogramando sua mente.', accent: 'accent' },
          ].map((step) => (
            <div key={step.number} className="relative">
              <div
                className={`absolute -top-3 -left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                  step.accent === 'accent' ? 'bg-accent/30 text-accent' : 'bg-primary/20 text-primary'
                }`}
              >
                {step.number}
              </div>
              <div
                className={`rounded-2xl border px-6 pb-6 pt-8 backdrop-blur-sm ${
                  step.accent === 'accent'
                    ? 'border-accent/20 bg-accent/10'
                    : 'border-primary/20 bg-primary/10'
                }`}
              >
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mb-8 max-w-3xl text-center text-lg text-muted-foreground md:text-xl">
          Com MindQuest, você otimiza esse ciclo despertando seu potencial e realizando mais
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="group inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent px-10 py-7 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:opacity-90 hover:shadow-2xl"
          >
            <Users className="mr-2 h-5 w-5" />
            Iniciar experiência agora
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
