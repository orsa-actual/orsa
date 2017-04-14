/* eslint class-methods-use-this: 0 */

const TypeListener = require('./type-listener');
const {
  File,
} = require('orsa-dom');

class FileListener extends TypeListener {
  constructor(matchPattern) {
    super(File.TYPE, matchPattern);
  }

  lockOn(domElement) {
    return domElement.localPath;
  }
}

module.exports = FileListener;
