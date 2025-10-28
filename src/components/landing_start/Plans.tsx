import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { palette } from "./constants";
import { WHATSAPP_URL } from "@/constants/whatsapp";

type PlanContent = {
  free: string[];
  premium: string[];
};

const planSections: Array<{
  area: string;
  summary: string;
  content: PlanContent;
}> = [
  {
    area: "Assistente de IA pessoal para conversas e reflexão",
    summary: "O coração do MindQuest: um diálogo guiado que converte sentimentos em clareza prática.",
    content: {
      free: [
        "1 conversa guiada por dia no WhatsApp com perguntas certeiras.",
        "Você aprova cada resumo antes de guardar qualquer informação.",
        "Tokens renovados a cada sessão — zero login, zero senha.",
      ],
      premium: [
        "Até 5 conversas por dia mantendo o contexto vivo.",
        "Insights automáticos com próximos passos priorizados.",
        "Memória ativa entre sessões para destravar ciclos mais rápido.",
      ],
    },
  },
  {
    area: "App com informações dinâmicas",
    summary: "Veja sua evolução em painéis vivos que traduzem emoções em direção clara.",
    content: {
      free: [
        "Dashboard com humor, energia e sabotador em tempo real.",
        "Histórico dos últimos 3 dias com gatilhos destacados.",
        "Painel semanal de emoções e micro ações orientadas.",
      ],
      premium: [
        "Histórico completo com filtros por período e área da vida.",
        "Busca semântica e planos automáticos prontos para executar.",
        "Indicadores detalhados por trabalho, relações, saúde, finanças e propósito.",
      ],
    },
  },
  {
    area: "IA de interações",
    summary: "Automatizamos o acompanhamento para que você mantenha o ritmo sem sentir pressão.",
    content: {
      free: [
        "Convite diário para refletir na hora que fizer sentido.",
        "Resumo inteligente no fim da semana.",
        "Lembretes quando padrões emocionais se repetem.",
      ],
      premium: [
        "Interações sob demanda para ajustar metas a qualquer hora.",
        "Rotinas automatizadas (manhã, meio do dia e noite) adaptadas a você.",
        "Check-ins com indicadores de consistência e energia em tempo real.",
      ],
    },
  },
  {
    area: "Mentor ativo 24 × 7",
    summary: "Uma camada premium para quem quer mentoria contínua baseada em neurociência e filosofia prática.",
    content: {
      free: ["Você evolui com o assistente principal e o app dinâmico."],
      premium: [
        "Mentor virtual 24×7 moldado ao seu estilo de aprendizado.",
        "Sugestões avançadas de neurociência, TCC e filosofia prática quando você precisa destravar.",
        "Acompanha toda a jornada para acelerar decisões difíceis com segurança.",
      ],
    },
  },
];

const Plans = () => {
  const handleOpen = (href: string) => {
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener");
    }
  };

  return (
    <section
      className="rounded-[32px] px-6 py-16 md:px-12 lg:-mx-5 lg:px-16"
      style={{
        backgroundColor: palette.card,
        border: `1px solid ${palette.stroke}`,
        boxShadow: "0 24px 50px -36px rgba(59, 77, 89, 0.28)",
      }}
    >
      <SectionTitle
        title="Planos"
        description="80% do MindQuest está no plano Free. Quando o Premium chegar, ele só adiciona turbo para quem quiser acelerar."
      />
      <p className="mt-4 text-center text-xs uppercase tracking-[0.2em]" style={{ color: palette.muted }}>
        Premium disponível em breve — aproveite o Free agora mesmo.
      </p>

      <div className="mt-12 space-y-8">
        {planSections.map((section) => (
          <article
            key={section.area}
            className="rounded-[28px] border p-8 shadow-sm transition-shadow duration-200 hover:shadow-lg"
            style={{
              borderColor: palette.stroke,
              backgroundColor: palette.surface,
            }}
          >
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold" style={{ color: palette.secondary }}>
                  {section.area}
                </h3>
                <p className="mt-2 text-sm leading-6" style={{ color: palette.muted }}>
                  {section.summary}
                </p>
              </div>
            </header>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div
                className="flex h-full flex-col gap-3 rounded-[24px] border p-6"
                style={{
                  borderColor: "rgba(247, 171, 138, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                }}
              >
                <span
                  className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ backgroundColor: "rgba(247, 171, 138, 0.18)", color: palette.secondary }}
                >
                  Free
                </span>
                <ul className="space-y-2 text-sm leading-6" style={{ color: palette.secondary }}>
                  {section.content.free.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div
                className="flex h-full flex-col gap-3 rounded-[24px] border p-6"
                style={{
                  borderColor: "rgba(247, 171, 138, 0.55)",
                  backgroundColor: "rgba(247, 171, 138, 0.12)",
                }}
              >
                <span
                  className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ backgroundColor: palette.primary, color: palette.card }}
                >
                  Premium
                </span>
                <ul className="space-y-2 text-sm leading-6" style={{ color: palette.secondary }}>
                  {section.content.premium.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
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
          <i className="fa-brands fa-whatsapp" aria-hidden="true" />
          Começar grátis agora
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default Plans;
