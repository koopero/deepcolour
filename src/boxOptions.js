'use strict'

module.exports = boxOptions
function boxOptions( canvas, opt ) {
  opt = opt || {}

  opt.x = parseInt( opt.x )
  opt.y = parseInt( opt.y )
  opt.w = parseInt( opt.w )
  opt.h = parseInt( opt.h )

  opt.x = opt.x || 0
  opt.y = opt.y || 0

  if ( isNaN( opt.w ) )
    opt.w = canvas.width - opt.x

  if ( isNaN( opt.h ) )
    opt.h = canvas.height - opt.y

  opt.w = Math.max( 0, opt.w )
  opt.h = Math.max( 0, opt.h )

  return opt
}
