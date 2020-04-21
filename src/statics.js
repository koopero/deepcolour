module.exports = 
function addMixin( space ) {

  function wrapMathProp( key ) {
    return function() {
      let result = new space()
      for ( let index = 0; index < arguments.length; index ++ ) {
        if ( index == 0 )
          result.setArguments( [arguments[index]], true )
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
  space.mix = function( A, B, C ) {
    A = new space( A )
    B = new space( B )
    C = new space( C )
    A.mix( B, C )
    return A 
  }

  return space
}