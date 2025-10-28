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
    icon: BarChart3,
    title: "Evolução emocional visível",
    description:
      "Acaba com a sensação de estar perdido: humor, energia e tendências aparecem em gráficos simples para você saber exatamente como está avançando.",
  },
  {
    icon: Flame,
    title: "Gamificação que sustenta o ritmo",
    description:
      "Acaba com a oscilação de motivação. Pontos, streaks e conquistas celebram cada ação e mantêm você engajado sem pressão.",
  },
  {
    icon: Lightbulb,
    title: "Insights da IA que destravam decisões",
    description:
      "Nada de ficar tentando entender seus sabotadores sozinho. A IA gera resumos, padrões e recomendações práticas para o próximo passo.",
  },
  {
    icon: MessageSquare,
    title: "Conversas completas, sempre acessíveis",
    description:
      "Nunca mais perca um insight. Texto e áudio das conversas ficam guardados para revisitar aprendizados quando quiser.",
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
