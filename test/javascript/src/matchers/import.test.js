const expect = require('chai').expect;
const runner = require('../../../src/runner');
const parseJS = require('../parse-js');
const importMatcher = require('../../../src/matchers/import');

const import1 = `
import Foo from 'bar';
`;

const import2 = `
import Foo, { Baz, } from 'bar';
`;

const import3 = `
import { Baz, } from 'bar';
`;

describe('import', () => {
  it('should find imports with one key', () => {
    expect(runner(parseJS(import1), [
      importMatcher,
    ]).features).to.eql([
      {
        end: 2,
        from: 'bar',
        keys: [
          'Foo',
        ],
        start: 2,
        type: 'import',
      },
    ]);
  });

  it('should find imports with one key and destructured', () => {
    expect(runner(parseJS(import2), [
      importMatcher,
    ]).features).to.eql([
      {
        end: 2,
        from: 'bar',
        keys: [
          'Foo',
          'Baz',
        ],
        start: 2,
        type: 'import',
      },
    ]);
  });

  it('should find imports with one destructured', () => {
    expect(runner(parseJS(import3), [
      importMatcher,
    ]).features).to.eql([
      {
        end: 2,
        from: 'bar',
        keys: [
          'Baz',
        ],
        start: 2,
        type: 'import',
      },
    ]);
  });
});
