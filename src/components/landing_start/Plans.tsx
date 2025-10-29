import { ArrowRight, Check, Minus } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { palette } from "./constants";
import { WHATSAPP_URL } from "@/constants/whatsapp";

type SummaryRow = {
  label: string;
  free: string;
  premium: string;
};

const summaryRows: SummaryRow[] = [
  { label: "Humor e energia", free: "Sim", premium: "Sim" },
  { label: "Emoções predominantes", free: "Sim", premium: "Sim" },
  { label: "Emoções detalhadas", free: "Sim", premium: "Sim" },
  { label: "Padrão mental", free: "Sim", premium: "Sim" },
  { label: "Perfil comportamental", free: "Sim", premium: "Sim" },
  { label: "Resumo das conversas", free: "Sim", premium: "Sim" },
  { label: "Resumo da semana", free: "sim", premium: "sim" },
  { label: "Lembretes e ajuda", free: "sim", premium: "sim" },
  { label: "Conversa guiada por IA", free: "1 por dia", premium: "5 por dia" },
  { label: "Desafios a partir dos insighs", free: "1 por semana", premium: "Ilimitados" },
  { label: "Histórico", free: "7 dias", premium: "Ilimitado" },
  { label: "IA para te ajudar nas metas", free: "1x/dia", premium: "5x/dia" },
  { label: "Mentor disponível", free: "—", premium: "24h" },
];

type PlansProps = {
  sectionId?: string;
};

const Plans = ({ sectionId = "recursos" }: PlansProps) => {
  const handleOpen = (href: string) => {
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener");
    }
  };

  const interpretCell = (value: string) => {
    const trimmed = value.trim();
    const normalized = trimmed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (!trimmed) {
      return { text: "—", color: palette.muted, icon: null };
    }

    if (normalized === "sim") {
      return { text: trimmed, color: palette.primary, icon: <Check size={16} /> };
    }

    if (normalized === "nao" || normalized === "não") {
      return { text: trimmed, color: palette.muted, icon: <Minus size={16} /> };
    }

    if (trimmed === "—" || trimmed === "-") {
      return { text: trimmed, color: palette.muted, icon: null };
    }

    return { text: trimmed, color: palette.secondary, icon: null };
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
        title="Free vs Premium"
        description="Experimente o ciclo completo no free. Mude para o Premium e evolua o que funcionou."
      />

      <div
        className="mt-16 overflow-hidden rounded-[32px] border"
        style={{ borderColor: palette.stroke, boxShadow: "0 18px 50px -32px rgba(28, 37, 65, 0.22)", backgroundColor: palette.card }}
      >
        <div
          className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em]"
          style={{ backgroundColor: "rgba(217, 3, 104, 0.12)", color: palette.primary }}
        >
          Recursos
        </div>
        <div
          className="hidden grid-cols-[1.4fr,0.8fr,0.8fr] gap-3 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-center md:grid"
          style={{
            color: palette.muted,
            borderBottom: `1px solid ${palette.stroke}`,
          }}
        >
          <span className="text-left md:text-left">Você vai receber</span>
          <span>Free</span>
          <span>Premium</span>
        </div>
        <div className="divide-y border-t md:border-t-0" style={{ borderColor: palette.stroke }}>
          {summaryRows.map((row) => {
            const freeCell = interpretCell(row.free);
            const premiumCell = interpretCell(row.premium);

            return (
              <div
                key={row.label}
                className="grid grid-cols-1 gap-4 px-6 py-4 text-sm leading-6 md:grid-cols-[1.4fr,0.8fr,0.8fr] md:items-center"
                style={{ color: palette.secondary }}
              >
                <span className="font-medium">{row.label}</span>
                <span className="flex items-center gap-2 md:justify-center md:text-center" style={{ color: freeCell.color }}>
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.16em] md:hidden"
                    style={{ color: palette.muted }}
                  >
                    Free
                  </span>
                  {freeCell.icon}
                  <span>{freeCell.text}</span>
                </span>
                <span className="flex items-center gap-2 md:justify-center md:text-center" style={{ color: premiumCell.color }}>
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.16em] md:hidden"
                    style={{ color: palette.muted }}
                  >
                    Premium
                  </span>
                  {premiumCell.icon}
                  <span>{premiumCell.text}</span>
                </span>
              </div>
            );
          })}
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
