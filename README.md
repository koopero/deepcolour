A simple colour and canvas library for node.js.

# Features

* Unclamped RGBA values with range of [0-1]

# Examples

## Loading PNG file
``` javascript
const deepcolour = require('deepcolour')
    , inputFile = 'input.png'

deepcolour.load( inputFile )
.then( ( canvas ) => {
  console.log(`Loaded ${inputFile} - ${canvas.width}x${canvas.height}`)

  // Set the top-left pixel to red
  canvas.pixel( 0, 0 ).setHSV(0,1,1)

  return canvas.savePNG( outputFile )
  .then( () => {
    console.log(`Saved ${canvas.size} pixels to ${outputFile}`)
  })
})
```

## Generating PNG
``` javascript
const deepcolour = require('deepcolour')
    , Canvas = deepcolour.Canvas
    , outputFile = 'output.png'

// Create a canvas 64 pixels wide and 32 pixels high
const canvas = new Canvas( 64, 32 )

// Set the background to opaque blue
canvas.set( [0,0,1,1] )

// Set the top left pixel to red
canvas.pixel(0,0).hue = 0

// Save the canvas as a PNG
return canvas.savePNG( outputFile )
.then( () => {
  console.log(`Saved ${canvas.size} pixels to ${outputFile}`)
})
```



# Limitations

`deepcolour` is optimized to be flexible and easy, rather than fast or efficient. Each pixel of a `Canvas` is stored as classy `Colour` object. This consumes many times more memory than conventional packed 32-bit pixels. *If you're working with more than a megapixel or so, this library probably isn't for you.*

# Project Status

This library is written to support projects for which I am on deadline.
Documentation, examples and such will need to wait until I have time, which
may be never.

In the mean time, see tests for examples.
