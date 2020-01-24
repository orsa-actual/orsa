const Base = require('./base');

class ClassDefinition extends Base {
  constructor(start, end, name, metadata = {}) {
    super('class', start, end);
    this.name = name;
    this.metadata = metadata;
    this.methods = [];
    this.superClass = null;
    this.jsDoc = null;
  }

  toObject() {
    return Object.assign(super.toObject(), {
      name: this.name,
      metadata: this.metadata,
      methods: this.methods.map((m) => m.toObject()),
      superClass: this.superClass,
      jsDoc: this.jsDoc,
    });
  }
}

module.exports = ClassDefinition;
