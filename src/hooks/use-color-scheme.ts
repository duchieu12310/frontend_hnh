import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('color-scheme') as ColorScheme | null;
    if (stored) return stored;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Update HTML class
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('color-scheme', colorScheme);
  }, [colorScheme]);

  const toggleColorScheme = (value?: ColorScheme) => {
    if (value) {
      setColorScheme(value);
    } else {
      setColorScheme(prev => prev === 'dark' ? 'light' : 'dark');
    }
  };

  return { colorScheme, toggleColorScheme };
}









