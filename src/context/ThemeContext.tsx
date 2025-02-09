import {Appearance} from 'react-native';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import colors from '@/config/locals/colors.locals';

// Light and Dark Themes
export const lightTheme = {
  background: colors.CFFF,
};

export const darkTheme = {
  background: '#121212',
};

// Define Theme Context Type
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create Context
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

// Theme Provider Component
export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    systemColorScheme === 'dark' ? 'dark' : 'light',
  );

  // Function to toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Update theme when system preference changes
  useEffect(() => {
    const themeListener = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => themeListener.remove();
  }, []);

  // Memoize context value for optimization
  const MemoizedValue = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={MemoizedValue}>
      {children}
    </ThemeContext.Provider>
  );
};
