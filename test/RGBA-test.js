/* eslint-env node, mocha */

const assert = require('chai').assert

describe('RGBA', () => {
  const Colour = require('../index')

  describe('.isBlack', () => {
    it('will detect black', () => {
      const colour = new Colour()
      colour.setRGB( 0,0,0 )

      assert.equal( colour.isBlack(), true )
    })

    it('will detect not black', () => {
      const colour = new Colour()
      colour.setRGB( 1,0,0 )

      assert.equal( colour.isBlack(), false )
    })
  })
} )