const util = require('./util')


module.exports =
function baseClass( options ) {
  const LENGTH = options.length

  const keys = Object.assign( {}, options.keys )
  options.channels.forEach( ( key, index ) => {
    keys[key] = index
  })

  class Vector {
    constructor() {
      this.setDefault()
      this.setArguments( arguments )
    }

    clone() {
      const space = this.space
      const clone = new space()

      this.eachChannel( function ( v, c ) {
        clone[c] = v
      } )

      return clone
    }

    //
    // Channels
    //

    channelIndex( channel ) {
      let index = parseInt( channel )
      if ( !isNaN( index ) )
        return index

      if ( channel in this.keys )
        return this.keys[channel]
      
      return -1
    }

    eachChannel( callback ) {
      for ( var c = 0; c < LENGTH; c++ ) {
        var result = callback.call( this, this[c], c )
        result = parseFloat( result )
        if ( !isNaN( result ) )
          this[c] = result
      }
    }
   
    //
    // Setters
    //

    set( ob ) {
      if ( this.space.isColour( ob ) || Array.isArray( ob ) ) {
        this.eachChannel( ( v, c ) => ob[c] )

        return this
      }

      if ( 'string' == typeof ob )
        return this.setString( ob )

      if ( global.Buffer && Buffer.isBuffer( ob ) )
        return this.set8BitArray( ob )

      if ( ob !== null && ob !== undefined ) {
        return this.setKeys( ob )
      }

      return this
    }


    setDefault() {
      this.eachChannel( ( v, i ) => options.defaults[i] )

      return this
    }

    setArguments( args, fill = null ) {
      var argChannel = 0
      for ( var argI = 0; argI < args.length; argI++ ) {
        var arg = args[argI]
        if ( 'number' == typeof arg ) {
          this.setChannelSafe( argChannel++, arg )
        } else if ( 'string' == typeof arg ) {
          this.setString( arg )
          // argChannel = 4
        } else if ( 'undefined' !== typeof arg ) {
          this.set( arg )
        }
      }

      if ( fill == true || fill === null )
        while( argChannel && argChannel < LENGTH ) {
          if ( fill == true || !this.space.options.defaults[argChannel] ) {
            this.setChannelSafe( argChannel, this[argChannel-1] )
          }
          argChannel ++
        }

      return this
    }

    setKeys( ob ) {
      if ( 'object' == typeof ob )
        for ( let key in ob ) {
          let channel = this.channelIndex( key )
          if ( channel != -1 )
            this.setChannelSafe( channel, ob[key] )
        }

      return this
    }

    set8BitArray( input, offset = 0 ) {
      if ( !input || 'number' != typeof input.length )
        throw new Error('Expected input to be array-like.')

      for ( let index = 0; index < input.length; index ++ )
        if ( offset + index < LENGTH )
          this.setChannelHex( offset + index, input[index] )

      return this
    }

    setChannel( channel, value ) {
      channel = this.channelIndex( channel )

      if ( channel < 0 || channel >= LENGTH )
        throw new Error('Invalid channel')

      value = parseFloat( value )
      if ( !isNaN( value ) )
        this[channel] = value

      return this
    }

    setChannelSafe( channel, value ) {
      channel = this.channelIndex( channel )

      if ( channel < 0 || channel >= LENGTH )
        return this 

      value = parseFloat( value )
      if ( !isNaN( value ) )
        this[channel] = value

      return this
    }

    setChannelHex( channel, value ) {
      if ( 'string' == typeof value ) {
        if ( !value.length || value.length > 2 )
          throw new Error('Invalid hex value input' )

        if ( value.length < 2 )
          value = value + value
    
        value = parseInt( value, 16 )      
      } 

      if ( 'number' != typeof value ) 
        throw new Error('Invalid input')

      value /= 255

      return this.setChannel( channel, value )
    }


    //
    // Getters
    //

    getChannel( channel ) {
      let index = this.channelIndex( channel )
      if ( index >= 0 && index < LENGTH )
        return this[index]
      
      throw new Error(`Invalid channel ${channel}`)
    }

    toString() {
      return this.toArray().join(',')
    }

    valueOf() {
      return this.toArray()
    }

    inspect() {
      return this.toString()
    }

    //
    //
    //

    toHexString( digits = 3 ) {
      var result = '#'
      for ( var c = 0; c < digits; c ++ )
        result += util.valueToHex( this[c] )

      return result
    }

    toHexChannels( channels ) {
      let result = ''

      if ( 'undefined' == typeof channels )
        channels = this.channels

      if ( 'string' == typeof channels )
        channels = channels.split('')

      if ( !Array.isArray( channels ) )
        throw new Error('channels must be string or array')

      for ( let i = 0; i < channels.length; i ++ ) {
        let value = this.getChannel( channels[i] )
        value = util.valueToHex( value )
        result += value
      }

      return result
    }


    toObject( keys ) {
      if ( 'undefined' == typeof keys )
        keys = this.channels

      if ( 'string' == typeof keys )
        keys = keys.split('')

      if ( !Array.isArray( keys ) )
        throw new Error('keys must be array')

      const result = {}

      keys.forEach( ( key ) => {
        result[key] = this.getChannel( key )
      })

      return result
    }

    toBuffer( length ) {
      length = parseInt( length )
      if ( isNaN( length ) )
        length = LENGTH

      if ( length < 0 || length > LENGTH )
        throw new Error( 'Invalid length' )

      const buffer = Buffer.alloc( length )

      for ( var c = 0; c < length; c++ )
        buffer.writeUInt8( this.getChannel8Bit( c ), c )

      return buffer
    }

    toArray( length ) {
      length = parseInt( length )
      if ( isNaN( length ) )
        length = LENGTH

      if ( length < 0 || length > LENGTH )
        throw new Error( 'Invalid length' )

      const array = new Array( length )
      for ( var c = 0; c < length; c++ )
        array[c] = this.getChannel( c )

      return array
    }

    to8BitArray( length ) {
      length = parseInt( length )
      if ( isNaN( length ) )
        length = LENGTH

      if ( length < 0 || length > LENGTH )
        throw new Error( 'Invalid length' )

      const array = new Array( length )
      for ( var c = 0; c < length; c++ )
        array[c] = this.getChannel8Bit( c )

      return array
    }

    //
    // Checkers
    //
    isNormal() {
      for ( let index = 0; index < LENGTH; index ++ ) {
        let value = this.getChannel( index )
        if ( value < 0 || value > 1 )
          return false
      }
      
      return true
    }

    //
    // Composite operators
    //

    add() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      this.eachChannel( ( value, channel ) => value + b[channel] )
      return this
    }

    subtract() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      this.eachChannel( ( value, channel ) => value - b[channel] )
      return this
    }

    multiply() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      this.eachChannel( ( value, channel ) => value * b[channel] )
      return this
    }

    divide() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      this.eachChannel( ( value, channel ) => value / b[channel] )
      return this
    }

    min() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      this.eachChannel( ( value, channel ) => Math.min( value, b[channel] ) )
      return this
    }

    max() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      this.eachChannel( ( value, channel ) => Math.max( value, b[channel] ) )
      return this
    }

    mix( B, C = 1.0 ) {
      let A = this
      B = new( this.space )( B )
      C = new( this.space )( C )
      this.eachChannel( ( value, channel ) => (value * (1-C[channel]))+(B[channel]*C[channel]) )
      return this
    }

    //
    // Combine-channel vector operations.
    //

    rotate2D( channels, degrees = 0.0, centre = 0.0 ) {
      const { PI, sin, cos } = Math
      let unit = PI / 180

      if ( !channels || channels.length != 2 )
        throw new Error('Must specify two channels.')


      centre = new (this.space)( centre )

      let ix = this.getChannel( channels[0] )
      let iy = this.getChannel( channels[1] )
      let cx = centre.getChannel( channels[0] )
      let cy = centre.getChannel( channels[1] )
      ix -= cx
      iy -= cy
      let ang = degrees * unit
      let sn = sin( ang )
      let cs = cos( ang )

      let ox = cs * ix - sn * iy
      let oy = sn * ix + cs * iy
      ox += cx
      oy += cy

      this.setChannel( channels[0], ox )
      this.setChannel( channels[1], oy )

      return this
    }

    distance( channels, other = 0.0 ) {
      channels = channels || options.channels
      
      other = new (this.space)( other )
      let result = 0
      for ( let index = 0; index < channels.length; index ++ ) {
        let channel = channels[index]
        let value = this.getChannel( channel )
        value -= other.getChannel( channel )
        value = value * value
        result += value
      }

      result = Math.sqrt( result )
      return result
    }

    equal() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      let equal = true
      this.eachChannel( ( value, channel ) => equal = equal && value == b[channel] )
      return equal
    }

    extent() {
      return Math.sqrt( this.extentSquare() )
    }

    extentSquare() {
      let result = 0
      this.eachChannel( ( value ) => result += value * value )
      return result
    }

    //
    // Misc Internal
    // 

    _deriveHueSat() {
      // Blank, for overloading in HSV space.
    }
  }

  Vector.prototype.keys = keys

  return Vector
}