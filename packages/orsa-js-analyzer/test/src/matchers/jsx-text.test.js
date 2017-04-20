const expect = require('chai').expect;
const runner = require('../../../src/runner');
const parseJS = require('../parse-js');
const jsxTextMatcher = require('../../../src/matchers/jsx-text');

const text1 = `
import React from 'react';

const MyComp = (props) => (
  <div className="foo">
    FooBar
  </div>
);`;

describe('jsx-text', () => {
  it('should find some text', () => {
    expect(runner(parseJS(text1), [
      jsxTextMatcher,
    ])).to.eql([
      {
        end: 7,
        start: 5,
        type: 'jsx-text',
        text: 'FooBar',
      },
    ]);
  });
});
