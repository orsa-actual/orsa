/* eslint class-methods-use-this: 0, no-empty: 0 */

const FileListener = require('orsa-listeners').FileListener;
const assign = require('lodash.assign');
const fs = require('fs');
const docGen = require('react-docgen');
const keys = require('lodash.keys');
const merge = require('lodash.merge');

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

        /*
        Docgen uses the user generated param names as keys on `props` and
        while that's convenient it screws up downstream systems. So we'll
        coerce that into an array and turn the key into `name`.
        */
        if (output && output.props) {
          const newProps = [];
          keys(output.props).forEach((name) => {
            newProps.push(merge(output.props[name], {
              name,
            }));
          });
          output.props = newProps;
        }
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
