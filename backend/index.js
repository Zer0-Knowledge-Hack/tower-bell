const Corestore = require('corestore')
const path = require('bare-path')
const { persistent } = require('bare-storage')
const os = require('bare-os')
const EventEmitter = require('bare-events')
const b4a = require('b4a')
const { DataManager } = require('./data.js')
const { DiscoveryDHT } = require('./discovery/dht.js')

// Storage root used when the caller does not pass one. Deliberately stable
// across runs: a beacon's identity is the key of its hypercore, which lives
// here, so a shop that restarts has to come back as the same peer. Suffixing
// this with process.pid gave every run a fresh identity and left a dead
// corestore directory behind each time.
//
// Two instances on one machine (the usual P2P check) pass different roots via
// the --storage flag instead.
function defaultStorageRoot() {
  try {
    return path.join(persistent(), 'towerbell')
  } catch (e) {
    return path.join(os.tmpdir(), 'towerbell')
  }
}

let store = null
let data = null
let dht = null
let storageRoot = null

// Corestore locks its directory, so a second instance pointed at the same
// root fails deep inside rocksdb with "File descriptor could not be locked".
// Running two peers on one machine is the normal way to test this app, so the
// error has to say what to do about it instead of dumping a stack trace.
function describeStorageError(err) {
  if (err && /could not be locked/i.test(err.message || '')) {
    const e = new Error(
      `another Towerbell instance is already using ${storageRoot} — ` +
        'pass --storage <dir> to run a second one on this machine'
    )
    e.code = 'STORAGE_LOCKED'
    return e
  }
  return err
}

// Opening a Corestore is a side effect, so it waits until a scanner or beacon
// is actually created. That is also what lets the caller choose the root.
function init(options = {}) {
  if (store !== null) return

  storageRoot = options.storage || defaultStorageRoot()
  store = new Corestore(path.join(storageRoot, 'corestore'))
  data = new DataManager(store)
  dht = new DiscoveryDHT(store)
}

class Scanner extends EventEmitter {
  constructor(options = {}) {
    super()
    init(options)
    this.peers = new Map()
    this.connected = false

    dht
      .start()
      .then(() => {
        this.connected = true
        this.emit('status', { mode: 'dht', connected: true })
      })
      .catch((err) => {
        this.emit('status', { mode: 'dht', connected: false, error: err })
      })

    dht.on('peer-beacon', async ({ publicKey, record: announced }) => {
      const keyHex = b4a.toString(publicKey, 'hex')

      const emitRecord = (record) => {
        if (!record) return
        record.id = keyHex
        this.peers.set(keyHex, record)
        this.emit('peer-found', record)
      }

      if (announced) {
        emitRecord({ ...announced })
        return
      }

      try {
        const { db } = await data.getRemoteDb(publicKey)
        const onRecord = async () => {
          emitRecord(await data.readRecord(db))
        }
        await onRecord()
        db.core.on('append', onRecord)
      } catch (err) {
        this.emit('error', describeStorageError(err))
      }
    })

    dht.on('peer-left', (publicKey) => {
      const keyHex = b4a.toString(publicKey, 'hex')
      if (this.peers.delete(keyHex)) {
        this.emit('peer-lost', keyHex)
      }
    })
  }

  list() {
    return Array.from(this.peers.values())
  }

  async stop() {
    await dht.stop()
  }
}

class Beacon extends EventEmitter {
  constructor(initialRecord, options = {}) {
    super()
    init(options)
    this.record = initialRecord
    this.visitors = 0
    this.localDb = null

    this._init().catch((err) => this.emit('error', describeStorageError(err)))
  }

  async _init() {
    this.localDb = await data.getLocalDb()
    await data.updateRecord(this.localDb.db, this.record)

    await dht.start()

    // Announce our hypercore key to the network
    dht.announce(this.localDb.core.key, this.record)

    dht.swarm.on('connection', () => {
      this.visitors++
      this.emit('visitor', { total: this.visitors })
    })
  }

  async update(record) {
    this.record = record
    if (this.localDb) {
      await data.updateRecord(this.localDb.db, record)
      dht.announce(this.localDb.core.key, this.record)
    }
  }

  async stop() {
    await dht.stop()
  }
}

function scan(options) {
  return new Scanner(options)
}

function beacon(record, options) {
  return new Beacon(record, options)
}

module.exports = { scan, beacon }
