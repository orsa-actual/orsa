/* eslint class-methods-use-this: 0, no-param-reassign: 0 */

const path = require('path');
const assign = require('lodash.assign');
const glob = require('glob');
const fs = require('fs');

const ProjectListener = require('orsa-listeners').ProjectListener;
const File = require('orsa-dom').File;

const astParser = require('orsa-ast-parser');

const LOCATIONS = [
  'src/**/*.js',
  'src/**/*.jsx',
  'index.js',
];
const IGNORE = [
  '**/*.test.js',
];
const JS_TYPE = 'text/javascript';

class OrsaNodeProjectPluginSourceFinder extends ProjectListener {
  constructor(options = {}) {
    super({});
    this.options = assign({
      glob,
      fs,
    }, options);
  }

  shouldProcess(domElement) {
    return domElement.metadata.get('versionChanged') &&
      !domElement.metadata.get('sourceFinderCompleted');
  }

  process(domElement, cb) {
    if (domElement.localPath) {
      (this.config.locations || LOCATIONS).forEach((location) => {
        const files = this.options.glob.sync(location, {
          cwd: domElement.localPath,
          ignore: (this.config.ignore || IGNORE),
        });

        files.forEach((file) => {
          const localPath = path.join(domElement.localPath, file);

          const { error, ast, lines, } = astParser(localPath, this.options);

          if (error) {
            this.orsa.logManager.warning(`Unable to parse ${file}`);
          }

          const fileElement = new File(domElement);
          fileElement.mimeType = JS_TYPE;
          fileElement.localPath = localPath;
          fileElement.relativePath = file;
          fileElement.name = file;
          domElement.children.add(fileElement);

          fileElement.metadata.set('javascript/ast', ast, {
            temporary: true,
          });
          fileElement.metadata.set('javascript/lines', lines, {
            temporary: true,
          });
        });
      });

      domElement.metadata.set('sourceFinderCompleted', true, {
        temporary: true,
      });
    }
    cb();
  }
}

OrsaNodeProjectPluginSourceFinder.JS_TYPE = JS_TYPE;

module.exports = OrsaNodeProjectPluginSourceFinder;
