const examples = require('./examples')
examples.run( __filename, ( canvas ) => {
  const border = 16
  canvas.set( { alpha: 1 } )
  canvas.set( 'lightseagreen' )

  canvas.set( { alpha: 0.5 }, {
    x: border,
    y: border,
    w: canvas.width - border * 2,
    h: canvas.height - border * 2
  } )

} )
