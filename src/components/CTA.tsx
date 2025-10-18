import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';

const CTA: React.FC = () => {
  const handleOpenWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open('https://wa.me/351928413957', '_blank', 'noopener');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Pronto para sentir a diferença
            <br />na primeira semana?
          </h2>

          <p className="mb-10 text-xl text-white/90 leading-relaxed">
            Entre agora em uma experiência guiada, com um assistente de IA treinado para desenvolver sua inteligência emocional de forma personalizada.
            Ative seu MindQuest e comece a ver os resultados em poucos minutos.
          </p>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center rounded-full bg-white px-10 py-7 text-lg font-semibold text-primary shadow-2xl transition-all duration-300 hover:bg-white/95 hover:shadow-3xl"
          >
            Iniciar cadastro pelo WhatsApp
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>

          <div className="mt-10 flex items-center justify-center gap-2 text-white/80">
            <Shield className="h-5 w-5" />
            <p className="text-sm">
              Segurança garantida: tokens renovados a cada sessão, conversas criptografadas e gestão de acesso centralizada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
