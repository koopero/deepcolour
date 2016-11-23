'use strict'

const Colour = require('./Colour')
    , boxOptions = require('./boxOptions')
    , composite = require('./composite')

const fs = require('fs-extra-promise')
    , PNG = require('pngjs').PNG
    , PNGSync = PNG.sync

class Canvas {
  constructor() {
    this.width = NaN
    this.height = NaN

    var dimI = 0
    for ( var argI = 0; argI < arguments.length; argI ++ ) {
      var arg = arguments[argI]

      if ( 'number' == typeof arg ) {
        switch( dimI++ ) {
          case 0: this.width  = parseInt( arg ); break
          case 1: this.height = parseInt( arg ); break
        }
      } else if ( 'object' == typeof arg && arg !== null ) {
        this.width = parseInt( arg.w ) || parseInt( arg.width ) || this.width
        this.height = parseInt( arg.h ) || parseInt( arg.height ) || this.height
      }
    }

    if ( isNaN( this.width ) )
      this.width = 1

    if ( isNaN( this.height ) )
      this.height = 1

    this.size = this.width * this.height

    const pixels = []

    Object.defineProperty( this, 'pixels', {
      value: pixels
    })

    this.background = new Colour()
    this.background.isBackground = true

    for ( var i = 0; i < this.size; i ++ ) {
      this.pixels[i] = new Colour()
      this.pixels[i].set( this.background )
    }

    Object.freeze( this.pixels )

  }

  clone() {
    const self = this
        , clone = new Canvas( this.width, this.height )

    clone.eachPixel( ( pix, x, y ) => self.pixel( x, y ) )
    return clone
  }

  pixel( x, y ) {
    x = parseInt(x) || 0
    y = parseInt(y) || 0

    if (
      !this.width ||
      !this.height ||
      x >= this.width ||
      x < 0 ||
      y >= this.height ||
      y < 0
    ) {
      return this.background
    }

    const ind = x + y * this.width
    return this.pixels[ind]
  }

  eachPixel( opt, callback ) {
    if ( 'function' == typeof opt ) {
      callback = opt
      opt = {}
    }

    const self = this
        , result = []
        , box = boxOptions( self, opt )

    var index = 0

    for ( var y = box.y; y < box.y + box.h; y++ )
    for ( var x = box.x; x < box.x + box.w; x++ ) {
      var canvasIndex = this.width * y + x
        , pixel = this.pixels[canvasIndex]
        , callbackResult = undefined

      if ( callback )
        callbackResult = callback.call( this, pixel, x, y, index )

      if ( 'undefined' == typeof callbackResult )
        callbackResult = pixel

      if ( callbackResult !== pixel )
        pixel.set( callbackResult )

      result[ index ] = callbackResult
      index ++
    }

    return result
  }

  composite( src, operator, amount, destBox, srcBox ) {
    const dest = this

    if ( !Canvas.isCanvas( src ) )
      throw new Error('src must be Canvas')

    if ( !operator )
      operator = 'over'

    if ( 'string' == typeof operator ) {
      if ( !( operator in composite ) )
        throw new Error('Unknown composite operator')

      operator = composite[operator]
    }

    destBox = boxOptions( dest, destBox )
    srcBox = boxOptions( src, srcBox )

    amount = parseAmount( amount )
    dest.eachPixel( destBox, ( pix, x, y ) => {
      const srcPix = src.pixel( x - destBox.x + srcBox.x, y - destBox.y + srcBox.y )
      operator.call( pix, srcPix, amount )
    })
  }

  toBuffer( box ) {
    box = boxOptions( this, box )
    var channels = parseInt( box.channels )

    if ( isNaN( channels ) )
      channels = 4

    if ( channels < 0 || channels > 4 )
      throw new RangeError('Invalid number of channels' )

    const length = box.w * box.h * channels
    const buffer = Buffer.alloc ? Buffer.alloc( length ) : new Buffer( length )


    this.eachPixel( box, function ( pixel, x, y, ind ) {
      pixel = pixel.toBuffer( channels )
      pixel.copy( buffer, ind * channels )
    } )

    return buffer
  }

  toPNGBuffer( box ) {
    box = boxOptions( this, box )
    const png = new PNG()
    png.width = box.w
    png.height = box.h
    png.data = this.toBuffer( box )
    const result = PNG.sync.write( png )
    return result
  }

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

  _loadPNGData( png ) {
    this.eachPixel( function ( pixel, x, y ) {
      const ind = (png.width * y + x) << 2
      pixel.set8BitArray( png.data.slice( ind, ind+4 ) )
    })
  }

  savePNG( dest, options ) {
    const data = this.toPNGBuffer( options )
    return fs.outputFileAsync( dest, data )
  }

  set( value, box ) {
    this.eachPixel( box, function ( pixel ) {
      pixel.set( value )
    } )

    return this
  }

  setAlpha( value, box ) {
    this.eachPixel( box, function ( pixel ) {
      pixel.setAlpha( value )
    } )

    return this
  }
}

Canvas.isCanvas = function ( object ) {
  return object instanceof Canvas
}


module.exports = Canvas

function parseAmount( amount ) {
  amount = parseFloat( amount )
  if ( isNaN( amount ) )
    return 1

  return amount
}
