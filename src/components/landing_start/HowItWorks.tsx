import SectionTitle from "./SectionTitle";
import { HOW_IT_WORKS, palette } from "./constants";

type HowItWorksProps = {
  onCtaClick: (origin: string) => void;
};

const HowItWorks = ({ onCtaClick }: HowItWorksProps) => (
  <section
    className="rounded-[32px] px-6 py-14 md:px-12"
    style={{ backgroundColor: palette.card, boxShadow: "0 24px 80px -48px rgba(59, 59, 88, 0.28)" }}
  >
    <SectionTitle
      kicker="O que é MindQuest"
      title="Plataforma de evolução pessoal guiada por IA que transforma ruídos em clareza e ações em resultados."
      description="Conversa → Insight → Ação → Progresso"
    />
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {HOW_IT_WORKS.map(({ icon: Icon, title, description, extra }) => (
        <article
          key={title}
          className="group flex h-full flex-col gap-4 rounded-[24px] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          style={{ backgroundColor: palette.surface, border: `1px solid ${palette.stroke}` }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(247, 171, 138, 0.12)" }}
          >
            <Icon size={24} style={{ color: palette.primary }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: palette.secondary }}>
            {title}
          </h3>
          <p className="text-sm leading-6" style={{ color: palette.muted }}>
            {description}
          </p>
          {extra ? (
            <p className="text-sm leading-6" style={{ color: palette.muted }}>
              {extra}
            </p>
          ) : null}
        </article>
      ))}
    </div>
    <div className="mt-12 flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => onCtaClick("como-funciona")}
        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition duration-200"
        style={{
          backgroundColor: palette.primary,
          color: palette.card,
          letterSpacing: "0.2em",
          boxShadow: "0 16px 40px -26px rgba(247, 171, 138, 0.45)",
        }}
      >
        Ver como funciona
      </button>
      <p className="text-xs uppercase tracking-[0.24em]" style={{ color: palette.muted }}>
        Começar agora no WhatsApp - É grátis
      </p>
    </div>
  </section>
);

export default HowItWorks;
