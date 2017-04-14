/* eslint global-require: 0 */
const {
  RootElement,
} = require('orsa-dom');
const OrsaPlugins = require('./plugins');
const Tasks = require('./tasks');
const async = require('async');
const assign = require('lodash.assign');
const flatten = require('lodash.flatten');
const isArray = require('lodash.isarray');

class OrsaCore extends RootElement {
  constructor(config = {}, options = {}) {
    super();

    this.plugins = new OrsaPlugins(this);
    this.config = config;
    this.options = assign({
      console,
      require,
    }, options);

    this.taskManager = new Tasks();

    this.runError = null;

    /* eslint no-console: 0 */
    this.logManager = {
      warning: (text) => {
        this.options.console.log('warning', text);
      },
      error: (text) => {
        this.runError = text;
        this.options.console.log('error', text);
      },
      info: (text) => {
        this.options.console.log('info', text);
      },
    };

    this.plugins.on(OrsaPlugins.CREATE, (plugin) => {
      if (plugin.initialize) {
        plugin.initialize(this, this.config);
      }
    });

    this.loadPlugins(flatten(this.config.plugins));
  }

  loadPlugins(plugins) {
    plugins.forEach(plugin => this.loadPlugin(plugin));
  }

  loadPlugin(pl) {
    if (pl.version) {
      this.plugins.add(pl);
    } else {
      try {
        const plugins = this.options.require(pl);
        if (isArray(plugins)) {
          plugins.forEach((plugin) => {
            this.plugins.add(plugin);
          });
        } else {
          this.plugins.add(plugins);
        }
      } catch (e) {
        this.logManager.error(e.toString());
      }
    }
  }

  run(cb) {
    async.series([
      done => this.runStep('setup', done),
      done => this.runStep('scan', done),
      done => this.runStep('index', done),
      done => this.runStep('summarize', done),
      done => this.runStep('shutdown', done),
    ], () => {
      cb(this.runError);
    });
  }

  runStep(name, done) {
    if (!this.runError) {
      this.emit(OrsaCore.PHASE_START, name);
      this.plugins.invoke(name);
      const finishedCb = () => {
        this.emit(OrsaCore.PHASE_END, name);
        this.taskManager.removeListener(Tasks.FINISHED, finishedCb);
        done();
      };
      this.taskManager.on(Tasks.FINISHED, finishedCb);
      this.taskManager.start();
    } else {
      done();
    }
  }
}

OrsaCore.PHASE_START = 'OrsaCore.PHASE_START';
OrsaCore.PHASE_END = 'OrsaCore.PHASE_END';

OrsaCore.version = '0.0.3';

module.exports = OrsaCore;
