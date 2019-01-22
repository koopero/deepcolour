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
    // assert.equal( colour.z, 0 )
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
      console.dir( space.options )


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

    xit('will have getters for keys', () => {
      const colour = new space( 0, 0, 0, 0, 0.8 )
      assert.equal( colour.amber, 0.8 )
    })


  })
})