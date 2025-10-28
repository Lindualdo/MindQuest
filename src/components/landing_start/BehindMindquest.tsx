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
    description: "MindQuest não é terapia nem app de produtividade. É autoconhecimento ativo com IA.",
  },
];

const BehindMindquest = () => (
  <section
    className="rounded-[32px] px-6 py-16 md:px-12"
    style={{
      backgroundColor: "rgba(123, 97, 255, 0.06)",
      border: "1px solid rgba(123, 97, 255, 0.25)",
      boxShadow: "0 24px 60px -40px rgba(75, 54, 180, 0.28)",
    }}
  >
    <div className="mb-10 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.32em]" style={{ color: "#5B4ACF" }}>
      <span className="flex items-center gap-2">
        <Compass size={16} />
        Por trás do MindQuest
      </span>
      <span style={{ color: palette.muted }}>Os pilares que guiam nossa metodologia</span>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
      {foundations.map((item) => (
        <article
          key={item.title}
          className="rounded-[24px] border p-6 shadow-sm"
          style={{
            borderColor: "rgba(123, 97, 255, 0.2)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "#5B4ACF" }}>
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6" style={{ color: palette.secondary }}>
            {item.description}
          </p>
        </article>
      ))}
    </div>
  </section>
);

export default BehindMindquest;
