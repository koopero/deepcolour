function makeSpace( options ) {
  options = Object.assign( {
    rgba: 0,
    hsv: true,
    css: true,
    getters: true,
    setters: true,
  }, options )

  options.rgba = parseInt( options.rgba )
  let hasRGBA = !isNaN( options.rgba )

  if ( hasRGBA ) {
    /* istanbul ignore next */
    options.channels = options.channels || 'rgba'
    if ( 'undefined' == typeof options.defaults ) {
      options.defaults = []
      options.defaults[options.rgba+3] = 1
    }
  }

  // parse channels
  if ( 'string' == typeof options.channels )
    options.channels = options.channels.split('')
    
  if ( options.length ) {
    options.channels = options.channels.slice(0, options.length )
  } else {
    options.length = options.channels.length
  }

  // parse defaults
  options.defaults = options.defaults || 0
  let defaults = []
  for ( let index = 0; index < options.length; index ++ ) {
    defaults[index] = 'number' == typeof options.defaults 
      ? options.defaults
      : options.defaults && parseFloat( options.defaults[ index ] ) || 0
  }

  options.defaults = defaults

  // create space
  let space = require('./Vector')( options )
  if ( hasRGBA ) {
    space = require('./RGBA')( space, options ) 

    if ( false !== options.hsv )
      space = require('./HSV')( space, options ) 

    if ( false !== options.css )
      space = require('./CSS')( space, options ) 
  }

  if ( options.getters ) {
    space = require('./etters')( space, options )
  }

  space = require('./statics')( space, options )

  space.prototype.space = space
  space.prototype.length = options.length
  space.prototype.channels = options.channels
  space.options = options

  space.isColour = function ( object ) {
    return object instanceof space
  }
  
  space.equal = function() {
    const colour = new space()
    var str
    for ( var i = 0; i < arguments.length; i ++ ) {
      colour.set( arguments[i] )
      if ( !str )
        str = colour.toString()
      else if ( str != colour.toString() )
        return false
    }
  
    return true
  }

  return space
}


module.exports = makeSpace