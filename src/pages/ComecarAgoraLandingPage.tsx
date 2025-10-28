import { useEffect } from "react";
import LandingFooter from "@/components/landing_start/LandingFooter";
import LandingHeader from "@/components/landing_start/LandingHeader";
import FinalCTA from "@/components/landing_start/FinalCTA";
import FAQ from "@/components/landing_start/FAQ";
import Hero from "@/components/landing_start/Hero";
import PainPoints from "@/components/landing_start/Dores";
import Partners from "@/components/landing_start/Partners";
import Plans from "@/components/landing_start/Plans";
import Results from "@/components/landing_start/Results";
import BehindMindquest from "@/components/landing_start/BehindMindquest";
import { palette } from "@/components/landing_start/constants";
import { WHATSAPP_URL } from "@/constants/whatsapp";

const ComecarAgoraLandingPage = () => {
  useEffect(() => {
    document.title = "MindQuest — Sua mente fala com você todos os dias";
    const description =
      "MidQuest: Uma plataforma de evolução pessoal guiada por IA que transforma ruídos em clareza e ações em resultados.";
    const existingMeta = document.querySelector("meta[name='description']");
    if (existingMeta) {
      existingMeta.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    if (!document.querySelector('link[data-landing-font="comecar-agora"]')) {
      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Poppins:wght@600;700&display=swap";
      fontLink.setAttribute("data-landing-font", "comecar-agora");
      document.head.appendChild(fontLink);
    }
  }, []);

  const handleCtaClick = (origin: string) => {
    if (typeof window !== "undefined") {
      window.open(WHATSAPP_URL, "_blank", "noopener");
      window.dispatchEvent(new CustomEvent("mindquest:cta", { detail: { origin } }));
    }
  };

  return (
    <div
      style={{
        backgroundColor: palette.surface,
        fontFamily: 'Inter, "Open Sans", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        color: palette.secondary,
      }}
    >
      <LandingHeader onCtaClick={handleCtaClick} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-5 pb-24 pt-16 md:pt-24 lg:pt-28">
        <Hero onCtaClick={handleCtaClick} />
        <PainPoints />
        <Results />
        <FinalCTA onCtaClick={handleCtaClick} />
        <BehindMindquest />
        <Partners />
        <Plans />
        <FAQ />
        <FinalCTA onCtaClick={handleCtaClick} />
      </main>
      <LandingFooter />
    </div>
  );
};

export default ComecarAgoraLandingPage;
