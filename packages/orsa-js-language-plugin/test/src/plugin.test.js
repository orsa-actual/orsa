/* eslint consistent-return: 0 */
const expect = require('chai').expect;
const Plugin = require('../../src/plugin');
const File = require('orsa-dom').File;
const astParser = require('orsa-ast-parser');

const jsSample = `
require('crazy');
const fs = require('fs');
var foo = require('foo');
module.exports = (fname) => fs.readFileSync(fname).toString();
`;

const simpleReactSample = `
import React from "react";
const { foo, bar } = require('bar');

/**
Foo
@prop title The Title
*/
export default class MyComponent extends React.Component {
  render() {
    return (
      <div>
        Foo
      </div>
    );
  }
}
`;

const statelessComponentSample = `
const Foo = (props) => (
  <div>{props.name}</div>
);
export default Foo;
`;

const createClassSample = `const Bar = React.createClass({
  render: () => {
    return (
      <div>
      </div>
     );
  },
});
`;

const harderReactSample = `
import React from "react";
import My from "my";
import Button from "button";

/**
Foo
@prop title The Title
*/
export default class MyComponent extends React.Component {
  constructor() {
  }
  render(a, b) {
    return (
      <My.Select foo="bar">
        <Button>Foo</Button>
      </My.Select>
    );
  }
}
`;

const classExample = `
const fs = require('fs');
import foo from 'foo';
const {a} = require('painted-dogs');

const bar = fs();

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

const createElement = (js) => {
  const fe = new File();
  const {
    ast,
    lines,
  } = astParser('foo', {
    fs: {
      readFileSync: () => js,
    },
  });
  fe.metadata.set('javascript/ast', ast);
  fe.metadata.set('javascript/lines', lines);
  return fe;
};

describe('orsa js language plugin', () => {
  it('should sort properly', () => {
    expect(Plugin.sortUsages([
      { name: 'a', },
      { name: 'b', },
    ])).to.eql([
      { name: 'a', },
      { name: 'b', },
    ]);
    expect(Plugin.sortUsages([
      { name: 'b', },
      { name: 'a', },
    ])).to.eql([
      { name: 'a', },
      { name: 'b', },
    ]);
    expect(Plugin.sortUsages([
      { name: 'a', startLine: 0, },
      { name: 'a', startLine: 10, },
    ])).to.eql([
      { name: 'a', startLine: 0, },
      { name: 'a', startLine: 10, },
    ]);
    expect(Plugin.sortUsages([
      { name: 'a', startLine: 10, },
      { name: 'a', startLine: 0, },
    ])).to.eql([
      { name: 'a', startLine: 0, },
      { name: 'a', startLine: 10, },
    ]);
    expect(Plugin.sortUsages([
      { name: 'a', startLine: 0, },
      { name: 'a', startLine: 0, },
    ])).to.eql([
      { name: 'a', startLine: 0, },
      { name: 'a', startLine: 0, },
    ]);
  });

  it('should extract snippets', () => {
    expect(Plugin.snipppetExtractor(null, 5, 10)).to.eql('');
    expect(Plugin.snipppetExtractor([
      'a',
      'b',
      'c',
    ], 5, 10)).to.eql('');
    expect(Plugin.snipppetExtractor([
      'a',
      'b',
      'c',
    ], 1, 1)).to.eql('a');
    expect(Plugin.snipppetExtractor([
      'a',
      'b',
      'c',
    ], 1, 2)).to.eql(
`a
b`
    );
    expect(Plugin.snipppetExtractor([
      'a',
      'b',
      'c',
    ], 2, 3)).to.eql(
`b
c`
    );
  });

  it('should not run in the right circumnstances', () => {
    const op = new Plugin();
    const fe = new File();
    expect(op.shouldProcess(fe)).to.not.be.true;
  });

  it('should only run in the right circumnstances', () => {
    const op = new Plugin();
    const fe = createElement(jsSample);
    expect(op.shouldProcess(fe)).to.be.true;
  });

  it('should handle simple files', () => {
    const op = new Plugin();
    const fe = createElement(jsSample);
    op.process(fe, () => {
      expect(fe.metadata.get('react/usages')).to.eql([]);
      expect(fe.metadata.get('react/imports')).to.eql({
        fs: 'fs',
        foo: 'foo',
      });
    });
  });

  it('should handle a simple react file', () => {
    const op = new Plugin();
    const fe = createElement(simpleReactSample);
    op.process(fe, () => {
      expect(fe.metadata.get('react/usages')[0].name).to.eql('div');
      expect(fe.metadata.get('react/imports')).to.eql({
        React: 'react',
        foo: 'bar',
        bar: 'bar',
      });
      expect(fe.metadata.get('react/classes')[0].name).to.eql('MyComponent');
    });
  });

  it('should handle stateless components', () => {
    const op = new Plugin();
    const fe = createElement(statelessComponentSample);
    op.process(fe, () => {
      expect(fe.metadata.get('react/usages')[0].name).to.eql('div');
      expect(fe.metadata.get('react/imports')).to.eql({});
      expect(fe.metadata.get('react/classes')[0].name).to.eql('Foo');
    });
  });

  it('should handle createClass components', () => {
    const op = new Plugin();
    const fe = createElement(createClassSample);
    op.process(fe, () => {
      expect(fe.metadata.get('react/usages')[0].name).to.eql('div');
      expect(fe.metadata.get('react/imports')).to.eql({});
      expect(fe.metadata.get('react/classes')[0].name).to.eql('Bar');
    });
  });

  it('should handle a harder react file', () => {
    const op = new Plugin();
    const fe = createElement(harderReactSample);
    op.process(fe, () => {
      expect(fe.metadata.get('react/usages')[0].name).to.eql('Button');
      expect(fe.metadata.get('react/imports')).to.eql({
        React: 'react',
        My: 'my',
        Button: 'button',
      });
      expect(fe.metadata.get('react/classes')[0].name).to.eql('MyComponent');
      expect(fe.metadata.get('react/classes')[0].reactComponent).to.be.true;
      expect(fe.metadata.get('react/classes')[0].jsDoc).to.eql({
        description: 'Foo',
        tags: [],
      });
    });
  });

  it('should handle a harder react file', () => {
    const op = new Plugin();
    const fe = createElement(classExample);
    op.process(fe, () => {
      expect(fe.metadata.get('react/classes')[0].name).to.eql('Foo');
      expect(
        fe.metadata.get('react/classes')[0].superClass
      ).to.eql('AnotherThing');
      expect(fe.metadata.get('react/classes')[0].methods[0].name).to.eql('pi');
      expect(fe.metadata.get('react/classes')[0].methods[0].kind).to.eql('get');
      expect(fe.metadata.get('react/classes')[0].methods[1].name).to.eql('foo');
      expect(
        fe.metadata.get('react/classes')[0].methods[1].kind
      ).to.eql('method');
      expect(
        fe.metadata.get('react/classes')[0].methods[1].params[0].name
      ).to.eql('a');
    });
  });
});
