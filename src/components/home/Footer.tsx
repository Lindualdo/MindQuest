import React from 'react';
import { WHATSAPP_NUMBER } from '@/constants/whatsapp';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-10 text-center sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            MindQuest
          </p>
          <p className="text-xs text-slate-400">
            © {currentYear} MindQuest. Todos os direitos reservados.
          </p>
        </div>

        <div className="text-sm text-slate-300">
          <span className="font-semibold text-primary">WhatsApp:</span>{' '}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-4"
          >
            +{WHATSAPP_NUMBER}
          </a>
        </div>

        <div className="text-xs text-slate-400">
          Powered by{' '}
          <a
            href="https://automateai.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline decoration-dotted underline-offset-4"
          >
            AutomateAI.pt
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
