/* eslint class-methods-use-this: 0 */

const assign = require('lodash.assign');
const get = require('lodash.get');
const exec = require('child_process').exec;

const ProjectListener = require('orsa-listeners').ProjectListener;

const DEFAULT_BUILD_COMMAND = 'npm install';
const DEFAULT_TEST_COMMAND = 'npm test';

const NAME = 'orsa-js-build-plugin';

class OrsaJsBuildPlugin extends ProjectListener {
  constructor(options) {
    super();
    this.options = assign({
      exec,
    }, options);
  }

  shouldProcess(project) {
    return project.metadata.get('projectType') === 'node' &&
      project.metadata.get('builtVersion') !== project.version;
  }

  runBuild(project, cb) {
    this.options.exec(get(this.config, `${NAME}.buildCommand`, DEFAULT_BUILD_COMMAND),
      {
        cwd: project.localPath,
      },
      (error, stdout, stderr) => {
        if (error) {
          this.orsa.logManager.warning(`${project.name} Project build failed`);
          project.metadata.set('node.build.stdout', stdout);
          project.metadata.set('node.build.stderr', stderr);
          cb(error);
        } else {
          this.orsa.logManager.info(`${project.name} Project build complete`);
          project.metadata.set('node.build.stdout', stdout);
          project.metadata.set('node.build.stderr', stderr);
          cb(null);
        }
      });
  }

  test(project, cb) {
    this.options.exec(get(this.config, `${NAME}.testCommand`, DEFAULT_TEST_COMMAND),
      {
        cwd: project.localPath,
      },
      (error, stdout, stderr) => {
        if (error) {
          this.orsa.logManager.warning(`${project.name} Project test failed`);
          project.metadata.set('node.test.stdout', stdout);
          project.metadata.set('node.test.stderr', stderr);
          cb(error);
        } else {
          this.orsa.logManager.info(`${project.name} Project test complete`);
          project.metadata.set('node.test.stdout', stdout);
          project.metadata.set('node.test.stderr', stderr);
          cb(null);
        }
      });
  }

  process(project, cb) {
    project.metadata.set('js.modules', null);
    this.runBuild(project, (err) => {
      if (!err) {
        this.test(project, () => {
          project.metadata.set('builtVersion', project.version);
          cb();
        });
      } else {
        cb();
      }
    });
  }
}

module.exports = OrsaJsBuildPlugin;
