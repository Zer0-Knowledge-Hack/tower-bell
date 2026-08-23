import { useMemo } from 'react'
import { useAppStore } from '../store/app.store'
import { palette } from './colors'

export function useThemeColors() {
  return useMemo(() => palette(), [])
}

export function useDarkMode() {
  return useAppStore((s) => !!s.db?.darkMode)
}
