import { useEffect } from "react";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Dashboard from "@/components/Dashboard";
import Premium from "@/components/Premium";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

const HomePage = () => {
  useEffect(() => {
    document.title = "MindQuest — Produtividade com conforto mental";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Converse com sua mente pelo WhatsApp e veja seu progresso em um painel interativo. Cadastre-se grátis — só diga seu nome. Clareza emocional em minutos, sem login e sem senha.'
      );
    }
  }, []);

  return (
    <main className="landing-theme min-h-screen bg-background text-foreground">
      <Hero />
      <Benefits />
      <Dashboard />
      <Premium />
      <HowItWorks />
      <Comparison />
      <FAQ />
      <CTA />
    </main>
  );
};

export default HomePage;
