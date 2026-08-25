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
    this._announcePayload = null

    this.swarm.on('connection', (conn) => {
      const frames = new FramedStream(conn)
      conn.frames = frames
      let remoteKey = null

      frames.on('data', (msg) => {
        try {
          const parsed = JSON.parse(b4a.toString(msg, 'utf-8'))
          if (parsed.type === 'BEACON_ANNOUNCE' && parsed.key) {
            remoteKey = parsed.key
            const publicKey = b4a.from(parsed.key, 'hex')
            this.emit('peer-beacon', {
              publicKey,
              conn,
              record: parsed.record || null
            })
          }
        } catch (e) {
          // ignore malformed messages
        }
      })

      conn.on('error', () => {})

      // A closed connection is the only reliable "peer left" signal we get
      // from a direct Hyperswarm link. If we never learned the peer's
      // announced key, there is nothing to report as lost.
      conn.on('close', () => {
        if (remoteKey) this.emit('peer-left', b4a.from(remoteKey, 'hex'))
      })

      if (this._announcePayload) frames.write(this._announcePayload)
    })
  }

  async start() {
    const discovery = this.swarm.join(TOPIC, { client: true, server: true })
    await discovery.flushed()
    this.emit('ready')
  }

  announce(publicKey, record) {
    const msg = JSON.stringify({
      type: 'BEACON_ANNOUNCE',
      key: b4a.toString(publicKey, 'hex'),
      record: record || null
    })
    this._announcePayload = b4a.from(msg, 'utf-8')

    for (const conn of this.swarm.connections) {
      if (conn.frames) conn.frames.write(this._announcePayload)
    }
  }

  async stop() {
    await this.swarm.destroy()
  }
}

module.exports = { DiscoveryDHT }
