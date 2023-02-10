
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./sui-sdk.cjs.production.min.js')
} else {
  module.exports = require('./sui-sdk.cjs.development.js')
}
