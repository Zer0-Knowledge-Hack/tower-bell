const Hyperbee = require('hyperbee')
const b4a = require('b4a')

class DataManager {
  constructor(corestore) {
    this.store = corestore
    this.dbs = new Map()
  }

  async getLocalDb(name = 'local-beacon') {
    const core = this.store.get({ name })
    await core.ready()
    const db = new Hyperbee(core, {
      keyEncoding: 'utf-8',
      valueEncoding: 'json'
    })
    await db.ready()
    return { core, db }
  }

  async getRemoteDb(key) {
    const keyHex = b4a.toString(key, 'hex')
    if (this.dbs.has(keyHex)) return this.dbs.get(keyHex)

    const core = this.store.get({ key })
    await core.ready()
    const db = new Hyperbee(core, {
      keyEncoding: 'utf-8',
      valueEncoding: 'json'
    })

    const bundle = { core, db }
    this.dbs.set(keyHex, bundle)
    return bundle
  }

  async updateRecord(db, record) {
    await db.put('record', record)
  }

  async readRecord(db) {
    const node = await db.get('record')
    return node ? node.value : null
  }
}

module.exports = { DataManager }
