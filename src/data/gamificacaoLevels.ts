export interface GamificacaoLevelConfig {
  nivel: number;
  xp_minimo: number;
  xp_proximo_nivel: number | null;
  titulo: string;
  descricao: string;
}

export const gamificacaoLevels: GamificacaoLevelConfig[] = [
  {
    nivel: 1,
    xp_minimo: 0,
    xp_proximo_nivel: 200,
    titulo: 'Explorador',
    descricao: 'Início da jornada de autoconhecimento.'
  },
  {
    nivel: 2,
    xp_minimo: 200,
    xp_proximo_nivel: 550,
    titulo: 'Aprendiz',
    descricao: 'Estabelece o hábito e começa a aplicar aprendizados.'
  },
  {
    nivel: 3,
    xp_minimo: 550,
    xp_proximo_nivel: 1050,
    titulo: 'Observador',
    descricao: 'Reconhece padrões e responde com consciência.'
  },
  {
    nivel: 4,
    xp_minimo: 1050,
    xp_proximo_nivel: 1700,
    titulo: 'Focado',
    descricao: 'Mantém consistência e amplia a profundidade das reflexões.'
  },
  {
    nivel: 5,
    xp_minimo: 1700,
    xp_proximo_nivel: 2500,
    titulo: 'Praticante',
    descricao: 'Transforma insights em ações práticas no dia a dia.'
  },
  {
    nivel: 6,
    xp_minimo: 2500,
    xp_proximo_nivel: 3450,
    titulo: 'Consciente',
    descricao: 'Demonstra autoconsciência contínua e resiliente.'
  },
  {
    nivel: 7,
    xp_minimo: 3450,
    xp_proximo_nivel: 4550,
    titulo: 'Iluminado',
    descricao: 'Consolida rotinas sólidas e inspira evolução.'
  },
  {
    nivel: 8,
    xp_minimo: 4550,
    xp_proximo_nivel: 5800,
    titulo: 'Sábio',
    descricao: 'Integra emoções e ações com equilíbrio.'
  },
  {
    nivel: 9,
    xp_minimo: 5800,
    xp_proximo_nivel: 7200,
    titulo: 'Ascendente',
    descricao: 'Eleva a prática a um novo patamar de consistência.'
  },
  {
    nivel: 10,
    xp_minimo: 7200,
    xp_proximo_nivel: 9000,
    titulo: 'Mestre',
    descricao: 'Domina a jornada e serve de referência.'
  },
  {
    nivel: 11,
    xp_minimo: 9000,
    xp_proximo_nivel: 12000,
    titulo: 'Mentor',
    descricao: 'Compartilha aprendizados e amplia impacto.'
  },
  {
    nivel: 12,
    xp_minimo: 12000,
    xp_proximo_nivel: 15000,
    titulo: 'Guardião',
    descricao: 'Protege hábitos saudáveis e permanece atento.'
  },
  {
    nivel: 13,
    xp_minimo: 15000,
    xp_proximo_nivel: 20000,
    titulo: 'Visionário',
    descricao: 'Projeta novos horizontes com clareza e coragem.'
  },
  {
    nivel: 14,
    xp_minimo: 20000,
    xp_proximo_nivel: 26000,
    titulo: 'Arquiteto',
    descricao: 'Desenha a própria evolução com propósito.'
  },
  {
    nivel: 15,
    xp_minimo: 26000,
    xp_proximo_nivel: null,
    titulo: 'Transcendente',
    descricao: 'Mantém equilíbrio pleno e busca evolução contínua.'
  }
];

export default gamificacaoLevels;
