import { Compass } from "lucide-react";
import { palette } from "./constants";

const foundations = [
  {
    title: "Neurociência aplicada",
    description: "Conversas objetivas, sem jargão.",
  },
  {
    title: "Psicologia comportamental",
    description: "Big Five, PANAS e TCC traduzidos em práticas simples.",
  },
  {
    title: "Filosofias práticas",
    description: "Roda da Vida, sabotadores e estoicismo adaptados ao dia a dia.",
  },
  {
    title: "Posicionamento",
    description: "MindQuest não é terapia nem app de produtividade. É evolução pessoal guiado por IA.",
  },
];

const BehindMindquest = () => (
  <section
    className="rounded-[32px] px-6 py-16 md:px-12 lg:-mx-5 lg:px-16"
    style={{
      backgroundColor: palette.card,
      border: `1px solid ${palette.stroke}`,
      boxShadow: "0 24px 50px -38px rgba(59, 77, 89, 0.28)",
    }}
  >
    <div className="mb-10 flex flex-col gap-4 text-center">
      <span className="mx-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: palette.primary }}>
        <Compass size={16} />
        Por trás do MindQuest
      </span>
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl" style={{ color: palette.secondary }}>
          Os pilares que sustentam nossa metodologia
        </h2>
        <p className="mt-3 text-base leading-7" style={{ color: palette.muted }}>
          Cada conversa, insight e ação é construída sobre fundamentos sólidos para garantir evolução real e consistente.
        </p>
      </div>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
      {foundations.map((item) => (
        <article
          key={item.title}
          className="rounded-[24px] border p-6 shadow-sm"
          style={{
            borderColor: palette.stroke,
            backgroundColor: palette.surface,
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: palette.secondary }}>
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6" style={{ color: palette.muted }}>
            {item.description}
          </p>
        </article>
      ))}
    </div>
  </section>
);

export default BehindMindquest;
