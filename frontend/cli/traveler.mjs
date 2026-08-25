// frontend/cli/traveler.mjs - Traveler panel (scan)
// Uses the contract interface: scan() -> events peer-found, peer-lost, status

import { colors, BANNER, categoryIcon, statusBadge, separatorLine, timestamp } from './style.mjs'

const { BOLD, DIM, CYAN, GREEN, YELLOW, RED, WHITE } = colors

export function startTravelerPanel(backendFn) {
  console.clear()
  console.log(BANNER)
  console.log(BOLD(WHITE('  SCAN MODE - listening for nearby beacons\n')))
  console.log(separatorLine())
  console.log(DIM('  Connecting to P2P network...\n'))

  const peers = new Map()
  const network = backendFn()

  network.on('status', ({ mode, connected, error }) => {
    if (connected) {
      console.log(`  ${GREEN('+')} ${BOLD(mode.toUpperCase())} Network connected ${timestamp()}`)
    } else {
      console.log(
        `  ${RED('x')} ${mode.toUpperCase()} Network disconnected ${error ? 'x ' + error.message : ''} ${timestamp()}`
      )
    }
    console.log(separatorLine())
    renderPeers(peers)
  })

  network.on('peer-found', (record) => {
    peers.set(record.id, record)
    renderPeers(peers)
  })

  network.on('peer-lost', (id) => {
    peers.delete(id)
    renderPeers(peers)
  })

  return network
}

function renderPeers(peers) {
  if (peers.size === 0) {
    console.log(`\n  ${DIM('No beacons nearby yet...')}`)
    console.log(DIM('  Still searching. Leave the terminal open.\n'))
    return
  }

  console.log(`\n  ${BOLD(WHITE(`${peers.size} beacon${peers.size > 1 ? 's' : ''} nearby:`))}`)
  console.log()

  let i = 1
  for (const [id, reg] of peers) {
    const icon = categoryIcon(reg.category)
    console.log(`  ${CYAN(String(i) + '.')} ${icon}  ${BOLD(reg.name)}  ${statusBadge(reg.status)}`)
    if (reg.message) {
      console.log(`     ${YELLOW('>')} ${reg.message}`)
    }
    if (reg.hours) {
      console.log(`     ${DIM('hours ' + reg.hours)}`)
    }
    console.log(`     ${DIM('ID: ' + id.slice(0, 12) + '...')}`)
    console.log()
    i++
  }
  console.log(separatorLine())
  console.log(DIM(`  Last updated: ${new Date().toLocaleTimeString()}`))
  console.log()
}
