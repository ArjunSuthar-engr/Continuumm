import { useEffect, useState } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  resolveInitialTheme,
} from './themeContext'

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(resolveInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === 'dark' ? 'light' : 'dark',
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider }
