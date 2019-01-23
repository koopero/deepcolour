const util = require('./util')

module.exports = 
function addMixin( space, options ) {
  const keys = space.prototype.keys

  const parsers = {
    default: util.parseCSSValue,
    'a': util.parseCSSAlpha,
    'alpha': util.parseCSSAlpha,
    'h': util.parseCSSHue,
    'hue': util.parseCSSHue,
  }


  for ( let key in keys ) {
    let index = keys[key]

    let prop = {}
    prop.get = function() {
      return this.getChannel( index )
    }

    let parser = parsers[key] || parsers.default
    prop.set = function( value ) {
      value = parser( value )
      return this.setChannel( index, value )
    }

    // console.log('define', key, prop )

    Object.defineProperty( space.prototype, key, prop )
  }

  return space
}
