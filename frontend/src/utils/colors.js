const pixel = {
  sky: '#5CE1FF',
  navy: '#5CE1FF',
  deep: '#020617',
  bg: '#050814',
  ink: '#E8F7FF',
  white: '#07101C',
  panel: '#0A1224',
  panelAlt: '#101A30',
  text: '#E8F7FF',
  muted: '#6B8A9A',
  green: '#5CE1FF',
  greenDark: '#0C2233',
  blue: '#5CE1FF',
  gold: '#F0A43A',
  rose: '#FF4D6D',
  border: '#1CFFFF',
  header: '#050814',
  headerText: '#5CE1FF',
  accent: '#5CE1FF',
  feet: '#F0A43A',
  success: '#3DFF9A',
  mapTile: 'dark',
  shell: '#000000',
  overlay: 'rgba(0,0,0,0.78)'
}

export const lightColors = pixel
export const darkColors = pixel

/** Default palette for static StyleSheets / boot splash */
export const colors = pixel

export const statusColor = {
  open: '#3DFF9A',
  busy: '#5CE1FF',
  closed: '#FF4D6D'
}

export const categoryIcons = {
  cafeteria: 'coffee',
  restaurant: 'restaurant',
  kiosk: 'store',
  pharmacy: 'plus',
  bookstore: 'book',
  clothing: 'store',
  tech: 'wifi',
  other: 'store'
}

export function palette() {
  return pixel
}
