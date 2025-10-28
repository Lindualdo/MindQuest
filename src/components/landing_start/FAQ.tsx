import { Shield } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { FAQ_ITEMS, palette } from "./constants";

const FAQ = () => (
  <section
    className="rounded-[32px] px-6 py-14 md:px-12"
    style={{ backgroundColor: palette.card, boxShadow: "0 24px 50px -42px rgba(59, 59, 88, 0.28)" }}
  >
    <SectionTitle kicker="FAQ" title="Perguntas frequentes" />
    <div className="mt-10 space-y-4">
      {FAQ_ITEMS.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-[24px] border px-6 py-4 transition-all duration-200"
          style={{ borderColor: palette.stroke, backgroundColor: palette.surface }}
        >
          <summary
            className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-sm font-semibold"
            style={{ color: palette.secondary, fontFamily: "Poppins, sans-serif" }}
          >
            <span>{faq.question}</span>
            <Shield size={18} style={{ color: palette.primary }} />
          </summary>
          <p className="mt-3 text-sm leading-6" style={{ color: palette.muted }}>
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  </section>
);

export default FAQ;
