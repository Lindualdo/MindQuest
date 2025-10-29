import { useEffect } from "react";
import LandingFooter from "@/components/landing_start/LandingFooter";
import LandingHeader from "@/components/landing_start/LandingHeader";
import FinalCTA from "@/components/landing_start/FinalCTA";
import FAQ from "@/components/landing_start/FAQ";
import Hero from "@/components/landing_start/Hero";
import Dores from "@/components/landing_start/Dores";
import Results from "@/components/landing_start/Results";
import BehindMindquest from "@/components/landing_start/BehindMindquest";
import { palette } from "@/components/landing_start/constants";
import { WHATSAPP_URL } from "@/constants/whatsapp";

const landingSections = [
  { id: "inicio", label: "Início" },
  { id: "dores", label: "Para quem é" },
  { id: "resultados", label: "Resultados" },
  { id: "recursos", label: "Recursos" },
  { id: "pilares", label: "Método" },
  { id: "parcerias", label: "Tecnologia" },
  { id: "faq", label: "FAQ" },
  { id: "comecar", label: "Começar" },
] as const;

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
      <LandingHeader onCtaClick={handleCtaClick} sections={landingSections} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-5 pb-24 pt-16 md:pt-24 lg:pt-28">
        <Hero onCtaClick={handleCtaClick} sectionId="inicio" />
        <Dores sectionId="dores" />
        <Results sectionId="resultados" />
        <FinalCTA onCtaClick={handleCtaClick} sectionId="convite-inicial" />
        <BehindMindquest sectionId="pilares" />
        <FAQ sectionId="faq" />
        <FinalCTA onCtaClick={handleCtaClick} sectionId="comecar" />
      </main>
      <LandingFooter />
    </div>
  );
};

export default ComecarAgoraLandingPage;
