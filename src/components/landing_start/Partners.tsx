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
          className="group relative flex flex-col items-center justify-center gap-4 rounded-3xl border p-6 text-center transition-transform duration-200 hover:-translate-y-1"
          style={{
            borderColor: "rgba(247, 171, 138, 0.35)",
            background: "linear-gradient(145deg, rgba(253, 241, 233, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)",
            boxShadow: "0 26px 50px -30px rgba(59, 77, 89, 0.35)",
          }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(247, 171, 138, 0.25), rgba(247, 171, 138, 0.05) 65%)",
              border: "1px solid rgba(247, 171, 138, 0.35)",
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
