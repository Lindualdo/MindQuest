import { ArrowRight } from "lucide-react";
import { palette } from "./constants";

type LandingHeaderProps = {
  onCtaClick: (origin: string) => void;
};

const LandingHeader = ({ onCtaClick }: LandingHeaderProps) => (
  <header className="sticky top-0 z-40 backdrop-blur">
    <div
      className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        borderBottom: `1px solid ${palette.stroke}`,
      }}
    >
      <a href="/" className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold"
          style={{
            backgroundColor: palette.primary,
            color: palette.card,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          MQ
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold" style={{ color: palette.secondary }}>
            MindQuest
          </p>
          <p className="text-xs font-medium" style={{ color: palette.muted }}>
            mente clara, resultados reais
          </p>
        </div>
      </a>
      <button
        type="button"
        onClick={() => onCtaClick("header")}
        className="hidden items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition duration-200 md:inline-flex"
        style={{
          backgroundColor: palette.primary,
          color: palette.card,
          letterSpacing: "0.22em",
        }}
      >
        <i className="fa-brands fa-whatsapp" aria-hidden="true" />
        <span>Começar agora</span>
        <ArrowRight size={16} />
      </button>
    </div>
  </header>
);

export default LandingHeader;
