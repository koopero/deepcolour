const util = require('./util')

module.exports = 
function addMixin( space, options ) {
  const RGBA_OFFSET = options.rgba


  const keys = space.prototype.keys
  // console.log( { keys } )

  for ( let key in keys ) {
    let index = keys[key]

    if ( hasGetter( space.prototype, key ) )
      continue

    let prop = {}
    prop.get = function() {
      return this.getChannel( index )
    }

    prop.set = function( value ) {
      value = util.parseCSSValue( value )
      return this.setChannel( index, value )
    }

    // console.log('define', key, prop )

    Object.defineProperty( space.prototype, key, prop )
  }

  return space
}

function hasGetter( proto, key ) {
  return false
} 