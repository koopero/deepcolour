const util = require('./util')


module.exports = 
function addMixin( _class, options ) {
  const CHANNEL_TO_INDEX = {
    'h': 0,
    'hue': 0,
    's': 1,
    'sat': 1,
    'saturation': 1,
    'v': 2,
    'val': 2,
    'value': 2,
  }


  class HSV extends _class {
    getChannel( name ) {
      let index = CHANNEL_TO_INDEX[ name ]

      if ( index == 0 )
        return this.hue

      if ( index == 1 )
        return this.saturation

      if ( index == 2 )
        return this.value

      return super.getChannel( name )
    }

    set hue ( value ) {
      value = util.parseCSSHue( value )
      this.setHSV( value, this.saturation, this.value  )
    }

    set saturation ( value ) {
      value = util.parseCSSValue( value )
      this.setHSV( this.hue, value, this.value  )
    }

    set value ( value ) {
      value = util.parseCSSValue( value )
      this.setHSV( this.hue, this.saturation, value  )
    }

    get value () {
      return Math.max( this.red, this.green, this.blue )
    }

    get saturation () {
      if ( this.isBlack() )
        return this._saturation || 0

      const max = Math.max( this.red, this.green, this.blue )
      const min = Math.min( this.red, this.green, this.blue )
      const delta = max - min

      return max > 0 ? delta / max : 0
    }

    get hue() {
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
        case 1: this.setRGB( eQ, val, eP ); break
        case 2: this.setRGB( eP, val, eT ); break
        case 3: this.setRGB( eP, eQ, val ); break
        case 4: this.setRGB( eT, eP, val ); break
        case 5: this.setRGB( val, eP, eQ ); break
      }

      return this
    }

  }

  return HSV

}