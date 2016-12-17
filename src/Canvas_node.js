/*
  All the cool shit that won't work in the browser yet.
*/
'use strict'

const Canvas = require('./Canvas')

const fs = require('fs-extra-promise')
    , PNG = require('pngjs').PNG

class Canvas_node extends Canvas {
  loadPNG( src ) {
    const self = this
    var pushedPixels = 0
    return new Promise( ( resolve, reject ) => {
      fs.createReadStream( src )
      .pipe( new PNG({
        filterType: 4
      }))
      .on('error', reject )
      .on('parsed', function () {
        const png = this
        self._loadPNGData( png )
        resolve( pushedPixels )
      })
    })
  }

  savePNG( dest, options ) {
    const data = this.toPNGBuffer( options )
    return fs.outputFileAsync( dest, data )
  }
}


module.exports = Canvas_node
