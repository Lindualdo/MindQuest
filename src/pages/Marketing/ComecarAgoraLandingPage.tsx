import { Suspense, lazy, useEffect, useState } from "react";
import LandingFooter from "@/components/landing_start/LandingFooter";
import LandingHeader from "@/components/landing_start/LandingHeader";
import Hero from "@/components/landing_start/Hero";
import { palette } from "@/components/landing_start/constants";
import { WHATSAPP_URL } from "@/constants/whatsapp";

const LazyDores = lazy(() => import("@/components/landing_start/Dores"));
const LazyResults = lazy(() => import("@/components/landing_start/Results"));
const LazyFinalCTA = lazy(() => import("@/components/landing_start/FinalCTA"));
const LazyPlans = lazy(() => import("@/components/landing_start/Plans"));
const LazyBehindMindquest = lazy(() => import("@/components/landing_start/BehindMindquest"));
const LazyFAQ = lazy(() => import("@/components/landing_start/FAQ"));

const landingSections = [
  { id: "inicio", label: "Início" },
  { id: "dores", label: "Para quem é" },
  { id: "resultados", label: "Resultados" },
  { id: "recursos", label: "Planos" },
  { id: "faq", label: "FAQ" },
] as const;

const ComecarAgoraLandingPage = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const pageTitle = "MindQuest — Mente clara, resultados reais";
    const description =
      "MidQuest: Uma plataforma de evolução pessoal guiada por IA que transforma ruídos em clareza e ações em resultados.";
    const ogImagePath = "/mindquest_logo_vazado.png";
    const imageUrl =
      typeof window !== "undefined" ? `${window.location.origin}${ogImagePath}` : ogImagePath;

    document.title = pageTitle;

    const setMetaTag = (attribute: "name" | "property", attributeValue: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}='${attributeValue}']`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, attributeValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
      return meta;
    };

    const existingMeta = document.querySelector("meta[name='description']");
    if (existingMeta) {
      existingMeta.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    setMetaTag("property", "og:title", pageTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:url", typeof window !== "undefined" ? window.location.href : "");
    setMetaTag("property", "og:type", "website");

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", pageTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", imageUrl);

    setHasMounted(true);
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
        <LazySection mounted={hasMounted} height={520}>
          <LazyDores sectionId="dores" />
        </LazySection>
        <LazySection mounted={hasMounted} height={520}>
          <LazyResults sectionId="resultados" />
        </LazySection>
        <LazySection mounted={hasMounted} height={420}>
          <LazyFinalCTA onCtaClick={handleCtaClick} sectionId="convite-inicial" />
        </LazySection>
        <LazySection mounted={hasMounted} height={720}>
          <LazyPlans sectionId="recursos" />
        </LazySection>
        <LazySection mounted={hasMounted} height={540}>
          <LazyBehindMindquest sectionId="pilares" />
        </LazySection>
        <LazySection mounted={hasMounted} height={520}>
          <LazyFAQ sectionId="faq" />
        </LazySection>
        <LazySection mounted={hasMounted} height={380}>
          <LazyFinalCTA onCtaClick={handleCtaClick} sectionId="comecar" />
        </LazySection>
      </main>
      <LandingFooter />
    </div>
  );
};

export default ComecarAgoraLandingPage;

type LazySectionProps = {
  mounted: boolean;
  height: number;
  children: React.ReactNode;
};

const LazySection = ({ mounted, height, children }: LazySectionProps) => (
  <Suspense fallback={<SectionSkeleton height={height} />}>
    {mounted ? children : <SectionSkeleton height={height} />}
  </Suspense>
);

const SectionSkeleton = ({ height }: { height: number }) => (
  <div
    aria-hidden="true"
    style={{
      minHeight: height,
      borderRadius: "32px",
      background:
        "linear-gradient(120deg, rgba(247, 233, 244, 0.55), rgba(231, 242, 245, 0.45))",
    }}
    className="animate-pulse"
  />
);
