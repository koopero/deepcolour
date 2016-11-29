const examples = require('./index')
examples.run( __filename, ( canvas ) => {
  const border = 16
  canvas.set( 'lightsalmon' )

  canvas.eachPixel( ( pix ) => {
    const x = pix.u * 2 - 1
        , y = pix.v * 2 - 1

    if ( Math.sqrt( x * x + y * y ) <= 1 )
      pix.colour.alpha = 1
  })
} )
