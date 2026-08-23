import { command, flag, summary, arg } from 'paparam'
import { persistent } from 'bare-storage'
import process from 'bare-process'
import os from 'bare-os'
import { isWindows } from 'which-runtime'
import path from 'bare-path'
import fs from 'bare-fs'
import pkg from './package.json'
import App from './app.js'
import { escanear, transmitir } from './backend/mock.mjs'

const appName = pkg.productName || pkg.name
const isDev = path.basename(Bare.argv[0]) === (isWindows ? 'bare.exe' : 'bare')

const cmd = command(
  appName,
  summary(pkg.description),
  flag('--version|-v', 'Print the current version'),
  flag('--storage <dir>', 'custom storage directory'),
  flag('--no-updates', 'disable OTA updates for this run'),
  arg('<modo>', 'Modo de inicio: scan o beacon')
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

console.log(`Updates: ${updates === false ? 'disabled' : 'enabled'}`)

let upgradeUrl = pkg.upgrade
try {
  const envPath = path.join(process.cwd(), '.env')
  const envContent = fs.readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
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
  console.log('\nCLI ready. Press Ctrl+C to stop.\n')

  const modo = cmd.args.modo || (Array.isArray(cmd.args) ? cmd.args[0] : null)
  if (modo === 'scan') {
    console.log('Iniciando modo viajero (Scan)...')
    const red = escanear()
    red.on('estado', ({ modo, conectado, error }) => {
      console.log(`[Red] Modo: ${modo} | Conectado: ${conectado} ${error ? '| Error: ' + error.message : ''}`)
    })
    red.on('local-encontrado', (registro) => {
      console.log('\n=======================================')
      console.log(`🏪 ${registro.nombre}`)
      console.log(`   Categoría: ${registro.categoria} | Estado: ${registro.estado}`)
      console.log(`   Mensaje: ${registro.mensaje}`)
      console.log(`   Horario: ${registro.horario}`)
      console.log('=======================================\n')
    })
  } else if (modo === 'beacon') {
    console.log('Iniciando modo comercio (Beacon)...')
    const miRegistro = {
      nombre: "Café Rivadavia",
      categoria: "cafeteria",
      estado: "abierto",
      mensaje: "2x1 en medialunas hasta las 18",
      horario: "08:00-20:00",
      actualizado: new Date().toISOString()
    }
    const beacon = transmitir(miRegistro)
    beacon.on('visitante', ({ total }) => {
      console.log(`📡 ¡Alguien ha leído tu transmisión! Total visitantes: ${total}`)
    })
    console.log('Transmitiendo localmente...')
  } else {
    console.log('Por favor, especifica un modo: "scan" o "beacon".')
    console.log('Ejemplo: pnpm start scan')
  }

} catch (err) {
  console.error('[app:error]', err)
  await app.close().finally(() => Bare.exit(1))
}
