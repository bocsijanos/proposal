'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { applyTheme } from '@/lib/themes';
import { Brand, brandToThemeKey, isBrand } from '@/lib/types/brand';

// Re-export Brand type for consumers
export type { Brand } from '@/lib/types/brand';

interface ThemeContextType {
  theme: Brand;
  setTheme: (theme: Brand) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Brand;
}

export function ThemeProvider({ children, defaultTheme = 'BOOM' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Brand>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage (convert from old format if needed)
    const savedTheme = localStorage.getItem('proposal-theme');
    if (savedTheme) {
      // Handle both old lowercase and new uppercase formats
      const normalizedTheme = savedTheme.toUpperCase();
      if (isBrand(normalizedTheme)) {
        setThemeState(normalizedTheme);
        applyTheme(brandToThemeKey(normalizedTheme));
      } else {
        applyTheme(brandToThemeKey(defaultTheme));
      }
    } else {
      applyTheme(brandToThemeKey(defaultTheme));
    }
  }, [defaultTheme]);

  const setTheme = (newTheme: Brand) => {
    setThemeState(newTheme);
    applyTheme(brandToThemeKey(newTheme));
    // Save as uppercase (canonical format)
    localStorage.setItem('proposal-theme', newTheme);

    // Add transition class
    document.body.classList.add('theme-transitioning');
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 600);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
