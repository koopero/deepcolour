'use strict'

const NUM_CHANNELS = 4

const COLOUR_NAMES = require('color-name')

class Colour {
  constructor() {
    this.setDefault()
    this.setArguments( arguments )
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



  toHexString() {
    var result = '#'
    for ( var c = 0; c < 3; c ++ )
      result += valueToHex( this[c] )

    return result
  }

  toRGBA() {
    return [
      this[0],
      this[1],
      this[2],
      this[3]
    ]
  }

  toBuffer( length ) {
    length = parseInt( length )
    if ( isNaN( length ) )
      length = 4

    if ( length < 0 || length > 4 )
      throw new Exception( 'Invalid length' )

    const buffer = Buffer.alloc ? Buffer.alloc( length ) : new Buffer( length )
    for ( var c = 0; c < length; c++ )
      buffer.writeUInt8( this.channel8Bit( c ), c )

    return buffer
  }

  to8BitArray( length ) {
    length = parseInt( length )
    if ( isNaN( length ) )
      length = 4

    if ( length < 0 || length > 4 )
      throw new Exception( 'Invalid length' )

    const array = new Array( length )
    for ( var c = 0; c < length; c++ )
      array[c] = this.channel8Bit( c )

    return array
  }

  channel8Bit( channel ) {
    var value = this[channel]
    value = parseFloat( value )
    value = value < 0 ? 0 : value > 1 ? 1 : value
    value = Math.round( value * 255 )
    return value
  }

  isNormal() {
    return this[0] >= 0
        && this[0] <= 1
        && this[1] >= 0
        && this[1] <= 1
        && this[2] >= 0
        && this[2] <= 1
        && this[3] >= 0
        && this[3] <= 1
  }

  isGray() {
    return this[0] == this[1]
        && this[1] == this[2]
  }

  isBlack() {
    return this[0] == 0
        && this[1] == 0
        && this[2] == 0
  }

  //
  // RGB getters and setters
  //
  set red   ( value ) {
    value = parseCSSValue( value )
    if ( !isNaN( value ) )
      this[0] = value
  }
  set green ( value ) {
    value = parseCSSValue( value )
    if ( !isNaN( value ) )
      this[1] = value
  }
  set blue  ( value ) {
    value = parseCSSValue( value )
    if ( !isNaN( value ) )
      this[2] = value
  }
  set alpha ( value ) {
    value = parseCSSAlpha( value )
    if ( !isNaN( value ) )
      this[3] = value
  }

  get red   () { return this[0] }
  get green () { return this[1] }
  get blue  () { return this[2] }
  get alpha () { return this[3] }

  //
  // HSV getters and setters
  //
  set hue ( value ) {
    value = parseCSSHue( value )
    this.setHSV( value, this.saturation, this.value  )
  }

  set saturation ( value ) {
    value = parseCSSValue( value )
    this.setHSV( this.hue, value, this.value  )
  }

  set value ( value ) {
    value = parseCSSValue( value )
    this.setHSV( this.hue, this.saturation, value  )
  }

  get value () {
    return Math.max( this[0], this[1], this[2] )
  }

  get saturation () {
    const max = Math.max( this[0], this[1], this[2] )
        , min = Math.min( this[0], this[1], this[2] )
        , delta = max - min

    if ( delta <= 0 )
      return this._saturation || 0

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

    // Hack to allow hue >= 1 to be returned when
    // set specifically by setHSV
    if ( this._hue && ( this._hue % 1 ) == hue )
      hue = this._hue

    this._hue = hue

    return hue
  }

  //
  // String getters / setters
  //

  get css() {
    // Return a regular hex string if the colour
    // is in a normal range.
    if ( this.isNormal() && this.alpha == 1 )
      return this.toHexString()

    let numbers = this.to8BitArray(3)
      , tag = 'rgb'

    if ( this.alpha != 1 ) {
      numbers.push( valueToAlpha( this.alpha ) )
      tag += 'a'
    }

    let inner = numbers.join( ',' )

    return `${tag}(${inner})`
  }

  set css( val ) {
    this.setString( val )
  }

  get hex() {
    return this.toHexString()
  }

  set hex( val ) {
    this.setString( val )
  }


  //
  // Chainable setStuff functions
  //

  set( ob ) {

    if ( ob === null || ob == undefined )
      return this

    if ( Colour.isColour( ob ) || Array.isArray( ob ) ) {
      this.eachChannel( ( v, c ) => ob[c] )

      return this
    }

    if ( 'string' == typeof of )
      return this.setString( ob )

    if ( global.Buffer && Buffer.isBuffer( ob ) )
      return this.set8BitArray( ob )

    if ( ob !== null ) {
      return this.setKeys( ob )
    }

    return this
  }


  setDefault() {
    this[0] = 0
    this[1] = 0
    this[2] = 0
    this[3] = 1

    return this
  }

  setArguments( args ) {
    var argChannel = 0
    for ( var argI = 0; argI < args.length; argI++ ) {
      var arg = args[argI]
      if ( 'number' == typeof arg ) {
        this.setChannel( argChannel++, arg )
      } else if ( 'string' == typeof arg ) {
        this.setString( arg )
        argChannel = 3
      } else if ( 'undefined' !== typeof arg ) {
        this.set( arg )
      }
    }
  }



  setKeys( ob ) {
    const self = this
        , props = [
            ['red','r'],
            ['green','g'],
            ['blue','b'],
            ['alpha','a'],
            ['hue','h'],
            ['saturation','sat','s'],
            ['value','v'],
            ['hex'],
            ['css']
          ]

    props.forEach( function( keys ) {
      var prop
      keys.forEach( function ( key ) {
        prop = prop || key
        if ( key in ob )
          self[prop] = ob[key]
      } )
    } )

    return this
  }

  setAlpha( alpha ) {
    alpha = parseFloat( alpha )
    if ( !isNaN( alpha ) ) this[3] = alpha
    return this
  }

  setRandom() {
    const R = Math.random
    return this.setRGB( R(), R(), R() )
  }

  setRGB( r, g, b, a ) {
    const args = arguments.length == 1 && arguments[0].length ? arguments[0] : arguments

    r = parseCSSValue( args[0] )
    g = parseCSSValue( args[1] )
    b = parseCSSValue( args[2] )
    a = parseCSSAlpha( args[3] )

    if ( !isNaN( r ) ) this[0] = r
    if ( !isNaN( g ) ) this[1] = g
    if ( !isNaN( b ) ) this[2] = b
    if ( !isNaN( a ) ) this[3] = a

    return this
  }

  setHSV( hue, sat, val ) {
    hue = parseFloat( hue )
    sat = parseFloat( sat )
    val = parseFloat( val )

    if ( isNaN( hue ) ) hue = this.hue
    if ( isNaN( sat ) ) sat = this.saturation
    if ( isNaN( val ) ) val = this.value

    this._hue = hue
    hue = hue % 1
    hue = hue < 0 ? hue + 1 : hue
    this._saturation = sat


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
    if ( !input || 'number' != typeof input.length )
      throw new Error('Expected input to be array-like.')

    this.eachChannel( ( value, c ) => input[c] / 255 )
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
    if ( 'transparent' == str )
      return this.setAlpha( 0 )

    const self = this
    str = str.toLowerCase()

    if ( str in COLOUR_NAMES )
      return this.set8BitArray( COLOUR_NAMES[str] )

    var match

    if ( match = /hsla?\(\s*(-?[\d\.]+%?)\s*,\s*(-?[\d\.]+%)\s*,\s*(-?[\d\.]+%)\s*(,\s*(-?[\d\.]+%?))?\s*\)/.exec( str ) ) {
      this.setHSL( match[1], match[2], match[3], match[5] )
    } else if ( match = /rgba?\(\s*(-?[\d\.]+%?)\s*,\s*(-?[\d\.]+%?)\s*,\s*(-?[\d\.]+%?)\s*(,\s*(-?[\d\.]+%?))?\s*\)/.exec( str ) ) {
        this.setRGB(
          match[1],
          match[2],
          match[3],
          match[5]
        )
    } else if ( match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/.exec( str ) ) {
      this.setChannelHex( 0, match[1] )
      this.setChannelHex( 1, match[2] )
      this.setChannelHex( 2, match[3] )
    } else if ( match = /^#?([0-9a-f])([0-9a-f])([0-9a-f])/.exec( str ) ) {
      this.setChannelHex( 0, match[1] )
      this.setChannelHex( 1, match[2] )
      this.setChannelHex( 2, match[3] )
    }

    return this
  }

  setHSL() {
    var args = arguments.length == 1 && arguments[0].length ? arguments[0] : arguments
    const h = parseCSSHue( args[0] )
        , s = parseCSSValue( args[1] )
        , l = parseCSSValue( args[2] )
        , alpha = parseCSSAlpha( args[3] )


    // Shamelessly ganked from http://stackoverflow.com/a/9493060
    var r, g, b;
    if(s == 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return this.setRGB( r, g, b, alpha )
  }

  toString() {
    return this.css
  }

  valueOf() {
    return this.css
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

Colour.equal = function() {
  const colour = new Colour()
  var str
  for ( var i = 0; i < arguments.length; i ++ ) {
    colour.set( arguments[i] )
    if ( !str )
      str = colour.toString()
    else if ( str != colour.toString() )
      return false
  }

  return true
}

module.exports = Colour

//
// Utility functions
//

function parseCSSHue( v ) {
  if ( 'number' == typeof v ) return v
  if ( !v )  return NaN

  return parseFloat( v ) / 360
}

function parseCSSValue( v ) {
  if ( 'number' == typeof v ) return v
  if ( !v )  return NaN

  var div = 255
  if ( v.substr( v.length - 1 ) == '%' )
    div = 100

  return parseFloat( v ) / div
}

function parseCSSAlpha( v ) {
  if ( 'number' == typeof v ) return v
  if ( !v )  return NaN

  var div = 1
  if ( v.substr( v.length - 1 ) == '%' )
    div = 100

  return parseFloat( v ) / div
}

function valueToHex( v ) {
  v = v < 0 ? 0 : v > 1 ? 1 : v
  v = Math.round( v * 255 )
  v = v.toString( 16 )
  if ( v.length < 2 )
    v = '0'+v

  return v
}

function valueToPercent( v ) {
  v *= 100
  v = v.toFixed( 1 )
  v += '%'

  return v
}

function valueToAlpha( v ) {
  return v.toFixed( 2 )
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
