import { Zap } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { palette } from "./constants";

type FinalCTAProps = {
  onCtaClick: (origin: string) => void;
  sectionId?: string;
};

const FinalCTA = ({ onCtaClick, sectionId }: FinalCTAProps) => (
  <section
    id={sectionId}
    className={`rounded-[32px] px-6 py-14 text-center md:px-12 lg:-mx-5 lg:px-16 ${
      sectionId ? "scroll-mt-28" : ""
    }`}
    style={{
      backgroundColor: palette.card,
      border: `1px solid ${palette.stroke}`,
      boxShadow: palette.shadows.soft,
    }}
  >
    <SectionTitle
      kicker="Chegou sua hora de organizar a mente"
      title="Tudo começa com uma conversa"
      description='Diga "oi" no WhatsApp e sinta a diferença na primeira semana.'
      kickerColor={palette.secondary}
      titleColor={palette.secondary}
      descriptionColor={palette.footer}
    />
    <div className="mt-10 flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => onCtaClick("cta-final")}
        className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] transition duration-200"
        style={{
          backgroundColor: palette.buttons.primaryBg,
          color: palette.buttons.primaryText,
          letterSpacing: "0.24em",
          boxShadow: palette.buttons.primaryShadow,
        }}
      >
        <i className="fa-brands fa-whatsapp fa-lg" aria-hidden="true" />
        Começar agora - É grátis
        <Zap size={18} />
      </button>
      <p className="text-xs uppercase tracking-[0.22em]" style={{ color: palette.footer }}>
        Acesso imediato. Sem login. Sem senha. Apenas você e sua evolução.
      </p>
    </div>
  </section>
);

export default FinalCTA;
