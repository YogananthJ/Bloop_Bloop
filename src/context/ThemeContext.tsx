import React, { createContext, useContext, useState, useEffect } from 'react';

export type MoodMode = 'day' | 'night';

interface ThemeContextType {
  mode: MoodMode;
  toggleMode: () => void;
  setMode: (mode: MoodMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'day',
  toggleMode: () => {},
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<MoodMode>('day');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bloop_theme_mode') as MoodMode | null;
      if (saved === 'day' || saved === 'night') {
        setModeState(saved);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Default to night if system prefers dark and no manual choice saved
        setModeState('night');
      }
    } catch {
      // Fallback to day
    }
  }, []);

  const setMode = (newMode: MoodMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('bloop_theme_mode', newMode);
    } catch {}
  };

  const toggleMode = () => {
    const next = mode === 'day' ? 'night' : 'day';
    setMode(next);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode }}>
      <div
        className={`min-h-screen transition-colors duration-500 ${
          mode === 'night'
            ? 'bg-[#1C172B] text-[#F3ECF8]'
            : 'bg-[#FFF6E8] text-[#493B43]'
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
