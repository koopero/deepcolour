[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

`deepcolour` is a simple colour and bitmap library for node.js, designed for generative pixel art.

# Features

* All Colour values unclamped and normalized to [ 0 - 1 ].
* Simple composite operators.
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

## Canvas

### Generating a PNG
``` javascript
const deepcolour = require('deepcolour')
    , Canvas = deepcolour.Canvas
    , outputFile = 'output.png'

// Create a canvas 64 pixels wide and 32 pixels high
const canvas = new Canvas( 64, 32 )

// Set the background to opaque blue
canvas.set( [0,0,1,1] )

// Set the top left pixel to red
canvas.colour(0,0).hue = 0

// Save the canvas as a PNG
return canvas.savePNG( outputFile )
.then( () => {
  console.log(`Saved ${canvas.size} pixels to ${outputFile}`)
})
```

### Loading PNG file
``` javascript
const deepcolour = require('deepcolour')
    , inputFile = 'input.png'

deepcolour.load( inputFile )
.then( ( canvas ) => {
  console.log(`Loaded ${inputFile} - ${canvas.width}x${canvas.height}`)

  // Set the top-left pixel to red
  canvas
  .colour( canvas.width - 1, canvas.height - 1 )
  .setHSV(0,1,1)

})
```



### Other examples
Clone this module from git and run `'./example/examples.js'` to generate a few more examples.

# Limitations

`deepcolour` is optimized to be flexible and easy, rather than fast or efficient. Each pixel of a `Canvas` is stored as classy `Colour` object. This consumes many times more memory than conventional packed 32-bit pixels. As well, operations such as `composite` will block the application. *If you're working with more than a megapixel or so, this library probably isn't for you.*

# Project Status

This library is written to support projects for which I am on deadline.
Documentation, examples and such will need to wait until I have time, which
may be never.
