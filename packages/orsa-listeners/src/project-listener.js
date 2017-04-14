/* eslint class-methods-use-this: 0 */
const TypeListener = require('./type-listener');
const {
  Project,
} = require('orsa-dom');

class ProjectListener extends TypeListener {
  constructor(matchPattern) {
    super(Project.TYPE, matchPattern);
  }

  lockOn(domElement) {
    return domElement.localPath;
  }

  findTarget(domElement) {
    if (domElement.type === Project.TYPE) {
      return domElement;
    }
    if (domElement.project) {
      return domElement.project;
    }
    return null;
  }
}

module.exports = ProjectListener;
