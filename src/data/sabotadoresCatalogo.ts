export interface SabotadorCatalogoEntry {
  id: string;
  nome: string;
  emoji: string;
  resumo: string;
  descricao: string;
  ladoLuminoso?: {
    dom: string;
    descricao: string;
    qualidades: string[];
  };
  caracteristicas: string[];
  pensamentosTipicos: string[];
  sentimentosComuns: string[];
  mentirasParaJustificar: string[];
  impacto: {
    emSi: string[];
    nosOutros: string[];
  };
  funcaoOriginal: string;
  estrategiasAntidoto: string[];
  contextosTipicos?: string[];
}

export interface SabotadoresConhecimentoBase {
  overview: {
    titulo: string;
    descricao: string;
    origem: string[];
    estrutura: string[];
  };
  entries: SabotadorCatalogoEntry[];
}

export const sabotadoresCatalogo: SabotadoresConhecimentoBase = {
  overview: {
    titulo: 'Sabotadores - Conceito',
    descricao:
      'Sabotadores são padrões mentais automáticos. Surgem como mecanismos de proteção mas acabam interferindo em decisões e bem-estar emocional. São relacionados com suas crenças e sua percepção sobre o mundo ao seu redor.',
    origem: [
      'Na infância agiam como guardiões para lidar com ameaças reais ou imaginárias e garantir sobrevivência física/emocional.',
      'Na vida adulta permanecem como lentes invisíveis que distorcem a forma como interpretamos e reagimos ao mundo.',
      'Mantêm o foco em evitar riscos em vez de favorecer crescimento, o que gera ciclos de autocobrança, culpa e tensão.',
    ],
    estrutura: [
      '1 sabotador universal: Crítico (julga tudo e todos).',
      '9 sabotadores cúmplices que se combinam com o Crítico e aparecem conforme experiências pessoais.',
      'Todos operam por crenças rígidas e medo de rejeição, perda de controle ou falta de valor.',
    ],
  },
  entries: [
    {
      id: 'critico',
      nome: 'juiz',
      emoji: 'Scale',
      resumo:
        'Tende a observar falhas com facilidade, buscando excelência através do discernimento.',
      descricao:
        'Esta tendência mental muitas vezes foca no que falta ou no que poderia ser melhor. Em momentos de estresse, pode tornar-se uma cobrança excessiva sobre si e sobre os outros, mas quando equilibrada, manifesta-se como um forte discernimento e busca por qualidade.',
      ladoLuminoso: {
        dom: 'Discernimento e Excelência',
        descricao: 'Quando a mente está em equilíbrio, essa energia se transforma em uma capacidade superior de avaliar situações com clareza e elevar padrões.',
        qualidades: [
          'Capacidade aguçada de identificar pontos de melhoria',
          'Busca por altos padrões de qualidade e integridade',
          'Objetividade na avaliação de processos e resultados',
          'Forte senso do que é justo e correto'
        ]
      },
      caracteristicas: [
        'Muitas vezes mantém uma vigilância a erros pessoais e alheios.',
        'Pode interpretar feedbacks neutros como críticas em momentos de tensão.',
        'Tende a destacar o que falta antes de reconhecer o que já foi feito.',
        'Frequentemente compara resultados a padrões rígidos.',
      ],
      pensamentosTipicos: [
        '“Muitas vezes sinto que se eu não cobrar, as coisas não evoluem.”',
        '“Tendo a achar que ainda não está bom o suficiente.”',
        '“Frequentemente percebo o erro antes de qualquer outra pessoa.”',
      ],
      sentimentosComuns: [
        'Ansiedade ocasional por receio de não atingir a perfeição.',
        'Certa frustração quando os padrões imaginados não são alcançados.',
        'Cansaço mental por manter um nível alto de exigência.',
      ],
      mentirasParaJustificar: [
        '“Acredito que ser duro comigo é a forma mais eficaz de crescer.”',
        '“Muitas vezes sinto que se eu não julgar, o progresso para.”',
      ],
      impacto: {
        emSi: [
          'Pode gerar um desgaste emocional por autocobrança contínua.',
          'Às vezes dificulta a celebração genuína das conquistas.',
          'Tende a elevar o nível de estresse em períodos produtivos.',
        ],
        nosOutros: [
          'Pode criar um ambiente onde as pessoas temem cometer pequenos erros.',
          'Relações podem ser marcadas por uma sensação de avaliação constante.',
          'Equipes podem sentir que seus esforços nem sempre são suficientes.',
        ],
      },
      funcaoOriginal:
        'Na infância, visava garantir aceitação e evitar falhas que pudessem gerar críticas externas.',
      estrategiasAntidoto: [
        'Praticar o reconhecimento de progressos reais, mesmo os pequenos.',
        'Alternar o foco da falha para o que já está funcionando bem.',
        'Usar o discernimento para apoiar em vez de apenas avaliar.',
      ],
    },
    {
      id: 'insistente',
      nome: 'Exigente',
      emoji: 'Compass',
      resumo:
        'Busca segurança através da organização e de métodos bem definidos.',
      descricao:
        'Muitas vezes manifesta-se como uma necessidade de ordem e regras claras. Em desequilíbrio, pode gerar rigidez e resistência a mudanças, mas seu dom reside na organização impecável e na capacidade de estruturar o caos.',
      ladoLuminoso: {
        dom: 'Ordem e Estrutura',
        descricao: 'Em equilíbrio, essa energia cria clareza e previsibilidade, permitindo que grandes projetos sejam executados com método.',
        qualidades: [
          'Excepcional capacidade de organização e método',
          'Confiabilidade e precisão em detalhes técnicos',
          'Habilidade para criar processos eficientes e replicáveis',
          'Forte senso de dever e responsabilidade'
        ]
      },
      caracteristicas: [
        'Tende a valorizar a pontualidade e o método acima da média.',
        'Frequentemente sente desconforto com imprevistos ou bagunça.',
        'Pode ter dificuldade em delegar sem supervisão constante.',
        'Geralmente busca o "jeito certo" de realizar as tarefas.',
      ],
      pensamentosTipicos: [
        '“Muitas vezes sinto que preciso seguir o plano à risca.”',
        '“Tendo a achar que se eu relaxar nos detalhes, tudo se perde.”',
        '“Frequentemente prefiro fazer eu mesmo para garantir o padrão.”',
      ],
      sentimentosComuns: [
        'Frustração ocasional com a falta de método de outras pessoas.',
        'Tensão interna em ambientes desorganizados.',
        'Certa ansiedade diante de mudanças bruscas de planos.',
      ],
      mentirasParaJustificar: [
        '“Sinto que se eu não mantiver o controle, nada funcionará.”',
        '“Acredito que o rigor é o único caminho para o sucesso real.”',
      ],
      impacto: {
        emSi: [
          'Pode gerar rigidez e dificuldade em lidar com a espontaneidade.',
          'Às vezes impede um descanso relaxado por focar em pendências.',
          'Tende a gerar uma autocobrança por produtividade constante.',
        ],
        nosOutros: [
          'Pode criar uma atmosfera de tensão em quem trabalha de forma flexível.',
          'Relações podem ser vistas como muito estruturadas ou frias.',
          'Pessoas ao redor podem sentir que nunca atingem o padrão exigido.',
        ],
      },
      funcaoOriginal:
        'Surgiu como forma de criar segurança e previsibilidade em ambientes que pareciam caóticos.',
      estrategiasAntidoto: [
        'Praticar a flexibilidade em tarefas de menor importância.',
        'Aceitar diferentes estilos de execução ao delegar.',
        'Permitir-se momentos de descontração sem uma agenda fixa.',
      ],
      contextosTipicos: ['Planejamento de projetos', 'Organização financeira', 'Rotinas domésticas'],
    },
    {
      id: 'prestativo',
      nome: 'Doador',
      emoji: 'Handshake',
      resumo:
        'Capacidade natural de cuidar e servir, buscando harmonia nas relações.',
      descricao:
        'Frequentemente coloca as necessidades dos outros à frente das suas. Em momentos de estresse, pode buscar aprovação através do serviço excessivo, mas seu dom real é a empatia e a capacidade de nutrir conexões humanas.',
      ladoLuminoso: {
        dom: 'Empatia e Nutrição',
        descricao: 'Quando equilibrada, essa energia cria ambientes acolhedores e fortalece os vínculos de qualquer grupo ou família.',
        qualidades: [
          'Empatia profunda e escuta ativa',
          'Generosidade natural e disposição para ajudar',
          'Habilidade para mediar conflitos e criar harmonia',
          'Capacidade de antecipar necessidades e oferecer suporte'
        ]
      },
      caracteristicas: [
        'Tende a detectar o que os outros precisam antes de si mesmo.',
        'Muitas vezes tem dificuldade em dizer "não" ou estabelecer limites.',
        'Pode evitar conflitos diretos para manter a paz superficial.',
        'Frequentemente busca ser visto como alguém indispensável.',
      ],
      pensamentosTipicos: [
        '“Sinto-me melhor quando estou sendo útil para alguém.”',
        '“Tendo a achar que minhas necessidades podem esperar.”',
        '“Muitas vezes temo que, se eu não ajudar, não serei valorizado.”',
      ],
      sentimentosComuns: [
        'Ressentimento ocasional quando sente que não há reciprocidade.',
        'Culpa em momentos de autocuidado ou descanso.',
        'Certa solidão por não expressar seus próprios desejos.',
      ],
      mentirasParaJustificar: [
        '“Acredito que cuidar de mim primeiro seria um ato de egoísmo.”',
        '“Sinto que o mundo precisa que eu esteja sempre disponível.”',
      ],
      impacto: {
        emSi: [
          'Pode levar à negligência das próprias necessidades físicas e emocionais.',
          'Frequentemente gera fadiga por excesso de compromissos alheios.',
          'Pode dificultar a construção de uma identidade independente.',
        ],
        nosOutros: [
          'Às vezes cria uma dependência excessiva nas pessoas ajudadas.',
          'Limites pouco claros podem gerar confusão nas relações.',
          'Pode ser percebido como intrusivo em certos momentos.',
        ],
      },
      funcaoOriginal:
        'Desenvolvido para garantir afeto e segurança através da utilidade e do serviço aos cuidadores.',
      estrategiasAntidoto: [
        'Praticar a expressão direta de seus próprios desejos e necessidades.',
        'Estabelecer limites claros entre o que é sua responsabilidade e a do outro.',
        'Priorizar o autocuidado como base para poder ajudar melhor.',
      ],
      contextosTipicos: ['Dinâmicas familiares', 'Trabalho em equipe', 'Amizades próximas'],
    },
    {
      id: 'hiper_realizador',
      nome: 'Atleta',
      emoji: 'Trophy',
      resumo:
        'Foco intenso em resultados e na entrega de valor através da ação.',
      descricao:
        'Muitas vezes associa o seu valor pessoal ao que consegue entregar ou conquistar. Em desequilíbrio, pode tornar-se competitivo ou focado apenas na imagem, mas seu dom é a eficácia extraordinária e a capacidade de manifestar objetivos.',
      ladoLuminoso: {
        dom: 'Eficácia e Manifestação',
        descricao: 'Em harmonia, essa energia transforma visões em realidade de forma ágil e inspiradora para todos ao redor.',
        qualidades: [
          'Alta competência e orientação a resultados tangíveis',
          'Capacidade de foco profundo e superação de obstáculos',
          'Habilidade para inspirar outros através do exemplo de ação',
          'Pragmatismo e eficiência na resolução de problemas'
        ]
      },
      caracteristicas: [
        'Tende a ser muito competitivo e orientado a metas claras.',
        'Muitas vezes molda sua imagem para gerar impacto positivo.',
        'Pode ter dificuldade em celebrar sem já focar no próximo passo.',
        'Frequentemente coloca a performance acima da vulnerabilidade.',
      ],
      pensamentosTipicos: [
        '“Sinto que se eu não estiver produzindo, estou perdendo tempo.”',
        '“Muitas vezes acho que meus sentimentos atrapalham minha eficiência.”',
        '“Tendo a acreditar que meu valor depende do sucesso que alcanço.”',
      ],
      sentimentosComuns: [
        'Sensação momentânea de vazio após atingir uma grande meta.',
        'Ansiedade recorrente para manter um status de alta performance.',
        'Certa impaciência com processos lentos ou pouco produtivos.',
      ],
      mentirasParaJustificar: [
        '“Acredito que o sucesso é o único caminho para ser respeitado.”',
        '“Sinto que não posso demonstrar fragilidade ou o mundo me atropela.”',
      ],
      impacto: {
        emSi: [
          'Pode levar ao excesso de trabalho e negligência com o descanso.',
          'Às vezes gera um distanciamento de conexões emocionais mais profundas.',
          'Tende a criar uma cobrança interna por nunca estar satisfeito.',
        ],
        nosOutros: [
          'Pornar as relações muito transacionais ou focadas em tarefas.',
          'Equipes podem sentir uma pressão constante por resultados.',
          'Às vezes as pessoas sentem falta de uma conexão mais humana e menos técnica.',
        ],
      },
      funcaoOriginal:
        'Surgiu como estratégia para obter reconhecimento e segurança através do desempenho.',
      estrategiasAntidoto: [
        'Definir metas de bem-estar e presença tão importantes quanto as de trabalho.',
        'Praticar o compartilhamento de vulnerabilidades com pessoas de confiança.',
        'Celebrar o processo e o aprendizado, não apenas o resultado final.',
      ],
      contextosTipicos: ['Carreira corporativa', 'Empreendedorismo', 'Ambientes competitivos'],
    },
    {
      id: 'hiper_vigilante',
      nome: 'Escudo',
      emoji: 'ShieldAlert',
      resumo:
        'Atenção aguçada a riscos e cenários, visando a segurança e proteção.',
      descricao:
        'Frequentemente visualiza possíveis problemas para estar preparado. Em momentos de estresse, pode gerar uma ansiedade crônica e desconfiança, mas seu dom é a previdência e a capacidade de antecipar riscos que outros ignoram.',
      ladoLuminoso: {
        dom: 'Vigilância e Previdência',
        descricao: 'Quando equilibrada, essa energia funciona como um sistema de alerta valioso para proteger o que é importante.',
        qualidades: [
          'Capacidade superior de antecipar problemas e riscos',
          'Alto senso de responsabilidade pela segurança do grupo',
          'Lealdade e compromisso com o que é valorizado',
          'Atenção a detalhes que garantem a sustentabilidade a longo prazo'
        ]
      },
      caracteristicas: [
        'Tende a verificar múltiplas vezes se algo está seguro ou correto.',
        'Muitas vezes visualiza cenários negativos antes de tomar decisões.',
        'Pode ter dificuldade em relaxar ou confiar plenamente nos outros.',
        'Frequentemente busca controlar detalhes para evitar surpresas desagradáveis.',
      ],
      pensamentosTipicos: [
        '“Sinto que se eu baixar a guarda, algo ruim pode acontecer.”',
        '“Tendo a prever todos os riscos para não ser pego de surpresa.”',
        '“Frequentemente acho que ninguém é tão cuidadoso quanto eu.”',
      ],
      sentimentosComuns: [
        'Ansiedade contínua e sensação de estar em alerta.',
        'Irritabilidade ocasional com imprevistos ou descuido alheio.',
        'Cansaço mental por excesso de preocupação antecipada.',
      ],
      mentirasParaJustificar: [
        '“Acredito que estou apenas sendo realista e preventivo.”',
        '“Sinto que a preocupação é a única forma de evitar desastres.”',
      ],
      impacto: {
        emSi: [
          'Pode gerar um esgotamento por excesso de ruminação mental.',
          'Às vezes causa tensão corporal persistente (ombros, mandíbula).',
          'Tende a dificultar momentos de leveza e diversão sem preocupações.',
        ],
        nosOutros: [
          'Pode criar um ambiente de desconfiança ou excesso de controle.',
          'Relações podem ser marcadas por cobranças ou alertas constantes.',
          'Pessoas próximas podem se sentir "testadas" ou sob vigilância.',
        ],
      },
      funcaoOriginal:
        'Desenvolvido para garantir a sobrevivência e segurança em ambientes incertos ou perigosos.',
      estrategiasAntidoto: [
        'Praticar a distinção entre preocupação útil e ruminação improdutiva.',
        'Reservar momentos específicos para planejar riscos e outros para relaxar.',
        'Fortalecer a confiança compartilhando preocupações de forma aberta.',
      ],
      contextosTipicos: ['Gestão de riscos', 'Cuidado familiar', 'Planejamento preventivo'],
    },
    {
      id: 'hiper_racional',
      nome: 'Analista',
      emoji: 'Brain',
      resumo:
        'Foco na lógica e objetividade para compreender o mundo.',
      descricao:
        'Frequentemente utiliza o intelecto para processar a realidade e tomar decisões. Em momentos de tensão, pode parecer distante emocionalmente, mas seu dom reside na clareza mental e na capacidade de resolver problemas complexos com precisão.',
      ladoLuminoso: {
        dom: 'Lógica e Clareza',
        descricao: 'Em equilíbrio, essa energia permite uma visão profunda e desprovida de vieses emocionais desnecessários.',
        qualidades: [
          'Pensamento analítico e profundidade intelectual',
          'Capacidade de manter a calma e a objetividade em crises',
          'Habilidade para sintetizar informações complexas',
          'Foco em soluções eficazes e baseadas em dados'
        ]
      },
      caracteristicas: [
        'Tende a explicar sentimentos através da lógica em vez de apenas senti-los.',
        'Muitas vezes prioriza a eficiência e a autonomia intelectual.',
        'Pode mostrar impaciência com comportamentos que considera irracionais.',
        'Frequentemente prefere dados e fatos a opiniões subjetivas.',
      ],
      pensamentosTipicos: [
        '“Sinto que a lógica é o caminho mais seguro para decidir.”',
        '“Muitas vezes acho que as emoções apenas confundem a visão.”',
        '“Tendo a acreditar que ser eficiente é a melhor forma de ajudar.”',
      ],
      sentimentosComuns: [
        'Sensação ocasional de isolamento intelectual.',
        'Certa ansiedade quando o ambiente se torna puramente emocional.',
        'Sentimento de frustração com a falta de clareza alheia.',
      ],
      mentirasParaJustificar: [
        '“Acredito que o distanciamento me permite ser mais justo.”',
        '“Sinto que a racionalidade absoluta é a única forma de evitar erros.”',
      ],
      impacto: {
        emSi: [
          'Pode levar a uma desconexão das próprias necessidades afetivas.',
          'Às vezes limita a expressão da criatividade espontânea.',
          'Tende a gerar uma sensação de solidão em momentos de crise pessoal.',
        ],
        nosOutros: [
          'As pessoas podem se sentir invalidadas ou "analisadas" em vez de acolhidas.',
          'Ambientes podem se tornar frios ou excessivamente técnicos.',
          'Pode dificultar a criação de vínculos de confiança baseados em vulnerabilidade.',
        ],
      },
      funcaoOriginal:
        'Surgiu como forma de lidar com instabilidade emocional ao redor através do refúgio na mente lógica.',
      estrategiasAntidoto: [
        'Praticar a escuta empática sem tentar "resolver" o problema imediatamente.',
        'Integrar a consciência corporal e as emoções no processo de decisão.',
        'Reservar tempo para conexões humanas sem um objetivo técnico.',
      ],
      contextosTipicos: ['Tomada de decisão técnica', 'Análise de sistemas', 'Ambientes acadêmicos'],
    },
    {
      id: 'vitima',
      nome: 'Vítima',
      emoji: 'Ghost',
      resumo:
        'Sensibilidade profunda que busca significado e conexão emocional.',
      descricao:
        'Muitas vezes manifesta uma conexão intensa com os sentimentos. Em desequilíbrio, pode usar o sofrimento para obter atenção ou evitar ação, mas seu dom é a profundidade emocional e a capacidade de compreender as nuances da alma humana.',
      ladoLuminoso: {
        dom: 'Sensibilidade e Profundidade',
        descricao: 'Em harmonia, essa energia se transforma em empatia genuína e uma busca autêntica por propósito e significado.',
        qualidades: [
          'Grande profundidade emocional e introspecção',
          'Capacidade de empatia real com a dor e a alegria alheias',
          'Busca incessante por autenticidade e conexões verdadeiras',
          'Sensibilidade estética e criativa aguçada'
        ]
      },
      caracteristicas: [
        'Tende a focar intensamente em sentimentos e experiências passadas.',
        'Muitas vezes busca ser compreendido em sua dor antes de buscar soluções.',
        'Pode sentir-se injustiçado ou abandonado em momentos de estresse.',
        'Frequentemente utiliza a dramatização para expressar a intensidade do que sente.',
      ],
      pensamentosTipicos: [
        '“Sinto que minhas emoções são mais intensas do que as das outras pessoas.”',
        '“Muitas vezes acho que ninguém realmente entende o que passo.”',
        '“Tendo a acreditar que se eu mostrar minha força, serei ignorado.”',
      ],
      sentimentosComuns: [
        'Melancolia ocasional e sensação de desilusão.',
        'Necessidade frequente de validação emocional externa.',
        'Ressentimento com quem parece ter uma vida mais leve ou superficial.',
      ],
      mentirasParaJustificar: [
        '“Acredito que sofrer é a única forma de ser verdadeiramente profundo.”',
        '“Sinto que minha vulnerabilidade extrema é minha única proteção.”',
      ],
      impacto: {
        emSi: [
          'Pode levar à paralisia diante de desafios por medo de mais dor.',
          'Às vezes gera um ciclo de autocompaixão que impede o crescimento.',
          'Tende a sugar a energia vital em períodos de introspecção negativa.',
        ],
        nosOutros: [
          'Pode cansar as pessoas que tentam ajudar sem ver uma mudança de atitude.',
          'Gera um clima de peso emocional ou culpa nas relações próximas.',
          'Pessoas ao redor podem se sentir impotentes diante da constante insatisfação.',
        ],
      },
      funcaoOriginal:
        'Desenvolvido para atrair cuidado e garantir que não seria esquecido em ambientes competitivos.',
      estrategiasAntidoto: [
        'Adotar uma linguagem de protagonismo e responsabilidade pelas próprias escolhas.',
        'Focar em ações práticas que gerem pequenas vitórias diárias.',
        'Praticar a gratidão ativa pelo que já é positivo no presente.',
      ],
      contextosTipicos: ['Expressão artística', 'Relações íntimas', 'Busca por propósito'],
    },
    {
      id: 'controlador',
      nome: 'Comandante',
      emoji: 'Target',
      resumo:
        'Energia de liderança e iniciativa para gerar resultados rápidos.',
      descricao:
        'Frequentemente toma a frente das situações para garantir que as coisas aconteçam. Em momentos de pressão, pode tornar-se autoritário ou impaciente, mas seu dom é a coragem e a capacidade de liderar grupos em direção a objetivos ambiciosos.',
      ladoLuminoso: {
        dom: 'Liderança e Coragem',
        descricao: 'Quando em equilíbrio, essa energia inspira confiança e move montanhas através da determinação.',
        qualidades: [
          'Forte capacidade de liderança e tomada de decisão',
          'Coragem para enfrentar desafios e proteger os seus',
          'Determinação inabalável para atingir resultados',
          'Habilidade para mobilizar recursos e pessoas rapidamente'
        ]
      },
      caracteristicas: [
        'Tende a decidir rapidamente e esperar que os outros o acompanhem.',
        'Muitas vezes sente que se não liderar, nada sairá conforme o esperado.',
        'Pode mostrar baixa tolerância à vulnerabilidade ou à indecisão.',
        'Frequentemente confunde o ato de controlar com o ato de cuidar.',
      ],
      pensamentosTipicos: [
        '“Sinto que sou a pessoa mais capaz de resolver este problema agora.”',
        '“Tendo a achar que delegar é apenas perder tempo e eficiência.”',
        '“Muitas vezes acredito que as pessoas precisam de uma direção firme.”',
      ],
      sentimentosComuns: [
        'Impaciência recorrente com ritmos mais lentos que o seu.',
        'Medo oculto de ser dominado ou perder a autonomia.',
        'Exaustão por sentir que carrega o mundo nas costas.',
      ],
      mentirasParaJustificar: [
        '“Acredito que estou fazendo isso pelo bem de todos.”',
        '“Sinto que a força é a única linguagem que garante o respeito.”',
      ],
      impacto: {
        emSi: [
          'Pode levar ao esgotamento físico e mental (burnout).',
          'Às vezes afasta pessoas talentosas que buscam autonomia.',
          'Tende a criar uma identidade de "herói solitário" que não sabe pedir ajuda.',
        ],
        nosOutros: [
          'Gera frequentemente ressentimento e sensação de sufocamento nas pessoas.',
          'Equipes podem se tornar dependentes e pouco criativas.',
          'Relações íntimas podem ser marcadas por uma disputa silenciosa de poder.',
        ],
      },
      funcaoOriginal:
        'Surgiu como necessidade de garantir segurança em ambientes imprevisíveis através do poder.',
      estrategiasAntidoto: [
        'Praticar a escuta das ideias alheias antes de impor sua direção.',
        'Aceitar a vulnerabilidade como uma forma de força e conexão humana.',
        'Delegar tarefas dando autonomia real para que os outros cresçam.',
      ],
      contextosTipicos: ['Liderança de crises', 'Gestão de projetos urgentes', 'Ambientes competitivos'],
    },
    {
      id: 'esquivo',
      nome: 'Pacifista',
      emoji: 'Wind',
      resumo:
        'Busca pela harmonia e paz, evitando conflitos desnecessários.',
      descricao:
        'Frequentemente prioriza o equilíbrio nas relações e o conforto. Em desequilíbrio, pode fugir de problemas reais ou procrastinar conversas difíceis, mas seu dom é a diplomacia e a capacidade de manter a calma em ambientes tensos.',
      ladoLuminoso: {
        dom: 'Harmonia e Adaptabilidade',
        descricao: 'Em equilíbrio, essa energia atua como um pacificador natural, trazendo leveza e flexibilidade para o grupo.',
        qualidades: [
          'Grande habilidade diplomática e mediação de conflitos',
          'Natureza tranquila e capacidade de acalmar os outros',
          'Flexibilidade e adaptabilidade a diferentes contextos',
          'Foco no bem-estar coletivo e na harmonia social'
        ]
      },
      caracteristicas: [
        'Tende a evitar temas polêmicos para não abalar o clima do ambiente.',
        'Muitas vezes busca distrações ou atividades prazerosas diante do estresse.',
        'Pode silenciar suas próprias necessidades para não incomodar os outros.',
        'Frequentemente utiliza um otimismo excessivo para minimizar problemas.',
      ],
      pensamentosTipicos: [
        '“Sinto que se eu não falar nada, o problema pode se resolver sozinho.”',
        '“Tendo a achar que o conflito só piora as situações.”',
        '“Muitas vezes prefiro focar no que é agradável agora.”',
      ],
      sentimentosComuns: [
        'Ansiedade silenciosa por pendências não resolvidas.',
        'Culpa ocasional por evitar decisões importantes.',
        'Medo de rejeição ou de perder a paz ao se posicionar.',
      ],
      mentirasParaJustificar: [
        '“Acredito que manter a harmonia é mais importante que qualquer verdade.”',
        '“Sinto que não é o momento certo para mexer nesta ferida.”',
      ],
      impacto: {
        emSi: [
          'Pode gerar um acúmulo de problemas que estoura em crises futuras.',
          'Às vezes limita o próprio crescimento por evitar o desconforto necessário.',
          'Tende a criar uma vida baseada em aparências superficiais de tranquilidade.',
        ],
        nosOutros: [
          'As pessoas podem se sentir frustradas pela falta de posicionamento claro.',
          'Relações podem guardar ressentimentos por assuntos nunca discutidos.',
          'Equipes podem perder o rumo por falta de confrontação saudável de ideias.',
        ],
      },
      funcaoOriginal:
        'Desenvolvido para evitar punições ou rejeição em ambientes onde expressar-se era perigoso.',
      estrategiasAntidoto: [
        'Enfrentar pequenos desconfortos diários para fortalecer o "músculo" da coragem.',
        'Praticar a comunicação assertiva de seus desejos e opiniões.',
        'Entender que o conflito bem gerido é uma porta para o crescimento real.',
      ],
      contextosTipicos: ['Mediação de equipes', 'Manutenção da paz familiar', 'Ambientes sociais'],
    },
    {
      id: 'inquieto',
      nome: 'Explorador',
      emoji: 'Zap',
      resumo:
        'Energia criativa e vital que busca constantemente novos estímulos.',
      descricao:
        'Frequentemente move-se com entusiasmo entre ideias e projetos. Em momentos de desequilíbrio, pode ter dificuldade em concluir o que começou ou fugir de desconfortos internos, mas seu dom é a vitalidade extraordinária e a criatividade sem limites.',
      ladoLuminoso: {
        dom: 'Criatividade e Vitalidade',
        descricao: 'Em harmonia, essa energia traz inovação, entusiasmo e uma capacidade única de ver novas possibilidades em tudo.',
        qualidades: [
          'Inovação e pensamento "fora da caixa"',
          'Entusiasmo contagiante e energia vital elevada',
          'Habilidade para conectar ideias diferentes e criar o novo',
          'Curiosidade insaciável e abertura para a vida'
        ]
      },
      caracteristicas: [
        'Tende a se entusiasmar rapidamente com novidades e novos começos.',
        'Muitas vezes mantém uma agenda lotada para se sentir vivo e produtivo.',
        'Pode ter dificuldade em focar em uma única coisa por muito tempo.',
        'Frequentemente busca intensidades emocionais para evitar o tédio.',
      ],
      pensamentosTipicos: [
        '“Sinto que a vida é muito curta para não experimentar tudo agora.”',
        '“Tendo a achar que o tédio é o pior dos sentimentos.”',
        '“Muitas vezes acredito que a próxima grande ideia está logo ali.”',
      ],
      sentimentosComuns: [
        'Ansiedade ocasional e inquietação física.',
        'Medo de perder oportunidades ou experiências valiosas (FOMO).',
        'Certa culpa por deixar projetos inacabados pelo caminho.',
      ],
      mentirasParaJustificar: [
        '“Acredito que a mudança constante é a prova da minha criatividade.”',
        '“Sinto que ficar parado é o mesmo que morrer por dentro.”',
      ],
      impacto: {
        emSi: [
          'Pode levar à superficialidade nos resultados por falta de persistência.',
          'Às vezes causa uma fadiga crônica por excesso de estímulos.',
          'Tende a dificultar a construção de raízes profundas em projetos ou relações.',
        ],
        nosOutros: [
          'Equipes podem se sentir confusas com as mudanças frequentes de direção.',
          'As pessoas podem sentir dificuldade em confiar em compromissos de longo prazo.',
          'Relacionamentos podem se sentir descartáveis diante da busca por novidade.',
        ],
      },
      funcaoOriginal:
        'Surgiu como forma de escapar de ambientes emocionais pesados através da distração positiva.',
      estrategiasAntidoto: [
        'Praticar a finalização de pequenos projetos antes de iniciar novos.',
        'Aprender a tolerar o tédio e o vazio como espaços férteis de criação.',
        'Criar rituais de presença e foco para ancorar a energia criativa.',
      ],
      contextosTipicos: ['Ideação de produtos', 'Fases iniciais de projetos', 'Ambientes criativos'],
    },
  ],
};

const normalizeSabotadorId = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-_]+/g, '');

export const getSabotadorById = (id: string): SabotadorCatalogoEntry | undefined => {
  const directMatch = sabotadoresCatalogo.entries.find((entry) => entry.id === id);
  if (directMatch) {
    return directMatch;
  }

  const normalizedTarget = normalizeSabotadorId(id);
  return sabotadoresCatalogo.entries.find(
    (entry) => normalizeSabotadorId(entry.id) === normalizedTarget
  );
};
