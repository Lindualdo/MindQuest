import SectionTitle from "./SectionTitle";
import { palette } from "./constants";

const partners = [
  {
    name: "OpenAI · ChatGPT",
    logo: new URL("../../img/logos-ia/ChatGPT-Logo.png", import.meta.url).href,
  },
  {
    name: "Anthropic · Claude",
    logo: new URL("../../img/logos-ia/claude-ai-logo-rounded-hd-free-png.webp", import.meta.url).href,
  },
  {
    name: "Google · Gemini",
    logo: new URL("../../img/logos-ia/gemini.png", import.meta.url).href,
  },
  {
    name: "Meta · Meta AI",
    logo: new URL("../../img/logos-ia/Meta_AI.webp", import.meta.url).href,
  },
];

const Partners = () => (
  <section
    className="rounded-[32px] px-6 py-14 md:px-12"
    style={{ backgroundColor: palette.card, border: `1px solid ${palette.stroke}`, boxShadow: "0 28px 70px -48px rgba(59, 59, 88, 0.3)" }}
  >
    <SectionTitle
      kicker="Parcerias estratégicas"
      title="Potencializado pelas melhores tecnologias de IA"
      description="Combinamos diferentes modelos para entregar a melhor experiência conversacional, analítica e de apoio."
    />
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {partners.map((partner) => (
        <div
          key={partner.name}
          className="flex flex-col items-center justify-center gap-4 rounded-3xl border p-6 text-center shadow-lg"
          style={{
            borderColor: "rgba(255, 255, 255, 0.6)",
            backgroundColor: "rgba(255, 255, 255, 0.82)",
            boxShadow: "0 24px 40px -32px rgba(59, 77, 89, 0.35)",
          }}
        >
          <img
            src={partner.logo}
            alt={partner.name}
            title={partner.name}
            className="h-12 w-auto object-contain"
            loading="lazy"
          />
          <span className="text-sm font-semibold" style={{ color: palette.muted }}>
            {partner.name}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default Partners;
