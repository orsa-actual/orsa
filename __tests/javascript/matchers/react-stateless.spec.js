const parseJS = require('../parse-js');
const runner = require('../../../src/javascript/runner');
const statelessMatcher = require('../../../src/javascript/matchers/react-stateless');

const stateless1 = `
const MyComponent = () => (
  <div>
  </div>
);`;

const stateless1TS = `
type CompProps = {
  title: string,
}

const MyComponent = ({ title }: CompProps) => (
  <div>
    {title}
  </div>
);`;

const nonStateless1 = 'const aFunction = () => true;';

describe('react-stateless', () => {
  it('should find MyComponent in TS', () => {
    expect(runner(parseJS(stateless1TS, 'foo.ts'), [
      statelessMatcher,
    ]).features).toEqual([
      {
        end: 10,
        start: 6,
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

  it('should find MyComponent', () => {
    expect(runner(parseJS(stateless1), [
      statelessMatcher,
    ]).features).toEqual([
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
    ]).features).toEqual([]);
  });
});
