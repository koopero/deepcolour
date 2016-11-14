const examples = require('./examples')
    , Colour = examples.Colour
    
examples.run( __filename, ( canvas ) => {
  const a = new Colour( 1,0,0,1 )
      , b = new Colour( 0,0,1,1 )

  canvas.eachPixel( function ( pixel, x, y ) {
    pixel.set( a )
    pixel.mix( b, x / ( canvas.width - 1 ) )
  } )
} )
