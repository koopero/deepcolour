const NUM_CHANNELS = 4

const COLOUR_NAMES = require('color-name')

class Colour {
  constructor() {
    this.eachChannel( () => 0 )

    //
    // Load from arguments
    //
    var argChannel = 0
    for ( var argI = 0; argI < arguments.length; argI++ ) {
      var arg = arguments[argI]
      if ( 'number' == typeof arg ) {
        this.setChannel( argChannel++, arg )
      } else if ( 'string' == typeof arg ) {
        this.setString( arg )
      }
    }
  }

  clone() {
    const clone = new Colour()

    this.eachChannel( function ( v, c ) {
      clone[c] = v
    } )

    return clone
  }

  eachChannel( callback ) {
    for ( var c = 0; c < NUM_CHANNELS; c++ ) {
      var result = callback.call( this, this[c], c )
      result = parseFloat( result )
      if ( !isNaN( result ) )
        this[c] = result
    }
  }

  set( value ) {
    const self = this

    if ( Colour.isColour( value ) || Array.isArray( value ) ) {
      this.eachChannel( ( v, c ) => value[c] )
    } else if ( 'object' == typeof value ) {
      valueToChannel( 'hue',   'h' )
      valueToChannel( 'saturation', 's' )
      valueToChannel( 'value',  'v' )
      
      valueToChannel( 'red',   'r', 0 )
      valueToChannel( 'green', 'g', 1 )
      valueToChannel( 'blue',  'b', 2 )
      valueToChannel( 'alpha', 'a', 3 )
    } else if ( 'string' == typeof value ) {
      this.setString( value )
    }

    return this

    function valueToChannel( key, alias, index ) {
      if ( key in value )
        self[key] = value[key]
      else if ( alias in value )
        self[key] = value[alias]
      else if ( ( 'undefined' != typeof index ) && ( index in value ) )
        self[key] = value[index]
    }
  }

  toHexString() {
    var result = '#'
    for ( var c = 0; c < 3; c ++ )
      result += valueToHex( this[c] )

    return result
  }

  toBuffer( length ) {
    length = parseInt( length )
    if ( isNaN( length ) )
      length = 4

    if ( length < 0 || length > 4 )
      throw new Exception( 'Invalid length' )

    const buffer = Buffer.alloc( length )
    for ( var c = 0; c < length; c++ )
      buffer[c] = this.channel8Bit( c )

    return buffer
  }



  channel8Bit( channel ) {
    var value = this[channel]
    value = parseFloat( value )
    if ( isNaN( value ) )
      return value

    value = value < 0 ? 0 : value > 1 ? 1 : value
    value = Math.round( value * 255 )
    return value
  }

  //
  // RGB getters and setters
  //
  set red   ( value ) { this[0] = parseFloat( value ) || 0 }
  set green ( value ) { this[1] = parseFloat( value ) || 0 }
  set blue  ( value ) { this[2] = parseFloat( value ) || 0 }
  set alpha ( value ) { this[3] = parseFloat( value ) || 0 }

  get red   () { return this[0] }
  get green () { return this[1] }
  get blue  () { return this[2] }
  get alpha () { return this[3] }

  //
  // HSV getters and setters
  //
  set hue ( value ) {
    this.setHSV( value, this.saturation, this.value  )
  }

  set saturation ( value ) {
    this.setHSV( this.hue, value, this.value  )
  }

  set value ( value ) {
    this.setHSV( this.hue, this.saturation, value  )
  }

  get value () {
    return Math.max( this[0], this[1], this[2] )
  }

  get saturation () {
    const max = Math.max( this[0], this[1], this[2] )
        , min = Math.min( this[0], this[1], this[2] )
        , delta = max - min

    return delta > 0 ? delta / max : 0
  }

  get hue() {
    const max = Math.max( this[0], this[1], this[2] )
        , min = Math.min( this[0], this[1], this[2] )
        , delta = max - min

    if ( delta <= 0 )
      return this._hue || 0

    const red = this[0]
        , green = this[1]
        , blue = this[2]

    var hue
    if ( red == max )
      hue = ( green - blue ) / delta
    else if ( green == max )
      hue = 2 + ( blue - red ) / delta
    else
      hue = 4 + ( red - green ) / delta

    if ( hue < 0 )
      hue += 6

    hue /= 6
    this._hue = hue

    return hue
  }

