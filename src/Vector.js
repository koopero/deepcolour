const util = require('./util')


module.exports =
function baseClass( options ) {
  const LENGTH = options.length

  const keys = {}
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

      if ( ob === null || ob == undefined )
        return this

      if ( this.space.isColour( ob ) || Array.isArray( ob ) ) {
        this.eachChannel( ( v, c ) => ob[c] )

        return this
      }

      if ( 'string' == typeof ob )
        return this.setString( ob )

      if ( global.Buffer && Buffer.isBuffer( ob ) )
        return this.set8BitArray( ob )

      if ( ob !== null ) {
        return this.setKeys( ob )
      }

      return this
    }


    setDefault() {
      this.eachChannel( ( v, i ) => options.defaults[i] )

      return this
    }

    setArguments( args, fill = false ) {
      var argChannel = 0
      for ( var argI = 0; argI < args.length; argI++ ) {
        var arg = args[argI]
        if ( 'number' == typeof arg ) {
          this.setChannel( argChannel++, arg )
        } else if ( 'string' == typeof arg ) {
          this.setString( arg )
          argChannel = 3
        } else if ( 'undefined' !== typeof arg ) {
          this.set( arg )
        }
      }

      while( fill && argChannel && argChannel < LENGTH ) {
        this.setChannel( argChannel, this[argChannel-1] )
        argChannel ++
      }

      return this
    }

    setKeys( ob ) {
      if ( 'object' == typeof ob )
        for ( let key in ob ) {
          let channel = this.keys[key]
          if ( channel != -1 )
            this.setChannel( channel, ob[key] )
        }

      return this
    }

    set8BitArray( input ) {
      if ( !input || 'number' != typeof input.length )
        throw new Error('Expected input to be array-like.')

      this.eachChannel( ( value, c ) => input[c] / 255 )
      return this
    }

    setChannel( channel, value ) {
      channel = parseInt( channel ) || 0
      if ( channel < 0 || channel >= LENGTH )
        throw new Error('Invalid channel')

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
        throw new Error('Invalid input' )

      value /= 255

      return this.setChannel( channel, value )
    }


    //
    // Getters
    //

    channelIndex( channel ) {
      let index = parseInt( channel )
      if ( !isNaN( index ) )
        return index

      if ( channel in this.keys )
        return this.keys[channel]
      
      return -1
    }

    getChannel( channel ) {
      let index = this.channelIndex( channel )
      if ( index >= 0 && index < LENGTH )
        return this[index]
      
      throw new Error(`Invalid channel ${channel}`)
    }



    toString() {
      return this.toCSSUnclamped()
    }

    valueOf() {
      return this.toCSSUnclamped()
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

      channels = channels || 'rgb'
      if ( 'string' != typeof channels )
        throw new Error('channels must be string')

      for ( let i = 0; i < channels.length; i ++ ) {
        let value = this.getChannel( channels[i] )
        value = util.valueToHex( value )
        result += value
      }

      return result
    }

    toRGBA() {
      return [
        this[0],
        this[1],
        this[2],
        this[3]
      ]
    }

    toObject( keys ) {
      if ( !keys )
        keys = [ 'r','g','b','a' ]

      if ( !Array.isArray( keys ) )
        throw new Error('keys must be array')

      const result = {}

      keys.forEach( ( key ) => {
        result[key] = this.channelByName( key )
      })

      return result
    }

    toBuffer( length ) {
      length = parseInt( length )
      if ( isNaN( length ) )
        length = 4

      if ( length < 0 || length > 4 )
        throw new Exception( 'Invalid length' )

      const buffer = Buffer.alloc( length )

      for ( var c = 0; c < length; c++ )
        buffer.writeUInt8( this.getChannel8Bit( c ), c )

      return buffer
    }

    to8BitArray( length ) {
      length = parseInt( length )
      if ( isNaN( length ) )
        length = 4

      if ( length < 0 || length > 4 )
        throw new Exception( 'Invalid length' )

      const array = new Array( length )
      for ( var c = 0; c < length; c++ )
        array[c] = this.getChannel8Bit( c )

      return array
    }


    //
    // Composite operators
    //
    mix( b, amount ) {
      amount = util.parseAmount( amount )
      // b = util.parseColour( b )
      this.eachChannel( ( value, channel ) =>
        value * ( 1 - amount ) + b[channel] * amount
      )
    }

    add() {
      let b = new (this.space)()
      b.setArguments( arguments )
      this.eachChannel( ( value, channel ) => value + b[channel] )
      return this
    }

    multiply() {
      let b = new (this.space)()
      b.setArguments( arguments, true )
      this.eachChannel( ( value, channel ) => value * b[channel] )
      return this
    }


  }

  Vector.prototype.keys = keys

  return Vector
}