import SectionTitle from "./SectionTitle";
import { PAIN_POINTS, palette } from "./constants";

type PainPointsProps = {
  sectionId?: string;
};

const PainPoints = ({ sectionId = "dores" }: PainPointsProps) => (
  <section
    id={sectionId}
    className="scroll-mt-28 rounded-[32px] px-6 py-14 md:px-12 lg:-mx-5 lg:px-16"
    style={{ backgroundColor: palette.card, boxShadow: palette.shadows.soft }}
  >
    <SectionTitle
      title="Pare de ser refém da sua própria mente"
      description="Quanto tempo você vai deixar sua mente trabalhar contra você?"
    />
    <div className="mt-10 grid gap-5 md:grid-cols-2">
      {PAIN_POINTS.map((pain) => (
        <article
          key={pain.title}
          className="flex h-full flex-col gap-2 rounded-[24px] p-5 transition-transform duration-200 hover:-translate-y-1"
          style={{
            backgroundColor: palette.warmSurface,
            borderLeft: `4px solid ${palette.accent}`,
            borderTopRightRadius: "28px",
            borderBottomRightRadius: "28px",
            boxShadow: palette.shadows.card,
          }}
        >
          <h3
            className="text-base font-semibold leading-6"
            style={{ color: palette.secondary, fontFamily: "Poppins, sans-serif" }}
          >
            {pain.title}
          </h3>
          <p className="text-sm leading-6" style={{ color: palette.muted }}>
            {pain.description}
          </p>
        </article>
      ))}
    </div>
  </section>
);

export default PainPoints;
