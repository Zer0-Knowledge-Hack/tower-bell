const { command, flag, header, summary } = require('paparam')
const process = require('bare-process')
const path = require('bare-path')
const { isWindows } = require('which-runtime')
const pkg = require('./package.json')

const appName = pkg.productName || pkg.name
const isDev = path.basename(Bare.argv[0]) === (isWindows ? 'bare.exe' : 'bare')

function engancharSenales() {
  process.on('SIGHUP', () => Bare.exit(129))
  process.on('SIGINT', () => Bare.exit(130))
  process.on('SIGQUIT', () => Bare.exit(131))
  process.on('SIGTERM', () => Bare.exit(143))
}

const scan = command(
  'scan',
  summary('Modo viajero: descubre locales cercanos'),
  () => {
    engancharSenales()
    require('./frontend/viajero').iniciar()
  }
)

const beacon = command(
  'beacon',
  summary('Modo comercio: transmite el registro del local'),
  () => {
    engancharSenales()
    require('./frontend/comercio').iniciar()
  }
)

const cmd = command(
  appName,
  header('Towerbell — descubrimiento hiperlocal de comercios'),
  summary(pkg.description),
  flag('--version|-v', 'Imprime la versión'),
  flag('--storage|-s <dir>', 'Directorio de storage'),
  flag('--no-updates', 'Desactiva updates OTA en esta corrida'),
  scan,
  beacon,
  () => {
    if (cmd.flags.version) {
      console.log(`${appName} v${pkg.version}`)
      Bare.exit()
    }
    console.log(cmd.help())
  }
)

const argv = Bare.argv.slice(isDev ? 2 : 1).filter((x) => x !== '--')
cmd.parse(argv)
if (cmd.flags.help) Bare.exit()
if (cmd.flags.version) {
  console.log(`${appName} v${pkg.version}`)
  Bare.exit()
}
