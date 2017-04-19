const BaseListener = require('orsa-listeners').BaseListener;
const request = require('request');
const assign = require('lodash.assign');
const merge = require('lodash.merge');
const async = require('async');
const {
  Project,
  File,
} = require('orsa-dom');

const NAME = 'orsa-server-plugin';

class OrsaServerPlugin extends BaseListener {
  constructor(options) {
    super();
    this.options = assign({
      request,
    }, options);
    this.dataPackets = [];
  }

  addFile(node) {
    this.dataPackets.push(merge(node.toObject(),
      {
        project: node.project.name,
      }
    ));
  }

  addProject(node) {
    this.dataPackets.push(assign(node.toObject(),
      {
        children: node.children.toArray().map(c => (
          {
            name: c.name,
            localPath: c.localPath,
          }
        )),
      }
    ));
  }

  traverse(children) {
    children.toArray().forEach((child) => {
      if (child.type === Project.TYPE) {
        this.addProject(child);
      }
      if (child.type === File.TYPE) {
        this.addFile(child);
      }

      /* istanbul ignore next */
      if (child.children) {
        this.traverse(child.children);
      }
    });
  }

  shutdown() {
    this.addTask('post to server', (cb) => {
      this.dataPackets = [];
      this.traverse(this.orsa.children);
      async.forEach(this.dataPackets, (item, done) => {
        if (this.config[NAME] && this.config[NAME].url) {
          this.options.request.post(
            this.config[NAME].url,
            {
              body: item,
              json: true,
            }
          ).on('response', () => {
            done();
          })
          .on('error', (err) => {
            this.orsa.logManager.warn(
              `Error on posting to ${this.config[NAME].url}: ${err}`
            );
            done();
          });
        } else {
          done();
        }
      }, () => cb());
    });
  }
}

module.exports = OrsaServerPlugin;
