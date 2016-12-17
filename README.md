[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

`deepcolour` is a simple colour library for node.js.

# Features

* All Colour values unclamped and normalized to [ 0 - 1 ].
* Most operations are in-place. Lots of mutation.


# Examples

## Colour
``` javascript
const deepcolour = require('deepcolour')
    , Colour = deepcolour.Colour

const colour = new Colour(1,0,0,1)

console.log( colour.toHexString() )
// #ff0000

// make colour cyan by shifting hue
colour.hue = 0.5

console.log( colour.toHexString() )
// #00ffff

// Set the colour with a string
colour.set('white')

// Retrieve value and saturation
console.log( colour.value, colour.saturation )
// 1,0
```
