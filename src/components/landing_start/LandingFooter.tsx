import { palette } from "./constants";

const LandingFooter = () => (
  <footer style={{ backgroundColor: palette.footer }}>
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-10 text-center text-sm text-white/80">
      <p>
        <strong>MindQuest</strong> | mente clara, resultados reais
      </p>
      <p>
        Dúvidas? <strong>suporte@mindquest.pt</strong>
      </p>
      <p>© 2025 MindQuest. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default LandingFooter;
