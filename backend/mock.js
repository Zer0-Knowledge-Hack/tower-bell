'use strict'

const { setInterval, clearInterval } = require('bare-timers')
const { Emisor } = require('./eventos')

const MUESTRA = [
  {
    id: 'cafe111111111111111111111111111111111',
    nombre: 'Café Rivadavia',
    categoria: 'cafeteria',
    estado: 'abierto',
    mensaje: '2x1 en medialunas hasta las 18',
    horario: '08:00-20:00',
    actualizado: '2026-08-23T03:00:00Z'
  },
  {
    id: 'feria222222222222222222222222222222222',
    nombre: 'Feria del Bajo',
    categoria: 'feria',
    estado: 'abierto',
    mensaje: 'Verdura de estación',
    horario: '07:00-14:00',
    actualizado: '2026-08-23T03:00:00Z'
  },
  {
    id: 'pan33333333333333333333333333333333333',
    nombre: 'Panadería Sur',
    categoria: 'panaderia',
    estado: 'abierto',
    mensaje: 'Facturas recién salidas',
    horario: '06:00-21:00',
    actualizado: '2026-08-23T03:00:00Z'
  }
]

function clonar(registro) {
  return {
    id: registro.id,
    nombre: registro.nombre,
    categoria: registro.categoria,
    estado: registro.estado,
    mensaje: registro.mensaje,
    horario: registro.horario,
    actualizado: registro.actualizado
  }
}

function escanear() {
  const red = new Emisor()
  const presentes = new Map()
  let paso = 0
  let timer = null

  function publicar(registro) {
    presentes.set(registro.id, clonar(registro))
    red.emit('local-encontrado', clonar(registro))
  }

  function retirar(id) {
    if (!presentes.has(id)) return
    presentes.delete(id)
    red.emit('local-perdido', id)
  }

  red.listar = () => Array.from(presentes.values()).map(clonar)

  publicar(MUESTRA[0])
  red.emit('estado', { modo: 'mdns', conectado: true })

  timer = setInterval(() => {
    paso += 1
    const registro = MUESTRA[paso % MUESTRA.length]
    if (presentes.has(registro.id)) retirar(registro.id)
    else publicar(registro)
  }, 2000)

  red.detener = () => {
    if (timer === null) return
    clearInterval(timer)
    timer = null
  }

  return red
}

function transmitir(registro) {
  const beacon = new Emisor()
  let actual = clonar(registro)
  let total = 0

  const timer = setInterval(() => {
    total += 1
    beacon.emit('visitante', { total })
  }, 3000)

  beacon.actualizar = (siguiente) => {
    actual = clonar(siguiente)
  }

  beacon.detener = () => {
    clearInterval(timer)
  }

  return beacon
}

module.exports = { escanear, transmitir }
