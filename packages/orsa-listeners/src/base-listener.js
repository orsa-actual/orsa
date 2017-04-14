/* eslint class-methods-use-this: 0 */
const isFunction = require('lodash.isfunction');

class BaseListener {
  constructor() {
    this.config = {};
    this.orsa = null;
  }

  listenFor(eventName, arg1, arg2) {
    let matchPattern = null;
    let callback = null;
    if (isFunction(arg1)) {
      callback = arg1;
    } else {
      matchPattern = arg1;
      callback = arg2;
    }
    this.orsa.on(eventName, (orsa, domObject, info) => {
      if (matchPattern) {
        if (domObject.match(matchPattern)) {
          callback(domObject, info);
        }
      } else {
        callback(domObject, info);
      }
    });
  }

  initialize(orsa, config) {
    this.orsa = orsa;
    this.config = config;
  }

  setup() {
  }

  scan() {
  }

  index() {
  }

  summarize() {
  }

  shutdown() {
  }

  addTask(text, cb) {
    this.orsa.taskManager.add(`${this.constructor.name}: ${text}`, cb);
  }

  logInfo(text) {
    this.orsa.logManager.info(`${this.constructor.name}: ${text}`);
  }

  logWarning(text) {
    this.orsa.logManager.warning(`${this.constructor.name}: ${text}`);
  }

  logError(text) {
    this.orsa.logManager.error(`${this.constructor.name}: ${text}`);
  }
}
BaseListener.version = 1;

module.exports = BaseListener;
