/* eslint class-methods-use-this: 0, no-unused-vars: 0 */

const BaseListener = require('./base-listener');
const {
  MetaData,
  Base,
  ElementSet,
} = require('orsa-dom');
const merge = require('lodash.merge');

class TypeListener extends BaseListener {
  constructor(type, matchPattern) {
    super();
    this.type = type;
    this.matchPattern = merge({
      type,
    }, matchPattern);
    this.locks = {};
  }

  shouldProcess(domElement) {
    return true;
  }

  get processName() {
    return 'process';
  }

  process(domElement, callback) {
  }

  findTarget(domElement) {
    return domElement;
  }

  lockOn(domElement) {
    return domElement.name;
  }

  matchedEvent(evtName, domElement, info) {
    const target = this.findTarget(domElement);
    const lockValue = this.lockOn(target);
    if (target && !this.locks[lockValue] && this.shouldProcess(target)) {
      this.locks[lockValue] = true;
      this.orsa.taskManager.add(this.processName,
        cb => this.process(target, () => {
          delete this.locks[lockValue];
          cb();
        })
      );
    }
  }

  setup() {
    super.setup();
    const cb = (evtName, domElement, info) => {
      this.matchedEvent(evtName, domElement, info);
    };
    this.listenFor(Base.CHANGED, this.matchPattern,
      (domElement, info) => cb(Base.CHANGED, domElement, info));
    this.listenFor(MetaData.UPDATE, this.matchPattern,
      (domElement, info) => cb(MetaData.UPDATE, domElement, info));
    this.listenFor(MetaData.DELETE, this.matchPattern,
      (domElement, info) => cb(MetaData.DELETE, domElement, info));
    this.listenFor(ElementSet.ADD, this.matchPattern,
      (domElement, info) => cb(ElementSet.ADD, domElement, info));
  }
}

module.exports = TypeListener;
