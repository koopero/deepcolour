const assert = require('chai').assert

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

  describe('object properties', () => {
    it('will have length', () => {
      const colour = new Colour('#102030')
      assert.equal( colour.length, 4 )
    })

    it('will have inspect', () => {
      const colour = new Colour('#102030')
      colour.inspect()
    })

    it('will have valueOf', () => {
      const colour = new Colour('#102030')
      colour.valueOf()
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

      assert.equal( css, 'rgba(0,0,255,0.50)' )
    })

    it('will clamp alpha values', () => {
      // Since any system capable of using unclamped alpha values is probable
      // not using CSS to parse colours, ensure that alpha values are always
      // in range 0-1
      
      let a = new Colour('blue').setAlpha(10.0)
      assert.equal( a.css, '#0000ff' )
      assert.equal( a.toCSSUnclamped(), 'rgba(0,0,255,10.00)')

      a.setAlpha(-1)
      assert.equal( a.css, 'rgba(0,0,255,0.00)' )
      assert.equal( a.toCSSUnclamped(), 'rgba(0,0,255,-1.00)')      
    })
  })

  describe('get hex', () => {
    it('will regular hex', () => {
      const colour = new Colour( Math.random(), Math.random(), Math.random() )
          , hex = colour.hex

      assert.match( hex, /#[0-9A-F]{6}/i )
    })

    it('will return clamped values when colour is out of range', () => {
      const colour = new Colour(2,-1,0.5,3)
          , hex = colour.hex

      assert.equal( hex, '#ff0080' )
    })
  })

  describe('.equal', () => {
    it('will compare colours', () => {
      const a = new Colour().setRandom()
          , b = new Colour( a )

      assert( Colour.equal( a, b ) )
    })

    it('will compare many args', () => {
      const a = new Colour().setRandom()
          , b = new Colour( a )
          , c = new Colour()

      assert( Colour.equal( a, b, a, b, a ) )
      assert( !Colour.equal( a, b, a, b, a, c ) )
    })
  })

  describe('.setChannelHex', () => {
    it('parses 2 digit hex', () => {
      let c = new Colour()
      c.setChannelHex(2,'80')

      assert.equal( c.hex, '#000080')
    })

    it('parses 1 digit hex', () => {
      let c = new Colour()
      c.setChannelHex(2,'7')

      assert.equal( c.hex, '#000077')
    })

    it('parses 8 bit number', () => {
      let c = new Colour()
      c.setChannelHex(2,8)

      assert.equal( c.hex, '#000008')
    })

    it('will throw on invalid value', () => {
      let c = new Colour()
      assert.throws( () => {
        c.setChannelHex(2,null)
      })

      assert.throws( () => {
        c.setChannelHex(2,'fff')
      })
    })

    it('will throw on invalid channel', () => {
      let c = new Colour()
      assert.throws( () => {
        c.setChannelHex('nochannel','88')
      })
    })
  })

  describe('.getChannel', () => {
    it('will get by index', () => {
      const value = 0.15
      const index = 1
      const c = new Colour( 0, value )
      assert.equal( c.getChannel( index ), value )
    })

    it('will get by name', () => {
      const value = 0.15
      const name = 'green'
      const c = new Colour( 0, value )
      assert.equal( c.getChannel( name ), value )
    })

    it('will throw on invalid channel', () => {
      const name = 'nope'
      const c = new Colour()
      assert.throws( () => {
        c.getChannel( name )
      })
    })
  })

  describe('.isGrey', () => {
    it('will detect grey colours', () => {
      assert.equal( new Colour( 'white' ).isGrey(), true )
    } )

    it('will detect colours that are not grey', () => {
      assert.equal( new Colour( 'red' ).isGrey(), false )
    } )
  })

  describe('.isNormal', () => {
    it('will detect normal colours', () => {
      assert.equal( new Colour( 'white' ).isNormal(), true )
    } )

    it('will detect colours that are not normal', () => {
      assert.equal( new Colour( 2,0,0,0 ).isNormal(), false )
    } )
  })

  describe('.toHexChannels', () => {
    it('will output requested channels', () => {
      const c = new Colour()
      c.hex = '334455'
      c.alpha = 0.5

      assert.equal( c.toHexChannels('grb'), '443355' )
    })

    it('will default to all channels', () => {
      const c = new Colour()
      c.hex = '334455'
      c.alpha = 0.5

      assert.equal( c.toHexChannels(), '33445580' )
    })

    it('will use array channels', () => {
      const c = new Colour()
      c.hex = '334455'
      c.alpha = 0.5

      assert.equal( c.toHexChannels(['red','alpha']), '3380' )
    })


    it('output hue', () => {
      const c = new Colour('cyan')
      assert.equal( c.toHexChannels('h'), '80' )
    })

    it('will throw on invalid channels', () => {
      const colour = new Colour()
      assert.throws( () => {
        colour.toHexChannels( null )
      })
    })

  })

  describe('.toBuffer', () => {
    it('will return expected result', () => {
      const colour = new Colour( 0.5, 0.25, 0.125 )
      let result = colour.toBuffer()
      assert( Buffer.isBuffer( result ) )
      let arr = [...result]
      assert.deepEqual( arr, [ 128, 64, 32, 255 ] )
    })
    
    it('will throw on invalid length', () => {
      const colour = new Colour()
      assert.throws( () => {
        colour.toBuffer( 8 )
      })
    })
  })

  describe('.toObject', () => {

    it('will return expected result', () => {
      const colour = new Colour( 0.5, 0.25, 0.125 )
      let result = colour.toObject()
      assert.deepEqual( result, { r: 0.5, g: 0.25, b: 0.125, a: 1 } )
    })

    it('will return partial keys', () => {
      const colour = new Colour( 0.5, 0.25, 0.125 )
      let result = colour.toObject('rg')
      assert.deepEqual( result, { r: 0.5, g: 0.25 } )
    })
    
    it('will throw on invalid keys', () => {
      const colour = new Colour()
      assert.throws( () => {
        colour.toObject( null )
      })
    })
  })

  describe('.toArray', () => {

    it('will return expected result', () => {
      const colour = new Colour( 0.5, 0.25, 0.125 )
      let result = colour.toArray()
      assert.deepEqual( result, [ 0.5, 0.25, 0.125, 1 ] )
    })
    
    it('will throw on invalid length', () => {
      const colour = new Colour()
      assert.throws( () => {
        colour.toArray( 8 )
      })
    })
  })

  describe('.to8BitArray', () => {

    it('will return expected result', () => {
      const colour = new Colour( 0.5, 0.25, 0.125 )
      let result = colour.to8BitArray()
      assert.deepEqual( result, [ 128, 64, 32, 255 ] )
    })

    it('will throw on invalid length', () => {
      const colour = new Colour()
      assert.throws( () => {
        colour.to8BitArray( 8 )
      })
    })
  })
})
