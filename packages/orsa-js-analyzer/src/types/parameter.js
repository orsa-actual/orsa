const merge = require('lodash.merge');
const Base = require('./base');

class Parameter extends Base {
  constructor(start, end, name) {
    super('parameter', start, end);
    this.name = name;
  }

  toObject() {
    return merge(super.toObject(), {
      name: this.name,
    });
  }
}

module.exports = Parameter;
