'use strict'

const towerbell = require('../backend/mock')

function iniciar() {
  const red = towerbell.escanear()
  red.on('local-encontrado', () => {})
  red.on('local-perdido', () => {})
  red.on('estado', () => {})
  red.listar()
  return red
}

module.exports = { iniciar }
