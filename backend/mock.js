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
      id: 'mock-z32-key-1',
      name: 'Café Rivadavia (Mock)',
      category: 'cafeteria',
      status: 'open',
      message: 'Mock testing message',
      hours: '08:00-20:00',
      updated: new Date().toISOString()
    }

    this.timer = setTimeout(() => {
      this.peers.set(mockData.id, mockData)
      this.emit('peer-found', mockData)

      // Simulate the beacon moving out of range so --fake also exercises
      // peer-lost, since the real backend only emits it on disconnect.
      this.lossTimer = setTimeout(() => {
        if (this.peers.delete(mockData.id)) {
          this.emit('peer-lost', mockData.id)
        }
      }, 15000)
    }, 3000)
  }

  list() {
    return Array.from(this.peers.values())
  }

  async stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.lossTimer) {
      clearTimeout(this.lossTimer)
      this.lossTimer = null
    }
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

  async update(record) {
    this.record = record
  }

  async stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

function scan() {
  return new MockScanner()
}

function beacon(record) {
  return new MockBeacon(record)
}

module.exports = { scan, beacon }
