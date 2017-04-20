const expect = require('chai').expect;
const runner = require('../../../src/runner');
const parseJS = require('../parse-js');
const statelessMatcher = require('../../../src/matchers/react-stateless');

const stateless1 = `
const MyComponent = () => (
  <div>
  </div>
);`;

const nonStateless1 = `const aFunction = () => true;`;

describe('react-stateless', () => {
  it('should find MyComponent', () => {
    expect(runner(parseJS(stateless1), [
      statelessMatcher,
    ]).features).to.eql([
      {
        end: 5,
        start: 2,
        type: 'class',
        methods: [],
        metadata: {
          react: true,
          stateless: true,
        },
        jsDoc: {
          description: '',
          tags: [],
        },
        name: 'MyComponent',
        superClass: null,
      },
    ]);
  });

  it('should not find regular functions', () => {
    expect(runner(parseJS(nonStateless1), [
      statelessMatcher,
    ]).features).to.eql([]);
  });
});
