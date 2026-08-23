import Hyperbee from 'hyperbee'
import b4a from 'b4a'

export class ManejadorDatos {
  constructor(corestore) {
    this.store = corestore
    this.dbs = new Map() // key (hex) -> Hyperbee
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
    if (this.dbs.has(keyHex)) {
      return this.dbs.get(keyHex)
    }

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

  async actualizarRegistro(db, registro) {
    await db.put('registro', registro)
  }

  async leerRegistro(db) {
    const node = await db.get('registro')
    return node ? node.value : null
  }
}
