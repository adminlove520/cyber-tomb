"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('cyber');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cyber_tomb_theme') as Theme;
    if (savedTheme && ['cyber', 'zen', 'classic'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('cyber_tomb_theme', newTheme);
  };

  useEffect(() => {
    if (!mounted) return;
    
    // Remove old theme classes
    const html = document.documentElement;
    html.classList.remove('theme-cyber', 'theme-zen', 'theme-classic');
    
    // Add new theme class
    html.classList.add(`theme-${theme}`);
    
    // Also apply a global transition to colors
    html.style.transition = 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease';
  }, [theme, mounted]);

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
