export interface SabotadorCatalogoEntry {
  id: string;
  nome: string;
  emoji: string;
  resumo: string;
  descricao: string;
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
      nome: 'Crítico',
      emoji: '⚖️',
      resumo:
        'Voz interna hiperexigente que julga a si, aos outros e às circunstâncias o tempo todo.',
      descricao:
        'Central na inteligência negativa, o Crítico tenta alcançar excelência apontando falhas e exagerando riscos. Alimenta sentimentos de inadequação, culpa e vergonha, como se nada fosse suficiente.',
      caracteristicas: [
        'Vigilância constante a erros pessoais e dos outros.',
        'Interpreta feedback neutro como crítica pesada.',
        'Tendência a destacar o que falta em vez de reconhecer progressos.',
        'Compara-se e compara pessoas de forma rígida.',
        'Usa ironia ou sarcasmo como defesa.',
      ],
      pensamentosTipicos: [
        '“Se eu não me cobrar, vou relaxar demais.”',
        '“É melhor apontar o erro antes que façam de mim.”',
        '“Fulano não se esforça o suficiente, eu teria feito melhor.”',
        '“Ainda não está bom, preciso revisar mais uma vez.”',
      ],
      sentimentosComuns: [
        'Ansiedade constante por medo de fracassar.',
        'Culpa por nunca atingir o padrão imaginado.',
        'Irritação com imperfeições alheias.',
        'Exaustão por autocobrança contínua.',
      ],
      mentirasParaJustificar: [
        '“Ser duro comigo é a única forma de evoluir.”',
        '“Se eu não julgar, tudo sai do controle.”',
        '“Cobrança é sinal de responsabilidade.”',
      ],
      impacto: {
        emSi: [
          'Desgaste emocional e sensação de insuficiência permanente.',
          'Dificuldade de celebrar conquistas e descansar.',
          'Eleva o estresse fisiológico, favorecendo burnout.',
        ],
        nosOutros: [
          'Clima de medo de errar, paralisando a colaboração.',
          'Relações marcadas por defensividade ou afastamento.',
          'Família e equipe sentem que nada é suficiente.',
        ],
      },
      funcaoOriginal:
        'Controlar a crítica externa e garantir aceitação, evitando punições ou humilhações na infância.',
      estrategiasAntidoto: [
        'Reconhecer vitórias e progressos reais diariamente.',
        'Praticar autocompaixão antes de revisar resultados.',
        'Investir em feedback apreciativo com a equipe e consigo.',
      ],
    },
    {
      id: 'insistente',
      nome: 'Insistente',
      emoji: '🧭',
      resumo:
        'Perfeccionismo e necessidade extrema de ordem, regras e padrões impecáveis.',
      descricao:
        'Busca segurança através de estrutura rígida. Trabalha além do necessário para evitar críticas, mas cria tensão ao exigir perfeição contínua.',
      caracteristicas: [
        'Pontualidade e método acima da média.',
        'Irritação com imprevistos e improvisos.',
        'Alto controle emocional para “manter tudo no lugar”.',
        'Dificuldade de delegar tarefas por medo de erro.',
        'Sensibilidade aguda a críticas ou mudanças de padrão.',
      ],
      pensamentosTipicos: [
        '“Existe um jeito certo, preciso seguir.”',
        '“Se eu não fizer perfeito, melhor nem tentar.”',
        '“Se eu delegar, vão estragar meu padrão.”',
        '“Errar é sinal de descuido.”',
      ],
      sentimentosComuns: [
        'Frustração com quem “não liga” para detalhes.',
        'Raiva contida quando padrões não são respeitados.',
        'Ansiedade com ambientes bagunçados ou decisões rápidas.',
        'Medo de críticas e de perder controle.',
      ],
      mentirasParaJustificar: [
        '“Estou ajudando os outros a evoluir.”',
        '“Se eu relaxar, tudo desmorona.”',
        '“Perfeccionismo é virtude, não defeito.”',
      ],
      impacto: {
        emSi: [
          'Rigidez e dificuldade de apreciar momentos espontâneos.',
          'Autoexigência que impede descanso genuíno.',
          'Ansiedade crônica por medo de falhar.',
        ],
        nosOutros: [
          'Ambiente de tensão e medo de errar.',
          'Percepção de frieza, distanciamento ou arrogância.',
          'Resignação de pessoas que sentem nunca agradar.',
        ],
      },
      funcaoOriginal:
        'Criar ordem em famílias caóticas ou ganhar afeto de pais exigentes através de desempenho impecável.',
      estrategiasAntidoto: [
        'Praticar “bom o suficiente” em tarefas de baixo risco.',
        'Delegar com checklists claros e aceitar estilos diferentes.',
        'Usar hobbies lúdicos sem meta de produtividade.',
        'Celebrar pequenas imperfeições como oportunidade de aprendizagem.',
      ],
      contextosTipicos: ['Planejamento de projetos', 'Organização financeira', 'Rotinas domésticas'],
    },
    {
      id: 'prestativo',
      nome: 'Prestativo',
      emoji: '🤝',
      resumo:
        'Busca aceitação oferecendo ajuda constante, ainda que silencie as próprias necessidades.',
      descricao:
        'Suporte genuíno é uma força, porém o Prestativo acredita que só será amado se estiver servindo. Acaba ressentido por dar demais e ser pouco reconhecido.',
      caracteristicas: [
        'Detecta necessidades alheias antes das próprias.',
        'Dificuldade de dizer “não” ou pedir ajuda.',
        'Cria dependência emocional ao “salvar” pessoas.',
        'Superestima problemas para justificar interferência.',
        'Evita conflitos diretos para não desapontar.',
      ],
      pensamentosTipicos: [
        '“Sou bom quando estou ajudando.”',
        '“Se eu não cuidar, ninguém cuidará.”',
        '“Não quero ser egoísta falando de mim.”',
        '“Posso fazer qualquer pessoa gostar de mim.”',
      ],
      sentimentosComuns: [
        'Ressentimento por falta de reconhecimento.',
        'Culpa ao priorizar próprio descanso.',
        'Solidão por não expressar vulnerabilidades.',
        'Medo de rejeição se estabelecer limites.',
      ],
      mentirasParaJustificar: [
        '“Eu não espero nada em troca.”',
        '“O mundo seria melhor se todos fossem prestativos.”',
      ],
      impacto: {
        emSi: [
          'Negligencia necessidades físicas e emocionais.',
          'Fadiga e sensação de esgotamento.',
          'Dificuldade de construir identidade própria.',
        ],
        nosOutros: [
          'Pessoas se tornam dependentes ou culpadas.',
          'Limites pouco claros geram confusão.',
          'Sensação de manipulação quando o “favor” cobra retorno.',
        ],
      },
      funcaoOriginal:
        'Ganhar amor e atenção em ambientes onde ser útil era pré-requisito para afeto.',
      estrategiasAntidoto: [
        'Praticar pedidos diretos de apoio ou descanso.',
        'Definir limites claros e comunicar expectativas.',
        'Reservar tempo semanal para autocuidado não negociável.',
        'Celebrar relacionamentos baseados em reciprocidade.',
      ],
      contextosTipicos: ['Dinâmicas familiares', 'Trabalho em equipe', 'Amizades marcadas por confidências'],
    },
    {
      id: 'hiper_realizador',
      nome: 'Hiper-Realizador',
      emoji: '🏆',
      resumo:
        'Autoestima condicionada a conquistas e desempenho impecável.',
      descricao:
        'Focado em metas e reconhecimento externo, usa sucesso como escudo emocional. Costuma negligenciar vulnerabilidade e relações profundas.',
      caracteristicas: [
        'Competitivo e orientado a resultados.',
        'Molda imagem para impressionar ambientes.',
        'Mantém pessoas a uma “distância segura”.',
        'Dificuldade de celebrar sem pensar no próximo alvo.',
        'Conflito entre produtividade e cuidado pessoal.',
      ],
      pensamentosTipicos: [
        '“Se não for excelente, não vale a pena.”',
        '“Sentimentos atrapalham a performance.”',
        '“Meu valor está no que entrego.”',
        '“Não posso demonstrar fragilidade.”',
      ],
      sentimentosComuns: [
        'Vazio quando a meta é atingida.',
        'Ansiedade por manter status elevado.',
        'Medo de estagnação ou decepção.',
        'Dificuldade de reconhecer exaustão.',
      ],
      mentirasParaJustificar: [
        '“Ser o melhor é minha responsabilidade.”',
        '“Depois da próxima meta eu descanso.”',
        '“Pensar em mim é egoísmo, preciso entregar.”',
      ],
      impacto: {
        emSi: [
          'Workaholismo e desregulação do sono.',
          'Distanciamento da vida afetiva.',
          'Crença de que vulnerabilidade é fraqueza.',
        ],
        nosOutros: [
          'Relacionamentos transacionais, condicionados a performance.',
          'Equipe sente pressão e medo de desapontar.',
          'Falta de espaço para conversas pessoais genuínas.',
        ],
      },
      funcaoOriginal:
        'Garantir respeito e afeto ao impressionar pessoas importantes e familiares através de resultados.',
      estrategiasAntidoto: [
        'Definir metas de bem-estar tão importantes quanto metas técnicas.',
        'Praticar check-ins emocionais semanais.',
        'Celebrar progresso com a equipe sem falar de próxima meta.',
        'Autorizar-se a pedir ajuda e delegar etapas.',
      ],
      contextosTipicos: ['Carreira corporativa', 'Empreendedorismo', 'Ambientes acadêmicos competitivos'],
    },
    {
      id: 'hiper_vigilante',
      nome: 'Hiper-Vigilante',
      emoji: '🛡️',
      resumo:
        'Estado de alerta constante, sempre esperando o pior cenário.',
      descricao:
        'Focado em identificar ameaças, acredita que relaxar é sinônimo de descuido. A tensão crônica leva a ruminações e relações baseadas em controle.',
      caracteristicas: [
        'Verifica múltiplas vezes se algo está seguro.',
        'Visualiza cenários negativos antes de agir.',
        'Dificuldade de confiar em promessas dos outros.',
        'Controla agenda e detalhes para evitar surpresas.',
        'Sono leve e mente acelerada.',
      ],
      pensamentosTipicos: [
        '“Se eu baixar a guarda, algo ruim acontece.”',
        '“Preciso prever todas as variáveis.”',
        '“Ninguém é tão cuidadoso quanto eu.”',
        '“Confiança se conquista, não se dá.”',
      ],
      sentimentosComuns: [
        'Ansiedade contínua e hipervigilância.',
        'Irritabilidade, especialmente com imprevistos.',
        'Sensação de solidão na responsabilidade.',
        'Cansaço mental por excesso de ruminação.',
      ],
      mentirasParaJustificar: [
        '“Estou apenas sendo realista.”',
        '“Prevenir é melhor que remediar, sempre.”',
      ],
      impacto: {
        emSi: [
          'Esgotamento físico e psíquico.',
          'Soma de tensão corporal (ombros, mandíbula).',
          'Dificuldade de sentir alegria ou leveza.',
        ],
        nosOutros: [
          'Clima de desconfiança e microgestão.',
          'Pessoas se sentem testadas o tempo todo.',
          'Relacionamentos marcados por cobranças e alertas.',
        ],
      },
      funcaoOriginal:
        'Manter segurança em ambientes imprevisíveis ou perigosos, monitorando riscos para antecipar perigos.',
      estrategiasAntidoto: [
        'Definir janelas específicas para planejar riscos.',
        'Praticar descanso sensorial (respiração, mindfulness).',
        'Compartilhar preocupações com parceiro confiável.',
        'Celebrar quando algo acontece sem “catástrofe”.',
      ],
      contextosTipicos: ['Gestão de crises', 'Famílias com histórico de violência', 'Ambientes de alto risco'],
    },
    {
      id: 'hiper_racional',
      nome: 'Hiper-Racional',
      emoji: '🧠',
      resumo:
        'Valoriza lógica acima das emoções, tratando relações como projetos a otimizar.',
      descricao:
        'Transforma tudo em análise intelectual, mantendo distância emocional. Sente-se mais seguro com dados do que com conexão afetiva.',
      caracteristicas: [
        'Tende a explicar sentimentos em vez de senti-los.',
        'Busca eficiência até em momentos de descanso.',
        'Impaciência com comportamentos considerados “irracionais”.',
        'Prefere autonomia a depender de terceiros.',
        'Foco em soluções rápidas, às vezes superficiais.',
      ],
      pensamentosTipicos: [
        '“Emoções atrapalham decisões.”',
        '“Se mantiver distanciamento, penso melhor.”',
        '“Preciso resolver o problema, não acolher.”',
        '“Relacionamentos consomem tempo produtivo.”',
      ],
      sentimentosComuns: [
        'Sensação de incompreensão pelos outros.',
        'Dificuldade de sentir empatia imediata.',
        'Solidão mesmo em relações próximas.',
        'Ansiedade quando o assunto é puramente emocional.',
      ],
      mentirasParaJustificar: [
        '“Minha frieza protege os outros de decisões ruins.”',
        '“Ser eficiente é mais importante que ser sensível.”',
      ],
      impacto: {
        emSi: [
          'Desconexão das próprias necessidades emocionais.',
          'Redução da criatividade por falta de sensibilidade.',
          'Possível somatização (falta de escuta do corpo).',
        ],
        nosOutros: [
          'Pessoas se sentem invalidadas ou analisadas.',
          'Ambiente frio e transacional.',
          'Dificuldade em criar confiança profunda.',
        ],
      },
      funcaoOriginal:
        'Sobreviver em contextos onde emoções eram vistas como fraqueza, usando lógica para garantir segurança.',
      estrategiasAntidoto: [
        'Separar tempo para conversas sem objetivo além da conexão.',
        'Praticar nomeação de emoções em tempo real.',
        'Perguntar “o que você precisa de mim agora?” antes de propor solução.',
        'Integrar corpo e mente (práticas somáticas, arte, música).',
      ],
      contextosTipicos: ['Ambientes acadêmicos', 'Tecnologia/engenharia', 'Famílias com pouca expressão afetiva'],
    },
    {
      id: 'vitima',
      nome: 'Vítima',
      emoji: '🎭',
      resumo:
        'Cria narrativas de injustiça para obter atenção, empatia ou isenção de responsabilidade.',
      descricao:
        'Usa sofrimento como identidade central. Pode dramatizar situações para sentir-se visto ou para evitar riscos de agir de forma autônoma.',
      caracteristicas: [
        'Histórias com foco no que deu errado.',
        'Oscila entre esperança e desilusão profunda.',
        'Busca aliados que confirmem a narrativa de injustiça.',
        'Dificuldade de assumir protagonismo por medo de falhar.',
        'Sensibilidade extrema a críticas.',
      ],
      pensamentosTipicos: [
        '“Ninguém entende o quanto já sofri.”',
        '“Por mais que eu tente, as coisas dão errado.”',
        '“Se eu mostrar o quanto dói, vão cuidar de mim.”',
        '“Não é culpa minha, é a situação.”',
      ],
      sentimentosComuns: [
        'Tristeza crônica e melancolia.',
        'Ansiedade e sensação de abandono.',
        'Ressentimento com quem “tem a vida mais fácil”.',
        'Medo de ser ignorado se demonstrar força.',
      ],
      mentirasParaJustificar: [
        '“Sou autêntico porque mostro minha dor.”',
        '“Sofrer me conecta às pessoas.”',
      ],
      impacto: {
        emSi: [
          'Paralisa diante de oportunidades por medo de repetir dor.',
          'Perde confiança em sua capacidade de ação.',
          'Aumenta o ciclo de autocompaixão tóxica.',
        ],
        nosOutros: [
          'Cansa aliados que tentam ajudar sem ver ação.',
          'Gera culpa e pressão emocional em relações íntimas.',
          'Ambiente com pouca energia de resolução.',
        ],
      },
      funcaoOriginal:
        'Atrair cuidado em ambientes onde apenas sofrimento recebia atenção ou faziam-no sentir-se parte.',
      estrategiasAntidoto: [
        'Registrar vitórias e escolhas corajosas diariamente.',
        'Adotar linguagem de responsabilidade (“eu escolho”).',
        'Buscar apoio terapêutico para ressignificar traumas.',
        'Praticar gratidão ativa e serviço voluntário.',
      ],
      contextosTipicos: ['Dinâmicas familiares com papéis rígidos', 'Equipes com pouca clareza de responsabilidades'],
    },
    {
      id: 'controlador',
      nome: 'Controlador',
      emoji: '🎯',
      resumo:
        'Necessidade de liderar tudo o tempo todo para sentir segurança.',
      descricao:
        'Acredita que só o próprio padrão garante resultados. Toma decisões unilaterais, reduzindo a autonomia de quem está ao redor.',
      caracteristicas: [
        'Decide rápido e espera que todos acompanhem.',
        'Dificuldade de confiar na competência alheia.',
        'Impulsividade para “apagar incêndios”.',
        'Intolerância a sentimentos de vulnerabilidade.',
        'Confunde controle com cuidado.',
      ],
      pensamentosTipicos: [
        '“Se eu não liderar, nada acontece.”',
        '“Não posso depender, vão me decepcionar.”',
        '“É para o bem deles.”',
        '“Delegar é sinônimo de perder tempo.”',
      ],
      sentimentosComuns: [
        'Impaciência e irritabilidade.',
        'Medo de ser dominado ou manipulado.',
        'Dificuldade de sentir-se apoiado.',
        'Exaustão por assumir tudo.',
      ],
      mentirasParaJustificar: [
        '“Sou apenas prático.”',
        '“Necessito agir rápido para proteger a todos.”',
      ],
      impacto: {
        emSi: [
          'Eleva risco de burnout.',
          'Perde oportunidades de colaboração genuína.',
          'Fica preso a uma identidade de “herói indispensável”.',
        ],
        nosOutros: [
          'Gera ressentimento e sensação de sufocamento.',
          'Talentos deixam de contribuir, esperando ordens.',
          'Team se torna dependente e pouco criativa.',
        ],
      },
      funcaoOriginal:
        'Garantir segurança assumindo controle em ambientes imprevisíveis ou com cuidadores inconsistentes.',
      estrategiasAntidoto: [
        'Praticar delegação progressiva com confiança explícita.',
        'Perguntar antes de sugerir (“como você faria?”).',
        'Aceitar ajuda e comunicar vulnerabilidades.',
        'Meditar ou praticar respirações para desacelerar impulsos.',
      ],
      contextosTipicos: ['Liderança empresarial', 'Famílias com histórico de caos', 'Projetos de alto risco'],
    },
    {
      id: 'esquivo',
      nome: 'Esquivo',
      emoji: '🪁',
      resumo:
        'Evita conflitos e tarefas desconfortáveis, focando apenas no que traz prazer imediato.',
      descricao:
        'Prefere harmonia superficial e distrações a enfrentar desafios ou conversas difíceis. Pode procrastinar decisões importantes.',
      caracteristicas: [
        'Foge de temas que gerem tensão.',
        'Substitui realizações por atividades prazerosas.',
        'Optimismo excessivo para minimizar problemas.',
        'Silencia necessidades para não abalar clima.',
        'Procrastinação quando há risco de conflito.',
      ],
      pensamentosTipicos: [
        '“Vai dar tudo certo, não preciso mexer nisso agora.”',
        '“Confronto só piora as coisas.”',
        '“Prefiro aproveitar o momento.”',
        '“Depois eu resolvo, não é urgente.”',
      ],
      sentimentosComuns: [
        'Culpa por atrasar decisões.',
        'Ansiedade quando a realidade cobra ação.',
        'Medo de rejeição ao se posicionar.',
        'Sensação de viver “fazendo de conta”.',
      ],
      mentirasParaJustificar: [
        '“Manter a paz vale mais que qualquer discussão.”',
        '“É só uma fase, depois volto a focar.”',
      ],
      impacto: {
        emSi: [
          'Acúmulo de pendências aumenta estresse oculto.',
          'Perde oportunidades de crescimento.',
          'Pode sentir-se fracassado em silêncio.',
        ],
        nosOutros: [
          'Frustração por falta de posicionamento claro.',
          'Pessoas assumem tarefas que ele evita.',
          'Relacionamentos guardam assuntos não resolvidos.',
        ],
      },
      funcaoOriginal:
        'Evitar conflitos em ambientes onde expressar-se gerava punição ou rejeição.',
      estrategiasAntidoto: [
        'Definir pequenos passos diários para temas pendentes.',
        'Preparar argumentos por escrito antes de uma conversa difícil.',
        'Recompensar-se após enfrentar desconforto.',
        'Aprender técnicas de comunicação não-violenta.',
      ],
      contextosTipicos: ['Equipes com conflitos latentes', 'Famílias que evitam conversas difíceis'],
    },
    {
      id: 'inquieto',
      nome: 'Inquieto',
      emoji: '⚡️',
      resumo:
        'Busca constante de novidades e estímulos para escapar de tédio ou desconforto emocional.',
      descricao:
        'Move-se rapidamente entre projetos, pessoas e ideias. Dificuldade de permanecer presente gera acúmulo de iniciativas inacabadas.',
      caracteristicas: [
        'Entusiasmo inicial enorme e queda rápida de interesse.',
        'Agenda lotada para evitar sentir vazio.',
        'Traz múltiplas ideias sem concluir planos.',
        'Busca sensações intensas para se sentir vivo.',
        'Dificuldade de ouvir feedbacks longos.',
      ],
      pensamentosTipicos: [
        '“Preciso de algo excitante ou vou enlouquecer.”',
        '“Ficar parado é perder tempo.”',
        '“E se houver algo melhor logo ali?”',
        '“Compromissos longos me prendem.”',
      ],
      sentimentosComuns: [
        'Ansiedade e inquietação física.',
        'Medo de perder oportunidades (FOMO).',
        'Culpa por não concluir projetos.',
        'Dificuldade de sustentar intimidade profunda.',
      ],
      mentirasParaJustificar: [
        '“Sou apenas muito criativo.”',
        '“Compromissos fixos matam minha liberdade.”',
      ],
      impacto: {
        emSi: [
          'Superficialidade em resultados devido à dispersão.',
          'Fadiga por excesso de estímulos.',
          'Sensação de não pertencer a lugar nenhum.',
        ],
        nosOutros: [
          'Equipe confusa com mudanças constantes.',
          'Relacionamentos se sentem descartáveis.',
          'Difícil confiar em promessas de longo prazo.',
        ],
      },
      funcaoOriginal:
        'Escapar de ambientes emocionais pesados buscando novidade e possibilidades melhores.',
      estrategiasAntidoto: [
        'Praticar presença (mindfulness, respiração).',
        'Selecionar poucas metas por trimestre e revisitar semanalmente.',
        'Criar rituais de celebração ao concluir tarefas.',
        'Construir accountability com parceiros confiáveis.',
      ],
      contextosTipicos: ['Empreendedores multi-projetos', 'Transições de carreira frequentes', 'Ambientes criativos'],
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
