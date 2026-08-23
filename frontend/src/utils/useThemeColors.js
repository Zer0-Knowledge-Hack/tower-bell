import { useMemo } from 'react'
import { useAppStore } from '../store/app.store'
import { palette } from './colors'

export function useThemeColors() {
  const darkMode = useAppStore((s) => !!s.db?.darkMode)
  return useMemo(() => palette(darkMode), [darkMode])
}

export function useDarkMode() {
  return useAppStore((s) => !!s.db?.darkMode)
}
