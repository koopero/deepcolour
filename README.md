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



## Other Methods

* **isBlack** *() -> bool* `red == 0 && green == 0 && blue == 0`
* **isGray** *() -> bool* `red == green == blue`


# Hue Preservation

In [HSV & HLS](https://en.wikipedia.org/wiki/HSL_and_HSV) colour spaces, hue and saturation can be invalid when the colour is grey or black. In purely functional colour conversions, this results in `saturation` being lost when `value == 0` and `hue` being lost when `saturation == 0`. This is particularly annoying in stateful system, where `value` or `saturation` are being modulated.

`deepcolour` compensates for this by holding `hue` and `saturation` values.
