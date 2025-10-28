import { palette } from "./constants";
import whatsappLogo from "@/img/WhatsApp_Logo.jpeg";

type HeroProps = {
  onCtaClick: (origin: string) => void;
};

const Hero = ({ onCtaClick }: HeroProps) => (
  <section
    className="flex flex-col items-center gap-8 rounded-[32px] p-10 text-center md:p-14 lg:-mx-5 lg:px-16"
    style={{
      backgroundColor: "#7A5432",
      boxShadow: "0 28px 80px -40px rgba(22, 29, 39, 0.55)",
    }}
  >
    <div className="flex w-full max-w-[600px] flex-col gap-6 text-[#FEFAF6] md:max-w-[680px]">
      <h1
        className="text-3xl font-semibold leading-tight md:text-4xl"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Sua mente fala com você todos os dias
      </h1>
      <p className="text-base leading-7" style={{ color: "#F4EDE4" }}>
        O MindQuest te ajuda a ouvir, entender e evoluir
      </p>
      <div className="flex flex-col items-center gap-10 text-center md:w-full md:gap-6">
        <button
          type="button"
          onClick={() => onCtaClick("hero")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] leading-relaxed text-center transition duration-200"
          style={{
            backgroundColor: "#FEFAF6",
            color: "#5A3E2B",
            fontFamily: "Montserrat, Poppins, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.2em",
            boxShadow: "0 16px 32px -18px rgba(122, 84, 50, 0.35)",
            whiteSpace: "normal",
            maxWidth: "360px",
            minWidth: "280px",
          }}
        >
          <img src={whatsappLogo} alt="WhatsApp" className="h-4 w-4" />
          Começar agora no WhatsApp
        </button>
        <span
          className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] md:mt-3"
          style={{ color: "#DDD3C3" }}
        >
          Sem login, sem senha. Apenas uma conversa
        </span>
      </div>
    </div>
  </section>
);

export default Hero;
