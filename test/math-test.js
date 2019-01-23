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

  it('will add', () => {
    const result = Vector.add( [ 1, 2 ], [ 1 ], [ 0, 2 ] )
    assert.deepEqual( result.toArray(), [ 2, 4 ] )
  })

  it('will subtract', () => {
    const result = Vector.subtract( [ 1, 2 ], [ 1 ], [ 0, 3 ] )
    assert.deepEqual( result.toArray(), [ 0, -1 ] )
  })

  it('will max', () => {
    const result = Vector.max( [ 1, 2 ], [ 2, 0 ], [ 0, 2 ] )
    assert.deepEqual( result.toArray(), [ 2, 2 ] )
  })

  it('will min', () => {
    const result = Vector.min( [ 1, 2 ], [ 2, -1 ], [ -1, 2 ] )
    assert.deepEqual( result.toArray(), [ -1, -1 ] )
  })

  it('will multiply', () => {
    const result = Vector.multiply( [ 1, 2 ], [ 2, 1 ], [ -1, -1 ] )
    assert.deepEqual( result.toArray(), [ -2, -2 ] )
  })

  it('will divide', () => {
    const result = Vector.divide( [ 1, 2 ], [ 2, 1 ], [ -1, -1 ] )
    assert.deepEqual( result.toArray(), [ -0.5, -2 ] )
  })
})