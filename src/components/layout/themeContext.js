import { createContext, useContext } from 'react'

const THEME_STORAGE_KEY = 'continuumm-theme'
const ThemeContext = createContext(null)

function resolveInitialTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}

export { THEME_STORAGE_KEY, ThemeContext, resolveInitialTheme, useTheme }
