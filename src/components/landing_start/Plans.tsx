import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { palette } from "./constants";
import { WHATSAPP_PREMIUM_URL, WHATSAPP_URL } from "@/constants/whatsapp";

const plans = [
  {
    name: "Free",
    highlights: [
      "1 conversa por dia no WhatsApp",
      "Dashboard com humor, energia e insights",
      "Acesso imediato, sem login",
    ],
    ctaLabel: "Começar grátis",
    ctaHref: WHATSAPP_URL,
    variant: "solid",
  },
  {
    name: "Premium (em breve)",
    highlights: [
      "Sessões ilimitadas",
      "Histórico completo com busca semântica",
      "Rotinas automatizadas e mentor 24h",
    ],
    ctaLabel: "Quero ser avisado",
    ctaHref: WHATSAPP_PREMIUM_URL,
    variant: "outline",
  },
];

const Plans = () => (
  <section
    className="rounded-[32px] px-6 py-16 md:px-12"
    style={{
      backgroundColor: palette.card,
      border: `1px solid ${palette.stroke}`,
      boxShadow: "0 24px 60px -38px rgba(59, 77, 89, 0.28)",
    }}
  >
    <SectionTitle
      title="Planos"
      description="Comece grátis e evolua para o Premium quando quiser mentoria ativa."
    />

    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className="flex h-full flex-col gap-6 rounded-[28px] border p-7 shadow-sm"
          style={{
            borderColor: palette.stroke,
            backgroundColor: palette.surface,
          }}
        >
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: palette.secondary }}
            >
              {plan.name}
            </h3>
          </div>
          <ul className="space-y-2 text-sm leading-6" style={{ color: palette.secondary }}>
            {plan.highlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <a
            href={plan.ctaHref}
            onClick={(event) => {
              event.preventDefault();
              window.open(plan.ctaHref, "_blank", "noopener");
            }}
            className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition duration-200"
            style={
              plan.variant === "solid"
                ? {
                    backgroundColor: palette.primary,
                    color: palette.card,
                    boxShadow: "0 18px 40px -24px rgba(247, 171, 138, 0.6)",
                  }
                : {
                    color: palette.primary,
                    border: "1px solid rgba(247, 171, 138, 0.6)",
                    backgroundColor: "transparent",
                  }
            }
          >
            {plan.ctaLabel}
            <ArrowRight size={16} />
          </a>
        </article>
      ))}
    </div>
  </section>
);

export default Plans;
