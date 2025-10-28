import SectionTitle from "./SectionTitle";
import { RESULT_POINTS, palette } from "./constants";

const Results = () => (
  <section
    className="rounded-[32px] px-6 py-14 md:px-12"
    style={{ backgroundColor: palette.card, boxShadow: "0 24px 60px -48px rgba(59, 77, 89, 0.35)" }}
  >
    <SectionTitle
      kicker="Resultados reais"
      title="O MindQuest transforma ruídos em clareza e ações em resultados."
      description="Tudo começa na mente: pensamentos moldam sentimentos > sentimentos inpulcionam ações > ações constroem resultados > resultados geram satisfação pessoal    "
    />
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {RESULT_POINTS.map(({ icon: Icon, title, description }) => (
        <article
          key={title}
          className="group flex h-full flex-col gap-4 rounded-[24px] border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          style={{ borderColor: palette.stroke, backgroundColor: palette.surface }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(247, 171, 138, 0.18)" }}
          >
            <Icon size={24} style={{ color: palette.primary }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: palette.secondary }}>
            {title}
          </h3>
          <p className="text-sm leading-6" style={{ color: palette.muted }}>
            {description}
          </p>
        </article>
      ))}
    </div>
  </section>
);

export default Results;
