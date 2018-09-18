const RGB = require('./RGB')

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

const util = require('./util')

class HSV extends RGB {
  channelByName( name ) {
    let index = CHANNEL_TO_INDEX[ name ]

    if ( index == 0 )
      return this.hue

    if ( index == 1 )
      return this.saturation

    if ( index == 3 )
      return this.value

    return super.channelByName( name )
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
    return Math.max( this[0], this[1], this[2] )
  }

  get saturation () {
    if ( this.isBlack() )
      return this._saturation || 0

    const max = Math.max( this[0], this[1], this[2] )
        , min = Math.min( this[0], this[1], this[2] )
        , delta = max - min

    return max > 0 ? delta / max : 0
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

}

module.exports = HSV