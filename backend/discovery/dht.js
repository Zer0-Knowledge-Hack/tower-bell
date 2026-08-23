const Hyperswarm = require('hyperswarm')
const b4a = require('b4a')
const FramedStream = require('framed-stream')
const EventEmitter = require('bare-events')

// Global 32-byte topic for all Towerbell nodes to discover each other
const TOPIC = b4a.alloc(32).fill('towerbell-discovery-v1')

class DiscoveryDHT extends EventEmitter {
  constructor(store) {
    super()
    this.store = store
    this.swarm = new Hyperswarm()

    this.swarm.on('connection', (conn, info) => {
      this.store.replicate(conn)

      const frames = new FramedStream(conn)

      frames.on('data', (msg) => {
        try {
          const parsed = JSON.parse(b4a.toString(msg, 'utf-8'))
          if (parsed.type === 'BEACON_ANNOUNCE' && parsed.key) {
            const publicKey = b4a.from(parsed.key, 'hex')
            this.emit('peer-beacon', { publicKey, conn })
          }
        } catch (e) {
          // ignore malformed messages
        }
      })

      conn.on('error', () => {})
      conn.frames = frames
    })
  }

  async start() {
    const discovery = this.swarm.join(TOPIC, { client: true, server: true })
    await discovery.flushed()
    this.emit('ready')
  }

  announce(publicKey) {
    const msg = JSON.stringify({
      type: 'BEACON_ANNOUNCE',
      key: b4a.toString(publicKey, 'hex')
    })
    const buffer = b4a.from(msg, 'utf-8')

    for (const conn of this.swarm.connections) {
      if (conn.frames) conn.frames.write(buffer)
    }

    this.swarm.on('connection', (conn) => {
      setTimeout(() => {
        if (conn.frames) conn.frames.write(buffer)
      }, 500)
    })
  }

  async stop() {
    await this.swarm.destroy()
  }
}

module.exports = { DiscoveryDHT }
