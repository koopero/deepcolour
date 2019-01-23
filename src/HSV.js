const util = require('./util')


module.exports = 
function addMixin( _class, options ) {
  Object.assign( _class.prototype.keys, {
    'h': -10,
    'hue': -10,
    's': -11,
    'sat': -11,
    'saturation': -11,
    'v': -12,
    'val': -12,
    'value': -12,
  } )


  class HSV extends _class {

    setChannel( channel, value ) {
      let index = this.channelIndex( channel )

      switch( index ) {
        case -10: this.setHSV( value, NaN, NaN ); break
        case -11: this.setHSV( NaN, value, NaN ); break
        case -12: this.setHSV( NaN, NaN, value ); break
        default:
          return super.setChannel( channel, value )
      }

      return this
    }

    getChannel( channel ) {
      let index = this.channelIndex( channel )

      switch( index ) {
        case -10: return this.getHSVHue()
        case -11: return this.getHSVSaturation()
        case -12: return this.getHSVValue()
        default:
          return super.getChannel( channel )
      }
    }

    getHSVValue () {
      return Math.max( this.red, this.green, this.blue )
    }

    getHSVSaturation () {
      if ( this.isBlack() )
        return this._saturation || 0

      const max = Math.max( this.red, this.green, this.blue )
      const min = Math.min( this.red, this.green, this.blue )
      const delta = max - min

      return delta / max
    }

    getHSVHue() {
      const max = Math.max( this.red, this.green, this.blue )
      const min = Math.min( this.red, this.green, this.blue )
      const delta = max - min

      if ( delta <= 0 )
        return this._hue || 0

      const red = this.red
      const green = this.green
      const blue = this.blue

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
        /* istanbul ignore next */ case 1: this.setRGB( eQ, val, eP ); break
        /* istanbul ignore next */ case 2: this.setRGB( eP, val, eT ); break
        /* istanbul ignore next */ case 3: this.setRGB( eP, eQ, val ); break
        /* istanbul ignore next */ case 4: this.setRGB( eT, eP, val ); break
        /* istanbul ignore next */ case 5: this.setRGB( val, eP, eQ ); break
      }

      return this
    }

  }

  return HSV

}