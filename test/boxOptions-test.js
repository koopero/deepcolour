const test = require('./_test')
    , assert = test.assert

const Canvas = require('../src/Canvas')
    , boxOptions = require('../src/boxOptions')

describe('boxOptions', () => {
  it('will return defaults', () => {
    const width = 8
        , height = 4
        , canvas = new Canvas( width, height )
        , result = boxOptions( canvas )

    assert.isArray( result )
    assert.equal( result[3], width )
    assert.equal( result[4], height )
  })

  it('will return default to bottom right', () => {
    const width = 8
        , height = 4
        , x = 2
        , y = 3
        , canvas = new Canvas( width, height )
        , result = boxOptions( canvas, { x, y } )

    assert.equal( result[1], x )
    assert.equal( result[3], width - x )
    assert.equal( result[4], height - y )
  })

  it('will be idempotent', () => {
    const width = 8
        , height = 4
        , x = 2
        , y = 3
        , canvas = new Canvas( width, height )

    var result = boxOptions( canvas, { x, y } )
    result = boxOptions( canvas, result )

    assert.equal( result[1], x )
    assert.equal( result[3], width - x )
    assert.equal( result[4], height - y )
  })

})
