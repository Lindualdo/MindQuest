import SectionTitle from "./SectionTitle";
import { IMMEDIATE_BENEFITS, RESULT_POINTS, palette, type ResultPoint } from "./constants";

type ResultsProps = {
  sectionId?: string;
};

const Results = ({ sectionId = "resultados" }: ResultsProps) => (
  <section
    id={sectionId}
    className="scroll-mt-28 rounded-[32px] px-6 py-14 md:px-12 lg:-mx-5 lg:px-16"
    style={{ backgroundColor: palette.card, boxShadow: palette.shadows.soft }}
  >
    <SectionTitle
      kicker="Resultados reais"
      title="O MindQuest transforma ruídos em clareza e ações em resultados"
      description="Pensamentos moldam sentimentos. Sentimentos impulsionam ações. Ações constroem resultados. Cada etapa do MindQuest foi desenhada para manter esse ciclo a seu favor."
    />
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {RESULT_POINTS.map((result: ResultPoint, index) => (
        <article
          key={result.title}
          className="group flex h-full flex-col gap-4 rounded-[24px] border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          style={{ borderColor: palette.stroke, backgroundColor: palette.surface }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold"
            style={{ backgroundColor: "rgba(247, 171, 138, 0.18)", color: palette.primary }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className="text-lg font-semibold" style={{ color: palette.secondary }}>
            {result.title}
          </h3>
          <p className="text-sm leading-6" style={{ color: palette.muted }}>
            {result.description}
          </p>
          {result.bullets ? (
            <ul className="mt-2 space-y-2 pl-5 text-sm leading-6" style={{ color: palette.muted, listStyleType: "disc" }}>
              {result.bullets.map((bullet: string) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
    <p className="mt-12 text-center text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: palette.muted }}>
      MindQuest não é terapia nem app de produtividade. É evolução pessoal guiado por IA.
    </p>
    <div
      className="mt-14 rounded-[28px] border p-6 md:p-8"
      style={{ backgroundColor: palette.offWhite, borderColor: palette.stroke }}
    >
      <h3 className="text-lg font-semibold" style={{ color: palette.secondary }}>
        Benefícios imediatos
      </h3>
      <p className="mt-2 text-sm leading-6" style={{ color: palette.muted }}>
        Resultados que aparecem desde a primeira semana — clareza mental, hábitos consistentes e motivação que dura.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {IMMEDIATE_BENEFITS.map((benefit, index) => (
          <li
            key={benefit.title}
            className="flex items-start gap-4 rounded-[20px] border p-4"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.stroke,
              boxShadow: palette.shadows.soft,
            }}
          >
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: "rgba(217, 3, 104, 0.12)", color: palette.primary }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold leading-5" style={{ color: palette.secondary }}>
                {benefit.title}
              </h4>
              <p className="text-sm leading-6" style={{ color: palette.muted }}>
                {benefit.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Results;
