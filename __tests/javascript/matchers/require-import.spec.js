const parseJS = require('../parse-js');
const runner = require('../../../src/javascript/runner');
const requireMatcher = require('../../../src/javascript/matchers/require-import');

const require1 = `
const foo = require('bar');
`;

const require2 = `
const { foo } = require('bar');
`;

const nonRequire = `
consoel.log('bar');
`;

const noVariableRequire = `
require('baz');
`;

describe('require-import', () => {
  it('should find a require', () => {
    expect(runner(parseJS(require1), [
      requireMatcher,
    ]).features).toEqual([
      {
        end: 2,
        start: 2,
        type: 'import',
        keys: [
          'foo',
        ],
        from: 'bar',
      },
    ]);
  });

  it('should find a destructured require', () => {
    expect(runner(parseJS(require2), [
      requireMatcher,
    ]).features).toEqual([
      {
        end: 2,
        start: 2,
        type: 'import',
        keys: [
          'foo',
        ],
        from: 'bar',
      },
    ]);
  });

  it('should not find other functions', () => {
    expect(runner(parseJS(nonRequire), [
      requireMatcher,
    ]).features).toEqual([]);
  });

  it('should not find a require with no variable set', () => {
    expect(runner(parseJS(noVariableRequire), [
      requireMatcher,
    ]).features).toEqual([
      {
        end: 2,
        start: 2,
        type: 'import',
        keys: [],
        from: 'baz',
      },
    ]);
  });
});
