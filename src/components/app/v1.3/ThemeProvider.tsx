import { useEffect, createContext, useContext, type ReactNode } from 'react';
import useTheme, { type ThemeId, type ThemeInfo, TEMAS } from '@/hooks/useTheme';

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  currentTheme: ThemeInfo;
  temas: ThemeInfo[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeValue = useTheme();

  // Aplicar tema no elemento raiz sempre que mudar
  useEffect(() => {
    const applyTheme = () => {
      const elements = document.querySelectorAll('.mq-app-v1_3');
      elements.forEach(el => {
        el.setAttribute('data-theme', themeValue.theme);
      });
      document.documentElement.setAttribute('data-mq-theme', themeValue.theme);
    };

    applyTheme();

    // Observer para aplicar tema em novos elementos
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [themeValue.theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback para quando não está dentro do provider
    return {
      theme: 'clareza' as ThemeId,
      setTheme: () => {},
      currentTheme: TEMAS[0],
      temas: TEMAS,
      isDark: false,
    };
  }
  return context;
}

export default ThemeProvider;

