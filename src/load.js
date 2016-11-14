'use strict'

const Canvas = require('./Canvas')

const fs = require('fs')
    , PNG = require('pngjs').PNG

function load( src ) {
  return new Promise( ( resolve, reject ) => {
    fs.createReadStream( src )
    .pipe( new PNG({
      filterType: 4
    }))
    .on('error', reject )
    .on('parsed', function () {
      const png = this
          , canvas = new Canvas( png.width, png.height )

      canvas._loadPNGData( png )
      resolve( canvas )
    })
  })
}

module.exports = load
