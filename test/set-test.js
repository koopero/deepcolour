/* eslint-env node, mocha */

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
      , colour = new Colour().set( buffer )

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

  describe('setRGB', () => {
    it('will set to black', () => {
      const colour = new Colour( 'lime' )
      assert( !colour.isBlack() )
      colour.setRGB(0,0,0)
      assert( colour.isBlack() )
    })

    it('array argument', () => {
      const colour = new Colour()
      colour.setRGB([1,0.5,0])
      assert( colour.hex, '#ff8000' )
    })
  })

  describe('setChannel', () => {
    it('will set alpha', () => {
      const colour = new Colour()
      colour.setChannel('alpha', 0.5 )
      assert.equal( colour.alpha, 0.5 )
    })

    it('will set hue', () => {
      const colour = new Colour('red')
      colour.setChannel('hue', 0.5 )
      assert.equal( colour.hex, '#00ffff' )
    })

    it('will set channel index', () => {
      const colour = new Colour('red')
      colour.setChannel(1, 0.5 )
      assert.equal( colour.hex, '#ff8000' )
    })

    it('will ignore NaN', () => {
      const colour = new Colour('red')
      colour.setChannel(1, 0.5 )
      colour.setChannel(1, NaN )
      assert.equal( colour.hex, '#ff8000' )
    })

    it('will throw on invalid channel', () => {
      const colour = new Colour('red')
      assert.throws( () => colour.setChannel('j', 0.5 ) )
    })

  })

  describe('setChannelSafe', () => {
    it('will set alpha', () => {
      const colour = new Colour()
      colour.setChannelSafe('alpha', 0.5 )
      assert.equal( colour.alpha, 0.5 )
    })

    it('will set hue', () => {
      const colour = new Colour('red')
      colour.setChannelSafe('hue', 0.5 )
      assert.equal( colour.hex, '#00ffff' )
    })

    it('will set channel index', () => {
      const colour = new Colour('red')
      colour.setChannelSafe(1, 0.5 )
      assert.equal( colour.hex, '#ff8000' )
    })

    it('will ignore NaN', () => {
      const colour = new Colour('red')
      colour.setChannelSafe(1, 0.5 )
      colour.setChannelSafe(1, NaN )
      assert.equal( colour.hex, '#ff8000' )
    })

    it('will ignore invalid channel', () => {
      const colour = new Colour('red')
      let orig = colour.toString() 
      colour.setChannelSafe('j', 0.5 )
      let after = colour.toString()
      assert.equal( orig, after )
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
    it('from [ \'css\', alpha ]', () => {
      const colour = new Colour()
      colour.setArguments( [ 'red', 0.5 ] )
      assert.equal( colour.red, 1 )
      assert.equal( colour.alpha, 0.5 )
    })

    it('from [ r,g,b,a ]', () => {
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

    it('from object', () => {
      const c = new Colour()
      c.setArguments([{ red: 0.5, g: 1 }], true )
      assert.equal( c.toHexChannels('rgba'), '80ff00ff' )
    })

    it('from nothing', () => {
      const c = new Colour('yellow')
      c.setArguments([ undefined ] )
      assert.equal( c.toHexChannels('rgb'), 'ffff00' )
    })
  })


  describe('setKeys', () => {
    it('will do nothing', () => {
      const colour = new Colour( 'red')
      colour.setKeys()
      assert.equal( colour.hex, '#ff0000' )
    })

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


    it('from { invalid }', () => {
      const colour = new Colour()
      colour.setKeys( { foo: 0.5 } )
      assert.equal( colour.hex, '#000000' )
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

    it('will ignore too long input', () => {
      const array = [ 0xde, 0xad, 0xbe, 0xef, 0x31, 0x33, 0x70 ]
        , colour = new Colour().set8BitArray( array  )

      assert.equal( colour.hex, '#deadbe' )
    })


  })

})
