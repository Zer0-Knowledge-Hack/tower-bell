import { command, flag, summary, arg } from 'paparam'
import { persistent } from 'bare-storage'
import process from 'bare-process'
import os from 'bare-os'
import { isWindows } from 'which-runtime'
import path from 'bare-path'
import fs from 'bare-fs'
import goodbye from 'graceful-goodbye'
import pkg from './package.json'
import App from './app.js'
import { scan, beacon } from './backend/index.js'
import { startTravelerPanel } from './frontend/traveler.mjs'
import { startBeaconPanel } from './frontend/trade.mjs'

const appName = pkg.productName || pkg.name
const isDev = path.basename(Bare.argv[0]) === (isWindows ? 'bare.exe' : 'bare')

const cmd = command(
  appName,
  summary(pkg.description),
  flag('--version|-v', 'Print the current version'),
  flag('--storage <dir>', 'custom storage directory'),
  flag('--no-updates', 'disable OTA updates for this run'),
  flag('--fake', 'use mock data instead of real P2P'),
  flag('--name <name>', 'Beacon shop name'),
  flag('--category <category>', 'Beacon category (cafeteria, restaurant, ...)'),
  flag('--status <status>', 'Beacon status: open or closed'),
  flag('--message <message>', 'Beacon promo message'),
  flag('--hours <hours>', 'Beacon opening hours'),
  arg('[mode]', 'Mode: scan or beacon')
)

cmd.parse(Bare.argv.slice(isDev ? 2 : 1))
if (cmd.flags.help) Bare.exit()
if (cmd.flags.version) {
  console.log(`${appName} v${pkg.version}`)
  Bare.exit()
}

const updates = cmd.flags.updates
const storage = cmd.flags.storage || (isDev ? null : path.join(persistent(), appName))
const dir = storage || path.join(os.tmpdir(), 'pear', appName)

// Load upgrade URL from .env if it exists
let upgradeUrl = pkg.upgrade
try {
  const envPath = path.join(process.cwd(), '.env')
  const envContent = fs.readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/)
    if (match) {
      const key = match[1]
      let value = match[2] || ''
      value = value.replace(/(^['"]|['"]$)/g, '').trim()
      if (key === 'PEAR_UPGRADE_URL') {
        upgradeUrl = value
      }
    }
  }
} catch (e) {
  // No .env file
}

const app = new App({
  dir,
  app: isDev ? null : os.execPath(),
  updates,
  version: pkg.version,
  upgrade: upgradeUrl,
  name: isWindows ? appName + '.exe' : appName
})

app.on('message', (message) => console.log(message))
app.on('updating', () => console.log('[updater] getting new update'))
app.on('updating-delta', (delta) => console.log('[updater]', delta))
app.on('updated', () => console.log('[updater] update complete... applying'))
app.on('update-applied', () =>
  console.log('[updater] applied update, restart to run latest version')
)
app.on('error', (err) => console.error('[app:error]', err))

process.on('SIGHUP', () => app.exit(129))
process.on('SIGINT', () => app.exit(130))
process.on('SIGQUIT', () => app.exit(131))
process.on('SIGTERM', () => app.exit(143))

try {
  await app.ready()

  // Select backend: real or mock based on --fake
  let backendScan = scan
  let backendBeacon = beacon
  if (cmd.flags.fake) {
    const mock = await import('./backend/mock.js')
    backendScan = mock.scan
    backendBeacon = mock.beacon
  }

  const mode = cmd.args.mode || (Array.isArray(cmd.args) ? cmd.args[0] : null)

  if (mode === 'scan') {
    const network = startTravelerPanel(backendScan)
    // Close the DHT swarm on exit so a Ctrl+C traveler drops off the
    // network right away instead of lingering until the OS tears down the
    // connection on its own.
    goodbye(() => network.stop?.())
  } else if (mode === 'beacon') {
    const myRecord = {
      name: cmd.flags.name || 'Café Rivadavia',
      category: cmd.flags.category || 'cafeteria',
      status: cmd.flags.status || 'open',
      message: cmd.flags.message || '2 for 1 croissants until 6PM',
      hours: cmd.flags.hours || '08:00-20:00',
      updated: new Date().toISOString()
    }
    const myBeacon = startBeaconPanel(backendBeacon, myRecord)
    // Same for a beacon: stop announcing right away instead of leaving a
    // stale record for scanners until the connection drops on its own.
    goodbye(() => myBeacon.stop?.())
  } else {
    console.log('\n  Usage: towerbell <scan|beacon> [options]\n')
    console.log('  Commands:')
    console.log('    scan      Traveler mode — discovers nearby peers')
    console.log('    beacon    Trade mode — broadcasts your record')
    console.log('\n  Options:')
    console.log('    --fake                Use test data (no P2P network)')
    console.log('    --name <name>         Beacon shop name')
    console.log('    --category <category> Beacon category')
    console.log('    --status <status>     open or closed')
    console.log('    --message <message>   Promo message')
    console.log('    --hours <hours>       Opening hours')
    console.log('    --help                Show this help\n')
    await app.exit(0)
    Bare.exit(0)
  }
} catch (err) {
  console.error('[app:error]', err)
  await app.close().finally(() => Bare.exit(1))
}
