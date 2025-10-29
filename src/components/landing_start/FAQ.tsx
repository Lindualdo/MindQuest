import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { FAQ_ITEMS, palette } from "./constants";

type FAQProps = {
  sectionId?: string;
};

const FAQ = ({ sectionId = "faq" }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 rounded-[32px] px-6 py-16 md:px-12 lg:-mx-5 lg:px-16"
      style={{
        backgroundColor: palette.card,
        border: `1px solid ${palette.stroke}`,
        boxShadow: palette.shadows.soft,
      }}
    >
      <SectionTitle
        title="Perguntas frequentes"
        description="Reunimos as perguntas mais comuns para você decidir com segurança."
      />

      <div
        className="mx-auto mt-12 w-full max-w-3xl divide-y rounded-[28px] border shadow-lg"
        style={{ backgroundColor: palette.card, borderColor: palette.stroke, boxShadow: palette.shadows.card }}
      >
        {FAQ_ITEMS.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <div key={faq.question}>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D90368]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                style={{
                  color: palette.secondary,
                  backgroundColor: isOpen ? "rgba(217, 3, 104, 0.08)" : "transparent",
                  borderRadius: "28px",
                }}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="pr-6">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  style={{ color: palette.primary }}
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`overflow-hidden px-6 transition-all duration-300 ${
                  isOpen ? "max-h-[520px] py-2" : "max-h-0"
                }`}
              >
                <div
                  className="space-y-3 pb-6 text-sm leading-6"
                  style={{ color: palette.muted }}
                >
                  {faq.answer.paragraphs?.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                  {faq.answer.bullets && faq.answer.bullets.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5">
                      {faq.answer.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
