'use strict'

const makeClass = require('./src/space')
const Colour = 
  makeClass( {
    channels: 'rgba',
    rgb: true,
    hsv: true,
    css: true,
  } )

Colour.Space = makeClass

module.exports = Colour