const composite = exports

composite.mix = function( other, amount ) {
  this.eachChannel( ( value, channel ) =>
    value * ( 1 - amount ) + other[channel] * amount
  )
}

composite.over = function( other, amount ) {
  amount *= other[3]
  this.eachChannel( ( value, channel ) =>
    value * ( 1 - amount ) + other[channel] * amount
  )
}

composite.add = function( other, amount ) {
  this.eachChannel( ( value, channel ) =>
    value + other[channel] * amount
  )
}
