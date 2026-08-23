import { Platform } from 'react-native'

export const pixelBody = Platform.select({
  web: 'VT323, monospace',
  default: 'monospace'
})

export const pixelTitle = Platform.select({
  web: '"Press Start 2P", monospace',
  default: 'monospace'
})

export function loadPixelFonts() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return
  if (document.getElementById('towerbell-pixel-fonts')) return
  const link = document.createElement('link')
  link.id = 'towerbell-pixel-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap'
  document.head.appendChild(link)
}

export function hudBox(c, extra = {}) {
  return {
    backgroundColor: c.panel,
    borderWidth: 2,
    borderColor: c.border,
    borderRadius: 0,
    ...extra
  }
}
