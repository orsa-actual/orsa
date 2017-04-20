/* eslint class-methods-use-this: 0, no-empty: 0 */

const FileListener = require('orsa-listeners').FileListener;
const assign = require('lodash.assign');
const fs = require('fs');
const docGen = require('react-docgen');

class OrsaJSReactDocgenPlugin extends FileListener {
  constructor(options) {
    super();
    this.options = assign({
      fs,
    }, options);
  }

  shouldProcess(domElement) {
    return domElement.localPath !== undefined;
  }

  process(domElement, cb) {
    let jsText = null;
    try {
      jsText = this.options.fs.readFileSync(domElement.localPath).toString();
    } catch (e) {
      this.orsa.logManager.warn(`Error reading ${domElement.localPath}`);
    }
    if (jsText) {
      let output = null;
      try {
        output = docGen.parse(jsText);
      } catch (e) {
        // Not all files, even in a React project, will be React, so
        // this is not a big deal.
      }
      if (output) {
        domElement.metadata.set('js.docgen', output);
      }
    }
    cb();
  }
}

module.exports = OrsaJSReactDocgenPlugin;
