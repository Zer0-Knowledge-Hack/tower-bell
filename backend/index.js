const Corestore = require('corestore')
const path = require('bare-path')
const { persistent } = require('bare-storage')
const os = require('bare-os')
const process = require('bare-process')
const EventEmitter = require('bare-events')
const b4a = require('b4a')
const { DataManager } = require('./data.js')
const { DiscoveryDHT } = require('./discovery/dht.js')

function getStorageDir() {
  const suffix = process.pid
  try {
    return path.join(persistent(), 'towerbell-corestore-' + suffix)
  } catch (e) {
    return path.join(os.tmpdir(), 'towerbell-corestore-' + suffix)
  }
}

const store = new Corestore(getStorageDir())
const data = new DataManager(store)
const dht = new DiscoveryDHT(store)

class Scanner extends EventEmitter {
  constructor() {
    super()
    this.peers = new Map()
    this.connected = false
    
    dht.start().then(() => {
      this.connected = true
      this.emit('status', { mode: 'dht', connected: true })
    }).catch(err => {
      this.emit('status', { mode: 'dht', connected: false, error: err })
    })

    dht.on('peer-beacon', async ({ publicKey, conn }) => {
      const keyHex = b4a.toString(publicKey, 'hex')
      const { db } = await data.getRemoteDb(publicKey)
      
      const onRecord = async () => {
        const record = await data.readRecord(db)
        if (record) {
          record.id = keyHex
          this.peers.set(keyHex, record)
          this.emit('peer-found', record)
        }
      }

      await onRecord()
      // If the beacon updates the record while we are connected, we receive it
      db.core.on('append', onRecord)
    })
  }

  list() {
    return Array.from(this.peers.values())
  }
}

class Beacon extends EventEmitter {
  constructor(initialRecord) {
    super()
    this.record = initialRecord
    this.visitors = 0
    this.localDb = null
    
    this._init()
  }
  
  async _init() {
    this.localDb = await data.getLocalDb()
    await data.updateRecord(this.localDb.db, this.record)
    
    await dht.start()
    
    // Announce our hypercore key to the network
    dht.announce(this.localDb.core.key)
    
    dht.swarm.on('connection', () => {
      this.visitors++
      this.emit('visitor', { total: this.visitors })
    })
  }
  
  async update(record) {
    this.record = record
    if (this.localDb) {
      await data.updateRecord(this.localDb.db, record)
    }
  }
  
  async stop() {
    await dht.stop()
  }
}

function scan() {
  return new Scanner()
}

function beacon(record) {
  return new Beacon(record)
}

module.exports = { scan, beacon }
