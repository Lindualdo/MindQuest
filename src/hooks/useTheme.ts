import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

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

// Store global para sincronizar tema entre componentes
let globalTheme: ThemeId = DEFAULT_THEME;
const listeners = new Set<() => void>();

// Inicializar do localStorage
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && TEMAS.some(t => t.id === saved)) {
    globalTheme = saved as ThemeId;
  }
  // Aplicar tema inicial
  applyThemeToDOM(globalTheme);
}

function applyThemeToDOM(theme: ThemeId) {
  if (typeof document === 'undefined') return;
  
  // Aplicar em TODOS os elementos .mq-app-v1_3
  const elements = document.querySelectorAll('.mq-app-v1_3');
  elements.forEach(el => {
    el.setAttribute('data-theme', theme);
  });
  
  // Também aplicar no body para garantir
  document.body.setAttribute('data-mq-theme', theme);
  
  // Salvar no localStorage
  localStorage.setItem(STORAGE_KEY, theme);
}

function setGlobalTheme(theme: ThemeId) {
  globalTheme = theme;
  applyThemeToDOM(theme);
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return globalTheme;
}

function getServerSnapshot() {
  return DEFAULT_THEME;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Aplicar tema sempre que o componente montar (para novas páginas)
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Observer para aplicar tema em novos elementos .mq-app-v1_3
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(() => {
      applyThemeToDOM(globalTheme);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setGlobalTheme(newTheme);
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

// Função para inicializar tema (chamar no App.tsx)
export function initializeTheme() {
  if (typeof window !== 'undefined') {
    applyThemeToDOM(globalTheme);
  }
}

// Função para obter tema atual (sem hook)
export function getCurrentTheme(): ThemeId {
  return globalTheme;
}

export default useTheme;

