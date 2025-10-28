import { Brain, MessageSquare, Sparkles, Target } from "lucide-react";

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
    title: "Muitas ideias no papel, mas trava na hora de agir",
    description: "O perfeccionismo paralisa antes mesmo de começar.",
  },
  {
    title: "Começa vários projetos empolgado, mas raramente termina algo",
    description: "A energia inicial se perde no meio do caminho.",
  },
  {
    title: "Sente que merece mais da vida, mas os resultados não aparecem",
    description: "Mesmo trabalhando duro, algo parece estar faltando.",
  },
  {
    title: "Se cobra o tempo todo, mas quase nunca se sente satisfeito",
    description: "A autocrítica constante rouba o prazer das conquistas.",
  },
  {
    title: "Quer agradar todo mundo e acaba se esgotando",
    description: "Dizer não parece impossível, até você colapsar.",
  },
  {
    title: "Pensa demais e age pouco por falta de clareza",
    description: "Sua mente vira uma prisão de pensamentos infinitos sem saída prática.",
  },
];

export const INSIGHT_POINTS = [
  "Sua mente não é o problema — ela só está tentando te proteger de formas que não funcionam mais.",
  "O MindQuest não te ensina a ser outra pessoa. Ele te ajuda a descobrir quem você é por dentro — e usar isso a seu favor para evoluir de verdade.",
];

export const RESULT_POINTS = [
  {
    title: "Conversa vira clareza",
    description:
      "Você fala no WhatsApp como se fosse um diário íntimo. A IA colhe emoções, fatos e traça seu estado mental atual — sem julgamentos, só compreensão.",
  },
  {
    title: "Painel que revela padrões",
    description:
      "Humor, energia, sabotadores e emoções compilados em um app intuitivo que mostra exatamente onde você está travando e o que fazer.",
  },
  {
    title: "Ações personalizadas que funcionam",
    description:
      "Micro passos alinhados aos seus objetivos reais. Nada de listas genéricas — apenas o que importa para o SEU momento, no SEU ritmo.",
  },
  {
    title: "Você sempre no controle",
    description:
      "Cada resumo precisa da sua aprovação. Privacidade total, autonomia completa. Você escolhe quando e como continuar.",
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
      "Uma plataforma de evolução pessoal guiada por IA. Você conversa pelo WhatsApp e acompanha sua evolução em um app intuitivo com métricas emocionais, insights comportamentais e recomendações práticas para crescer de forma consistente.",
  },
  {
    question: "Como faço para começar?",
    answer:
      'Clique em "Começar no WhatsApp", diga seu nome e comece sua primeira conversa. Sem login, sem senha, sem atrito. A IA te guia por todo o processo.',
  },
  {
    question: "Por que acesso por token e não login tradicional?",
    answer:
      "Para eliminar barreiras e proteger sua privacidade. Cada sessão gera um token renovado — você não precisa lembrar senhas e seus dados ficam isolados por sessão.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Suas conversas são privadas, criptografadas e você sempre aprova o que é armazenado. Nada é compartilhado ou usado para outros fins além da sua evolução pessoal.",
  },
  {
    question: "MindQuest substitui terapia?",
    answer:
      "Não. MindQuest é uma ferramenta de autoconhecimento e crescimento pessoal. Se você está lidando com questões clínicas (depressão, ansiedade grave, traumas), busque um psicólogo ou psiquiatra.",
  },
  {
    question: "Funciona só no celular?",
    answer:
      "Você conversa pelo WhatsApp (celular ou web) e acessa seu app em qualquer dispositivo — celular, tablet ou computador.",
  },
  {
    question: "Quanto tempo por dia preciso dedicar?",
    answer:
      "Entre 5 e 15 minutos por conversa. Você escolhe quando e com qual frequência usa. A consistência importa mais que o tempo investido.",
  },
];
