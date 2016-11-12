const Colour = require('./Colour')
    , boxOptions = require('./boxOptions')

const fs = require('fs-extra-promise')
    , PNG = require('pngjs').PNG
    , PNGSync = PNG.sync

class Canvas {
  constructor( width, height ) {
    this.width = width
    this.height = height
    this.size = width * height
    this.pixels = []
    this.background = new Colour()
    this.background.isBackground = true
    this.background.x = NaN
    this.background.y = NaN

    var size = width * height
    for ( var i = 0; i < size; i ++ ) {
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

    if ( x >= this.width || x < 0 || y >= this.height || y < 0 )
      return this.background

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

    for ( var y = box.x; y < box.y + box.h; y++ )
    for ( var x = box.y; x < box.x + box.w; x++ ) {
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

  toBuffer( box ) {
    box = boxOptions( this, box )

    var channels = parseInt( box.channels )

    if ( isNaN( channels ) )
      channels = 4

    if ( channels < 0 || channels > 4 )
      throw new RangeError('Invalid number of channels' )

    const buffer = Buffer.alloc( box.w * box.h * channels )


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
  }
}

module.exports = Canvas
