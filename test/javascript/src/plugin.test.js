const expect = require('chai').expect;
const runner = require('../../src/runner');
const parseJS = require('./parse-js');

describe('orsa js analyzer', () => {
  it('runner with no matchers should be a no-op', () => {
    expect(runner(parseJS(`
      import Foo from 'foo';
    `)).features).to.eql([]);
  });

  it('runner with a faulty matcher to return errors', () => {
    expect(runner(parseJS(`
      import Foo from 'foo';
    `), [
      () => {
        throw new Error('foo');
      },
    ]).errors.length).to.eql(5);
  });
});
