/* eslint class-methods-use-this: 0 */

const BaseListener = require('./base-listener');
const {
  MetaData,
  Base,
  ElementSet,
} = require('orsa-dom');
const merge = require('lodash.merge');

class TypeListener extends BaseListener {
  constructor(name, type, matchPattern) {
    super(name);
    this.matchPattern = merge({
      type,
      matchPattern,
    });
  }

  matchedEvent(/* evtName, domElement, info */) {
  }

  setup() {
    super.setup();
    const cb = (evtName, domElement, info) => {
      this.matchedEvent(evtName, domElement, info);
    };
    this.listenFor(Base.CHANGED, cb);
    this.listenFor(MetaData.UPDATE, cb);
    this.listenFor(MetaData.DELETE, cb);
    this.listenFor(ElementSet.ADD, cb);
  }
}

module.exports = TypeListener;
