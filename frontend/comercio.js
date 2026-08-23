'use strict'

const towerbell = require('../backend/mock')

const REGISTRO_VACIO = {
  id: 'local000000000000000000000000000000000',
  nombre: 'Local de prueba',
  categoria: 'otro',
  estado: 'abierto',
  mensaje: '',
  horario: '00:00-23:59',
  actualizado: '2026-08-23T03:00:00Z'
}

function iniciar(registro) {
  const beacon = towerbell.transmitir(registro || REGISTRO_VACIO)
  beacon.on('visitante', () => {})
  return beacon
}

module.exports = { iniciar }
