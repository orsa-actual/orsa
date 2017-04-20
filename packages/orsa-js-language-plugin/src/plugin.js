/* eslint class-methods-use-this: 0, quotes: 0, no-param-reassign: 0,
  no-empty: 0, no-confusing-arrow: 0 */

const FileListener = require('orsa-listeners').FileListener;
const assign = require('lodash.assign');

const {
  runner,
  allMatchers,
  visit,
} = require('orsa-js-analyzer');

const snipppetExtractor = (lines, start, end) =>
  (lines && start < lines.length) ?
    lines.slice(start - 1, end).join("\n") : '';

class OrsaJsLanguagePlugin extends FileListener {
  constructor(options) {
    super();
    this.options = assign({
      runner,
    }, options);
  }
  shouldProcess(domElement) {
    return domElement.metadata.get('js.ast') &&
      domElement.metadata.get('js.lines') &&
      !domElement.metadata.get('js.usages');
  }

  process(domElement, cb) {
    const found = this.options.runner(
      domElement.metadata.get('js.ast'),
      allMatchers
    );

    if (found.errors.length > 0) {
      this.orsa.logManager.warn(
        `${found.errors.length} errors while analyzing: ${domElement.name}`
      );
    }

    const lines = domElement.metadata.get('js.lines');
    visit(found.features, (node) => {
      node.snippet = snipppetExtractor(
        lines,
        node.start,
        node.end
      );
    });

    domElement.metadata.set('js.features', found.features);

    cb();
  }
}

OrsaJsLanguagePlugin.snipppetExtractor = snipppetExtractor;

module.exports = OrsaJsLanguagePlugin;
