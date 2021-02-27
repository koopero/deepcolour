/* eslint-env node, mocha */

const assert = require('chai').assert
const Colour = require('../index')

describe('composite', ()=> {

  describe('add', ()=> {
    it('will not clamp alpha, unfortunately', () => {
      let a = new Colour('#00ff00')
      let b = new Colour('#ff0000')
      let c = new Colour('#ffff00')
  
      a.add( b )
      // hex will only be RGB
      assert.equal( a.css, c.css )

      assert.equal( a.alpha, 2 )
    })

    it('alpha', () => {
      let a = new Colour('#00ff00')
      let b = new Colour('#ff0000',0)
      let c = new Colour('#ffff00')
  
      a.add( b )
      // hex will only be RGB
      assert.equal( a.css, c.css )
      assert.equal( a.alpha, 1 )
    })
  })

  describe('multiply', () => {
    it('will multiply by colour', () => {
      let value = new Colour('#ffff00')
      let mult  = new Colour('#0080ff')
      let done  = new Colour('#008000')

      value.multiply( mult )
      // hex will only be RGB
      assert.equal( value.css, done.css )
    
    })

    it('will multiply by number', () => {
      let value = new Colour('#ffff00')
      let mult  = 0.5
      value.multiply( mult )
      assert.equal( value.toHexChannels('rgba'), '80800080' )
    })
  })

})