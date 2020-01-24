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

const textWithWhiteSpace = `
import React from 'react';

const MyComp = (props) => (
<div className="foo">     </div>
);`;

describe('jsx-text', () => {
  it('should find some text', () => {
    expect(runner(parseJS(text1), [
      jsxTextMatcher,
    ]).features).to.eql([
      {
        end: 7,
        start: 5,
        type: 'jsx-text',
        text: 'FooBar',
      },
    ]);
  });

  it('should find no text when big whitespace', () => {
    expect(runner(parseJS(textWithWhiteSpace), [
      jsxTextMatcher,
    ]).features).to.eql([
    ]);
  });
});
