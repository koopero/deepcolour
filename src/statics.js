const util = require('./util')

module.exports = 
function addMixin( space, options ) {

  function wrapMathProp( key ) {
    return function() {
      let result = new space()
      for ( let index = 0; index < arguments.length; index ++ ) {
        if ( index == 0 )
          result.set( arguments[index] )
        else 
          result[key]( arguments[index] )
      }
      return result
    }
  }

  space.add = wrapMathProp('add')
  space.subtract = wrapMathProp('subtract')
  space.multiply = wrapMathProp('multiply')
  space.divide = wrapMathProp('divide')
  space.min = wrapMathProp('min')
  space.max = wrapMathProp('max')

  return space
}