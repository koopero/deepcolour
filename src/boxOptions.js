'use strict'

module.exports = boxOptions
function boxOptions( canvas, opt ) {
  opt = opt || {}

  var x, y, w, h, r, zig, channels

  if ( Array.isArray( opt ) ) {
    x = parseInt( opt[1] )
    y = parseInt( opt[2] )
    w = parseInt( opt[3] )
    h = parseInt( opt[4] )
    zig = parseInt( opt[6] )
    channels = opt[7]
  } else {
    x = parseInt( opt.x )
    y = parseInt( opt.y )
    w = parseInt( opt.w ) || parseInt( opt.width )
    h = parseInt( opt.h ) || parseInt( opt.height )
    zig = parseInt( opt.zig ) || 0
    channels = parseInt( opt.channels ) || 4
  }

  x = x || 0
  y = y || 0

  if ( isNaN( w ) )
    w = canvas.width - x

  if ( isNaN( h ) )
    h = canvas.height - y

  w = Math.max( 0, w )
  h = Math.max( 0, h )

  var r = 0

  if ( zig > 2 || zig < 0 )
    throw new Error('Invalid zig value')

  const result = [ x, y, w, h, r, zig, channels ]
  result.unshift( result.join(',') )
  return result
}
