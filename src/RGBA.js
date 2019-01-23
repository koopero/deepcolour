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
      /* istanbul ignore next */
      value = value < 0 ? 0 : value > 1 ? 1 : value
      value = Math.round( value * 255 )
      return value
    }

    isRGBNormal() {
      let { red, green, blue } = this

      return red >= 0
          && red <= 1
          && green >= 0
          && green <= 1
          && blue >= 0
          && blue <= 1
    }

    isGray() {
      let { red, green, blue } = this
      return red == green
          && green == blue
    }

    isGrey() {
      return this.isGray()
    }

    isBlack() {
      let { red, green, blue } = this
      return red == 0
          && green == 0
          && blue == 0
    }

    //
    // Chainable setStuff functions
    //
    setAlpha( alpha ) {
      alpha = parseFloat( alpha )

      /* istanbul ignore else  */
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

      /* istanbul ignore else  */
      if ( !isNaN( r ) ) this[0+RGBA_OFFSET] = r
      /* istanbul ignore else  */
      if ( !isNaN( g ) ) this[1+RGBA_OFFSET] = g
      /* istanbul ignore else  */
      if ( !isNaN( b ) ) this[2+RGBA_OFFSET] = b
      /* istanbul ignore else  */
      if ( !isNaN( a ) ) this[3+RGBA_OFFSET] = a

      return this
    }

    setString( str ) {
      /* eslint no-cond-assign: "off"*/
      if ( 'transparent' == str )
        return this.setAlpha( 0 )

      str = str.toLowerCase()

      if ( str in COLOUR_NAMES )
        return this.set8BitArray( COLOUR_NAMES[str], RGBA_OFFSET )

      let match

      if ( match = /hsla?\(\s*(-?[\d.]+%?)\s*,\s*(-?[\d.]+%)\s*,\s*(-?[\d.]+%)\s*(,\s*(-?[\d.]+%?))?\s*\)/.exec( str ) ) {
        this.setHSL( match[1], match[2], match[3], match[5] )
      } else if ( match = /rgba?\(\s*(-?[\d.]+%?)\s*,\s*(-?[\d.]+%?)\s*,\s*(-?[\d.]+%?)\s*(,\s*(-?[\d.]+%?))?\s*\)/.exec( str ) ) {
        this.setRGB(
          match[1],
          match[2],
          match[3],
          match[5]
        )
      } else if ( match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/.exec( str ) ) {
        this.setChannelHex( 0+RGBA_OFFSET, match[1] )
        this.setChannelHex( 1+RGBA_OFFSET, match[2] )
        this.setChannelHex( 2+RGBA_OFFSET, match[3] )
      } else /* istanbul ignore next  */ if ( match = /^#?([0-9a-f])([0-9a-f])([0-9a-f])/.exec( str ) ) {
        this.setChannelHex( 0+RGBA_OFFSET, match[1] )
        this.setChannelHex( 1+RGBA_OFFSET, match[2] )
        this.setChannelHex( 2+RGBA_OFFSET, match[3] )
      }

      return this
    }


    toRGBA() {
      return [
        this[0+RGBA_OFFSET],
        this[1+RGBA_OFFSET],
        this[2+RGBA_OFFSET],
        this[3+RGBA_OFFSET]
      ]
    }


  }

  return RGBA
}