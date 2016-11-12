const examples = require('./examples')
examples.run( __filename, ( canvas ) => {
  const border = 16
  canvas.set( 'lightseagreen' )

  canvas.eachPixel( ( pix, x, y ) => {
    x /= canvas.width - 1
    y /= canvas.height - 1

    x = x * 2 - 1
    y = y * 2 - 1

    if ( Math.sqrt( x * x + y * y ) <= 1 )
      pix.alpha = 1
  })

} )
