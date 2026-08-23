export const lightColors = {
  sky: '#54ADF6',
  navy: '#0D47A1',
  deep: '#071536',
  bg: '#E8EEF7',
  ink: '#0A110F',
  white: '#FFFFFF',
  panel: '#FFFFFF',
  panelAlt: '#F3F6FB',
  text: '#0A110F',
  muted: '#5B6475',
  green: '#0D47A1',
  greenDark: '#D6E6F8',
  blue: '#54ADF6',
  gold: '#F0A43A',
  rose: '#C62828',
  border: '#D4DCEC',
  header: '#0D47A1',
  headerText: '#FFFFFF',
  accent: '#54ADF6',
  feet: '#F0A43A',
  success: '#1F8A4C',
  mapTile: 'light',
  shell: '#9AA7B8',
  overlay: 'rgba(7,21,54,0.55)',
};

export const darkColors = {
  sky: '#54ADF6',
  navy: '#54ADF6',
  deep: '#050B18',
  bg: '#0B1220',
  ink: '#E8EEF7',
  white: '#121A2B',
  panel: '#151E31',
  panelAlt: '#1A2438',
  text: '#E8EEF7',
  muted: '#8B95A8',
  green: '#54ADF6',
  greenDark: '#1A2A44',
  blue: '#54ADF6',
  gold: '#F0A43A',
  rose: '#EF5350',
  border: '#243049',
  header: '#0A1628',
  headerText: '#FFFFFF',
  accent: '#54ADF6',
  feet: '#F0A43A',
  success: '#3DDC84',
  mapTile: 'dark',
  shell: '#050B18',
  overlay: 'rgba(0,0,0,0.65)',
};

/** Default light palette for static StyleSheets / boot splash */
export const colors = lightColors;

export const statusColor = {
  open: '#1F8A4C',
  busy: '#0D47A1',
  closed: '#C62828',
};

export const categoryIcons = {
  cafeteria: 'coffee',
  restaurant: 'restaurant',
  kiosk: 'store',
  pharmacy: 'plus',
  bookstore: 'book',
  clothing: 'store',
  tech: 'wifi',
  other: 'store',
};

export function palette(darkMode) {
  return darkMode ? darkColors : lightColors;
}