  setAlpha( alpha ) {
    alpha = parseFloat( alpha )
    if ( !isNaN( alpha ) ) this[3] = alpha
    return this
  }

  setRGB( r, g, b ) {
    r = parseFloat( r )
    g = parseFloat( g )
    b = parseFloat( b )

    if ( !isNaN( r ) ) this[0] = r
    if ( !isNaN( g ) ) this[1] = g
    if ( !isNaN( b ) ) this[2] = b

    return this
  }

  setHSV( hue, sat, val ) {
    hue = parseFloat( hue )
    sat = parseFloat( sat )
    val = parseFloat( val )

    if ( isNaN( hue ) ) hue = this.hue
    if ( isNaN( sat ) ) sat = this.saturation
    if ( isNaN( val ) ) val = this.value

    hue = hue % 1
    hue = hue < 0 ? hue + 1 : hue
    this._hue = hue


    if ( sat == 0 ) {
      this.setRGB( val, val, val )
      return this
    }

    const hex = Math.floor( hue * 6 )
        , inHex = hue * 6 - hex
        , eP = val * (1 - sat)
        , eQ = val * (1 - (sat * inHex))
        , eT = val * (1 - (sat * (1 - inHex)))

    switch ( hex ) {
      case 0: this.setRGB( val, eT, eP ); break
      case 1: this.setRGB( eQ, val, eP ); break
      case 2: this.setRGB( eP, val, eT ); break
      case 3: this.setRGB( eP, eQ, val ); break
      case 4: this.setRGB( eT, eP, val ); break
      case 5: this.setRGB( val, eP, eQ ); break
    }

    return this
  }

  set8BitArray( input ) {
    if ( Array.isArray( input ) || Buffer.isBuffer( input ) ) {
      this.eachChannel( ( value, c ) => input[c] / 255 )
      return this
    }

    return this
  }

  setChannel( channel, value ) {
    channel = parseInt( channel ) || 0
    if ( channel < 0 || channel > 3 )
      throw new Error('Invalid channel')

    value = parseFloat( value )
    if ( !isNaN( value ) )
      this[channel] = value

    return this
  }

  setChannelHex( channel, value ) {
    if ( 'string' != typeof value || !value.length || value.length > 2 )
      throw new Error('Invalid input' )

    if ( value.length < 2 )
      value = value + value

    value = parseInt( value, 16 )
    value /= 255

    return this.setChannel( channel, value )
  }

  setString( str ) {
    const self = this
    str = str.toLowerCase()

    if ( str in COLOUR_NAMES )
      return this.set8BitArray( COLOUR_NAMES[str] )

    var match

    if ( match = /#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/.exec( str ) ) {
      this.setChannelHex( 0, match[1] )
      this.setChannelHex( 1, match[2] )
      this.setChannelHex( 2, match[3] )
    } else if ( match = /#([0-9a-f])([0-9a-f])([0-9a-f])/.exec( str ) ) {
      this.setChannelHex( 0, match[1] )
      this.setChannelHex( 1, match[2] )
      this.setChannelHex( 2, match[3] )
    }
  }

  toString() {
    return this.toHexString()
  }

  inspect() {
    return this.toString()
  }

  //
  // Composite operators
  //
  mix( b, amount ) {
    amount = parseAmount( amount )
    b = parseColour( b )
    this.eachChannel( ( value, channel ) =>
      value * ( 1 - amount ) + b[channel] * amount
    )
  }

}

Colour.isColour = function ( object ) {
  return object instanceof Colour
}

module.exports = Colour

//
// Utility functions
//

function valueToHex( v ) {
  v = v < 0 ? 0 : v > 1 ? 1 : v
  v = Math.round( v * 255 )
  v = v.toString( 16 )
  if ( v.length < 2 )
    v = '0'+v

  return v
}

function parseColour( colour ) {
  if ( !(colour instanceof Colour ) )
    throw new Error(`Ain't a Colour`)

  return colour
}

function parseAmount( amount ) {
  amount = parseFloat( amount )
  if ( isNaN( amount ) )
    return 1

  return amount
}
