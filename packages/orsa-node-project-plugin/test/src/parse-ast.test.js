/* eslint consistent-return: 0 */
const expect = require('chai').expect;
const astParser = require('../../src/parse-ast');

const jsSample = `
const fs = require('fs');
module.exports = (fname) => fs.readFileSync(fname).toString();
`;

const badJSSample = `
foozbar!!
`;

describe('javascript ast parsing', () => {
  it('should parse js', () => {
    expect(astParser('crazy-train', {
      fs: {
        readFileSync: () => jsSample,
      },
    }).ast).to.not.be.null;
  });

  it('should error on bad js', () => {
    expect(astParser('crazy-train', {
      fs: {
        readFileSync: () => badJSSample,
      },
    }).error).to.not.be.null;
  });
});
