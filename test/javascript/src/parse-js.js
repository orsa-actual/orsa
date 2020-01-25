/* eslint import/no-extraneous-dependencies: 0 */
const astParser = require('orsa-ast-parser');

module.exports = js => astParser('foo', {
  fs: {
    readFileSync: () => js,
  },
}).ast;
