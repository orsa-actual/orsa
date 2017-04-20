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

const badJSSample2 = `
const fs = require('fs');
import foo from 'foo';
const {a} = require('painted-dogs');

const a = fs();

class Foo extends AnotherThing {
  constructor() {
  }

  get pi() {
    return 3.14;
  }

  foo(a, b) {
    return 1;
  }
}
`;

describe('javascript ast parsing', () => {
  it('should parse js', () => {
    expect(astParser(null)).to.be.null;
  });

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

  it('should error on bad js', () => {
    expect(astParser('crazy-train', {
      fs: {
        readFileSync: () => badJSSample2,
      },
    }).error).to.not.be.null;
  });
});
