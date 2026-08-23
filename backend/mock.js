const EventEmitter = require('bare-events')

class MockScanner extends EventEmitter {
  constructor() {
    super()
    this.peers = new Map()
    this.timer = null
    
    // Simulate initial network connection
    setTimeout(() => {
      this.emit('status', { mode: 'dht', connected: true })
      this._simulateDiscovery()
    }, 1000)
  }

  _simulateDiscovery() {
    const mockData = {
      id: "mock-z32-key-1",
      name: "Café Rivadavia (Mock)",
      category: "cafeteria",
      status: "open",
      message: "Mock testing message",
      hours: "08:00-20:00",
      updated: new Date().toISOString()
    }

    this.timer = setTimeout(() => {
      this.peers.set(mockData.id, mockData)
      this.emit('peer-found', mockData)
    }, 3000)
  }

  list() {
    return Array.from(this.peers.values())
  }
}

class MockBeacon extends EventEmitter {
  constructor(record) {
    super()
    this.record = record
    this.visitors = 0
    this.timer = null

    // Simulate visitors arriving
    this.timer = setInterval(() => {
      this.visitors++
      this.emit('visitor', { total: this.visitors })
    }, 5000)
  }

  actualizar(record) {
    this.record = record
  }

  detener() {
    if (this.timer) clearInterval(this.timer)
  }
}

function scan() {
  return new MockScanner()
}

function beacon(record) {
  return new MockBeacon(record)
}

module.exports = { scan, beacon }
