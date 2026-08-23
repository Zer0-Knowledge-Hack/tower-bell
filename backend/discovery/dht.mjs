import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
import FramedStream from 'framed-stream'
import EventEmitter from 'bare-events'

// Un tópico de 32 bytes constante para que todos los nodos se encuentren
const TOPIC = b4a.alloc(32).fill('towerbell-discovery-v1')

export class DiscoveryDHT extends EventEmitter {
  constructor(store) {
    super()
    this.store = store
    this.swarm = new Hyperswarm()
    
    this.swarm.on('connection', (conn, info) => {
      // Replicar todo el corestore por defecto a través de la conexión
      this.store.replicate(conn)

      // Establecer un canal secundario (framing) para intercambiar mensajes
      const frames = new FramedStream(conn)
      
      frames.on('data', (msg) => {
        try {
          const parsed = JSON.parse(b4a.toString(msg, 'utf-8'))
          if (parsed.type === 'BEACON_ANNOUNCE' && parsed.key) {
            const publicKey = b4a.from(parsed.key, 'hex')
            this.emit('peer-beacon', { publicKey, conn })
          }
        } catch (e) {
          // ignorar mensajes mal formados
        }
      })

      conn.on('error', () => {}) // ignorar errores de red
      
      // Adjuntar frames a la conexión para usarlo después
      conn.frames = frames
    })
  }

  async iniciar() {
    const discovery = this.swarm.join(TOPIC, { client: true, server: true })
    await discovery.flushed()
    this.emit('listo')
  }

  // Anunciar nuestra propia clave pública a los peers conectados
  anunciar(publicKey) {
    const msg = JSON.stringify({
      type: 'BEACON_ANNOUNCE',
      key: b4a.toString(publicKey, 'hex')
    })
    const buffer = b4a.from(msg, 'utf-8')
    
    // Enviar a todos los peers ya conectados
    for (const conn of this.swarm.connections) {
      if (conn.frames) {
        conn.frames.write(buffer)
      }
    }

    // Y cada vez que alguien nuevo se conecte, le enviamos el anuncio
    this.swarm.on('connection', (conn) => {
       setTimeout(() => {
         if (conn.frames) conn.frames.write(buffer)
       }, 500)
    })
  }

  async detener() {
    await this.swarm.destroy()
  }
}
