'use strict'

const _ = require('lodash')
    , path = require('path')
    , glob = require('glob').sync
    , mapSeries = require('promise-map-series')

const deepcolour = require('../index')
    , Canvas = deepcolour.Canvas
    , Colour = deepcolour.Colour


const examples = exports

exports.Canvas = Canvas
exports.Colour = Colour

function now() {
  return new Date().getTime()
}

var runningAll
  , runQueue = []

examples.newCanvas = function () {
  return new Canvas( 256, 256 )
}

examples.resolveOutput = path.resolve.bind( path, __dirname, 'output' )
examples.resolveInput  = path.resolve.bind( path, __dirname, 'input' )

examples.run = function ( filename, example ) {
  const name = path.parse( filename ).name

  const canvas = examples.newCanvas()
      , outputFile = examples.resolveOutput( `${name}.png` )

  if ( runningAll )
    runQueue.push( runForReal )
  else
    return runForReal()

  function runForReal() {
    var generateTime = now()
      , saveTime
    return Promise.resolve( example( canvas ) )
    .then( () => {
      generateTime = now() - generateTime
      console.log(`generated example ${name} in ${generateTime}ms`)
      saveTime = now()
      return canvas.savePNG( outputFile )
    })
    .then( () => {
      saveTime = now() - saveTime
      console.log(`saved ${outputFile} in ${saveTime}ms`)
    })
  }
}

examples.inputs = function () {
  const inputs = _.flatten( arguments )
  const result = {}

  console.log('inputs', inputs )

  return mapSeries( inputs, ( input ) => {
    const filename = examples.resolveInput( input )
        , name = path.parse( input ).name

    return deepcolour.load( filename )
    .then( ( canvas ) => { result[name] = canvas } )
  } )
  .then( () => result )
}

examples.runAll = function () {
  const ourName = path.parse( __filename ).name

  runningAll = true

  glob( path.resolve( __dirname, '*.js' ) )
  .map( ( file ) => path.parse( file ).name )
  .filter( ( name ) => name != ourName )
  .map( ( name ) => require(`./${name}`) )

  return mapSeries( runQueue, ( runForReal ) => runForReal() )
}

if ( require.main == module ) {
  examples.runAll()
}
