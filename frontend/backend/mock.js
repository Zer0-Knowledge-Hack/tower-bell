import { CATEGORIES, CATEGORY_META, toUiRecord } from './schema.js'

const MOCK_PEERS = [
  {
    id: 'z32cafeterivadavia001',
    name: 'Cafe Rivadavia',
    category: 'cafeteria',
    status: 'open',
    message: '2 for 1 until 6PM',
    hours: '08:00-20:00',
    distance: 40,
    signal: 5
  },
  {
    id: 'z32farmacianorte002',
    name: 'Farmacia Norte',
    category: 'pharmacy',
    status: 'open',
    message: 'Open late, no wait',
    hours: '08:00-23:00',
    distance: 95,
    signal: 4
  },
  {
    id: 'z32kioscoluna003',
    name: 'Kiosco Luna',
    category: 'kiosk',
    status: 'open',
    message: 'Cold drinks and snacks',
    hours: '07:00-22:00',
    distance: 130,
    signal: 3
  },
  {
    id: 'z32parrilladon004',
    name: 'Parrilla Don Tito',
    category: 'restaurant',
    status: 'open',
    message: 'Lunch menu until 3PM',
    hours: '12:00-16:00',
    distance: 180,
    signal: 3
  },
  {
    id: 'z32librosur005',
    name: 'Libro Sur',
    category: 'bookstore',
    status: 'closed',
    message: 'Back tomorrow at 10',
    hours: '10:00-19:00',
    distance: 240,
    signal: 2
  }
]

class Emitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
    return () => {
      this.listeners[event] = (this.listeners[event] || []).filter((fn) => fn !== callback)
    }
  }

  emit(event, payload) {
    ;(this.listeners[event] || []).forEach((fn) => fn(payload))
  }
}

class MockScanner extends Emitter {
  constructor() {
    super()
    this.peers = new Map()
    this.timers = []
    this.connected = false
    this.start()
  }

  start() {
    this.stopTimers()
    this.peers.clear()
    this.connected = false
    this.emit('status', { mode: 'dht', connected: false })

    this.timers.push(
      setTimeout(() => {
        this.connected = true
        this.emit('status', { mode: 'dht', connected: true })
      }, 400)
    )

    MOCK_PEERS.forEach((peer, index) => {
      this.timers.push(
        setTimeout(
          () => {
            const record = {
              ...peer,
              updated: new Date().toISOString()
            }
            this.peers.set(record.id, record)
            this.emit('peer-found', record)
          },
          700 + index * 650
        )
      )
    })

    // Send the last-discovered beacon out of range so the UI also gets to
    // handle peer-lost in the demo, not just peer-found.
    const lastPeer = MOCK_PEERS[MOCK_PEERS.length - 1]
    this.timers.push(
      setTimeout(
        () => {
          if (this.peers.delete(lastPeer.id)) {
            this.emit('peer-lost', lastPeer.id)
          }
        },
        700 + MOCK_PEERS.length * 650 + 6000
      )
    )
  }

  stopTimers() {
    this.timers.forEach(clearTimeout)
    this.timers = []
  }

  list() {
    return Array.from(this.peers.values())
  }

  async stop() {
    this.stopTimers()
  }
}

class MockBeacon extends Emitter {
  constructor(record) {
    super()
    this.record = { ...record, updated: new Date().toISOString() }
    this.visitors = 0
    this.timer = setInterval(() => {
      this.visitors += 1
      this.emit('visitor', { total: this.visitors })
    }, 5000)
  }

  async update(record) {
    this.record = { ...this.record, ...record, updated: new Date().toISOString() }
  }

  async stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export function scan() {
  return new MockScanner()
}

export function beacon(record) {
  return new MockBeacon(record)
}

export { CATEGORIES, CATEGORY_META, toUiRecord }
