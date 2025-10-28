import SectionTitle from "./SectionTitle";
import { RESULT_POINTS, palette } from "./constants";

const Results = () => (
  <section
    className="rounded-[32px] px-6 py-14 md:px-12 lg:-mx-5 lg:px-16"
    style={{ backgroundColor: palette.card, boxShadow: palette.shadows.soft }}
  >
    <SectionTitle
      kicker="Resultados reais"
      title="O MindQuest transforma ruídos em clareza e ações em resultados."
      description="Pensamentos moldam sentimentos. Sentimentos impulsionam ações. Ações constroem resultados. Cada etapa do MindQuest foi desenhada para manter esse ciclo a seu favor."
    />
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {RESULT_POINTS.map((result, index) => (
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
              {result.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  </section>
);

export default Results;
