'use strict'

const Colour = require('./Colour')

class Pixel {
  constructor( x, y, w, h ) {
    this.i = x + y * w
    this.x = x
    this.y = y
    this.u = x / ( w - 1 )
    this.v = y / ( h - 1 )
    
    this.c = new Colour()
    Object.defineProperty( this, 'colour', {
      value: this.c
    })
  }
}

Pixel.isPixel = function ( object ) {
  return object instanceof Pixel
}

module.exports = Pixel
