export type ScaleItem = {
  id: string;
  min: number;
  max: number;
  titulo: string;
  descricaoCurta: string;
};

export const HUMOR_SCALE: ScaleItem[] = [
  {
    id: 'muito_baixo',
    min: 1,
    max: 2,
    titulo: 'Muito baixo',
    descricaoCurta: 'Sinal de alerta. Vale desacelerar e pedir apoio.',
  },
  {
    id: 'baixo',
    min: 3,
    max: 4,
    titulo: 'Baixo',
    descricaoCurta: 'Dia mais pesado. Pequenos passos já fazem diferença.',
  },
  {
    id: 'equilibrado',
    min: 5,
    max: 6,
    titulo: 'Equilibrado',
    descricaoCurta: 'Oscilações normais. Bom momento para organizar prioridades.',
  },
  {
    id: 'alto',
    min: 7,
    max: 8,
    titulo: 'Alto',
    descricaoCurta: 'Clima positivo. Ótima hora para avançar em desafios.',
  },
  {
    id: 'muito_alto',
    min: 9,
    max: 10,
    titulo: 'Muito alto',
    descricaoCurta: 'Energia emocional em alta. Lembre de equilibrar descanso e ação.',
  },
];

export const ENERGIA_SCALE: ScaleItem[] = [
  {
    id: 'muito_baixa',
    min: 1,
    max: 2,
    titulo: 'Muito baixa',
    descricaoCurta: 'Corpo e mente pedem pausa. Priorize descanso hoje.',
  },
  {
    id: 'baixa',
    min: 3,
    max: 4,
    titulo: 'Baixa',
    descricaoCurta: 'Pouca gasolina. Foque no essencial e se hidrate.',
  },
  {
    id: 'estavel',
    min: 5,
    max: 6,
    titulo: 'Estável',
    descricaoCurta: 'Boa base para manter hábitos e micro-ações.',
  },
  {
    id: 'alta',
    min: 7,
    max: 8,
    titulo: 'Alta',
    descricaoCurta: 'Muita disposição. Aproveite para tirar algo importante do papel.',
  },
  {
    id: 'muito_alta',
    min: 9,
    max: 10,
    titulo: 'Muito alta',
    descricaoCurta: 'Ritmo acelerado. Cuide para não passar do ponto.',
  },
];

const findInScale = (scale: ScaleItem[], valor: number): ScaleItem => {
  const clamped = Math.max(1, Math.min(10, Math.round(valor)));
  return scale.find((item) => clamped >= item.min && clamped <= item.max) ?? scale[scale.length - 1];
};

export const getHumorDescriptor = (valor: number): ScaleItem =>
  findInScale(HUMOR_SCALE, valor);

export const getEnergiaDescriptor = (valor: number): ScaleItem =>
  findInScale(ENERGIA_SCALE, valor);

