const examples = require('./index')
    , Colour = examples.Colour

examples.run( __filename, ( canvas ) => {
  const a = new Colour( 1,0,0,1 )
      , b = new Colour( 0,0,1,1 )

  canvas.eachPixel( function ( pixel ) {
    pixel.colour.set( a )
    pixel.colour.mix( b, pixel.u )
  } )
} )
