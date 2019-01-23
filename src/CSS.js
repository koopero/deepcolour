const util = require('./util')

module.exports = 
function addMixin( _class, options ) {
  class CSS extends _class {
    //
    // String getters / setters
    //

    get css() {
      return this.toCSS()
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


    setHSL() {
      var args = arguments.length == 1 && arguments[0].length ? arguments[0] : arguments
      const h = util.parseCSSHue( args[0] )
          , s = util.parseCSSValue( args[1] )
          , l = util.parseCSSValue( args[2] )
          , alpha = util.parseCSSAlpha( args[3] )


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

    toCSS( format = 'auto' ) {
      switch( format ) {
        case 'rgba':
          return this.toCSSRGBA()
          
        case 'hex':
          return this.toHexString()

        case 'unclamped':
          return this.toCSSUnclamped()

        case 'auto':
        default:
          let alpha = this.alpha
          alpha = util.clampValue( alpha )
          if ( this.isRGBNormal() && alpha == 1 ) 
            return this.toHexString()

          return this.toCSSRGBA()
      }
    }

    toCSSRGBA() {
      let numbers = this.to8BitArray(3)
        , tag = 'rgb'
        , alpha = this.alpha

      alpha = util.clampValue( alpha )

      if ( alpha != 1 ) {
        numbers.push( util.valueToAlpha( alpha ) )
        tag += 'a'
      }

      let inner = numbers.join( ',' )

      return `${tag}(${inner})`
    }

    toCSSUnclamped() {
      let numbers = this.toRGBA()
      numbers = numbers.map( ( value, channel ) => 
        channel < 3 ? 
          Math.floor( value * 255 ).toString() :
          util.valueToAlpha( value )
      )
      let inner = numbers.join( ',' )

      return `rgba(${inner})`    
    }

    setKeys( ob ) {
      super.setKeys( ob )

      const self = this
          , props = [
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
  }

  return CSS
}