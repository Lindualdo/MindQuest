
export const baseColors = {
  dogwoodRose: "#D90368",
  spaceCadet: "#1C2541",
  palePurple: "#FFE4FA",
  bleuDeFrance: "#3083DC",
  verdigris: "#7EBDC2",
  verdigrisMist: "#eef4f5ff",
  white: "#FFFFFF",
  nearWhite: "#FCF8FF",
};

const rgba = (hex: string, alpha: number) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const offWhiteBase = baseColors.verdigrisMist;

export const palette = {
  surface: baseColors.palePurple,
  card: offWhiteBase,
  offWhite: offWhiteBase,
  primary: baseColors.dogwoodRose,
  secondary: baseColors.spaceCadet,
  accent: baseColors.bleuDeFrance,
  supportive: baseColors.verdigris,
  footer: baseColors.spaceCadet,
  muted: "#4F5779",
  stroke: rgba(baseColors.spaceCadet, 0.14),
  soft: "#F9EEFF",
  warmSurface: "#F4E1FF",
  neutral: "#E4E9FB",
  overlays: {
    header: rgba(offWhiteBase, 0.92),
    headerButton: rgba(offWhiteBase, 0.9),
    menu: rgba(offWhiteBase, 0.96),
    translucentCard: rgba(offWhiteBase, 0.92),
  },
  hero: {
    background: baseColors.spaceCadet,
    headline: baseColors.white,
    subtext: "#D6DCF5",
    helper: rgba(baseColors.verdigris, 0.9),
    buttonBg: baseColors.dogwoodRose,
    buttonText: baseColors.white,
    buttonShadow: "0 18px 40px -24px rgba(217, 3, 104, 0.45)",
  },
  buttons: {
    primaryBg: baseColors.dogwoodRose,
    primaryText: baseColors.white,
    primaryShadow: "0 18px 40px -24px rgba(217, 3, 104, 0.45)",
  },
  shadows: {
    soft: "0 24px 60px -48px rgba(28, 37, 65, 0.18)",
    medium: "0 32px 80px -40px rgba(28, 37, 65, 0.26)",
    card: "0 22px 48px -36px rgba(28, 37, 65, 0.22)",
  },
};

export const PAIN_POINTS = [
  {
    title: "Ideias incríveis na cabeça, mas trava na hora de agir",
    description: "o medo do 'inperfeito' trava tudo antes de começar e o sonho fica só no papel",
  },
  {
    title: "Começa projetos com empolgação, ma depois a motivação evapora",
    description: "A energia inicial se perde no meio do caminho deixando um monte de 'quase' e frustração",
  },
  {
    title: "Sente que merece mais da vida, mas o esforço duro nunca dá resultado",
    description: "Esse ciclo de culpa e frustração, mina cada vez mais sua energia ",
  },
  {
    title: "Cobra-se o tempo todo, alcança resultados mas não se sente realizado",
    description: "A autocrítica constante rouba o prazer das conquistas.",
  },
  {
    title: "Quer agradar todo mundo e acaba se esgotando",
    description: "Diz 'sim' para os outros mas não tem tempo e energia para você",
  },
  {
    title: "Vive em loops infinitos de pensamentos, mas não chega a nenhum lugar",
    description: "Sua mente vira uma prisão cheia de 'e se', mas sem ações práticas",
  },
  {
    title: "Foge do desconforto com distrações, mas os problemas voltam piores",
    description: "Esse ciclo bloqeia o avanço que tanto você deseja mas nunca chega",
  },
  {
    title: "Precisa controlar cada detalhe para se sentir seguro",
    description: "Mas o cansaço chega quando a vida sai do roteiro e você se sente isolado",
  },
  {
    title: "Várias conquistas no trabalho e outras área, mas em você sente um vazio",
    description: "É só isso? – sucesso que não aquece o coração.",
  },
  {
    title: "Enxerga riscos em cada canto, e esse alerta constante rouba momentos felizes",
    description: "Isso gera tensão, cansaço físico e mental",
  },
];

export const INSIGHT_POINTS = [
  "Sua mente não é o problema — ela só está tentando te proteger de formas que não funcionam mais.",
  "O MindQuest não te ensina a ser outra pessoa. Ele te ajuda a descobrir quem você é por dentro — e usar isso a seu favor para evoluir de verdade.",
];

export type ResultPoint = {
  title: string;
  description: string;
  bullets?: string[];
};

