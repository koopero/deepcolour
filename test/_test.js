const test = exports

const assert = require('chai').assert
    , path = require('path')


test.assert = assert
test.resolve = path.resolve.bind( path, __dirname )
