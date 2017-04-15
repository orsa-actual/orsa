/* eslint class-methods-use-this: 0 */
const Element = require('./element');
const Constants = require('./constants');

class Project extends Element {
  constructor(parent, metadata) {
    super(parent, metadata);
    this.type = Project.TYPE;
    this.setPersistedAttributes([
      'name',
      'localPath',
      'version',
    ]);
  }

  get childrenSetOptions() {
    return {
      identityMatchers: [
        (a, b) => (
          a.type === Constants.File &&
          b.type === Constants.File &&
          a.relativePath === b.relativePath
        ),
      ],
    };
  }
}

Project.TYPE = Constants.Project;

module.exports = Project;
