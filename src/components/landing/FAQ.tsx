import React from 'react';

export interface FaqItem {
  question: string;
  answer: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface FAQProps {
  items: FaqItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => (
  <section className="bg-slate-950 py-24 text-white">
    <div className="mx-auto max-w-5xl px-6">
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-200">
          FAQ
        </span>
        <h2 className="mt-6 text-3xl font-bold sm:text-4xl">Perguntas frequentes</h2>
        <p className="mt-4 text-base text-indigo-100">
          Tudo o que você precisa para iniciar com confiança.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
          >
            <summary className="flex cursor-pointer items-center justify-between text-left text-lg font-semibold text-white outline-none">
              {item.question}
              <span className="ml-4 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-indigo-200 transition group-open:bg-indigo-500 group-open:text-white">
                Ver resposta
              </span>
            </summary>
            <p className="mt-4 text-sm text-indigo-100">{item.answer}</p>
            {item.ctaHref && item.ctaLabel && (
              <a
                href={item.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-full bg-indigo-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-indigo-400"
              >
                {item.ctaLabel}
              </a>
            )}
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;
