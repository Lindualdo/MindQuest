import { ArrowRight, Check, Minus } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { palette } from "./constants";
import { WHATSAPP_URL } from "@/constants/whatsapp";

type PlanSection = {
  title: string;
  items: string[];
};

type PlanCard = {
  id: "free" | "premium";
  badge: string;
  subtitle: string;
  sections: PlanSection[];
  result: string;
};

type SummaryRow = {
  label: string;
  free: boolean | string;
  premium: boolean | string;
};

const planCards: PlanCard[] = [
  {
    id: "free",
    badge: "MindQuest FREE",
    subtitle: "O que você tem",
    sections: [
      {
        title: "Conversas diárias",
        items: [
          "1 conversa guiada por dia no WhatsApp (≈8 mensagens)",
          "Resumo automático da sua semana",
        ],
      },
      {
        title: "Dashboard de evolução",
        items: [
          "Humor atual e média semanal das emoções",
          "Sabotador principal identificado",
          "Histórico dos últimos 3 dias",
          "1 ação sugerida por semana",
        ],
      },
    ],
    result: "Experimente o ciclo completo (conversa → insights → ação) e veja evolução real.",
  },
  {
    id: "premium",
    badge: "MindQuest PREMIUM",
    subtitle: "O que você ganha a mais",
    sections: [
      {
        title: "Conversas expandidas",
        items: [
          "Até 5 conversas por dia",
          "Mentor virtual 24h para qualquer dúvida",
          "Resumo mensal completo com progresso + raio-X emocional",
        ],
      },
      {
        title: "Dashboard completo",
        items: [
          "Histórico ilimitado com filtros personalizados",
          "Todos os sabotadores + contramedidas específicas",
          "Insights viram planos de ação criados pela IA",
          "Ações ilimitadas orientadas por gamificação",
        ],
      },
      {
        title: "Acompanhamento profundo",
        items: [
          "Visão 360° da sua evolução",
          "Orientações práticas de crescimento pessoal",
          "Filosofias de vida aplicadas ao seu contexto",
        ],
      },
    ],
    result: "Acelere sua evolução com suporte completo e sem limites.",
  },
];

const summaryRows: SummaryRow[] = [
  { label: "Experimentar e ver se funciona", free: true, premium: true },
  { label: "Entender padrões básicos", free: true, premium: true },
  { label: "Acelerar resultados", free: false, premium: true },
  { label: "Ter suporte contínuo", free: false, premium: true },
  { label: "Histórico completo", free: "Últimos 3 dias", premium: "Ilimitado" },
  { label: "Conversar mais", free: "1x/dia", premium: "5x/dia" },
  { label: "Mentor disponível", free: "—", premium: "24h" },
];

const planStyles: Record<PlanCard["id"], { background: string; border: string; header: string }> = {
  free: {
    background: palette.card,
    border: `1px solid ${palette.stroke}`,
    header: "rgba(217, 3, 104, 0.12)",
  },
  premium: {
    background: "rgba(217, 3, 104, 0.08)",
    border: `1px solid rgba(217, 3, 104, 0.45)`,
    header: "rgba(217, 3, 104, 0.14)",
  },
};

type PlansProps = {
  sectionId?: string;
};

