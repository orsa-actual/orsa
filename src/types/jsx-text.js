const Base = require('./base');

class JSXText extends Base {
  constructor(start, end, text) {
    super('jsx-text', start, end);
    this.text = text;
  }

  toObject() {
    return Object.assign(super.toObject(), {
      text: this.text,
    });
  }
}

module.exports = JSXText;
