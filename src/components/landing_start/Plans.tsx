import { ArrowRight, Check } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { palette } from "./constants";
import { WHATSAPP_URL } from "@/constants/whatsapp";

type ResourceRow = {
  category: string;
  features: string[];
  free?: string;
  premium: string;
};

const resourceMap: ResourceRow[] = [
  {
    category: "Dashboard de evolução",
    features: [
      "Humor do momento e sentimentos-chave",
      "Roda de emoções com visão semanal",
      "Sabotador principal sempre atualizado",
      "Histórico de humor com gatilhos destacados",
      "Prêmios por ações e insights visuais",
      "Resumo de conversas para você revisar quando quiser",
    ],
    free: "Histórico básico dos últimos 3 dias para manter a clareza inicial.",
    premium:
      "Acesso completo com filtros avançados, histórico de emoções e sabotadores e planos guiados por IA.",
  },
  {
    category: "Chat · Assistente pessoal",
    features: [
      "Reflexão guiada no WhatsApp",
      "Captura de emoções e fatos relevantes",
    ],
    free: "1 conversa guiada por dia (≈8 trocas) para manter o hábito vivo.",
    premium: "Até 5 conversas por dia com mentor virtual ativo 24h para destravar ciclos na hora.",
  },
  {
    category: "Interações inteligentes",
    features: [
      "Convites para metas e micro ações",
      "Resumo inteligente da semana",
      "Motivação contínua com insights contra sabotadores",
    ],
    free: "1 interação orientada por semana para ajustar o rumo sem pressão.",
    premium: "Interações ilimitadas + resumo mensal completo com ações, progresso e raio X das emoções.",
  },
  {
    category: "Mentor virtual Premium",
    features: [
      "Acompanhamento total da sua jornada",
      "Conversas livres quando você precisar",
      "Visão integrada das áreas da vida",
    ],
    premium: "Incluído no Premium: práticas de vida eficientes, filosofias aplicadas e mentor 24h pensado para você.",
  },
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
        title="Recursos Free vs Premium"
        description="O plano Free entrega quase tudo. O Premium adiciona profundidade, histórico ilimitado e mentor ativo para quem quer acelerar."
      />
      <p className="mt-4 text-center text-xs uppercase tracking-[0.2em]" style={{ color: palette.muted }}>
        Premium disponível em breve — aproveite o Free agora mesmo.
      </p>

      <div
        className="mt-12 overflow-hidden rounded-[32px] border"
        style={{
          borderColor: palette.stroke,
          backgroundColor: palette.card,
          boxShadow: "0 28px 60px -42px rgba(28, 37, 65, 0.25)",
        }}
      >
        <div
          className="hidden h-full items-center justify-between gap-4 px-8 py-5 font-semibold uppercase tracking-[0.22em] text-xs text-white md:grid md:grid-cols-[1.6fr,1fr,1fr]"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(217, 3, 104, 0.92) 0%, rgba(126, 189, 194, 0.88) 100%)",
            letterSpacing: "0.22em",
          }}
        >
          <span>Recursos</span>
          <span className="text-right">Free</span>
          <span className="text-right">Premium</span>
        </div>

        <div className="divide-y" style={{ borderColor: palette.stroke }}>
          {resourceMap.map((row) => (
            <div
              key={row.category}
              className="flex flex-col gap-6 px-6 py-6 md:grid md:grid-cols-[1.6fr,1fr,1fr] md:items-start md:px-8"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: "rgba(217, 3, 104, 0.12)", color: palette.primary }}
                  >
                    {row.category}
                  </span>
                </div>
                <ul className="space-y-2 text-sm leading-6">
                  {row.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2" style={{ color: palette.secondary }}>
                      <Check size={16} style={{ color: palette.primary, marginTop: 2 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="flex flex-col gap-2 rounded-[24px] border p-5 text-sm leading-6 md:rounded-[20px]"
                style={{
                  borderColor: "rgba(247, 171, 138, 0.35)",
                  backgroundColor: palette.overlays.translucentCard,
                  color: palette.secondary,
                }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em] md:hidden"
                  style={{ color: palette.muted }}
                >
                  Free
                </span>
                {row.free ? (
                  <p>{row.free}</p>
                ) : (
                  <p style={{ color: palette.muted }}>Disponível apenas no plano Premium.</p>
                )}
              </div>

              <div
                className="flex flex-col gap-2 rounded-[24px] border p-5 text-sm leading-6 md:rounded-[20px]"
                style={{
                  borderColor: "rgba(217, 3, 104, 0.55)",
                  backgroundColor: "rgba(217, 3, 104, 0.1)",
                  color: palette.secondary,
                }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em] md:hidden"
                  style={{ color: palette.primary }}
                >
                  Premium
                </span>
                <p>{row.premium}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={() => handleOpen(WHATSAPP_URL)}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition duration-200"
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
