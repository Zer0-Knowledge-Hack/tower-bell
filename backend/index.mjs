import Corestore from 'corestore'
import path from 'bare-path'
import { persistent } from 'bare-storage'
import os from 'bare-os'
import process from 'bare-process'
import EventEmitter from 'bare-events'
import b4a from 'b4a'
import { ManejadorDatos } from './datos.mjs'
import { DiscoveryDHT } from './descubrimiento/dht.mjs'

function getStorageDir() {
  const suffix = process.pid
  try {
    return path.join(persistent(), 'towerbell-corestore-' + suffix)
  } catch (e) {
    return path.join(os.tmpdir(), 'towerbell-corestore-' + suffix)
  }
}

const store = new Corestore(getStorageDir())
const datos = new ManejadorDatos(store)
const dht = new DiscoveryDHT(store)

class Escaner extends EventEmitter {
  constructor() {
    super()
    this.locales = new Map()
    this.conectado = false
    
    dht.iniciar().then(() => {
      this.conectado = true
      this.emit('estado', { modo: 'dht', conectado: true })
    }).catch(err => {
      this.emit('estado', { modo: 'dht', conectado: false, error: err })
    })

    dht.on('peer-beacon', async ({ publicKey, conn }) => {
      const keyHex = b4a.toString(publicKey, 'hex')
      const { db } = await datos.getRemoteDb(publicKey)
      
      const onRegistro = async () => {
        const registro = await datos.leerRegistro(db)
        if (registro) {
          registro.id = keyHex
          this.locales.set(keyHex, registro)
          this.emit('local-encontrado', registro)
        }
      }

      await onRegistro()
      // Si el beacon actualiza el registro mientras estamos conectados, lo recibimos
      db.core.on('append', onRegistro)
    })
  }

  listar() {
    return Array.from(this.locales.values())
  }
}

class Beacon extends EventEmitter {
  constructor(registroInicial) {
    super()
    this.registro = registroInicial
    this.visitantes = 0
    this.localDb = null
    
    this._init()
  }
  
  async _init() {
    this.localDb = await datos.getLocalDb()
    await datos.actualizarRegistro(this.localDb.db, this.registro)
    
    await dht.iniciar()
    
    // Anunciamos la clave del hypercore a la red
    dht.anunciar(this.localDb.core.key)
    
    dht.swarm.on('connection', () => {
      this.visitantes++
      this.emit('visitante', { total: this.visitantes })
    })
  }
  
  async actualizar(registro) {
    this.registro = registro
    if (this.localDb) {
      await datos.actualizarRegistro(this.localDb.db, registro)
    }
  }
  
  async detener() {
    await dht.detener()
  }
}

export function escanear() {
  return new Escaner()
}

export function transmitir(registro) {
  return new Beacon(registro)
}
