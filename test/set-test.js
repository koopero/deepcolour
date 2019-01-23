const assert = require('chai').assert

describe('Colour.set', () => {
  const Colour = require('../index')

  it('does nothing with invalid arguments', () => {
    const a = new Colour()
    a.set()
  })

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

  it('from Buffer', () => {
    const buffer = Buffer.from('RGB')
        , colour = new Colour().set8BitArray( buffer )

    assert.equal( colour.hex, '#524742' )
  })

  describe('setDefault', () => {
    it('will set to black', () => {
      const colour = new Colour( 'lime' )
      assert( !colour.isBlack() )
      colour.setDefault()
      assert( colour.isBlack() )
    })
  })

  describe('setAlpha', () => {
    it('will set alpha', () => {
      const colour = new Colour( 'lime' )
      assert.equal( colour.alpha, 1 )
      assert.equal( colour.setAlpha( 0.5 ), colour )
      assert.equal( colour.alpha, 0.5 )
    })
  })


  describe('setRandom', () => {
    it('will work', () => {
      const colour = new Colour( 'lime' )
      assert.equal( colour.setRandom(), colour )
      assert.notEqual( colour.hex, '#00ff00' )
    })
  })


  describe('setArguments', () => {
    it(`from [ 'css', alpha ]`, () => {
      const colour = new Colour()
      colour.setArguments( [ 'red', 0.5 ] )
      assert.equal( colour.red, 1 )
      assert.equal( colour.alpha, 0.5 )
    })

    it(`from [ r,g,b,a ]`, () => {
      const colour = new Colour()
      colour.setArguments( [ 1,0,1, 0.5 ] )
      assert.equal( colour.hex, '#ff00ff' )
      assert.equal( colour.alpha, 0.5 )
    })

    it('will fill when asked', () => {
      const c = new Colour()
      c.setArguments([0.5], true )
      assert.equal( c.toHexChannels('rgba'), '80808080' )
    })
  })


  describe('setKeys', () => {
    it('from { red green blue }', () => {
      const colour = new Colour()
      colour.setKeys( { r: 0.1, green: 0.2, blue: 0.3, a: 0.5 } )
      assert.equal( colour.red, 0.1 )
    })

    it('from { hex }', () => {
      const colour = new Colour()
      colour.setKeys( { hex: '#112233' } )
      assert.equal( colour.hex, '#112233' )
    })

    it('from { css }', () => {
      const colour = new Colour()
      colour.setKeys( { css: 'rgb(50%,50%,50%)' } )
      assert.equal( colour.hex, '#808080' )
    })
  })

  describe('set8BitArray', () => {
    it('will read from an array', () => {
      const array = [ 0xde, 0xad, 0xbe, 0xef ]
          , colour = new Colour().set8BitArray( array  )

      assert.equal( colour.hex, '#deadbe' )
    })

    it('will be chainable', () => {
      const array = [ 0xde, 0xad, 0xbe, 0xef ]
          , colour = new Colour()
          , result = colour.set8BitArray( array  )

      assert.equal( colour, result )
    })



    it('will throw on invalid input', () => {
      const colour = new Colour()
      assert.throws( () => colour.set8BitArray() )
      assert.throws( () => colour.set8BitArray( {} ) )
      assert.throws( () => colour.set8BitArray( false ) )
    })
  })

  describe('setString', () => {
    it('from hsla()', () => {
      const colour = new Colour()
      colour.setString('hsla(262, 54%, 31%,65%)')
      assert.equal( colour.hex, '#44247a' )
      assert.equal( colour.alpha, 0.65 )
    })
    
    it('from rgba()', () => {
      const colour = new Colour()
      colour.setString('rgba(255, 50%, 25%, 65%)')
      assert.equal( colour.hex, '#ff8040' )
      assert.equal( colour.alpha, 0.65 )
    })

    it('from rgb()', () => {
      const colour = new Colour()
      colour.setString('rgb(255, 50%, 25%)')
      assert.equal( colour.hex, '#ff8040' )
    })

    it('from 6-digit hex', () => {
      const colour = new Colour()
      colour.setString('#ff8040')
      assert.equal( colour.hex, '#ff8040' )
    })

    it('from 3-digit hex', () => {
      const colour = new Colour()
      colour.setString('#f84')
      assert.equal( colour.hex, '#ff8844' )
    })

    it(`from 'transparent'`, () => {
      const colour = new Colour()
      assert.equal( colour.alpha, 1 )
      colour.setString('transparent')
      assert.equal( colour.alpha, 0 )
    })
  })
})
