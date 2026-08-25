// frontend/cli/style.mjs — 8-bit HUD identity (Zero-Knolage / owl tower)

const ESC = '\x1b['
const RESET = `${ESC}0m`

const BOLD = (text) => `${ESC}1m${text}${RESET}`
const DIM = (text) => `${ESC}2m${text}${RESET}`
const CYAN = (text) => `${ESC}36m${text}${RESET}`
const GREEN = (text) => `${ESC}32m${text}${RESET}`
const YELLOW = (text) => `${ESC}33m${text}${RESET}`
const RED = (text) => `${ESC}31m${text}${RESET}`
const MAGENTA = (text) => `${ESC}35m${text}${RESET}`
const WHITE = (text) => `${ESC}97m${text}${RESET}`
const BG_CYAN = (text) => `${ESC}46m${ESC}30m${text}${RESET}`
const BG_GREEN = (text) => `${ESC}42m${ESC}30m${text}${RESET}`
const BG_YELLOW = (text) => `${ESC}43m${ESC}30m${text}${RESET}`

export const colors = {
  BOLD,
  DIM,
  CYAN,
  GREEN,
  YELLOW,
  RED,
  MAGENTA,
  WHITE,
  BG_CYAN,
  BG_GREEN,
  BG_YELLOW,
  RESET
}

export const BANNER = `
${CYAN('  +----------------------------------------------+')}
${CYAN('  |')}  ${BOLD(CYAN('TOWERBELL'))}  ${DIM('owl tower · 8-bit')}           ${CYAN('|')}
${CYAN('  |')}     ${YELLOW(' /\\_/\\')}                                 ${CYAN('|')}
${CYAN('  |')}    ${YELLOW('( o o )')}  ${WHITE('scan / beacon')}               ${CYAN('|')}
${CYAN('  |')}     ${YELLOW(' >^<')}   ${DIM('no servers · no accounts')}      ${CYAN('|')}
${CYAN('  |')}  ${DIM('ZERO-KNOLAGE')}                             ${CYAN('|')}
${CYAN('  +----------------------------------------------+')}
`

export const CATEGORIES = {
  cafeteria: '[cafe]',
  restaurant: '[food]',
  kiosk: '[kiosk]',
  pharmacy: '[rx]',
  bookstore: '[book]',
  clothing: '[wear]',
  tech: '[tech]',
  other: '[shop]'
}

export function categoryIcon(cat) {
  return CATEGORIES[cat] || CATEGORIES.other
}

export function statusBadge(status) {
  if (status === 'open') return BG_GREEN(' OPEN ')
  if (status === 'closed') return RED(' CLOSED ')
  return BG_YELLOW(` ${status.toUpperCase()} `)
}

export function separatorLine() {
  return CYAN('  ' + '-'.repeat(48))
}

export function timestamp() {
  return DIM(new Date().toLocaleTimeString())
}
