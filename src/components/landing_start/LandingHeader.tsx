import { useState } from "react";
import { ArrowRight, Menu, X, MessageCircle } from "lucide-react";
import { palette } from "./constants";
import mindquestLogo from "@/img/mindquest_logo_vazado_small.png";

type NavSection = {
  id: string;
  label: string;
};

type LandingHeaderProps = {
  onCtaClick: (origin: string) => void;
  sections?: readonly NavSection[] | NavSection[];
};

const LandingHeader = ({ onCtaClick, sections = [] }: LandingHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (targetId: string) => {
    setMenuOpen(false);

    if (typeof window !== "undefined") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${targetId}`);
      }
    }
  };

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCta = (origin: string) => {
    setMenuOpen(false);
    onCtaClick(origin);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="relative">
        <div
          className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5"
          style={{
            backgroundColor: palette.overlays.header,
            borderBottom: `1px solid ${palette.stroke}`,
          }}
        >
          <a href="/" className="flex items-center gap-3">
            <img
              src={mindquestLogo}
              alt="MindQuest"
              width={40}
              height={40}
              decoding="async"
              className="h-10 w-auto"
              style={{ display: "block" }}
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold" style={{ color: palette.secondary }}>
                MindQuest
              </p>
              <p className="text-xs font-medium" style={{ color: palette.muted }}>
                mente clara, resultados reais
              </p>
            </div>
          </a>

          {sections.length > 0 ? (
            <nav className="hidden items-center gap-5 md:flex" aria-label="Seções da página">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavigate(section.id)}
                  className="text-sm font-medium text-inherit transition-colors duration-200 hover:text-[rgba(217,3,104,0.9)]"
                  style={{ color: palette.muted }}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCta("header")}
              className="hidden items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-200 md:inline-flex"
              style={{
                backgroundColor: palette.primary,
                color: palette.card,
                letterSpacing: "0.18em",
              }}
            >
              <MessageCircle size={16} aria-hidden="true" />
              <span>Começar agora</span>
              <ArrowRight size={16} />
            </button>

            {sections.length > 0 ? (
              <button
              type="button"
              onClick={handleToggleMenu}
              className="inline-flex items-center justify-center rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-200 md:hidden"
              style={{
                borderColor: palette.stroke,
                color: palette.secondary,
                backgroundColor: palette.overlays.headerButton,
              }}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            ) : null}
          </div>
        </div>

        {menuOpen && sections.length > 0 ? (
          <div
            className="absolute inset-x-5 top-full z-40 mt-3 rounded-3xl border shadow-xl md:hidden"
            style={{ borderColor: palette.stroke, backgroundColor: palette.overlays.menu }}
          >
            <nav className="flex flex-col divide-y" aria-label="Menu móvel">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNavigate(section.id)}
                  className="px-5 py-4 text-left text-sm font-medium text-inherit transition-colors duration-200 hover:bg-[rgba(217,3,104,0.08)]"
                  style={{ color: palette.secondary }}
                >
                  {section.label}
                </button>
              ))}
            </nav>
            <div className="border-t px-5 py-4" style={{ borderColor: palette.stroke }}>
              <button
                type="button"
                onClick={() => handleCta("menu-mobile")}
                className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.card,
                  letterSpacing: "0.18em",
                }}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Começar agora
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default LandingHeader;
