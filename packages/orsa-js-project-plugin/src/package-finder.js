/* eslint class-methods-use-this: 0, no-param-reassign: 0 */

const ProjectListener = require('orsa-listeners').ProjectListener;
const fs = require('fs');
const path = require('path');
const assign = require('lodash.assign');

class OrsaNodeProjectPluginPackageFinder extends ProjectListener {
  constructor(options = {}) {
    super({});
    this.options = assign({
      fs,
    }, options);
  }

  shouldProcess(domElement) {
    return !domElement.metadata.get('projectType');
  }

  parsePackage(file) {
    let pkg = null;
    try {
      pkg = JSON.parse(this.options.fs.readFileSync(file));
    } catch (e) {
      this.orsa.logManager.warning(`Couldn't parse package.json: ${file}`);
    }
    return pkg;
  }

  process(domElement, cb) {
    if (domElement.localPath) {
      const packageLocation = path.join(domElement.localPath, 'package.json');
      if (this.options.fs.existsSync(packageLocation)) {
        const pkg = this.parsePackage(packageLocation);
        if (pkg) {
          const versionChanged = domElement.version !== pkg.version;
          domElement.metadata.set('versionChanged',
            versionChanged,
            { temporary: true, }
          );
          domElement.version = pkg.version;
          domElement.metadata.set('js.packageJSON', pkg, {
            temporary: true,
          });
          domElement.metadata.set('projectType', 'node');
        }
      }
    }
    cb();
  }
}

module.exports = OrsaNodeProjectPluginPackageFinder;
