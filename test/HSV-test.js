/* eslint-env node, mocha */

const assert = require('chai').assert

describe('HSV', () => {
  let Vector 
  it('will initialize difficult colour space', () => {
    const { Space } = require('..')
    Vector = Space({
      rgba: 2,
      channels: 'xyrgba'
    })    
  })

  describe('set hue', () => {
    it('negative number', () => {
      const colour = new Vector()
      colour.saturation = 1
      colour.value = 1
      colour.hue = -1/6
      assert.equal( colour.toHexChannels('rgb'), 'ff00ff' )
    })

    it('css string', () => {
      const colour = new Vector()
      colour.saturation = 1
      colour.value = 1
      colour.hue = '300 deg'
      assert.equal( colour.toHexChannels('rgb'), 'ff00ff' )
    })
  })

  describe('setChannel', () => {
    it('saturation', () => {
      const colour = new Vector('yellow')
      // colour.setChannel( 'saturation', 0.5 )
      assert.equal( colour.toHexChannels('rgb'), 'ffff80' )
    })    
  })

  describe('getHSVHue', () => {
    it('will get all the colours', () => {
      assert.equal( new Vector('yellow').getHSVHue(), 1/6 ) 
      assert.equal( new Vector('cyan').getHSVHue(), 3/6 ) 
      assert.equal( new Vector('blue').getHSVHue(), 4/6 ) 
      assert.equal( new Vector('magenta').getHSVHue(), 5/6 ) 
    })
  })

  describe('getHSVSaturation', () => {
    it('will get all the colours', () => {
      assert.equal( new Vector('yellow').getHSVSaturation(), 1 ) 
      assert.equal( new Vector('black').getHSVSaturation(), 0 ) 
      assert.equal( new Vector('white').getHSVSaturation(), 0 ) 
      assert.equal( new Vector('rgba(200,100,100)').getHSVSaturation(), 0.5 ) 
    })

    it('will try to deal with weird negative colours', () => {
      assert.equal( new Vector(-1,0,0).getHSVSaturation(), 0 ) 
    })
  })

  describe('hue / sat preservation', () => {
    const Colour = require('..')

    it('will maintain HS in single object after .setRGB()', () => {
      let colour = new Colour()
      assert( colour.isBlack() )
      colour.setRGB( [ 0.5, 1, 1 ] )
      assert( !colour.isBlack() )
      assert.equal( colour.hue, 0.5 )
      assert.equal( colour.sat, 0.5 )
      colour.setRGB( [ 0, 0, 0 ] )
      assert( colour.isBlack() )
      assert.equal( colour.hue, 0.5 )
      assert.equal( colour.sat, 0.5 )
    })

    it('will maintain hue after CSS set', () => {
      let colour = new Colour( 'yellow' )
      let orig = colour.hue 
      assert.equal( orig, 1/6 )
      colour.set('black')
      assert.equal( colour.hue, orig )
    })

    it('will maintain hue through clone', () => {
      let first = new Colour( 'cyan' )
      assert.equal( first.hue, 0.5 )
      first.set('black')
      let second = first.clone()
      assert.equal( second.hue, 0.5 )
    })
  })
})