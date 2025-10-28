import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { palette } from "./constants";
import { WHATSAPP_PREMIUM_URL, WHATSAPP_URL } from "@/constants/whatsapp";

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
        "1 conversa guiada por dia via WhatsApp com perguntas acolhedoras e objetivas.",
        "Aprovação manual de resumos antes de salvar qualquer informação.",
        "Tokens renovados a cada sessão — sem login, sem senha.",
        "Suporte a texto e áudio (transcrição simples) para registrar o que importa no momento.",
      ],
      premium: [
        "Até 5 conversas por dia com continuidade inteligente do contexto.",
        "Resumos automáticos com insights e recomendações priorizadas para seus objetivos.",
        "Transcrição multimodal (texto + áudio) com análise semântica aprofundada.",
        "Memória ativa entre sessões para acelerar decisões e destravar padrões recorrentes.",
      ],
    },
  },
  {
    area: "App com informações dinâmicas",
    summary: "Veja sua evolução em painéis vivos que traduzem emoções em direção clara.",
    content: {
      free: [
        "Dashboard com humor atual, energia e sabotador mais ativo.",
        "Histórico dos últimos 3 dias com gatilhos destacados.",
        "Gráficos semanais de emoções (PANAS) e rodas sentimentais simplificadas.",
        "Checklist de micro ações guiadas (1 por semana) alinhadas ao objetivo escolhido.",
      ],
      premium: [
        "Histórico completo com filtros por período, temas e intensidade emocional.",
        "Visão por áreas da vida (trabalho, relações, saúde, finanças e propósito).",
        "Insights convertidos automaticamente em planos acionáveis com passos claros.",
        "Busca semântica nas conversas e notas para recuperar aprendizados instantaneamente.",
      ],
    },
  },
  {
    area: "IA de interações",
    summary: "Automatizamos o acompanhamento para que você mantenha o ritmo sem sentir pressão.",
    content: {
      free: [
        "Convite diário para refletir com a IA no horário que fizer sentido.",
        "Resumo inteligente ao final da semana com principais emoções e aprendizados.",
        "Sugestão de uma micro ação personalizada por semana para sair da inércia.",
        "Lembretes gentis quando um padrão emocional se repetir com frequência.",
      ],
      premium: [
        "Interações ilimitadas sob demanda para ajustar metas e rotinas sempre que precisar.",
        "Rotinas automatizadas (manhã, meio do dia, noite) adaptadas à sua agenda real.",
        "Check-ins de progresso com indicadores de consistência e energia em tempo real.",
        "Recomendações proativas baseadas em padrões emocionais, sabotadores e metas em aberto.",
      ],
    },
  },
  {
    area: "Mentor ativo 24 × 7",
    summary: "Uma camada premium para quem quer mentoria contínua baseada em neurociência e filosofia prática.",
    content: {
      free: [
        "Disponível somente no Premium (em breve).",
        "Enquanto isso, você segue evoluindo com o assistente principal e o app dinâmico.",
      ],
      premium: [
        "Mentor virtual com personalidade moldada ao seu estilo de aprendizado.",
        "Respostas em tempo real para dilemas complexos, com exemplos e exercícios aplicáveis.",
        "Integra todo o histórico de conversas, emoções e avanços para personalizar o conselho.",
        "Sugestões de técnicas avançadas (neurociência, TCC, filosofia prática) e acompanhamentos semanais.",
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
        description="Compare o que você recebe no Free e no Premium (em breve) e escolha o nível de suporte ideal."
      />

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
                  Premium (em breve)
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

      <div className="mt-12 flex flex-col items-center gap-4 md:flex-row md:justify-center">
        <button
          type="button"
          onClick={() => handleOpen(WHATSAPP_URL)}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition duration-200"
          style={{
            backgroundColor: palette.primary,
            color: palette.card,
            boxShadow: "0 18px 40px -24px rgba(247, 171, 138, 0.6)",
          }}
        >
          Começar grátis
          <ArrowRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleOpen(WHATSAPP_PREMIUM_URL)}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition duration-200"
          style={{
            backgroundColor: "transparent",
            color: palette.secondary,
            border: `1px solid ${palette.secondary}`,
          }}
        >
          Quero o Premium primeiro
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default Plans;
