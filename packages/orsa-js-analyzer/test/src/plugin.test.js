const expect = require('chai').expect;
const runner = require('../../src/runner');
const parseJS = require('./parse-js');

describe('orsa js analyzer', () => {
  it('runner with no matchers should be a no-op', () => {
    expect(runner(parseJS(`
      import Foo from 'foo';
    `))).to.eql([]);
  });
});
