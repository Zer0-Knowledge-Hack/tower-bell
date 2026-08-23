// frontend/cli/trade.mjs — Beacon panel (trade)
// Uses the contract interface: beacon(record) -> events visitor

import { colors, BANNER, categoryIcon, statusBadge, separatorLine, timestamp } from './style.mjs'

const { BOLD, DIM, CYAN, GREEN, YELLOW, WHITE, BG_GREEN } = colors

export function startBeaconPanel(backendFn, record) {
  console.clear()
  console.log(BANNER)
  console.log(BOLD(WHITE('  BEACON MODE — broadcasting your shop record\n')))
  console.log(separatorLine())

  const icon = categoryIcon(record.category)
  console.log()
  console.log(`  ${icon}  ${BOLD(record.name)}  ${statusBadge(record.status)}`)
  if (record.message) {
    console.log(`     ${YELLOW('>')} ${record.message}`)
  }
  if (record.hours) {
    console.log(`     ${DIM('hours ' + record.hours)}`)
  }
  console.log()
  console.log(separatorLine())
  console.log(`  ${BG_GREEN(' LIVE ')} ${GREEN('You are broadcasting')} ${timestamp()}`)
  console.log(DIM('  Nearby travelers can see you now.\n'))

  const beacon = backendFn(record)

  beacon.on('visitor', ({ total }) => {
    console.log(`  ${CYAN('*')} Visitor ${BOLD('total:')} ${WHITE(String(total))} ${timestamp()}`)
  })

  return beacon
}
