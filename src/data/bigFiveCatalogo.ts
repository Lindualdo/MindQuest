/**
 * Catálogo de Perfis Big Five (Modelo de Personalidade)
 * 
 * Baseado no modelo de cinco fatores (OCEAN):
 * - Openness (Abertura)
 * - Conscientiousness (Conscienciosidade)
 * - Extraversion (Extroversão)
 * - Agreeableness (Amabilidade)
 * - Neuroticism (Neuroticismo)
 */

export interface BigFivePerfilEntry {
  id: string;
  nome: string;
  nome_pt: string;
  emoji: string;
  resumo: string;
  descricao: string;
  caracteristicas: string[];
  pontos_fortes: string[];
  areas_melhoria: string[];
  preferencias_trabalho: string[];
  relacionamentos: string[];
  estrategias_desenvolvimento: string[];
  combinacoes_comuns?: string[];
}

export interface BigFiveConhecimentoBase {
  overview: {
    titulo: string;
    descricao: string;
    origem: string[];
    estrutura: string[];
  };
  entries: BigFivePerfilEntry[];
}

export const bigFiveCatalogo: BigFiveConhecimentoBase = {
  overview: {
    titulo: 'Perfis Big Five - Modelo de Personalidade',
    descricao:
      'O modelo Big Five (Cinco Grandes Fatores) descreve cinco dimensões fundamentais da personalidade humana. Cada pessoa possui níveis diferentes em cada dimensão, criando um perfil único que influencia comportamento, preferências e interações.',
    origem: [
      'Desenvolvido por múltiplos pesquisadores ao longo de décadas de estudos empíricos.',
      'Baseado em análise estatística de traços de personalidade identificados em diversos contextos culturais.',
      'Considerado o modelo mais aceito e cientificamente validado para descrição de personalidade.',
    ],
    estrutura: [
      '5 dimensões independentes: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism.',
      'Cada dimensão varia de baixo a alto, criando um perfil único para cada indivíduo.',
      'As combinações entre dimensões explicam grande parte das diferenças comportamentais entre pessoas.',
    ],
  },
  entries: [
    {
      id: 'openness',
      nome: 'Openness to Experience',
      nome_pt: 'Abertura à Experiência',
      emoji: '🎨',
      resumo:
        'Curiosidade intelectual, criatividade, abertura para novas ideias e experiências variadas.',
      descricao:
        'Pessoas com alta abertura valorizam novidade, criatividade e exploração. São curiosas sobre o mundo, apreciam arte, aventura e ideias abstratas. Têm facilidade para pensar de forma não convencional e aceitar mudanças.',
      caracteristicas: [
        'Curiosidade intelectual e interesse por aprender.',
        'Apreciação por arte, beleza e experiências estéticas.',
        'Facilidade para trabalhar com conceitos abstratos.',
        'Abertura para mudanças e novas experiências.',
        'Pensamento criativo e original.',
        'Tolerância a ambiguidade e incerteza.',
      ],
      pontos_fortes: [
        'Excelente em resolver problemas complexos e inovadores.',
        'Adapta-se bem a mudanças e ambientes dinâmicos.',
        'Contribui com ideias criativas e perspectivas únicas.',
        'Aprende rapidamente e mantém mente aberta.',
        'Inspira outros com visão e criatividade.',
      ],
      areas_melhoria: [
        'Pode ter dificuldade com tarefas rotineiras e repetitivas.',
        'Às vezes falta foco e disciplina para seguir processos rígidos.',
        'Pode procrastinar em atividades burocráticas.',
        'Pode ser visto como "fora da caixa" demais em ambientes tradicionais.',
      ],
      preferencias_trabalho: [
        'Ambientes criativos e inovadores.',
        'Projetos que permitam autonomia e exploração.',
        'Tarefas variadas e desafiadoras.',
        'Oportunidades de aprender e experimentar.',
        'Contextos que valorizem ideias e criatividade.',
      ],
      relacionamentos: [
        'Valoriza conversas profundas e intelectuais.',
        'Busca pessoas interessantes e diferentes.',
        'Aprecia relacionamentos que estimulem crescimento.',
        'Pode ter dificuldade com pessoas muito tradicionais ou rígidas.',
        'Gosta de explorar novos interesses e atividades juntos.',
      ],
      estrategias_desenvolvimento: [
        'Criar rotinas criativas para manter organização.',
        'Estabelecer metas claras para projetos inovadores.',
        'Buscar mentores que ajudem a transformar ideias em ações.',
        'Praticar foco em uma atividade por vez.',
        'Usar criatividade para tornar tarefas rotineiras mais interessantes.',
      ],
      combinacoes_comuns: ['conscientiousness', 'extraversion'],
    },
    {
      id: 'conscientiousness',
      nome: 'Conscientiousness',
      nome_pt: 'Conscienciosidade',
      emoji: '📋',
      resumo:
        'Organização, disciplina, foco em metas, responsabilidade e busca por excelência.',
      descricao:
        'Pessoas com alta conscienciosidade são organizadas, disciplinadas e focadas em objetivos. Planejam cuidadosamente, seguem regras e se esforçam para alcançar resultados de qualidade. Têm forte autocontrole e senso de dever.',
      caracteristicas: [
        'Organização pessoal e profissional.',
        'Disciplina e autocontrole elevados.',
        'Foco em metas e objetivos claros.',
        'Responsabilidade e confiabilidade.',
        'Preferência por planejamento e estrutura.',
        'Busca constante por melhorias e excelência.',
      ],
      pontos_fortes: [
        'Excelente em planejamento e execução de projetos.',
        'Altamente confiável e cumpridor de compromissos.',
        'Mantém padrões elevados de qualidade.',
        'Eficiente em gerenciamento de tempo e recursos.',
        'Inspira confiança em equipes e líderes.',
      ],
      areas_melhoria: [
        'Pode ser muito rígido e inflexível.',
        'Tendência a perfeccionismo excessivo.',
        'Dificuldade para lidar com mudanças de última hora.',
        'Pode ser crítico demais consigo e com outros.',
        'Risco de burnout por excesso de responsabilidade.',
      ],
      preferencias_trabalho: [
        'Ambientes estruturados e organizados.',
        'Projetos com prazos e metas claras.',
        'Funções que requeiram planejamento e organização.',
        'Contextos onde qualidade é valorizada.',
        'Processos bem definidos e eficientes.',
      ],
      relacionamentos: [
        'Valoriza compromissos e confiabilidade.',
        'Aprecia pessoas responsáveis e organizadas.',
        'Pode ser crítico com quem não cumpre promessas.',
        'Busca relacionamentos estáveis e duradouros.',
        'Aprecia parceiros que compartilhem valores de organização.',
      ],
      estrategias_desenvolvimento: [
        'Desenvolver flexibilidade sem perder organização.',
        'Praticar autocompaixão e celebrar progressos.',
        'Aprender a delegar e confiar em outros.',
        'Balancear perfeccionismo com pragmatismo.',
        'Criar pausas e momentos de descanso intencionais.',
      ],
      combinacoes_comuns: ['openness', 'extraversion', 'agreeableness'],
    },
    {
      id: 'extraversion',
      nome: 'Extraversion',
      nome_pt: 'Extroversão',
      emoji: 'Star',
      resumo:
        'Sociabilidade, assertividade, entusiasmo e energia em interações sociais.',
      descricao:
        'Pessoas extrovertidas são energizadas por interações sociais. Gostam de estar rodeadas de pessoas, são comunicativas, assertivas e expressam emoções abertamente. Buscam estimulação externa e atividades em grupo.',
      caracteristicas: [
        'Alta sociabilidade e facilidade para conhecer pessoas.',
        'Comunicação clara e expressiva.',
        'Entusiasmo e energia em atividades sociais.',
        'Conforto com liderança e exposição.',
        'Busca por estimulação e atividades externas.',
        'Expressão aberta de pensamentos e emoções.',
      ],
      pontos_fortes: [
        'Excelente em networking e relacionamentos.',
        'Eficaz em comunicação e apresentações.',
        'Motiva e energiza equipes.',
        'Natural em liderança e influência.',
        'Adapta-se bem a ambientes dinâmicos.',
      ],
      areas_melhoria: [
        'Pode falar antes de pensar completamente.',
        'Dificuldade para trabalhar sozinho por longos períodos.',
        'Pode dominar conversas e não ouvir o suficiente.',
        'Às vezes precisa de validação externa constante.',
        'Pode ter dificuldade com reflexão profunda e introspecção.',
      ],
      preferencias_trabalho: [
        'Ambientes colaborativos e sociais.',
        'Funções que envolvam comunicação constante.',
        'Liderança e gestão de equipes.',
        'Networking e relacionamento com clientes.',
        'Contextos que valorizem energia e entusiasmo.',
      ],
      relacionamentos: [
        'Valoriza conexões sociais profundas.',
        'Busca companhia e atividades compartilhadas.',
        'Expressa afeição e emoções abertamente.',
        'Aprecia conversas animadas e interações frequentes.',
        'Pode ter ampla rede de relacionamentos.',
      ],
      estrategias_desenvolvimento: [
        'Desenvolver habilidades de escuta ativa.',
        'Criar momentos de introspecção e reflexão.',
        'Praticar trabalho independente progressivamente.',
        'Equilibrar tempo social com tempo pessoal.',
        'Desenvolver paciência para processos lentos.',
      ],
      combinacoes_comuns: ['conscientiousness', 'agreeableness'],
    },
    {
      id: 'agreeableness',
      nome: 'Agreeableness',
      nome_pt: 'Amabilidade',
      emoji: 'Handshake',
      resumo:
        'Cooperação, empatia, confiança e preocupação com o bem-estar dos outros.',
      descricao:
        'Pessoas com alta amabilidade são cooperativas, empáticas e confiam nos outros. Valorizam harmonia, ajudam os outros e evitam conflitos. São compassivas e tendem a ver o melhor nas pessoas.',
      caracteristicas: [
        'Empatia e sensibilidade aos sentimentos alheios.',
        'Cooperação e espírito de equipe.',
        'Confiança e otimismo sobre as pessoas.',
        'Preocupação genuína com o bem-estar dos outros.',
        'Tendência a evitar conflitos e buscar harmonia.',
        'Altruísmo e disposição para ajudar.',
      ],
      pontos_fortes: [
        'Excelente em trabalhos em equipe e colaboração.',
        'Habilidades de mediação e resolução de conflitos.',
        'Cria ambientes harmoniosos e acolhedores.',
        'Inspira confiança e lealdade.',
        'Eficaz em funções que envolvam cuidado e apoio.',
      ],
      areas_melhoria: [
        'Pode evitar confrontos necessários.',
        'Dificuldade para dizer "não" e estabelecer limites.',
        'Pode ser explorado por pessoas menos amáveis.',
        'Tendência a colocar necessidades dos outros antes das próprias.',
        'Pode ter dificuldade em competições e negociações duras.',
      ],
      preferencias_trabalho: [
        'Ambientes colaborativos e harmoniosos.',
        'Funções que envolvam cuidado, ensino ou apoio.',
        'Equipes onde cooperação é valorizada.',
        'Contextos que permitam ajudar outros.',
        'Organizações com valores humanitários.',
      ],
      relacionamentos: [
        'Valoriza relacionamentos harmoniosos e cooperativos.',
        'Busca conexões profundas e empáticas.',
        'Prioriza bem-estar dos outros.',
        'Aprecia parceiros que também valorizem cooperação.',
        'Tende a manter relacionamentos por longo tempo.',
      ],
      estrategias_desenvolvimento: [
        'Desenvolver assertividade e estabelecer limites saudáveis.',
        'Aprender a priorizar necessidades próprias também.',
        'Praticar negociação e defesa de interesses.',
        'Reconhecer quando conflitos são necessários.',
        'Equilibrar empatia com autoproteção.',
      ],
      combinacoes_comuns: ['extraversion', 'conscientiousness'],
    },
    {
      id: 'neuroticism',
      nome: 'Neuroticism',
      nome_pt: 'Neuroticismo',
      emoji: '🌊',
      resumo:
        'Sensibilidade emocional, tendência à ansiedade e variações de humor.',
      descricao:
        'Pessoas com alto neuroticismo são mais sensíveis ao estresse e emoções negativas. Tendem a experimentar ansiedade, preocupação e variações de humor com mais frequência. São mais reativas emocionalmente a situações desafiadoras.',
      caracteristicas: [
        'Maior sensibilidade a estresse e pressão.',
        'Tendência à preocupação e ansiedade.',
        'Variações de humor mais frequentes.',
        'Autoconsciência elevada sobre emoções.',
        'Reatividade emocional a eventos negativos.',
        'Preocupação com possíveis problemas futuros.',
      ],
      pontos_fortes: [
        'Alta consciência sobre emoções próprias e alheias.',
        'Preparação cuidadosa para possíveis problemas.',
        'Empatia com pessoas que passam por dificuldades.',
        'Habilidade para identificar riscos e perigos.',
        'Profundidade emocional em relacionamentos.',
      ],
      areas_melhoria: [
        'Tendência a amplificar problemas e ansiedades.',
        'Dificuldade para lidar com pressão e estresse.',
        'Pode ter pensamentos catastróficos.',
        'Variações de humor podem afetar produtividade.',
        'Pode ser visto como instável ou preocupado demais.',
      ],
      preferencias_trabalho: [
        'Ambientes estáveis e previsíveis.',
        'Funções com baixo estresse e pressão.',
        'Contextos que permitam reflexão e planejamento.',
        'Equipes apoiadoras e compreensivas.',
        'Tarefas que não exijam decisões rápidas sob pressão.',
      ],
      relacionamentos: [
        'Valoriza relacionamentos seguros e estáveis.',
        'Busca parceiros que ofereçam apoio emocional.',
        'Pode precisar de validação e reafirmação.',
        'Aprecia comunicação honesta sobre sentimentos.',
        'Precisa de tempo para processar emoções intensas.',
      ],
      estrategias_desenvolvimento: [
        'Desenvolver técnicas de regulação emocional (meditação, respiração).',
        'Praticar questionamento de pensamentos catastróficos.',
        'Estabelecer rotinas que reduzam estresse.',
        'Buscar terapia ou apoio profissional quando necessário.',
        'Criar rede de suporte social forte.',
        'Praticar autocompaixão e aceitação emocional.',
      ],
      combinacoes_comuns: ['conscientiousness', 'agreeableness'],
    },
  ],
};

/**
 * Busca entrada do catálogo por ID
 */
export function getPerfilById(id: string): BigFivePerfilEntry | undefined {
  return bigFiveCatalogo.entries.find((entry) => entry.id === id);
}

/**
 * Traduz nome em inglês para português
 */
export function traduzirNomePerfil(nomeEn: string): string {
  const perfil = bigFiveCatalogo.entries.find(
    (entry) => entry.nome.toLowerCase() === nomeEn.toLowerCase() || entry.id === nomeEn.toLowerCase()
  );
  return perfil?.nome_pt || nomeEn;
}

/**
 * Obtém emoji do perfil
 */
export function getEmojiPerfil(nomeEn: string): string {
  const perfil = getPerfilById(nomeEn.toLowerCase());
  return perfil?.emoji || '🧩';
}


