const examples = require('./examples')
examples.run( __filename, ( canvas ) => {
  canvas.eachPixel( function ( pixel, x, y ) {
    pixel.alpha = 1
    pixel.value = 1
    pixel.hue = x / ( canvas.width - 1 )
    pixel.saturation = y / ( canvas.height - 1 )
  } )
} )
