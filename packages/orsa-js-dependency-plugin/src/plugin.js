/* eslint class-methods-use-this: 0 */

const assign = require('lodash.assign');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const ProjectListener = require('orsa-listeners').ProjectListener;

class OrsaJsDependencyPlugin extends ProjectListener {
  constructor(options) {
    super();
    this.options = assign({
      fs,
      glob,
    }, options);
  }

  shouldProcess(project) {
    return project.metadata.get('projectType') === 'node' &&
      project.metadata.get('builtVersion') === project.version &&
      project.metadata.get('js.packageJSON') &&
      !project.metadata.get('js.modules');
  }

  process(project, cb) {
    const dependencies = project.metadata.get('js.packageJSON').dependencies || {};
    const devDependencies = project.metadata.get('js.packageJSON').devDependencies || {};
    const packages = {};

    this.options.glob.sync('./node_modules/*/package.json', {
      cwd: project.localPath,
    }).forEach((file) => {
      const packagePath = path.resolve(project.localPath, file);
      try {
        const pkg = JSON.parse(
          this.options.fs.readFileSync(packagePath).toString()
        );
        let type = 'indirect';
        let requestedVersion = null;
        if (dependencies[pkg.name]) {
          type = 'direct';
          requestedVersion = dependencies[pkg.name];
        } else if (devDependencies[pkg.name]) {
          type = 'dev';
          requestedVersion = devDependencies[pkg.name];
        }

        packages[pkg.name] = {
          version: pkg.version,
          type,
          requestedVersion,
        };
      } catch (e) {
        this.orsa.logManager.warning(`Could not parse ${packagePath}`);
      }
    });
    project.metadata.set('js.modules', packages);
    cb();
  }
}

module.exports = OrsaJsDependencyPlugin;
