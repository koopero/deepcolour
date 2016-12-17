const test = require('./_test')
    , assert = test.assert

describe('Colour', () => {
  const Colour = require('../index')

  describe('init', () => {
    it('from hex string', () => {
      const colour = new Colour('#102030')
      assert.equal( colour.red, 16 / 255 )
    })

    it('from colour name', () => {
      const colour = new Colour('lime')
      assert.equal( colour.toHexString(), '#00ff00' )
    })

    it('from RGBA arguments', () => {
      const colour = new Colour( 1, 0, 1, 0.5 )
      assert.equal( colour.alpha, 0.5 )
      assert.equal( colour.toHexString(), '#ff00ff' )
    })
  })

  describe('clone', () => {
    it('will clone', () => {
      const colour = new Colour()
      colour.red = 1
      assert.equal( colour.toHexString(), '#ff0000')

      const clone = colour.clone()

      clone.blue = 1
      assert.equal( colour.toHexString(), '#ff0000')
      assert.equal( clone.toHexString(), '#ff00ff')

    })
  })

  describe('set', () => {
    it('from other colour', () => {
      const a = new Colour()
          , b = new Colour()

      a.green = 0.5
      b.set( a )

      assert.equal( b.green, a.green )
    })

    it('from array of floats', () => {
      const a = new Colour()
      a.alpha = 0.5
      a.set( [ 1,0,1 ] )
      assert.equal( a.toHexString(), '#ff00ff' )
      assert.equal( a.alpha, 0.5 )
    })

    it('from object with channel keys', () => {
      const a = new Colour()
      a.set( { alpha: 0.5 } )
      assert.equal( a.alpha, 0.5 )
    })
  })

  describe('toBuffer', () => {
    it('will work', () => {
      const colour = new Colour()
      colour.blue = 1.2

      const result = colour.toBuffer()
      assert( Buffer.isBuffer( result ) )
      assert.equal( result.length, 4 )
      assert.equal( result[0], 0 )
      assert.equal( result[2], 255 )

    })
  })

  describe('mix', () => {
    it('will mix colours', () => {
      const a = new Colour( 0, 0, 1, 1 )
          , b = new Colour( 0, 1, 0, 1 )
          , e = new Colour( 0, 0.5, 0.5, 1 )

      a.mix( b, 0.5 )
      assert.equal( a.toHexString(), e.toHexString() )
    })
  })

  describe('HSV', () => {
    it('get hue', () => {
      const colour = new Colour()
      colour.red   = 1
      assert.equal( colour.hue, 0 )

      colour.green = 1
      assert.equal( colour.hue, 1/6 )
    })

    it('setHSV', () => {
      const colour = new Colour()
      colour.setHSV( 0, 1, 1 )
      assert.equal( colour.toHexString(), '#ff0000' )

      colour.setHSV( 1/6, 1, 1 )
      assert.equal( colour.toHexString(), '#ffff00' )
    })

    it('will save hue', () => {
      const colour = new Colour()
      colour.setHSV( 1/6, 1, 1 )
      assert.equal( colour.toHexString(), '#ffff00' )

      colour.setHSV( null, 0, 0 )
      assert.equal( colour.toHexString(), '#000000' )

      colour.setHSV( null, 1, 1 )
      assert.equal( colour.toHexString(), '#ffff00' )
    })

    it('will shift hue', () => {
      const colour = new Colour()
      colour.setRGB( 1,1,0.5)

      assert.equal( colour.hue, 1/6)
      colour.hue += 0.5

      assert.equal( colour.toHexString(), '#8080ff' )
    })
  })

  describe('get css', () => {
    it('will return hex when possible', () => {
      const colour = new Colour( Math.random(), Math.random(), Math.random() )
          , css = colour.css

      assert.match( css, /#[0-9A-F]{6}/i )
    })

    it('will return rgba() when alpha is not 1', () => {
      const colour = new Colour('blue').setAlpha(0.5)
          , css = colour.css

      assert.equal( css, 'rgba(0,0,100%,50%)' )
    })
  })
})
