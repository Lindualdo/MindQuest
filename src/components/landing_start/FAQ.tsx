import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { FAQ_ITEMS, palette } from "./constants";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="rounded-[32px] px-6 py-14 md:px-12"
      style={{ backgroundColor: palette.card, boxShadow: "0 24px 70px -36px rgba(59, 59, 88, 0.32)" }}
    >
      <SectionTitle
        kicker="FAQ"
        title="Dúvidas frequentes sobre o MindQuest"
        description="Reunimos tudo o que você precisa saber para começar com segurança."
      />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/60 rounded-[28px] border border-white/70 bg-white/85 p-6 backdrop-blur">
        {FAQ_ITEMS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold transition-colors duration-200 hover:text-primary"
                style={{ color: palette.secondary }}
                aria-expanded={isOpen}
              >
                {faq.question}
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  style={{ color: palette.primary }}
                />
              </button>
              <div
                className={`overflow-hidden pr-1 text-sm leading-6 transition-all duration-300 ${
                  isOpen ? "max-h-44" : "max-h-0"
                }`}
              >
                <p className="pb-4" style={{ color: palette.muted }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
