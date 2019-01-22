const util = require('./util')
const COLOUR_NAMES = require('color-name')

module.exports = 
function addMixin( _class, options ) {
  const RGBA_OFFSET = options.rgba

  Object.assign( _class.prototype.keys, {
    'r': RGBA_OFFSET + 0,
    'red': RGBA_OFFSET + 0,
    'g': RGBA_OFFSET + 1,
    'green': RGBA_OFFSET + 1,
    'b': RGBA_OFFSET + 2,
    'blue': RGBA_OFFSET + 2,
    'a': RGBA_OFFSET + 3,
    'alpha':RGBA_OFFSET +  3, 
  } )

  


  class RGBA extends _class {

    // getChannelByName( name ) {
    //   let index = this.keys[ name ] 

    //   if ( !index && index != 0 )
    //     return NaN

    //   return parseFloat( this[index] )
    // }

    getChannel8Bit( channel ) {
      var value = this[channel]
      value = parseFloat( value )
      value = value < 0 ? 0 : value > 1 ? 1 : value
      value = Math.round( value * 255 )
      return value
    }

    isRGBNormal() {
      return this[0] >= 0
          && this[0] <= 1
          && this[1] >= 0
          && this[1] <= 1
          && this[2] >= 0
          && this[2] <= 1
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
      value = util.parseCSSValue( value )
      if ( !isNaN( value ) )
        this[0] = value
    }
    set green ( value ) {
      value = util.parseCSSValue( value )
      if ( !isNaN( value ) )
        this[1] = value
    }
    set blue  ( value ) {
      value = util.parseCSSValue( value )
      if ( !isNaN( value ) )
        this[2] = value
    }
    set alpha ( value ) {
      value = util.parseCSSAlpha( value )
      if ( !isNaN( value ) )
        this[3] = value
    }

    get red   () { return this[0] }
    get green () { return this[1] }
    get blue  () { return this[2] }
    get alpha () { return this[3] }


    //
    // Chainable setStuff functions
    //


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

      r = util.parseCSSValue( args[0] )
      g = util.parseCSSValue( args[1] )
      b = util.parseCSSValue( args[2] )
      a = util.parseCSSAlpha( args[3] )

      if ( !isNaN( r ) ) this[0] = r
      if ( !isNaN( g ) ) this[1] = g
      if ( !isNaN( b ) ) this[2] = b
      if ( !isNaN( a ) ) this[3] = a

      return this
    }




    setChannelByName( name, value ) {
      if ( 'string' !== typeof name )
        throw new Error('channel name must be string')

      switch ( name.toLowerCase() ) {
        case 'r': case 'red':
          this.red = value
        break

        case 'g': case 'green':
          this.green = value
        break

        case 'b': case 'blue':
          this.blue = value
        break

        case 'a': case 'alpha':
          this.alpha = value
        break

        case 'h': case 'hue':
          this.hue = value
        break

        case 's': case 'sat': case 'saturation':
          this.saturation = value
        break

        case 'v': case 'value':
          this.value = value
        break
      }

      return this
    }

    setString( str ) {
      if ( 'transparent' == str )
        return this.setAlpha( 0 )

      str = str.toLowerCase()

      if ( str in COLOUR_NAMES )
        return this.set8BitArray( COLOUR_NAMES[str] )

      let match

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




  }

  return RGBA
}