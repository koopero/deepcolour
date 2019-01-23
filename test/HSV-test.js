/* eslint-env node, mocha */

const assert = require('chai').assert

describe('HSV', () => {
  let Colour 
  it('will initialize difficult colour space', () => {
    const { Space } = require('..')
    Colour = Space({
      rgba: 2,
      channels: 'xyrgba'
    })    
  })

  describe('set hue', () => {
    it('negative number', () => {
      const colour = new Colour()
      colour.saturation = 1
      colour.value = 1
      colour.hue = -1/6
      assert.equal( colour.toHexChannels('rgb'), 'ff00ff' )
    })

    it('css string', () => {
      const colour = new Colour()
      colour.saturation = 1
      colour.value = 1
      colour.hue = '300 deg'
      assert.equal( colour.toHexChannels('rgb'), 'ff00ff' )
    })
  })

  describe('setChannel', () => {
    it('saturation', () => {
      const colour = new Colour('yellow')
      colour.setChannel( 'saturation', 0.5 )
      assert.equal( colour.toHexChannels('rgb'), 'ffff80' )
    })    
  })

  describe('getHSVHue', () => {
    it('will get all the colours', () => {
      assert.equal( new Colour('yellow').getHSVHue(), 1/6 ) 
      assert.equal( new Colour('cyan').getHSVHue(), 3/6 ) 
      assert.equal( new Colour('blue').getHSVHue(), 4/6 ) 
      assert.equal( new Colour('magenta').getHSVHue(), 5/6 ) 
    })
  })

  describe('getHSVSaturation', () => {
    it('will get all the colours', () => {
      assert.equal( new Colour('yellow').getHSVSaturation(), 1 ) 
      assert.equal( new Colour('black').getHSVSaturation(), 0 ) 
      assert.equal( new Colour('white').getHSVSaturation(), 0 ) 
      assert.equal( new Colour('rgba(200,100,100)').getHSVSaturation(), 0.5 ) 
    })

    it('will try to deal with weird negative colours', () => {
      assert.equal( new Colour(-1,0,0).getHSVSaturation(), 0 ) 
    })
  })
})