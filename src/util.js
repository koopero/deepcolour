const util = exports

util.clampValue = function ( a ) {
  a = parseFloat( a ) || 0
  if ( a > 1 )
    return 1
  
  if ( a < 0 )
    return 0

  return a
}

util.parseCSSHue = function ( v ) {
  if ( 'number' == typeof v ) return v
  if ( !v )  return NaN

  return parseFloat( v ) / 360
}

util.parseCSSValue = function ( v ) {
  if ( 'number' == typeof v ) return v
  if ( !v )  return NaN

  var div = 255
  if ( v.substr( v.length - 1 ) == '%' )
    div = 100

  return parseFloat( v ) / div
}

util.parseCSSAlpha = function ( v ) {
  if ( 'number' == typeof v ) return v
  if ( !v )  return NaN

  var div = 1
  if ( v.substr( v.length - 1 ) == '%' )
    div = 100

  return parseFloat( v ) / div
}

util.valueToHex = function ( v ) {
  v = parseFloat( v ) || 0
  v = v < 0 ? 0 : v > 1 ? 1 : v
  v = Math.round( v * 255 )
  v = v.toString( 16 )
  if ( v.length < 2 )
    v = '0'+v

  return v
}

/* istanbul ignore next */
util.valueToPercent = function ( v ) {
  v *= 100
  v = v.toFixed( 1 )
  v += '%'

  return v
}

util.valueToAlpha = function ( v ) {
  return v.toFixed( 2 )
}

util.parseAmount = function ( amount ) {
  amount = parseFloat( amount )
  if ( isNaN( amount ) )
    return 1

  return amount
}