const Plans = ({ sectionId = "recursos" }: PlansProps) => {
  const handleOpen = (href: string) => {
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener");
    }
  };

  const renderCell = (value: SummaryRow["free"]) => {
    if (typeof value === "boolean") {
      return value ? (
        <span className="inline-flex items-center gap-1 font-semibold" style={{ color: palette.primary }}>
          <Check size={16} /> Sim
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 font-semibold" style={{ color: palette.muted }}>
          <Minus size={16} /> Não
        </span>
      );
    }
    return <span>{value}</span>;
  };

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 rounded-[32px] px-6 py-16 md:px-12 lg:-mx-5 lg:px-16"
      style={{
        backgroundColor: palette.card,
        border: `1px solid ${palette.stroke}`,
        boxShadow: "0 24px 50px -36px rgba(59, 77, 89, 0.28)",
      }}
    >
      <SectionTitle
        title="Free vs Premium — qual conversa com você agora?"
        description="Comece de graça para sentir a evolução. Quando quiser acelerar, o Premium amplia tudo que funcionou."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {planCards.map((plan) => {
          const styles = planStyles[plan.id];
          return (
            <article
              key={plan.id}
              className="flex h-full flex-col gap-6 rounded-[28px] p-8"
              style={{ backgroundColor: styles.background, border: styles.border, boxShadow: palette.shadows.card }}
            >
              <header className="flex flex-col gap-2">
                <span
                  className="inline-flex w-fit items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                  style={{ backgroundColor: styles.header, color: palette.primary }}
                >
                  {plan.badge}
                </span>
                <h3 className="text-xl font-semibold" style={{ color: palette.secondary }}>
                  {plan.badge.replace("MindQuest ", "")}
                </h3>
                <p className="text-sm font-medium uppercase tracking-[0.18em]" style={{ color: palette.muted }}>
                  {plan.subtitle}
                </p>
              </header>

              <div className="flex flex-col gap-5">
                {plan.sections.map((section) => (
                  <section key={section.title} className="rounded-[20px] border p-5" style={{ borderColor: palette.stroke }}>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: palette.secondary }}>
                      {section.title}
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm leading-6" style={{ color: palette.muted }}>
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check size={16} style={{ color: palette.primary, marginTop: 2 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <p
                className="rounded-[20px] px-5 py-4 text-sm font-semibold leading-6"
                style={{
                  color: palette.secondary,
                  backgroundColor:
                    plan.id === "premium" ? "rgba(217, 3, 104, 0.12)" : palette.overlays.translucentCard,
                }}
              >
                {plan.result}
              </p>
            </article>
          );
        })}
      </div>

      <div
        className="mt-16 overflow-hidden rounded-[32px] border"
        style={{ borderColor: palette.stroke, boxShadow: "0 18px 50px -32px rgba(28, 37, 65, 0.22)", backgroundColor: palette.card }}
      >
        <div
          className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em]"
          style={{ backgroundColor: "rgba(217, 3, 104, 0.12)", color: palette.primary }}
        >
          Em resumo prático
        </div>
        <div
          className="grid grid-cols-1 gap-3 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-center text-[color:var(--summary-label-color)] md:grid-cols-[1.4fr,0.8fr,0.8fr]"
          style={{
            color: palette.muted,
            borderBottom: `1px solid ${palette.stroke}`,
            ["--summary-label-color" as const]: palette.muted,
          }}
        >
          <span className="text-left md:text-left">O que você quer</span>
          <span>Free</span>
          <span>Premium</span>
        </div>
        <div className="divide-y" style={{ borderColor: palette.stroke }}>
          {summaryRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-3 px-6 py-4 text-sm leading-6 md:grid-cols-[1.4fr,0.8fr,0.8fr] md:items-center"
              style={{ color: palette.secondary }}
            >
              <span className="font-medium">{row.label}</span>
              <span className="md:text-center" style={{ color: typeof row.free === "boolean" ? palette.secondary : palette.muted }}>
                {renderCell(row.free)}
              </span>
              <span className="md:text-center" style={{ color: typeof row.premium === "boolean" ? palette.secondary : palette.primary }}>
                {renderCell(row.premium)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-1 text-center text-sm font-semibold">
        <p style={{ color: palette.secondary }}>FREE = Prove para você mesmo que funciona</p>
        <p style={{ color: palette.primary }}>PREMIUM = Maximize seus resultados sem limites</p>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={() => handleOpen(WHATSAPP_URL)}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition duration-200"
          style={{
            backgroundColor: palette.buttons.primaryBg,
            color: palette.buttons.primaryText,
            boxShadow: palette.buttons.primaryShadow,
          }}
        >
          <i className="fa-brands fa-whatsapp fa-lg" aria-hidden="true" />
          Começar grátis agora
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default Plans;
