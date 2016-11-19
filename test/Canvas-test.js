const test = require('./_test')
    , assert = test.assert

describe('Canvas', () => {
  const Canvas = require('../src/Canvas')
      , Colour = require('../src/Colour')

  it('will not smoke', () => {
    const trix = new Canvas( 64, 64 )

    assert.isArray( trix.pixels )
    assert.isFunction( trix.pixel )

    const pixel = trix.pixel( 0, 0 )
    assert.instanceOf( pixel, Colour )
  })

  describe('constructor', () => {
    it('from object', () => {
      const canvas = new Canvas( {
        width: 43,
        height: 42
      } )

      assert.equal( canvas.width, 43 )
    })
  })

  describe('clone', () => {
    it('will clone', () => {
      const canvas = new Canvas( 8, 1 )
      canvas.pixel(0,0).red = 1

      const clone = canvas.clone()

      assert.equal( clone.length, canvas.length )
    })
  })

  describe('eachPixel', () => {
    it('will work', () => {
      const trix = new Canvas( 8, 1 )
      trix.pixel(0,0)[0] = 1
      trix.pixel(0,0)[2] = 0.5
    })

    it('will crop', () => {
      const canvas = new Canvas( 12, 12 )

      canvas.pixel(3,3).red = 1

      const pixels = canvas.eachPixel( { x: 3, y: 3, w: 4, h: 4 } )
      assert.isArray( pixels )
      assert.equal( pixels.length, 16 )
      assert( Colour.isColour( pixels[0] ) )
      assert.equal( pixels[0].red, 1 )
    })
  })

  describe('toBuffer', () => {
    it('will crop', () => {
      const canvas = new Canvas( 12, 12 )

      canvas.pixel(3,3).red = 1

      const result = canvas.toBuffer( { x: 3, y: 3, w: 4, h: 4 } )
      assert( Buffer.isBuffer( result ) )
      assert.equal( result.length, 64 )
      assert.equal( result[0], 255 )
      assert.equal( result[1], 0 )
    })

    it('will output RGB only', () => {
      const canvas = new Canvas( 8, 1 )
      canvas.pixel().red = 1
      const result = canvas.toBuffer( { channels: 3 } )

      assert( Buffer.isBuffer( result ) )
      assert.equal( result.length, 24 )
      assert.equal( result[0], 255 )
      assert.equal( result[1], 0 )
    })
  })

  describe('toPNGBuffer', () => {
    it('will crop', () => {
      const canvas = new Canvas( 12, 12 )

      canvas.pixel(3,3).red = 1

      const result = canvas.toPNGBuffer( { x: 3, y: 3, w: 4, h: 4 } )
      assert( Buffer.isBuffer( result ) )
    })
  })

  describe('loadPNG', () => {
    it('will work', () => {
      const trix = new Canvas( 8, 1 )

      return trix.loadPNG( test.resolve('img/small.png') )
      .then( () => {
        // Yellow pixel from small.png
        assert.equal( trix.pixel(2).toHexString(), '#ffff00' )
      })
    })
  })

  describe('savePNG', () => {
    it('will work', () => {
      const trix = new Canvas( 2, 2 )
      trix.set({alpha:1})
      trix.pixel(1,0).red = 1
      trix.pixel(1,1).red = 1
      trix.pixel(0,1).green = 1
      trix.pixel(1,1).green = 1

      return trix.savePNG( test.resolve('tmp/16pixels.png') )
    })
  })

})
