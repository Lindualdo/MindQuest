import { Quote } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { IMPACT_STATS, TESTIMONIALS, palette } from "./constants";

const Testimonials = () => (
  <section
    className="flex flex-col gap-12 rounded-[32px] px-6 py-14 md:px-12"
    style={{ backgroundColor: palette.offWhite }}
  >
    <SectionTitle
      kicker="Prova social"
      title="Benefícios que você vai sentir na prática"
      description="Cresça de forma natural, com suporte contínuo e sem pressão externa. Nada de metas irreais — apenas progresso consistente."
    />
    <div className="grid gap-6 md:grid-cols-3">
      {TESTIMONIALS.map((testimonial) => (
        <figure
          key={testimonial.person}
          className="flex h-full flex-col justify-between gap-6 rounded-[24px] border p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          style={{ borderColor: palette.stroke, backgroundColor: palette.surface }}
        >
          <Quote size={32} style={{ color: palette.primary }} />
          <blockquote className="text-sm leading-6" style={{ color: palette.secondary }}>
            {testimonial.quote}
          </blockquote>
          <figcaption className="flex items-center gap-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold uppercase"
              style={{ backgroundColor: palette.primary, color: palette.card }}
            >
              {testimonial.person
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="text-sm leading-5">
              <p className="font-semibold" style={{ color: palette.secondary, fontFamily: "Poppins, sans-serif" }}>
                {testimonial.person}
              </p>
              <p style={{ color: palette.muted }}>{testimonial.role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
    <div
      className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] px-6 py-5"
      style={{ backgroundColor: palette.soft }}
    >
      {IMPACT_STATS.map((stat) => (
        <div key={stat.headline} className="flex flex-col gap-1">
          <p className="text-sm font-semibold" style={{ color: palette.secondary }}>
            {stat.headline}
          </p>
          <p className="text-xs uppercase tracking-[0.24em]" style={{ color: palette.muted }}>
            {stat.detail}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
