module.exports = 
function addMixin( _class ) {
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

    clone() {
      const clone = super.clone()
      clone._hue = this._hue
      clone._saturation = this._saturation
      return clone
    }

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

      const [ red, green, blue ] = this.toRGBA()
      const max = Math.max( red, green, blue )
      const min = Math.min( red, green, blue )
      const delta = max - min

      return delta / max
    }

    getHSVHue() {
      const [ red, green, blue ] = this.toRGBA()
      const max = Math.max( red, green, blue )
      const min = Math.min( red, green, blue )

      const delta = max - min

      if ( delta <= 0 )
        return this._hue || 0

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

      if ( isNaN( hue ) ) hue = this.getHSVHue()
      if ( isNaN( sat ) ) sat = this.getHSVSaturation()
      if ( isNaN( val ) ) val = this.getHSVValue()

      this._hue = hue
      hue = hue % 1
      hue = hue < 0 ? hue + 1 : hue
      this._saturation = sat


      if ( sat == 0 ) {
        this._setRGBUnsafe( val, val, val )
        return this
      }

      const hex = Math.floor( hue * 6 )
      const inHex = hue * 6 - hex
      const eP = val * (1 - sat)
      const eQ = val * (1 - (sat * inHex))
      const eT = val * (1 - (sat * (1 - inHex)))

      switch ( hex ) {
        case 0: this._setRGBUnsafe( val, eT, eP ); break
        /* istanbul ignore next */ case 1: this._setRGBUnsafe( eQ, val, eP ); break
        /* istanbul ignore next */ case 2: this._setRGBUnsafe( eP, val, eT ); break
        /* istanbul ignore next */ case 3: this._setRGBUnsafe( eP, eQ, val ); break
        /* istanbul ignore next */ case 4: this._setRGBUnsafe( eT, eP, val ); break
        /* istanbul ignore next */ case 5: this._setRGBUnsafe( val, eP, eQ ); break
      }

      return this
    }


    _deriveHueSat() {
      let [ R,G,B ] = this.toRGBA()

      if ( R == 0 && G == 0 && B == 0 ) {
        // Black, nothing to derive
        return 
      }

      this._saturation = this.getHSVSaturation()

      if ( R == G && G == B ) {
        // Grey, cannot derive hue 
        return 
      }

      this._hue = this.getHSVHue()
    }
  }

  return HSV

}