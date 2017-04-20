/* eslint class-methods-use-this: 0, quotes: 0, no-param-reassign: 0,
  no-empty: 0, no-confusing-arrow: 0 */

const FileListener = require('orsa-listeners').FileListener;

const {
  runner,
  allMatchers,
  visit,
} = require('orsa-js-analyzer');

const snipppetExtractor = (lines, start, end) =>
  (lines && start < lines.length) ?
    lines.slice(start - 1, end).join("\n") : '';

class OrsaJsLanguagePlugin extends FileListener {
  shouldProcess(domElement) {
    return domElement.metadata.get('js.ast') &&
      domElement.metadata.get('js.lines') &&
      !domElement.metadata.get('js.usages');
  }

  process(domElement, cb) {
    const features = runner(
      domElement.metadata.get('js.ast'),
      allMatchers
    );

    const lines = domElement.metadata.get('js.lines');
    visit(features, (node) => {
      node.snippet = snipppetExtractor(
        lines,
        node.start,
        node.end
      );
    });

    domElement.metadata.set('js.features', features);

    cb();
  }
}

OrsaJsLanguagePlugin.snipppetExtractor = snipppetExtractor;

module.exports = OrsaJsLanguagePlugin;
