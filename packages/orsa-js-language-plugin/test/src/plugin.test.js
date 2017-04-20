/* eslint consistent-return: 0 */
const expect = require('chai').expect;
const Plugin = require('../../src/plugin');
const File = require('orsa-dom').File;
const astParser = require('orsa-ast-parser');

const jsSample = `
require('crazy');
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
  fe.metadata.set('js.ast', ast);
  fe.metadata.set('js.lines', lines);
  return fe;
};

describe('orsa js language plugin', () => {
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
      expect(fe.metadata.get('js.features')[0]).to.include(
        {
          start: 2,
          end: 2,
          type: 'import',
          from: 'crazy',
        }
      );
      expect(
        fe.metadata.get('js.features')[0].snippet.match(/require/)
      ).to.not.be.null;
    });
  });
});
