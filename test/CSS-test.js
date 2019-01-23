/* eslint-env node, mocha */

const assert = require('chai').assert

describe('CSS', () => {
  const Colour = require('../index')

  describe('get hex', () => {
    it('will regular hex', () => {
      const colour = new Colour( Math.random(), Math.random(), Math.random() )
        , hex = colour.hex

      assert.match( hex, /#[0-9A-F]{6}/i )
    })

    it('will return clamped values when colour is out of range', () => {
      const colour = new Colour(2,-1,0.5,3)
        , hex = colour.hex

      assert.equal( hex, '#ff0080' )
    })
  })


  describe('.toCSS', () => {
    it('rgba', () => {
      const colour = new Colour()
      colour.set('yellow').setAlpha( 0.5 )
      const result = colour.toCSS('rgba')
      assert.equal( result, 'rgba(255,255,0,0.50)')
    })

    it('rgba ( no alpha )', () => {
      const colour = new Colour()
      colour.set('yellow')
      const result = colour.toCSS('rgba')
      assert.equal( result, 'rgb(255,255,0)')
    })

    it('hex', () => {
      const colour = new Colour()
      colour.set('yellow')
      const result = colour.toCSS('hex')
      assert.equal( result, '#ffff00')
    })

    it('unclamped', () => {
      const colour = new Colour()
      colour.set('yellow')
      colour.value = 2.0
      const result = colour.toCSS('unclamped')
      assert.equal( result, 'rgba(510,510,0,1.00)')
    })
  })


  describe('setHSL', () => {
    it('from numbers', () => {
      const colour = new Colour()
      colour.setHSL( 1/6, 1, 0.5 )
      assert.equal( colour.hex, '#ffff00' )
    })

    it('from array of numbers', () => {
      const colour = new Colour()
      colour.setHSL( [1/6, 1, 0.5] )
      assert.equal( colour.hex, '#ffff00' )
    })

    it('from strings', () => {
      const colour = new Colour()
      colour.setHSL( '60deg', '100%', '50%' )
      assert.equal( colour.hex, '#ffff00' )
    })

    it('from array of strings', () => {
      const colour = new Colour()
      colour.setHSL( ['60deg', '100%', '50%'] )
      assert.equal( colour.hex, '#ffff00' )
    })
  })

  describe('setString', () => {
    it('from hsla()', () => {
      const colour = new Colour()
      colour.setString('hsla(262, 54%, 31%,65%)')
      assert.equal( colour.hex, '#44247a' )
      assert.equal( colour.alpha, 0.65 )

      colour.setString('hsla(262, 0%, 50%,65%)')
      assert.equal( colour.hex, '#808080' )
      assert.equal( colour.alpha, 0.65 )
    })

    it('from rgba()', () => {
      const colour = new Colour()
      colour.setString('rgba(255, 50%, 25%, 65%)')
      assert.equal( colour.hex, '#ff8040' )
      assert.equal( colour.alpha, 0.65 )
    })

    it('from rgb()', () => {
      const colour = new Colour()
      colour.setString('rgb(255, 50%, 25%)')
      assert.equal( colour.hex, '#ff8040' )
    })

    it('from 6-digit hex', () => {
      const colour = new Colour()
      colour.setString('#ff8040')
      assert.equal( colour.hex, '#ff8040' )
    })

    it('from 3-digit hex', () => {
      const colour = new Colour()
      colour.setString('#f84')
      assert.equal( colour.hex, '#ff8844' )
    })

    it('from \'transparent\'', () => {
      const colour = new Colour()
      assert.equal( colour.alpha, 1 )
      colour.setString('transparent')
      assert.equal( colour.alpha, 0 )
    })
  })


  xdescribe('.toObject', () => {

  })
})
