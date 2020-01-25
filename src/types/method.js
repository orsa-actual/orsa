const Base = require('./base');

class Method extends Base {
  constructor(start, end, name, kind) {
    super('method', start, end);
    this.name = name;
    this.kind = kind;
    this.params = [];
    this.jsDoc = null;
  }

  toObject() {
    return Object.assign(super.toObject(), {
      name: this.name,
      kind: this.kind,
      params: this.params.map((p) => p.toObject()),
      jsDoc: this.jsDoc,
    });
  }
}

module.exports = Method;
