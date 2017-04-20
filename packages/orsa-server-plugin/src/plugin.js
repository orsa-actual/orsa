const BaseListener = require('orsa-listeners').BaseListener;
const request = require('request');
const assign = require('lodash.assign');
const merge = require('lodash.merge');
const async = require('async');
const {
  Project,
  File,
} = require('orsa-dom');
const uuidV4 = require('uuid/v4');

const NAME = 'orsa-server-plugin';

class OrsaServerPlugin extends BaseListener {
  constructor(options) {
    super();
    this.options = assign({
      request,
      uuidV4,
    }, options);
    this.dataPackets = [];
    this.uuid = null;
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
        this.signal('beforeProject', child.name);
        this.addProject(child);
      }
      if (child.type === File.TYPE) {
        this.addFile(child);
      }

      /* istanbul ignore next */
      if (child.children) {
        this.traverse(child.children);
      }

      if (child.type === Project.TYPE) {
        this.signal('afterProject', child.name);
      }
    });
  }

  signal(signal, name) {
    this.dataPackets.push({
      runID: this.uuid,
      signal,
      name,
    });
  }

  shutdown() {
    this.addTask('post to server', (cb) => {
      this.uuid = this.options.uuidV4();
      this.dataPackets = [];

      this.signal('startRun');
      this.traverse(this.orsa.children);
      this.signal('endRun');

      async.eachSeries(this.dataPackets, (item, done) => {
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
      }, () => {
        cb();
      });
    });
  }
}

module.exports = OrsaServerPlugin;
