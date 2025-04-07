import React, { useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const getSystemTheme = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (newTheme: Theme) => {
      // Remove all theme classes first
      root.classList.remove('light', 'dark');
      
      // Apply the appropriate theme
      if (newTheme === 'system') {
        const systemTheme = getSystemTheme();
        root.classList.add(systemTheme);
      } else {
        root.classList.add(newTheme);
      }
    };

    // Apply initial theme
    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Set up system theme change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'system') return 'light';
      if (prevTheme === 'light') return 'dark';
      return 'system';
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {theme === 'system' ? '🌓' : theme === 'light' ? '☀️' : '🌙'}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
        {theme}
      </span>
    </button>
  );
};

export default ThemeToggle; 