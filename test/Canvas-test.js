const test = require('./_test')
    , assert = test.assert

describe('Canvas', () => {
  const Canvas = require('../src/Canvas')
      , Colour = require('../src/Colour')
      , Pixel = require('../src/Pixel')

  it('will not smoke', () => {
    const canvas = new Canvas( 64, 64 )

    assert.isArray( canvas.pixels )
    assert.isFunction( canvas.pixel )

    const pixel = canvas.pixel( 0, 0 )
    assert.instanceOf( pixel, Pixel )
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
      canvas.colour(0,0).red = 1

      const clone = canvas.clone()

      assert.equal( clone.length, canvas.length )
    })
  })

  describe('pixel', () => {
    it('will return background', () => {
      const canvas = new Canvas( 3, 1 )
          , background = canvas.backgroundPixel
      assert.notEqual( canvas.pixel( 0,0 ), background )
      assert.equal( canvas.pixel( 4,0 ), background )

    } )
  })

  describe('box', () => {
    it('no options', () => {
      const canvas = new Canvas( 3, 3 )
          , box = canvas.box()

      assert.isArray( box )
      assert.equal( box.length, 9 )

      box.map( ( pixel ) => assert( Pixel.isPixel( pixel ) ) )
      assert.equal( box[0].i, 0 )
    } )

    it('crop', () => {
      const canvas = new Canvas( 4, 5 )
          , box = canvas.box( { w: 3, h: 4 })

      assert.equal( box.length, 12 )
      box.map( ( pixel ) => assert( Pixel.isPixel( pixel ) ) )
    } )

    it('zig', () => {
      const canvas = new Canvas( 3, 3 )
          , box = canvas.box( { zig: 1 } )

      assert.equal( box[2].x, 2 )
      assert.equal( box[3].y, 1 )
      assert.equal( box[3].x, 2 )
    } )

    it('zag', () => {
      const canvas = new Canvas( 3, 3 )
          , box = canvas.box( { zig: 2 } )

      assert.equal( box[0].x, 2 )
      assert.equal( box[3].y, 1 )
      assert.equal( box[3].x, 0 )
    } )

  })

  describe('eachPixel', () => {
    it('will work', () => {
      const canvas = new Canvas( 8, 1 )
      canvas.colour(0,0)[0] = 1
      canvas.colour(0,0)[2] = 0.5
      var calls = 0
      const result = canvas.eachPixel(  )
    })

    it('will crop', () => {
      const canvas = new Canvas( 12, 12 )

      canvas.colour(3,3).red = 1

      const pixels = canvas.eachPixel( { x: 3, y: 3, w: 4, h: 4 } )
      assert.isArray( pixels )
      assert.equal( pixels.length, 16 )
      assert( Colour.isColour( pixels[0].colour ) )
      assert.equal( pixels[0].colour.red, 1 )
    })
  })

  describe('toBuffer', () => {
    it('will crop', () => {
      const canvas = new Canvas( 12, 12 )

      canvas.pixel(3,3).colour.red = 1
      canvas.colour(4,3).green = 1

      const result = canvas.toBuffer( { x: 3, y: 3, w: 4, h: 4 } )
      assert( Buffer.isBuffer( result ) )
      assert.equal( result.length, 64 )
      assert.equal( result[0], 255 )
      assert.equal( result[1], 0 )
    })

    it('will output RGB only', () => {
      const canvas = new Canvas( 8, 1 )
      canvas.colour().red = 1
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

      canvas.colour(3,3).red = 1

      const result = canvas.toPNGBuffer( { x: 3, y: 3, w: 4, h: 4 } )
      assert( Buffer.isBuffer( result ) )
    })
  })

  describe('loadPNG', () => {
    it('will work', () => {
      const canvas = new Canvas( 8, 1 )

      return canvas.loadPNG( test.resolve('img/small.png') )
      .then( () => {
        // Yellow pixel from small.png
        assert.equal( canvas.colour(2).toHexString(), '#ffff00' )
      })
    })
  })

  describe('savePNG', () => {
    it('will work', () => {
      const canvas = new Canvas( 2, 2 )
      canvas.set({alpha:1})
      canvas.colour(1,0).red = 1
      canvas.colour(1,1).red = 1
      canvas.colour(0,1).green = 1
      canvas.colour(1,1).green = 1

      return canvas.savePNG( test.resolve('tmp/16pixels.png') )
    })
  })

})
