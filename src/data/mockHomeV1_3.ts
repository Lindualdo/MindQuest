import type { WeeklyXpSummary } from '@/components/app/v1.3/CardWeeklyProgress';
import type { MoodEnergySummary } from '@/components/app/v1.3/CardMoodEnergy';

export const MOCK_USUARIO_ID = 'd949d81c-9235-41ce-8b3b-6b5d593c5e24';

export const mockWeeklyXpSummary: WeeklyXpSummary = {
  usuarioId: MOCK_USUARIO_ID,
  semanaInicio: '2025-11-10',
  semanaFim: '2025-11-16',
  streakAtualDias: 2,
  xpSemanaTotal: 2715,
  xpMetaSemana: 3000,
  dias: [
    {
      data: '2025-11-10',
      label: 'Seg',
      totalXp: 0,
      xpBase: 0,
      xpBonus: 0,
    },
    {
      data: '2025-11-11',
      label: 'Ter',
      totalXp: 0,
      xpBase: 0,
      xpBonus: 0,
    },
    {
      data: '2025-11-12',
      label: 'Qua',
      totalXp: 615,
      xpBase: 0,
      xpBonus: 615,
    },
    {
      data: '2025-11-13',
      label: 'Qui',
      totalXp: 0,
      xpBase: 0,
      xpBonus: 0,
    },
    {
      data: '2025-11-14',
      label: 'Sex',
      totalXp: 0,
      xpBase: 0,
      xpBonus: 0,
    },
    {
      data: '2025-11-15',
      label: 'Sáb',
      totalXp: 2100,
      xpBase: 2100,
      xpBonus: 0,
    },
    {
      data: '2025-11-16',
      label: 'Dom',
      totalXp: 0,
      xpBase: 0,
      xpBonus: 0,
    },
  ],
};

export const mockMoodEnergySummary: MoodEnergySummary = {
  humorHoje: 7,
  humorMediaSemana: 6.7,
  energiaHoje: 7,
  energiaMediaSemana: 6.6,
};