export const RESULT_POINTS: ResultPoint[] = [
  {
    title: "Transforme ruído mental em informações organizadas",
    description:
      "Com menos de 10 minutos de conversa por dia você já terá a clareza que faltava para entender sua mente. Converse no WhatsApp guiada por assitente de IA"
  },
  {
    title: "Entenda o que sua mente está te dizendo",
    description:
      "Cada conversa atualiza o app com informações valiosas sobre seu humor, energia, emoções, padrão mental e insights com ações objetivas",
  },
  { 
    title: "Encontre a energia que faltava para agir",
    description:
     "O assistente sugere micro-ações personalizadas, mantendo você em movimento respeitando seus limites",
  },
  {
    title: "Celebre cada vitória",
    description:
      "O MindQuest acompanha seu progresso, registra as conquistas no App e reforça hábitos positivos para que você sinta evolução contínua",
  }
];

export const IMMEDIATE_BENEFITS = [
  {
    title: "Clareza no Dia a Dia",
    description:
      "Gráficos dinamicos mostram padrões que travam você, te ajudando a sair do looping mental.",
  },
  {
    title: "Progresso que Você Vê",
    description:
      "Evolução emocional semanal, celebrando conquistas reais.",
  },
  {
    title: "Motivação que Dura",
    description:
      "Pontos, sequências e prêmios mantêm o ritmo leve e divertido.",
  },
  {
    title: "Dicas Personalizadas da IA",
    description:
      "Resumos automáticos com ideias práticas para superar obstáculos.",
  },
  {
    title: "Escuta Ativa",
    description:
      "Conversas leves e dinamicas guiada por IA em texto ou áudio.",
  },
  {
    title: "Passos Simples e Concretos",
    description:
      "Planos semanais feitos para você, quebrando inércias.",
  },
  {
    title: "Tudo Guardado",
    description:
      "Histórico completo de conversas, humor, emoções e gatilhos para rever e melhorar.",
  },
  {
    title: "Resumos Práticos",
    description:
      "Semanais e mensais de metas, ações e visão geral das emoções.",
  },
  {
    title: "Mentor 24h (Premium)",
    description:
      "Conversas profundas com dicas de vida e hábitos, como uma versão melhor de você.",
  },
  {
    title: "Hábitos que Pegam",
    description:
      "Lembretes inteligentes que viram rotina natural.",
  },
];

export const AI_PARTNERS = [
  {
    name: "OpenAI · ChatGPT",
    description: "Garante conversas naturais e empáticas com compreensão contextual avançada.",
    logo: new URL("../../img/logos-ia/ChatGPT-Logo.png", import.meta.url).href,
  },
  {
    name: "Anthropic · Claude",
    description: "Refina reflexões profundas com foco em segurança e alinhamento humano.",
    logo: new URL("../../img/logos-ia/claude-ai-logo-rounded-hd-free-png.webp", import.meta.url).href,
  },
  {
    name: "Google · Gemini",
    description: "Análises rápidas para organizar dados emocionais e insights em dashboards claros.",
    logo: new URL("../../img/logos-ia/gemini.png", import.meta.url).href,
  },
  {
    name: "Meta · Meta AI",
    description: "Engajamento contínuo com micro interações multicanal e reforço de hábitos.",
    logo: new URL("../../img/logos-ia/Meta_AI.webp", import.meta.url).href,
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Descubra padrões, gatilhos e forças internas de forma objetiva. Sem teorias vazias — apenas dados reais sobre como sua mente funciona.",
    person: "Ana Ribeiro",
    role: "Empreendedora digital",
  },
  {
    quote:
      "Entenda o que você realmente sente e por quê. Transforme emoções confusas em decisões conscientes e direcionadas.",
    person: "Lucas Fernandes",
    role: "Produtor criativo",
  },
  {
    quote:
      "Volte a sentir prazer em estar com você. Presença, foco e uma relação mais saudável com sua própria mente.",
    person: "Marina Duarte",
    role: "Especialista em desenvolvimento humano",
  },
];

export const IMPACT_STATS = [
  {
    headline: "1 conversa por dia no WhatsApp",
    detail: "Acesso imediato, sem cadastro",
  },
  {
    headline: "Humor atual e tendências",
    detail: "App completo de evolução",
  },
  {
    headline: "Resumo semanal inteligente",
    detail: "Micro ações orientadas pelo seu momento",
  },
];

type FAQAnswer = {
  paragraphs?: string[];
  bullets?: string[];
};

