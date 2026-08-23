import { useMemo } from 'react'
import { useAppStore } from '../store/app.store'
import { darkColors, lightColors, palette } from './colors'

export function useThemeColors() {
  const darkMode = useAppStore((s) => s.db?.darkMode !== false)
  return useMemo(() => (darkMode ? darkColors : lightColors), [darkMode])
}

export function useDarkMode() {
  return useAppStore((s) => s.db?.darkMode !== false)
}

/** @deprecated prefer useThemeColors — kept for non-hook call sites */
export function getPalette(darkMode = true) {
  return palette(darkMode)
}
