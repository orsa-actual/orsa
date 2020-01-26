const fs = require('fs');
const astParser = require('../../src/utilities/ast-parser');

jest.mock('fs');

module.exports = (js) => {
  fs.readFileSync.mockImplementation(() => js);
  return astParser('foo').ast;
};
