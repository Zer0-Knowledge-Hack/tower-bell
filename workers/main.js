// Replaces the untouched hello-pear-worker boilerplate. That package never
// passes a `delay` to PearRuntime (verified against its published source),
// so it always falls back to the library default of up to one hour before
// checking for an update — dead on arrival for a live demo. This worker
// wires the same PearRuntime <-> App.js IPC contract, with an explicit
// low delay instead.
//
// Argument order matches what App.js passes to PearRuntime.run(): when a
// worker is spawned this way, Bare.argv[2] is the first passed argument.
const PearRuntime = require('pear-runtime')
const FramedStream = require('framed-stream')

const updates = Bare.argv[2] === 'true'
const version = Bare.argv[3]
const upgrade = Bare.argv[4]
const name = Bare.argv[5]
const dir = Bare.argv[6]
const app = Bare.argv[7] || null

// Max random delay (ms) before checking a detected update. Low on purpose
// for demo/judging; a production deploy with many installed peers should
// raise this back up to avoid every peer hitting the seed at once.
const UPDATE_CHECK_DELAY = 5000

const pear = new PearRuntime({
  dir,
  version,
  upgrade,
  name,
  app,
  updates,
  delay: UPDATE_CHECK_DELAY
})

const pipe = new FramedStream(Bare.IPC)

pear.on('error', (err) => pipe.write(`error: ${err.message}`))

pear.updater.on('updating', () => pipe.write('updating'))
pear.updater.on('updated', () => pipe.write('updated'))

pipe.on('data', (data) => {
  const message = data.toString()
  if (message === 'pear:applyUpdate') {
    pear.updater.applyUpdate()
    pipe.write('pear:updateApplied')
  }
})

pear.ready().catch((err) => pipe.write(`error: ${err.message}`))
