const examples = require('./index')
examples.run( __filename, ( canvas ) => {
  canvas.eachPixel( function ( pixel ) {
    pixel.colour.alpha = 1
    pixel.colour.value = 1
    pixel.colour.hue = pixel.u
    pixel.colour.saturation = pixel.v
  } )
} )
