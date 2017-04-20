const merge = require('lodash.merge');
const Base = require('./base');

class Import extends Base {
  constructor(start, end, from, keys) {
    super('import', start, end);
    this.from = from;
    this.keys = keys;
  }

  toObject() {
    return merge(super.toObject(), {
      from: this.from,
      keys: this.keys,
    });
  }
}

module.exports = Import;