export type FAQItem = {
  question: string;
  answer: FAQAnswer;
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "O que é o MindQuest?",
    answer: {
      paragraphs: [
        "MindQuest é um ecossistema completo, criado para sustentar sua evolução com suporte 360°.",
      ],
      bullets: [
        "Assistente de IA no WhatsApp para reflexões guiadas.",
        "App com informações atualizadas a cada conversa.",
        "IA especialista em neurociência gerando insights personalizados.",
        "IA focada em execução para colocar planos em prática.",
        "Mentor disponível 24h por dia para acelerar ainda mais sua evolução (Premium).",
      ],
    },
  },
  {
    question: "Como inicio meu cadastro?",
    answer: {
      paragraphs: ["Sem login, sem senha. Apenas uma conversa. Comece pelo WhatsApp com acesso imediato."],
    },
  },
  {
    question: "Por que o acesso usa token e não login/senha?",
    answer: {
      paragraphs: ["Para simplificar sua experiência e eliminar barreiras. O token garante segurança sem complicação."],
    },
  },
  {
    question: "Meus dados estão protegidos?",
    answer: {
      paragraphs: ["Sim. Seguimos padrões rigorosos de privacidade e criptografia para proteger suas informações."],
    },
  },
  {
    question: "Posso usar apenas pelo celular?",
    answer: {
      paragraphs: ["Sim. A conversa acontece no WhatsApp e o app pode ser acessado no celular ou desktop."],
    },
  },
  {
    question: "O que acontece depois que eu envio minha primeira mensagem no WhatsApp?",
    answer: {
      paragraphs: [
        "O assistente inicia uma conversa guiada e, ao final, atualiza seu app com insights personalizados.",
      ],
    },
  },
  {
    question: "Preciso pagar algo para começar?",
    answer: {
      paragraphs: [
        "Não. O MindQuest oferece acesso gratuito com recursos essenciais.",
        "A versão Premium expande funcionalidades.",
      ],
    },
  },
  {
    question: "E se eu não souber o que dizer na conversa?",
    answer: {
      paragraphs: [
        "O assistente conduz a conversa com perguntas simples. Você só precisa responder naturalmente.",
        "Se precisar de ideias sobre o que falar, é só pedir sugestões para a sua assistente.",
      ],
    },
  },
  {
    question: "O MindQuest é um app, um site ou um assistente virtual?",
    answer: {
      paragraphs: ["É um ecossistema completo e integrado:"],
      bullets: [
        "Assistente de Reflexão no WhatsApp.",
        "App dinâmico (mobile e desktop).",
        "IA interativa que convida você a agir e a refletir.",
        "Mentor 24h para orientar e aprofundar sua evolução (Premium).",
      ],
    },
  },
  {
    question: "Como o app é atualizado?",
    answer: {
      paragraphs: [
        "Automaticamente após cada conversa no WhatsApp. Os insights e todas as informações sobre você aparecem em tempo real.",
      ],
    },
  },
  {
    question: "O que ganho ao usar o MindQuest diariamente?",
    answer: {
      paragraphs: [
        "Clareza mental, padrões identificados, ações concretas e evolução consistente. Você acompanha todo o progresso.",
      ],
    },
  },
  {
    question: "Qual a diferença para apps de meditação ou produtividade?",
    answer: {
      paragraphs: [
        "MindQuest foca em evolução pessoal guiado por IA, não em técnicas isoladas. É evolução pessoal integrada.",
      ],
    },
  },
  {
    question: "Posso pausar meu progresso e continuar depois?",
    answer: {
      paragraphs: ["Sim. Seu histórico fica salvo e você retoma quando quiser, sem perder contexto."],
    },
  },
  {
    question: "Como o sistema garante uso ético das minhas respostas?",
    answer: {
      paragraphs: [
        "Seus dados são privados, criptografados e usados apenas para gerar insights personalizados. Nada é compartilhado sem consentimento.",
      ],
    },
  },
  {
    question: "Posso usar o MindQuest para desempenho no trabalho ou em relacionamentos?",
    answer: {
      paragraphs: [
        "Sim. A plataforma se adapta às suas áreas de foco, incluindo carreira, relacionamentos, saúde, finanças e desenvolvimento pessoal.",
      ],
    },
  },
  {
    question: "Posso exportar meus dados ou histórico?",
    answer: {
      paragraphs: ["Funcionalidade planejada para versões futuras."],
      bullets: ["No momento, você acessa todo o histórico diretamente no app."],
    },
  },
  {
    question: "Posso cancelar meu cadastro a qualquer momento?",
    answer: {
      paragraphs: ["Sim. Você tem controle total sobre sua conta e pode cancelar quando desejar."],
    },
  },
  {
    question: "Posso falar com minha Assistente de Reflexão (IA pessoal) direto no app?",
    answer: {
      paragraphs: ["Nas próximas versões será possível conversar direto pelo app, além do WhatsApp."],
    },
  },
];
