import EventEmitter from 'bare-events'

class MockEscaner extends EventEmitter {
  constructor() {
    super()
    this.locales = new Map()
    this.timer = null
    
    // Simula la conexión inicial a la red
    setTimeout(() => {
      this.emit('estado', { modo: 'dht', conectado: true })
      this._simulateDiscovery()
    }, 1000)
  }

  _simulateDiscovery() {
    const mockData = {
      id: "mock-z32-key-1",
      nombre: "Café Rivadavia (Mock)",
      categoria: "cafeteria",
      estado: "abierto",
      mensaje: "2x1 en medialunas hasta las 18",
      horario: "08:00-20:00",
      actualizado: new Date().toISOString()
    }
    
    this.locales.set(mockData.id, mockData)
    this.emit('local-encontrado', mockData)
    
    // Simula descubrir a otro comercio un poco más tarde
    this.timer = setTimeout(() => {
      const mockData2 = {
        id: "mock-z32-key-2",
        nombre: "Kiosco El Paso (Mock)",
        categoria: "kiosco",
        estado: "abierto",
        mensaje: "Carga de SUBE disponible",
        horario: "24hs",
        actualizado: new Date().toISOString()
      }
      this.locales.set(mockData2.id, mockData2)
      this.emit('local-encontrado', mockData2)
    }, 5000)
  }

  listar() {
    return Array.from(this.locales.values())
  }
}

class MockBeacon extends EventEmitter {
  constructor(registroInicial) {
    super()
    this.registro = registroInicial
    this.visitantes = 0
    
    // Simula que la gente pasa y se conecta a nuestro beacon
    this.timer = setInterval(() => {
      this.visitantes++
      this.emit('visitante', { total: this.visitantes })
    }, 10000)
  }
  
  actualizar(registro) {
    this.registro = registro
  }
  
  detener() {
    clearInterval(this.timer)
  }
}

export function escanear() {
  return new MockEscaner()
}

export function transmitir(registro) {
  return new MockBeacon(registro)
}
