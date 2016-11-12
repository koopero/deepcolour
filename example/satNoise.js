const examples = require('./examples')
examples.run( __filename, ( canvas ) => {
  const hue = Math.random()
  canvas.eachPixel( function ( pixel, x, y ) {
    pixel.alpha = 1
    pixel.value = 1
    pixel.hue = hue
    pixel.saturation = Math.random()
  } )
} )
