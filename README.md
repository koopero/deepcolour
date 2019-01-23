[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

`deepcolour` is a stateful library for the parsing, processing and formatting of RGBA colours.

# Features

* All Colour values **unclamped** and normalized to `0-1`.
* Most operations are **in-place**.
* Stateful **HSV** properties.  
* Conversion to and from **CSS**.

# Example

``` javascript
const Colour = require('deepcolour')

let colour = new Colour(1,0,0,1)

console.log( colour.hex )
// #ff0000

// make colour cyan by shifting hue
colour.hue = 0.5

console.log( colour.hex )
// #00ffff

// Set the colour with a string
colour.set('white')

// Retrieve value and saturation
console.log( colour.value, colour.saturation )
// 1,0
```

# API

## Number Properties

* **red** : RGB red value.
* **green** : RGB green value.
* **blue** : RGB blue value.
* **alpha** : Alpha value.
* **hue** : HSV hue. The range of the HSV colour circle is `0-1`. See [Hue Preservation](#hue-preservation).
* **saturation** : HSV saturation.
* **value** : HSV value.

## String Properties

* **hex** : CSS hexadecimal color. `#112233`
* **css** : CSS color. If the colour can be represented as a hexadecimal color, `hex` will be returned. Otherwise a CSS `rgb()` or `rgba()` will be returned.

## Set Methods

All methods beginning with set may be chained together.

**set** *( anything )* Safely calls other set function based on type.

**setDefault** *()* Sets the colour to opaque black, `[0,0,0,1]`.

**setArguments** *( arguments )* Sets from an arguments object. The following formats are supported:
* `( [ red [, green [, blue, [, alpha ] ] ] )`
* `( 'string' [, alpha ] )`

**set8BitArray** *( Array-like )*
Set from an array of numbers in the range 0-255. Up to four values will be read, in the order RGBA. This method will also work for slices of `Buffer` objects, allowing it to work with image libraries such as [png-js](https://www.npmjs.com/package/pngjs). *Throws error on invalid input.*

**setRGB** *( Number, Number, Number )* Sets red, green and blue values. If non-numeric values are passed, existing values are preserved.

**setHSV** *( Number, Number, Number )* Sets hue, saturation and value values. If non-numeric values are passed, existing values are preserved.

**setKeys** *( object )* Sets properties from an object. The following keys are supported: `['red','r','green','g','blue','b','alpha','a','hue','h','saturation','sat','s','value','v','hex','css']`

**setAlpha** *( Number )* Set alpha value.

**setRandom** *()* Set red, green and blue to random values in standard range.

**setChannel** *( index, Number)* Set the channel `index` to a value.

**setChannelHex** *( index, string )* Set the channel `index` to a hexadecimal value. The string may be 1 or 2 digits.

## Output Methods

**toString** *()* Alias for **toCSSUnclamped**

**toHexString** *()* `'#ff00ff'` CSS hex, clamped with no alpha. 

**toRGBA** *()* `[1,0,1,1]` Raw values.

**toObject** *()* `{ r: 1, g: 0, b: 1, a: 1}` Raw values.

**toBuffer** *()* `Buffer.from([255,0,255,255])` Clamped, 8-bit values.

**to8BitArrays** *( length )* `[255,0,255,255]` Clamped, 8-bit values.

**toHexChannels** *( 'rgbahsv' )* `'ff00ffd4ffff'` Clamped, 8-bit values from RGB and HSV as hex.

**toCSS** *( format = 'auto' | 'rgba' | 'hex' | 'unclamped' )* CSS in given strign format.

**toCSSRGBA** *()* `'rgb(255,0,255)'` Clamped, 8-bit values with auto adding alpha.

**toCSSUnclamped** *()* `'rgba(255,0,255,1)'` Clamped, 8-bit values with auto adding alpha.





## Other Methods

* **isBlack** *() -> bool* `red == 0 && green == 0 && blue == 0`
* **isGray** *() -> bool* `red == green == blue`


# Hue Preservation

In [HSV & HLS](https://en.wikipedia.org/wiki/HSL_and_HSV) colour spaces, hue and saturation can be invalid when the colour is grey or black. In purely functional colour conversions, this results in `saturation` being lost when `value == 0` and `hue` being lost when `saturation == 0`. This is particularly annoying in stateful system, where `value` or `saturation` are being modulated.

`deepcolour` compensates for this by holding `hue` and `saturation` values.

``` js
// Initialize a new Colour
let colour = new Colour('green')
assert.equal( colour.hue, 1/3)

// Set the colour to black
colour.value = 0
assert( colour.isBlack() )

// Since it does not matter when value is 0,
// hue is preserved.
assert.equal( colour.hue, 1/3)

// We can set the hue, as well.
colour.hue = 1/6

// Colour is still black
assert( colour.isBlack() )

// But the hue is preserved
assert.equal( colour.hue, 1/6)

// Set the colour back to full intensity
colour.value = 1

// Is now yellow
assert.equal( colour.hex, '#ffff00' )
```


# Vectors

By default `deepcolour` creates a colour space with `rgba` properties. The library can also be used to create and manipulate arbitrary vector spaces, with or without colour properties.

## No Colour Vectors

``` js
const { Space } = require('deepcolour')
const Vector = Space({
  rgba: false,
  channels: 'xyz'
})

let vec = Vector.add( [ 1, 0, 0 ], { y: 0.5 } )
assert.deepEqual( vec.toArray(), [ 1, 0.5, 0 ] )
```
