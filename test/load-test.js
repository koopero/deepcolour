const test = require('./_test')
    , assert = test.assert


describe('load', () => {
  const load = require('../src/load')

  it('will not smoke', () => {
    return load( test.resolve( 'img/big.png') )
    .then( ( canvas ) => {
      assert.equal( canvas.width, 8 )
      assert.equal( canvas.height, 256 )
      assert.equal( canvas.size, 8 * 256 )
    })
  })
})
