'use strict'

class Emisor {
  constructor() {
    this._escuchas = new Map()
  }

  on(evento, fn) {
    if (typeof fn !== 'function') return this
    const lista = this._escuchas.get(evento) || []
    lista.push(fn)
    this._escuchas.set(evento, lista)
    return this
  }

  emit(evento, ...args) {
    const lista = this._escuchas.get(evento) || []
    for (const fn of lista) fn(...args)
    return this
  }

  off(evento, fn) {
    const lista = this._escuchas.get(evento)
    if (!lista) return this
    this._escuchas.set(
      evento,
      lista.filter((x) => x !== fn)
    )
    return this
  }
}

module.exports = { Emisor }
