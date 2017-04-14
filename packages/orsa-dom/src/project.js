/* eslint class-methods-use-this: 0 */
const Element = require('./element');
const Constants = require('./constants');

class Project extends Element {
  constructor(orsa, metadata) {
    super(orsa, metadata);
    this.type = Project.TYPE;
    this.setPersistedAttributes([
      'name',
      'localPath',
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
