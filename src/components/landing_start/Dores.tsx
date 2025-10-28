import SectionTitle from "./SectionTitle";
import { PAIN_POINTS, palette } from "./constants";

const PainPoints = () => (
  <section
    className="rounded-[32px] px-6 py-14 md:px-12 lg:-mx-5 lg:px-16"
    style={{ backgroundColor: palette.card, boxShadow: "0 32px 60px -48px rgba(59, 59, 88, 0.35)" }}
  >
    <SectionTitle
      title="Situações que te prendem"
      description="Você se identifica em alguma dessas situações?"
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
            boxShadow: "0 22px 48px -40px rgba(255, 155, 113, 0.65)",
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
    <p className="mt-8 text-center text-sm leading-6" style={{ color: palette.muted }}>
      Esses pensamentos são naturais e humanos — foram “programados” em sua mente para te proteger, mas podem estar travando sua
      felicidade e crescimento pessoal.
    </p>
  </section>
);

export default PainPoints;
