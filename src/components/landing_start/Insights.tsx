import { INSIGHT_POINTS, palette } from "./constants";

const Insights = () => (
  <section
    className="rounded-[32px] px-6 py-12 md:px-12"
    style={{ backgroundColor: palette.surface, border: `1px solid ${palette.stroke}` }}
  >
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div
        className="rounded-[24px] p-6 text-center"
        style={{ backgroundColor: palette.warmSurface, border: `1px solid ${palette.accent}` }}
      >
        <p className="text-base leading-7" style={{ color: palette.secondary }}>
          Nada disso é fraqueza. São padrões mentais que sua mente criou para te proteger — mas que hoje te impedem de
          avançar.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {INSIGHT_POINTS.map((text) => (
          <article
            key={text}
            className="rounded-[24px] border p-6"
            style={{ borderColor: palette.stroke, backgroundColor: palette.card }}
          >
            <p className="text-sm leading-6" style={{ color: palette.muted }}>
              {text}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Insights;
