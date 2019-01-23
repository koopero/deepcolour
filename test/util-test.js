const util = require('../src/util')
const assert = require('chai').assert

describe('util', () => {
  describe('clampValue', () => {
    it('works', () => {
      assert.deepEqual( util.clampValue( 0 ), 0 )
      assert.deepEqual( util.clampValue( 0.5 ), 0.5 )
      assert.deepEqual( util.clampValue( 1.5 ), 1 )
      assert.deepEqual( util.clampValue( 1 ), 1 )
      assert.deepEqual( util.clampValue( -1 ), 0 )
    })
  })

  describe('parseCSSHue', () => {
    it('works', () => {
      assert.deepEqual( util.parseCSSHue( 0 ), 0 )
      assert.deepEqual( util.parseCSSHue( 0.5 ), 0.5 )
      assert.deepEqual( util.parseCSSHue( '300 deg' ), 5/6 )
      assert.deepEqual( util.parseCSSHue(), NaN )
      assert.deepEqual( util.parseCSSHue( '90' ), 0.25 )
    })
  })

  describe('parseCSSValue', () => {
    it('works', () => {
      assert.deepEqual( util.parseCSSValue( 0 ), 0 )
      assert.deepEqual( util.parseCSSValue( 1.5 ), 1.5 )
      assert.deepEqual( util.parseCSSValue( '255' ), 1 )
      assert.deepEqual( util.parseCSSValue( '0' ), 0 )
      assert.deepEqual( util.parseCSSValue(), NaN )
    })
  })

  describe('parseCSSAlpha', () => {
    it('works', () => {
      assert.deepEqual( util.parseCSSAlpha( 0 ), 0 )
      assert.deepEqual( util.parseCSSAlpha( 1.5 ), 1.5 )
      assert.deepEqual( util.parseCSSAlpha( '100%' ), 1 )
      assert.deepEqual( util.parseCSSAlpha( '50%' ), 0.5 )
      assert.deepEqual( util.parseCSSAlpha( '0.25' ), 0.25 )
      assert.deepEqual( util.parseCSSAlpha( '0' ), 0 )
      assert.deepEqual( util.parseCSSAlpha(), NaN )
    })
  })
})