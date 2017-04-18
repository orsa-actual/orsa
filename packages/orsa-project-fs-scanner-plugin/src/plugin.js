const BaseListener = require('orsa-listeners').BaseListener;
const fs = require('fs');
const path = require('path');
const {
  Project,
} = require('orsa-dom');
const assign = require('lodash.assign');

const NAME = 'orsa-project-fs-scanner-plugin';

class OrsaProjectFsScannerPlugin extends BaseListener {
  constructor(options = {}) {
    super();
    this.options = assign({
      fs,
    }, options);
  }

  scan() {
    if (this.config[NAME] && this.config[NAME].path) {
      this.addTask(`scanning ${this.config[NAME].path}`, (done) => {
        this.options.fs.readdirSync(this.config[NAME].path).forEach((name) => {
          const npath = path.resolve(this.config[NAME].path, name);
          if (this.options.fs.statSync(npath).isDirectory()) {
            const project = new Project(this.orsa);
            project.localPath = npath;
            project.name = name;
            this.orsa.children.add(project);
          }
        });
        done();
      });
    } else {
      this.logWarn('No path in the configuration');
    }
  }
}

module.exports = OrsaProjectFsScannerPlugin;
