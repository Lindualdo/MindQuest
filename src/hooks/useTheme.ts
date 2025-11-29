import { useCallback, useEffect, useState } from 'react';

export type ThemeId = 'clareza' | 'natureza' | 'noturno' | 'cosmos';

export interface ThemeInfo {
  id: ThemeId;
  nome: string;
  descricao: string;
  tipo: 'light' | 'dark';
  cores: {
    bg: string;
    surface: string;
    card: string;
    text: string;
    primary: string;
    accent: string;
  };
}

export const TEMAS: ThemeInfo[] = [
  {
    id: 'clareza',
    nome: 'Clareza',
    descricao: 'Tema claro padrão com tons suaves de rosa e azul',
    tipo: 'light',
    cores: {
      bg: '#F5EBF3',
      surface: '#E8F3F5',
      card: '#FFFFFF',
      text: '#1C2541',
      primary: '#0EA5E9',
      accent: '#D90368',
    },
  },
  {
    id: 'natureza',
    nome: 'Natureza',
    descricao: 'Tema claro com tons verdes e terrosos',
    tipo: 'light',
    cores: {
      bg: '#F7F5F0',
      surface: '#EDF5E8',
      card: '#FDFCFA',
      text: '#2D3A1F',
      primary: '#4CAF50',
      accent: '#FF6B35',
    },
  },
  {
    id: 'noturno',
    nome: 'Noturno',
    descricao: 'Tema escuro com tons de azul profundo',
    tipo: 'dark',
    cores: {
      bg: '#0F172A',
      surface: '#1E293B',
      card: '#334155',
      text: '#F1F5F9',
      primary: '#38BDF8',
      accent: '#F472B6',
    },
  },
  {
    id: 'cosmos',
    nome: 'Cosmos',
    descricao: 'Tema escuro com tons de roxo e violeta',
    tipo: 'dark',
    cores: {
      bg: '#13111C',
      surface: '#1F1B2E',
      card: '#2D2640',
      text: '#F5F3FF',
      primary: '#A78BFA',
      accent: '#F472B6',
    },
  },
];

const STORAGE_KEY = 'mindquest-theme';
const DEFAULT_THEME: ThemeId = 'clareza';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && TEMAS.some(t => t.id === saved)) {
      return saved as ThemeId;
    }
    return DEFAULT_THEME;
  });

  // Aplicar tema no DOM
  useEffect(() => {
    const root = document.querySelector('.mq-app-v1_3');
    if (root) {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
  }, []);

  const currentTheme = TEMAS.find(t => t.id === theme) ?? TEMAS[0];

  return {
    theme,
    setTheme,
    currentTheme,
    temas: TEMAS,
    isDark: currentTheme.tipo === 'dark',
  };
}

export default useTheme;

