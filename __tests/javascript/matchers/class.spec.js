const parseJS = require('../parse-js');
const runner = require('../../../src/javascript/runner');
const classMatcher = require('../../../src/javascript/matchers/class');
const visit = require('../../../src/javascript/visit');

const reactExample1 = `class MyComponent extends React.Component {
  render() {
    return (
      <div />
    );
  }
}
`;

const reactExample2 = `class MyComponent extends React.Component {
  constructor() {
    super();
  }

  foo(bar) {
    return 1;
  }

  render() {
    return (
      <div />
    );
  }
}
`;

const nonReactClass = `
class Foo {
  bar() {
    return 1;
  }
}
`;

describe('class matcher', () => {
  it('should find MyComponent', () => {
    expect(runner(parseJS(reactExample1), [
      classMatcher,
    ]).features).toEqual([
      {
        end: 7,
        start: 1,
        type: 'class',
        metadata: {
          react: true,
        },
        jsDoc: {
          description: '',
          tags: [],
        },
        methods: [
          {
            end: 6,
            jsDoc: {
              description: '',
              tags: [],
            },
            kind: 'method',
            name: 'render',
            params: [],
            start: 2,
            type: 'method',
          },
        ],
        name: 'MyComponent',
        superClass: 'Component',
      },
    ]);
  });

  it('should find MyComponent with extras', () => {
    const found = runner(parseJS(reactExample2), [
      classMatcher,
    ]).features;
    expect(found).toEqual([
      {
        end: 15,
        start: 1,
        type: 'class',
        metadata: {
          react: true,
        },
        jsDoc: {
          description: '',
          tags: [],
        },
        methods: [
          {
            end: 8,
            jsDoc: {
              description: '',
              tags: [],
            },
            kind: 'method',
            name: 'foo',
            params: [
              {
                start: 6,
                end: 6,
                name: 'bar',
                type: 'parameter',
              },
            ],
            start: 6,
            type: 'method',
          },
          {
            end: 14,
            jsDoc: {
              description: '',
              tags: [],
            },
            kind: 'method',
            name: 'render',
            params: [],
            start: 10,
            type: 'method',
          },
        ],
        name: 'MyComponent',
        superClass: 'Component',
      },
    ]);

    const foundNodes = [];
    visit(found, (node) => {
      foundNodes.push({
        start: node.start,
        end: node.end,
        type: node.type,
      });
    });
    expect(foundNodes).toEqual([
      {
        start: 1,
        end: 15,
        type: 'class',
      },
      {
        start: 6,
        end: 8,
        type: 'method',
      },
      {
        start: 6,
        end: 6,
        type: 'parameter',
      },
      {
        start: 10,
        end: 14,
        type: 'method',
      },
    ]);
  });

  it('should find a non-react class', () => {
    expect(runner(parseJS(nonReactClass), [
      classMatcher,
    ]).features).toEqual([
      {
        end: 6,
        start: 2,
        type: 'class',
        superClass: undefined,
        metadata: {
        },
        jsDoc: {
          description: '',
          tags: [],
        },
        methods: [
          {
            end: 5,
            jsDoc: {
              description: '',
              tags: [],
            },
            kind: 'method',
            name: 'bar',
            params: [
            ],
            start: 3,
            type: 'method',
          },
        ],
        name: 'Foo',
      },
    ]);
  });
});
