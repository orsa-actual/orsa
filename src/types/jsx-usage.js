const Base = require('./base');

class JSXUsage extends Base {
  constructor(start, end, name, base, attributes) {
    super('jsx-usage', start, end);
    this.name = name;
    this.base = base;
    this.attributes = attributes;
  }

  toObject() {
    return Object.assign(super.toObject(), {
      name: this.name,
      base: this.base,
      attributes: this.attributes,
    });
  }
}

module.exports = JSXUsage;
