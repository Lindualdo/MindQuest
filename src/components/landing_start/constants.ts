import { BarChart3, Brain, Flame, Lightbulb, MessageSquare, Sparkles, Target } from "lucide-react";

export const palette = {
  surface: "#E1D8CC",
  card: "#FFFFFF",
  primary: "#F7AB8A",
  secondary: "#7A5E48",
  accent: "#FF9B71",
  footer: "#1A242F",
  muted: "#5B6475",
  stroke: "rgba(47, 63, 80, 0.14)",
  soft: "#EBD3C0",
  warmSurface: "#EBD3C0",
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
    title: "Conquista no trabalho ou fora, mas dentro fica um vazio",
    description: "É só isso?' – sucesso que não aquece o coração.",
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

export const RESULT_POINTS = [
  {
    icon: BarChart3,
    title: "1- Organize seus pensamento para ter clareza",
    description:
      "Faça uma conversa guiada em menos de 10 minutos por dia. No MindQuest você conversará pelo WhatsApp com seu assitente de IA pessoal treinado para te guiar em reflexões leves.",
  },
  {
    icon: Flame,
    title: "2 - Veja o que sua mente quer te dizer",
    description:
      "No MindQuest você terá também um App que é atualizado a cada nova conversa. Tudo 100% visual e sem termos técnicos. Histórico das conversa, Humor e energia, emoções que mais se destacaram, seu padrão de pensamento (sabotador), perfil comportamental e muito mais..",
  },
  {
    icon: Lightbulb,
    title: "3 - Descubra o que fazer para mudar padrões que travam seu crescimento",
    description:
      "No MindQest você tem uma equipe de assitentes de IA especialistas em neurociencia que vão netender suas conversas e gerar dicas e insights exclusivos para você. Veja seus insights no App e defina suas prioridades",
  },
  {
    icon: MessageSquare,
    title: "4 - Pequenas ações - grandes resultados",
    description:
      "Não adianta saber o que fazer se não agir. O MindQuest tem um assistente de IA especializado em te ajudar a colocar em prática os insigths recebidos",
  },
  {
    icon: MessageSquare,
    title: "5 - Celebre cada vitória",
    description:
      "O MindQuest acompanha seu progresso e comemora com você a cada pequena conquista",
  },
    {
    icon: MessageSquare,
    title: "6 - MidQuest é um ecosistema completo",
    description:
      "- Assistende IA para Reflexões guiada - App com informações atualizadas a cada conversa - Assistentes de IA especializados em neurociencia para gerar insigts - Assistentes de IA para te ajudar nas ações. Trasformando pensamentos em ações com resultados reais"
      
  },
];

export const HOW_IT_WORKS = [
  {
    icon: MessageSquare,
    title: "Você conversa no WhatsApp",
    description:
      "Fale livremente sobre seu dia, seus desafios, suas conquistas. A IA faz perguntas poderosas que revelam o que está acontecendo por baixo da superfície.",
  },
  {
    icon: Brain,
    title: "App traduz emoções em dados",
    description:
      "Humor, roda das emoções, sentimentos PANAS, sabotadores ativos — tudo atualizado em tempo real para você ver exatamente onde está.",
  },
  {
    icon: Target,
    title: "Recebe ações personalizadas",
    description:
      "Metas e micro-ações práticas, alinhadas com seus objetivos. Não é motivação vazia — é direção clara sobre o próximo passo.",
  },
  {
    icon: Sparkles,
    title: "IA mantém você engajado",
    description:
      "Lembretes inteligentes, resumos semanais e convites para reflexões guiadas. O sistema trabalha para você manter o ritmo, sem pressão.",
    extra:
      "Indicadores visuais mostram seu progresso. Cada pequena vitória é registrada e celebrada — porque evolução é soma de consistência.",
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

export const FAQ_ITEMS = [
  {
    question: "O que é o MindQuest?",
    answer:
      "Um assistente de IA que conversa com você pelo WhatsApp e atualiza seu dashboard com métricas emocionais e recomendações.",
  },
  {
    question: "Como inicio meu cadastro?",
    answer: 'Clique em “Começar no WhatsApp”, diga seu nome e siga as instruções do assistente.',
  },
  {
    question: "Por que o acesso usa token e não login/senha?",
    answer:
      "Tokens são únicos, expiram automaticamente e são renovados a cada sessão, garantindo segurança com menos fricção.",
  },
  {
    question: "Meus dados estão protegidos?",
    answer: "Sim. As conversas e o acesso ao painel são protegidos.",
  },
  {
    question: "Posso usar apenas pelo celular?",
    answer: "Sim. O fluxo via WhatsApp e o dashboard responsivo funcionam no smartphone.",
  },
  {
    question: "O que acontece depois que eu envio minha primeira mensagem no WhatsApp?",
    answer:
      "O assistente faz perguntas guiadas para entender seu momento, gera um resumo com seus principais pontos e atualiza automaticamente seu dashboard. Ao final, seu token é renovado.",
  },
  {
    question: "Preciso pagar algo para começar?",
    answer:
      "Não. Você começa na versão Free, com cadastro pelo WhatsApp e acesso ao dashboard completo podendo ver seu histórico das últimas 7 conversas.",
  },
  {
    question: "E se eu não souber o que dizer na conversa?",
    answer:
      "Tudo bem. Diga isso ao assistente e deixe ele te conduzir. Você pode responder por texto ou áudio e já pode falar sobre você na primeira interação.",
  },
  {
    question: "O MindQuest é um app, um site ou um assistente virtual?",
    answer:
      "É um assistente de IA que interage via WhatsApp e conta com um dashboard web/app para acompanhar seu progresso.",
  },
  {
    question: "Como o dashboard é atualizado?",
    answer:
      "Automaticamente ao final de cada conversa. As métricas, insights e recomendações aparecem no painel sem você precisar fazer nada.",
  },
  {
    question: "O que ganho ao usar o MindQuest diariamente?",
    answer:
      "Clareza emocional, foco em ações pequenas e consistentes, acompanhamento visual do humor/energia, insights sobre padrões e missões que mantêm o progresso.",
  },
  {
    question: "Qual a diferença para apps de meditação ou produtividade?",
    answer:
      "Em vez de listas de tarefas ou meditações genéricas, o MindQuest converte sua conversa em dados estruturados e recomendações personalizadas. Não é terapia; é um sistema de desenvolvimento pessoal.",
  },
  {
    question: "Posso pausar meu progresso e continuar depois?",
    answer:
      "Sim. Você pode retomar a qualquer momento. Seus registros anteriores permanecem disponíveis no dashboard.",
  },
  {
    question: "Como o sistema garante uso ético das minhas respostas?",
    answer:
      "As respostas servem para personalizar sua experiência e gerar métricas no painel. O acesso é controlado por token e você decide quando interagir.",
  },
  {
    question: "Posso usar o MindQuest para desempenho no trabalho ou em relacionamentos?",
    answer:
      "Sim. O assistente adapta as recomendações ao seu contexto — organizando tudo em áreas da vida como trabalho, relacionamentos, saúde, finanças e propósito.",
  },
  {
    question: "Posso exportar meus dados ou histórico?",
    answer:
      "Sim. Você poderá solicitar exportação direta do dashboard com segurança e controle total.",
  },
  {
    question: "Posso cancelar meu cadastro a qualquer momento?",
    answer:
      "Sim. Você pode cancelar seu cadastro direto pelo dashboard ou solicitando pelo suporte.",
  },
  {
    question: "Posso falar com minha IA pessoal direto no dashboard?",
    answer: "Sim. Na versão Premium você pode falar pelo WhatsApp ou pelo dashboard.",
  },
];
