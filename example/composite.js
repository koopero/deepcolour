const examples = require('./index')
examples.run( __filename, ( canvas ) => {

  return examples.inputs('grid.png')
  .then( ( inputs ) => {
    canvas.setAlpha( 1 )
    canvas.set('indianred')

    const grid = inputs.grid
    grid.set('khaki')
    canvas.composite( grid )
  })
  
} )
