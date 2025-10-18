import React from 'react';

interface CTAProps {
  ctaUrl: string;
}

const CTA: React.FC<CTAProps> = ({ ctaUrl }) => (
  <section className="bg-white py-24">
    <div className="mx-auto max-w-3xl rounded-3xl border border-indigo-100 bg-indigo-600 px-10 py-16 text-center text-white shadow-xl">
      <h2 className="text-3xl font-bold sm:text-4xl">Pronto para transformar sua mente em um painel de decisões?</h2>
      <p className="mt-4 text-base text-indigo-100">
        Comece hoje mesmo com o MindQuest. Uma conversa já é suficiente para sentir a diferença.
      </p>
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-indigo-600 transition hover:bg-indigo-100"
      >
        Falar agora com o MindQuest
      </a>
    </div>
  </section>
);

export default CTA;
