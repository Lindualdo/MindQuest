import type { Gamificacao, GamificacaoConquista } from '@/types/emotions';
import { gamificacaoLevels } from '@/data/gamificacaoLevels';

export interface LevelHistoryItem {
  nivel: number;
  titulo: string;
  descricao: string;
  xp_minimo: number;
  xp_maximo: number | null;
  desbloqueadoEm: string | null;
  quests: GamificacaoConquista[];
}

export const computeLevelHistory = (gamificacao: Gamificacao): LevelHistoryItem[] => {
  const levels = gamificacaoLevels.filter((item) => item.nivel <= gamificacao.nivel_atual);
  if (levels.length === 0) return [];

  const historyMap = new Map<number, LevelHistoryItem>();
  levels.forEach((level, index) => {
    const next = levels[index + 1];
    historyMap.set(level.nivel, {
      nivel: level.nivel,
      titulo: level.titulo,
      descricao: level.descricao,
      xp_minimo: level.xp_minimo,
      xp_maximo: next ? next.xp_minimo : null,
      desbloqueadoEm: null,
      quests: []
    });
  });

  const quests = [...(gamificacao.conquistas_desbloqueadas || [])]
    .map((quest) => ({
      data: quest,
      timestamp: quest.desbloqueada_em ? new Date(quest.desbloqueada_em).getTime() : null
    }))
    .sort((a, b) => {
      if (a.timestamp === null && b.timestamp === null) return 0;
      if (a.timestamp === null) return 1;
      if (b.timestamp === null) return -1;
      return a.timestamp - b.timestamp;
    });

  if (quests.length === 0) {
    return Array.from(historyMap.values()).sort((a, b) => b.nivel - a.nivel);
  }

  let xpAcumulado = 0;
  let nivelAtual = levels[0]?.nivel ?? 1;

  const findNivelForXp = (xp: number): number => {
    let selected = nivelAtual;
    for (const level of levels) {
      if (xp >= level.xp_minimo) {
        selected = level.nivel;
      } else {
        break;
      }
    }
    return selected;
  };

  quests.forEach(({ data, timestamp }) => {
    xpAcumulado += data.xp_bonus || 0;
    nivelAtual = findNivelForXp(xpAcumulado);

    const levelEntry = historyMap.get(nivelAtual);
    if (!levelEntry) {
      return;
    }

    if (!levelEntry.desbloqueadoEm && data.desbloqueada_em) {
      levelEntry.desbloqueadoEm = data.desbloqueada_em;
    }
    levelEntry.quests.push(data);
  });

  return Array.from(historyMap.values())
    .map((item) => {
      if (!item.desbloqueadoEm) {
        const fallbackQuest = item.quests.find((quest) => quest.desbloqueada_em);
        item.desbloqueadoEm = fallbackQuest
          ? fallbackQuest.desbloqueada_em
          : quests[0]?.data.desbloqueada_em ?? null;
      }
      return item;
    })
    .sort((a, b) => b.nivel - a.nivel);
};

export interface UpcomingLevelItem {
  nivel: number;
  titulo: string;
  descricao: string | null | undefined;
  xp_minimo: number;
  xp_restante: number;
  beneficios?: string[];
}

export const computeUpcomingLevels = (gamificacao: Gamificacao): UpcomingLevelItem[] => {
  if (!gamificacao.proximos_niveis || gamificacao.proximos_niveis.length === 0) {
    return [];
  }

  return gamificacao.proximos_niveis.map((nivel) => ({
    nivel: nivel.nivel,
    titulo: nivel.titulo,
    descricao: nivel.descricao,
    xp_minimo: nivel.xp_minimo,
    xp_restante: Math.max(nivel.xp_restante ?? nivel.xp_minimo - gamificacao.xp_total, 0)
  }));
};
