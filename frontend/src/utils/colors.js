/** Night / 8-bit (default for judges demo). */
export const darkColors = {
  sky: '#5CE1FF',
  navy: '#5CE1FF',
  deep: '#020617',
  bg: '#050814',
  ink: '#E8F7FF',
  white: '#E8F7FF',
  panel: '#0A1224',
  panelAlt: '#101A30',
  text: '#E8F7FF',
  muted: '#8AA8B8',
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
  highlight: '#0C2A3A',
  highlightBorder: '#5CE1FF',
  unread: '#0C2233',
  toastBg: '#5CE1FF',
  toastText: '#020617',
  onAccent: '#020617',
  mapTile: 'dark',
  shell: '#000000',
  overlay: 'rgba(0,0,0,0.78)'
}

/** Day / 8-bit — high contrast cyan on light paper (not soft cream). */
export const lightColors = {
  sky: '#007A99',
  navy: '#005F7A',
  deep: '#DFF6FF',
  bg: '#EEFAFF',
  ink: '#020617',
  white: '#FFFFFF',
  panel: '#FFFFFF',
  panelAlt: '#C8EAF6',
  text: '#020617',
  muted: '#3A5560',
  green: '#007A99',
  greenDark: '#B8E4F2',
  blue: '#007A99',
  gold: '#B86A00',
  rose: '#C9183A',
  border: '#007A99',
  header: '#020617',
  headerText: '#5CE1FF',
  accent: '#007A99',
  feet: '#B86A00',
  success: '#0A8F4D',
  highlight: '#B8E4F2',
  highlightBorder: '#007A99',
  unread: '#C8EAF6',
  toastBg: '#020617',
  toastText: '#5CE1FF',
  onAccent: '#FFFFFF',
  mapTile: 'light',
  shell: '#020617',
  overlay: 'rgba(2,6,23,0.55)'
}

/** Static fallback (boot / modules without hooks) = dark pixel. */
export const colors = darkColors

export function palette(darkMode = true) {
  return darkMode ? darkColors : lightColors
}

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
