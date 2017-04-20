const expect = require('chai').expect;
const runner = require('../../../src/runner');
const parseJS = require('../parse-js');
const createClassMatcher = require('../../../src/matchers/react-create-class');

const createClass1 = `
const MyComponent = React.createClass({
  render() {
    return (
      <div />
    );
  }
});
`;

const notReactCreateClass = `
const Foo = React.somethingElse({});
`;

describe('react-create-class', () => {
  it('should find MyComponent', () => {
    expect(runner(parseJS(createClass1), [
      createClassMatcher,
    ]).features).to.eql([
      {
        end: 8,
        start: 2,
        type: 'class',
        methods: [],
        metadata: {
          react: true,
        },
        jsDoc: null,
        name: 'MyComponent',
        superClass: null,
      },
    ]);
  });

  it('should not find regular functions', () => {
    expect(runner(parseJS(notReactCreateClass), [
      createClassMatcher,
    ]).features).to.eql([]);
  });
});
