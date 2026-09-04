const EventEmitter = require('bare-events')

// Delays for the fake discovery timeline. They are paced for a human watching
// `--fake` in a terminal, which is far too slow for a test suite, so callers
// can shrink them. Nothing else about the mock changes.
const DEFAULT_TIMINGS = {
  connect: 1000,
  found: 3000,
  lost: 15000,
  visitor: 5000
}

class MockScanner extends EventEmitter {
  constructor(options = {}) {
    super()
    this.peers = new Map()
    this.timer = null
    this.timings = { ...DEFAULT_TIMINGS, ...(options.timings || {}) }

    // Simulate initial network connection
    this.connectTimer = setTimeout(() => {
      this.emit('status', { mode: 'dht', connected: true })
      this._simulateDiscovery()
    }, this.timings.connect)
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
      }, this.timings.lost)
    }, this.timings.found)
  }

  list() {
    return Array.from(this.peers.values())
  }

  async stop() {
    if (this.connectTimer) {
      clearTimeout(this.connectTimer)
      this.connectTimer = null
    }
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
  constructor(record, options = {}) {
    super()
    this.record = record
    this.visitors = 0
    this.timer = null
    this.timings = { ...DEFAULT_TIMINGS, ...(options.timings || {}) }

    // Simulate visitors arriving
    this.timer = setInterval(() => {
      this.visitors++
      this.emit('visitor', { total: this.visitors })
    }, this.timings.visitor)
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

function scan(options) {
  return new MockScanner(options)
}

function beacon(record, options) {
  return new MockBeacon(record, options)
}

module.exports = { scan, beacon, DEFAULT_TIMINGS }
