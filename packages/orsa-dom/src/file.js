const Element = require('./element');
const Constants = require('./constants');

class File extends Element {
  constructor(parent, metadata) {
    super(parent, metadata);
    this.type = File.TYPE;
    this.setPersistedAttributes([
      'localPath',
      'relativePath',
      'name',
      'mimeType',
    ]);
  }

  get project() {
    let parent = this.parent;
    while (parent) {
      if (parent.type === Constants.Project) {
        break;
      }
      parent = parent.parent;
    }
    return parent;
  }
}

File.TYPE = Constants.File;

module.exports = File;
