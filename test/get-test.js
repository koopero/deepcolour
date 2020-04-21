/* eslint-env node, mocha */

const assert = require('chai').assert

describe('Colour.get', () => {
  describe('getChannel', () => {
    it('will preserve saturation in arbitrary space', () => {
      const { Space } = require('..')
      const Colour = Space({
        rgba: 2,
        channels: 'xyrgba'
      })

      const colour = new Colour(0)
      colour.x = 1
      assert( colour.isBlack() )
      assert.equal( colour[0], 1 )
    })
  })
})