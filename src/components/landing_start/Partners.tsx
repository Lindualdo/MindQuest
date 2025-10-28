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
    className="rounded-[32px] px-6 py-14 md:px-12 lg:-mx-5 lg:px-16"
    style={{ backgroundColor: palette.card, border: `1px solid ${palette.stroke}`, boxShadow: palette.shadows.soft }}
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
          className="group relative flex flex-col items-center justify-center gap-4 rounded-3xl border p-6 text-center transition-transform duration-200 hover:-translate-y-1"
          style={{
            borderColor: palette.stroke,
            backgroundColor: palette.card,
            boxShadow: palette.shadows.card,
          }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
            style={{
              backgroundColor: palette.soft,
              border: `1px solid ${palette.neutral}`,
            }}
          >
            <img
              src={partner.logo}
              alt={partner.name}
              title={partner.name}
              className="h-10 w-10 object-contain"
              loading="lazy"
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: palette.secondary }}>
            {partner.name}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default Partners;
