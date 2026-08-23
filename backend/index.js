'use strict'

const { Emisor } = require('./eventos')

function escanear() {
  const red = new Emisor()
  red.listar = () => []
  return red
}

function transmitir(registro) {
  const beacon = new Emisor()
  let actual = registro

  beacon.actualizar = (siguiente) => {
    actual = siguiente
  }

  beacon.detener = () => {}

  return beacon
}

module.exports = { escanear, transmitir }
