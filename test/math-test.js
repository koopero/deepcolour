/* eslint-env node, mocha */

const assert = require('chai').assert

describe('math', () => {
  let Vector 
  it('will initialize xy space', () => {
    const { Space } = require('..')
    Vector = Space({
      rgba: false,
      channels: 'xy'
    })
  })

  describe('add', () => {
    it('static call', () => {
      const result = Vector.add( [ 1, 2 ], [ 1 ], [ 0, 2 ] )
      assert.deepEqual( result.toArray(), [ 2, 4 ] )
    })

    it('in-place', () => {
      const vec = new Vector( 1, 2 )
      vec.add( [ 1, 2 ] )
      assert.deepEqual( vec.toArray(), [ 2, 4 ] )
    })

    it('in-place, number', () => {
      const vec = new Vector( 1, 2 )
      vec.add( 1 )
      assert.deepEqual( vec.toArray(), [ 2, 3 ] )
    })
  })

  describe('subtract', () => {
    it('static call', () => {
      const result = Vector.subtract( [ 1, 2 ], [ 1 ], [ 0, 3 ] )
      assert.deepEqual( result.toArray(), [ 0, -1 ] )
    })
  })

  describe('max', () => {
    it('static call', () => {
      const result = Vector.max( [ 1, 2 ], [ 2, 0 ], [ 0, 2 ] )
      assert.deepEqual( result.toArray(), [ 2, 2 ] )
    })
  })

  describe('min', () => {
    it('static call', () => {
      const result = Vector.min( [ 1, 2 ], [ 2, -1 ], [ -1, 2 ] )
      assert.deepEqual( result.toArray(), [ -1, -1 ] )
    })
  })

  describe('mix', () => {
    it('in-place', () => {
      const vec = new Vector( 1, 2 )
      vec.mix( [ 3, 4 ], 0.5 )
      assert.deepEqual( vec.toArray(), [ 2, 3 ] )
    })

    it('defaults to 1', () => {
      const vec = new Vector( 1, 2 )
      vec.mix( [ 3, 4 ] )
      assert.deepEqual( vec.toArray(), [ 3, 4 ] )
    })
  })


  describe('multiply', () => {
    it('static call', () => {
      const result = Vector.multiply( [ 1, 2 ], [ 2, 1 ], [ -1, -1 ] )
      assert.deepEqual( result.toArray(), [ -2, -2 ] )
    })
  })

  describe('divide', () => {
    it('static call', () => {
      const result = Vector.divide( [ 1, 2 ], [ 2, 1 ], [ -1, -1 ] )
      assert.deepEqual( result.toArray(), [ -0.5, -2 ] )
    })
  })

  describe('equal', () => {
    it('static call', () => {
      assert.equal( Vector.equal( [ 1, 2 ], [ 1, 2 ] ), true )
      assert.equal( Vector.equal( [ 1, 2 ], [ 1, 2 ], { x: 1, y: 2 } ), true )
      assert.equal( Vector.equal( [ 1, 2 ], [ 2, 1 ] ), false )
    })

    it('method call', () => {
      const vec = new Vector( 1, 2 )
      assert.equal( vec.equal( [1,2] ), true)
    })
  })

})