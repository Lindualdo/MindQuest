import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import Dashboard from "@/components/home/Dashboard";
import Credibility from "@/components/home/Credibility";
import Premium from "@/components/home/Premium";
import HowItWorks from "@/components/home/HowItWorks";
import Comparison from "@/components/home/Comparison";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import Partners from "@/components/home/Partners";
import Footer from "@/components/home/Footer";

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
      <Credibility /> 
      <Premium />
      <HowItWorks />
      <Comparison />
      <FAQ />
      <CTA />
      <Partners />
      <Footer />
    </main>
  );
};

export default HomePage;
