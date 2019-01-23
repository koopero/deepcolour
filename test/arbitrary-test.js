/* eslint-env node, mocha */

const assert = require('chai').assert

describe('arbitrary colour spaces', () => {
  const Colour = require('../index')

  it('will initialize', () => {
    const space = Colour.Space( {
      rgb: 0,
      hsv: 0,
      channels: ['x','y','z']
    })

    const colour = new space()
    assert.equal( colour.z, 0 )
  })

  it('length override', () => {
    const space = Colour.Space( {
      rgba: false,
      channels: 'xyz',
      length: 2
    })

    const colour = new space()
    assert.equal( colour.length, 2 )
    assert.deepEqual( colour.channels, [ 'x','y' ] )  
  })


  it('no hsv, css or getters', () => {
    const space = Colour.Space( {
      hsv: false,
      css: false,
      getters: false,
    })

    const colour = new space()
    assert.equal( colour.length, 4 )
    assert.isUndefined( colour.toCSS )
    assert.isUndefined( colour.red )

  })

  describe( 'pure vector', () => {
    const space = Colour.Space( {
      rgba: false,
      channels: 'xyzuv',
      defaults: [1,0]
    })


    it('will have right length', () => {
      const colour = new space() 
      assert.equal( colour.length, 5 )
    })

    it('will have correct defaults', () => {
      const colour = new space() 
      assert.equal( colour[0], 1 )
      assert.equal( colour[3], 0 )
    })

    it('will initialize from object', () => {
      const colour = new space({
        x: 42,
        v: 3
      }) 
      assert.equal( colour[0], 42 )
      assert.equal( colour[4], 3 )
    })

    it('will dump to hex', () => {
      const colour = new space( 0, 0, 0, 0, 0.5 )
      assert.equal( colour.toHexString( 6 ), '#000000008000' ) 
    })

    it('will add vectors', () => {
      const a = new space( 1, 2, 3 )
      const b = new space( 3, 2, 1 )
      
      a.add( b )
      assert.equal( a[0], 4 )
      assert.equal( a[1], 4 )
      assert.equal( a[2], 4 )
    })

    it('will add vectors (static)', () => {
      const a = [ 1, 2, 3 ]
      const b = [ 3, 2, 1 ]
      
      let result = space.add( a, b )
      assert.equal( result[0], 4 )
      assert.equal( result[1], 4 )
      assert.equal( result[2], 4 )
    })
  
    it('will subtract vectors', () => {
      const a = new space( 1, 2, 3 )
      const b = new space( 3, 2, 1 )
      
      a.subtract( b )
      assert.equal( a[0], -2 )
      assert.equal( a[1], 0 )
      assert.equal( a[2], 2 )
    })

    it('will divide vectors', () => {
      const a = new space( 6, 4, 2 )
      const b = new space( 3, 2, 1 )
      
      a.divide( b )
      assert.equal( a[0], 2 )
      assert.equal( a[1], 2 )
      assert.equal( a[2], 2 )
    })

    it('will min vectors', () => {
      const a = new space( 6, 4, 1 )
      const b = new space( 3, 2, 2 )
      
      a.min( b )
      assert.equal( a[0], 3 )
      assert.equal( a[1], 2 )
      assert.equal( a[2], 1 )
    })
  })

  describe( 'wide pixel', () => {
    const space = Colour.Space( {
      rgba: 0,
      alpha: -1,
      channels: 'rgbwmu',
      defaults: [1,0],
      keys: {
        'white': 3,
        'amber': 4,
        'uv': 5, 
      }
    })


    it('will have right length', () => {
      const colour = new space() 
      assert.equal( colour.length, 6 )
    })

    it('will have getters for keys', () => {
      const colour = new space( 0, 0, 0, 0, 0.8 )
      assert.equal( colour.amber, 0.8 )
    })
  })


})