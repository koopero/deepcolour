const Colour = require('..')
    , assert = require('chai').assert
describe('README', () => {
  it('Main example', () => {
    let colour = new Colour(1,0,0,1)

    console.log( colour.hex )
    // #ff0000

    // make colour cyan by shifting hue
    colour.hue = 0.5

    console.log( colour.hex )
    // #00ffff

    // Set the colour with a string
    colour.set('white')

    // Retrieve value and saturation
    console.log( colour.value, colour.saturation )
    // 1,0
  })
  
  it('Hue Preservation Example', () => {
    // Initialize a new Colour
    let colour = new Colour('green')
    assert.equal( colour.hue, 1/3)

    // Set the colour to black
    colour.value = 0
    assert( colour.isBlack() )

    // Since it does not matter when value is 0,
    // hue is preserved.
    assert.equal( colour.hue, 1/3)

    // We can set the hue, as well.
    colour.hue = 1/6

    // Colour is still black
    assert( colour.isBlack() )

    // But the hue is preserved
    assert.equal( colour.hue, 1/6)

    // Set the colour back to full intensity
    colour.value = 1

    // Is now yellow
    assert.equal( colour.hex, '#ffff00' )
  })

  it('Colourless Vector example', () => {
    const { Space } = Colour
    const Vector = Space({
      rgba: false,
      channels: 'xyz'
    })
    
    let vec = Vector.add( [ 1, 0, 0 ], { y: 0.5 } )
    assert.deepEqual( vec.toArray(), [ 1, 0.5, 0 ] )
  })
})
