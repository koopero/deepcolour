'use strict'

const Colour = require('./Colour')
    , Pixel = require('./Pixel')
    , boxOptions = require('./boxOptions')
    , composite = require('./composite')

const PNG = require('pngjs').PNG
    , PNGSync = PNG.sync

class Canvas {
  constructor() {
    this.width = NaN
    this.height = NaN

    this.backgroundPixel = new Pixel( NaN, NaN, NaN, NaN )
    this.backgroundPixel.isBackground = true
    this.background = this.backgroundPixel.colour

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
        this.background.set( arg.background )
        this.background.set( arg.bg )
      }
    }

    this.allocate( this.width, this.height )
  }

  allocate( w, h ) {
    w = parseInt( w )
    h = parseInt( h )
    w = isNaN( w ) ? 1 : w
    h = isNaN( h ) ? 1 : h

    if ( w < 1 || h < 1 )
      throw new Error( 'Invalid dimensions' )

    const pixels = []

    for ( var y = 0; y < h; y ++ )
    for ( var x = 0; x < w; x ++ ) {
      var pixel = new Pixel( x, y, w, h )

      pixel.c.set( this.background )
      pixels[pixel.i] = pixel
    }

    Object.freeze( pixels )
    Object.defineProperty( this, 'pixels', {
      value: pixels,
      writable: true
    })

    this.width = w
    this.height = h
    this.size = this.width * this.height
  }

  clone() {
    const self = this
        , clone = new Canvas( this.width, this.height )

    clone.eachPixel( ( pix, x, y ) => self.pixel( x, y ).colour )
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
      return this.backgroundPixel
    }

    const ind = x + y * this.width
    return this.pixels[ind]
  }

  colour( x, y ) {
    return this.pixel( x, y ).colour
  }

  eachPixel( opt, callback ) {
    if ( 'function' == typeof opt ) {
      callback = opt
      opt = {}
    }

    return this.box( opt )
    .map( function ( pixel, index ) {
      var result = undefined

      if ( callback )
        result = callback.call( this, pixel, index )

      if ( 'undefined' == typeof result )
        result = pixel

      if ( result !== pixel )
        pixel.colour.set( result )

      return result
    })
  }

  eachColour( opt, callback ) {
    if ( 'function' == typeof opt ) {
      callback = opt
      opt = {}
    }

    return this.box( opt )
    .map( function ( pixel, index ) {
      var result = undefined

      if ( callback )
        result = callback.call( this, pixel.c, index )

      if ( 'undefined' == typeof result )
        result = pixel.c

      if ( result !== pixel.c )
        pixel.colour.set( result )

      return result
    })
  }

  box( box ) {
    box = boxOptions( this, box )
    const result = []

    var index = 0
    for ( var y = box[2]; y < box[2] + box[4]; y++ )
    for ( var x = box[1]; x < box[1] + box[3]; x++ ) {
      var rx = box[6] == 1 &&  ( y & 1 ) ? box[3] - 1 - x
             : box[6] == 2 && !( y & 1 ) ? box[3] - 1 - x
             : x
        , i = this.width * y + rx
        , pixel = this.pixels[i]

      result[ index ] = pixel
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

    dest.eachPixel( destBox, ( pix ) => {
      const srcColour = src.colour( pix.x - destBox[1] + srcBox[1], pix.y - destBox[2] + srcBox[2] )
      operator.call( pix.colour, srcColour, amount )
    })
  }

  toBuffer( box ) {
    box = boxOptions( this, box )
    var channels = box[7]

    if ( isNaN( channels ) )
      channels = 4

    if ( channels < 0 || channels > 4 )
      throw new RangeError('Invalid number of channels' )

    const length = box[3] * box[4] * channels
    const buffer = Buffer.alloc ? Buffer.alloc( length ) : new Buffer( length )

    this.eachPixel( box, function ( pixel, ind ) {
      const colour = pixel.colour.toBuffer( channels )
      colour.copy( buffer, ind * channels )
    } )

    return buffer
  }

  toPNGBuffer( box ) {
    box = boxOptions( this, box )
    const png = new PNG()
    png.width = box[3]
    png.height = box[4]
    png.data = this.toBuffer( box )
    const result = PNG.sync.write( png )
    return result
  }

  _loadPNGData( png ) {
    this.eachPixel( function ( pixel ) {
      const ind = (png.width * pixel.y + pixel.x ) << 2
      pixel.colour.set8BitArray( png.data.slice( ind, ind + 4 ) )
    })
  }

  set( value, box ) {
    this.eachColour( box, function ( colour ) {
      colour.set( value )
    } )

    return this
  }

  setAlpha( value, box ) {
    this.eachColour( box, function ( colour ) {
      colour.setAlpha( value )
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
