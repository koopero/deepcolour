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

    assert.equal( result.x, 0 )
    assert.equal( result.w, width )
    assert.equal( result.h, height )
  })

  it('will return default to bottom right', () => {
    const width = 8
        , height = 4
        , x = 2
        , y = 3
        , canvas = new Canvas( width, height )
        , result = boxOptions( canvas, { x, y } )

    assert.equal( result.x, x )
    assert.equal( result.w, width - x )
    assert.equal( result.h, height - y )
  })


})
