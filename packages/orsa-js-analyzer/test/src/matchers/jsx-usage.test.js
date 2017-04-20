const expect = require('chai').expect;
const runner = require('../../../src/runner');
const parseJS = require('../parse-js');
const jsxUsageMatcher = require('../../../src/matchers/jsx-usage');

const usage1 = `
import React from 'react';

const MyComp = (props) => (
  <div className="foo">
    {props.children}
  </div>
);`;

const usage2 = `
import React from 'react';

const MyComp = (props) => (
  <Foo.Bar className="foo">
    {props.children}
  </Foo.Bar>
);`;

describe('jsx-usage', () => {
  it('should find a component usage', () => {
    expect(runner(parseJS(usage1), [
      jsxUsageMatcher,
    ]).features).to.eql([
      {
        end: 7,
        start: 5,
        type: 'jsx-usage',
        name: 'div',
        base: 'div',
        attributes: [
          'className',
        ],
      },
    ]);
  });

  it('should find a component usage with a base', () => {
    expect(runner(parseJS(usage2), [
      jsxUsageMatcher,
    ]).features).to.eql([
      {
        end: 7,
        start: 5,
        type: 'jsx-usage',
        name: 'Foo.Bar',
        base: 'Foo',
        attributes: [
          'className',
        ],
      },
    ]);
  });
});
