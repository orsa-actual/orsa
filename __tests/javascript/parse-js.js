const fs = require('fs');
const astParser = require('../../src/utilities/ast-parser');

jest.mock('fs');

module.exports = (js, name = 'foo.js') => {
  fs.readFileSync.mockImplementation(() => js);
  return astParser(name).ast;
};
