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
    if ( options.getters )
      prop.get = function() {
        return this.getChannel( index )
      }

    if ( options.setters ) {
      let parser = parsers[key] || parsers.default
      prop.set = function( value ) {
        value = parser( value )
        return this.setChannel( index, value )
      }
    }

    Object.defineProperty( space.prototype, key, prop )
  }

  return space
}
