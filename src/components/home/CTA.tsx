import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { WHATSAPP_URL } from '@/constants/whatsapp';

const CTA: React.FC = () => {
  const handleOpenWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(WHATSAPP_URL, '_blank', 'noopener');
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
          Comece agora pelo WhatsApp e veja seu primeiro insight em menos de 5 minutos.
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
              Acesso por token renovado a cada sessão. Sem login e sem senha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
