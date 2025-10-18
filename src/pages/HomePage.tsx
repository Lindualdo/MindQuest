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
    document.title = "MindQuest - Inteligência Emocional Assistida por IA";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transforme dispersão em clareza estratégica com um assistente de IA que converte suas emoções em dados visuais e ações práticas personalizadas.');
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
